export type AdvertisementResults = {
  id: string;
  created_datetime: string;
  updated_datetime: string;
  applicant_first_name?: string;
  applicant_middle_name?: string;
  applicant_last_name?: string;
  applicant_name?: string;
  applicant_email: string;
  position_applied: string;
  employment_type?: string;
  status: string;
  advertisement: string;
  // Interview-related fields from combined status
  realStatus?: string;
  interviewScore?: number;
  interviewCompleted?: boolean;
  interviewScheduled?: boolean;
  interview?: any;
};

export type InterviewResults = {
  name: string;
  appearance: number;
  communication: number;
  teamwork: number;
  ethics: number;
  analytical: number;
  technical: number;
  knowledge: number;
  experience: number;
  average: number;
  percentage: string;
};
