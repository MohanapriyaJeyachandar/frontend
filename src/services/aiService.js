import axios from "axios";

const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

export const getWorkoutPlan = async (memberData) => {
  try {
    const prompt = `
Create a structured JSON gym plan.

Member Details:
Name: ${memberData.fullName}
Age: ${memberData.age}
Gender: ${memberData.gender}
Weight: ${memberData.weight} kg
Height: ${memberData.height} cm
Goal: ${memberData.goal}

Return JSON format:

{
 "summary":"",
 "workoutPlan":[
  {
   "day":"",
   "focus":"",
   "exercises":[
    {
     "name":"",
     "sets":"",
     "visualQuery":""
    }
   ]
  }
 ],
 "dietPlan":{
  "dailyCalories":0,
  "macros":{
   "protein":0,
   "carbs":0,
   "fat":0
  },
  "meals":[
   {
    "time":"",
    "label":"",
    "description":"",
    "visualQuery":""
   }
  ]
 }
}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = response.data.choices[0].message.content;

    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
};