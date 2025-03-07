"use server";

import { uploadImage } from "@/actions/image";
import { getUserByEmail } from "@/actions/user";
import { auth } from "@/core/auth";
import { db } from "@/core/prisma";

interface CreateEvent {
  title: string;
  description: string;
  date: Date;
  address: string;
  banner: string; // Може бути base64 або URL
}

export const createEvent = async (options: CreateEvent) => {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByEmail(session.user.email!);

  if (!user) {
    throw new Error("User not found");
  }

  // Завантажуємо зображення, якщо це base64
  let bannerUrl = options.banner;
  if (options.banner?.startsWith("data:")) {
    try {
      bannerUrl = await uploadImage(options.banner);
    } catch (error) {
      console.error("Failed to upload banner:", error);
      throw new Error("Failed to upload banner image");
    }
  }

  const event = await db.event?.create({
    data: {
      title: options.title,
      description: options.description,
      date: options.date,
      address: options.address,
      banner: bannerUrl, // Зберігаємо URL замість base64
      user_id: user.id,
    },
  });

  return event;
};

// Отримання всіх подій з кількістю вподобань
export const getEvents = async () => {
  const events = await db.event.findMany({
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
};

// Отримання подій, відсортованих за популярністю
export const getEventsByPopularity = async () => {
  const events = await db.event.findMany({
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
  });

  return events.map((event) => ({
    ...event,
    favoriteCount: event.favorites.length,
    bookmarkCount: event.bookmarks.length,
  }));
};

// Оновлена функція getUserFavoriteEvents
export const getUserFavoriteEvents = async () => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByEmail(session.user.email!);

  if (!user) {
    throw new Error("User not found");
  }

  const favorites = await db.favorite.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      event: {
        include: {
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return favorites.map((favorite) => favorite.event);
};

// Оновлена функція getUserBookmarkedEvents
export const getUserBookmarkedEvents = async () => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByEmail(session.user.email!);

  if (!user) {
    throw new Error("User not found");
  }

  const bookmarks = await db.bookmark.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      event: {
        include: {
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return bookmarks.map((bookmark) => bookmark.event);
};

export const getEventById = async (id: string) => {
  return db.event.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          favorites: true,
          bookmarks: true,
        },
      },
    },
  });
};

export const updateEvent = async (id: string, options: CreateEvent) => {
  let bannerUrl = options.banner;

  // Завантажуємо нове зображення, якщо це base64
  if (options.banner?.startsWith("data:")) {
    try {
      bannerUrl = await uploadImage(options.banner);
    } catch (error) {
      console.error("Failed to upload banner:", error);
      throw new Error("Failed to upload banner image");
    }
  }

  return db.event.update({
    where: {
      id,
    },
    data: {
      ...options,
      banner: bannerUrl,
    },
  });
};

export const deleteEvent = async (id: string) => {
  return db.event.delete({
    where: {
      id,
    },
  });
};
