import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Osmaan Mooraby — Trader. Strategist. Empire Builder.",
  description: "The world of Osmaan Mooraby — Crypto Trader, Digital Strategist, Founder of 10x Limitless.",
  keywords: ["Osmaan Mooraby", "10x Limitless", "Crypto Trader", "Digital Strategist"],
  authors: [{ name: "Osmaan Mooraby" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#050505] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
