import {
  prisma,
} from "@/lib/prisma";

export async function POST(
  request
) {

  try {

    const body =
      await request.json();

    const sqlTables =
      body.sqlTables || [];

    const createdTables = [];

    /*
      CREATE TABLES
    */

    for (
      const table of sqlTables
    ) {

      try {

        await prisma.$executeRawUnsafe(

          `DROP TABLE IF EXISTS ${table.table} CASCADE`
        );

        await prisma.$executeRawUnsafe(

          table.query
        );

        createdTables.push(
          table.table
        );

      } catch (error) {

        console.log(

          `Skipped: ${table.table}`
        );
      }
    }

    return Response.json({

      success: true,

      tables:
        createdTables,
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
