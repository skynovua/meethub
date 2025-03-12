"use client";

import { ChevronLeft, SlidersHorizontal } from "lucide-react";

import { EventFilters } from "@/components/events/event-filters";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileFiltersProps {
  selectedCategory: string;
  selectedDate: string;
  activeFiltersCount: number;
}

export function MobileFilters({
  selectedCategory,
  selectedDate,
  activeFiltersCount,
}: MobileFiltersProps) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 md:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=left]:w-full">
        <ScrollArea>
          <DrawerHeader className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <DrawerTrigger asChild>
                <Button variant={"outline"} size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerTitle>Filters</DrawerTitle>
            </div>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <EventFilters selectedCategory={selectedCategory} selectedDate={selectedDate} />
          </div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerTrigger asChild>
            <Button className="w-full">Apply Filters</Button>
          </DrawerTrigger>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
