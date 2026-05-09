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
  readdir,
  unlink,
} from "node:fs/promises";

import path
from "node:path";

export async function DELETE(
  request,
  context
) {

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

  const params =
    await context.params;

  const uploadId =
    Number(params.id);

  if (!Number.isInteger(uploadId)) {

    return Response.json(
      {
        success: false,
        message:
          "Invalid upload id",
      },
      {
        status: 400,
      }
    );
  }

  const upload =
    await prisma.projectUpload.findUnique({

      where: {
        id: uploadId,
      },

      include: {
        project: true,
      },
    });

  if (!upload) {

    return Response.json(
      {
        success: false,
        message:
          "Upload not found",
      },
      {
        status: 404,
      }
    );
  }

  if (
    upload.project.userId !==
    Number(session.user.id)
  ) {

    return Response.json(
      {
        success: false,
        message:
          "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  await prisma.projectUpload.delete({

    where: {
      id: uploadId,
    },
  });

  const uploadDirectory =
    path.join(
      process.cwd(),
      ".data",
      "projects",
      String(upload.projectId),
      "uploads"
    );

  try {

    const files =
      await readdir(
        uploadDirectory
      );

    const uploadFiles =
      files.filter((file) =>
        file.startsWith(
          `${uploadId}-`
        )
      );

    await Promise.all(
      uploadFiles.map((file) =>
        unlink(
          path.join(
            uploadDirectory,
            file
          )
        )
      )
    );

  } catch (error) {

    if (error.code !== "ENOENT") {

      console.error(
        "UPLOAD FILE DELETE ERROR:",
        error
      );
    }
  }

  return Response.json({

    success: true,
  });
}
