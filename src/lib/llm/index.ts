import { SupportedLLM, ChatMessage } from './types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = (process.env.GEMINI_MODEL || '').trim();

type ApiBase = 'v1' | 'v1beta';

async function callGenerate(model: string, base: ApiBase, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/${base}/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { url, resp } as const;
}

export async function generateText(
  provider: SupportedLLM,
  prompt: string,
  _messages: ChatMessage[],
  _options?: { streaming?: boolean }
) {
  if (provider !== 'gemini') {
    throw new Error(`Provider ${provider} is not supported yet.`);
  }
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  if (!GEMINI_MODEL) {
    throw new Error('GEMINI_MODEL is not set');
  }

  // 1) v1 を試す → 404 の場合のみ 2) v1beta を試す
  const bases: ApiBase[] = ['v1', 'v1beta'];
  let lastErrText = '';
  for (const base of bases) {
    const { url, resp } = await callGenerate(GEMINI_MODEL, base, prompt);
    if (!resp.ok) {
      const errText = await resp.text();
      lastErrText = `Gemini API error ${base} ${resp.status} ${resp.statusText} ${errText}`;
      console.error('Gemini API error', url, resp.status, resp.statusText, errText);
      if (resp.status === 404) continue; // 次の base へ
      return new Response('Error generating text', { status: 500 });
    }
    const data = (await resp.json()) as any;
    const text = (data?.candidates?.[0]?.content?.parts || [])
      .map((p: any) => p.text)
      .filter(Boolean)
      .join('');
    return new Response(text || '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response('Error generating text', { status: 500, statusText: lastErrText || 'Gemini error' } as any);
}
