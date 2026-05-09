import NextAuth from "next-auth";

import CredentialsProvider
from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import {
  prisma,
} from "@/lib/prisma";

export const authOptions = {

  session: {

    strategy: "jwt",
  },

  pages: {

    signIn: "/login",
  },

  providers: [

    CredentialsProvider({

      name: "credentials",

      credentials: {

        email: {},

        password: {},
      },

      async authorize(
        credentials
      ) {

        /*
          VALIDATE INPUT
        */

        if (
          !credentials?.email ||
          !credentials?.password
        ) {

          throw new Error(
            "Missing credentials"
          );
        }

        /*
          FIND USER
        */

        const user =
          await prisma.user.findUnique({

            where: {

              email:
                credentials.email,
            },
          });

        /*
          USER NOT FOUND
        */

        if (!user) {

          throw new Error(
            "User not found"
          );
        }

        /*
          CHECK PASSWORD
        */

        const validPassword =
          await bcrypt.compare(

            credentials.password,

            user.password
          );

        /*
          INVALID PASSWORD
        */

        if (!validPassword) {

          throw new Error(
            "Invalid password"
          );
        }

        /*
          RETURN USER
        */

        return {

          id: String(user.id),

          name: user.name,

          email: user.email,

          role: user.role,
        };
      },
    }),
  ],

  callbacks: {

    /*
      JWT CALLBACK
    */

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

    /*
      SESSION CALLBACK
    */

    async session({
      session,
      token,
    }) {

      if (session.user) {

        session.user.id =
          token.id;

        session.user.name =
          token.name;

        session.user.email =
          token.email;

        session.user.role =
          token.role;
      }

      return session;
    },
  },

  secret:
    process.env.NEXTAUTH_SECRET,
};

const handler =
  NextAuth(authOptions);

export {
  handler as GET,
  handler as POST,
};
