import {
  prisma,
} from "@/lib/prisma";

export async function GET() {

  try {

    /*
      FETCH TABLES
    */

    const tables =
      await prisma.$queryRawUnsafe(`

SELECT
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

`);

    /*
      FETCH COLUMNS
    */

    const results = [];

    for (
      const table of tables
    ) {

      const columns =
        await prisma.$queryRawUnsafe(`

SELECT
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = '${table.table_name}';

`);

      results.push({

        table:
          table.table_name,

        columns,
      });
    }

    return Response.json({

      success: true,

      tables: results,
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