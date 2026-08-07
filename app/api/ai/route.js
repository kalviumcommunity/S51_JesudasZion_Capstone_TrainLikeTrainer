import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import User from '@/lib/models/User';
import Sport from '@/lib/models/Sport';
import Conversation from '@/lib/models/Conversation';
import { normalizeMemory, extractFacts, mergeMemory } from '@/lib/coachMemory';

export const dynamic = 'force-dynamic';

// Tried in order. `gemini-flash-latest` is an alias that tracks the current
// flash model, so it keeps working as Google retires specific versions —
// `gemini-2.5-flash` now 404s on newer keys, which is exactly the failure this
// list exists to survive.
const MODEL_NAMES = [
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-3-flash-preview',
  'gemini-2.0-flash',
];

// How much prior conversation to replay. Enough for the coach to follow a
// thread without resending an unbounded history on every turn.
const HISTORY_TURNS = 12;

function buildFallback(sport, prompt) {
  return `### 🏋️ General ${sport && sport !== 'All' ? sport : 'Sports'} Training Protocol

**Your question:** ${prompt}

---

#### 1. Dynamic Warm-Up (5 mins)
* **High knees & butt kicks** — 2 sets x 30 seconds
* **Hip openers & leg swings** — 10 reps each leg

#### 2. Position-Specific Work (15 mins)
* **Volume** — 4 sets of 8 explosive reps
* **Cue** — scan the field before you receive, not after

#### 3. Recovery
* Rehydrate with electrolytes and take 25–30g of protein within 45 minutes of finishing.`;
}

/**
 * Resolves the athlete's stored drill ids into real drill titles, so the coach
 * can refer to work they have actually done rather than to opaque slugs.
 */
async function describeTraining(user) {
  const completed = user.completedDrills || [];
  const saved = user.savedDrills || [];
  if (completed.length === 0 && saved.length === 0) return null;

  const sports = await Sport.find({}).lean();
  const index = {};
  for (const sport of sports) {
    for (const position of sport.positions || []) {
      for (const drill of position.drills || []) {
        index[drill.id] = `${drill.title} (${sport.name}, ${position.name})`;
      }
    }
  }

  const name = (id) => index[id] || id;
  return {
    completed: completed.map(name),
    saved: saved.map(name),
  };
}

