
import { GoogleGenAI, Type } from "@google/genai";
import { EmojiPuzzle, TrendItem, WorldClue, DoodlePrompt, MemeTrivia, CrosswordData, SortLevel, FlashlightLevel, MemeTemplate } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-3-flash-preview";

// --- UPDATED FOR GLOBAL ENGLISH CONTEXT ---

export const generateEmojiPuzzle = async (): Promise<EmojiPuzzle> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a fun emoji puzzle relevant to Gen Z pop culture. Topics: Famous Movies, Global Music Artists, Popular Games, or Viral Trends. The answer should be the specific name. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emojis: { type: Type.STRING, description: "The emoji sequence" },
            answer: { type: Type.STRING, description: "Correct Title/Item" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 4 options including the answer" },
            category: { type: Type.STRING, description: "Movie, Music, Game, or Trend" }
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
      emojis: "🧙‍♂️ 💍 🌋 👁️",
      answer: "Lord of the Rings",
      options: ["Lord of the Rings", "Harry Potter", "The Hobbit", "Game of Thrones"].sort(() => Math.random() - 0.5),
      category: "Movies"
    };
  }
};

export const generateTrendPair = async (): Promise<TrendItem[]> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate 2 contrasting global trends/brands for a 'Higher or Lower' search game. Examples: 'Minecraft' vs 'Fortnite', 'Nike' vs 'Adidas', 'Taylor Swift' vs 'Drake'. Return JSON array.",
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
      { name: "Taylor Swift", volume: 100000000 },
      { name: "Kanye West", volume: 45000000 }
    ];
  }
};

export const generateWorldMystery = async (): Promise<WorldClue> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Select a famous global location (e.g., Eiffel Tower, Times Square, Tokyo Tower, Pyramids of Giza). Provide cryptic clues. Return JSON.",
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
      description: "An iron lattice tower on the Champ de Mars, named after the engineer whose company designed and built it.",
      clues: ["Built for the 1889 World's Fair.", "The most visited paid monument in the world.", "Located in the City of Light."],
      city: "Paris",
      country: "France"
    };
  }
};

export const generateDoodlePrompt = async (): Promise<DoodlePrompt> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a funny, creative drawing prompt for students. Examples: 'A cat flying a plane', 'A robot eating pizza', 'An elephant in sneakers'. Return JSON.",
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
    return { text: "A surfing penguin" };
  }
};

export const generateWordSearchWords = async (): Promise<{ topic: string, words: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Select a topic relevant to Gen Z (e.g. 'Coding', 'Space', 'Social Media', 'Fast Food'). Provide 8 words (max 8 letters). Return JSON.",
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
        topic: data.topic || "Coding", 
        words: (data.words || ["PYTHON", "JAVA", "REACT", "NODE", "LINUX", "CLOUD", "PIXEL", "DATA"]).map((w: string) => w.toUpperCase())
    };
  } catch (error) {
    return { topic: "Fast Food", words: ["BURGER", "FRIES", "PIZZA", "TACO", "SODA", "SHAKE", "NUGGET", "WRAP"] };
  }
};

export const generateMemeTrivia = async (): Promise<MemeTrivia> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Describe a very popular viral internet meme. Provide a text description of the image/video and the correct name. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "Description of the meme visual/context without naming it" },
            answer: { type: Type.STRING, description: "The popular name of the meme" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options total" }
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
      description: "A Shiba Inu dog looking at the camera with a side-eye expression, often surrounded by colorful Comic Sans text.",
      answer: "Doge",
      options: ["Doge", "Grumpy Cat", "Nyan Cat", "Cheems"].sort(() => Math.random() - 0.5)
    };
  }
};

export const generateCrosswordData = async (): Promise<CrosswordData> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a mini crossword theme about Technology or Pop Culture. 5 words (max 8 letters). Return JSON.",
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
      theme: "Space",
      items: [
        { clue: "Our planet", answer: "EARTH" },
        { clue: "Red planet", answer: "MARS" },
        { clue: "Night light", answer: "MOON" },
        { clue: "Burning star", answer: "SUN" },
        { clue: "NASA agency", answer: "SPACE" }
      ]
    };
  }
};

// --- NEW GAME GENERATORS ---

export const generateMemeTribunalTemplate = async (): Promise<MemeTemplate> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Generate a funny, relatable situation topic for students to write captions about. E.g. 'When the teacher says pop quiz', 'Me explaining why I'm late'. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                topic: { type: Type.STRING }
            },
            required: ["topic"]
        }
      }
    });
    const data = JSON.parse(response.text || "{}");
    return { 
        url: "https://via.placeholder.com/400x300/222/fff?text=MEME+TEMPLATE", 
        topic: data.topic || "When the Wi-Fi cuts out during a game" 
    };
  } catch (e) {
      return { url: "", topic: "When you forget your notebook at home" };
  }
};

export const generateGravitySortLevel = async (): Promise<SortLevel> => {
    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: "Create a sorting game level for students. Two contrasting categories (e.g. 'Fruits vs Vegetables', 'Past vs Future', 'Mammal vs Reptile'). 10 items total. Return JSON.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        leftCategory: { type: Type.STRING },
                        rightCategory: { type: Type.STRING },
                        items: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    text: { type: Type.STRING },
                                    category: { type: Type.STRING, enum: ['LEFT', 'RIGHT'] }
                                },
                                required: ["text", "category"]
                            }
                        }
                    },
                    required: ["leftCategory", "rightCategory", "items"]
                }
            }
        });
        const data = JSON.parse(response.text || "{}");
        // Add IDs if missing
        data.items = data.items.map((item: any, i: number) => ({...item, id: `sort-${i}`}));
        return data;
    } catch (e) {
        return {
            leftCategory: "Healthy",
            rightCategory: "Junk Food",
            items: [
                { id: '1', text: 'Apple', category: 'LEFT' },
                { id: '2', text: 'Chips', category: 'RIGHT' },
                { id: '3', text: 'Salad', category: 'LEFT' },
                { id: '4', text: 'Cola', category: 'RIGHT' }
            ]
        };
    }
};

export const generateFlashlightLevel = async (): Promise<FlashlightLevel> => {
    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: "Generate a list of 5 'hidden anomalies' or items for a flashlight search game. Theme: 'A messy student desk'. Return JSON with x/y coordinates (0-90%).",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topic: { type: Type.STRING },
                        objects: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    label: { type: Type.STRING },
                                    x: { type: Type.NUMBER },
                                    y: { type: Type.NUMBER }
                                },
                                required: ["label", "x", "y"]
                            }
                        }
                    },
                    required: ["topic", "objects"]
                }
            }
        });
        const data = JSON.parse(response.text || "{}");
        data.objects = data.objects.map((o: any, i: number) => ({...o, id: `hide-${i}`, isFound: false}));
        return data;
    } catch (e) {
        return {
            topic: "Messy Desk",
            objects: [
                { id: '1', label: 'Missing Homework', x: 20, y: 30, isFound: false },
                { id: '2', label: 'Old Sandwich', x: 80, y: 60, isFound: false }
            ]
        };
    }
};
