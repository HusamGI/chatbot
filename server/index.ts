import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_request: Request, response: Response) => {
  response.send('Hello World!');
});

app.get('/api/hello', (_request: Request, response: Response) => {
  response.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
