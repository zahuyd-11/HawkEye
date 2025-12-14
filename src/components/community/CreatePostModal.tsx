"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

interface CreatePostModalProps {
  onPostCreated?: () => void;
}

export function CreatePostModal({ onPostCreated }: CreatePostModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          authorName: authorName || "Guest User",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create post");
      }

      // Reset form
      setTitle("");
      setContent("");
      setAuthorName("");
      setOpen(false);
      
      // Refresh posts
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Bài Viết
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chia sẻ Ý tưởng Đầu tư</DialogTitle>
          <DialogDescription>
            Chia sẻ phân tích, quan điểm hoặc câu hỏi của bạn với cộng đồng. Bài viết sẽ được kiểm duyệt trước khi hiển thị.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="authorName">Tên của bạn (tùy chọn)</Label>
              <Input
                id="authorName"
                placeholder="Để trống nếu muốn ẩn danh"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề *</Label>
              <Input
                id="title"
                placeholder="Ví dụ: Phân tích HPG - Cơ hội đầu tư Q1/2025"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung *</Label>
              <Textarea
                id="content"
                placeholder="Chia sẻ phân tích, quan điểm hoặc câu hỏi của bạn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || !title || !content}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Đăng bài"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

