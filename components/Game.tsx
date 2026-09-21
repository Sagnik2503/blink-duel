
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { pickRounds, ROUNDS, type Stimulus } from "@/lib/stimuli";

type JevResult = {
  answer: "a" | "b";
  probabilities: Record<string, number>;
  confidence: number;
  ambiguousProbability: number;
  serverMs: number;
  model: string;
};

type RoundRecord = {
  stimulus: Stimulus;
  humanAnswer: "a" | "b";
  humanMs: number;
  jev: JevResult;
};

type Phase = "idle" | "countdown" | "stimulus" | "reveal" | "results";

const CATEGORY_LABEL: Record<Stimulus["category"], string> = {
  review: "Genuine or AI-generated?",
  sarcasm: "Sarcasm detector",
  urgency: "Triage this",
  word: "Real word?",
  excuse: "Valid excuse?",
  fact: "Fact or fiction?",
  product: "Real product?",
};

function speedBonus(ms: number) {
  return Math.max(0, Math.round((2500 - ms) / 25)); // 100 pts at <=500ms, decaying to 0 at 2.5s
}

export default function Game() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rounds, setRounds] = useState<Stimulus[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [tick, setTick] = useState(0); // live clock during stimulus
  const [jev, setJev] = useState<JevResult | null>(null);
  const [records, setRecords] = useState<RoundRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<RoundRecord | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; avgMs: number }[] | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState<"no" | "pending" | "yes">("no");

  const t0Ref = useRef(0);
  const jevPromiseRef = useRef<Promise<JevResult> | null>(null);
  const rafRef = useRef(0);
  const scoreCardRef = useRef<HTMLDivElement>(null);

  const stimulus = rounds[roundIdx];

  // Live clock animation while the stimulus is up
  useEffect(() => {
    if (phase !== "stimulus") return;
    const loop = () => {
      setTick(performance.now() - t0Ref.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, roundIdx]);

  const startGame = useCallback(() => {
    setRounds(pickRounds(ROUNDS));
    setRoundIdx(0);
    setRecords([]);
    setCurrentRecord(null);
    setSaved("no");
    setLeaderboard(null);
    setPhase("countdown");
    setCountdown(3);
  }, []);

  // 3-2-1 countdown then show the stimulus
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown === 0) {
      setPhase("stimulus");
      setJev(null);
      t0Ref.current = performance.now();
      // Fire the Jev request the same instant the stimulus renders.
      const s = rounds[roundIdx];
      jevPromiseRef.current = fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: s.text,
          jevInstruction: s.jevInstruction,
          optionADesc: s.optionADesc,
          optionBDesc: s.optionBDesc,
        }),
      }).then((r) => {
        if (!r.ok) throw new Error("judge failed");
        return r.json() as Promise<JevResult>;
      });
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [phase, countdown, rounds, roundIdx]);

  // Show Jev's result as soon as it lands while the player is still thinking
  useEffect(() => {
    if (phase !== "stimulus" || !jevPromiseRef.current) return;
    let alive = true;
    jevPromiseRef.current
      .then((r) => alive && setJev(r))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [phase, roundIdx]);

  const answer = useCallback(
    async (choice: "a" | "b") => {
      if (phase !== "stimulus") return;
      const humanMs = Math.round(performance.now() - t0Ref.current);
      let jevResult = jev;
      if (!jevResult && jevPromiseRef.current) {
        try {
          jevResult = await jevPromiseRef.current;
        } catch {
          return; // failed round — let them retry by reloading; keep it simple
        }
      }
      if (!jevResult) return;
      setJev(jevResult);
      const record: RoundRecord = { stimulus, humanAnswer: choice, humanMs, jev: jevResult };
      setCurrentRecord(record);
      setRecords((rs) => [...rs, record]);
      setPhase("reveal");
    },
    [phase, jev, stimulus],
  );

  const nextRound = useCallback(() => {
    if (roundIdx + 1 >= rounds.length) {
      setPhase("results");
      fetch("/api/leaderboard")
        .then((r) => r.json())
        .then((d) => setLeaderboard(d.entries))
        .catch(() => setLeaderboard([]));
    } else {
      setRoundIdx((i) => i + 1);
      setPhase("countdown");
      setCountdown(3);
    }
  }, [roundIdx, rounds.length]);

  // ---------- scoring ----------
  const humanScore = records.reduce((sum, r) => {
    const correct = r.humanAnswer === r.stimulus.truth;
    return sum + (correct ? 100 + speedBonus(r.humanMs) : 0);
  }, 0);
  const jevCorrect = records.filter((r) => r.jev.answer === r.stimulus.truth).length;
  const humanCorrect = records.filter((r) => r.humanAnswer === r.stimulus.truth).length;
  const avgMs = records.length
    ? Math.round(records.reduce((s, r) => s + r.humanMs, 0) / records.length)
    : 0;

  const shareText = `I scored ${humanScore} in Blink Duel — ${humanCorrect}/${records.length} correct at ${avgMs}ms avg. Jev (TypeSafe's 150ms AI) got ${jevCorrect}/${records.length}. Can you beat it?\n\nhttps://blink-duel-swart.vercel.app`;

  const saveScore = async () => {
    setSaved("pending");
    await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: playerName, score: humanScore, avgMs }),
    });
    setSaved("yes");
    const r = await fetch("/api/leaderboard");
    const d = await r.json();
    setLeaderboard(d.entries ?? []);
  };

  const shareScore = async () => {
    if (!scoreCardRef.current) return;
    const canvas = await html2canvas(scoreCardRef.current, {
      backgroundColor: "#0a0a0f",
      scale: 2,
    });
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png")
    );
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", blob, "blink-duel-score.png");
    try {
      const res = await fetch("https://catbox.moe/user/api.php", {
        method: "POST",
        body: form,
      });
      const imageUrl = await res.text();
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${humanScore} in Blink Duel — ${humanCorrect}/${records.length} correct at ${avgMs}ms avg. Jev (TypeSafe's 150ms AI) got ${jevCorrect}/${records.length}. Can you beat it?\n\nhttps://blink-duel-swart.vercel.app`)}`;
      window.open(tweetUrl, "_blank");
      if (imageUrl.trim()) {
        await navigator.clipboard.writeText(imageUrl.trim());
      }
    } catch {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
    }
  };

  // ---------- render ----------
  if (phase === "idle") {
    return (
      <div className="panel">
        <p style={{ lineHeight: 1.6 }}>
          <strong>{ROUNDS} rounds.</strong> Each round, a stimulus appears and both
          you and Jev answer. You earn points for being <em>right</em> and{" "}
          <em>fast</em>. Jev doesn't get points — Jev just doesn't miss.
        </p>
        <div className="btnrow" style={{ marginTop: 24 }}>
          <button className="primary" onClick={startGame}>
            Start the duel ⚡
          </button>
        </div>
      </div>
    );
  }

  if (phase === "countdown") {
    return (
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: 13 }}>
          <span>Round {roundIdx + 1} / {rounds.length}</span>
          <span>{CATEGORY_LABEL[stimulus.category]}</span>
        </div>
        <div className="countdown">{countdown > 0 ? countdown : "GO"}</div>
      </div>
    );
  }

  if (phase === "stimulus" || phase === "reveal") {
    const rec = currentRecord;
    const humanRight = rec ? rec.humanAnswer === rec.stimulus.truth : null;
    const jevRight = rec ? rec.jev.answer === rec.stimulus.truth : null;
    const pts = rec
      ? humanRight
        ? 100 + speedBonus(rec.humanMs)
        : 0
      : 0;
    const pa = rec?.jev.probabilities?.a ?? 0;
    const pb = rec?.jev.probabilities?.b ?? 0;

    return (
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: 13 }}>
          <span>Round {roundIdx + 1} / {rounds.length}</span>
          <span>Score: {humanScore}</span>
        </div>
        <div style={{ marginTop: 16 }}>
          <span className="category">{CATEGORY_LABEL[stimulus.category]}</span>
          <div className="stimulus">{stimulus.text}</div>
          <div className="prompt">{stimulus.prompt}</div>
        </div>

        {phase === "stimulus" && (
          <>
            <div style={{ textAlign: "center", margin: "26px 0 8px" }}>
              <div className="clock">{Math.round(tick)}<span style={{ fontSize: 18, color: "var(--muted)" }}>ms</span></div>
              <div className="clock-label">your clock is running</div>
            </div>
            <div className="jev-status waiting" style={{ textAlign: "center" }}>
              {jev ? `Jev answered in ${jev.serverMs}ms.` : "Jev is thinking… (it does this at ~150ms)"}
            </div>
            <div className="btnrow" style={{ marginTop: 18 }}>
              <button onClick={() => answer("a")}>{stimulus.optionA}</button>
              <button onClick={() => answer("b")}>{stimulus.optionB}</button>
            </div>
          </>
        )}

        {phase === "reveal" && rec && (
          <>
            <div className="verdict" style={{ marginTop: 24 }}>
              <div>
                <div className="who">You</div>
                <div className={`ms ${humanRight ? "correct" : "wrong"}`}>{rec.humanMs}ms</div>
                <div className={`ans ${humanRight ? "correct" : "wrong"}`}>
                  {rec.humanAnswer === "a" ? rec.stimulus.optionA : rec.stimulus.optionB}{" "}
                  {humanRight ? "✓" : "✗"} {humanRight ? `+${pts}` : ""}
                </div>
              </div>
              <div>
                <div className="who">Jev</div>
                <div className={`ms ${jevRight ? "correct" : "wrong"}`}>{rec.jev.serverMs}ms</div>
                <div className={`ans ${jevRight ? "correct" : "wrong"}`}>
                  {rec.jev.answer === "a" ? rec.stimulus.optionA : rec.stimulus.optionB}{" "}
                  {jevRight ? "✓" : "✗"}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="bar-row">
                <span style={{ width: 90 }}>{rec.stimulus.optionA}</span>
                <div className="bar"><div style={{ width: `${pa * 100}%` }} /></div>
                <span style={{ width: 52, textAlign: "right" }}>{(pa * 100).toFixed(0)}%</span>
              </div>
              <div className="bar-row">
                <span style={{ width: 90 }}>{rec.stimulus.optionB}</span>
                <div className="bar"><div style={{ width: `${pb * 100}%` }} /></div>
                <span style={{ width: 52, textAlign: "right" }}>{(pb * 100).toFixed(0)}%</span>
              </div>
              <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>
                Jev's calibrated probability distribution · confidence{" "}
                {((rec.jev.confidence ?? 0) * 100).toFixed(0)}%
                {rec.jev.ambiguousProbability > 0.5 && " · Jev flagged this one as genuinely ambiguous"}
              </div>
            </div>

            <div className="explain">
              <strong>Answer: </strong>
              {rec.stimulus.truth === "a" ? rec.stimulus.optionA : rec.stimulus.optionB}.{" "}
              {rec.stimulus.explanation}
              {rec.jev.answer !== rec.stimulus.truth && " Jev missed this one — even a 150ms brain blinks."}
            </div>

            <div className="btnrow" style={{ marginTop: 22 }}>
              <button className="primary" onClick={nextRound}>
                {roundIdx + 1 >= rounds.length ? "See results" : "Next round →"}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // results
  return (
    <div className="panel">
      <div ref={scoreCardRef} style={{ textAlign: "center", background: "var(--bg)", padding: 24, borderRadius: 12 }}>
        <div className="label" style={{ color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2, fontSize: 13 }}>Final score</div>
        <div className="bigscore">{humanScore}</div>
        <div className="scores">
          <div>
            <div className="bigscore" style={{ fontSize: 34 }}>{humanCorrect}/{records.length}</div>
            <div className="label">you, {avgMs}ms avg</div>
          </div>
          <div>
            <div className="bigscore" style={{ fontSize: 34 }}>{jevCorrect}/{records.length}</div>
            <div className="label">Jev, {records.length ? Math.round(records.reduce((s, r) => s + r.jev.serverMs, 0) / records.length) : 0}ms avg</div>
          </div>
        </div>
        <p className="sub" style={{ marginTop: 18 }}>
          {humanCorrect > jevCorrect
            ? "You out-judged the machine. Savor it."
            : humanCorrect === jevCorrect
              ? "Tied on accuracy — but Jev did it before you blinked."
              : "The machine wins this one. The clock was never really fair."}
        </p>
      </div>

      <div className="btnrow" style={{ marginTop: 22 }}>
        <button className="primary" onClick={startGame}>Play again</button>
        <button onClick={shareScore}>Share score ↗</button>
        <button onClick={() => navigator.clipboard.writeText(shareText)}>Copy result</button>
      </div>

      {leaderboard && leaderboard.length > 0 && (
        <>
          <h3 style={{ marginTop: 30 }}>Leaderboard</h3>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Score</th><th>Avg ms</th></tr></thead>
            <tbody>
              {leaderboard.map((e, i) => (
                <tr key={i}>
                  <td>{i + 1}</td><td>{e.name}</td><td>{e.score}</td><td>{e.avgMs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {leaderboard && (
        <div style={{ marginTop: 22, display: "flex", gap: 10, justifyContent: "center" }}>
          <input
            placeholder="Your name"
            value={playerName}
            maxLength={24}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={saveScore} disabled={saved !== "no" || !playerName.trim()}>
            {saved === "yes" ? "Saved ✓" : saved === "pending" ? "Saving…" : "Save score"}
          </button>
        </div>
      )}

      <table style={{ marginTop: 30 }}>
        <thead><tr><th>Stimulus</th><th>You</th><th>Jev</th></tr></thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td style={{ maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.stimulus.text}
              </td>
              <td className={r.humanAnswer === r.stimulus.truth ? "correct" : "wrong"}>
                {r.humanMs}ms {r.humanAnswer === r.stimulus.truth ? "✓" : "✗"}
              </td>
              <td className={r.jev.answer === r.stimulus.truth ? "correct" : "wrong"}>
                {r.jev.serverMs}ms {r.jev.answer === r.stimulus.truth ? "✓" : "✗"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
