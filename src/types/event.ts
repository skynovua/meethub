import { Event } from "@prisma/client";

export type EventWithDetails = Event & {
  user: {
    name: string | null;
    image: string | null;
  };
  favoriteCount: number;
  bookmarkCount: number;
};
