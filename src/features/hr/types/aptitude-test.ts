/**
 * Aptitude Test Types
 * For pre-interview testing (60% weight in final score)
 */

export type TestQuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "ESSAY";

export type TestQuestionCategory =
  | "TECHNICAL"
  | "ANALYTICAL"
  | "COMMUNICATION"
  | "GENERAL_KNOWLEDGE"
  | "BEHAVIORAL";

export type AptitudeTestStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export type TestAssignmentStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "GRADED"
  | "EXPIRED";

export interface TestQuestion {
  id: string;
  question_text: string;
  question_type: TestQuestionType;
  category: TestQuestionCategory;
  options?: string[]; // For multiple choice
  correct_answer?: string; // For auto-grading
  marks: number;
  created_by?: string;
  created_datetime?: string;
  updated_datetime?: string;
}

export interface TestQuestionAssignment {
  id: string;
  test: string;
  question: TestQuestion;
  order: number;
}

export interface AptitudeTest {
  id: string;
  advertisement: string;
  advertisement_title?: string;
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score: number; // Percentage (e.g., 70.00)
  total_marks: number;
  status: AptitudeTestStatus;
  question_assignments?: TestQuestionAssignment[];
  question_count?: number; // Total number of questions in this test
  assigned_count?: number; // Number of applicants assigned this test
  created_datetime?: string;
  updated_datetime?: string;
}

export interface ApplicantTestAssignment {
  id: string;
  applicant: string;
  applicant_name?: string;
  applicant_email?: string;
  test: string;
  test_title?: string;
  access_token: string;
  test_link?: string; // Full URL with token
  assigned_date: string;
  due_date: string;
  status: TestAssignmentStatus;
  started_at?: string;
  submitted_at?: string;
  time_spent_seconds: number;
  assigned_by?: string;
  result?: ApplicantTestResult;
}

export interface TestAnswer {
  question_id: string;
  answer: string | string[]; // String for text, array for MCQ
  is_correct?: boolean; // For auto-graded questions
  score?: number; // Score for this answer
  grader_comments?: string; // For manually graded questions
}

export interface ApplicantTestResult {
  id: string;
  assignment: string;
  answers: Record<string, TestAnswer>; // Keyed by question_id
  auto_graded_score: number;
  manual_graded_score: number;
  final_score: number; // Percentage out of 100
  graded_at?: string;
  graded_by?: string;
  feedback?: string;
  created_datetime?: string;
  updated_datetime?: string;
}

export interface TestStatistics {
  test_id: string;
  test_title: string;
  total_assigned: number;
  total_completed: number;
  total_graded: number;
  average_score: number;
  pass_rate: number;
  highest_score: number;
  lowest_score: number;
  average_time_minutes: number;
}

// Form types
export interface CreateTestQuestionForm {
  question_text: string;
  question_type: TestQuestionType;
  category: TestQuestionCategory;
  options?: string[];
  correct_answer?: string;
  marks: number;
}

export interface CreateAptitudeTestForm {
  advertisement: string;
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score: number;
  total_marks: number;
  status?: AptitudeTestStatus;
}

export interface AddQuestionToTestForm {
  question_id: string;
  order?: number;
}

export interface BulkAssignTestForm {
  test_id: string;
  applicant_ids: string[];
  due_date: string;
}

export interface SubmitTestAnswersForm {
  answers: Record<string, string | string[]>; // Keyed by question_id
}

export interface ManualGradeTestForm {
  question_scores: Record<string, {
    score: number;
    comments?: string;
  }>;
  overall_feedback?: string;
}

// Public test-taking types
export interface PublicTestDetail {
  test: {
    id: string;
    title: string;
    description?: string;
    duration_minutes: number;
    total_marks: number;
  };
  assignment: {
    id: string;
    due_date: string;
    status: TestAssignmentStatus;
    started_at?: string;
    time_spent_seconds: number;
  };
  questions: Array<{
    id: string;
    question_text: string;
    question_type: TestQuestionType;
    category: TestQuestionCategory;
    options?: string[];
    marks: number;
    order: number;
  }>;
  applicant_name: string;
  position_applied: string;
}
