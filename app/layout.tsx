
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blink Duel — can you out-react a 150ms AI?",
  description:
    "A reaction-time duel against Jev, TypeSafe's System One model. It answers in milliseconds. Can you keep up?",
  openGraph: {
    title: "Blink Duel — can you out-react a 150ms AI?",
    description:
      "Jev judges ambiguous stimuli in ~150ms — faster than human reaction time. Think you're quicker?",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
