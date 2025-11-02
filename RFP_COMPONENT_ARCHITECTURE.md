# RFP vs RFQ Component Architecture & Data Flow

## Current Architecture (What We Have)

```
┌─────────────────────────────────────────────────────────────────┐
│                    SHARED COMPONENTS ERROR                       │
└─────────────────────────────────────────────────────────────────┘

CREATE FLOW:
═══════════
RFP: Proposal.tsx (service fields)      RFQ: Quotation.tsx (items)
     ↓                                        ↓
     Create via shared controller
     ↓                                        ↓
     Database (same table/endpoint)
     ↓                                        ↓

DISPLAY FLOW:
═════════════
RFP: Details-content.tsx                 RFQ: Details-content.tsx
     ├─ Shows ITEMS TABLE (WRONG!)        ├─ Shows ITEMS TABLE (CORRECT)
     └─ Missing project details          └─ Shows quantities, specs
     ↓                                        ↓
     Same component, different context!

SUBMISSION FLOW (BROKEN):
═════════════════════════
RFP: Manual-bid-submission.tsx           RFQ: Manual-bid-submission.tsx
     ├─ Shows ITEMS TABLE (WRONG!)        ├─ Shows ITEMS TABLE (CORRECT)
     ├─ Quantity fields                   ├─ Quantity fields
     ├─ Unit Price fields (meaningless)   ├─ Unit Price fields
     └─ Missing proposal uploads          └─ Correct for quotations
     ↓                                        ↓
     SolicitationSubmissionSchema (RFQ-centric)
     ├─ bid_items array (RFQ only!)
     ├─ unit_price (RFQ only!)
     └─ No proposal documents
     ↓
     Validation FAILS for RFP

EVALUATION FLOW:
════════════════
RFP: Vendor-submission.tsx               RFQ: Vendor-submission.tsx
     ├─ Document Compliance ✓             ├─ Price ranking
     ├─ Experience Review ✓               ├─ Delivery evaluation
     └─ Financial Capacity ✓              └─ Vendor rating
     ↓
     Generic evaluation (not split between technical/commercial)
```

---

## What Should Be Built (Correct Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│           SEPARATED RFP & RFQ COMPONENTS (CORRECT)              │
└─────────────────────────────────────────────────────────────────┘

CREATE FLOW:
═══════════
RFP: Proposal.tsx                        RFQ: Quotation.tsx
├─ Project scope                         ├─ Items selection
├─ Objectives                            ├─ Purchase request
├─ Deliverables                          └─ Vendor selection
├─ Timeline
├─ Evaluation criteria (structured)
└─ Document requirements
     ↓                                        ↓
     RFP Controller                      RFQ Controller
     (createProposal)                    (createQuotation)
     ↓                                        ↓
     Backend RFP Endpoint                Backend RFQ Endpoint
     ↓                                        ↓

DISPLAY FLOW:
═════════════
RFP: Details-content.tsx                 RFQ: Details-content.tsx
├─ Project scope                         ├─ Items table
├─ Objectives                            ├─ Quantities
├─ Deliverables                          ├─ Unit of measure
├─ Timeline                              ├─ Lot information
├─ Tech requirements                     └─ Specifications
└─ Evaluation framework
     ↓                                        ↓
     ISolicitationRFPData                ISolicitationRFQData
     (with project_details)              (with solicitation_items)
     ↓                                        ↓

SUBMISSION FLOW:
════════════════
RFP: ProposalSubmission.tsx              RFQ: QuotationSubmission.tsx
├─ Vendor selection                      ├─ Vendor selection
├─ Technical Proposal upload             ├─ Items table
├─ Commercial Proposal upload            ├─ Unit price input
├─ Supporting Documents                  └─ Evaluation responses
├─ Evaluation criteria responses
└─ Proposal metadata
     ↓                                        ↓
     RFPSubmissionSchema                 SolicitationSubmissionSchema
     (proposal_documents)                (bid_items)
     ↓                                        ↓
     Backend RFP Endpoint                Backend RFQ Endpoint
     ↓                                        ↓

