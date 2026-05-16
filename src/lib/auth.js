import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "../../src/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    // ================= GOOGLE =================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    // ================= CREDENTIALS =================
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("INVALID_CREDENTIALS");
        }

        const email = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });

        if (!user || !user.password) {
          throw new Error("INVALID_CREDENTIALS");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("INVALID_CREDENTIALS");
        }

        if (!user.isEmailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role?.name || "CUSTOMER",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      // For Google login: role is NOT on the user object,
      // so we fetch it from DB on every Google sign-in
      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: { role: true },
        });

        if (dbUser) {
          token.id = dbUser.id.toString();
          token.role = dbUser.role?.name || "CUSTOMER";
          token.image = dbUser.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account.provider === "google") {
        const email = user.email.toLowerCase().trim();

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!existingUser) {
          const defaultRole = await prisma.role.findFirst({
            where: { name: "CUSTOMER" },
          });

          await prisma.user.create({
            data: {
              email,
              name: user.name,
              image: user.image,
              isGoogleUser: true,
              isEmailVerified: true,
              role: {
                connect: { id: defaultRole.id },
              },
            },
          });
        }
      }

      return true;
    },
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
