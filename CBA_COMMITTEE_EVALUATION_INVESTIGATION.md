# CBA (Competitive Bid Analysis) Committee Evaluation Workflow Investigation

## Overview
This investigation documents how the Competitive Bid Analysis (CBA) committee evaluation workflow is implemented in the AHNI procurement system, including how committee member evaluations gate Purchase Order (PO) issuance.

---

## 1. CBA Core Types and Data Structures

### 1.1 CBA Type Definition (`/src/features/procurement/types/cba.ts`)

**Key Status States:**
- `PENDING` - CBA awaiting evaluation/approval
- `APPROVED` - CBA fully approved
- `REJECTED` - CBA rejected
- `COMPLETED` - CBA completed

**Committee Member Assignment:**
```typescript
type CommitteeMemberData = {
  id: string;
  first_name: string;
  last_name: string;
  designation: string;
};
```

**CBA Results Structure:**
```typescript
type CbaResultsData = {
  id: string;
  cba_type: 'COMMITTEE' | 'NON COMMITTEE';  // KEY: Type distinguishes committee workflows
  committee_members: CommitteeMemberData[];  // Array of assigned committee members
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  assignee?: AssigneeData;  // Single assignee responsible for CBA
  // ... additional fields
};
```

---

## 2. CBA Workflow Steps and Approval Gates

### 2.1 Three-Step Approval Workflow

**Current Step Mapping (from `/src/features/procurement/components/competitive-bid-analysis/[id]/index.tsx`):**

```
Step 1: PENDING → "reviewed" (Reviewer approval)
Step 2: REVIEWED → "authorized" (Authorizer approval)  
Step 3: AUTHORIZED → "approved" (Final Approver approval)
State: COMPLETED → All approvals done
```

**Status Progression:**
- Initial: `PENDING`
- After step 1: `REVIEWED` 
- After step 2: `AUTHORIZED`
- After step 3: `APPROVED` (Final state - gates PO issuance)

### 2.2 Signature Workflow Status Tracking

From `/src/features/procurement/controllers/signatureWorkflowController.ts`:

```typescript
interface SignatureWorkflowStatus {
  current_step: 'prepared' | 'committee' | 'reviewed' | 'authorized' | 'approved' | 'completed';
  is_completed: boolean;
  can_sign: boolean;
  pending_signatures: string[];        // KEY: Tracks signatures still needed
  completed_signatures: string[];      // KEY: Tracks signatures received
  next_approver?: {
    id: string;
    name: string;
    title: string;
  };
}
```

**Committee Step in Workflow:**
- Special step: `'committee'` - This is where **committee members must all evaluate**
- Tracked via: `pending_signatures` and `completed_signatures` arrays

---

## 3. Committee Member Evaluation Process

### 3.1 Committee Member Data Management

**Location:** `/src/features/procurement/components/solicitation-management/RFQ/create/CreateCBA.tsx`

**CBA Creation with Committee:**
```typescript
const CbaSchema = z.object({
  cba_type: z.enum(['COMMITTEE', 'NON COMMITTEE']),
  committee_members: z.array(z.string().uuid()), // Array of member IDs
  solicitation: z.string().uuid(),
  lot: z.string().uuid().optional(),
  assignee: z.string().uuid().optional(),
  remarks: z.string().optional(),
});
```

### 3.2 Committee Evaluation Workflow

**Approval Workflow Structure (from `/src/features/procurement/types/cba.ts`):**

```typescript
interface ApprovalWorkflow {
  preparedBy: SignatureBlock;
  procurementCommittee: SignatureBlock[];  // KEY: Array of committee members
  reviewedBy: SignatureBlock;
  authorizedBy: SignatureBlock;
  approvedBy: SignatureBlock;
}

interface SignatureBlock {
  title: string;
  name?: string;
  date?: string;
  signature?: string;
  status?: 'pending' | 'signed' | 'rejected';
  signed_at?: string;
  remarks?: string;
}
```

**Committee Member Status Tracking:**
- Each committee member has individual signature block
- Status per member: `'pending' | 'signed' | 'rejected'`
- This allows tracking **which members** have evaluated

---

## 4. Vendor Analysis and Committee Selection

### 4.1 Vendor Bid Analysis Component

**Location:** `/src/features/procurement/components/competitive-bid-analysis/[id]/VendorBidAnalysis.tsx`

