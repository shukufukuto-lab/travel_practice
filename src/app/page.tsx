'use client';

import { PlanningProvider } from '@/context/PlanningContext';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <PlanningProvider>
      <ChatInterface />
    </PlanningProvider>
  );
}
