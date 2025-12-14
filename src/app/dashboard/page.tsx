"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, TrendingUp, BookOpen, AlertTriangle, Eye, ArrowRight } from "lucide-react";
import { Footer } from "@/components/layout/footer";

interface DashboardStats {
  watchlistCount: number;
  recentDealDigests: number;
  recentMicroResearch: number;
  riskAlerts: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    watchlistCount: 0,
    recentDealDigests: 0,
    recentMicroResearch: 0,
    riskAlerts: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.watchlistCount}</div>
              <p className="text-xs text-muted-foreground">Companies tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DealDigest</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentDealDigests}</div>
              <p className="text-xs text-muted-foreground">Recent reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Micro Research</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentMicroResearch}</div>
              <p className="text-xs text-muted-foreground">Available reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.riskAlerts}</div>
              <p className="text-xs text-muted-foreground">Active alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>DealDigest</CardTitle>
              <CardDescription>
                View standardized company analysis reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/deal-digest">
                <Button className="w-full">
                  View Reports <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TradePlan Builder</CardTitle>
              <CardDescription>
                Create and manage your trading plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/trade-plan">
                <Button className="w-full">
                  Build Plan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Micro Research</CardTitle>
              <CardDescription>
                Browse short company research notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/micro-research">
                <Button className="w-full">
                  Browse Library <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Market Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Real-time market data and indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">VNIndex</p>
                <p className="text-2xl font-bold">1,234.56</p>
                <p className="text-sm text-green-600">+1.23%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">HNX</p>
                <p className="text-2xl font-bold">234.56</p>
                <p className="text-sm text-red-600">-0.45%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">UPCOM</p>
                <p className="text-2xl font-bold">89.12</p>
                <p className="text-sm text-green-600">+0.12%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Viewed DealDigest: VCB</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Created TradePlan: VIC</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Read Micro Research: Banking Sector</p>
                  <p className="text-sm text-muted-foreground">3 days ago</p>
                </div>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}

