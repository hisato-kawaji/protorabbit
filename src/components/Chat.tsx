'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';
import type { ChatMessage } from '@/lib/llm/types';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'こんにちは！何かお困りのことはありますか？あなたのアイデアを形にするお手伝いをします。',
    },
  ]);

  const sendingRef = useRef(false);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || sendingRef.current) return;
    sendingRef.current = true;

    // 1) ローカルにユーザー発言と空のアシスタント発言を追加
    setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: '' }]);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }], provider: 'gemini' }),
      });

      if (!resp.ok) {
        throw new Error('LLM API error');
      }

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) {
        const full = await resp.text();
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: full };
          return next;
        });
      } else {
        // ストリームを読み取りつつ、最後のアシスタント発言に追記
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setMessages((prev) => {
            const next = [...prev];
            const lastIdx = next.length - 1;
            const last = next[lastIdx];
            if (last && last.role === 'assistant') {
              next[lastIdx] = { ...last, content: last.content + chunk };
            }
            return next;
          });
        }
      }
    } catch (e) {
      setMessages((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        next[lastIdx] = { role: 'assistant', content: 'エラーが発生しました。時間をおいて再度お試しください。' };
        return next;
      });
    } finally {
      sendingRef.current = false;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col">
      <ChatMessages messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}

