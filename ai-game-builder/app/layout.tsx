import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Game Builder - Build 3D Android Games with AI",
  description: "Create playable 3D Android games using AI assistance. Supports OpenAI, Claude, Gemini, and Grok with voice chat capabilities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
