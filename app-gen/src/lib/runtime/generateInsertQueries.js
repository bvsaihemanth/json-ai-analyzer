export function generateInsertQueries(
  data
) {

  /*
    STORAGE
  */

  const inserts = [];

  const idCounters = {};

  function nextId(table) {

    idCounters[table] =
      (idCounters[table] || 0) + 1;

    return idCounters[table];
  }

  function singularize(
    value
  ) {

    const lower =
      value.toLowerCase();

    if (
      lower.endsWith("s") &&
      !lower.endsWith("ss")
    ) {

      return lower.slice(0, -1);
    }

    return lower;
  }

  function pickPrimaryKey(
    table,
    row,
    fallbackToId = false
  ) {

    if (fallbackToId) {

      return "id";
    }

    const singular =
      singularize(table);

    const candidates = [

      `${singular}_id`,

      `${table.toLowerCase()}_id`,

      "id",
    ];

    return (
      candidates.find(
        (key) =>
          Object.prototype.hasOwnProperty.call(
            row,
            key
          )
      ) ||
      `${singular}_id`
    );
  }

  /*
    FORMAT VALUE
  */

  function formatValue(
    value
  ) {

    if (
      value === null ||
      value === undefined
    ) {

      return "NULL";
    }

    if (
      typeof value ===
      "number"
    ) {

      return value;
    }

    if (
      typeof value ===
      "boolean"
    ) {

      return value
        ? "TRUE"
        : "FALSE";
    }

    return `'${String(
      value
    ).replace(/'/g, "''")}'`;
  }

  /*
    INSERT ROW
  */

  function createInsert(
    table,
    row,
    options = {}
  ) {

    const primaryKey =
      options.primaryKey ||
      pickPrimaryKey(
        table,
        row,
        options.useId
      );

    const rowWithId = {

      [primaryKey]:
        row[primaryKey] ||
        (
          primaryKey !== "id"
            ? row.id
            : undefined
        ) ||
        nextId(table),

      ...row,
    };

    const columns =
      Object.keys(rowWithId);

    const values =
      Object.values(rowWithId)
        .map(formatValue);

    const query = `

INSERT INTO ${table}
(
${columns.join(", ")}
)

VALUES
(
${values.join(", ")}
)
ON CONFLICT (${primaryKey}) DO NOTHING;

`;

    inserts.push({

      table,

      row:
        rowWithId,

      query,
    });

    return rowWithId;
  }

  /*
    PROCESS ENTITY
  */

  function processEntity(

    entityName,

    value,

    parent = {}

  ) {

    /*
      ARRAY
    */

    if (
      Array.isArray(value)
    ) {

      value.forEach(
        (item) => {

          processEntity(

            entityName,

            item,

            parent
          );
        }
      );

      return;
    }

    /*
      OBJECT
    */

    if (
      typeof value ===
        "object" &&

      value !== null
    ) {

      const row = {

        ...parent,
      };

      /*
        PRIMITIVES
      */

      Object.entries(
        value
      ).forEach(

        ([key, val]) => {

          if (

            typeof val !==
              "object" ||

            val === null
          ) {

            row[key] = val;
          }
        }
      );

      /*
        INSERT CURRENT
      */

      const createdRow =
        createInsert(
        entityName,
        row
      );

      /*
        PROCESS CHILDREN
      */

      Object.entries(
        value
      ).forEach(

        ([key, val]) => {

          /*
            NESTED OBJECT
          */

          if (

            typeof val ===
              "object" &&

            !Array.isArray(
              val
            ) &&

            val !== null
          ) {

            const parentId =

              createdRow[
                `${entityName.slice(
                  0,
                  -1
                )}_id`
              ] ||

              createdRow[
                `${entityName}_id`
              ] ||

              createdRow[
                "id"
              ];

            processEntity(

              key,

              val,

              {
                [pickPrimaryKey(
                  entityName,
                  createdRow
                )]:
                  parentId,
              }
            );
          }

          /*
            ARRAY
          */

          if (
            Array.isArray(
              val
            )
          ) {

            const parentId =

              createdRow[
                `${entityName.slice(
                  0,
                  -1
                )}_id`
              ] ||

              createdRow[
                `${entityName}_id`
              ] ||

              createdRow[
                "id"
              ];

            const primitiveArray =
              val.every(
                (item) =>
                  typeof item !==
                    "object" ||
                  item === null
              );

            if (primitiveArray) {

              val.forEach(
                (item) => {

                  createInsert(

                    key,

                    {
                      [pickPrimaryKey(
                        entityName,
                        createdRow
                      )]:
                        parentId,

                      [singularize(key) || key]:
                        item,
                    },
                    {
                      primaryKey:
                        "id",
                    }
                  );
                }
              );

            } else {

              processEntity(

                key,

                val,

                {
                  [pickPrimaryKey(
                    entityName,
                    createdRow
                  )]:
                    parentId,
                }
              );
            }
          }
        }
      );
    }
  }

  /*
    ROOT
  */

  Object.entries(data)
    .forEach(

      ([key, value]) => {

        processEntity(
          key,
          value
        );
      }
    );

  return inserts;
}
