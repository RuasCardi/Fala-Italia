// AI service using OpenAI SDK for exercise generation, feedback, and chat tutor
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
    generateExercise: async (prompt: string): Promise<string | undefined> => {
        const response = await openai.completions.create({
            model: 'text-davinci-003',
            prompt,
        });
        return response.choices[0]?.text;
    },
    getFeedback: async (input: string): Promise<string | undefined> => {
        const feedbackPrompt = `Provide feedback on: ${input}`;
        const response = await openai.completions.create({
            model: 'text-davinci-003',
            prompt: feedbackPrompt,
        });
        return response.choices[0]?.text;
    },
    chatTutor: async (query: string): Promise<string | undefined> => {
        const response = await openai.completions.create({
            model: 'text-davinci-003',
            prompt: query,
        });
        return response.choices[0]?.text;
    }
};