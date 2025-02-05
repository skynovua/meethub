import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { SigninSchema } from "@/lib/schemas";
import { db } from "@/core/prisma";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {

        const validateFields = SigninSchema.safeParse(credentials);

        if (!validateFields.success) {
          return null;
        }

        const { email, password } = validateFields.data;

        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          ...user,
          name: user.username,
        };
      }
    }),
  ],
} satisfies NextAuthConfig;