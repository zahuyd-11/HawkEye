"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Heart, MessageCircle, Send, Loader2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    email: string;
  };
}

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
  comments: Comment[];
  _count: {
    comments: number;
    likes: number;
  };
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/community/posts/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !post) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          authorName: authorName || "Guest User",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      // Refresh post to get new comment
      const updatedPost = await fetch(`/api/community/posts/${params.id}`).then((res) => res.json());
      setPost(updatedPost);
      setComment("");
      setAuthorName("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container px-4 py-16">
          <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container px-4 py-16">
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-muted-foreground mb-4">Không tìm thấy bài viết.</p>
            <Link href="/community">
              <Button variant="outline">Quay lại Cộng đồng</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const authorNameDisplay = post.author.name || post.author.email.split("@")[0] || "Guest";
  const authorInitials = authorNameDisplay
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link href="/community">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại Cộng đồng
            </Button>
          </Link>

          {/* Post Content */}
          <Card className="mb-6">
            <CardHeader>
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.image || undefined} />
                    <AvatarFallback>{authorInitials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{authorNameDisplay}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post._count.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post._count.comments}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Bình luận ({post.comments.length})</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Tên của bạn (tùy chọn)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="mb-2"
                  />
                  <Textarea
                    placeholder="Viết bình luận..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Gửi bình luận
                    </>
                  )}
                </Button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {post.comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Chưa có bình luận nào.</p>
                ) : (
                  post.comments.map((comment) => {
                    const commentAuthorName = comment.author.name || comment.author.email.split("@")[0] || "Guest";
                    const commentAuthorInitials = commentAuthorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div key={comment.id} className="flex gap-4 pb-4 border-b last:border-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.author.image || undefined} />
                          <AvatarFallback>{commentAuthorInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{commentAuthorName}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

