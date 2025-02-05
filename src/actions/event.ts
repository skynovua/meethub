"use server";

import { getUserByEmail } from "@/actions/user";
import { auth } from "@/core/auth";
import { db } from "@/core/prisma";

interface CreateEvent {
  title: string;
  description: string;
  date: Date;
  address: string;
  banner: string;
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

  const event = await db.event?.create({
    data: {
      title: options.title,
      description: options.description,
      date: options.date,
      address: options.address,
      banner: options.banner,
      user_id: user.id,
    },
  });

  return event;
};