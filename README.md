
# ⚡ Blink Duel — can you out-react a 150ms AI?

A reaction-time duel against **Jev**, TypeSafe AI's System One model. An ambiguous
stimulus appears — a review (genuine or AI-generated?), a message (sarcastic or
sincere?), an email (urgent or not?), a word (real or invented?) — and **both you
and Jev must answer as fast as possible.**

Jev returns calibrated, schema-guaranteed judgments in **70–500ms**, faster than
human visual reaction time (~200–250ms). The stopwatch on screen is the whole point.

## How the game works

- 10 rounds, 4 categories of snap judgments
- Both you and Jev answer every stimulus; you race the clock, Jev races you
- Scoring: +100 per correct answer, plus a speed bonus (up to +100, decays with your ms)
- At the end you get your score vs. Jev's accuracy — and a public leaderboard

## Run locally

```bash
npm install
cp .env.example .env.local   # add your TYPESAFE_AI_API_KEY
npm run dev                  # http://localhost:3000
```

Get a TypeSafe key at https://typesafe.ai (waitlist, ~1–2 days), or use the
Vercel AI Gateway route (`typesafe-ai/jev`) if you already have a Gateway key.

## Deploy to Vercel

```bash
npm i -g vercel
vercel                      # link & preview deploy
vercel env add TYPESAFE_AI_API_KEY   # paste your key (production)
vercel --prod
```

Requires **Node 22+** (the AI SDK enforces it — Vercel's default Node 22 runtime works).

## Optional: public leaderboard

1. In the Vercel dashboard: **Storage → Create Database → KV** (free tier).
2. Connect it to your project — Vercel injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
3. Redeploy. Scores now persist; without it, the game works fine, saving is just skipped.

## Cost math (the reason this demo exists)

Jev bills **input tokens only** at ~$0.042/M; output is free. One Blink Duel game
is a single small state + one question per round — a full 10-round game costs far
less than a cent, at 70–500ms per judgment. The LLM equivalent would take seconds
per round and cost orders of magnitude more.

## Tech

- Next.js 15 (App Router) + TypeScript
- Jev via `@ai-sdk/typesafe-ai` + `experimental_evaluate` (Vercel AI SDK 7)
- All Jev calls happen server-side in `app/api/judge/route.ts`
- Optional leaderboard via Vercel KV
