"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { DealDigestWeb } from "@/components/deal-digest/DealDigestWeb";
import { getStockData } from "@/data/mock-stocks-data";
import type { StockData } from "@/data/mock-stocks-data";

export default function DealDigestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const ticker = (params.id as string)?.toUpperCase().trim();
      if (ticker) {
        const data = getStockData(ticker);
        if (data) {
          setStockData(data);
          setNotFound(false);
        } else {
          setStockData(null);
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
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

  if (notFound || !stockData) {
    return (
      <>
        <main className="container px-4 py-8 max-w-5xl">
          <div className="mb-6">
            <Link href="/dashboard/deal-digest">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to DealDigest
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">DealDigest Not Found</h1>
            <p className="text-muted-foreground mb-4">
              Không tìm thấy phân tích cho mã cổ phiếu "{params.id}". Vui lòng thử lại với mã khác.
            </p>
            <Link href="/dashboard/deal-digest">
              <Button>Back to DealDigest</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="container px-4 py-8 max-w-5xl">
        <div className="mb-6">
          <Link href="/dashboard/deal-digest">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to DealDigest
            </Button>
          </Link>
        </div>

        <DealDigestWeb data={stockData} />
      </main>
      <Footer />
    </>
  );
}

