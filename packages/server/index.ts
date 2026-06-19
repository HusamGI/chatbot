import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (_request: Request, response: Response) => {
  response.send('Hello World!');
});

app.get('/api/hello', (_request: Request, response: Response) => {
  response.json({ message: 'Hello World!' });
});

// In a real scenario this conversation map should be saved in the database
const conversations = new Map<string, string>();

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(1000, 'Prompt is too long (max 1000 characters)'),
  conversationId: z.uuid(),
});

app.post('/api/chat', async (request: Request, response: Response) => {
  const validation = chatSchema.safeParse(request.body);

  if (!validation.success) {
    response.status(400).json(validation.error.format());
    return;
  }

  try {
    const { prompt, conversationId } = request.body;

    const gptResponse = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
    });

    conversations.set(conversationId, gptResponse.id);

    response.json({ message: gptResponse.output_text });
  } catch (error) {
    response.status(500).json({ error: 'Failed to generate a response' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
