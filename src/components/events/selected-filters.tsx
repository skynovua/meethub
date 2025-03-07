"use client";

import { EventCategory } from "@prisma/client";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/constants";

interface SelectedFiltersProps {
  query?: string;
  category?: string;
  date?: string;
}

export function SelectedFilters({ query, category, date }: SelectedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasFilters = !!(query || (category && category !== "all") || (date && date !== "upcoming"));

  if (!hasFilters) return null;

  const createFilterRemover = (key: string, value?: string) => {
    return () => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.delete(key);
      router.push(`/events?${params.toString()}`);
    };
  };

  const resetAllFilters = () => {
    router.push("/events");
  };

  // Date display mapping
  const dateDisplay: Record<string, string> = {
    today: "Today",
    week: "This Week",
    month: "This Month",
    upcoming: "Upcoming",
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="text-muted-foreground mr-1 text-sm">Filters:</div>

      {query && (
        <Badge variant="secondary" className="flex items-center gap-1 py-1">
          <span>Search: {query}</span>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted ml-1 h-4 w-4 p-0"
            onClick={createFilterRemover("query")}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search filter</span>
          </Button>
        </Badge>
      )}

      {category && category !== "all" && (
        <Badge variant="secondary" className="flex items-center gap-1 py-1">
          <span>
            Category: {CATEGORY_DISPLAY_NAMES[category.toUpperCase() as EventCategory] || category}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted ml-1 h-4 w-4 p-0"
            onClick={createFilterRemover("category")}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear category filter</span>
          </Button>
        </Badge>
      )}

      {date && date !== "upcoming" && (
        <Badge variant="secondary" className="flex items-center gap-1 py-1">
          <span>Date: {dateDisplay[date] || date}</span>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted ml-1 h-4 w-4 p-0"
            onClick={createFilterRemover("date")}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear date filter</span>
          </Button>
        </Badge>
      )}

      <Button variant="outline" size="sm" className="ml-auto h-7 text-xs" onClick={resetAllFilters}>
        Reset all
      </Button>
    </div>
  );
}
