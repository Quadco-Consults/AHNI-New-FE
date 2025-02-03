import { z } from "zod";

export const EOISchema = z.object({
  name: z.string().min(1, "Field is required"),
  description: z.string().min(1, "Field is required"),
  // status: z.string(),
  financial_year: z.string().min(1, "Field is required"),
  categories: z.array(z.string()),
  eoi_number: z.string().min(1, "Field is required"),
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
  year_or_incorperation: z
    .string()
    .min(1, "Field is required")
    .max(4, "Max length of four characters"),
  type_of_business: z.string().min(1, "Field is required"),
  nature_of_business: z.string().min(1, "Field is required"),
  company_address: z.string().min(1, "Field is required"),
  email: z.string().email().min(1, "Field is required"),
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
});

export const VendorAttestationSchema = z.object({
  name: z.string().min(1, "Field is required"),
  organisation_name: z.string().min(1, "Field is required"),
  title: z.string().min(1, "Field is required"),
  date: z.string().min(1, "Field is required"),
  signature: z.string().min(1, "Field is required"),
});
export const VendorsSchema = z.object({
  passport: z.string().min(1, "Field is required"),
  approved_categories: z.array(z.string()),
});

//
export const SampleMemoSchema = z.object({
  activity: z.string().min(1, "Field is required"),
  subject: z.string().min(1, "Field is required"),
  requested_date: z.string().min(1, "Field is required"),
  fconumber: z.array(z.string().min(1, "Field is required")),
  intervention_areas: z.array(z.string().min(1, "Field is required")),
  budget_line: z.array(z.string().min(1, "Field is required")),
  cost_categories: z.array(z.string().min(1, "Field is required")),
  cost_input: z.array(z.string().min(1, "Field is required")),
  funding_source: z.array(z.string().min(1, "Field is required")),
  comment: z.string().min(1, "Field is required"),
  reviewed_by: z.array(z.string().min(1, "Field is required")),
  copy: z.array(z.string().min(1, "Field is required")),
  approved_by: z.array(z.string().min(1, "Field is required")),
  created_by: z.string().min(1, "Field is required"),
  expenses: z.array(
    z.object({
      item: z.string().optional(),
      quantity: z.string().optional(),
      days: z.string().optional(),
      unit_cost: z.string().optional(),
      total_cost: z.number().optional(),
    })
  ),
});
//

export const PurchaseRequestSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().optional(),
      item_id: z.string().min(1, "Field is required"),
      category: z.string().min(1, "Field is required"),
      fco: z.string().min(1, "Field is required"),
      units: z.union([
        z.string().min(1, "Field is required"),
        z.number().min(1, "Field is required"),
      ]),
      number_of_days: z.union([
        z.string().min(1, "Field is required"),
        z.number().min(1, "Field is required"),
      ]),
      unit_cost: z.union([
        z.string().min(1, "Field is required"),
        z.number().min(1, "Field is required"),
      ]),
    })
  ),
  request_date: z.string().min(1, "Field is required"),
  required_date: z.string().min(1, "Field is required"),
  requesting_department: z.string().min(1, "Field is required"),
  deliver_to: z.string().min(1, "Field is required"),
});

export const PurchaseOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().optional(),
      item_id: z.string().min(1, "Field is required"),
      fco: z.string().min(1, "Field is required"),
      unit_cost: z.union([
        z.string().min(1, "Field is required"),
        z.number().min(1, "Field is required"),
      ]),
      quantity: z.union([
        z.string().min(1, "Field is required"),
        z.number().min(1, "Field is required"),
      ]),
    })
  ),
  purchase_request: z.string().min(1, "Field is required"),
  vendor: z.string().min(1, "Field is required"),
});

export const PurchaseOrderListSchema = z.object({
  items: z.array(
    z.object({
      // id: z.string().optional(),
      item_id: z.string().min(1, "Field is required"),
      fco: z.string().min(1, "Field is required"),
      unit_cost: z.union([
        z.string().min(1, "Field is required"),
        z.number().min(1, "Field is required"),
      ]),
      quantity: z.union([
        z.string().min(1, "Field is required"),
        z.number().min(1, "Field is required"),
      ]),
      description: z.string().min(1, "Field is required"),
      uom: z.string().min(1, "Field is required"),
      total: z.union([
        z.string().min(1, "Field is required"),
        z.number().min(1, "Field is required"),
      ]),
    })
  ),
  purchase_request: z.string().min(1, "Field is required"),
  vendor: z.string().min(1, "Field is required"),
});

export const SolicitationItemsSchema = z.object({
  items: z.array(
    z.object({
      // id:z.string().min(1, "Field is required"),
      quantity: z.number().min(1, "Field is required"),
      item: z.string().min(1, "Field is required"),
      lot: z.string().min(1, "Field is required"),
    })
  ),
  criteria: z.array(z.string().min(1, "Field is required")),
});

