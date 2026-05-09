import CredentialsProvider
from "next-auth/providers/credentials";

import bcrypt
from "bcryptjs";

import { prisma }
from "@/lib/prisma";

export const authOptions = {

  providers: [

    CredentialsProvider({

      name: "credentials",

      credentials: {

        email: {},

        password: {},
      },

      async authorize(credentials) {

        if (
          !credentials?.email ||
          !credentials?.password
        ) {

          throw new Error(
            "Missing credentials"
          );
        }

        const user =
          await prisma.user.findUnique({

            where: {
              email:
                credentials.email,
            },
          });

        if (!user) {

          throw new Error(
            "User not found"
          );
        }

        const isValid =
          await bcrypt.compare(

            credentials.password,

            user.password
          );

        if (!isValid) {

          throw new Error(
            "Invalid password"
          );
        }

        return {

          id: String(user.id),

          name: user.name,

          email: user.email,

          role: user.role,
        };
      },
    }),
  ],

  pages: {

    signIn: "/login",
  },

  session: {

    strategy: "jwt",
  },

  callbacks: {

    async jwt({
      token,
      user,
    }) {

      if (user) {

        token.id =
          user.id;

        token.name =
          user.name;

        token.email =
          user.email;

        token.role =
          user.role;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {

      session.user = {

        ...session.user,

        id:
          token.id ||
          token.sub,

        name:
          token.name ||
          session.user?.name,

        email:
          token.email ||
          session.user?.email,

        role:
          token.role ||
          "user",
      };

      return session;
    },
  },

  secret:
    process.env.NEXTAUTH_SECRET,
};
