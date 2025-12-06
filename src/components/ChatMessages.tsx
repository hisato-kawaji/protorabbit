import React from 'react';
import type { ChatMessage } from '@/lib/llm/types';

interface Props {
  messages: ChatMessage[];
}

const ChatMessages = ({ messages }: Props) => {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`p-4 rounded-lg ${m.role === 'user' ? 'bg-blue-900/40' : 'bg-gray-800'}`}>
            <p className="whitespace-pre-wrap break-words">{m.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ChatMessages;
