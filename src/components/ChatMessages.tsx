import React from 'react';

const ChatMessages = () => {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        {/* Later, this will be dynamic based on props */}
        <div className="p-4 bg-gray-800 rounded-lg">
          <p>こんにちは！何かお困りのことはありますか？あなたのアイデアを形にするお手伝いをします。</p>
        </div>
      </div>
    </main>
  );
};

export default ChatMessages;
