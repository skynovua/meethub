"use server";

import { EventCategory } from "@prisma/client";
import { endOfMonth, endOfToday, endOfWeek } from "date-fns";
import { unstable_cache } from "next/cache";

// Імпортуємо функцію кешування

import { uploadImage } from "@/actions/image";
import { getUserByEmail } from "@/actions/user";
import { auth } from "@/core/auth";
import { db } from "@/core/prisma";
import { EventWithDetails } from "@/types/event";

// Define types for event queries that include relationships
interface GetAllEventsOptions {
  query?: string;
  category?: string;
  date?: string;
  page?: number;
  limit?: number;
}

interface CreateEventData {
  title: string;
  description: string;
  date: Date;
  address: string;
  banner: string;
  category?: EventCategory;
  has_tickets?: boolean; // Додано поле для наявності квитків
  price?: number | null; // Додано поле для ціни квитків
}

// Функція для трансформації результатів запиту
const transformEventDetails = (events: any[]): EventWithDetails[] => {
  return events.map((event) => ({
    ...event,
    favoriteCount: event.favorites.length,
    bookmarkCount: event.bookmarks.length,
  }));
};

/**
 * Fetches events with filtering and pagination - з кешуванням для підвищення продуктивності
 */
export const getAllEvents = unstable_cache(
  async ({
    query = "",
    category = "all",
    date = "upcoming",
    page = 1,
    limit = 12,
  }: GetAllEventsOptions): Promise<EventWithDetails[]> => {
    try {
      const skip = (page - 1) * limit;
      // Build the where clause based on filters
      const whereClause: any = {};

      // Search filter
      if (query) {
        whereClause.OR = [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ];
      }

      // Category filter
      if (category && category !== "all") {
        // Convert string category to enum value
        const categoryEnum = category.toUpperCase() as EventCategory;
        // Only add if it's a valid enum value
        if (Object.values(EventCategory).includes(categoryEnum)) {
          whereClause.category = categoryEnum;
        }
      }

      // Date filter
      const now = new Date();
      if (date === "upcoming") {
        whereClause.date = { gte: now };
      } else if (date === "today") {
        const end = endOfToday();
        whereClause.date = {
          gte: now,
          lte: end,
        };
      } else if (date === "week") {
        const end = endOfWeek(now, { weekStartsOn: 1 });
        whereClause.date = {
          gte: now,
          lte: end,
        };
      } else if (date === "month") {
        const end = endOfMonth(now);
        whereClause.date = {
          gte: now,
          lte: end,
        };
      } else if (date === "past") {
        whereClause.date = { lt: now };
      }

      // Оптимізований запит: обмежуємо вибрані поля для покращення продуктивності
      const events = await db.event.findMany({
        where: whereClause,
        orderBy: {
          date: "asc",
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          favorites: {
            select: {
              user_id: true,
            },
          },
          bookmarks: {
            select: {
              user_id: true,
            },
          },
        },
        skip,
        take: limit,
      });

      // Transform to include counts
      return transformEventDetails(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },
  ["events-list"], // Ключ для кешування
  { revalidate: 300 }, // Оновлювати кеш кожні 5 хвилин
);

/**
 * Fetches events sorted by popularity (most favorited first) - з кешуванням
 */
export const getPopularEvents = unstable_cache(
  async (limit = 10): Promise<EventWithDetails[]> => {
    try {
      const now = new Date();
      const events = await db.event.findMany({
        where: {
          date: {
            gte: now,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          favorites: true,
          bookmarks: true,
        },
        orderBy: {
          favorites: {
            _count: "desc",
          },
        },
        take: limit,
      });

      return transformEventDetails(events);
    } catch (error) {
      console.error("Error fetching popular events:", error);
      return [];
    }
  },
  ["popular-events"],
  { revalidate: 600 }, // Оновлювати кеш кожні 10 хвилин
);

/**
 * Fetches events created by a specific user - з кешуванням
 */
export const getUserCreatedEvents = unstable_cache(
  async (userId: string): Promise<EventWithDetails[]> => {
    try {
      const events = await db.event.findMany({
        where: {
          user_id: userId,
        },
        orderBy: {
          date: "asc",
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          favorites: true,
          bookmarks: true,
        },
      });

      return transformEventDetails(events);
    } catch (error) {
      console.error("Error fetching user created events:", error);
      return [];
    }
  },
  ["user-events"],
  { revalidate: 300 },
);

/**
 * Fetches events a user has bookmarked
 */
export async function getUserBookmarkedEvents(userId?: string): Promise<EventWithDetails[]> {
  try {
    // If userId is not provided, use the current authenticated user
    if (!userId) {
      const session = await auth();
      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      const user = await getUserByEmail(session.user.email!);
      if (!user) {
        throw new Error("User not found");
      }
      userId = user.id;
    }

    const now = new Date();

    const events = await db.event.findMany({
      where: {
        bookmarks: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        favorites: true,
        bookmarks: true,
      },
    });

    const eventDetails = events.map((event) => ({
      ...event,
      favoriteCount: event.favorites.length,
      bookmarkCount: event.bookmarks.length,
    }));

    // Sort events: upcoming first (sorted by date asc), then past events (sorted by date desc)
    return eventDetails.sort((a, b) => {
      const aIsPast = a.date < now;
      const bIsPast = b.date < now;

      if (aIsPast && !bIsPast) return 1; // a is past, b is upcoming -> b comes first
      if (!aIsPast && bIsPast) return -1; // a is upcoming, b is past -> a comes first

      if (aIsPast && bIsPast) {
        // Both past: more recent past events first
        return b.date.getTime() - a.date.getTime();
      } else {
        // Both upcoming: earlier events first
        return a.date.getTime() - b.date.getTime();
      }
    });
  } catch (error) {
    console.error("Error fetching user bookmarked events:", error);
    return [];
  }
}

/**
 * Fetches events a user has favorited
 */
export async function getUserFavoritedEvents(userId?: string): Promise<EventWithDetails[]> {
  try {
    // If userId is not provided, use the current authenticated user
    if (!userId) {
      const session = await auth();
      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      const user = await getUserByEmail(session.user.email!);
      if (!user) {
        throw new Error("User not found");
      }
      userId = user.id;
    }

    const now = new Date();

    const events = await db.event.findMany({
      where: {
        favorites: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        favorites: true,
        bookmarks: true,
      },
    });

    const eventDetails = events.map((event) => ({
      ...event,
      favoriteCount: event.favorites.length,
      bookmarkCount: event.bookmarks.length,
    }));

    // Sort events: upcoming first (sorted by date asc), then past events (sorted by date desc)
    return eventDetails.sort((a, b) => {
      const aIsPast = a.date < now;
      const bIsPast = b.date < now;

      if (aIsPast && !bIsPast) return 1; // a is past, b is upcoming -> b comes first
      if (!aIsPast && bIsPast) return -1; // a is upcoming, b is past -> a comes first

      if (aIsPast && bIsPast) {
        // Both past: more recent past events first
        return b.date.getTime() - a.date.getTime();
      } else {
        // Both upcoming: earlier events first
        return a.date.getTime() - b.date.getTime();
      }
    });
  } catch (error) {
    console.error("Error fetching user favorited events:", error);
    return [];
  }
}

/**
 * Get a single event by id - з кешуванням
 */
export const getEventById = unstable_cache(
  async (id: string) => {
    try {
      const event = await db.event.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          favorites: true,
          bookmarks: true,
        },
      });

      if (!event) {
        return null;
      }

      return {
        ...event,
        favoriteCount: event.favorites.length,
        bookmarkCount: event.bookmarks.length,
      };
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  },
  ["event-detail"],
  { revalidate: 60 }, // Оновлювати кеш кожну хвилину для деталей події
);

// Залишаємо функції які модифікують дані без кешування
export async function createEvent(data: CreateEventData) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByEmail(session.user.email!);

  if (!user) {
    throw new Error("User not found");
  }

  // Upload image if it's base64
  let bannerUrl = data.banner;
  if (data.banner?.startsWith("data:")) {
    try {
      bannerUrl = await uploadImage(data.banner);
    } catch (error) {
      console.error("Failed to upload banner:", error);
      throw new Error("Failed to upload banner image");
    }
  }

  try {
    const event = await db.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        address: data.address,
        banner: bannerUrl,
        category: data.category,
        user_id: user.id,
        // Додані поля для квитків
        has_tickets: data.has_tickets || false,
        price: data.price || null,
      },
    });

    return event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event");
  }
}

export async function updateEvent(id: string, data: CreateEventData) {
  // Verify event ownership can be added here for security

  // Upload image if it's base64
  let bannerUrl = data.banner;
  if (data.banner?.startsWith("data:")) {
    try {
      bannerUrl = await uploadImage(data.banner);
    } catch (error) {
      console.error("Failed to upload banner:", error);
      throw new Error("Failed to upload banner image");
    }
  }

  try {
    const event = await db.event.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        address: data.address,
        banner: bannerUrl,
        category: data.category,
        // Додані поля для квитків
        has_tickets: data.has_tickets || false,
        price: data.price || null,
      },
    });

    return event;
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event");
  }
}

export async function deleteEvent(id: string) {
  // Verify event ownership can be added here for security

  try {
    await db.event.delete({
      where: {
        id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    throw new Error("Failed to delete event");
  }
}
