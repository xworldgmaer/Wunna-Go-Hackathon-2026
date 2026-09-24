import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WunnaGo — AI-assisted Caribbean experiences",
  description: "Hackathon prototype for discovering people-led Caribbean micro-experiences."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
