"use client";
import React, { useState } from 'react';

interface Props {
  onSend: (text: string) => void;
}

const MessageInput = ({ onSend }: Props) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  };

  return (
    <footer className="p-4 border-t border-gray-700">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ここにメッセージを入力してください..."
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </form>
    </footer>
  );
};

export default MessageInput;
