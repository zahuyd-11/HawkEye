"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CreatePostModal } from "@/components/community/CreatePostModal";
import { PostCard } from "@/components/community/PostCard";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/community/posts?status=APPROVED");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Cộng Đồng</h1>
              <p className="text-lg text-muted-foreground">
                Chia sẻ ý tưởng đầu tư và thảo luận với cộng đồng
              </p>
            </div>
            <CreatePostModal onPostCreated={fetchPosts} />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="text-primary hover:underline"
              >
                Thử lại
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Chưa có bài viết nào.</p>
              <CreatePostModal onPostCreated={fetchPosts} />
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

