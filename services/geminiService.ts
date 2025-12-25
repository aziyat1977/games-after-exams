
import { GoogleGenAI, Type } from "@google/genai";
import { EmojiPuzzle, TrendItem, WorldClue, DoodlePrompt, MemeTrivia, CrosswordData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-3-flash-preview";

// --- UPDATED FOR UZBEKISTAN GEN Z/ALPHA CONTEXT ---

export const generateEmojiPuzzle = async (): Promise<EmojiPuzzle> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a fun emoji puzzle strictly relevant to Uzbek Gen Z youth culture. Topics: Local fast food (Evos, Les Ailes, Oqtepa), Local Cars (Gentra, Cobalt, Damas, Matiz), Famous Uzbek Artists (Konsta, Shohrux, Munisa), or Viral Uzbek Trends. The answer should be the specific name. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emojis: { type: Type.STRING, description: "The emoji sequence" },
            answer: { type: Type.STRING, description: "Correct Title/Item" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 4 options including the answer" },
            category: { type: Type.STRING, description: "Food, Auto, Music, or Trend" }
          },
          required: ["emojis", "answer", "options", "category"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    if (data.options) {
      data.options = data.options.sort(() => Math.random() - 0.5);
    }
    return data;
  } catch (error) {
    console.error("Gemini Emoji Error", error);
    return {
      emojis: "🌯 🍟 🥤 🟡",
      answer: "Evos Lavash",
      options: ["Evos Lavash", "Oqtepa Lavash", "Les Ailes", "Max Way"].sort(() => Math.random() - 0.5),
      category: "Street Food"
    };
  }
};

export const generateTrendPair = async (): Promise<TrendItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate 2 contrasting trends/brands popular in Uzbekistan for a 'Higher or Lower' search game. Examples: 'Chevrolet Gentra' vs 'BYD Song', 'Click' vs 'Payme', 'Telegram' vs 'Instagram', 'Magic City' vs 'Tashkent City', 'Plov' vs 'Shashlik'. Return JSON array.",
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
      { name: "Chevrolet Gentra", volume: 500000 },
      { name: "Chevrolet Cobalt", volume: 450000 }
    ];
  }
};

export const generateWorldMystery = async (): Promise<WorldClue> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Select a location famous among Uzbeks. Can be domestic (Amirsoy, Chorvoq, Magic City, Chorsu, Registan) or International popular spots (Dubai Marina, Istanbul Taksim, Antaliya, Sharm El Sheikh). Provide cryptic clues. Return JSON.",
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
      description: "A modern entertainment park in the heart of Tashkent, reminiscent of Disney but with a local twist.",
      clues: ["Features a massive castle and aquarium.", "Famous for its fountain shows.", "Located near Pakhtakor stadium."],
      city: "Magic City",
      country: "Uzbekistan"
    };
  }
};

export const generateDoodlePrompt = async (): Promise<DoodlePrompt> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a funny, culturally relevant drawing prompt for Uzbek youth. Examples: 'A Damas drifting', 'Eating Somsa in space', 'A futuristic Choyxona', 'Traffic on Bunyodkor'. Return JSON.",
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
    return { text: "A Flying Tico" };
  }
};

// --- NEW GAMES ---

export const generateWordSearchWords = async (): Promise<{ topic: string, words: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Select a topic relevant to Uzbek Gen Z (e.g. 'Car Tuning', 'Tashkent Metro', 'Universities', 'Uzbek Brands'). Provide 8 words (max 8 letters). Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            words: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["topic", "words"],
        },
      },
    });
    const data = JSON.parse(response.text || "{}");
    return { 
        topic: data.topic || "Auto Tuning", 
        words: (data.words || ["GENTRA", "MAGICAR", "TONIROVKA", "DISKALAR", "TURBO", "CHIP", "SABVUFER", "POLIK"]).map((w: string) => w.toUpperCase())
    };
  } catch (error) {
    return { topic: "Fast Food", words: ["LAVASH", "BURGER", "HOTDOG", "NONKABOB", "PITTER", "DONAR", "PIZZA", "COLA"] };
  }
};

export const generateMemeTrivia = async (): Promise<MemeTrivia> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Describe a popular meme template used in Uzbek Telegram channels or Instagram reels. Provide the name and options. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            answer: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["description", "answer", "options"]
        }
      }
    });
    const data = JSON.parse(response.text || "{}");
    if(data.options) data.options = data.options.sort(() => Math.random() - 0.5);
    return data;
  } catch (error) {
    return {
      description: "A man in a suit standing next to a map, pointing at it with a confused or explaining expression. Often used to explain complex Uzbek family relations.",
      answer: "Charlie Day Pepe Silvia",
      options: ["Charlie Day Pepe Silvia", "Confused Travolta", "Roll Safe", "Drake Hotline Bling"].sort(() => Math.random() - 0.5)
    };
  }
};

export const generateCrosswordData = async (): Promise<CrosswordData> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a mini crossword theme about Modern Uzbekistan or Tradition. 5 words (max 8 letters). Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING },
            items: {
               type: Type.ARRAY,
               items: {
                 type: Type.OBJECT,
                 properties: {
                   clue: { type: Type.STRING },
                   answer: { type: Type.STRING }
                 },
                 required: ["clue", "answer"]
               }
            }
          },
          required: ["theme", "items"]
        }
      }
    });
    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error) {
    return {
      theme: "Milliy Taomlar",
      items: [
        { clue: "King of Uzbek cuisine", answer: "PALOV" },
        { clue: "Triangular pastry with meat", answer: "SOMSA" },
        { clue: "Noodle soup", answer: "LAGMON" },
        { clue: "Summer fruit, best from Mirzachul", answer: "QOVUN" },
        { clue: "White balls of dry yogurt", answer: "QURT" }
      ]
    };
  }
};
