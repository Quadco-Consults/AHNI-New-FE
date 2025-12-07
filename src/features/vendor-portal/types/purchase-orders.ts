export type POStatus =
  | 'PENDING'          // PO created but not yet sent to vendor
  | 'ISSUED'           // PO sent to vendor
  | 'ACKNOWLEDGED'     // Vendor confirmed receipt and acceptance
  | 'IN_PROGRESS'      // Vendor is fulfilling the order
  | 'PARTIALLY_DELIVERED' // Some items delivered
  | 'DELIVERED'        // All items delivered
  | 'COMPLETED'        // PO fully completed and closed
  | 'CANCELLED'        // PO was cancelled
  | 'DISPUTED';        // There's a dispute with the PO

export type GRNStatus =
  | 'PENDING'          // Items not yet received
  | 'PARTIALLY_RECEIVED' // Some items received
  | 'RECEIVED'         // All items received
  | 'INSPECTED'        // Items received and inspected
  | 'ACCEPTED'         // Items accepted after inspection
  | 'REJECTED'         // Items rejected after inspection
  | 'RETURNED';        // Items returned to vendor

export type DeliveryStatus =
  | 'SCHEDULED'        // Delivery scheduled
  | 'IN_TRANSIT'       // Items in transit
  | 'DELIVERED'        // Items delivered to location
  | 'CONFIRMED'        // Delivery confirmed by recipient
  | 'DELAYED'          // Delivery delayed
  | 'FAILED';          // Delivery attempt failed

export interface POLineItem {
  id: string;
  item_code: string;
  item_name: string;
  description: string;
  category: string;
  unit_of_measure: string;
  quantity_ordered: number;
  quantity_delivered: number;
  quantity_pending: number;
  unit_price: number;
  total_price: number;
  delivery_date_requested: string;
  delivery_date_confirmed?: string;
  specifications?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  rfq_reference?: string;
  submission_reference?: string;
  vendor_id: string;
  vendor_name: string;
  vendor_email: string;
  vendor_contact: {
    name: string;
    phone?: string;
    email: string;
  };

  // PO Details
  status: POStatus;
  issue_date: string;
  delivery_date: string;
  delivery_location: {
    name: string;
    address: string;
    contact_person: string;
    phone?: string;
  };

  // Financial
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  payment_terms: string;

  // Line Items
  line_items: POLineItem[];

  // Delivery & Tracking
  delivery_instructions?: string;
  tracking_information?: {
    carrier?: string;
    tracking_number?: string;
    estimated_delivery?: string;
  };

  // Status Tracking
  acknowledgment_date?: string;
  acknowledgment_notes?: string;
  completion_date?: string;

  // Documents
  documents: {
    id: string;
    name: string;
    type: 'PO_DOCUMENT' | 'SPECIFICATIONS' | 'DRAWINGS' | 'CERTIFICATES';
    url: string;
    uploaded_date: string;
  }[];

  // AHNI Contact
  procurement_officer: {
    name: string;
    email: string;
    phone?: string;
  };

  // History
  created_date: string;
  last_updated: string;
  notes?: string;
}

export interface GoodsReceivedNote {
  id: string;
  grn_number: string;
  po_id: string;
  po_number: string;
  vendor_id: string;
  vendor_name: string;

  // GRN Details
  status: GRNStatus;
  received_date: string;
  received_by: {
    name: string;
    department: string;
    signature?: string;
  };

  // Location
  delivery_location: {
    name: string;
    address: string;
  };

  // Items Received
  received_items: {
    po_line_item_id: string;
    item_code: string;
    item_name: string;
    quantity_ordered: number;
    quantity_received: number;
    quantity_accepted: number;
    quantity_rejected: number;
    unit_price: number;
    condition_on_receipt: 'GOOD' | 'DAMAGED' | 'DEFECTIVE' | 'INCOMPLETE';
    inspection_notes?: string;
    batch_number?: string;
    expiry_date?: string;
    serial_numbers?: string[];
  }[];

  // Inspection Details
  inspection_date?: string;
  inspector_name?: string;
  inspection_notes?: string;
  quality_rating?: number; // 1-5 scale

  // Financial Impact
  value_received: number;
  value_accepted: number;
  value_rejected: number;

  // Documentation
  delivery_note_reference?: string;
  invoice_reference?: string;
  photos?: string[];
  certificates?: string[];

  // Follow-up Actions
  return_required: boolean;
  return_reason?: string;
  replacement_required: boolean;
  credit_note_required: boolean;

  // Timestamps
  created_date: string;
  last_updated: string;

  // Notifications
  vendor_notified: boolean;
  vendor_notification_date?: string;
}

export interface PONotification {
  id: string;
  po_id: string;
  notification_type: 'PO_ISSUED' | 'PO_UPDATED' | 'DELIVERY_REMINDER' | 'DELIVERY_OVERDUE';
  title: string;
  message: string;
  sent_date: string;
  read_date?: string;
  action_required: boolean;
  action_deadline?: string;
}

export interface GRNNotification {
  id: string;
  grn_id: string;
  notification_type: 'GRN_CREATED' | 'ITEMS_RECEIVED' | 'ITEMS_ACCEPTED' | 'ITEMS_REJECTED' | 'RETURN_REQUIRED';
  title: string;
  message: string;
  sent_date: string;
  read_date?: string;
  action_required: boolean;
  requires_response: boolean;
}

export interface VendorOrderSummary {
  total_pos: number;
  active_pos: number;
  completed_pos: number;
  total_value: number;
  pending_deliveries: number;
  overdue_deliveries: number;
  recent_grns: number;
  average_delivery_rating: number;
}

export interface DeliveryPerformanceMetrics {
  on_time_delivery_rate: number;
  quality_score: number;
  total_deliveries: number;
  late_deliveries: number;
  rejected_items_rate: number;
  average_inspection_score: number;
  vendor_response_time: number; // Average time to acknowledge POs
}

export interface POAcknowledgment {
  po_id: string;
  acknowledged_date: string;
  estimated_delivery_date: string;
  line_item_confirmations: {
    po_line_item_id: string;
    can_fulfill: boolean;
    confirmed_quantity: number;
    confirmed_delivery_date: string;
    alternative_specifications?: string;
    notes?: string;
  }[];
  vendor_notes?: string;
  delivery_method: string;
  tracking_will_be_provided: boolean;
}

export interface DeliveryUpdate {
  po_id: string;
  delivery_status: DeliveryStatus;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  tracking_information?: {
    carrier: string;
    tracking_number: string;
    tracking_url?: string;
  };
  delivery_notes?: string;
  partial_delivery_details?: {
    po_line_item_id: string;
    quantity_delivered: number;
    delivery_date: string;
  }[];
}