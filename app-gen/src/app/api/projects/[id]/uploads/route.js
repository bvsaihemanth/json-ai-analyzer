import {
  prisma,
} from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import {
  authOptions,
} from "@/lib/auth";

import {
  mkdir,
  writeFile,
} from "node:fs/promises";

import path
from "node:path";

export async function GET(
  request,
  context
) {

  /*
    AUTH
  */

  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.id) {

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

  /*
    PARAMS
  */

  const params =
    await context.params;

  const projectId =
    Number(params.id);

  const project =
    await prisma.project.findFirst({

      where: {

        id: projectId,

        userId:
          Number(
            session.user.id
          ),
      },
    });

  if (!project) {

    return Response.json(
      {
        success: false,
        message:
          "Project not found",
      },
      {
        status: 404,
      }
    );
  }

  /*
    FETCH UPLOADS
  */

  const uploads =
    await prisma.projectUpload.findMany({

      where: {

        projectId,
      },

      orderBy: {

        createdAt:
          "desc",
      },
    });

  return Response.json({

    success: true,

    data: uploads,
  });
}

export async function POST(
  request,
  context
) {

  /*
    AUTH
  */

  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.id) {

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

  /*
    PARAMS
  */

  const params =
    await context.params;

  const projectId =
    Number(params.id);

  const project =
    await prisma.project.findFirst({

      where: {

        id: projectId,

        userId:
          Number(
            session.user.id
          ),
      },
    });

  if (!project) {

    return Response.json(
      {
        success: false,
        message:
          "Project not found",
      },
      {
        status: 404,
      }
    );
  }

  /*
    BODY
  */

  const body =
    await request.json();

  /*
    CREATE UPLOAD
  */

  const upload =
    await prisma.projectUpload.create({

      data: {

        fileName:
          body.fileName,

        fileType:
          body.fileType,

        content:
          body.content,

        rawContent:
          body.rawContent ||
          body.content?.rawJson ||
          null,

        analysis:
          body.analysis ||
          body.content?.analysis ||
          null,

        projectId,
      },
    });

  const safeFileName =
    String(body.fileName || "upload.json")
      .replace(/[^a-zA-Z0-9._-]/g, "_");

  const uploadDirectory =
    path.join(
      process.cwd(),
      ".data",
      "projects",
      String(projectId),
      "uploads"
    );

  await mkdir(
    uploadDirectory,
    {
      recursive: true,
    }
  );

  await writeFile(
    path.join(
      uploadDirectory,
      `${upload.id}-${safeFileName}`
    ),
    JSON.stringify(
      body.rawContent ||
      body.content,
      null,
      2
    ),
    "utf8"
  );

  return Response.json({

    success: true,

    data: upload,
  });
}
