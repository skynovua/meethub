"use client";

import { useState, useTransition } from "react";

import { Loader2, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EventsSearchProps {
  defaultValue?: string;
}

export function EventsSearch({ defaultValue = "" }: EventsSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString());
      if (query.trim()) {
        params.set("query", query.trim());
      } else {
        params.delete("query");
      }
      params.delete("page");

      router.push(`/events?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setQuery("");

    // Також виконуємо пошук з очищеним полем, якщо до цього був запит
    if (defaultValue) {
      startTransition(() => {
        const params = new URLSearchParams(searchParams?.toString());
        params.delete("query");
        params.delete("page");
        router.push(`/events?${params.toString()}`);
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative" role="search">
      <Input
        placeholder="Search events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`pr-20 transition-all ${isPending ? "bg-muted" : ""}`}
        disabled={isPending}
        aria-label="Search events"
      />

      {query && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="absolute top-0 right-8 h-full px-2"
          onClick={handleClear}
          disabled={isPending}
          aria-label="Clear search"
        >
          <X className="text-muted-foreground h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}

      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="absolute top-0 right-0 h-full px-3"
        disabled={isPending}
        aria-label="Search"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
