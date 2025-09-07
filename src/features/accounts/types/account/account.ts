import { z } from "zod";

export const ProfileSchema = z.object({
  first_name: z.string().min(1, "Please enter first name"),
  last_name: z.string().min(1, "Please enter last name"),
  email: z.string().min(1, "Please enter email"),
  username: z.string().optional(),
  // username: z.string().min(1, "Please enter username").optional(),
  // role: z.string().min(1, "Select Role"),
  role: z.array(z.string().min(1)).min(1, "Select at least one role"), // Now expects an array of strings
  gender: z.string().min(1, "Select gender"),
  profile_picture: z.string().optional(),
  mobile_number: z.string().min(1, "Please enter mobile number"),
  department: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
  user_type: z.string().optional(),
});
export const SecuritySchema = z
  .object({
    old_password: z.string().min(1, "Please enter old password"),
    new_password: z.string().min(1, "Please enter new password"),
    confirm_password: z.string().min(1, "Please confirm password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type TProfileFormValues = z.infer<typeof ProfileSchema>;
export type TSecurityFormValues = z.infer<typeof SecuritySchema>;

export interface TProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  new_password: string;
}
