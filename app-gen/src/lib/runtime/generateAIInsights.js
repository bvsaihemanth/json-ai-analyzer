export async function generateAIInsights(
  analysis
) {

  try {

    /*
      SEND ONLY STRUCTURED METADATA
    */

    const payload = {

      entities:
        analysis.entities?.map(
          (entity) => ({

            name:
              entity.name,

            fields:
              entity.fields?.map(
                (
                  field
                ) => ({

                  name:
                    field.name,

                  type:
                    field.type ||
                    field.typeInfo
                      ?.base,
                })
              ),
          })
        ),

      stats:
        analysis.stats,

      charts:
        analysis.charts,
    };

    /*
      OPENAI API
    */

    const response =
      await fetch(

        "/api/ai-insights",

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              payload
            ),
        }
      );

    const data =
      await response.json();

    return data;

  } catch (error) {

    console.error(
      "AI Insights Error:",
      error
    );

    return {

      success: false,

      error:
        error.message,
    };
  }
}