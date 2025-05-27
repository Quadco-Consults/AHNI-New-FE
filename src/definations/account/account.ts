import { z } from "zod";

export const ProfileSchema = z.object({
  first_name: z.string().min(1, "Please enter first name"),
  last_name: z.string().min(1, "Please enter last name"),
  email: z.string().min(1, "Please enter email"),
  username: z.string().min(1, "Please enter username"),
  role: z.string().min(1, "Select Role"),
  gender: z.string().min(1, "Select gender"),
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
