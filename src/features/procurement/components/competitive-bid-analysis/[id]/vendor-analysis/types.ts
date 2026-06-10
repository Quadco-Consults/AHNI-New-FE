export interface VendorItem {
  id: string;
  description: string;
  specification: string;
  qty: number;
  brand?: string;
  unitPrice: number;
  total: number;
  selected?: boolean;
}

export interface TechnicalEvaluation {
  criteria: string;
  response: string;
}

export interface VendorData {
  id: string;
  vendorId?: string;
  name: string;
  items: VendorItem[];
  grandTotal: number;
  deliveryTime: string;
  paymentTerms: string;
  tin: string;
  validityPeriod: string;
  bankAccount: string;
  cacRegistration: string;
  workExperience: string;
  currency: string;
  warranty: string;
  technicalEvaluations?: TechnicalEvaluation[];
}

export interface SelectedItem {
  vendorId: string;
  vendorName: string;
  itemId: string;
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
  brand?: string;
}

export interface EvaluationScores {
  qualityScores: { [vendorId: string]: string };
  priceResponsiveness: { [vendorId: string]: string };
  technicalEligibility: { [vendorId: string]: string };
  bankAccountEvaluation: { [vendorId: string]: string };
  experienceEvaluation: { [vendorId: string]: string };
}
