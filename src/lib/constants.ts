// Define enum to match Prisma schema
import { EventCategory } from "@prisma/client";
import { Calendar, CalendarClock, CalendarRange } from "lucide-react";

// Array of enum values for use in components
export const EVENT_CATEGORIES = Object.values(EventCategory);

// Map of enum values to display names
export const CATEGORY_DISPLAY_NAMES: Record<EventCategory, string> = {
  [EventCategory.CONFERENCE]: "Conference",
  [EventCategory.WORKSHOP]: "Workshop",
  [EventCategory.SEMINAR]: "Seminar",
  [EventCategory.NETWORKING]: "Networking",
  [EventCategory.SOCIAL]: "Social",
  [EventCategory.TECH]: "Tech",
  [EventCategory.BUSINESS]: "Business",
  [EventCategory.ARTS]: "Arts",
  [EventCategory.SPORTS]: "Sports",
  [EventCategory.EDUCATION]: "Education",
  [EventCategory.ENTERTAINMENT]: "Entertainment",
  [EventCategory.COMMUNITY]: "Community",
  [EventCategory.OTHER]: "Other",
};

// Array of date filters for use in components
export const DATE_FILTERS = [
  { value: "upcoming", label: "Upcoming", icon: CalendarClock },
  { value: "today", label: "Today", icon: Calendar },
  { value: "week", label: "This week", icon: CalendarRange },
  { value: "month", label: "This month", icon: CalendarRange },
  { value: "past", label: "Past", icon: CalendarClock },
];

// Map of date filter values to display names
export const DATE_DISPLAY_NAMES = DATE_FILTERS.reduce(
  (acc, filter) => {
    acc[filter.value] = filter.label;
    return acc;
  },
  {} as Record<string, string>,
);
