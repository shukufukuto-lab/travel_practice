'use client';

import { useState } from 'react';
import { usePlanning } from '@/context/PlanningContext';

export default function DateSelection() {
  const { state, dispatch } = usePlanning();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleNext = () => {
    if (!startDate || !endDate) {
      dispatch({ type: 'SET_ERROR', payload: '日程を選択してください' });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    dispatch({
      type: 'SET_DATE_SELECTION',
      payload: {
        startDate: start,
        endDate: end,
        duration,
      },
    });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        日程を選択してください
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            開始日
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            終了日
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {state.error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {state.error}
        </div>
      )}

      <button
        onClick={handleNext}
        className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        次へ
      </button>
    </div>
  );
}
