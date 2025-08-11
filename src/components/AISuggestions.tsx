'use client';

import { useState } from 'react';
import { usePlanning } from '@/context/PlanningContext';
import { UserChoice } from '@/types';

export default function AISuggestions() {
  const { state, dispatch } = usePlanning();
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleNext = async () => {
    if (selectedSuggestions.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'アクティビティを1つ以上選択してください' });
      return;
    }

    const userChoices: UserChoice[] = state.aiSuggestions.map(suggestion => ({
      suggestionId: suggestion.id,
      selected: selectedSuggestions.includes(suggestion.id),
    }));

    dispatch({ type: 'SET_USER_CHOICES', payload: userChoices });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const selectedActivities = state.aiSuggestions.filter(s => 
        selectedSuggestions.includes(s.id)
      );

      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateSelection: state.dateSelection,
          selectedActivities,
          concepts: state.selectedConcepts,
        }),
      });

      if (!response.ok) {
        throw new Error('プラン作成に失敗しました');
      }

      const finalPlan = await response.json();
      dispatch({ type: 'SET_FINAL_PLAN', payload: finalPlan });
      dispatch({ type: 'SET_STEP', payload: 3 });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: '最終プランの作成に失敗しました' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        AIが提案するアクティビティから選択してください
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {state.aiSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            onClick={() => toggleSuggestion(suggestion.id)}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedSuggestions.includes(suggestion.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <h3 className="font-bold text-lg text-gray-800 mb-2">{suggestion.name}</h3>
            <p className="text-gray-600 mb-3">{suggestion.description}</p>
            <div className="space-y-1 text-sm text-gray-500">
              <p><span className="font-medium">場所:</span> {suggestion.location}</p>
              <p><span className="font-medium">所要時間:</span> {suggestion.duration}</p>
              <p><span className="font-medium">予算:</span> {suggestion.cost}</p>
              <p><span className="font-medium">カテゴリ:</span> {suggestion.category}</p>
            </div>
          </div>
        ))}
      </div>

      {state.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {state.error}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          戻る
        </button>
        <button
          onClick={handleNext}
          disabled={state.isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {state.isLoading ? 'プラン作成中...' : '最終プランを作成'}
        </button>
      </div>
    </div>
  );
}
