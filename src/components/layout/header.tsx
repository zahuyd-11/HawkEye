"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LanguageToggle } from "@/components/language/language-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { BrandLogo } from "@/components/layout/brand-logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { t } = useLanguage();

  const navLink =
    "text-sm font-medium text-zinc-400 hover:text-hawkeye-glow-bright transition-colors";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-gradient-to-r from-hawkeye-obsidian/95 via-hawkeye-navy/90 to-hawkeye-charcoal/95 backdrop-blur-xl supports-[backdrop-filter]:bg-hawkeye-obsidian/80">
      <div className="w-full max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
        <BrandLogo size={44} />

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={navLink}>
            {t("nav.home")}
          </Link>
          <Link href="/dashboard/risk-desk" className={navLink}>
            Risk Desk
          </Link>
          <Link href="/dashboard/trade-plan" className={navLink}>
            {t("nav.tradePlans")}
          </Link>
          <Link href="/dashboard/micro-research" className={navLink}>
            {t("nav.microResearch")}
          </Link>
          <Link href="/pricing" className={navLink}>
            {t("nav.pricing")}
          </Link>
          <Link href="/community" className={navLink}>
            {t("nav.community")}
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <LanguageToggle />
          {session ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-hawkeye-glow-bright hover:bg-hawkeye-navy-mid/50"
                >
                  {t("nav.dashboard")}
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="border-white/[0.08] bg-transparent text-zinc-300 hover:border-hawkeye-glow/30 hover:bg-hawkeye-navy-mid/40"
              >
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="text-zinc-400 hover:text-hawkeye-glow-bright"
                >
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="btn-hawkeye rounded-xl px-5">{t("nav.startFree")}</Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-zinc-400"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.04] bg-hawkeye-navy/95 backdrop-blur-xl">
          <nav className="container flex flex-col space-y-4 px-4 py-4">
            <Link href="/" className={navLink}>
              {t("nav.home")}
            </Link>
            <Link href="/dashboard/risk-desk" className={navLink}>
              Risk Desk
            </Link>
            <Link href="/dashboard/trade-plan" className={navLink}>
              {t("nav.tradePlans")}
            </Link>
            <Link href="/dashboard/micro-research" className={navLink}>
              {t("nav.microResearch")}
            </Link>
            <Link href="/pricing" className={navLink}>
              {t("nav.pricing")}
            </Link>
            <Link href="/community" className={navLink}>
              {t("nav.community")}
            </Link>
            <div className="pt-2">
              <LanguageToggle />
            </div>
            <div className="pt-4 border-t border-white/[0.04] space-y-2">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full border-white/[0.08]">
                      {t("nav.dashboard")}
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => signOut()}>
                    {t("nav.signOut")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="outline" className="w-full border-white/[0.08]">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full btn-hawkeye rounded-xl">{t("nav.startFree")}</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
