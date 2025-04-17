import { Message } from 'ai';

declare module 'ai' {
  interface ExtendedMessage extends Message {
    contextSources?: {
      text: string;
      source: string;
      score: number;
    }[];
  }
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Response {
  text: string;
  embeddings: number[];
}