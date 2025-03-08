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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    } else if (date === "past") {
      whereClause.date = { lt: now };
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
 * Fetches events sorted by popularity (most favorited first)
 */
export async function getPopularEvents(limit = 10): Promise<EventWithDetails[]> {
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

    return events.map((event) => ({
      ...event,
      favoriteCount: event.favorites.length,
      bookmarkCount: event.bookmarks.length,
    }));
  } catch (error) {
    console.error("Error fetching popular events:", error);
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

    const events = await db.event.findMany({
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

    return events.map((event) => ({
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

    const events = await db.event.findMany({
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

    return events.map((event) => ({
      ...event,
      favoriteCount: event.favorites.length,
      bookmarkCount: event.bookmarks.length,
    }));
  } catch (error) {
    console.error("Error fetching user favorited events:", error);
    return [];
  }
}

/**
 * Get a single event by id
 */
export async function getEventById(id: string) {
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
}

/**
 * Create a new event
 */
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
      },
    });

    return event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event");
  }
}

/**
 * Update an existing event
 */
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
      },
    });

    return event;
  } catch (error) {
    console.error("Error updating event:", error);
    throw new Error("Failed to update event");
  }
}

/**
 * Delete an event
 */
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
