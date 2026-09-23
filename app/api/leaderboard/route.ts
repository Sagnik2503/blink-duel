
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const KEY = "blink-duel:leaderboard";

async function getKv() {
  // Optional: only available if you've connected a Vercel KV store.
  if (!process.env.KV_REST_API_URL) return null;
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function GET() {
  const kv = await getKv();
  if (!kv) return NextResponse.json({ enabled: false, entries: [] });
  const raw = await kv.zrange<string[]>(
    KEY,
    0,
    19,
    { rev: true, withScores: true },
  );
  const entries: { name: string; score: number; avgMs: number }[] = [];
  for (let i = 0; i < (raw?.length ?? 0); i += 2) {
    const member = raw![i] as string;
    const score = Number(raw![i + 1]);
    if (!member || isNaN(score)) continue;
    const [name, s, avgMs] = member.split("::");
    entries.push({ name: name || "Anonymous", score: Number(s) || score, avgMs: Number(avgMs) || 0 });
  }
  return NextResponse.json({ enabled: true, entries });
}

export async function POST(req: Request) {
  const { name, score, avgMs } = await req.json();
  if (
    typeof score !== "number" ||
    score < 0 ||
    score > 20000
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const kv = await getKv();
  if (!kv) return NextResponse.json({ saved: false });
  const safeName = (typeof name === "string" ? name : "").replace(/[^\w\s-]/g, "").slice(0, 24) || "Anonymous";
  await kv.zadd(KEY, { score, member: `${safeName}::${score}::${Math.round(avgMs)}` });
  return NextResponse.json({ saved: true });
}
