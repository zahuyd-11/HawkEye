"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: {
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
  };
}

export function PostCard({ post }: PostCardProps) {
  const authorName = post.author.name || post.author.email.split("@")[0] || "Guest";
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Get snippet (first 150 characters)
  const snippet = post.content.length > 150 ? post.content.slice(0, 150) + "..." : post.content;

  return (
    <Link href={`/community/${post.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post.author.image || undefined} />
                    <AvatarFallback>{authorInitials}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 line-clamp-3">{snippet}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{post._count.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post._count.comments}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

