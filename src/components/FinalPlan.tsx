'use client';

import { usePlanning } from '@/context/PlanningContext';

export default function FinalPlan() {
  const { state, dispatch } = usePlanning();

  const handleRestart = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  if (!state.finalPlan) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">プランが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          {state.finalPlan.title}
        </h2>
        <p className="text-gray-600 text-center mb-8">{state.finalPlan.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">期間</h3>
            <p className="text-blue-700">{state.finalPlan.totalDuration}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">予算目安</h3>
            <p className="text-green-700">{state.finalPlan.estimatedCost}</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4 text-gray-800">アクティビティ詳細</h3>
        <div className="space-y-4 mb-8">
          {state.finalPlan.activities.map((activity, index) => (
            <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-800 mb-2">
                    {index + 1}. {activity.name}
                  </h4>
                  <p className="text-gray-600 mb-3">{activity.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                    <p><span className="font-medium">場所:</span> {activity.location}</p>
                    <p><span className="font-medium">時間:</span> {activity.duration}</p>
                    <p><span className="font-medium">費用:</span> {activity.cost}</p>
                    <p><span className="font-medium">種類:</span> {activity.category}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            新しいプランを作成
          </button>
        </div>
      </div>
    </div>
  );
}
