import { generateText } from '@/lib/llm';
import { SupportedLLM } from '@/lib/llm/types';

export async function POST(req: Request) {
  try {
    const { messages, provider = 'gemini' } = (await req.json()) as {
      messages: any[];
      provider?: SupportedLLM;
    };

    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage.content;

    // For now, we are not passing the full chat history.
    // This will be implemented in a later step.
    const responseStream = await generateText(provider, prompt, [], { streaming: false });

    return responseStream;
  } catch (error) {
    console.error(error);
    return new Response('Error generating text', { status: 500 });
  }
}
