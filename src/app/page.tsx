import Header from '@/components/Header';
import Planner from '@/components/Planner';

export default function Home() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <Header />
      <Planner />
    </div>
  );
}
