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

export const getEvents = async () => {
  return db.event.findMany();
};

export const getEventById = async (id: string) => {
  return db.event.findUnique({
    where: {
      id,
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
      title: options.title,
      description: options.description,
      date: options.date,
      address: options.address,
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
