import { GoogleGenAI, Type } from "@google/genai";
import { EmojiPuzzle, TrendItem, WorldClue, DoodlePrompt } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-3-flash-preview";

export const generateEmojiPuzzle = async (): Promise<EmojiPuzzle> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a fun emoji-based puzzle for teens. Represent a popular Movie, Video Game, or Song using only emojis (3-6 emojis). Provide the correct title and 3 distinct but plausible wrong answers. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emojis: { type: Type.STRING, description: "The emoji sequence" },
            answer: { type: Type.STRING, description: "Correct Title" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 4 options including the answer" },
            category: { type: Type.STRING, description: "Movie, Song, or Game" }
          },
          required: ["emojis", "answer", "options", "category"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    // Ensure options are shuffled if the model didn't do it (simple shuffle)
    if (data.options) {
      data.options = data.options.sort(() => Math.random() - 0.5);
    }
    return data;
  } catch (error) {
    console.error("Gemini Emoji Error", error);
    return {
      emojis: "🕸️ 🕷️ 🔴 🔵",
      answer: "Spider-Man",
      options: ["Spider-Man", "Ant-Man", "Black Widow", "Venom"].sort(() => Math.random() - 0.5),
      category: "Movie"
    };
  }
};

export const generateTrendPair = async (): Promise<TrendItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate 2 distinct popular search terms or topics (e.g. 'Minecraft' vs 'Roblox', 'Pizza' vs 'Burgers'). Provide their estimated monthly search volume (as a number). Return JSON array.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              volume: { type: Type.INTEGER },
            },
            required: ["name", "volume"],
          },
        },
      },
    });

    const data = JSON.parse(response.text || "[]");
    return data;
  } catch (error) {
    console.error("Gemini Trend Error", error);
    return [
      { name: "Coffee", volume: 1000000 },
      { name: "Tea", volume: 800000 }
    ];
  }
};

export const generateWorldMystery = async (): Promise<WorldClue> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Select a famous city. Provide a cryptic satellite-view description (no names), 3 progressive clues, and the answer (city, country). Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            clues: { type: Type.ARRAY, items: { type: Type.STRING } },
            city: { type: Type.STRING },
            country: { type: Type.STRING },
          },
          required: ["description", "clues", "city", "country"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error) {
    console.error("Gemini World Error", error);
    return {
      description: "A sprawling metropolis divided by a historic wall's memory, featuring a distinct TV tower visible from everywhere.",
      clues: ["It is the capital of a major European country.", "Famous for its techno club culture.", "The Brandenburg Gate is here."],
      city: "Berlin",
      country: "Germany"
    };
  }
};

export const generateDoodlePrompt = async (): Promise<DoodlePrompt> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a creative, short drawing prompt for a game (e.g., 'A cat wearing sunglasses'). Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
          },
          required: ["text"],
        },
      },
    });
    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error) {
    console.error("Gemini Doodle Error", error);
    return { text: "A futuristic toaster" };
  }
};