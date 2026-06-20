import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';

const router = express.Router();

router.get('/', (_request: Request, response: Response) => {
  response.send('Hello World!');
});

router.get('/api/hello', (_request: Request, response: Response) => {
  response.json({ message: 'Hello World!' });
});

router.post('/api/chat', chatController.sendMessage);

export default router;
