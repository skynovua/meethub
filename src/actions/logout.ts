"use server";

import { signOut } from "@/core/auth";

export const logout = async () => {
  await signOut();
};
