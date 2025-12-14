"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { DealDigestReport } from "@/components/deal-digest/DealDigestReport";
import { hpgMockData } from "@/data/mock-hpg-data";

export default function DealDigestReportPage() {
  const params = useParams();

  // For demo: Use HPG mock data if ID is "hpg" or use API data otherwise
  const useMockData = params.id === "hpg" || params.id === "1";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container px-4">
        {/* Print Controls - Hidden when printing */}
        <div className="mb-6 print:hidden flex items-center justify-between">
          <Link href={`/dashboard/deal-digest/${params.id}`}>
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Summary
            </Button>
          </Link>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save as PDF
          </Button>
        </div>

        {/* Report Component */}
        {useMockData ? (
          <div className="bg-white shadow-lg print:shadow-none">
            <DealDigestReport data={hpgMockData} />
          </div>
        ) : (
          <div className="bg-white p-12 text-center">
            <p className="text-muted-foreground">Report not available for this DealDigest</p>
            <Link href={`/dashboard/deal-digest/${params.id}`}>
              <Button className="mt-4">Back to Summary</Button>
            </Link>
          </div>
        )}

        {/* Print Instructions */}
        <div className="mt-6 print:hidden text-center text-sm text-muted-foreground">
          <p>💡 Tip: Use your browser's Print function (Ctrl+P / Cmd+P) to save as PDF</p>
          <p className="mt-1">The report is optimized for A4 paper size (210mm × 297mm)</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

