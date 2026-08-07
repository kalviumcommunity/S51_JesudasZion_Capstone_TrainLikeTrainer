import { GoogleGenerativeAI } from '@google/generative-ai';

// Extraction is a small structured task, so it runs on a lite model. Listed in
// fallback order for the same reason as the chat models: specific versions get
// retired, the `-latest` aliases do not.
const EXTRACTION_MODELS = ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];

export const MAX_FACTS = 20;
export const MAX_FACT_LENGTH = 160;

/**
 * Tolerates the older `coachMemory: [String]` shape as well as the current
 * `[{ text, source }]`, so existing rows keep working without a migration.
 */
export function normalizeMemory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) =>
      typeof entry === 'string'
        ? { text: entry, source: 'you', createdAt: null }
        : { text: entry?.text, source: entry?.source || 'you', createdAt: entry?.createdAt || null }
    )
    .filter((e) => e.text);
}

const normalise = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

/** True if `candidate` says substantially the same thing as something already known. */
function isDuplicate(candidate, existing) {
  const c = normalise(candidate);
  if (!c) return true;
  return existing.some((e) => {
    const x = normalise(e.text);
    return x === c || x.includes(c) || c.includes(x);
  });
}

/**
 * Asks the model to pull durable facts about the athlete out of what they just
 * said. Deliberately conservative: it is far worse to store a hallucinated
 * injury than to miss one, so the prompt demands verbatim grounding and the
 * result is filtered again here.
 */
export async function extractFacts({ apiKey, userMessage, existing }) {
  if (!apiKey || !userMessage?.trim()) return [];

  const prompt = `You maintain a small memory about an athlete using a sports training app.

Read ONLY the athlete's latest message and extract durable facts worth remembering for future coaching sessions.

Remember ONLY:
- injuries, pain history, physical limitations
- equipment they have or lack
- training goals and target events, with dates if given
- schedule constraints (days/times per week they can train)
- their sport, position, level, age, or how long they have played
- strong stated preferences or dislikes about training

Do NOT remember:
- one-off questions or anything they merely asked about
- anything you inferred, assumed, or that is not stated in their message
- temporary states ("I'm tired today")
- facts already known (listed below)

Already known:
${existing.length ? existing.map((e) => `- ${e.text}`).join('\n') : '- (nothing yet)'}

Athlete's latest message:
"""
${userMessage}
"""

Return ONLY a JSON array of short third-person strings, each under 140 characters, e.g.
["Recovering from a left ankle sprain", "Trains three evenings a week"]
If there is nothing durable to remember, return exactly: []`;

  let text = null;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    for (const modelName of EXTRACTION_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        text = result.response.text().trim();
        if (text) break;
      } catch (mErr) {
        console.warn(`Memory extraction model ${modelName} failed: ${mErr?.message}`);
      }
    }
    if (!text) return [];

    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];

    const accepted = [];
    for (const item of parsed) {
      if (typeof item !== 'string') continue;
      const fact = item.trim();
      if (!fact || fact.length > MAX_FACT_LENGTH) continue;
      if (isDuplicate(fact, [...existing, ...accepted])) continue;
      accepted.push({ text: fact, source: 'coach', createdAt: new Date() });
      // At most a couple per turn, so memory grows slowly and stays readable.
      if (accepted.length === 2) break;
    }
    return accepted;
  } catch (err) {
    console.warn('Memory extraction failed:', err?.message);
    return [];
  }
}

/** Adds new facts, keeping the athlete's own entries when trimming to the cap. */
export function mergeMemory(existing, additions) {
  const merged = [...existing, ...additions];
  if (merged.length <= MAX_FACTS) return merged;

  const mine = merged.filter((e) => e.source === 'you');
  const theirs = merged.filter((e) => e.source !== 'you');
  // Drop the oldest coach-inferred facts first.
  return [...mine, ...theirs.slice(-(MAX_FACTS - mine.length))].slice(-MAX_FACTS);
}
