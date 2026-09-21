
import Game from "@/components/Game";

export default function Home() {
  return (
    <main>
      <h1>⚡ Blink Duel</h1>
      <p className="sub">
        An ambiguous stimulus appears. <strong>You</strong> and{" "}
        <strong>Jev</strong> — a System One model that returns calibrated judgments
        in 70–500ms — both answer. Human reaction time is ~200ms.
        <br />
        It has already decided before you finish reading. Probably.
      </p>
      <Game />
      <p className="footer-note">
        Judgments by <a href="https://typesafe.ai">Jev</a> (TypeSafe AI) via the
        Vercel AI SDK. One batched call per round: a verdict + an ambiguity check,
        answered in parallel. Input-only billing, output free — a full 10-round
        game costs a fraction of a cent.
      </p>
      <p className="footer-note">
        Built by <a href="https://github.com/Sagnik2503/blink-duel" target="_blank" rel="noreferrer">Sagnik</a>
      </p>
    </main>
  );
}
