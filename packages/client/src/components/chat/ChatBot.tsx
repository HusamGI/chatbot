import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TypingIndicator from './TypingIndicator';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    lastMessageRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);

      setError('');
      setIsBotTyping(true);

      reset({ prompt: '' });

      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });

      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
    } catch (error) {
      console.error(error);
      setError('Something went wrong, try again!');
    } finally {
      setIsBotTyping(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onCopyMessage = (e: ClipboardEvent<HTMLDivElement>): void => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-2 mb-8 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            onCopy={onCopyMessage}
            className={`px-3 py-1 rounded-xl ${
              message.role === 'user'
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isBotTyping && <TypingIndicator />}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data: string) => data.trim().length > 0,
          })}
          autoFocus
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything..."
          maxLength={1000}
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
