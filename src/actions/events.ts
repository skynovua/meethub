"use server";

import { EventCategory } from "@prisma/client";
import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";

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

/**
 * Fetches events with filtering and pagination
 */
export async function getAllEvents({
  query = "",
  category = "all",
  date = "upcoming",
  page = 1,
  limit = 12,
}: GetAllEventsOptions): Promise<EventWithDetails[]> {
  try {
    const skip = (page - 1) * limit;

    // Build the where clause based on filters
    let whereClause: any = {};

    // Search filter
    if (query) {
      whereClause = {
        ...whereClause,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      };
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
      const start = startOfToday();
      const end = endOfToday();
      whereClause.date = {
        gte: start,
        lte: end,
      };
    } else if (date === "week") {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      whereClause.date = {
        gte: start,
        lte: end,
      };
    } else if (date === "month") {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      whereClause.date = {
        gte: start,
        lte: end,
      };
    }

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
        favorites: true,
        bookmarks: true,
      },
      skip,
      take: limit,
    });

    // Transform to include counts
    return events.map((event) => ({
      ...event,
      favoriteCount: event.favorites.length,
      bookmarkCount: event.bookmarks.length,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Fetches events created by a specific user
 */
export async function getUserCreatedEvents(userId: string): Promise<EventWithDetails[]> {
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

    return events.map((event) => ({
      ...event,
      favoriteCount: event.favorites.length,
      bookmarkCount: event.bookmarks.length,
    }));
  } catch (error) {
    console.error("Error fetching user created events:", error);
    return [];
  }
}

/**
 * Fetches events a user has bookmarked
 */
export async function getUserAttendingEvents(userId: string): Promise<EventWithDetails[]> {
  try {
    const bookmarkedEvents = await db.event.findMany({
      where: {
        bookmarks: {
          some: {
            user_id: userId,
          },
        },
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

    return bookmarkedEvents.map((event) => ({
      ...event,
      favoriteCount: event.favorites.length,
      bookmarkCount: event.bookmarks.length,
    }));
  } catch (error) {
    console.error("Error fetching user bookmarked events:", error);
    return [];
  }
}

/**
 * Fetches events a user has favorited
 */
export async function getUserFavoritedEvents(userId: string): Promise<EventWithDetails[]> {
  try {
    const favoritedEvents = await db.event.findMany({
      where: {
        favorites: {
          some: {
            user_id: userId,
          },
        },
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

    return favoritedEvents.map((event) => ({
      ...event,
      favoriteCount: event.favorites.length,
      bookmarkCount: event.bookmarks.length,
    }));
  } catch (error) {
    console.error("Error fetching user favorited events:", error);
    return [];
  }
}
