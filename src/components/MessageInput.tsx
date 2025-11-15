import React from 'react';

const MessageInput = () => {
  return (
    <footer className="p-4 border-t border-gray-700">
      <form>
        <input
          type="text"
          placeholder="ここにメッセージを入力してください..."
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
    </footer>
  );
};

export default MessageInput;
