import {
  prisma,
} from "@/lib/prisma";

export async function GET(
  request
) {

  try {

    const {
      searchParams,
    } = new URL(
      request.url
    );

    const table =
      searchParams.get(
        "table"
      );

    if (!table) {

      return Response.json(

        {
          success: false,
          error:
            "Missing table",
        },

        {
          status: 400,
        }
      );
    }

    /*
      FETCH ROWS
    */

    const rows =
      await prisma.$queryRawUnsafe(

        `SELECT * FROM ${table} LIMIT 50`
      );

    return Response.json({

      success: true,

      rows,
    });

  } catch (error) {

    console.error(error);

    return Response.json(

      {
        success: false,
        error:
          error.message,
      },

      {
        status: 500,
      }
    );
  }
}