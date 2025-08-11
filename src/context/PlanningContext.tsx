'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { PlanningState, PlanningAction } from '@/types';

const initialState: PlanningState = {
  currentStep: 0,
  dateSelection: {
    startDate: null,
    endDate: null,
    duration: 1,
  },
  selectedConcepts: [],
  aiSuggestions: [],
  userChoices: [],
  finalPlan: null,
  isLoading: false,
  error: null,
};

function planningReducer(state: PlanningState, action: PlanningAction): PlanningState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_DATE_SELECTION':
      return { ...state, dateSelection: action.payload };
    case 'SET_SELECTED_CONCEPTS':
      return { ...state, selectedConcepts: action.payload };
    case 'SET_AI_SUGGESTIONS':
      return { ...state, aiSuggestions: action.payload };
    case 'SET_USER_CHOICES':
      return { ...state, userChoices: action.payload };
    case 'SET_FINAL_PLAN':
      return { ...state, finalPlan: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

const PlanningContext = createContext<{
  state: PlanningState;
  dispatch: React.Dispatch<PlanningAction>;
} | null>(null);

export function PlanningProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(planningReducer, initialState);

  return (
    <PlanningContext.Provider value={{ state, dispatch }}>
      {children}
    </PlanningContext.Provider>
  );
}

export function usePlanning() {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
}