function buildSystemPrompt({ user, training, sport, memory }) {
  const lines = [
    'You are TrainBot, the athlete\'s personal coach inside the Train Like A Trainer app.',
    'Write in clean markdown: short paragraphs, bullets, clear headings, durations and concrete coaching cues.',
    'Be specific and practical. Prefer naming real drills and rep schemes over generic encouragement.',
    'If the athlete asks about pain rather than normal training soreness, tell them to stop and see a physio. Do not give medical or rehab advice.',
  ];

  if (user) {
    const profile = [];
    if (user.name) profile.push(`Name: ${user.name.split(' ')[0]}`);
    if (user.primarySport) profile.push(`Main sport: ${user.primarySport}`);
    if (user.position) profile.push(`Position: ${user.position}`);
    if (user.level) profile.push(`Self-rated level: ${user.level}`);
    if (typeof user.xpPoints === 'number') profile.push(`XP earned in-app: ${user.xpPoints}`);
    if (user.streakDays) profile.push(`Current training streak: ${user.streakDays} days`);

    if (profile.length) {
      lines.push('', '## Who you are coaching', profile.join('\n'));
    }
  }

  if (sport && sport !== 'All') {
    lines.push('', `The athlete has set the current question's sport context to: ${sport}.`);
  }

  if (training?.completed?.length) {
    lines.push(
      '',
      '## Drills they have already completed in the app',
      training.completed.map((d) => `- ${d}`).join('\n'),
      'Build on these rather than re-teaching them. You may reference them by name.'
    );
  }

  if (training?.saved?.length) {
    lines.push(
      '',
      '## Drills they bookmarked but have not completed',
      training.saved.map((d) => `- ${d}`).join('\n')
    );
  }

  if (memory?.length) {
    lines.push(
      '',
      '## What you know about this athlete',
      memory.map((m) => `- ${m.text}`).join('\n'),
      'Respect these in every answer. If one conflicts with your advice, say so plainly.'
    );
  }

  if (!user) {
    lines.push(
      '',
      'This athlete is not signed in, so you have no training history for them. Do not invent one. If personalised advice would need it, say a single short line inviting them to sign in.'
    );
  }

  return lines.join('\n');
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { prompt, sport, conversationId } = payload;

  if (!prompt || !prompt.trim()) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const email = session?.user?.email || null;

  let user = null;
  let training = null;
  let conversation = null;
  let history = [];

  // Personalisation is best-effort: a database problem must not stop the
  // athlete getting an answer.
  if (email) {
    try {
      const conn = await connectToDatabase();
      if (conn) {
        user = await User.findOne({ email }).lean();
        if (user) training = await describeTraining(user);

        if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
          conversation = await Conversation.findOne({ _id: conversationId, userEmail: email });
        }
        if (!conversation) {
          conversation = new Conversation({
            userEmail: email,
            // The first question becomes the thread title.
            title: prompt.trim().slice(0, 70),
            sport: sport || 'All',
          });
        }

        history = conversation.messages.slice(-HISTORY_TURNS);
      }
    } catch (err) {
      console.error('AI personalisation lookup failed:', err);
    }
  }

  const systemPrompt = buildSystemPrompt({
    user,
    training,
    sport,
    memory: normalizeMemory(user?.coachMemory),
  });

  const transcript = history
    .map((m) => `${m.role === 'user' ? 'Athlete' : 'Coach'}: ${m.content}`)
    .join('\n\n');

  const fullPrompt = [
    systemPrompt,
    transcript ? `\n## Conversation so far\n${transcript}` : '',
    `\nAthlete: ${prompt}`,
    '\nCoach:',
  ].join('\n');

  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  let responseText = null;
  let usedModel = null;

  if (apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    for (const modelName of MODEL_NAMES) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        if (text) {
          responseText = text;
          usedModel = modelName;
          break;
        }
      } catch (mErr) {
        console.warn(`Gemini model ${modelName} failed: ${mErr?.message}`);
      }
    }
  }

  const isFallback = !responseText;
  const finalText = responseText || buildFallback(sport, prompt);

  // Persist the exchange so the thread survives a reload.
  let savedConversationId = null;
  if (conversation) {
    try {
      conversation.messages.push(
        { role: 'user', content: prompt.trim(), createdAt: new Date() },
        { role: 'ai', content: finalText, isFallback, createdAt: new Date() }
      );
      conversation.updatedAt = new Date();
      await conversation.save();
      savedConversationId = conversation._id.toString();
    } catch (err) {
      console.error('Failed to save conversation:', err);
    }
  }

  // Pick up anything durable the athlete just told us — an injury, the kit
  // they own, how many evenings a week they can train — so the coach does not
  // have to be told the same thing twice. Only runs when a real answer was
  // produced; there is nothing to learn from a canned fallback exchange.
  let learned = [];
  if (user && !isFallback) {
    try {
      const existing = normalizeMemory(user.coachMemory);
      learned = await extractFacts({ apiKey, userMessage: prompt, existing });

      if (learned.length > 0) {
        await User.updateOne(
          { email },
          { $set: { coachMemory: mergeMemory(existing, learned) } }
        );
      }
    } catch (err) {
      // Never fail the athlete's answer because memory bookkeeping broke.
      console.error('Memory update failed:', err);
    }
  }

  return NextResponse.json({
    response: finalText,
    conversationId: savedConversationId,
    personalised: Boolean(user),
    // The UI surfaces these so the athlete always sees what was just stored.
    learned: learned.map((f) => f.text),
    source: isFallback ? 'fallback' : 'gemini',
    model: usedModel,
    ...(isFallback && {
      fallback: true,
      reason: apiKey
        ? 'The AI service could not be reached, so this is a generic template rather than a personalised answer.'
        : 'GEMINI_API_KEY is not configured, so this is a generic template rather than a personalised answer.',
    }),
  });
}
