"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Search, Filter, ArrowUpDown } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { VIETNAM_INDUSTRIES, MARKET_CAP_RANGES } from "@/lib/constants";
import { mockDealDigests, type DealDigestCard } from "@/data/mock-deal-digest";

interface DealDigest {
  id: string;
  ticker: string;
  companyName: string;
  sector: string;
  industry: string;
  marketCap: string;
  riskScore: number | null;
  publishedAt: string | null;
  signal?: "Buy" | "Hold" | "Sell";
  summary?: string;
}

type SortOption = "date-desc" | "date-asc" | "risk-desc" | "risk-asc";

export default function DealDigestPage() {
  const [dealDigests, setDealDigests] = useState<DealDigest[]>([]);
  const [filteredDigests, setFilteredDigests] = useState<DealDigest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [marketCapFilter, setMarketCapFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  useEffect(() => {
    // Use mock data for now
    const mockData: DealDigest[] = mockDealDigests.map((item) => ({
      id: item.id,
      ticker: item.ticker,
      companyName: item.companyName,
      sector: item.sector,
      industry: item.industry,
      marketCap: item.marketCap,
      riskScore: item.riskScore,
      publishedAt: item.publishedAt,
      signal: item.signal,
      summary: item.summary,
    }));
    
    setDealDigests(mockData);
    setFilteredDigests(mockData);
    
    // Try to fetch real data, but fallback to mock
    fetch("/api/deal-digest")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setDealDigests(data);
          setFilteredDigests(data);
        }
      })
      .catch(() => {
        // Silently fail and use mock data
      });
  }, []);

  useEffect(() => {
    let filtered = dealDigests;

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (industryFilter !== "all") {
      filtered = filtered.filter((d) => d.industry === industryFilter);
    }

    if (marketCapFilter !== "all") {
      filtered = filtered.filter((d) => d.marketCap === marketCapFilter);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          if (!a.publishedAt && !b.publishedAt) return 0;
          if (!a.publishedAt) return 1;
          if (!b.publishedAt) return -1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case "date-asc":
          if (!a.publishedAt && !b.publishedAt) return 0;
          if (!a.publishedAt) return 1;
          if (!b.publishedAt) return -1;
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case "risk-desc":
          const riskA = a.riskScore ?? 0;
          const riskB = b.riskScore ?? 0;
          return riskB - riskA;
        case "risk-asc":
          const riskA2 = a.riskScore ?? 0;
          const riskB2 = b.riskScore ?? 0;
          return riskA2 - riskB2;
        default:
          return 0;
      }
    });

    setFilteredDigests(sorted);
  }, [searchTerm, industryFilter, marketCapFilter, sortBy, dealDigests]);

  const industries = Object.keys(VIETNAM_INDUSTRIES);

  return (
    <>
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">DealDigest</h1>
          <p className="text-muted-foreground mt-2">
            Standardized 1-page company analysis reports
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã CK..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Ngành" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ngành</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={marketCapFilter} onValueChange={setMarketCapFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Vốn hóa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {MARKET_CAP_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Mới nhất</SelectItem>
                  <SelectItem value="date-asc">Cũ nhất</SelectItem>
                  <SelectItem value="risk-desc">Rủi ro cao → thấp</SelectItem>
                  <SelectItem value="risk-asc">Rủi ro thấp → cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* DealDigest List - Masonry Grid Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDigests.map((digest) => (
            <Card 
              key={digest.id} 
              className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl font-bold">{digest.ticker}</CardTitle>
                      {digest.signal && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            digest.signal === "Buy"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                              : digest.signal === "Hold"
                              ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                              : "bg-red-500/20 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {digest.signal}
                        </span>
                      )}
                    </div>
                    <CardDescription className="text-base">{digest.companyName}</CardDescription>
                  </div>
                  {digest.riskScore !== null && (
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex-shrink-0 ${
                        digest.riskScore <= 3
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                          : digest.riskScore <= 6
                          ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30"
                      }`}
                    >
                      {digest.riskScore <= 3 ? "Thấp" : digest.riskScore <= 6 ? "TB" : "Cao"}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {digest.summary && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {digest.summary}
                  </p>
                )}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-muted-foreground">Ngành:</span>
                    <span>{digest.industry}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-muted-foreground">Vốn hóa:</span>
                    <span>{digest.marketCap}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/deal-digest/${digest.ticker.toUpperCase()}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" title="Tải xuống">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDigests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No DealDigest reports found</p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </>
  );
}

