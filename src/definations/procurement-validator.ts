import { z } from "zod";

export const EOISchema = z.object({
  name: z.string().min(1, "Field is required"),
  description: z.string().min(1, "Field is required"),
  status: z.string(),
  financial_year: z.string().min(1, "Field is required"),
  categories: z.array(z.string()),
});

export const PrequalificationCriteriaSchema = z.object({
  name: z.string().min(1, "Field is required"),
  description: z.string().min(1, "Field is required"),
  stage: z.string(),
});

export const PrequalificationStagesSchema = z.object({
  name: z.string().min(1, "Field is required"),
  description: z.string().min(1, "Field is required"),
});
export const QuestionairSchema = z.object({
  name: z.string().min(1, "Field is required"),
  description: z.string().min(1, "Field is required"),
});

export const LotsSchema = z.object({
  name: z.string().min(1, "Field is required"),
  packet_number: z.number().min(1, "Field is required"),
});

export const VendorsRegistrationSchema = z.object({
  company_name: z.string().min(1, "Field is required"),
  company_registration_number: z.string().min(1, "Field is required"),
  year_or_incorperation: z.string().min(1, "Field is required"),
  type_of_business: z.string().min(1, "Field is required"),
  nature_of_business: z.string().min(1, "Field is required"),
  company_address: z.string().min(1, "Field is required"),
  email: z.string().min(1, "Field is required"),
  website: z.string().min(1, "Field is required"),
  phone_numbers: z.string().min(1, "Field is required"),
  tin: z.string().min(1, "Field is required"),
  number_of_permanent_staff: z.string().min(1, "Field is required"),
  submitted_categories: z.array(z.string()),
  company_chairman: z.string().min(1, "Field is required"),
  bank_address: z.string().min(1, "Field is required"),
  bank_name: z.string().min(1, "Field is required"),
});

export const VendorsCompanySchema = z.object({
  branches: z.array(
    z.object({
      name: z.string().min(1, "Field is required"),
      address: z.string().min(1, "Field is required"),
      phone_number: z.string().min(1, "Field is required"),
    })
  ),
  share_holders: z.array(
    z.object({
      name: z.string().min(1, "Field is required"),
      address: z.string().min(1, "Field is required"),
      phone_number: z.string().min(1, "Field is required"),
    })
  ),
  key_staff: z.array(
    z.object({
      name: z.string().min(1, "Field is required"),
      address: z.string().min(1, "Field is required"),
      phone_number: z.string().min(1, "Field is required"),
      qualification: z.string().min(1, "Field is required"),
    })
  ),
  associated_entities: z.array(
    z.object({
      name: z.string().min(1, "Field is required"),
      address: z.string().min(1, "Field is required"),
      phone_number: z.string().min(1, "Field is required"),
      entity_type: z.string().min(1, "Field is required"),
    })
  ),
});

export const VendorsTechnicalSchema = z.object({
  production_equipments: z.array(
    z.object({
      name: z.string().min(1, "Field is required"),
      manufacturer: z.string().min(1, "Field is required"),
      year: z.string().min(1, "Field is required"),
    })
  ),
  number_of_operational_work_shift: z.string().min(1, "Field is required"),
  installed_capacity: z.string().min(1, "Field is required"),
  lagest_capacity_and_utilization: z.string().min(1, "Field is required"),
  brief_of_quality_control: z.string().min(1, "Field is required"),
  brief_of_sampling: z.string().min(1, "Field is required"),
});

export const VendorsQuestionnaireSchema = z.object({
  key_clients: z.array(
    z.object({
      name: z.string().min(1, "Field is required"),
      address: z.string().min(1, "Field is required"),
      phone_number: z.string().min(1, "Field is required"),
    })
  ),
  // questionairs: z.array(
  //   z.object({
  //     questionair: z.string().min(1, "Field is required"),
  //     response: z.string().min(1, "Field is required"),
  //   })
  // ),
});

export const VendorsSchema = z.object({
  passport: z.string().min(1, "Field is required"),
  approved_categories: z.array(z.string()),
});
