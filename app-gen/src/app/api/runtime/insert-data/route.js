import {
  prisma,
} from "@/lib/prisma";

export async function POST(
  request
) {

  try {

    const body =
      await request.json();

    const inserts =
      body.inserts || [];

    for (
      const item of inserts
    ) {

      try {

        await prisma.$executeRawUnsafe(

          item.query
        );

      } catch (error) {

        console.log(

          "Insert skipped"
        );
      }
    }

    return Response.json({

      success: true,
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