import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { SupportedLLM, ChatMessage } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateText(
  provider: SupportedLLM,
  prompt: string,
  messages: ChatMessage[]
) {
  // For now, we only support Gemini. Others will be added later.
  if (provider !== 'gemini') {
    throw new Error(`Provider ${provider} is not supported yet.`);
  }

  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-1.5-flash' })
    .generateContentStream(prompt);

  const stream = GoogleGenerativeAIStream(geminiStream);
  return new StreamingTextResponse(stream);
}