EVALUATION FLOW:
════════════════
RFP: ProposalEvaluation.tsx              RFQ: BidEvaluation.tsx
├─ Stage 1: Technical                    ├─ Price comparison
│  ├─ Review proposals                   ├─ Delivery assessment
│  └─ Score (40%)                        ├─ Quality check
│                                        └─ Vendor rating
├─ Stage 2: Financial
│  ├─ Review commercial proposals
│  └─ Score (30% + 30%)
│
└─ Committee Review
     ↓                                        ↓
     RFP Evaluation Scores               RFQ Evaluation Scores
     (technical + financial)             (price-based)
     ↓                                        ↓
```

---

## Component File Structure (Target State)

```
/RFP/
├── create/
│   ├── Proposal.tsx              ✓ Keep (service fields)
│   ├── RfpLayout.tsx
│   └── Uploads.tsx
│
├── [id]/
│   ├── index.tsx                 ✓ Keep (main page)
│   │
│   ├── submission/
│   │   └── ProposalSubmission.tsx    ✓ NEW - Replace Manual-bid-submission
│   │       ├─ Vendor selection
│   │       ├─ Technical Proposal upload
│   │       ├─ Commercial Proposal upload
│   │       ├─ Supporting Documents
│   │       └─ Submission handler
│   │
│   └── tab-contents/
│       ├── Details-content.tsx   ✓ REFACTOR - Show project details
│       │   ├─ Project scope
│       │   ├─ Objectives
│       │   ├─ Deliverables
│       │   ├─ Timeline
│       │   ├─ Tech requirements
│       │   └─ Evaluation framework
│       │
│       ├── Vendor-submission.tsx ✓ ENHANCE - Add proposal viewing
│       │   ├─ Proposal documents
│       │   ├─ Technical scores
│       │   ├─ Commercial scores
│       │   └─ Evaluation status
│       │
│       └── evaluation/
│           ├── TechnicalEvaluation.tsx  ✓ NEW
│           ├── CommercialEvaluation.tsx ✓ NEW
│           └── CommitteeReview.tsx      ✓ NEW
│
└── index.tsx                     ✓ Keep (RFP list)

/RFQ/
├── [same structure but for products]
└── ...
```

---

## Data Model Structure (Target State)

```typescript
// CURRENT (WRONG - Single interface for both)
ISolicitationRFQData {
  solicitation_items: []  // Only RFQ
  // Missing: project_scope, objectives, etc.
}

// SHOULD BE (CORRECT - Separate interfaces)

