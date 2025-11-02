# RFP vs RFQ - Side-by-Side Comparison

## 1. CREATION FORM STRUCTURE

### RFQ Creation (`Quotation.tsx`)
```
Section 1: Basic Information
├── Title
├── RFQ ID
├── Background
├── Tender Type
├── Request Type (set to "REQUEST FOR QUOTATION")
├── Job Category (GOODS/SERVICES)
└── Dates

Section 2: Purchase Request Selection
├── Purchase Request ID
├── Auto-load items from PR
└── Vendor selection

Section 3: Documents
└── Document requirements array
```

### RFP Creation (`Proposal.tsx`) - CURRENT
```
Section 1: Basic Information  ✓
├── Title
├── RFP ID
├── Background
├── Tender Type
├── Request Type (set to "REQUEST FOR PROPOSAL")
└── Dates

Section 2: Project Scope & Requirements  ✓ RFP-SPECIFIC
├── Project Scope
├── Objectives
├── Deliverables
├── Timeline
├── Budget Range
└── Technical Requirements

Section 3: Evaluation & Qualification  ✓ RFP-SPECIFIC
├── Evaluation Criteria (weighted scoring)
└── Qualification Criteria

Section 4: Required Documents  ✓ RFP-SPECIFIC
└── Company docs (Profile, Tax, Financial, Portfolio, Bank Ref)
```

**RFP Issues:**
- No distinction between document types (required company docs vs. proposal docs)
- Evaluation criteria as free text (should be structured with weights)

---

## 2. DETAILS DISPLAY STRUCTURE

### RFQ Details Display
```
Top Section:
├── Title
├── Status Badge
├── RFQ ID, Tender Type

Background Section:
└── Background text

Items Section:  ✓ APPROPRIATE
├── Item Name
├── Description
├── Quantity
├── UOM
├── Lot
└── Specification
```

### RFP Details Display - CURRENT
```
Top Section:
├── Title
├── Status Badge
├── RFQ ID, Tender Type

Background Section:
└── Background text

Items Section:  ✗ WRONG FOR RFP
├── Item Name
├── Description
├── Quantity
├── UOM
├── Lot
└── Specification

MISSING:
└── Project Scope, Objectives, Deliverables, Timeline, etc.
```

**RFP Issues:**
- Shows items table (product-oriented) instead of service details
- Missing project/service-specific information
- No evaluation criteria display

---

## 3. MANUAL SUBMISSION STRUCTURE

### RFQ Manual Bid Submission
```
Step 1: Vendor Selection
└── Dropdown to select approved vendor

Step 2: Items Quotation  ✓ CORRECT
├── Items Table:
│   ├── S/N
│   ├── Item Description
│   ├── Quantity (read-only from RFQ)
│   ├── Unit Price (input by vendor)
│   └── Total (calculated)
└── Total Bid Amount

Step 3: Evaluation Criteria Responses
├── Grid of evaluation criteria fields
└── Simple text input for each criterion

Submit
```

### RFP Manual Bid Submission - CURRENT
```
Step 1: Vendor Selection
└── Dropdown to select approved vendor

Step 2: Items Quotation  ✗ WRONG FOR RFP
├── Items Table:
│   ├── S/N
│   ├── Item Description (from empty items array)
│   ├── Quantity field
│   ├── Unit Price field
│   └── Total (calculated)
└── Total Bid Amount (meaningless for proposals)

Step 3: Evaluation Criteria Responses
├── Grid of evaluation criteria fields
└── Simple text input for each criterion

MISSING:
├── Technical Proposal upload
├── Commercial Proposal upload
├── Supporting Documents section
└── Proposal document descriptions
```

**RFP Issues:**
- Reuses RFQ items table (which is empty for RFP)
- No proposal document upload sections
- Unit price/quantity fields meaningless for services

---

## 4. SUBMISSION DATA STRUCTURE

