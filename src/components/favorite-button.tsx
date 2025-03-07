"use client";

import { useState, useTransition } from "react";

import { HeartIcon } from "lucide-react";

import { addToFavorites, removeFromFavorites } from "@/actions/favorite";
import { Button } from "@/components/ui/button";
import { useAuthProtection } from "@/hooks/use-auth-protection";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  eventId: string;
  initialIsFavorite: boolean;
  favoriteCount?: number;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showCount?: boolean;
}

export function FavoriteButton({
  eventId,
  initialIsFavorite,
  favoriteCount = 0,
  variant = "ghost",
  size = "icon",
  showCount = false,
}: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [count, setCount] = useState(favoriteCount);
  const { withAuth } = useAuthProtection();

  const handleToggleFavorite = () => {
    startTransition(async () => {
      try {
        if (isFavorite) {
          await removeFromFavorites(eventId);
          setCount((prev) => Math.max(0, prev - 1));
        } else {
          await addToFavorites(eventId);
          setCount((prev) => prev + 1);
        }
        setIsFavorite(!isFavorite);
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    });
  };

  // Wrap the handler with auth check
  const handleClick = withAuth(handleToggleFavorite);

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={handleClick}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(showCount && "gap-2")}
    >
      <HeartIcon
        className={cn("h-4 w-4", isFavorite ? "fill-red-500 text-red-500" : "fill-none")}
      />
      {showCount && count > 0 && <span className="text-xs">{count}</span>}
    </Button>
  );
}
