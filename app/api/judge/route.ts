
import { experimental_evaluate } from "ai";
import { typeSafeAi } from "@ai-sdk/typesafe-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // Jev SDK requires Node 22+

type JudgeRequest = {
  text: string;
  jevInstruction: string;
  optionADesc: string;
  optionBDesc: string;
};

export async function POST(req: Request) {
  const { text, jevInstruction, optionADesc, optionBDesc } =
    (await req.json()) as JudgeRequest;

  const start = performance.now();

  let result;
  try {
    result = await experimental_evaluate({
      model: typeSafeAi.evaluationModel("jev-latest"),
      state: { content: text },
      questions: {
        verdict: {
          type: "choice",
          instructions: jevInstruction,
          criteria: { a: optionADesc, b: optionBDesc },
        },
        // Second question, same call — this is the Jev idiom: parallel,
        // near-free, and it cannot degrade the first answer.
        ambiguous: {
          type: "boolean",
          instructions:
            "Is `content` genuinely ambiguous, such that reasonable judges could disagree?",
        },
      },
    });
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    return NextResponse.json(
      { error: "Jev call failed", detail: String(err) },
      { status: status === 401 ? 502 : 500 },
    );
  }

  const serverMs = Math.round(performance.now() - start);
  const verdict = result.answers.verdict as {
    choice: string;
    probabilities: Record<string, number>;
    confidence: number;
  };
  const ambiguous = result.answers.ambiguous as { probability: number };

  return NextResponse.json({
    answer: verdict.choice === "a" ? "a" : "b",
    probabilities: verdict.probabilities,
    confidence: verdict.confidence,
    ambiguousProbability: ambiguous.probability,
    serverMs,
    model: (result as unknown as { model?: string }).model ?? "jev-latest",
    usage: result.usage,
  });
}
