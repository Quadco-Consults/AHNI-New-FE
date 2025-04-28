// To parse this data:
//
//   import { Convert, JobAdvertisementModel } from "./file";
//
//   const jobAdvertisementModel = Convert.toJobAdvertisementModel(json);

export interface JobAdvertisementModel {
  status?: string;
  message?: string;
  data?: JobAdvertisement;
}

export interface JobAdvertisement {
  id?: string;
  interviewers?: Interviewer[];
  created_datetime?: Date;
  updated_datetime?: Date;
  title?: string;
  grade_level?: string;
  locations?: string;
  job_type?: string;
  duration?: string;
  commencement_date?: Date;
  number_of_positions?: number;
  supervisor?: string;
  any_other_info?: string;
  background?: string;
  advert_document?: string;
  created_by?: string;
  updated_by?: null;
}

export interface Interviewer {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  mobile_number?: string;
}

// Converts JSON strings to/from your types
export class Convert {
  public static toJobAdvertisementModel(json: string): JobAdvertisementModel {
    return JSON.parse(json);
  }

  public static jobAdvertisementModelToJson(
    value: JobAdvertisementModel
  ): string {
    return JSON.stringify(value);
  }
}
