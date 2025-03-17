"use client";

import { useEffect, useState, useTransition } from "react";

import { EventCategory } from "@prisma/client";
import { Loader2, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_DISPLAY_NAMES, DATE_DISPLAY_NAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SelectedFiltersProps {
  query?: string;
  category?: string;
  date?: string;
}

export function SelectedFilters({ query, category, date }: SelectedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [removingFilter, setRemovingFilter] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const hasFilters = !!(query || (category && category !== "all") || (date && date !== "upcoming"));

  useEffect(() => {
    if (!isPending && removingFilter) {
      const id = setTimeout(() => {
        setRemovingFilter(null);
      }, 100);
      setTimeoutId(id);

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [isPending, removingFilter]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  if (!hasFilters) return null;

  const createFilterRemover = (key: string) => {
    return () => {
      if (isPending) return;

      setRemovingFilter(key);

      startTransition(() => {
        try {
          const params = new URLSearchParams(searchParams?.toString() || "");
          params.delete(key);
          router.push(`/events?${params.toString()}`);
        } catch (error) {
          console.error("Error during navigation:", error);
          setRemovingFilter(null);
        }
      });
    };
  };

  const resetAllFilters = () => {
    if (isPending) return;

    setRemovingFilter("all");

    startTransition(() => {
      try {
        router.push("/events");
      } catch (error) {
        console.error("Error during navigation:", error);
        setRemovingFilter(null);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-muted-foreground mr-1 text-sm">Filters:</div>

      {query && (
        <Badge
          variant="secondary"
          className={cn(
            "flex items-center gap-1 py-1 transition-all",
            removingFilter === "query" && "scale-95 opacity-50",
          )}
        >
          <span>Search: {query}</span>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted ml-1 h-4 w-4 p-0"
            onClick={createFilterRemover("query")}
            disabled={isPending}
          >
            {removingFilter === "query" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <X className="h-3 w-3" />
            )}
            <span className="sr-only">Clear search filter</span>
          </Button>
        </Badge>
      )}

      {category && category !== "all" && (
        <Badge
          variant="secondary"
          className={cn(
            "flex items-center gap-1 py-1 transition-all",
            removingFilter === "category" && "scale-95 opacity-50",
          )}
        >
          <span>
            Category: {CATEGORY_DISPLAY_NAMES[category.toUpperCase() as EventCategory] || category}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted ml-1 h-4 w-4 p-0"
            onClick={createFilterRemover("category")}
            disabled={isPending}
          >
            {removingFilter === "category" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <X className="h-3 w-3" />
            )}
            <span className="sr-only">Clear category filter</span>
          </Button>
        </Badge>
      )}

      {date && date !== "upcoming" && (
        <Badge
          variant="secondary"
          className={cn(
            "flex items-center gap-1 py-1 transition-all",
            removingFilter === "date" && "scale-95 opacity-50",
          )}
        >
          <span>Date: {DATE_DISPLAY_NAMES[date] || date}</span>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted ml-1 h-4 w-4 p-0"
            onClick={createFilterRemover("date")}
            disabled={isPending}
          >
            {removingFilter === "date" ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <X className="h-3 w-3" />
            )}
            <span className="sr-only">Clear date filter</span>
          </Button>
        </Badge>
      )}

      <Button
        variant="outline"
        size="sm"
        className={cn(
          "ml-auto h-7 text-xs transition-all",
          removingFilter === "all" && "opacity-70",
        )}
        onClick={resetAllFilters}
        disabled={isPending}
      >
        {removingFilter === "all" ? (
          <>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Resetting...
          </>
        ) : (
          "Reset all"
        )}
      </Button>
    </div>
  );
}
