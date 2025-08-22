export type AdvertisementResults = {
  //   id: string;
  //   created_at: string;
  //   updated_at: string;
  type: string;
  name: string;
  position: string;
  email: string;
  status: string;
  applicant_first_name?: string;
  applicant_middle_name?: string;
  applicant_last_name?: string;
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
