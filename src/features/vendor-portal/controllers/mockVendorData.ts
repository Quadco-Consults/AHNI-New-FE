// Mock data for testing vendor portal features
import { PurchaseOrder, GoodsReceivedNote, VendorOrderSummary } from '../types/purchase-orders';

export const mockVendorOrderSummary: VendorOrderSummary = {
  total_pos: 12,
  active_pos: 5,
  completed_pos: 7,
  total_value: 125000.00,
  pending_deliveries: 3,
  overdue_deliveries: 1,
  recent_grns: 4,
  average_delivery_rating: 4.2
};

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-001",
    po_number: "PO-2024-001",
    rfq_reference: "RFQ-2024-001",
    submission_reference: "SUB-2024-001",
    vendor_id: "vendor-001",
    vendor_name: "Test Vendor Ltd",
    vendor_email: "vendor@test.com",
    vendor_contact: {
      name: "John Doe",
      phone: "+234-123-456-7890",
      email: "john@test.com"
    },
    status: "ACKNOWLEDGED",
    issue_date: "2024-01-15T00:00:00Z",
    delivery_date: "2024-02-15T00:00:00Z",
    delivery_location: {
      name: "AHNI Lagos Office",
      address: "123 Lagos Street, Lagos, Nigeria",
      contact_person: "Jane Smith",
      phone: "+234-987-654-3210"
    },
    subtotal: 95000.00,
    tax_amount: 7125.00,
    discount_amount: 2125.00,
    total_amount: 100000.00,
    currency: "NGN",
    payment_terms: "Net 30",
    line_items: [
      {
        id: "item-001",
        item_code: "MED-001",
        item_name: "Medical Supplies Kit",
        description: "Basic medical supplies for health centers",
        category: "Medical Equipment",
        unit_of_measure: "Kit",
        quantity_ordered: 50,
        quantity_delivered: 25,
        quantity_pending: 25,
        unit_price: 2000.00,
        total_price: 100000.00,
        delivery_date_requested: "2024-02-15T00:00:00Z",
        delivery_date_confirmed: "2024-02-10T00:00:00Z"
      }
    ],
    delivery_instructions: "Handle with care, refrigeration required",
    tracking_information: {
      carrier: "DHL",
      tracking_number: "DHL123456789",
      estimated_delivery: "2024-02-10T00:00:00Z"
    },
    acknowledgment_date: "2024-01-16T00:00:00Z",
    acknowledgment_notes: "Order acknowledged, delivery confirmed",
    documents: [
      {
        id: "doc-001",
        name: "Purchase Order Document",
        type: "PO_DOCUMENT",
        url: "/documents/po-001.pdf",
        uploaded_date: "2024-01-15T00:00:00Z"
      }
    ],
    procurement_officer: {
      name: "Mike Johnson",
      email: "mike@ahni.org",
      phone: "+234-111-222-3333"
    },
    created_date: "2024-01-15T00:00:00Z",
    last_updated: "2024-01-16T00:00:00Z",
    notes: "Priority order for health centers"
  },
  {
    id: "po-002",
    po_number: "PO-2024-002",
    vendor_id: "vendor-001",
    vendor_name: "Test Vendor Ltd",
    vendor_email: "vendor@test.com",
    vendor_contact: {
      name: "John Doe",
      email: "john@test.com"
    },
    status: "DELIVERED",
    issue_date: "2024-01-10T00:00:00Z",
    delivery_date: "2024-01-25T00:00:00Z",
    delivery_location: {
      name: "AHNI Abuja Office",
      address: "456 Abuja Road, Abuja, Nigeria",
      contact_person: "Sarah Wilson"
    },
    subtotal: 23750.00,
    tax_amount: 1781.25,
    discount_amount: 531.25,
    total_amount: 25000.00,
    currency: "NGN",
    payment_terms: "Net 30",
    line_items: [
      {
        id: "item-002",
        item_code: "NUT-001",
        item_name: "Nutrition Supplements",
        description: "Vitamin supplements for children",
        category: "Nutrition",
        unit_of_measure: "Box",
        quantity_ordered: 100,
        quantity_delivered: 100,
        quantity_pending: 0,
        unit_price: 250.00,
        total_price: 25000.00,
        delivery_date_requested: "2024-01-25T00:00:00Z"
      }
    ],
    documents: [],
    procurement_officer: {
      name: "Mike Johnson",
      email: "mike@ahni.org"
    },
    created_date: "2024-01-10T00:00:00Z",
    last_updated: "2024-01-26T00:00:00Z"
  }
];

export const mockGRNs: GoodsReceivedNote[] = [
  {
    id: "grn-001",
    grn_number: "GRN-2024-001",
    po_id: "po-001",
    po_number: "PO-2024-001",
    vendor_id: "vendor-001",
    vendor_name: "Test Vendor Ltd",
    status: "RECEIVED",
    received_date: "2024-02-10T00:00:00Z",
    received_by: {
      name: "Jane Smith",
      department: "Procurement",
      signature: "signature.png"
    },
    delivery_location: {
      name: "AHNI Lagos Office",
      address: "123 Lagos Street, Lagos, Nigeria"
    },
    received_items: [
      {
        po_line_item_id: "item-001",
        item_code: "MED-001",
        item_name: "Medical Supplies Kit",
        quantity_ordered: 50,
        quantity_received: 25,
        quantity_accepted: 23,
        quantity_rejected: 2,
        unit_price: 2000.00,
        condition_on_receipt: "GOOD",
        inspection_notes: "2 units damaged during transport",
        batch_number: "BATCH-001",
        expiry_date: "2025-12-31T00:00:00Z"
      }
    ],
    inspection_date: "2024-02-11T00:00:00Z",
    inspector_name: "Dr. David Lee",
    inspection_notes: "Most items in good condition, minor damage to 2 units",
    quality_rating: 4,
    value_received: 50000.00,
    value_accepted: 46000.00,
    value_rejected: 4000.00,
    delivery_note_reference: "DN-001",
    invoice_reference: "INV-001",
    photos: ["/images/grn-001-1.jpg", "/images/grn-001-2.jpg"],
    certificates: ["/certificates/quality-cert-001.pdf"],
    return_required: true,
    return_reason: "Damaged packaging",
    replacement_required: true,
    credit_note_required: false,
    created_date: "2024-02-10T00:00:00Z",
    last_updated: "2024-02-11T00:00:00Z",
    vendor_notified: true,
    vendor_notification_date: "2024-02-11T12:00:00Z"
  }
];

// Mock authentication for testing
export const mockVendorAuth = {
  vendor_id: "vendor-001",
  company_name: "Test Vendor Ltd",
  email: "vendor@test.com",
  token: "mock-jwt-token",
  expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
};