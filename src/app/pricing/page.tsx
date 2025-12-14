import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Check } from "lucide-react";
import { SUBSCRIPTION_TIERS } from "@/lib/constants";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Pricing</h1>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your investment needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">0₫</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">1 report per month</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Limited DealDigest access</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Basic TradePlan features</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">1 VN30 analysis per quarter</span>
                  </div>
                </div>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Plus Tier */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Plus</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">249,000₫</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  or {SUBSCRIPTION_TIERS.PLUS.priceYearly?.toLocaleString()}₫/year
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">5 reports per month</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Full DealDigest access</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Standard TradePlan features</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Full Micro Research library</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Risk alerts</span>
                  </div>
                </div>
                <Link href="/dashboard/subscription?tier=PLUS">
                  <Button className="w-full">Choose Plus</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">499,000₫</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  or {SUBSCRIPTION_TIERS.PRO.priceYearly?.toLocaleString()}₫/year
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Unlimited reports</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Full DealDigest access</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Advanced TradePlan features</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Full Micro Research + 1-2 requests/quarter</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Risk alerts</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
                <Link href="/dashboard/subscription?tier=PRO">
                  <Button className="w-full">Choose Pro</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

