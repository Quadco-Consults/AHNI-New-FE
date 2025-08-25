import { IUser } from "features/auth/types/user";
import { TSolicitationEvaluationCriteriaData } from "definations/modules/procurement/solicitation-evaluation-criteria";
import { z } from "zod";

// export const SupervisionPlanReviewSchema = z.object({
//   reviews: z.array(
//     z.object({
//       is_selected: z.boolean({
//         required_error: "Please select an option",
//       }),
//       comment: z.string().min(1, "Please enter a comment"),
//       objective: z.string(),
//     })
//   ),
//   documents: z.array(
//     z.object({
//       title: z.string().min(1, "Please enter document title"),
//       label: z.string().optional(),
//       is_selected: z.boolean({
//         required_error: "Please select an option",
//       }),
//       document: z.any().optional().nullable(),
//       name: z.string().optional().nullable(),
//     })
//   ),
//   remediation_plan: z.string().min(1, "Please enter a remediation plan"),
//   is_agree_on_visit_plan: z.string().min(1, "Please select an option"),
// });

export const SupervisionPlanReviewSchema = z.object({
  reviews: z
    .array(
      z.object({
        is_selected: z.boolean().optional().nullable(),
        comment: z.string().optional().nullable(),
        objective: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),
  documents: z
    .array(
      z.object({
        title: z.string().optional().nullable(),
        label: z.string().optional().nullable(),
        is_selected: z.boolean().optional().nullable(),
        document: z.any().optional().nullable(),
        name: z.string().optional().nullable(),
      })
    )
    .optional()
    .nullable(),
  remediation_plan: z
    .string()

    .optional()
    .nullable(),
  is_agree_on_visit_plan: z.string().optional().nullable(),
});

export type TSupervisionPlanReviewFormData = z.infer<
  typeof SupervisionPlanReviewSchema
>;

export interface ISupervisionPlanReviewPaginatedData {
  id: string;
  reviews: {
    id: string;
    objective: TSolicitationEvaluationCriteriaData;
    created_datetime: string;
    updated_datetime: string;
    is_selected: true;
    comment: string;
  }[];
  documents: {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    document: string;
    is_selected: boolean;
    title: string;
  }[];
  user: IUser;
  submission_datetime: string;
  remediation_plan: string;
  is_agree_on_visit_plan: boolean;
  supportive_supervision_plan: string;
}

export interface ISupervisionPlanReviewSingleData {
  id: string;
  reviews: {
    id: string;
    objective: {
      id: string;
      created_datetime: string;
      updated_datetime: string;
      name: string;
      description: string;
      evaluation_category: { name: string };
    };
    created_datetime: string;
    updated_datetime: string;
    is_selected: boolean;
    comment: string;
  }[];
  documents: {
    id: string;
    created_datetime: string;
    updated_datetime: string;
    document: string;
    is_selected: boolean;
    title: string;
  }[];
  user: IUser;
  submission_datetime: string;
  remediation_plan: string;
  is_agree_on_visit_plan: boolean;
  supportive_supervision_plan: string;
}
