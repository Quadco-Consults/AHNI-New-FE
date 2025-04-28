export interface TVendors {
  [x: string]: any;
  name: string;
  address: string;
  phone_number: string;
}
export interface KeyStaff {
  name: string;
  address: string;
  phone_number: string;
  qualification: string;
}
export interface AssociatedEntities {
  name: string;
  address: string;
  phone_number: string;
  entity_type: string;
}
export interface ProductionEquipments {
  name: string;
  manufacturer: string;
  year: string;
}
export interface Questionairs {
  questionairs: string;
  question: string;
  response: string;
}

export interface VendorsResultsData {
  id: string;
  approved_categories_details: any[];
  branches: TVendors[];
  share_holders: TVendors[];
  key_staff: KeyStaff[];
  associated_entities: AssociatedEntities[];
  production_equipments: ProductionEquipments[];
  key_clients: TVendors[];
  created_at: string;
  updated_at: string;
  uploaded_datetime: string;
  company_name: string;
  company_chairman: string;
  number_of_permanent_staff: string;
  bank_address: string;
  bank_name: string;
  company_registration_number: string;
  year_or_incorperation: string;
  type_of_business: string;
  nature_of_business: string;
  company_address: string;
  email: string;
  website: string;
  phone_number: string;
  tin: string;
  status: string;
  is_active: true;
  passport: string;
  installed_capacity: string;
  lagest_capacity_and_utilization: string;
  number_of_operational_work_shift: number;
  brief_of_quality_control: string;
  brief_of_sampling: string;
  questionairs: Questionairs[];
  submitted_categories: string[];
  approved_categories: string[];
  state: string;
}

export interface VendorsData {
  count: number;
  next: string;
  number_of_pages: number;
  previous: string;
  results: VendorsResultsData[];
}

export interface VendorsResponse {
  message: string;
  data: VendorsResultsData;
}
