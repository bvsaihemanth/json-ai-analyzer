import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {

  try {

    /*
      ENV CHECK
    */

    if (!process.env.GEMINI_API_KEY) {

      return Response.json(
        {
          success: false,
          error: "GEMINI_API_KEY is missing",
        },
        { status: 500 }
      );
    }

    /*
      GEMINI INIT
    */

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    /*
      REQUEST BODY
    */

    const body = await request.json();

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
      GEMINI CALL
    */

    const result =
      await model.generateContent(prompt);

    const response =
      await result.response;

    const text =
      response.text();

    /*
      PARSE JSON
    */

    let parsed;

    try {

      parsed = JSON.parse(text);

    } catch {

      parsed = {

        title: "AI Dashboard",

        description: text,

        kpis: [],

        chartRecommendations: [],

        insights: [],

        anomalies: [],
      };
    }

    /*
      SUCCESS
    */

    return Response.json({

      success: true,

      data: parsed,
    });

  } catch (error) {

    console.error("Gemini Error:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}