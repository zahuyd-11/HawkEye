import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Download, ArrowLeft } from "lucide-react";

export default function SampleReportPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Sample DealDigest Report</CardTitle>
              <CardDescription>
                This is an example of a complete DealDigest report for VCB (Vietcombank)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-[8.5/11] bg-muted rounded-lg flex items-center justify-center mb-6">
                <div className="text-center p-8">
                  <p className="text-2xl font-bold mb-4">VCB - Vietcombank</p>
                  <p className="text-muted-foreground mb-6">
                    Sample DealDigest Report Preview
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the actual PDF preview.
                    In production, this would display the full DealDigest report.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Report Sections:</h3>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Business Overview</li>
                  <li>Financial Health Summary</li>
                  <li>Growth Catalysts</li>
                  <li>Risk Factors & Risk Score</li>
                  <li>If-Then Action Checklist</li>
                </ul>
              </div>

              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Sample PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

