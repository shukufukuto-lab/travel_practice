export interface ActivityConcept {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DateSelection {
  startDate: Date | null;
  endDate: Date | null;
  duration: number;
}

export interface AISuggestion {
  id: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  cost: string;
  category: string;
}

export interface UserChoice {
  suggestionId: string;
  selected: boolean;
}

export interface FinalPlan {
  title: string;
  description: string;
  activities: AISuggestion[];
  totalDuration: string;
  estimatedCost: string;
}

export interface PlanningState {
  currentStep: number;
  dateSelection: DateSelection;
  selectedConcepts: string[];
  aiSuggestions: AISuggestion[];
  userChoices: UserChoice[];
  finalPlan: FinalPlan | null;
  isLoading: boolean;
  error: string | null;
}

export type PlanningAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_DATE_SELECTION'; payload: DateSelection }
  | { type: 'SET_SELECTED_CONCEPTS'; payload: string[] }
  | { type: 'SET_AI_SUGGESTIONS'; payload: AISuggestion[] }
  | { type: 'SET_USER_CHOICES'; payload: UserChoice[] }
  | { type: 'SET_FINAL_PLAN'; payload: FinalPlan }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };
