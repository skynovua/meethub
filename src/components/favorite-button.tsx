"use client";

import { useState, useTransition } from "react";

import { HeartIcon } from "lucide-react";

import { addToFavorites, removeFromFavorites } from "@/actions/favorite";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  eventId: string;
  initialIsFavorite: boolean;
  favoriteCount: number;
  showCount?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function FavoriteButton({
  eventId,
  initialIsFavorite,
  favoriteCount,
  showCount = true,
  variant = "outline",
  size = "default",
}: FavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [count, setCount] = useState(favoriteCount);

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

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={handleToggleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <HeartIcon
        className={cn("mr-1 h-4 w-4", isFavorite ? "fill-red-500 text-red-500" : "fill-none")}
      />
      {showCount && <span>{count}</span>}
    </Button>
  );
}
