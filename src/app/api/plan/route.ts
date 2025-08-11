import { NextRequest, NextResponse } from 'next/server';
import { FinalPlan } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { dateSelection, selectedActivities } = await request.json();

    const startDate = new Date(dateSelection.startDate);
    const endDate = new Date(dateSelection.endDate);
    const duration = dateSelection.duration;

    const totalCost = selectedActivities.reduce((sum: number, activity: { cost: string }) => {
      const costMatch = activity.cost.match(/(\d+)/);
      return sum + (costMatch ? parseInt(costMatch[1]) : 0);
    }, 0);

    const finalPlan: FinalPlan = {
      title: `${duration}日間の東京観光プラン`,
      description: `${startDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}から${endDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}までの素敵な旅行プランをご提案します。`,
      activities: selectedActivities,
      totalDuration: `${duration}日間`,
      estimatedCost: `${totalCost.toLocaleString()}円〜`,
    };

    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(finalPlan);
  } catch (error) {
    console.error('Error creating final plan:', error);
    return NextResponse.json(
      { error: 'Failed to create final plan' },
      { status: 500 }
    );
  }
}
