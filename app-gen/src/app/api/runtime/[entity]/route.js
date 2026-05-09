import {
  getServerSession,
} from "next-auth";

import {
  authOptions,
} from "@/lib/auth";

import {
  prisma,
} from "@/lib/prisma";

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

  const entity =
    params.entity;

  /*
    PROJECT ID
  */

  const {
    searchParams,
  } = new URL(
    request.url
  );

  const projectId =
    searchParams.get(
      "projectId"
    );

  if (!projectId) {

    return Response.json(
      {
        success: false,
        message:
          "Missing projectId",
      },
      {
        status: 400,
      }
    );
  }

  /*
    FETCH RECORDS
  */

  const records =
    await prisma.runtimeData.findMany({

      where: {

        entity,

        projectId:
          Number(projectId),
      },

      orderBy: {

        createdAt:
          "desc",
      },
    });

  return Response.json({

    success: true,

    entity,

    projectId,

    data: records,
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

  const entity =
    params.entity;

  /*
    BODY
  */

  const body =
    await request.json();

  const {
    projectId,
    payload,
  } = body;

  if (!projectId) {

    return Response.json(
      {
        success: false,
        message:
          "Missing projectId",
      },
      {
        status: 400,
      }
    );
  }

  /*
    CREATE RECORD
  */

  const created =
    await prisma.runtimeData.create({

      data: {

        entity,

        payload,

        projectId:
          Number(projectId),
      },
    });

  return Response.json({

    success: true,

    data: created,
  });
}
