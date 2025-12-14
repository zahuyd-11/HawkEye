import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ChatWidget } from "@/components/chat-widget";
import { MarketTicker } from "@/components/market-ticker";
import { LanguageProvider } from "@/components/providers/language-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HawkEye - Investment Decision Support Platform",
  description: "Get 1-page DealDigest reports, risk-driven alerts, and structured trading tools to make confident, emotion-free investment decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased m-0 p-0">
        <QueryProvider>
          <Providers>
            <LanguageProvider>
              <MarketTicker />
              {children}
              <ChatWidget />
            </LanguageProvider>
          </Providers>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
