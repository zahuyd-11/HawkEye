import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Calendar } from "lucide-react";

export default function BlogPage() {
  // TODO: Fetch from API
  const posts = [
    {
      id: "1",
      title: "Market Overview: Q1 2024",
      excerpt: "A comprehensive look at the Vietnamese stock market performance in Q1 2024...",
      publishedAt: "2024-01-15",
      slug: "market-overview-q1-2024",
    },
    {
      id: "2",
      title: "Understanding Risk Scores",
      excerpt: "Learn how HawkEye calculates and uses risk scores in DealDigest reports...",
      publishedAt: "2024-01-10",
      slug: "understanding-risk-scores",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Weekly market notes and educational investing content
          </p>

          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <Link href={`/blog/${post.slug}`}>
                    <CardTitle className="hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </Link>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`}>
                    <span className="text-primary hover:underline mt-4 inline-block">
                      Read more →
                    </span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

