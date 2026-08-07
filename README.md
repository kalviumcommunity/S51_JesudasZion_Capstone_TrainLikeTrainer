# Train Like a Trainer

**Live:** https://capestone-two.vercel.app

A sports drill library organised the way a coach works — by sport, by position, and by the
specific thing you're trying to fix.

Most training content online is an endless feed of clips. This is the other approach: pick your
sport, pick your position, and get the drills that actually apply to your role. A striker's
finishing work isn't a centre-back's, and a libero's platform isn't a setter's hands.

## Contents

- [What's in it](#whats-in-it)
- [How a drill is written](#how-a-drill-is-written)
- [Tech stack](#tech-stack)
- [Running it locally](#running-it-locally)
- [Seeding the database](#seeding-the-database)
- [API reference](#api-reference)
- [Project structure](#project-structure)
- [Contact](#contact)

## What's in it

**7 sports · 23 positions · 56 drills · 7 courses**

Football, Basketball, Tennis, Cricket, Badminton, Volleyball, and Fitness & Conditioning.

- **Drill library** — every drill has a real demonstration video, equipment list, difficulty,
  duration and rep scheme.
- **Courses** — each sport also has a full multi-week program with modules per position and a
  lesson player.
- **AI coach** — a Gemini-backed coach that knows your actual training record: which drills you
  have completed, which you bookmarked, your sport and position. Conversations persist, and it
  builds a small memory about you (injuries, equipment, goals, schedule) that you can read and
  edit at any time.
- **Progress tracking** — mark drills complete for XP, bookmark drills for later, and the
  dashboard suggests what to train next based on what you've already done.
- **Community forum** — threads, replies and likes, scoped to signed-in accounts.

Every drill video URL is verified against the YouTube oEmbed endpoint before it ships, so no
drill points at a dead or non-embeddable video.

## How a drill is written

Every drill in the library follows the same four-part structure:

1. **The setup** — where to stand, what you need, how the drill is laid out.
2. **The execution** — what your body does, in steps.
3. **The cues** — the two or three things a coach would be shouting.
4. **The mistakes** — what goes wrong most often.

## Tech stack

- **Next.js 14** (App Router) — pages and API routes in one project
- **MongoDB Atlas** with **Mongoose**
- **NextAuth** with Google as the sign-in provider
- **Google Gemini** for the AI coach
- **Tailwind CSS**, **Framer Motion**, **React Three Fiber** for the hero
- Deployed on **Vercel**

## Running it locally

**Prerequisites:** Node.js 18+, a MongoDB Atlas cluster, a Google OAuth client, and a Gemini
API key.

```bash
git clone https://github.com/kalviumcommunity/S51_JesudasZion_Capstone_TrainLikeTrainer.git
cd S51_JesudasZion_Capstone_TrainLikeTrainer
npm install
```

Create a `.env.local` in the project root:

```bash
MONGO_URI=              # MongoDB Atlas connection string
GOOGLE_CLIENT_ID=       # Google OAuth client id
GOOGLE_CLIENT_SECRET=   # Google OAuth client secret
NEXTAUTH_SECRET=        # any long random string
NEXTAUTH_URL=http://localhost:3000
GEMINI_API_KEY=         # Google AI Studio key
SEED_SECRET=            # any long random string, required to reseed
```

`.env.local` is gitignored. Never commit real credentials.

Then:

```bash
npm run seed     # populate the database (see below)
npm run dev
```

Visit http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run seed` | Reseed sports, courses and forum threads |
| `npm run check-db` | Print a document count per collection |

## Seeding the database

`data/sports.js` is the single source of truth for all content. `coursesData` is derived from
`sportsData`, so course lessons can never drift from the drills they teach.

```bash
npm run seed
```

This replaces the `sports_datas`, `courses` and `posts` collections. It **never touches
`users`** — that collection holds real Google-authenticated accounts.

There is also an HTTP route for reseeding a deployed instance. It is POST-only and requires the
secret, because it is destructive:

```bash
curl -X POST https://<your-deployment>/api/seed -H "x-seed-secret: $SEED_SECRET"
```

### Adding or changing drill videos

Never hand-write a YouTube id — plausible-looking ids are easy to get wrong and render as
"Video unavailable". Source it from a real search, then confirm it exists and permits embedding:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VIDEO_ID&format=json"
```

`200` means it's good. If no suitable video exists, leave `videoUrl` empty — the drill page shows
an honest placeholder rather than an unrelated clip.

## API reference

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/sports` | — | All sports with positions and drills |
| `GET` | `/api/sports/[sport]` | — | One sport by its string id |
| `GET` | `/api/courses` | — | All courses |
| `GET` | `/api/courses/[slug]` | — | One course |
| `GET` | `/api/forum` | — | All threads, newest first |
| `POST` | `/api/forum` | Session | Create a thread (author from session) |
| `GET` | `/api/forum/[id]` | — | One thread with replies |
| `PUT` | `/api/forum/[id]` | Session | Like (toggles) or reply |
| `GET` | `/api/user` | — | Profile, or `{ user: null, guest: true }` |
| `PUT` | `/api/user` | Session | Update whitelisted profile fields |
| `POST` | `/api/ai` | Optional | Ask the coach; personalised when signed in |
| `GET`/`DELETE` | `/api/ai/conversations` | Session | List or clear chat history |
| `GET`/`DELETE` | `/api/ai/conversations/[id]` | Session | Read or delete one thread |
| `GET`/`POST`/`DELETE` | `/api/ai/memory` | Session | Read, add or remove a remembered fact |
| `POST` | `/api/seed` | `SEED_SECRET` | Reseed content collections |

Notes:

- Writes are scoped to the signed-in session. The forum takes the author from the session, not
  the request body, and `/api/user` only accepts a whitelist of fields.
- An empty collection returns `200` with an empty array, not an error.
- If Gemini is unreachable, `/api/ai` still returns a generic template, but flags it with
  `fallback: true` so the UI can label it rather than passing it off as a real answer.

## Project structure

```
app/
  api/          route handlers (sports, courses, forum, user, ai, seed, auth)
  sports/       library -> sport -> position -> drill
  courses/      course list and lesson player
  forum/        threads, thread detail, new thread
  ai-coach/     chat, past conversations, coach memory
  dashboard/    progress, stopwatch, what to train next
components/     UI components
context/        TrainingContext — progress and profile state
data/sports.js  all content (generated; see seeding above)
lib/
  models/       Mongoose schemas
  auth.js       NextAuth configuration
  coachMemory.js  memory extraction and merging
  useSport.js   shared data hooks
scripts/        seed and audit scripts
```

`Backend/` and `Client/` are the earlier pre-Next.js version of this project, kept for history.
The live application is the Next.js app at the repository root.

## Contact

**Jesudas Zion** — jesudaszion203@gmail.com

Feedback is welcome.
