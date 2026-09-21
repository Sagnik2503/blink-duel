
export type Stimulus = {
  id: string;
  category: "review" | "sarcasm" | "urgency" | "word";
  /** What the player sees as the thing to judge */
  text: string;
  /** The question shown to the player */
  prompt: string;
  optionA: string;
  optionB: string;
  /** Descriptions given to Jev as choice criteria */
  optionADesc: string;
  optionBDesc: string;
  /** Jev instruction for the verdict question */
  jevInstruction: string;
  truth: "a" | "b";
  explanation: string;
};

export const STIMULI: Stimulus[] = [
  // ---------- Reviews: genuine vs AI-generated ----------
  {
    id: "rev1", category: "review",
    text: "Bought these headphones for my commute. Bass is a bit muddy but the battery honestly lasts weeks. Would buy again.",
    prompt: "Genuine human review, or AI-generated?",
    optionA: "Genuine", optionB: "AI-generated",
    optionADesc: "A real human customer wrote this, with specific imperfections and personal experience.",
    optionBDesc: "Marketing copy or an AI wrote this, with generic praise and polished phrasing.",
    jevInstruction: "Decide whether `content` is a genuine human-written product review or an AI-generated / marketing-style review.",
    truth: "a", explanation: "Specific flaws (muddy bass) and casual phrasing are human fingerprints.",
  },
  {
    id: "rev2", category: "review",
    text: "These headphones are a testament to acoustic engineering, seamlessly blending innovation with unparalleled auditory delight.",
    prompt: "Genuine human review, or AI-generated?",
    optionA: "Genuine", optionB: "AI-generated",
    optionADesc: "A real human customer wrote this, with specific imperfections and personal experience.",
    optionBDesc: "Marketing copy or an AI wrote this, with generic praise and polished phrasing.",
    jevInstruction: "Decide whether `content` is a genuine human-written product review or an AI-generated / marketing-style review.",
    truth: "b", explanation: "Pure adjective soup, zero specifics — classic generated copy.",
  },
  {
    id: "rev3", category: "review",
    text: "The pan arrived with a small scratch on the handle. Works fine though, and customer service sent a replacement lid no questions asked.",
    prompt: "Genuine human review, or AI-generated?",
    optionA: "Genuine", optionB: "AI-generated",
    optionADesc: "A real human customer wrote this, with specific imperfections and personal experience.",
    optionBDesc: "Marketing copy or an AI wrote this, with generic praise and polished phrasing.",
    jevInstruction: "Decide whether `content` is a genuine human-written product review or an AI-generated / marketing-style review.",
    truth: "a", explanation: "A complaint plus an anecdote about service — humans write like this.",
  },
  {
    id: "rev4", category: "review",
    text: "Experience cleaning reimagined — this vacuum harnesses cutting-edge technology to create a spotless sanctuary for your family.",
    prompt: "Genuine human review, or AI-generated?",
    optionA: "Genuine", optionB: "AI-generated",
    optionADesc: "A real human customer wrote this, with specific imperfections and personal experience.",
    optionBDesc: "Marketing copy or an AI wrote this, with generic praise and polished phrasing.",
    jevInstruction: "Decide whether `content` is a genuine human-written product review or an AI-generated / marketing-style review.",
    truth: "b", explanation: "Em-dash hype with no product specifics.",
  },
  {
    id: "rev5", category: "review",
    text: "Decent vacuum. It's loud enough to scare the dog but picks up hair like nothing else I've owned. Empty the canister outside.",
    prompt: "Genuine human review, or AI-generated?",
    optionA: "Genuine", optionB: "AI-generated",
    optionADesc: "A real human customer wrote this, with specific imperfections and personal experience.",
    optionBDesc: "Marketing copy or an AI wrote this, with generic praise and polished phrasing.",
    jevInstruction: "Decide whether `content` is a genuine human-written product review or an AI-generated / marketing-style review.",
    truth: "a", explanation: "Concrete trade-offs and an odd practical tip — human.",
  },
  {
    id: "rev6", category: "review",
    text: "Shoes fell apart after two weeks of normal wear. Stitching came loose on both. Avoid.",
    prompt: "Genuine human review, or AI-generated?",
    optionA: "Genuine", optionB: "AI-generated",
    optionADesc: "A real human customer wrote this, with specific imperfections and personal experience.",
    optionBDesc: "Marketing copy or an AI wrote this, with generic praise and polished phrasing.",
    jevInstruction: "Decide whether `content` is a genuine human-written product review or an AI-generated / marketing-style review.",
    truth: "a", explanation: "Short, annoyed, specific — human.",
  },
  {
    id: "rev7", category: "review",
    text: "Step into confidence with footwear crafted for the modern journey, where comfort meets sophistication in every stride.",
    prompt: "Genuine human review, or AI-generated?",
    optionA: "Genuine", optionB: "AI-generated",
    optionADesc: "A real human customer wrote this, with specific imperfections and personal experience.",
    optionBDesc: "Marketing copy or an AI wrote this, with generic praise and polished phrasing.",
    jevInstruction: "Decide whether `content` is a genuine human-written product review or an AI-generated / marketing-style review.",
    truth: "b", explanation: "Nobody writes a review like a billboard.",
  },

  // ---------- Sarcastic vs sincere ----------
  {
    id: "sar1", category: "sarcasm",
    text: "Oh great, another meeting that could have been an email. My favorite.",
    prompt: "Sarcastic or sincere?",
    optionA: "Sincere", optionB: "Sarcastic",
    optionADesc: "The speaker genuinely means what they say, with no irony.",
    optionBDesc: "The speaker means the opposite of what they literally say, mocking or complaining.",
    jevInstruction: "Decide whether `content` is meant sincerely or sarcastically (irony — the literal meaning is the opposite of the intended one).",
    truth: "b", explanation: "Nobody's favorite meeting is a redundant one.",
  },
  {
    id: "sar2", category: "sarcasm",
    text: "The new deploy pipeline cut our release time from an hour to five minutes. Genuinely impressed with the team.",
    prompt: "Sarcastic or sincere?",
    optionA: "Sincere", optionB: "Sarcastic",
    optionADesc: "The speaker genuinely means what they say, with no irony.",
    optionBDesc: "The speaker means the opposite of what they literally say, mocking or complaining.",
    jevInstruction: "Decide whether `content` is meant sincerely or sarcastically (irony — the literal meaning is the opposite of the intended one).",
    truth: "a", explanation: "Specific improvement + credit to the team = sincere.",
  },
  {
    id: "sar3", category: "sarcasm",
    text: "Wow, the printer is out of toner again. What a shock.",
    prompt: "Sarcastic or sincere?",
    optionA: "Sincere", optionB: "Sarcastic",
    optionADesc: "The speaker genuinely means what they say, with no irony.",
    optionBDesc: "The speaker means the opposite of what they literally say, mocking or complaining.",
    jevInstruction: "Decide whether `content` is meant sincerely or sarcastically (irony — the literal meaning is the opposite of the intended one).",
    truth: "b", explanation: "Printers always being broken is the opposite of shocking.",
  },
  {
    id: "sar4", category: "sarcasm",
    text: "Thanks for jumping on the login bug so quickly — it really saved our demo yesterday.",
    prompt: "Sarcastic or sincere?",
    optionA: "Sincere", optionB: "Sarcastic",
    optionADesc: "The speaker genuinely means what they say, with no irony.",
    optionBDesc: "The speaker means the opposite of what they literally say, mocking or complaining.",
    jevInstruction: "Decide whether `content` is meant sincerely or sarcastically (irony — the literal meaning is the opposite of the intended one).",
    truth: "a", explanation: "A concrete positive outcome (saved demo) signals sincerity.",
  },
  {
    id: "sar5", category: "sarcasm",
    text: "I just love it when the bus leaves early and I get to wait twenty minutes in the rain.",
    prompt: "Sarcastic or sincere?",
    optionA: "Sincere", optionB: "Sarcastic",
    optionADesc: "The speaker genuinely means what they say, with no irony.",
    optionBDesc: "The speaker means the opposite of what they literally say, mocking or complaining.",
    jevInstruction: "Decide whether `content` is meant sincerely or sarcastically (irony — the literal meaning is the opposite of the intended one).",
    truth: "b", explanation: "Waiting in the rain is nobody's idea of love.",
  },
  {
    id: "sar6", category: "sarcasm",
    text: "The docs for this library are clear and every example actually runs. Rare and appreciated.",
    prompt: "Sarcastic or sincere?",
    optionA: "Sincere", optionB: "Sarcastic",
    optionADesc: "The speaker genuinely means what they say, with no irony.",
    optionBDesc: "The speaker means the opposite of what they literally say, mocking or complaining.",
    jevInstruction: "Decide whether `content` is meant sincerely or sarcastically (irony — the literal meaning is the opposite of the intended one).",
    truth: "a", explanation: "Mild, plausible praise with a specific observation — sincere.",
  },
  {
    id: "sar7", category: "sarcasm",
    text: "Fantastic, my flight got delayed three hours. Best vacation ever.",
    prompt: "Sarcastic or sincere?",
    optionA: "Sincere", optionB: "Sarcastic",
    optionADesc: "The speaker genuinely means what they say, with no irony.",
    optionBDesc: "The speaker means the opposite of what they literally say, mocking or complaining.",
    jevInstruction: "Decide whether `content` is meant sincerely or sarcastically (irony — the literal meaning is the opposite of the intended one).",
    truth: "b", explanation: "A 3-hour delay is the opposite of a best vacation.",
  },
  {
    id: "sar8", category: "sarcasm",
    text: "Your explanation of closures finally made it click for me. Thank you for taking the time.",
    prompt: "Sarcastic or sincere?",
    optionA: "Sincere", optionB: "Sarcastic",
    optionADesc: "The speaker genuinely means what they say, with no irony.",
    optionBDesc: "The speaker means the opposite of what they literally say, mocking or complaining.",
    jevInstruction: "Decide whether `content` is meant sincerely or sarcastically (irony — the literal meaning is the opposite of the intended one).",
    truth: "a", explanation: "Gratitude tied to a concrete result — sincere.",
  },
  {
    id: "sar9", category: "sarcasm",
    text: "Yeah, because what this 200-line function really needed was more nested ternaries.",
    prompt: "Sarcastic or sincere?",
    optionA: "Sincere", optionB: "Sarcastic",
    optionADesc: "The speaker genuinely means what they say, with no irony.",
    optionBDesc: "The speaker means the opposite of what they literally say, mocking or complaining.",
    jevInstruction: "Decide whether `content` is meant sincerely or sarcastically (irony — the literal meaning is the opposite of the intended one).",
    truth: "b", explanation: "Nobody sincerely wants more nested ternaries in a 200-line function.",
  },

  // ---------- Urgent vs not urgent ----------
  {
    id: "urg1", category: "urgency",
    text: "Production checkout is down and we're losing sales every minute. Need someone on this now.",
    prompt: "Urgent or not urgent?",
    optionA: "Urgent", optionB: "Not urgent",
    optionADesc: "This requires immediate action; delays cause real damage within hours or minutes.",
    optionBDesc: "This can wait; nothing bad happens if it is handled in the next day or so.",
    jevInstruction: "Decide whether `content` demands immediate action today or can safely wait.",
    truth: "a", explanation: "Revenue loss in progress = urgent.",
  },
  {
    id: "urg2", category: "urgency",
    text: "Reminder: the team lunch poll closes Friday — please vote when you get a chance.",
    prompt: "Urgent or not urgent?",
    optionA: "Urgent", optionB: "Not urgent",
    optionADesc: "This requires immediate action; delays cause real damage within hours or minutes.",
    optionBDesc: "This can wait; nothing bad happens if it is handled in the next day or so.",
    jevInstruction: "Decide whether `content` demands immediate action today or can safely wait.",
    truth: "b", explanation: "A lunch poll with a deadline and no stakes.",
  },
  {
    id: "urg3", category: "urgency",
    text: "The contract expires at 6pm today and we cannot close the quarter without a signature.",
    prompt: "Urgent or not urgent?",
    optionA: "Urgent", optionB: "Not urgent",
    optionADesc: "This requires immediate action; delays cause real damage within hours or minutes.",
    optionBDesc: "This can wait; nothing bad happens if it is handled in the next day or so.",
    jevInstruction: "Decide whether `content` demands immediate action today or can safely wait.",
    truth: "a", explanation: "Hard same-day deadline with financial consequence.",
  },
  {
    id: "urg4", category: "urgency",
    text: "Here's the Q3 slide deck for your review — no rush at all, sometime next week is fine.",
    prompt: "Urgent or not urgent?",
    optionA: "Urgent", optionB: "Not urgent",
    optionADesc: "This requires immediate action; delays cause real damage within hours or minutes.",
    optionBDesc: "This can wait; nothing bad happens if it is handled in the next day or so.",
    jevInstruction: "Decide whether `content` demands immediate action today or can safely wait.",
    truth: "b", explanation: "Explicitly says no rush.",
  },
  {
    id: "urg5", category: "urgency",
    text: "Security scan found an exposed API key in the public repo. Rotate it before end of day.",
    prompt: "Urgent or not urgent?",
    optionA: "Urgent", optionB: "Not urgent",
    optionADesc: "This requires immediate action; delays cause real damage within hours or minutes.",
    optionBDesc: "This can wait; nothing bad happens if it is handled in the next day or so.",
    jevInstruction: "Decide whether `content` demands immediate action today or can safely wait.",
    truth: "a", explanation: "Live credential exposure is same-day critical.",
  },
  {
    id: "urg6", category: "urgency",
    text: "The monthly newsletter draft is ready whenever you have a moment to proofread it.",
    prompt: "Urgent or not urgent?",
    optionA: "Urgent", optionB: "Not urgent",
    optionADesc: "This requires immediate action; delays cause real damage within hours or minutes.",
    optionBDesc: "This can wait; nothing bad happens if it is handled in the next day or so.",
    jevInstruction: "Decide whether `content` demands immediate action today or can safely wait.",
    truth: "b", explanation: "'Whenever you have a moment' is the opposite of urgent.",
  },
  {
    id: "urg7", category: "urgency",
    text: "Our biggest client's overnight data export failed and they present to their board at 9am tomorrow using our numbers.",
    prompt: "Urgent or not urgent?",
    optionA: "Urgent", optionB: "Not urgent",
    optionADesc: "This requires immediate action; delays cause real damage within hours or minutes.",
    optionBDesc: "This can wait; nothing bad happens if it is handled in the next day or so.",
    jevInstruction: "Decide whether `content` demands immediate action today or can safely wait.",
    truth: "a", explanation: "Client-facing deadline tomorrow morning with a failure in progress.",
  },
  {
    id: "urg8", category: "urgency",
    text: "Thinking about starting a book club at work — let me know if you'd be interested, no pressure.",
    prompt: "Urgent or not urgent?",
    optionA: "Urgent", optionB: "Not urgent",
    optionADesc: "This requires immediate action; delays cause real damage within hours or minutes.",
    optionBDesc: "This can wait; nothing bad happens if it is handled in the next day or so.",
    jevInstruction: "Decide whether `content` demands immediate action today or can safely wait.",
    truth: "b", explanation: "A social idea with 'no pressure'.",
  },

  // ---------- Real word vs invented word ----------
  {
    id: "wrd1", category: "word",
    text: "Petrichor",
    prompt: "Real English word, or made up?",
    optionA: "Real word", optionB: "Made up",
    optionADesc: "This is an established word in English dictionaries or common usage.",
    optionBDesc: "This is invented or nonsense — not an established English word.",
    jevInstruction: "Decide whether `content` is an established English word or an invented nonsense word.",
    truth: "a", explanation: "Petrichor: the smell after rain. Real, from the Greek.",
  },
  {
    id: "wrd2", category: "word",
    text: "Flonter",
    prompt: "Real English word, or made up?",
    optionA: "Real word", optionB: "Made up",
    optionADesc: "This is an established word in English dictionaries or common usage.",
    optionBDesc: "This is invented or nonsense — not an established English word.",
    jevInstruction: "Decide whether `content` is an established English word or an invented nonsense word.",
    truth: "b", explanation: "Invented.",
  },
  {
    id: "wrd3", category: "word",
    text: "Serendipity",
    prompt: "Real English word, or made up?",
    optionA: "Real word", optionB: "Made up",
    optionADesc: "This is an established word in English dictionaries or common usage.",
    optionBDesc: "This is invented or nonsense — not an established English word.",
    jevInstruction: "Decide whether `content` is an established English word or an invented nonsense word.",
    truth: "a", explanation: "Real — happy accident.",
  },
  {
    id: "wrd4", category: "word",
    text: "Bramish",
    prompt: "Real English word, or made up?",
    optionA: "Real word", optionB: "Made up",
    optionADesc: "This is an established word in English dictionaries or common usage.",
    optionBDesc: "This is invented or nonsense — not an established English word.",
    jevInstruction: "Decide whether `content` is an established English word or an invented nonsense word.",
    truth: "b", explanation: "Sounds plausible, but invented.",
  },
  {
    id: "wrd5", category: "word",
    text: "Halcyon",
    prompt: "Real English word, or made up?",
    optionA: "Real word", optionB: "Made up",
    optionADesc: "This is an established word in English dictionaries or common usage.",
    optionBDesc: "This is invented or nonsense — not an established English word.",
    jevInstruction: "Decide whether `content` is an established English word or an invented nonsense word.",
    truth: "a", explanation: "Real — denoting a calm, idyllic time.",
  },
  {
    id: "wrd6", category: "word",
    text: "Snurf",
    prompt: "Real English word, or made up?",
    optionA: "Real word", optionB: "Made up",
    optionADesc: "This is an established word in English dictionaries or common usage.",
    optionBDesc: "This is invented or nonsense — not an established English word.",
    jevInstruction: "Decide whether `content` is an established English word or an invented nonsense word.",
    truth: "b", explanation: "Invented (yes, there was a Dutch comic called De Snorken, but not a word).",
  },
  {
    id: "wrd7", category: "word",
    text: "Ephemeral",
    prompt: "Real English word, or made up?",
    optionA: "Real word", optionB: "Made up",
    optionADesc: "This is an established word in English dictionaries or common usage.",
    optionBDesc: "This is invented or nonsense — not an established English word.",
    jevInstruction: "Decide whether `content` is an established English word or an invented nonsense word.",
    truth: "a", explanation: "Real — lasting a very short time.",
  },
  {
    id: "wrd8", category: "word",
    text: "Twindle",
    prompt: "Real English word, or made up?",
    optionA: "Real word", optionB: "Made up",
    optionADesc: "This is an established word in English dictionaries or common usage.",
    optionBDesc: "This is invented or nonsense — not an established English word.",
    jevInstruction: "Decide whether `content` is an established English word or an invented nonsense word.",
    truth: "b", explanation: "Invented — twindle is a 17th-century coinage for dying embers, but not established; the safe call is made up.",
  },

  { id: "exc1", category: "excuse", text: "Sorry I'm late, my train was delayed and I had to wait for the next one.", prompt: "Real excuse or made up?", optionA: "Real", optionB: "Made up", optionADesc: "A plausible excuse that could genuinely happen.", optionBDesc: "An invented or fabricated excuse.", jevInstruction: "Decide whether this sounds like a genuine real-world excuse or an invented excuse.", truth: "a", explanation: "A routine train delay is a common and believable reason for being late.", },
];

export const ROUNDS = 10;

export function pickRounds(n = ROUNDS): Stimulus[] {
  const pool = [...STIMULI];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
