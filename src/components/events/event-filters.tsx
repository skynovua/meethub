"use client";

import { useEffect, useState, useTransition } from "react";

import { EventCategory } from "@prisma/client";
import { Calendar, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CATEGORY_DISPLAY_NAMES, DATE_FILTERS } from "@/lib/constants";

interface EventFiltersProps {
  selectedCategory: string;
  selectedDate: string;
  className?: string;
}

export function EventFilters({
  selectedCategory,
  selectedDate,
  className = "",
}: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localDate, setLocalDate] = useState(selectedDate);

  // Sync local state with props when they change
  useEffect(() => {
    setLocalCategory(selectedCategory);
    setLocalDate(selectedDate);
  }, [selectedCategory, selectedDate]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set(name, value);
    params.delete("page");
    return params.toString();
  };

  const handleFilterChange = (name: string, value: string) => {
    if (name === "category") {
      setLocalCategory(value);
    } else {
      setLocalDate(value);
    }

    startTransition(() => {
      router.push(`/events?${createQueryString(name, value)}`);
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className={isPending ? "pointer-events-none opacity-70" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListFilter className="h-4 w-4" />
            Category
            {isPending && (
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <RadioGroup
            value={localCategory}
            onValueChange={(value) => handleFilterChange("category", value)}
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
                <Label
                  htmlFor={`category-${category.toLowerCase()}`}
                  className={`cursor-pointer transition-colors ${localCategory === category.toLowerCase() ? "text-primary font-medium" : ""}`}
                >
                  {CATEGORY_DISPLAY_NAMES[category] || category}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className={isPending ? "pointer-events-none opacity-70" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Date
            {isPending && (
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <RadioGroup
            value={localDate}
            onValueChange={(value) => handleFilterChange("date", value)}
            className="gap-2"
          >
            {DATE_FILTERS.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <RadioGroupItem value={item.value} id={item.value} />
                <Label
                  htmlFor={item.value}
                  className={`flex cursor-pointer items-center space-x-2 transition-colors ${localDate === item.value ? "text-primary font-medium" : ""}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