ISolicitationRFPData {
  id: string
  rfp_id: string
  title: string
  background: string
  status: string
  
  // RFP-specific fields
  project_details: {
    scope: string
    objectives: string
    deliverables: string
    timeline: string
    budget_range?: string
    technical_requirements?: string
  }
  
  // Structured evaluation criteria (with weights)
  evaluation_criteria: {
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
  
  // Required documents for proposals
  required_documents: [
    {
      document_type: "TECHNICAL" | "COMMERCIAL" | "SUPPORTING"
      title: string
      description: string
      required: boolean
    }
  ]
  
  // NO items/products
  solicitation_items?: undefined  // Not used for RFP
}

ISolicitationRFQData {
  id: string
  rfq_id: string
  title: string
  background: string
  status: string
  
  // RFQ-specific fields
  purchase_request: string
  
  // Items/products only for RFQ
  solicitation_items: [
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
  
  // Simple evaluation for RFQ
  solicitation_evaluations: [...]
  
  // NO project details
  project_details?: undefined  // Not used for RFQ
}
```

---

## Validation Schema (Target State)

```typescript
// CURRENT (WRONG - RFQ-focused)
SolicitationSubmissionSchema {
  solicitation: string
  vendor: string
  bid_items: [
    { unit_price, quantity, solicitation_item }  // ← RFQ ONLY
  ]
  evaluations: [
    { response, evaluation_criteria }
  ]
  delivery_lead_time, payment_terms, etc.  // ← RFQ specific
}

// SHOULD BE (CORRECT - Separate schemas)

RFPSubmissionSchema {
  solicitation: string (RFP ID)
  vendor: string
  
  proposal_documents: [  // ← RFP ONLY
    {
      type: "TECHNICAL" | "COMMERCIAL" | "SUPPORTING"
      document_file: File or URL
      document_name: string
      submission_date: datetime
      page_count?: number
      file_size?: number
    }
  ]
  
  evaluations: [
    {
      response: string  // Could support file references
      evaluation_criteria: string
    }
  ]
  
  // Proposal-specific metadata
  approach_summary?: string
  team_composition?: string
  delivery_timeline?: string
  cost_breakdown?: {
    total_cost: number
    currency: string
    breakdown_by_phase?: []
  }
  validity_period?: string
}

SolicitationSubmissionSchema {  // Keep for RFQ
  solicitation: string
  vendor: string
  
  bid_items: [
    { unit_price, quantity, solicitation_item }
  ]
  
  evaluations: [
    { response, evaluation_criteria }
  ]
  
  delivery_lead_time, payment_terms, etc.
}
```

---

## Data Flow Diagrams

### RFP Submission Flow (Current - BROKEN)

```
Vendor tries to submit proposal
        ↓
Manual-bid-submission.tsx (RFP version)
├─ Shows items table (EMPTY for RFP)
├─ Shows unit_price field
└─ Shows quantity field
        ↓
Vendor confused... no proposal upload?
        ↓
Maybe submits anyway with empty items
        ↓
SolicitationSubmissionSchema validation
├─ Expects bid_items (✗ WRONG)
├─ Expects unit_price (✗ WRONG)
├─ Expects quantity (✗ WRONG)
└─ Validation FAILS
        ↓
Error: RFP submission cannot be processed
```

### RFP Submission Flow (Should Be)

```
Vendor wants to submit proposal
        ↓
ProposalSubmission.tsx (RFP-specific)
├─ Step 1: Select vendor
├─ Step 2: Upload Technical Proposal
│         (PDF/DOC with approach, methodology, team)
├─ Step 3: Upload Commercial Proposal
│         (PDF with pricing, payment schedule)
├─ Step 4: Upload Supporting Documents
│         (Portfolio, case studies, team bios)
└─ Step 5: Fill Evaluation Criteria
         (Experience, capability, financial info)
        ↓
RFPSubmissionSchema validation
├─ proposal_documents array ✓
├─ File upload validation ✓
└─ Required fields present ✓
        ↓
Backend RFP Endpoint receives:
{
  vendor_id: "...",
  proposal_documents: [
    { type: "TECHNICAL", file: "proposal.pdf", ... },
    { type: "COMMERCIAL", file: "pricing.pdf", ... },
    ...
  ],
  evaluations: [...]
}
        ↓
Success! Proposal stored with documents
```

---

## Evaluation Scoring Model (Target State)

```
┌─────────────────────────────────────┐
│  RFP EVALUATION (Multi-Stage)       │
└─────────────────────────────────────┘

STAGE 1: TECHNICAL EVALUATION
═══════════════════════════════
- Review: Technical Proposal documents
- Scored by: Technical committee
- Criteria:
  * Technical Experience (domain knowledge)
  * Proposed Approach (methodology)
  * Team Capability (staffing/expertise)
  * Risk Management (problem-solving)
- Scoring: 0-40 points (minimum 70% to advance)
- Result: PASS/FAIL (threshold-based)
        ↓
        Only PASSING proposals advance to Stage 2

STAGE 2: COMMERCIAL & FINANCIAL EVALUATION
═══════════════════════════════════════════
- Review: Commercial Proposal + Financial info
- Scored by: Financial committee
- Criteria:
  * Cost Effectiveness (points: 0-30)
  * Financial Capacity (points: 0-30)
  * Payment Terms (flexibility)
  * Delivery Schedule (timeline)
- Scoring: 0-60 points
- Result: RANKED (highest score wins)
        ↓
        Top candidates presented to committee

STAGE 3: COMMITTEE REVIEW & DECISION
═════════════════════════════════════
- Review: All passed proposals
- Decision by: Committee vote
- Options: APPROVE / REJECT
- Result: Winner selected
        ↓
        Winner recommended for contract award

TOTAL SCORE CALCULATION:
═════════════════════════
If passed Stage 1:
  Total = Technical Score (0-40) + Commercial Score (0-60)
  Max = 100 points
  
Ranking:
  - Sort by total score (highest first)
  - Committee votes on top candidates
  - Winner announced


┌─────────────────────────────────────┐
│  RFQ EVALUATION (Simple)            │
└─────────────────────────────────────┘

SINGLE STAGE: BID EVALUATION
═════════════════════════════
- Review: Price quotations
- Scored by: Procurement officer
- Criteria:
  * Unit Price (lowest = best)
  * Compliance (specification match)
  * Delivery (lead time)
  * Warranty (if applicable)
- Result: RANKED (lowest price typically wins)
        ↓
        Winner recommended for PO
```

---

## File Changes Matrix

```
┌────────────────────────────────────────────────────────────────┐
│ FILE CHANGES REQUIRED FOR PROPER RFP IMPLEMENTATION           │
└────────────────────────────────────────────────────────────────┘

FILE: RFP/create/Proposal.tsx
STATUS: ✓ Keep (mostly good)
CHANGES:
  - No major changes needed
  - Consider separating document requirements by type

FILE: RFP/[id]/Manual-bid-submission.tsx
STATUS: ✗ REPLACE with ProposalSubmission.tsx
PRIORITY: CRITICAL
CHANGES:
  - Delete entire items table (lines 148-216)
  - Add technical proposal upload section
  - Add commercial proposal upload section
  - Add supporting documents section
  - Refactor to use RFPSubmissionSchema

FILE: RFP/[id]/tab-contents/Details-content.tsx
STATUS: ✗ REFACTOR
PRIORITY: HIGH
CHANGES:
  - Add conditional rendering (RFP vs RFQ)
  - If RFP: Show project details
  - If RFQ: Show items table (current)
  - Add project scope, objectives, deliverables
  - Add timeline display
  - Add evaluation criteria display

FILE: RFP/[id]/tab-contents/Vendor-submission.tsx
STATUS: ✓ ENHANCE (already good)
PRIORITY: MEDIUM
CHANGES:
  - Add proposal document viewing
  - Split scores: Technical (0-40) vs Commercial (0-60)
  - Show document compliance correctly
  - Add cost effectiveness column

FILE: types/solicitation.ts
STATUS: ✗ ADD ISolicitationRFPData
PRIORITY: HIGH
CHANGES:
  - Create new ISolicitationRFPData interface
  - Include project_details object
  - Include structured evaluation_criteria
  - Include required_documents array
  - Keep ISolicitationRFQData unchanged

FILE: types/procurement-validator.ts
STATUS: ✗ CREATE RFPSubmissionSchema
PRIORITY: CRITICAL
CHANGES:
  - Keep SolicitationSubmissionSchema for RFQ
  - Create new RFPSubmissionSchema for proposals
  - proposal_documents array
  - Evaluation responses (file-safe)
  - Remove bid_items requirement for RFP

FILE: solicitationController.ts
STATUS: ? INVESTIGATE
PRIORITY: HIGH
CHANGES:
  - Clarify if RFP/RFQ share endpoint
  - Add RFP-specific validation
  - Handle proposal document uploads
  - Document backend expectations

FILE: vendorBidSubmissionsController.ts
STATUS: ? INVESTIGATE
PRIORITY: MEDIUM
CHANGES:
  - Check if RFP uses this or separate controller
  - Add RFP submission handling
  - Document proposal storage
```

---

## Summary: What Needs to Happen

```
1. TYPE SYSTEM
   ├─ Create ISolicitationRFPData interface
   ├─ Create RFPSubmissionSchema
   └─ Keep RFQ types unchanged

2. COMPONENTS
   ├─ Create ProposalSubmission.tsx (replace broken Manual-bid-submission)
   ├─ Refactor Details-content.tsx (add conditional rendering)
   ├─ Enhance Vendor-submission.tsx (better display)
   └─ Create evaluation components

3. VALIDATION
   ├─ Split SolicitationSubmissionSchema
   ├─ Create RFP-specific validation
   └─ Remove RFQ assumptions from RFP

4. BACKEND CLARIFICATION
   ├─ API endpoints (shared or separate?)
   ├─ Document storage (where/how?)
   ├─ Evaluation criteria (text or structured?)
   └─ Submission structure (what fields?)

5. USER WORKFLOWS
   ├─ Create proper RFP submission flow
   ├─ Implement two-stage evaluation
   ├─ Add proposal document management
   └─ Create committee review interface
```