**Committee Evaluation Fields:**
```typescript
// Committee evaluation state
const [qualityScores, setQualityScores] = useState<{[vendorId: string]: string}>({});
const [approvedModels, setApprovedModels] = useState<{[vendorId: string]: string}>({});
const [priceResponsiveness, setPriceResponsiveness] = useState<{[vendorId: string]: string}>({});
const [technicalEligibility, setTechnicalEligibility] = useState<{[vendorId: string]: string}>({});
const [bankAccountEvaluation, setBankAccountEvaluation] = useState<{[vendorId: string]: string}>({});
const [experienceEvaluation, setExperienceEvaluation] = useState<{[vendorId: string]: string}>({});
```

**Award Recommendation:**
```typescript
const [awardRecommendation, setAwardRecommendation] = useState("");
```

### 4.2 Analysis Submission Payload

```typescript
interface CbaAnalysisSubmissionPayload {
  cba_id: string;
  solicitation_id: string;
  vendor_id: string;
  recommendation_note?: string;
  selected_items: string[];  // Item IDs approved by committee
}
```

---

## 5. Scoring and Evaluation System

### 5.1 Vendor Scoring Structure

**Score Calculation (from `/src/features/procurement/types/cba.ts`):**

```typescript
interface VendorEvaluation {
  vendor_id: string;
  technical_eligibility: boolean;
  financial_eligibility: boolean;
  delivery_leadtime: string;
  payment_terms: string;
  tax_identification: string;
  validity_period: string;
  bank_account_verified: boolean;
  vendor_experience_verified: boolean;
  currency: string;
  warranty_provision: string;
  technical_score: number;    // Scored by committee
  price_score: number;         // Scored by committee
  overall_rank: number;
}

interface CbaScoreCalculation {
  vendor_id: string;
  vendor_name: string;
  technical_score: number;
  price_score: number;
  combined_score: number;
  rank: number;
  recommended: boolean;  // KEY: Determines award
}
```

### 5.2 Evaluation Criteria Weights

**From CBA Report Generator:**
```typescript
interface EvaluationCriteria {
  technicalEvaluation: number;      // % weight (e.g., 70%)
  priceReasonableness: number;      // % weight (e.g., 30%)
  approvedModels: string[];
  priceResponsiveness: {
    firstMostResponsive: string;
    secondMostResponsive: string;
    thirdMostResponsive: string;
    noBid?: string;
  };
  technicalEligibility: Record<string, boolean>;
  financialEligibility: Record<string, boolean>;
  // ... more evaluation fields
}
```

---

## 6. PO Issuance Gate - Committee Approval Requirement

### 6.1 PO Workflow Status (from `/src/features/procurement/components/purchase-order/components/PurchaseOrderWorkflowStatus.tsx`)

**Purchase Order Workflow Steps:**
```typescript
const workflowSteps: WorkflowStep[] = [
  {
    id: "PENDING",
    title: "Review",
    description: "Initial review of purchase order",
  },
  {
    id: "REVIEWED",
    title: "Authorization",
    description: "Authorization by Director of Finance",
  },
  {
    id: "AUTHORIZED",
    title: "Approval",
    description: "Final approval by Director of Operations",
  },
];
```

**Key Status Progression:**
- `PENDING` → `REVIEWED` → `AUTHORIZED` → `APPROVED`

### 6.2 CBA as Prerequisite for PO

**From Purchase Order Type Definition (`/src/features/procurement/types/purchase-order.ts`):**

```typescript
interface IPurchaseOrderSingleData {
  // ...
  cba: null;  // NULL if no CBA exists
  status_level: string;
  // ... approval fields
}
```

**Current Implementation Gap:** 
While `cba` field exists in PO data structure, the **enforcement** of requiring all committee members to evaluate before PO issuance appears to be **backend-enforced** rather than frontend-enforced.

---

## 7. CBA Controller API Endpoints

### 7.1 Key Endpoints

**Location:** `/src/features/procurement/controllers/cbaController.ts`

```typescript
// Get all CBAs with status filtering
useGetAllCbas({ page, size, search, status })
// Endpoint: GET /procurements/cba/?status=PENDING|APPROVED|REJECTED

// Get single CBA with committee info
useGetSingleCba(id)
// Endpoint: GET /procurements/cba/{id}/

// Submit CBA (committee members submit)
useSubmitCba(id)
// Endpoint: POST /procurements/cba/{id}/submit/
// Payload: { submission_ids, remarks }

// Approve CBA (after all committee evaluations)
useApproveCba(id)
// Endpoint: POST /procurements/cba/{id}/approve/
// Payload: { status, remarks }

// CBA Analysis Submission
useCbaAnalysisSubmission()
// Endpoint: POST /procurements/cba-analysis-submission/
// Payload: { cba_id, solicitation_id, vendor_id, selected_items, recommendation_note }

// Get Analysis Results
useGetCbaAnalysisResults(cbaId)
// Endpoint: GET /procurements/cba-analysis-submission/?cba_id={id}
```

