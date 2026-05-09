export function jsonAnalyzer(
  data
) {

  /*
    STORAGE
  */

  const entities = [];

  const visited =
    new Set();

  /*
    HELPERS
  */

  function capitalize(
    value
  ) {

    return (
      value.charAt(0)
        .toUpperCase() +

      value.slice(1)
    );
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
    entityName,
    object
  ) {

    const singular =
      singularize(entityName);

    const candidates = [

      `${singular}_id`,

      `${entityName.toLowerCase()}_id`,

      "id",
    ];

    return (
      candidates.find(
        (key) =>
          Object.prototype.hasOwnProperty.call(
            object,
            key
          )
      ) ||
      `${singular}_id`
    );
  }

  /*
    DETECT TYPE
  */

  function detectType(
    value
  ) {

    if (
      Array.isArray(value)
    ) {

      return "array";
    }

    if (
      typeof value ===
        "object" &&
      value !== null
    ) {

      return "object";
    }

    return typeof value;
  }

  /*
    POSTGRESQL TYPE MAP
  */

  function mapSqlType(
    type
  ) {

    switch (type) {

      case "string":
        return "VARCHAR(255)";

      case "number":
        return "INTEGER";

      case "boolean":
        return "BOOLEAN";

      default:
        return "TEXT";
    }
  }

  /*
    CREATE ENTITY
  */

  function createEntity(
    entityName,
    object,
    parentField = null
  ) {

    /*
      PREVENT DUPLICATES
    */

    if (
      visited.has(entityName)
    ) {

      return;
    }

    visited.add(
      entityName
    );

    /*
      ENTITY
    */

    const entity = {

      name:
        entityName
          .toLowerCase(),

      fields: [],
    };

    const primaryKey =
      pickPrimaryKey(
        entityName,
        object
      );

    /*
      PRIMARY KEY
    */

    entity.fields.push({

      name:
        primaryKey,

      type:
        primaryKey === "id"
          ? "number"
          : "string",
    });

    /*
      PARENT RELATION
    */

    if (
      parentField &&
      parentField !== primaryKey
    ) {

      entity.fields.push({

        name:
          parentField,

        type:
          "string",
      });
    }

    /*
      ITERATE KEYS
    */

    Object.entries(
      object
    ).forEach(

      ([key, value]) => {

        /*
          ARRAYS
        */

        if (
          Array.isArray(
            value
          )
        ) {

          /*
            ARRAY OF OBJECTS
          */

          if (
            value.length > 0 &&

            typeof value[0] ===
              "object"
          ) {

            createEntity(

              key,

              value[0],

              primaryKey
            );
          }

          /*
            ARRAY OF PRIMITIVES
          */

          else {

            const childName =
              key.toLowerCase();

            const childEntity = {

              name:
                childName
                  .toLowerCase(),

              fields: [

                {
                  name:
                    "id",

                  type:
                    "number",
                },

                {
                  name:
                    primaryKey,

                  type:
                    "string",
                },

                {
                  name:
                    key
                      ? singularize(key)
                      : key,

                  type:
                    detectType(
                      value[0]
                    ),
                },
              ],
            };

            entities.push(
              childEntity
            );
          }
        }

        /*
          NESTED OBJECT
        */

        else if (

          typeof value ===
            "object" &&

          value !== null

        ) {

          createEntity(

            key,

            value,

            primaryKey
          );
        }

        /*
          PRIMITIVE
        */

        else {

          if (
            key !== primaryKey
          ) {

            entity.fields.push({

              name: key,

              type:
                detectType(
                  value
                ),
            });
          }
        }
      }
    );

    entities.push(
      entity
    );
  }

  /*
    ROOT
  */

  Object.entries(data)
    .forEach(

      ([key, value]) => {

        const sampleValue =
          Array.isArray(value)
            ? value[0]
            : value;

        if (

          typeof sampleValue ===
            "object" &&

          sampleValue !== null

        ) {

          createEntity(
            key,
            sampleValue
          );
        }
      }
    );

  /*
    ANALYTICS
  */

  const stats = {

    entities:
      entities.length,

    totalFields:
      entities.reduce(

        (
          total,
          entity
        ) =>

          total +
          entity.fields.length,

        0
      ),

    arrays:
      entities.filter(
        (entity) =>
          entity.fields[0]?.name ===
          "id"
      ).length,

    nestedObjects:
      entities.length,
  };

  /*
    FIELD NAMES
  */

  const fieldNames =

    entities.flatMap(
      (entity) =>

        entity.fields.map(
          (field) =>
            field.name
        )
    );

  /*
    CHART DATA
  */

  const chartData =

    entities.map(
      (entity) => ({

        name:
          capitalize(
            entity.name
          ),

        fields:
          entity.fields.length,
      })
    );

  /*
    POSTGRESQL TABLES
  */

  const sqlTables =

    entities.map(
      (entity) => {

        const query = `
CREATE TABLE ${entity.name} (
${entity.fields.map(

(field, index) => {

  /*
    PRIMARY KEY
  */

  if (index === 0) {

    if (
      field.name === "id"
    ) {

      return `  ${field.name} SERIAL PRIMARY KEY`;
    }

    return `  ${field.name} VARCHAR(255) PRIMARY KEY`;
  }

  /*
    FOREIGN KEYS
  */

  if (
    field.name.endsWith("_id")
  ) {

    return `  ${field.name} VARCHAR(255)`;
  }

  /*
    NORMAL FIELDS
  */

  return `  ${field.name} ${mapSqlType(field.type)}`;
}

).join(",\n")}
);
`;

        return {

          table:
            entity.name,

          columns:
            entity.fields,

          query,
        };
      }
    );

  /*
    RETURN
  */

  return {

    entities,

    analysis: {

      stats,

      fieldNames,

      chartData,
    },

    sqlTables,
  };
}
