'use client';

import { useState } from 'react';
import { usePlanning } from '@/context/PlanningContext';
import { ActivityConcept } from '@/types';

const concepts: ActivityConcept[] = [
  {
    id: 'travel',
    name: '旅行',
    description: '遠出して新しい場所を探索',
    icon: '✈️',
  },
  {
    id: 'daytrip',
    name: '日帰り',
    description: '近場で楽しむ一日プラン',
    icon: '🚗',
  },
  {
    id: 'male_friends',
    name: '男友達',
    description: '男性同士で楽しむアクティビティ',
    icon: '👨‍👨‍👦',
  },
  {
    id: 'female_friends',
    name: '女友達',
    description: '女性同士で楽しむアクティビティ',
    icon: '👩‍👩‍👧',
  },
  {
    id: 'family',
    name: '家族',
    description: '家族みんなで楽しめるプラン',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'couple',
    name: 'カップル',
    description: '二人で過ごすロマンチックなプラン',
    icon: '💑',
  },
  {
    id: 'outdoor',
    name: 'アウトドア',
    description: '自然の中でのアクティビティ',
    icon: '🏕️',
  },
  {
    id: 'culture',
    name: '文化・芸術',
    description: '美術館や文化施設を楽しむ',
    icon: '🎨',
  },
];

export default function ConceptSelection() {
  const { state, dispatch } = usePlanning();
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);

  const toggleConcept = (conceptId: string) => {
    setSelectedConcepts(prev => 
      prev.includes(conceptId)
        ? prev.filter(id => id !== conceptId)
        : [...prev, conceptId]
    );
  };

  const handleNext = async () => {
    if (selectedConcepts.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'コンセプトを1つ以上選択してください' });
      return;
    }

    dispatch({ type: 'SET_SELECTED_CONCEPTS', payload: selectedConcepts });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateSelection: state.dateSelection,
          concepts: selectedConcepts,
        }),
      });

      if (!response.ok) {
        throw new Error('提案の取得に失敗しました');
      }

      const suggestions = await response.json();
      dispatch({ type: 'SET_AI_SUGGESTIONS', payload: suggestions });
      dispatch({ type: 'SET_STEP', payload: 2 });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'AIからの提案取得に失敗しました' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        遊びのコンセプトを選択してください
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {concepts.map((concept) => (
          <div
            key={concept.id}
            onClick={() => toggleConcept(concept.id)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedConcepts.includes(concept.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl text-center mb-2">{concept.icon}</div>
            <h3 className="font-semibold text-center text-gray-800">{concept.name}</h3>
            <p className="text-sm text-gray-600 text-center mt-1">{concept.description}</p>
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
          {state.isLoading ? 'AI提案を取得中...' : 'AI提案を取得'}
        </button>
      </div>
    </div>
  );
}