### 7.2 Signature Workflow Endpoints

**Location:** `/src/features/procurement/controllers/signatureWorkflowController.ts`

```typescript
// Get CBA signature workflow status
useCbaSignatureWorkflow(cbaId)
// Endpoint: GET /procurements/cba-signature-workflow/{cbaId}/status/

// Get workflow status with pending signatures
useCbaWorkflowStatus(cbaId)
// Endpoint: GET /procurements/cba-signature-workflow/{cbaId}/workflow-status/

// Approve workflow step
useApproveCbaWorkflowStep(cbaId)
// Endpoint: POST /procurements/cba-signature-workflow/{cbaId}/approve-step/
// Payload: { step: 'prepared'|'committee'|'reviewed'|'authorized'|'approved', remarks, signature }

// Reject workflow step
useRejectCbaWorkflowStep(cbaId)
// Endpoint: POST /procurements/cba-signature-workflow/{cbaId}/reject-step/
// Payload: { step, rejection_reason }
```

---

## 8. Committee Evaluation UI Components

### 8.1 CBA Detail Page

**Location:** `/src/features/procurement/components/competitive-bid-analysis/[id]/index.tsx`

**Committee Members Display:**
- Shows list of assigned committee members (if present)
- Displays in footer section when rendering approval workflow
- Each member has signature block with status tracking

### 8.2 CBA Report Generator

**Location:** `/src/features/procurement/components/competitive-bid-analysis/CbaReportGenerator.tsx`

**Approval Workflow Rendering:**
```typescript
interface ApprovalWorkflow {
  preparedBy: SignatureBlock;
  procurementCommittee: SignatureBlock[];  // Renders each member
  reviewedBy: SignatureBlock;
  authorizedBy: SignatureBlock;
  approvedBy: SignatureBlock;
}

// Renders committee members section when array has items
{workflow.procurementCommittee && workflow.procurementCommittee.length > 0 && (
  <div>
    <h3 className="font-semibold mb-4">Procurement Committee</h3>
    <div className="grid grid-cols-2 gap-4">
      {workflow.procurementCommittee.map((member, index) => (
        <SignatureBlockComponent 
          key={index} 
          title={member.title} 
          signature={member} 
        />
      ))}
    </div>
  </div>
)}
```

---

## 9. Analysis Results and Winner Selection

### 9.1 Analysis Results Component

**Location:** `/src/features/procurement/components/competitive-bid-analysis/[id]/AnalysisResults.tsx`

**Tracks Committee Evaluation Completion:**
- Shows analysis status
- Displays selected vendor and items
- Renders recommendation note
- Generates PDF report of analysis

### 9.2 Analysis Results View

**Location:** `/src/features/procurement/components/competitive-bid-analysis/[id]/AnalysisResultsView.tsx`

**Extracts from CBA Data:**
```typescript
const analysisData = cbaData?.data;

// Committee selections stored in:
- analysisData?.selected_bid_submission  // Winning vendor
- analysisData?.selected_items          // Approved items
- analysisData?.recommendation_note     // Committee justification
- analysisData?.selected_total          // Total value
```

---

## 10. Workflow State Transitions

### 10.1 Committee Member Evaluation Gate

```
Create CBA with Committee Members
  ↓
Assign Vendors for Analysis
  ↓
[COMMITTEE EVALUATION PHASE]
  ├─ Committee Member 1: Evaluate & Score Vendors
  ├─ Committee Member 2: Evaluate & Score Vendors
  ├─ Committee Member N: Evaluate & Score Vendors
  ↓
[All Members Evaluated]
  ↓
Submit Combined Analysis Results
  ↓
[APPROVAL WORKFLOW PHASE]
  ├─ Step 1: Reviewer approves analysis
  ├─ Step 2: Authorizer approves
  ├─ Step 3: Final Approver approves
  ↓
CBA Status: APPROVED
  ↓
[PO CREATION GATE]
  └─ Purchase Order can now be created
```

---

## 11. Data Model - Committee Evaluation Fields

### 11.1 Evaluation Criteria

**Technical Evaluation (per vendor):**
- Technical eligibility: boolean
- Technical score: number
- Approved models: array

