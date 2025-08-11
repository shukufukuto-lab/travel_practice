'use client';

import { PlanningProvider } from '@/context/PlanningContext';
import PlanningFlow from '@/components/PlanningFlow';

export default function Home() {
  return (
    <PlanningProvider>
      <PlanningFlow />
    </PlanningProvider>
  );
}
