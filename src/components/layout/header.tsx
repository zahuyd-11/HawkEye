"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X, Eye } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LanguageToggle } from "@/components/language/language-toggle";
import { useLanguage } from "@/components/providers/language-provider";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-7xl mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="relative h-9 w-9 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-lg">
            {!logoError ? (
              <Image
                src="/hawkeye-logo.svg"
                alt="HawkEye Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
                priority
                onError={() => setLogoError(true)}
              />
            ) : (
              <Eye className="h-5 w-5 text-primary" />
            )}
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">HawkEye</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/dashboard/deal-digest" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.dealDigest")}
          </Link>
          <Link href="/dashboard/trade-plan" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.tradePlans")}
          </Link>
          <Link href="/dashboard/micro-research" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.microResearch")}
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.pricing")}
          </Link>
          <Link href="/community" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.community")}
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <LanguageToggle />
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">{t("nav.dashboard")}</Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost">{t("nav.login")}</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>{t("nav.startFree")}</Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col space-y-4 px-4 py-4">
            <Link href="/" className="text-sm font-medium">
              {t("nav.home")}
            </Link>
            <Link href="/dashboard/deal-digest" className="text-sm font-medium">
              {t("nav.dealDigest")}
            </Link>
            <Link href="/dashboard/trade-plan" className="text-sm font-medium">
              {t("nav.tradePlans")}
            </Link>
            <Link href="/dashboard/micro-research" className="text-sm font-medium">
              {t("nav.microResearch")}
            </Link>
            <Link href="/pricing" className="text-sm font-medium">
              {t("nav.pricing")}
            </Link>
            <Link href="/community" className="text-sm font-medium">
              {t("nav.community")}
            </Link>
            <div className="pt-2">
              <LanguageToggle />
            </div>
            <div className="pt-4 border-t space-y-2">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">{t("nav.dashboard")}</Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={() => signOut()}>
                    {t("nav.signOut")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="outline" className="w-full">{t("nav.login")}</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full">{t("nav.startFree")}</Button>
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

