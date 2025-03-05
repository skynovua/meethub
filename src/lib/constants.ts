// Define enum to match Prisma schema
import { EventCategory } from "@prisma/client";

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
