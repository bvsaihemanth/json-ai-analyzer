import {
  prisma,
} from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import {
  authOptions,
} from "@/lib/auth";

export async function DELETE(
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

  const uploadId =
    Number(params.id);

  /*
    FIND UPLOAD
  */

  const upload =
    await prisma.projectUpload.findUnique({

      where: {

        id: uploadId,
      },

      include: {

        project: true,
      },
    });

  /*
    VALIDATE
  */

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

  /*
    SECURITY CHECK
  */

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

  /*
    DELETE
  */

  await prisma.projectUpload.delete({

    where: {

      id: uploadId,
    },
  });

  return Response.json({

    success: true,
  });
}
