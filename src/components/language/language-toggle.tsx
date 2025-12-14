"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-full border bg-background/80 text-xs shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setLanguage("vi")}
        className={cn(
          "px-3 py-1.5 transition-colors rounded-l-full",
          language === "vi" 
            ? "bg-primary text-primary-foreground" 
            : "text-muted-foreground hover:bg-muted"
        )}
        title="Tiếng Việt"
      >
        🇻🇳
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "px-3 py-1.5 transition-colors rounded-r-full",
          language === "en" 
            ? "bg-primary text-primary-foreground" 
            : "text-muted-foreground hover:bg-muted"
        )}
        title="English"
      >
        🇺🇸
      </button>
    </div>
  );
}

