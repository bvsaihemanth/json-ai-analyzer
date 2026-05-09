import OpenAI
from "openai";

const client =
  new OpenAI({

    apiKey:
      process.env.OPENAI_API_KEY,
  });

export async function POST(
  request
) {

  try {

    const body =
      await request.json();

    /*
      PROMPT
    */

    const prompt = `

You are an AI analytics architect.

Analyze this structured dashboard metadata
and generate:

1. Dashboard title
2. Short dashboard description
3. Key KPI suggestions
4. Chart recommendations
5. Business insights
6. Possible anomalies

Return ONLY valid JSON.

INPUT:

${JSON.stringify(body, null, 2)}

OUTPUT FORMAT:

{
  "title": "",
  "description": "",
  "kpis": [],
  "chartRecommendations": [],
  "insights": [],
  "anomalies": []
}

`;

    /*
      OPENAI
    */

    const completion =
      await client.chat.completions.create({

        model:
          "gpt-5.5",

        messages: [

          {
            role: "system",

            content:
              "You are a professional analytics AI.",
          },

          {
            role: "user",

            content:
              prompt,
          },
        ],

        temperature: 0.3,
      });

    /*
      PARSE RESPONSE
    */

    const text =
      completion.choices[0]
        .message.content;

    let parsed;

    try {

      parsed =
        JSON.parse(text);

    } catch {

      parsed = {

        title:
          "AI Dashboard",

        description:
          text,

        kpis: [],

        chartRecommendations:
          [],

        insights: [],

        anomalies: [],
      };
    }

    return Response.json({

      success: true,

      data: parsed,
    });

  } catch (error) {

    console.error(error);

    return Response.json({

      success: false,

      error:
        error.message,
    });
  }
}