### RFQ Submission Schema (Current)
```typescript
SolicitationSubmissionSchema {
  solicitation: string (RFQ ID)
  vendor: string (Vendor ID)
  
  bid_items: [  // ✓ CORRECT FOR RFQ
    {
      unit_price: required  // Price for item
      quantity: required    // Qty from RFQ
      solicitation_item: string (RFQ item ID)
    }
  ]
  
  evaluations: [  // ✓ Generic, works for RFQ
    {
      response: string
      evaluation_criteria: string
    }
  ]
  
  // Additional RFQ fields
  delivery_lead_time: required
  payment_terms: required
  tin: required
  validity_period: required
  has_bank_account: required
  is_cac_registered: required
  previous_experience: required
  email: required
  currency: required
  warranty: required
  brand_quoted: required
}
```

### RFP Submission Schema - NEEDED
```typescript
RFPSubmissionSchema {
  solicitation: string (RFP ID)
  vendor: string (Vendor ID)
  
  // ✗ NO bid_items (not applicable)
  // ✗ NO unit_price, quantity (not applicable)
  
  proposal_documents: [  // ✓ NEEDED FOR RFP
    {
      type: "TECHNICAL" | "COMMERCIAL" | "SUPPORTING"
      document_file: File or URL
      document_name: string
      submission_date: datetime
    }
  ]
  
  evaluations: [  // Modified for proposals
    {
      response: string or file_url  // Support file uploads
      evaluation_criteria: string
    }
  ]
  
  // Proposal-specific fields
  approach_summary?: string
  team_composition?: string
  delivery_timeline?: string
  cost_breakdown?: object
  validity_period?: string
  // Remove: payment_terms, warranty, brand_quoted
}
```

---

## 5. VENDOR SUBMISSION DISPLAY (Evaluation)

### RFQ Vendor Submission
```
Table Columns:
├── Vendor Name
├── Type of Business
├── Price Quote
├── Item Compliance
├── RFQ No.
├── Submission Date
├── Price Ranking
├── Delivery Evaluation
└── Actions
```

### RFP Vendor Submission - CURRENT
```
Table Columns:
├── Vendor Name
├── Type of Business
├── Document Compliance  ✓ Shows /7 docs
├── RFP No.
├── Submission Date
├── Experience Review    ✓ Score /40
├── Financial Capacity   ✓ Score /30
├── Overall Status       ✓ Under Review/Approved/Rejected
└── Actions              ✓ View Docs, Technical Review, Committee Review

MISSING:
└── Cost Effectiveness Score (/30) - part of eval criteria
    └── Currently bundled with financial capacity
```

**RFP Implementation Status:**
- Mostly correct structure
- Good action buttons (review documents, evaluation pages)
- Missing: Cost Effectiveness tracking separately

---

## 6. EVALUATION FRAMEWORK

### RFQ Evaluation
```
Typical Criteria:
├── Price (50-70%)
├── Delivery (10-20%)
├── Quality/Warranty (10-20%)
└── Vendor Rating (5-10%)
```

### RFP Evaluation - SPECIFIED IN PROPOSAL.tsx
```
Default Criteria (Lines 84-85):
├── Technical Experience: 40%
├── Company Profile & Financial Capacity: 30%
└── Cost Effectiveness: 30%

Structure Issues:
✗ Evaluation criteria as single text field
✗ No structured weight tracking
✗ "Company Profile & Financial Capacity" combined (should be separate)
✗ Cost Effectiveness not shown separately in submissions display
```

---

## 7. DATA MODEL INTERFACES

### RFQ Data Model (ISolicitationRFQData)
```typescript
interface ISolicitationRFQData {
  id: string
  rfq_id: string
  title: string
  background: string
  status: string
  tender_type: string
  request_type: "REQUEST FOR QUOTATION"
  
  solicitation_items: [  // ✓ CORRECT
    {
      id: string
      item_detail: {
        name: string
        description: string
        uom: string
      }
      lot_detail: { name: string }
      quantity: number
      specification: string
    }
  ]
  
  solicitation_evaluations: [
    {
      id: string
      criteria: string
      title: string
      description: string
    }
  ]
}
```

