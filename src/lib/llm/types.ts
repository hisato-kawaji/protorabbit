export type SupportedLLM = 'openai' | 'gemini' | 'claude';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
