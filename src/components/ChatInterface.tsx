'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlanning } from '@/context/PlanningContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { ActivityConcept, AISuggestion } from '@/types';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string | React.ReactNode;
  timestamp: Date;
}

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

export default function ChatInterface() {
  const { state, dispatch } = usePlanning();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: 'こんにちは！AI旅行プランナーです。素敵な旅行プランを一緒に作りましょう！まずは、旅行の日程を教えてください。',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const addMessage = (type: 'user' | 'ai', content: string | React.ReactNode) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleDateSelection = () => {
    const startDate = (document.getElementById('startDate') as HTMLInputElement)?.value;
    const endDate = (document.getElementById('endDate') as HTMLInputElement)?.value;

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

    addMessage('user', `${start.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}から${end.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}まで（${duration}日間）`);
    
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('ai', 
          <div>
            <p className="mb-3">素晴らしい日程ですね！次に、どのようなコンセプトの旅行をお考えですか？以下から当てはまるものを選択してください（複数選択可）：</p>
            <div className="grid grid-cols-2 gap-2">
              {concepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => toggleConcept(concept.id)}
                  className={`p-3 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                    selectedConcepts.includes(concept.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg mb-1">{concept.icon}</div>
                  <div className="font-semibold text-sm">{concept.name}</div>
                  <div className="text-xs text-gray-600">{concept.description}</div>
                </button>
              ))}
            </div>
            <button
              onClick={handleConceptSelection}
              disabled={selectedConcepts.length === 0}
              className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              選択完了
            </button>
          </div>
        );
        dispatch({ type: 'SET_STEP', payload: 1 });
      }, 1500);
    }, 500);
  };

  const toggleConcept = (conceptId: string) => {
    setSelectedConcepts(prev => 
      prev.includes(conceptId)
        ? prev.filter(id => id !== conceptId)
        : [...prev, conceptId]
    );
  };

  const handleConceptSelection = async () => {
    if (selectedConcepts.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'コンセプトを1つ以上選択してください' });
      return;
    }

    const selectedConceptNames = concepts
      .filter(c => selectedConcepts.includes(c.id))
      .map(c => c.name)
      .join('、');

    addMessage('user', `選択したコンセプト: ${selectedConceptNames}`);
    dispatch({ type: 'SET_SELECTED_CONCEPTS', payload: selectedConcepts });

    setIsTyping(true);
    
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
      
      setIsTyping(false);
      addMessage('ai',
        <div>
          <p className="mb-3">ご希望に合わせて、以下のアクティビティを提案いたします！気になるものを選択してください（複数選択可）：</p>
          <div className="space-y-3">
            {suggestions.map((suggestion: AISuggestion) => (
              <div
                key={suggestion.id}
                onClick={() => toggleSuggestion(suggestion.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedSuggestions.includes(suggestion.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-bold text-sm mb-2">{suggestion.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                  <p><span className="font-medium">場所:</span> {suggestion.location}</p>
                  <p><span className="font-medium">時間:</span> {suggestion.duration}</p>
                  <p><span className="font-medium">費用:</span> {suggestion.cost}</p>
                  <p><span className="font-medium">種類:</span> {suggestion.category}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleSuggestionSelection}
            disabled={selectedSuggestions.length === 0}
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            選択完了
          </button>
        </div>
      );
      dispatch({ type: 'SET_STEP', payload: 2 });
    } catch {
      setIsTyping(false);
      dispatch({ type: 'SET_ERROR', payload: 'AIからの提案取得に失敗しました' });
    }
  };

  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleSuggestionSelection = async () => {
    if (selectedSuggestions.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: 'アクティビティを1つ以上選択してください' });
      return;
    }

    const selectedActivityNames = state.aiSuggestions
      .filter(s => selectedSuggestions.includes(s.id))
      .map(s => s.name)
      .join('、');

    addMessage('user', `選択したアクティビティ: ${selectedActivityNames}`);

    setIsTyping(true);

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
      
      setIsTyping(false);
      addMessage('ai',
        <div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-bold mb-2 text-gray-800">{finalPlan.title}</h3>
            <p className="text-gray-600 mb-4">{finalPlan.description}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 text-sm mb-1">期間</h4>
                <p className="text-blue-700 text-sm">{finalPlan.totalDuration}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800 text-sm mb-1">予算目安</h4>
                <p className="text-green-700 text-sm">{finalPlan.estimatedCost}</p>
              </div>
            </div>

            <h4 className="font-bold mb-3 text-gray-800">アクティビティ詳細</h4>
            <div className="space-y-3">
              {finalPlan.activities.map((activity: AISuggestion, index: number) => (
                <div key={activity.id} className="border border-gray-200 rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-gray-800 mb-2">
                    {index + 1}. {activity.name}
                  </h5>
                  <p className="text-xs text-gray-600 mb-2">{activity.description}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                    <p><span className="font-medium">場所:</span> {activity.location}</p>
                    <p><span className="font-medium">時間:</span> {activity.duration}</p>
                    <p><span className="font-medium">費用:</span> {activity.cost}</p>
                    <p><span className="font-medium">種類:</span> {activity.category}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleRestart}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              新しいプランを作成
            </button>
          </div>
        </div>
      );
      dispatch({ type: 'SET_STEP', payload: 3 });
    } catch {
      setIsTyping(false);
      dispatch({ type: 'SET_ERROR', payload: '最終プランの作成に失敗しました' });
    }
  };

  const handleRestart = () => {
    dispatch({ type: 'RESET_STATE' });
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: 'こんにちは！AI旅行プランナーです。素敵な旅行プランを一緒に作りましょう！まずは、旅行の日程を教えてください。',
        timestamp: new Date(),
      },
    ]);
    setSelectedConcepts([]);
    setSelectedSuggestions([]);
  };

  const renderDateInput = () => (
    <div>
      <p className="mb-3">旅行の日程を選択してください：</p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">開始日</label>
          <input
            id="startDate"
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={new Date().toISOString().split('T')[0]}
            defaultValue=""
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">終了日</label>
          <input
            id="endDate"
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            defaultValue=""
          />
        </div>
        <button
          onClick={handleDateSelection}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          日程を確定
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    if (state.currentStep === 0 && messages.length === 1) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage('ai', renderDateInput());
        }, 1000);
      }, 500);
    }
  }, [state.currentStep, messages.length]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">AI Travel Planner</h1>
        <p className="text-sm text-gray-600">AIが提案する遊びのプランニングアプリ</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            type={message.type}
            timestamp={message.timestamp}
          >
            {message.content}
          </MessageBubble>
        ))}
        
        {isTyping && <TypingIndicator />}
        
        {state.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {state.error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
