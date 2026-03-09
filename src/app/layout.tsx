import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amplifye.AI - Demand AI Platform",
  description: "AI-powered lead generation and sales acceleration platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
