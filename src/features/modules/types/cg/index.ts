// Pre-award Question types
export interface PreAwardQuestionData {
  id: string;
  question: string;
  question_type: 'text' | 'multiple_choice' | 'yes_no' | 'number' | 'date';
  options?: string[];
  is_required: boolean;
  weight?: number;
  category?: string;
  order?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PreAwardQuestionFormValues {
  question: string;
  question_type: 'text' | 'multiple_choice' | 'yes_no' | 'number' | 'date';
  options?: string[];
  is_required: boolean;
  weight?: number;
  category?: string;
  order?: number;
  description?: string;
}

// Legacy type exports for backward compatibility
export type TPreAwardQuestionData = PreAwardQuestionData;
export type TPreAwardQuestionFormValues = PreAwardQuestionFormValues;