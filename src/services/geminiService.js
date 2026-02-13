import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.REACT_APP_API_KEY
});

export const getWorkoutPlan = async (memberData) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a detailed 7-day workout and diet plan for a gym member with these details:
      Name: ${memberData.fullName}
      Age: ${memberData.age}
      Gender: ${memberData.gender}
      Weight: ${memberData.weight}kg
      Height: ${memberData.height}cm
      Goal: ${memberData.goal || "General Fitness"}
      Health Conditions: ${
        memberData.healthConditions?.join(", ") || "None"
      }
      
      CRITICAL: For every exercise and meal, provide a "visualQuery" string (e.g., "barbell deadlift", "grilled chicken salad") that I can use to fetch images.
      The diet plan should be highly structured with macro breakdowns (Protein, Carbs, Fat) and specific meal timings.
      
      Respond in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            workoutPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.STRING },
                        visualQuery: {
                          type: Type.STRING,
                          description: "A keyword for image search"
                        }
                      },
                      required: ["name", "sets", "visualQuery"]
                    }
                  }
                },
                required: ["day", "focus", "exercises"]
              }
            },
            dietPlan: {
              type: Type.OBJECT,
              properties: {
                dailyCalories: { type: Type.NUMBER },
                macros: {
                  type: Type.OBJECT,
                  properties: {
                    protein: {
                      type: Type.NUMBER,
                      description: "Grams of protein"
                    },
                    carbs: {
                      type: Type.NUMBER,
                      description: "Grams of carbs"
                    },
                    fat: {
                      type: Type.NUMBER,
                      description: "Grams of fat"
                    }
                  },
                  required: ["protein", "carbs", "fat"]
                },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: {
                        type: Type.STRING,
                        description: "e.g. 08:00 AM"
                      },
                      label: {
                        type: Type.STRING,
                        description: "e.g. Breakfast"
                      },
                      description: { type: Type.STRING },
                      visualQuery: {
                        type: Type.STRING,
                        description: "A keyword for food image"
                      }
                    },
                    required: [
                      "time",
                      "label",
                      "description",
                      "visualQuery"
                    ]
                  }
                }
              },
              required: ["dailyCalories", "macros", "meals"]
            }
          },
          required: ["summary", "workoutPlan", "dietPlan"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
};
