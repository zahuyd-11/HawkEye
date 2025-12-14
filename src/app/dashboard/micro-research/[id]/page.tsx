"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

interface MicroResearchDetail {
  id: string;
  title: string;
  ticker: string | null;
  companyName: string | null;
  sector: string | null;
  industry: string | null;
  marketCap: string | null;
  content: string;
  tags: string[];
  publishedAt: string | null;
}

export default function MicroResearchDetailPage() {
  const params = useParams();
  const [research, setResearch] = useState<MicroResearchDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/micro-research/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setResearch(data);
          setLoading(false);
        })
        .catch(console.error);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!research) {
    return (
      <div className="container px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Research article not found</p>
            <Link href="/dashboard/micro-research">
              <Button className="mt-4">Back to Micro Research</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <main className="container px-4 py-8 max-w-4xl">
        <Link href="/dashboard/micro-research">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Micro Research
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{research.title}</CardTitle>
            {research.ticker && (
              <p className="text-muted-foreground mt-2">
                {research.ticker} - {research.companyName}
              </p>
            )}
            {research.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {research.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              {research.sector && (
                <p className="text-sm">
                  <span className="font-medium">Sector:</span> {research.sector}
                </p>
              )}
              {research.industry && (
                <p className="text-sm">
                  <span className="font-medium">Industry:</span> {research.industry}
                </p>
              )}
              {research.marketCap && (
                <p className="text-sm">
                  <span className="font-medium">Market Cap:</span> {research.marketCap}
                </p>
              )}
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{research.content}</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}

