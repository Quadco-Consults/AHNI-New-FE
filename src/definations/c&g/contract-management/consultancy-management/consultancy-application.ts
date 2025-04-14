import { z } from "zod";

export const ConsultancyApplicantionSchema = z.object({
    consultancy: z.string().min(1, "Field Required"),
    referees: z.array(
        z.object({
            name: z.string().min(1, "Field Required"),
            email: z.string().min(1, "Field Required"),
            phone_number: z.string().min(1, "Field Required"),
        })
    ),
    name: z.string().min(1, "Field Required"),
    email: z.string().min(1, "Field Required"),
    phone_number: z.string().min(1, "Field Required"),
    employment_type: z.string().min(1, "Field Required"),
    resume: z.string().min(1, "Field Required"),
    cover_letter: z.string().min(1, "Field Required"),
});

export type TConsultancyApplicantFormData = z.infer<
    typeof ConsultancyApplicantionSchema
>;

export interface IConsultancyApplicantPaginatedData {}

export interface IConsultancyApplicantSingleData {}
