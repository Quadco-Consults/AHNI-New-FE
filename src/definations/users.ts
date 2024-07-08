import { z } from "zod";

export type UsersResultsData = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  last_login: string;
  roles: {
    id: number;
    name: string;
  }[];
  permissions: {
    id: number;
    name: string;
    codename: string;
    module: string;
  }[];
  phone_number: string;
  gender: string;
  designation: string;
};

export interface UsersData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: UsersResultsData[];
}

export interface UsersResponse {
  message: string;
  data: UsersData;
}

export const UsersSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  last_login: z.string(),
  phone_number: z.string(),
  gender: z.string(),
  designation: z.string(),
});
