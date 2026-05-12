import bcrypt from "bcryptjs";

import {
  prisma,
} from "@/lib/prisma";

export async function POST(
  request
) {

  try {

    const body =
      await request.json();

    const {
      name,
      email,
      password,
    } = body;

    /*
      CHECK EXISTING USER
    */

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {

      return Response.json(
        {
          success: false,
          message:
            "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    /*
      HASH PASSWORD
    */

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    /*
      CREATE USER
    */

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          password:
            hashedPassword,
        },
      });

    return Response.json({
      success: true,
      user,
    });

  } catch (error) {

    console.error(
      "SIGNUP ERROR:",
      error
    );

    const databaseUnavailable =
      error.code === "P1001" ||
      error.message?.includes(
        "Can't reach database server"
      );

    return Response.json(
      {
        success: false,
        message:
          databaseUnavailable
            ? "Database is not reachable. Please check your DATABASE_URL and Neon database status."
            : "Signup failed",
      },
      {
        status: 500,
      }
    );
  }
}
