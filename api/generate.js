import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const prompts = {
  flashcards: `
    Create exactly 6 flashcards about the given topic.

    Return ONLY valid JSON.

    The response must follow exactly this structure:

    {
      "cards": [
        {
          "question": "string",
          "answer": "string"
        }
      ]
    }

    Do not include markdown.
    Do not include explanations outside the JSON.

    Topic:
  `,

  quiz: `
    Create exactly 6 multiple-choice questions about the given topic.

    Return ONLY valid JSON.

    The response must follow exactly this structure:

    {
      "questions": [
        {
          "question": "string",
          "options": [
            "string",
            "string",
            "string",
            "string"
          ],
          "answer": 0
        }
      ]
    }

    Requirements:
    - Create exactly 6 questions.
    - Each question must have exactly 4 options.
    - Each option must be a SINGLE WORD.
    - Do not use phrases or sentences as options.
    - Only one option must be correct.
    - "answer" must be the zero-based index of the correct option.
    - Every question must be different.
    - Cover different aspects of the topic.
    - Do not repeat the same concept.
    - Do not include markdown.
    - Do not include explanations outside the JSON.

    Topic:
  `,
};

function validateResult(result, type) {
  if (!result || typeof result !== "object") {
    return false;
  }

  if (type === "flashcards") {
    return Array.isArray(result.cards) && result.cards.length > 0;
  }

  if (type === "quiz") {
    return Array.isArray(result.questions) && result.questions.length > 0;
  }

  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { input, type } = req.body;
    const prompt = prompts[type];

    if (!prompt) {
      return res.status(400).json({
        error: "Invalid generation type",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `${prompt}\n${input}`,
    });

    const result = JSON.parse(response.text);

    if (!validateResult(result, type)) {
      return res.status(502).json({
        error: "Invalid response format from AI",
      });
    }

    return res.json({ result });

  } catch (error) {
    console.error("Gemini error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}