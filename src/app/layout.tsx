import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ChatWidget } from "@/components/chat-widget";
import { MarketTicker } from "@/components/market-ticker";
import { LanguageProvider } from "@/components/providers/language-provider";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "HawkEye - AI Investment Companion",
  description:
    "Người đồng hành AI cho hành trình đầu tư — Deal Digest, Trade Plan DNA, phân tích định lượng.",
  icons: {
    icon: "/hawkeye-logo.svg",
    apple: "/hawkeye-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="antialiased m-0 p-0 dark min-h-screen relative selection:bg-hawkeye-glow/25 selection:text-white">
        <SmoothScrollProvider>
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
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

