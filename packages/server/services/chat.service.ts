import OpenAI from 'openai';
import { ConversationRepository } from '../repositories/conversation.repository';

//#region Implementation details

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//#endregion

//#region Public interface

type ChatResponse = {
  id: string;
  message: string;
};

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id:
        ConversationRepository.getLastResponseId(conversationId),
    });

    ConversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.output_text,
    };
  },
};

//#endregion
