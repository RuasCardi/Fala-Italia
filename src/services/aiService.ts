// AI service using OpenAI SDK for exercise generation, feedback, and chat tutor
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const aiService = {
    generateExercise: async (prompt) => {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
        });
        return response.data.choices[0].text;
    },
    getFeedback: async (input) => {
        const feedbackPrompt = `Provide feedback on: ${input}`;
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: feedbackPrompt,
        });
        return response.data.choices[0].text;
    },
    chatTutor: async (query) => {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: query,
        });
        return response.data.choices[0].text;
    }
};