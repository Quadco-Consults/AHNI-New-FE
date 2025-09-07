import { z } from "zod";
import { Permission } from "./permission";

export const CreateUserSchema = z.object({
  first_name: z.string().min(1, "Please enter first name"),
  last_name: z.string().min(1, "Please enter last name"),
  email: z.string().min(1, "Please enter an email").email("Email is not valid"),
  last_login: z.string().datetime().optional(),
  mobile_number: z.string().min(1, "Please enter a mobile number"),
  gender: z.enum(["MALE", "FEMALE", "Other"]),
  // password: z.string().min(1, "Please enter a password").optional(),
  location: z.string().min(1, "Please select location").optional(),
  state: z.string().min(1, "Please enter state").optional(),
  address: z.string().min(1, "Please enter address").optional(),
  department: z.string().min(1, "Please select a department"),
  position: z.string().min(1, "Please select position"),
  user_type: z.string().min(1, "Please select user type").optional(),
  roles: z.array(z.string().min(1, "Please select user roles")).optional(),

  // confirm_password: z.string().min(1, "Please enter a password").optional(),
});
// .refine((data) => data.password === data.confirm_password, {
//   message: "Passwords don't match",
//   path: ["confirm_password"],
// });

export type TCreateUserFormValues = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  first_name: z.string().min(1, "Please enter a first name"),
  last_name: z.string().min(1, "Please enter a last name"),
  email: z.string().email().min(1, "Please enter an email"),
  mobile_number: z.string().min(1, "Please enter phone number"),
  gender: z.string().min(1, "Please select a gender"),
  location: z.string().min(1, "Please select location").optional(),
  department: z.string().min(1, "Please select a department"),
  position: z.string().min(1, "Please select a position"),
  user_type: z.string().min(1, "Please select user type").optional(),
  roles: z.array(z.string().min(1, "Please select user roles")).optional(),
  is_active: z.boolean().optional(),
});

export type TUpdateUserFormValues = z.infer<typeof UpdateUserSchema>;

interface Role {
  id: string;
  name: string;
}

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  last_login: string;
  roles: Role[];
  permissions: Permission[];
  mobile_number: string;
  gender: "MALE" | "FEMALE" | "Other";
  assigned_modules: string[];
  designation: string;
  fullName: string;
  action: string;
  department: string;
  position: string;
  actions: string;
  is_active: boolean;
  profile_picture: string;
  user_type: string;
  location: string;
  state: string;
  address: string;
}
