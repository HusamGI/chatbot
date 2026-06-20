import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatService } from './services/chat.service';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (_request: Request, response: Response) => {
  response.send('Hello World!');
});

app.get('/api/hello', (_request: Request, response: Response) => {
  response.json({ message: 'Hello World!' });
});

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

    const chatResponse = await chatService.sendMessage(prompt, conversationId);

    response.json({ message: chatResponse.message });
  } catch (error) {
    response.status(500).json({ error: 'Failed to generate a response' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
