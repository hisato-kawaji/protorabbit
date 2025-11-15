import Header from '@/components/Header';
import ChatMessages from '@/components/ChatMessages';
import MessageInput from '@/components/MessageInput';

export default function Home() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <Header />
      <ChatMessages />
      <MessageInput />
    </div>
  );
}
