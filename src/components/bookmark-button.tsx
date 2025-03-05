"use client";

import { useState, useTransition } from "react";

import { BookmarkIcon } from "lucide-react";

import { addToBookmarks, removeFromBookmarks } from "@/actions/favorite";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  eventId: string;
  initialIsBookmarked: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function BookmarkButton({
  eventId,
  initialIsBookmarked,
  variant = "ghost",
  size = "icon",
}: BookmarkButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const handleToggleBookmark = () => {
    startTransition(async () => {
      try {
        if (isBookmarked) {
          await removeFromBookmarks(eventId);
        } else {
          await addToBookmarks(eventId);
        }
        setIsBookmarked(!isBookmarked);
      } catch (error) {
        console.error("Error toggling bookmark:", error);
      }
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={handleToggleBookmark}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      <BookmarkIcon
        className={cn("h-4 w-4", isBookmarked ? "text-foreground fill-current" : "fill-none")}
      />
    </Button>
  );
}
