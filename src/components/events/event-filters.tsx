"use client";

import { EventCategory } from "@prisma/client";
import { Calendar, CalendarClock, CalendarRange, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/constants";

interface EventFiltersProps {
  selectedCategory: string;
  selectedDate: string;
}

export function EventFilters({ selectedCategory, selectedDate }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("category", category);
    params.delete("page");
    router.push(`/events?${params.toString()}`);
  };

  const handleDateChange = (date: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("date", date);
    params.delete("page");
    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListFilter className="h-4 w-4" />
            Category
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <RadioGroup
            value={selectedCategory}
            onValueChange={handleCategoryChange}
            className="gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="category-all" />
              <Label htmlFor="category-all" className="cursor-pointer">
                All Categories
              </Label>
            </div>

            {Object.values(EventCategory).map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={category.toLowerCase()}
                  id={`category-${category.toLowerCase()}`}
                />
                <Label htmlFor={`category-${category.toLowerCase()}`} className="cursor-pointer">
                  {CATEGORY_DISPLAY_NAMES[category] || category}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Date
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <RadioGroup value={selectedDate} onValueChange={handleDateChange} className="gap-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upcoming" id="upcoming" />
              <Label htmlFor="upcoming" className="flex cursor-pointer items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                <span>Upcoming</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="today" id="today" />
              <Label htmlFor="today" className="flex cursor-pointer items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Today</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="week" id="week" />
              <Label htmlFor="week" className="flex cursor-pointer items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                <span>This week</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="month" />
              <Label htmlFor="month" className="flex cursor-pointer items-center gap-2">
                <CalendarRange className="h-4 w-4" />
                <span>This month</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
