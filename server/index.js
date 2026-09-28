import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

// Gemini AI client
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

app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});


// Gemini generation route
app.post("/api/generate", async (req, res) => {
  try {
    const { input, type } = req.body;

    const prompt = prompts[type];

    if (!prompt) {
      console.log("Invalid generation type")
      return res.status(400).json({
        error: "Invalid generation type",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `${prompt}\n${input}`,
    });
    const result = JSON.parse(response.text)
    if (type==="quiz"){
    console.log(result.questions[0])
    console.log(result.questions[0].question)
    console.log(result.questions[0].options)
    console.log(result.questions[0].answer)
    }
   if (!validateResult(result,type)){
    console.log("Invalid response format from AI")
     return res.status(502).json({
     error: "Invalid response format from AI"
  });
   }

    res.json({
      result,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});