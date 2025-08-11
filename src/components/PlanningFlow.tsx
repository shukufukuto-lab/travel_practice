'use client';

import { usePlanning } from '@/context/PlanningContext';
import DateSelection from './DateSelection';
import ConceptSelection from './ConceptSelection';
import AISuggestions from './AISuggestions';
import FinalPlan from './FinalPlan';

const steps = [
  '日程選択',
  'コンセプト選択',
  'アクティビティ選択',
  '最終プラン',
];

export default function PlanningFlow() {
  const { state } = usePlanning();

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <DateSelection />;
      case 1:
        return <ConceptSelection />;
      case 2:
        return <AISuggestions />;
      case 3:
        return <FinalPlan />;
      default:
        return <DateSelection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
            AI Travel Planner
          </h1>
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= state.currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      index <= state.currentStep ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 ml-4 ${
                        index < state.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
