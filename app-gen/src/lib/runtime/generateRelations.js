export function generateRelations(
  entities
) {

  const relations = [];

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

  entities.forEach(
    (entity) => {

      entity.fields.forEach(
        (field) => {

          /*
            FK DETECTION
          */

          if (
            field.name.endsWith(
              "_id"
            )
          ) {

            const parent =

              field.name.replace(
                "_id",
                ""
              );

            /*
              SKIP SELF ID
            */

            if (
              parent !==
                entity.name &&
              parent !==
                singularize(
                  entity.name
                )
            ) {

              relations.push({

                parent,

                child:
                  entity.name,

                field:
                  field.name,

                relation:
                  "one-to-many",
              });
            }
          }
        }
      );
    }
  );

  return relations;
}
