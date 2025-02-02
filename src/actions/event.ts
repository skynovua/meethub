"use server";

import { getUserByEmail } from "@/actions/user";
import { authOptions } from "@/core/next-auth.config";
import { prisma } from "@/core/prisma";
import { getServerSession } from "next-auth";

interface CreateEvent {
  title: string;
  description: string;
  date: Date;
  address: string;
  banner: string;
}

export const createEvent = async (options: CreateEvent) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByEmail(session.user.email!);

  if (!user) {
    throw new Error("User not found");
  }

  const event = await prisma.event?.create({
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