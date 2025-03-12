"use client";

import { EventFilters, countActiveFilters } from "./event-filters";
import { MobileFilters } from "./mobile-filters";

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
