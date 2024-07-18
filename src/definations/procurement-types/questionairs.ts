export type QuestionairData = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  description: string;
};

export interface QuestionairResponse {
  message: string;
  data: QuestionairData;
}
