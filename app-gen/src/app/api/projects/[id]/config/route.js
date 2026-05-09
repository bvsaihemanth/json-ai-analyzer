import {
  prisma,
} from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import {
  authOptions,
} from "@/lib/auth";

export async function POST(
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

  const projectId =
    Number(params.id);

  const body =
    await request.json();

  const project =
    await prisma.project.updateMany({

      where: {

        id: projectId,

        userId:
          Number(
            session.user.id
          ),
      },

      data: {

        config:
          body.config,

        analysis:
          body.analysis,

        generatedSql:
          body.generatedSql ||
          null,
      },
    });

  if (project.count === 0) {

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

  return Response.json({

    success: true,
  });
}

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

  /*
    FETCH PROJECT
  */

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

  return Response.json({

    success: true,

    data: project,
  });
}
