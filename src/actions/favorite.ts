"use server";

import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

import { getUserByEmail } from "@/actions/user";
import { auth } from "@/core/auth";
import { db } from "@/core/prisma";

// Додати подію до вподобань
export const addToFavorites = async (eventId: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new AuthError("You must be signed in to add favorites");
    }

    const user = await getUserByEmail(session.user.email!);

    if (!user) {
      throw new Error("User not found");
    }

    // Перевіряємо, чи вже є вподобання
    const existingFavorite = await db.favorite.findUnique({
      where: {
        user_id_event_id: {
          user_id: user.id,
          event_id: eventId,
        },
      },
    });

    if (existingFavorite) {
      return { message: "Already in favorites" };
    }

    // Додаємо подію до вподобань
    await db.favorite.create({
      data: {
        user_id: user.id,
        event_id: eventId,
      },
    });

    revalidatePath("/");
    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    if (error instanceof AuthError) {
      throw error;
    }
    throw new Error(
      `Failed to add to favorites: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Видалити подію з вподобань
export const removeFromFavorites = async (eventId: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new AuthError("You must be signed in to remove favorites");
    }

    const user = await getUserByEmail(session.user.email!);

    if (!user) {
      throw new Error("User not found");
    }

    await db.favorite.delete({
      where: {
        user_id_event_id: {
          user_id: user.id,
          event_id: eventId,
        },
      },
    });

    revalidatePath("/");
    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    if (error instanceof AuthError) {
      throw error;
    }
    throw new Error(
      `Failed to remove from favorites: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Додати подію до закладок
export const addToBookmarks = async (eventId: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new AuthError("You must be signed in to bookmark events");
    }

    const user = await getUserByEmail(session.user.email!);

    if (!user) {
      throw new Error("User not found");
    }

    // Перевіряємо, чи вже є в закладках
    const existingBookmark = await db.bookmark.findUnique({
      where: {
        user_id_event_id: {
          user_id: user.id,
          event_id: eventId,
        },
      },
    });

    if (existingBookmark) {
      return { message: "Already bookmarked" };
    }

    // Додаємо подію до закладок
    await db.bookmark.create({
      data: {
        user_id: user.id,
        event_id: eventId,
      },
    });

    revalidatePath("/saved");

    return { success: true };
  } catch (error) {
    console.error("Error adding to bookmarks:", error);
    if (error instanceof AuthError) {
      throw error;
    }
    throw new Error(
      `Failed to add to bookmarks: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Видалити подію із закладок
export const removeFromBookmarks = async (eventId: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new AuthError("You must be signed in to remove bookmarks");
    }

    const user = await getUserByEmail(session.user.email!);

    if (!user) {
      throw new Error("User not found");
    }

    await db.bookmark.delete({
      where: {
        user_id_event_id: {
          user_id: user.id,
          event_id: eventId,
        },
      },
    });

    revalidatePath("/saved");

    return { success: true };
  } catch (error) {
    console.error("Error removing from bookmarks:", error);
    if (error instanceof AuthError) {
      throw error;
    }
    throw new Error(
      `Failed to remove from bookmarks: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

// Перевірити, чи подія у вподобаннях
export const isEventFavorite = async (eventId: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return false;
    }

    const user = await getUserByEmail(session.user.email!);

    if (!user) {
      return false;
    }

    const favorite = await db.favorite.findUnique({
      where: {
        user_id_event_id: {
          user_id: user.id,
          event_id: eventId,
        },
      },
    });

    return !!favorite;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
};

// Перевірити, чи подія в закладках
export const isEventBookmarked = async (eventId: string) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return false;
    }

    const user = await getUserByEmail(session.user.email!);

    if (!user) {
      return false;
    }

    const bookmark = await db.bookmark.findUnique({
      where: {
        user_id_event_id: {
          user_id: user.id,
          event_id: eventId,
        },
      },
    });

    return !!bookmark;
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
};
