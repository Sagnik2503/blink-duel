
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
  const raw = await kv.zrange<{ member: string; score: number }[]>(
    KEY,
    0,
    19,
    { rev: true, withScores: true },
  );
  const entries = (raw ?? []).map((e) => {
    const [name, score, avgMs] = e.member.split("::");
    return { name, score: Number(score), avgMs: Number(avgMs) };
  });
  return NextResponse.json({ enabled: true, entries });
}

export async function POST(req: Request) {
  const { name, score, avgMs } = await req.json();
  if (
    typeof name !== "string" ||
    typeof score !== "number" ||
    name.length > 24 ||
    score < 0 ||
    score > 20000
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const kv = await getKv();
  if (!kv) return NextResponse.json({ saved: false });
  const safeName = name.replace(/[^\w\s-]/g, "").slice(0, 24) || "anon";
  await kv.zadd(KEY, { score, member: `${safeName}::${score}::${Math.round(avgMs)}` });
  return NextResponse.json({ saved: true });
}
