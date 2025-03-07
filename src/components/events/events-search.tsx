"use client";

import { useState } from "react";

import { Search } from "lucide-react";
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams?.toString());
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    params.delete("page");

    router.push(`/events?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Input
        placeholder="Search events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-12"
      />
      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="absolute top-0 right-0 h-full px-3"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
