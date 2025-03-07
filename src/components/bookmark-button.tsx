"use client";

import { useState, useTransition } from "react";

import { BookmarkIcon } from "lucide-react";

import { addToBookmarks, removeFromBookmarks } from "@/actions/favorite";
import { Button } from "@/components/ui/button";
import { useAuthProtection } from "@/hooks/use-auth-protection";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  eventId: string;
  initialIsBookmarked: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary";
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
  const { withAuth } = useAuthProtection();

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

  // Wrap the handler with auth check
  const handleClick = withAuth(handleToggleBookmark);

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={handleClick}
      aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      <BookmarkIcon
        className={cn("h-4 w-4", isBookmarked ? "text-foreground fill-current" : "fill-none")}
      />
    </Button>
  );
}
