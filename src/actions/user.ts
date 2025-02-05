"use server";

import { signIn } from "@/core/auth";
import { db } from "@/core/prisma";
import { DEFAULT_LOGIN_REDIRECT } from "@/core/routes";
import { SigninPayload, SigninSchema, SignupPayload, SignUpSchema } from "@/lib/schemas";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";

export const register = async (values: SignupPayload) => {
  const validateFields = SignUpSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password, username } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "User already exists." };
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });

  return {
    success: "Account created.",
  };

};

export const login = async (values: SigninPayload) => {
  const validateFields = SigninSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password } = validateFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Invalid email or password." };
        }
        default: {
          return { error: "Something went wrong." };
        }
      }
    }

    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  return db.user.findUnique({
    where: {
      email,
    },
  });
};
