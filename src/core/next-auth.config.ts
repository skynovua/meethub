import { getUserByEmail } from "@/actions/user";
import { verifyPassword } from "@/utils/password";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials) {
        return null;
      }

      const user = await getUserByEmail(credentials.email);

      if (!user) {
        return null;
      }

      const isPasswordValid = await verifyPassword(credentials.password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      return user;
    },
  })],
  pages: {
    signIn: "/sign-in",
  },
};

