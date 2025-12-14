"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Check, FileText, TrendingUp, Shield, BarChart3, Target, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { TradePlanPreview } from "@/components/trade-plans/trade-plan-preview";
import { PricingComparison } from "@/components/pricing/PricingComparison";

export default function HomePage() {
  const { t } = useLanguage();

  // Dummy avatars for social proof
  const avatars = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    name: `User ${i + 1}`,
    // Using placeholder avatar service
    src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section - 2 Column Layout */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
          <div className="absolute inset-0 bg-cyber-grid opacity-15"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-slate-900/20"></div>
          <div className="container px-4 py-24 md:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Left Column - Value Prop & CTA */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-[#d9dbde] text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>{t("hero.badge")}</span>
                </div>
                
                <h1 
                  className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent leading-tight pb-4"
                  style={{
                    backgroundImage: "linear-gradient(90deg, rgba(96, 165, 250, 1) 0%, rgba(252, 211, 77, 1) 100%)",
                    WebkitBackgroundClip: "text",
                    color: "transparent"
                  }}
                  dangerouslySetInnerHTML={{ __html: t("hero.title") }}
                />
                
                <p className="text-lg text-white sm:text-xl md:text-2xl leading-relaxed">
                  {t("hero.subtitle")}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full sm:w-auto group bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white border-0 shadow-lg">
                      {t("hero.ctaPrimary")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/sample-report">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      {t("hero.ctaSecondary")}
                    </Button>
                  </Link>
                </div>

                {/* Social Proof */}
                <div className="pt-6 space-y-4">
                  <p className="text-sm text-white/80 font-medium">{t("hero.trustedBy")}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-3">
                      {avatars.slice(0, 5).map((avatar) => (
                        <div
                          key={avatar.id}
                          className="relative h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 backdrop-blur-sm"
                        >
                          <Image
                            src={avatar.src}
                            alt={avatar.name}
                            width={40}
                            height={40}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      <span className="font-semibold text-white">1,000+</span>
                      <span>{t("hero.investorsCount")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Visual/Dashboard Mockup */}
              <motion.div 
                className="relative lg:block hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <div className="relative">
                  {/* Glassmorphism Card with Dashboard Mockup */}
                  <div className="glass rounded-2xl p-8 shadow-2xl border border-primary/20">
                    <div className="space-y-4">
                      {/* Mock Dashboard Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                          <span className="text-sm font-medium text-foreground">HawkEye Dashboard</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/50"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/50"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/50"></div>
                        </div>
                      </div>
                      
                      {/* Mock Chart */}
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-end justify-around p-4 gap-2">
                        {[40, 60, 45, 80, 70, 90, 75].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                      
                      {/* Mock Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Risk Score", value: "7.2", trend: "+0.3" },
                          { label: "ROI", value: "24.5%", trend: "+5.2%" },
                          { label: "Active", value: "12", trend: "+3" },
                        ].map((stat, i) => (
                          <div key={i} className="glass rounded-lg p-3 border border-white/10">
                            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                            <p className="text-lg font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-emerald-400 mt-1">{stat.trend}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 h-24 w-24 bg-accent/20 rounded-full blur-2xl -z-10"></div>
                  <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-primary/20 rounded-full blur-3xl -z-10">                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <TradePlanPreview />

        {/* Value Proposition */}
        <section className="container px-4 py-16 bg-muted/50">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg animate-fade-in-up">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("valueProp.riskAnalysis.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("valueProp.riskAnalysis.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("valueProp.riskAlerts.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("valueProp.riskAlerts.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("valueProp.decisionFrameworks.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("valueProp.decisionFrameworks.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-16 bg-muted/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in-up">{t("features.title")}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up">
                <CardHeader>
                  <FileText className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{t("features.dealDigest.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("features.dealDigest.description")}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{t("features.tradePlan.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("features.tradePlan.description")}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>{t("features.microResearch.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("features.microResearch.description")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in-up">{t("pricing.title")}</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {/* Free Tier */}
              <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">0₫</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">1 report per month</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Limited DealDigest access</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Basic TradePlan features</span>
                    </div>
                  </div>
                  <Link href="/auth/signup">
                    <Button variant="outline" className="w-full">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Mini Tier */}
              <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
                <CardHeader>
                  <CardTitle>Mini</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">99,000₫</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">5 reports per month</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Real-time data</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Basic TradePlan</span>
                    </div>
                  </div>
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full">Choose Mini</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Plus Tier */}
              <Card className="glass border-primary border-2 hover:border-primary/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up relative scale-105 shadow-lg ring-2 ring-primary/20" style={{ animationDelay: "0.1s" }}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold shadow-md">
                    Phổ biến
                  </span>
                </div>
                <CardHeader>
                  <CardTitle>Plus</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">249,000₫</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Unlimited DealDigest</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Advanced TradePlan</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Real-time macro data</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Full Micro Research</span>
                    </div>
                  </div>
                  <Link href="/pricing">
                    <Button className="w-full">Choose Plus</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Pro Tier */}
              <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">499,000₫</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Everything in Plus</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Phái sinh & ETF</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">1-1 Support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </div>
                  </div>
                  <Link href="/pricing">
                    <Button className="w-full">Choose Pro</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Feature Comparison Table */}
            <PricingComparison />
          </div>
        </section>

        {/* Final CTA */}
        <section className="container px-4 py-16 bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Join over 20,000 investors who use HawkEye to invest with clarity and confidence.
            </h2>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="mt-8">
                Start Free Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
