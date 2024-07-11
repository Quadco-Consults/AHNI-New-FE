import { z } from "zod";

export const userSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  last_login: z.string().datetime().optional(),
  phone_number: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  designation: z.string(),
});

export type TCreateUser = z.infer<typeof userSchema>;
interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
  codename: string;
  module: string;
}

export interface TUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  last_login: string;
  roles: Role[];
  permissions: Permission[];
  phone_number: string;
  gender: "Male" | "Female" | "Other";
  designation: string;
  fullName: string;
  action: string;
  department: string;
  position: string;
  actions: string; //
}
