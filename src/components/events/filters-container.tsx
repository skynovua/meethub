"use client";

import { EventFilters } from "./event-filters";
import { MobileFilters } from "./mobile-filters";

// Helper function to count active filters (export for reuse)
export function countActiveFilters(category: string, date: string): number {
  let count = 0;

  if (category && category !== "all") {
    count += 1;
  }

  if (date && date !== "upcoming") {
    count += 1;
  }

  return count;
}

interface FiltersContainerProps {
  selectedCategory: string;
  selectedDate: string;
}

export function FiltersContainer({ selectedCategory, selectedDate }: FiltersContainerProps) {
  const activeFiltersCount = countActiveFilters(selectedCategory, selectedDate);

  return (
    <>
      {/* Mobile Filters */}
      <div className="flex items-center justify-between md:hidden">
        <MobileFilters
          selectedCategory={selectedCategory}
          selectedDate={selectedDate}
          activeFiltersCount={activeFiltersCount}
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <EventFilters selectedCategory={selectedCategory} selectedDate={selectedDate} />
      </div>
    </>
  );
}
