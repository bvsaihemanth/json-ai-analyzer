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

    return Response.json(
      {
        success: false,
        message:
          error.message ||
          "Signup failed",
      },
      {
        status: 500,
      }
    );
  }
}
