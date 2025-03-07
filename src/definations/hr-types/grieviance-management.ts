type upload = {
  id: string;
  complaint: string;
  name: string;
  uploaded_file_urls: string[];
  created_datetime: string;
  updated_datetime: string;
};

export interface GrievianceManagement {
  id: string;
  whistle_blower: string;
  title: string;
  description: string;
  feedback: string;
  findings: string;
  date: string;
  is_resolved: boolean;
  uploads: upload[];
}
