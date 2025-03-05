import { EventCategory } from "@prisma/client";
import { type VariantProps, cva } from "class-variance-authority";

import { Badge } from "@/components/ui/badge";
import { CATEGORY_DISPLAY_NAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const categoryVariants = cva("font-semibold text-sm px-3 py-1", {
  variants: {
    category: {
      CONFERENCE: "bg-blue-100 text-blue-800 border-blue-200",
      WORKSHOP: "bg-purple-100 text-purple-800 border-purple-200",
      SEMINAR: "bg-teal-100 text-teal-800 border-teal-200",
      NETWORKING: "bg-green-100 text-green-800 border-green-200",
      SOCIAL: "bg-pink-100 text-pink-800 border-pink-200",
      TECH: "bg-indigo-100 text-indigo-800 border-indigo-200",
      BUSINESS: "bg-gray-100 text-gray-800 border-gray-200",
      ARTS: "bg-amber-100 text-amber-800 border-amber-200",
      SPORTS: "bg-lime-100 text-lime-800 border-lime-200",
      EDUCATION: "bg-cyan-100 text-cyan-800 border-cyan-200",
      ENTERTAINMENT: "bg-rose-100 text-rose-800 border-rose-200",
      COMMUNITY: "bg-emerald-100 text-emerald-800 border-emerald-200",
      OTHER: "bg-slate-100 text-slate-800 border-slate-200",
    },
  },
  defaultVariants: {
    category: "OTHER",
  },
});

export interface CategoryBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof categoryVariants> {
  categoryValue?: EventCategory;
}

export function CategoryBadge({
  categoryValue = EventCategory.OTHER,
  className,
  ...props
}: CategoryBadgeProps) {
  // Display the human-readable category name
  const displayName = CATEGORY_DISPLAY_NAMES[categoryValue] || "Other";

  return (
    <Badge
      variant="outline"
      className={cn(categoryVariants({ category: categoryValue, className }))}
      {...props}
    >
      {displayName}
    </Badge>
  );
}
