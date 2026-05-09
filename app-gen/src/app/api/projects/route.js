import {
  prisma,
} from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import {
  authOptions,
} from "@/lib/auth";

import bcrypt
from "bcryptjs";

import {
  mkdir,
} from "node:fs/promises";

import path
from "node:path";

async function requireUserId() {

  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.id) {

    return null;
  }

  const userId =
    Number(
      session.user.id
    );

  if (!Number.isInteger(userId)) {

    return null;
  }

  const existingUser =
    await prisma.user.findUnique({

      where: {
        id: userId,
      },
    });

  if (existingUser) {

    return userId;
  }

  const email =
    session.user.email ||
    `session-user-${userId}@appgen.local`;

  const password =
    await bcrypt.hash(
      `session-repair-${userId}-${Date.now()}`,
      10
    );

  const repairedUser =
    await prisma.user.upsert({

      where: {
        email,
      },

      update: {},

      create: {
        id: userId,
        name:
          session.user.name ||
          "Recovered Session User",
        email,
        password,
      },
    });

  await prisma.$executeRawUnsafe(
    'SELECT setval(pg_get_serial_sequence(\'"User"\', \'id\'), COALESCE((SELECT MAX(id) FROM "User"), 1), true)'
  );

  return repairedUser.id;
}

export async function GET() {

  try {

    const userId =
      await requireUserId();

    if (!userId) {

      return Response.json(
        {
          success: false,
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const projects =
      await prisma.project.findMany({

        where: {
          userId,
        },

        include: {
          uploads: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return Response.json({

      success: true,

      data: projects,
    });

  } catch (error) {

    console.error(
      "PROJECT LIST ERROR:",
      error
    );

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request
) {

  try {

    const body =
      await request.json();

    const userId =
      await requireUserId();

    if (!userId) {

      return Response.json(
        {
          success: false,
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "project_userId_key"'
    );

    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Project" DROP CONSTRAINT IF EXISTS "Project_userId_key"'
    );

    await prisma.$executeRawUnsafe(
      'DROP INDEX IF EXISTS "project_userId_key"'
    );

    await prisma.$executeRawUnsafe(
      'DROP INDEX IF EXISTS "Project_userId_key"'
    );

    const project =
      await prisma.project.create({

        data: {

          name:
            body.name,

          description:
            body.description ||
            "",

          userId:
            userId,
        },
      });

    await mkdir(
      path.join(
        process.cwd(),
        ".data",
        "projects",
        String(project.id),
        "uploads"
      ),
      {
        recursive: true,
      }
    );

    return Response.json({

      success: true,

      data: project,
    });

  } catch (error) {

  console.error(
    "PROJECT CREATE ERROR:",
    error
  );

  return Response.json(

    {
      success: false,

      message:
        error.message,

      fullError:
        String(error),
    },

    {
      status: 500,
    }
  );
}
}