### RFP Data Model - NEEDS SEPARATE INTERFACE
```typescript
interface ISolicitationRFPData {
  id: string
  rfp_id: string
  title: string
  background: string
  status: string
  tender_type: string
  request_type: "REQUEST FOR PROPOSAL"
  
  // ✗ NO solicitation_items
  // ✗ NO lot_detail
  
  project_details: {  // ✓ NEEDED
    scope: string
    objectives: string
    deliverables: string
    timeline: string
    budget_range?: string
    technical_requirements?: string
  }
  
  evaluation_criteria: {  // ✓ STRUCTURED
    technical_experience: {
      weight: 40
      description: string
    }
    financial_capacity: {
      weight: 30
      description: string
    }
    cost_effectiveness: {
      weight: 30
      description: string
    }
  }
  
  required_documents: [
    {
      document_type: string
      title: string
      description: string
    }
  ]
  
  solicitation_evaluations: [  // Generic eval criteria
    {
      id: string
      criteria: string
    }
  ]
}
```

---

## 8. SUBMISSION PROCESS FLOW

### RFQ Process
```
1. Create RFQ
   └── Add items from Purchase Request
   └── Define evaluation criteria
   └── Publish

2. Vendor Submits Quote
   └── Select vendor
   └── Enter unit prices for items
   └── Fill evaluation responses
   └── Submit

3. Evaluate Bids
   └── Compare prices
   └── Check compliance
   └── Score vendors
   └── Recommend winner
   
4. Create Purchase Order
```

### RFP Process - NEEDED DESIGN
```
1. Create RFP
   └── Define service requirements
   └── Define evaluation criteria
   └── Specify required documents
   └── Publish

2. Vendor Submits Proposal
   └── Select vendor
   └── Upload Technical Proposal (PDF)
   └── Upload Commercial Proposal (PDF)
   └── Upload Supporting Docs (References, Portfolio, etc.)
   └── Fill evaluation criteria responses
   └── Submit

3. Evaluate Proposals (Two-Stage)
   └── Stage 1: Technical Evaluation
       ├── Review technical proposals
       ├── Score: Technical Experience, Approach, Capability
       └── Pass/Fail threshold (e.g., 70% minimum)
   
   └── Stage 2: Financial Evaluation (only passing vendors)
       ├── Review commercial proposals
       ├── Score: Cost Effectiveness, Financial Capacity
       └── Rank by cost

4. Committee Review
   └── Review passed proposals
   └── Vote: Approve/Reject
   └── Select winner

5. Create Service Contract
```

---

## 9. MISSING RFP FEATURES vs CURRENT IMPLEMENTATION

| Feature | RFQ | RFP Current | RFP Needed |
|---------|-----|-------------|-----------|
| Items/Products | Yes | No | No |
| Service Requirements | No | Manual text | Structured fields |
| Technical Proposal Upload | No | No | Yes |
| Commercial Proposal Upload | No | No | Yes |
| Supporting Docs | Limited | No | Yes |
| Evaluation Criteria Structure | Basic | Text field | Weighted framework |
| Technical vs Commercial Split | No | No | Yes |
| Capability Assessment | No | No | Yes |
| Two-stage Evaluation | No | No | Yes |
| Proposal Document Mgmt | No | No | Yes |
| Cost Breakdown Support | No | No | Yes |

---

## 10. CODE IMPLEMENTATION STATUS

### Current Implementation Summary

**GOOD:**
- RFP creation form has service-specific fields
- Vendor submission display layout is RFP-friendly
- Action buttons link to evaluation pages

**PROBLEMATIC:**
1. Manual submission form reuses RFQ items table
2. Details display shows items instead of project details
3. Submission schema expects bid_items (RFQ structure)
4. Evaluation criteria not structured with weights
5. No proposal document upload support
6. No distinction between technical and commercial proposals

**MISSING:**
1. RFP-specific submission schema
2. RFP-specific data model interface
3. Proposal document management
4. Technical proposal evaluation component
5. Commercial proposal evaluation component
6. Two-stage evaluation workflow
7. Cost breakdown calculation

