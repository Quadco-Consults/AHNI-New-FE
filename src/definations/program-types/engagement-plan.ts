import { z } from "zod";

export const influenceEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const commitmentLevelEnum = z.enum([
    "UNAWARE",
    "AGAINST",
    "NEUTRAL",
    "PHONE_SUPPORT",
    "LEADING",
]);

export const EngagementPlanSchema = z.object({
    project: z.string().min(1, "This field is required"),
    project_deliverables: z.string().min(1, "This field is required"),
    project_manager: z.string().min(1, "This field is required"),

    start_date: z.string().min(1, "Ths field is required"),
    end_date: z.string().min(1, "Ths field is required"),
    stakeholders: z.array(
        z.object({
            influence: influenceEnum,
            information_type: z.string().min(1, "This field is required"),
            decision_maker: z.string().min(1, "This field is required"),
            frequency: z.string().min(1, "This field is required"),
            type: z.string().min(1, "This field is required"),
            commitment_level: commitmentLevelEnum,
            stakeholder: z.string().min(1, "This field is required"),
        })
    ),
});

export type TEngagementPlanFormValues = z.infer<typeof EngagementPlanSchema>;

export type TEngagementPlanPaginatedData = {
    id: string;
    project: string;
    created_datetime: string;
    updated_datetime: string;
    project_deliverables: string;
    start_date: string;
    project_managers: string[];
    end_date: string;
};

export type TEngagementPlanSingleData = {
    id: string;
    project: {
        project_managers: [
            {
                first_name: string;
                last_name: string;
            }
        ];
        id: string;
        title: "Dave Project";
        start_date: "2024-11-29";
        end_date: "2024-11-30";
    };

    stakeholders: [
        {
            id: "d1293805-ae0f-4ca9-86c4-2c365b34901b";
            stakeholder: {
                id: "43ea4b4f-ef2c-4e39-98a0-629652e7081b";
                created_datetime: "2024-11-27T21:14:40.606875Z";
                updated_datetime: "2024-11-27T21:14:40.606889Z";
                name: "Miracle Mudama";
                organization: "Rexversity Limited";
                office_address: "12 Mudama Street, Plateau State";
                state: "Plateau";
                designation: "Project Manager";
                phone_number: "08104478624";
                email: "miraclemudama@mail.com";
                project_role: "Project Organizer";
                importance: 3;
                influence: 4;
                score: 12;
                major_concerns: "No major concerns";
                relationship_owner: "Project Manager";
            };
            created_datetime: "2024-12-03T10:01:41.620310Z";
            updated_datetime: "2024-12-03T10:01:41.620319Z";
            influence: "LOW";
            information_type: "1";
            decision_maker: "1";
            frequency: "3";
            type: "1";
            commitment_level: "AGAINST";
            engagement_plan: "9b2f4cf6-eae4-47dd-b821-4b2b836b08c9";
        }
    ];
    created_datetime: "2024-12-03T10:01:41.616390Z";
    updated_datetime: "2024-12-03T10:01:41.616403Z";
    project_deliverables: "test";
    start_date: "2024-12-03";
    end_date: "2024-12-05";
};