**Financial Evaluation (per vendor):**
- Financial eligibility: boolean
- Price score: number
- Price responsiveness: ranking

**Vendor Requirements (per vendor):**
- Delivery leadtime: string
- Payment terms: string
- Tax identification: string
- Validity period: string
- Bank account verified: boolean
- Vendor experience verified: boolean
- Currency: string
- Warranty provision: string

### 11.2 Award Recommendation

```typescript
interface AwardRecommendation {
  vendor_id: string;
  vendor_name: string;
  technical_score: number;
  price_score: number;
  combined_score: number;
  rank: number;
  recommended: boolean;
}
```

---

## 12. Current Implementation Status

### ✅ Implemented Features:

1. **Committee Member Assignment** - CBA creation with committee_members array
2. **Committee Signature Tracking** - Multiple SignatureBlock objects per committee
3. **Scoring System** - Technical and price scoring per vendor
4. **Analysis Submission** - Store committee evaluation results
5. **Approval Workflow** - Three-step signature workflow
6. **Status Tracking** - Pending/signed/rejected status per member
7. **Report Generation** - CBA report with committee signatures
8. **Analysis Results** - Store and retrieve committee selections

### ⚠️ Potential Gaps or Questions:

1. **PO Creation Validation:**
   - Is there backend validation that **prevents PO creation** if CBA status != 'APPROVED'?
   - Is there validation that **all committee members have evaluated** before approval?
   
2. **Member Evaluation Submission:**
   - How do individual committee members submit their evaluations?
   - Is there a member-specific evaluation form?
   - Current code shows evaluation stored in CBA but no per-member granularity visible in UI

3. **Evaluation Completion Tracking:**
   - UI shows `pending_signatures` array but committee uses this?
   - Need confirmation on how backend tracks "all members evaluated"

4. **Multi-Member Vote/Consensus:**
   - How are conflicting evaluations resolved?
   - Is there consensus logic or majority vote?
   - Or does final approver make decision after seeing all scores?

---

## 13. Files Summary

### Core CBA Types:
- `/src/features/procurement/types/cba.ts` - All CBA data structures

### Controllers:
- `/src/features/procurement/controllers/cbaController.ts` - CBA API hooks
- `/src/features/procurement/controllers/signatureWorkflowController.ts` - Signature workflow API

### Components:
- `/src/features/procurement/components/competitive-bid-analysis/[id]/index.tsx` - CBA detail page
- `/src/features/procurement/components/competitive-bid-analysis/[id]/VendorBidAnalysis.tsx` - Committee evaluation form
- `/src/features/procurement/components/competitive-bid-analysis/[id]/AnalysisResults.tsx` - Results display
- `/src/features/procurement/components/competitive-bid-analysis/[id]/AnalysisResultsView.tsx` - Results view
- `/src/features/procurement/components/competitive-bid-analysis/CbaReportGenerator.tsx` - Report with signatures
- `/src/features/procurement/components/purchase-order/components/PurchaseOrderWorkflowStatus.tsx` - PO workflow

### Validators:
- `/src/features/procurement/types/procurement-validator.ts` - CBA schema definitions

---

## 14. Key Findings Summary

1. **CBA Type Distinguishes Workflows:** 
   - `COMMITTEE` type triggers multi-member evaluation
   - `NON COMMITTEE` type is single-assignee workflow

2. **Committee Members Tracked:**
   - Array of `CommitteeMemberData` objects
   - Each member has signature block with status

3. **Three-Step Approval Gate:**
   - Reviewed → Authorized → Approved
   - All steps required before PO issuance

4. **Scoring System Implemented:**
   - Technical scores (70% weight typical)
   - Price scores (30% weight typical)
   - Combined scoring for vendor ranking

5. **Analysis Results Stored:**
   - Selected vendor ID
   - Selected items
   - Recommendation note
   - Total value

6. **Status Progression:**
   - PENDING (awaiting evaluation)
   - APPROVED (ready for PO)
   - REJECTED (send back for redo)
   - COMPLETED (final state)

---

## Recommendations for Implementation Verification

1. **Test committee member evaluation submission** - Verify how members individually submit scores
2. **Test all-members-evaluated gate** - Confirm PO cannot be created until all evaluate
3. **Test scoring logic** - Verify technical + price scoring works correctly
4. **Test approval workflow** - Confirm 3-step gate blocks PO at each stage
5. **Test rejection handling** - Confirm rejected CBA returns to committee for revision
6. **Test role-based access** - Verify only assigned committee members can evaluate

