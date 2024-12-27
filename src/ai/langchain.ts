import { OpenAi } from "langchain/llms/openai";

const llm = new OpenAi({
  openAIApiKey: import.meta.env.OPEN_AI_KEY,
});

export const getAnswer = async (question: string) => {
  try {
    const answer = await llm.predict(question);
    return answer;
  } catch (error) {
    console.error(error);
  }
};
