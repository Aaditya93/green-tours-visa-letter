import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./app/schemas";
import { authenticateUser } from "./db/models/User";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "User",
        };
      },
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          role: profile.role ?? "User",
        };
      },
    }),
    Credentials({
      authorize: async (credentials) => {
        // Validate the credentials against the schema
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          throw new Error("Invalid input data");
        }

        const { email, password } = validatedFields.data;
        const user = await authenticateUser({ email, password });
        if (user?.error) {
          return null;
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
