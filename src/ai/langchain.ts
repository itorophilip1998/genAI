import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";

// Create an instance of ChatOpenAI with necessary options
const model = new ChatOpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_KEY,
  modelName: "gpt-3.5-turbo", // Ensure the model name is correct and available in your API
  temperature: 0.5, // Set the temperature to control the randomness of the response
});

export const getAnswer = async (question: string) => {
    try { 
    // Wrap HumanMessage in an appropriate format that is compatible with the BaseLanguageModelInput
        const message = new HumanMessage(question); 
        
    // Ensure that the model receives a valid input
        const response = await model.invoke([message]); // Pass the message in an array or compatible format
        console.debug(response);
    return response;
  } catch (error) {
    console.error("Error getting answer from OpenAI:", error);
  }
};