export const SolicitationQuotationSchema = z.object({
  title: z.string().min(1, "Please enter title"),
  rfq_id: z.string().min(1, "Please enter rfq id"),
  background: z.string().min(1, "Please enter background"),
  request_type: z.string().min(1, "Please select request type"),
  tender_type: z.string().min(1, "Please select tender type"),
  purchase_request: z
    .string()
    .min(1, "Please select purchase request")
    .nullable(),
  procurement_type: z.string().min(1, "Please select purchase request"),
});

export type TSolicitationQuotationFormData = z.infer<
  typeof SolicitationQuotationSchema
>;

export const SolicitationSchema = z.object({
  items: z.array(
    z.object({
      // id:z.string().min(1, "Field is required"),
      quantity: z.number().min(1, "Field is required"),
      item: z.string().min(1, "Field is required"),
      lot: z.number().min(1, "Field is required"),
    })
  ),
  criteria: z.array(
    z.object({ criteria: z.string().min(1, "Field is required") })
  ),
  name: z.string().min(1, "Field is required"),
  description: z.string().min(1, "Field is required"),
  opening_date: z.string().min(1, "Field is required"),
  closing_date: z.string().min(1, "Field is required"),
  tender_type: z.string().min(1, "Field is required"),
  request_type: z.string().min(1, "Field is required"),
  limited_vendors: z.array(z.string().min(1, "Field is required")),
  purchase_request: z.string().min(1, "Field is required"),
});

export const SolicitationSubmissionSchema = z.object({
  solicitation_id: z.string().min(1, "Field is required"),
  vendor_id: z.string().min(1, "Field is required"),
  items: z.array(
    z.object({
      quantity: z.number().min(1, "Field is required"),
      unit_price: z.string().min(1, "Field is required"),
      solicitation_item: z.string().min(1, "Field is required"),
    })
  ),
  responses: z.array(
    z.object({
      response: z.string().min(1, "Field is required"),
      solicitation_criteria: z.string().min(1, "Field is required"),
    })
  ),
});

export const CbaSchema = z.object({
  cba_type: z.string().min(1, "Field is required"),
  cba_date: z.string().min(1, "Field is required"),
  solicitation: z.string().min(1, "Field is required"),
  lot: z.string().min(1, "Field is required"),
  assignee: z.string().min(1, "Field is required"),
  committee_members: z.array(z.string()),
});

export const CbaApprovalSchema = z.object({
  status: z.string().min(1, "Field is required"),
  remarks: z.string().min(1, "Field is required"),
});

export const ProcurementMilestoneSchema = z.object({
  milestone_name: z.string().min(1, "Field is required"),
  milestone_description: z.string().min(1, "Field is required"),
});

export const ProcurementPlanSchema = z.object({
  description: z.string().min(1, "Field is required"),
  approved_budget: z.string().min(1, "Field is required"),
  total_quantity: z.string().min(1, "Field is required"),
  pr_staff: z.string().min(1, "Field is required"),
  mode_of_procurement: z.string().min(1, "Field is required"),
  procurement_committee_review: z.string().min(1, "Field is required"),
  procurement_process: z.string().min(1, "Field is required"),
  donor_remarks: z.string().min(1, "Field is required"),
  implenter_remarks: z.string().min(1, "Field is required"),
  start_date: z.string().min(1, "Field is required"),
  expected_delivery_date_1: z.string().min(1, "Field is required"),
  expected_delivery_date_2: z.string().min(1, "Field is required"),
  ware_houses: z.string().min(1, "Field is required"),
  workplan_activity: z.string().min(1, "Field is required"),
  selected_supplier: z.string().min(1, "Field is required"),
  budget_allocation: z.array(
    z.object({
      date_1: z.string().min(1, "Field is required"),
      date_2: z.string().min(1, "Field is required"),
      date_3: z.string().min(1, "Field is required"),
    })
  ),
});

export const ProcurementPlanListSchema = z.object({
  description: z.string().min(1, "Field is required"),
  approved_budget: z.string().min(1, "Field is required"),
  total_quantity: z.string().min(1, "Field is required"),
  pr_staff: z.string().min(1, "Field is required"),
  mode_of_procurement: z.string().min(1, "Field is required"),
  procurement_committee_review: z.string().min(1, "Field is required"),
  procurement_process: z.string().min(1, "Field is required"),
  donor_remarks: z.string().min(1, "Field is required"),
  implenter_remarks: z.string().min(1, "Field is required"),
  start_date: z.string().min(1, "Field is required"),
  expected_delivery_date_1: z.string().min(1, "Field is required"),
  expected_delivery_date_2: z.string().min(1, "Field is required"),
  ware_houses: z.string().min(1, "Field is required"),
  workplan_activity: z.string().min(1, "Field is required"),
  selected_supplier: z.string().min(1, "Field is required"),
  budget_allocation: z.array(
    z.object({
      date_1: z.string().min(1, "Field is required"),
      date_2: z.string().min(1, "Field is required"),
      date_3: z.string().min(1, "Field is required"),
    })
  ),
  milestone_name: z.string().min(1, "Field is required"),
  milestone_description: z.string().min(1, "Field is required"),
});
