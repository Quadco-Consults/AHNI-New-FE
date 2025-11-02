# CBA Committee Evaluation Workflow - Quick Reference Guide

## Critical File Locations

### Types & Data Structures
```
/src/features/procurement/types/cba.ts
├─ CommitteeMemberData
├─ CbaResultsData (cba_type: 'COMMITTEE' | 'NON COMMITTEE')
├─ ApprovalWorkflow (procurementCommittee: SignatureBlock[])
├─ SignatureWorkflowStatus (pending_signatures, completed_signatures)
└─ VendorEvaluation (technical_score, price_score, overall_rank)
```

### API Controllers
```
/src/features/procurement/controllers/cbaController.ts
├─ useGetSingleCba(id) → CbaResultsData with committee_members
├─ useSubmitCba(id) → Submit analysis results
├─ useApproveCba(id) → Approval after evaluation
├─ useCbaAnalysisSubmission() → Store evaluation results
└─ useGetCbaAnalysisResults(cbaId) → Retrieve results

/src/features/procurement/controllers/signatureWorkflowController.ts
├─ useCbaWorkflowStatus(cbaId) → pending_signatures array
├─ useApproveCbaWorkflowStep(cbaId, {step: 'committee'|'reviewed'|...})
└─ useRejectCbaWorkflowStep(cbaId, rejection_reason)
```

### UI Components
```
/src/features/procurement/components/competitive-bid-analysis/
├─ [id]/index.tsx → CBA detail page (3-step approval)
├─ [id]/VendorBidAnalysis.tsx → Committee evaluation form
├─ [id]/AnalysisResults.tsx → Results summary
├─ [id]/AnalysisResultsView.tsx → Results detailed view
└─ CbaReportGenerator.tsx → Report with committee signatures
```

### Validators
```
/src/features/procurement/types/procurement-validator.ts
├─ CbaSchema → cba_type, committee_members[], solicitation
├─ CbaApprovalSchema → status, remarks
└─ CbaAnalysisSubmissionSchema → vendor selection, items, notes
```

---

## Status Progression Flowchart

```
CREATE CBA (with committee_members array)
    ↓
    Status: PENDING
    ↓
[EVALUATION PHASE - Committee Members Analyze Vendors]
    ├─ Member 1: Evaluate (qualityScores, approvedModels, etc)
    ├─ Member 2: Evaluate
    └─ Member N: Evaluate
    ↓
[ALL MEMBERS EVALUATED]
    ↓
SUBMIT ANALYSIS RESULTS
    - selected_bid_submission (winning vendor)
    - selected_items (approved items)
    - recommendation_note (justification)
    ↓
    Status: Still PENDING
    ↓
[3-STEP APPROVAL WORKFLOW]
    │
    ├─ Step 1: Reviewer Approves
    │   → approveWorkflowStep({step: 'reviewed'})
    │   → Status: REVIEWED
    │
    ├─ Step 2: Authorizer Approves
    │   → approveWorkflowStep({step: 'authorized'})
    │   → Status: AUTHORIZED
    │
    └─ Step 3: Final Approver Approves
        → approveWorkflowStep({step: 'approved'})
        → Status: APPROVED
        ↓
[PO CREATION NOW ALLOWED]
```

---

## Committee Member Data Flow

### 1. Assignment (CBA Creation)
```typescript
// Input: Array of committee member UUIDs
{
  cba_type: 'COMMITTEE',
  committee_members: ['uuid-1', 'uuid-2', 'uuid-3'],
  solicitation: 'uuid-solicitation'
}

// Stored as:
CbaResultsData {
  committee_members: [
    { id: 'uuid-1', first_name: 'John', last_name: 'Doe', designation: 'Chairman' },
    { id: 'uuid-2', first_name: 'Jane', last_name: 'Smith', designation: 'Member' },
    { id: 'uuid-3', first_name: 'Bob', last_name: 'Johnson', designation: 'Member' }
  ]
}
```

### 2. Evaluation Submission
```typescript
// Each member evaluates vendors and committee submits results:
{
  cba_id: 'uuid-cba',
  solicitation_id: 'uuid-solicitation',
  vendor_id: 'uuid-winning-vendor',
  selected_items: ['item-uuid-1', 'item-uuid-2'],
  recommendation_note: 'Vendor selected based on technical...'
}

// Stored in CbaResultsData as:
{
  selected_bid_submission: 'uuid-winning-vendor',
  selected_items: ['item-uuid-1', 'item-uuid-2'],
  recommendation_note: '...',
  selected_total: 150000.00
}
```

### 3. Signature Tracking
```typescript
// ApprovalWorkflow stores individual member signatures:
{
  procurementCommittee: [
    {
      title: 'Chairman',
      name: 'John Doe',
      status: 'signed',  // or 'pending' | 'rejected'
      signed_at: '2024-11-02T10:30:00',
      signature: '...',
      remarks: '...'
    },
    // ... more members
  ]
}
```

---

## API Endpoints Called in Sequence

### Committee Evaluation Flow:
```
1. GET /procurements/cba/{id}/
   → Load CBA with committee_members array

2. GET /procurements/cba-signature-workflow/{id}/status/
   → Check current approval step

3. POST /procurements/cba-analysis-submission/
   → Submit evaluation results (vendor selection, items)

4. GET /procurements/cba-analysis-submission/?cba_id={id}
   → Retrieve evaluation results

5. POST /procurements/cba-signature-workflow/{id}/approve-step/
   → Approve each step (reviewed, authorized, approved)
```

### PO Creation Prerequisite:
```
Before creating PO:
GET /procurements/cba/{id}/
  → Check: status === 'APPROVED'
  → Check: selected_bid_submission !== null
  → Check: selected_items.length > 0
```

---

## Key Validation Rules

### CBA Creation:
```
✅ cba_type must be 'COMMITTEE' or 'NON COMMITTEE'
✅ committee_members array required if cba_type='COMMITTEE'
✅ Each committee member UUID must be valid
✅ solicitation UUID required
```

### Analysis Submission:
```
✅ At least 1 item must be selected
✅ Vendor ID must be valid
✅ CBA must be in PENDING status
✅ Recommendation note optional
```

### Approval Workflow:
```
✅ Step sequence: reviewed → authorized → approved
✅ Cannot skip steps
✅ Must have remarks for approval
✅ Rejection requires rejection_reason
```

---

## Member Evaluation Form Fields

**Location:** `VendorBidAnalysis.tsx`

### Per-Vendor Evaluation:
- `qualityScores[vendorId]` - Quality assessment
- `approvedModels[vendorId]` - Brand/model approval
- `priceResponsiveness[vendorId]` - Price ranking
- `technicalEligibility[vendorId]` - Tech pass/fail
- `bankAccountEvaluation[vendorId]` - Bank verification
- `experienceEvaluation[vendorId]` - Vendor experience

### Overall Recommendation:
- `awardRecommendation` - Text justification for winning vendor selection

---

## UI Components - Committee Display

### CBA Detail Page (`[id]/index.tsx`):
- Shows 3-step progress indicator
- Displays current approval step
- Shows button to "Submit {Role} Approval"
- Links to bid analysis and results

### Report Generator (`CbaReportGenerator.tsx`):
- Renders committee members section with signatures
- Shows each member's status (pending/signed/rejected)
- Displays signature date and remarks
- Grid layout (2 columns for member cards)

### Analysis Results View (`AnalysisResultsView.tsx`):
- Shows selected vendor details
- Lists approved items
- Displays recommendation note
- Download PDF option
- Approval status indicator

---

## Common Issues & Solutions

### Issue: PO Cannot Be Created
```
Causes:
1. CBA status is not 'APPROVED' → Run 3-step approval workflow
2. No vendor selected → Run vendor analysis
3. No items selected → Committee must select items
4. Backend validation failed → Check CBA analysis submission payload
```

### Issue: Committee Member Cannot Evaluate
```
Causes:
1. Not assigned to this CBA → Add to committee_members array
2. CBA already completed → Create new CBA
3. Missing evaluation permissions → Check role-based access
4. Browser cache → Clear and refresh
```

### Issue: Approval Step Stuck
```
Solutions:
1. Check current_step in workflow status
2. Ensure all previous steps completed
3. Try refreshing page (invalidate queries)
4. Check backend logs for validation errors
5. Verify user has required role for step
```

---

## Testing Checklist

- [ ] Create CBA with multiple committee members
- [ ] Each member evaluates vendors independently
- [ ] Committee submits combined analysis results
- [ ] Vendor scores calculated correctly (technical + price)
- [ ] Winner determined by highest combined score
- [ ] 3-step approval workflow executes in order
- [ ] Cannot skip approval steps
- [ ] Cannot approve with missing remarks
- [ ] Can reject at any step with rejection reason
- [ ] PO cannot be created until CBA approved
- [ ] PO can be created after CBA approved
- [ ] Report generates with all committee signatures
- [ ] PDF download includes evaluation details

---

## Database Queries for Debugging

### Find CBAs with committee:
```
GET /procurements/cba/?status=PENDING
Filter by: cba_type='COMMITTEE'
Check: committee_members.length > 0
```

### Check evaluation progress:
```
GET /procurements/cba/{id}/
- Check: status field
- Check: selected_bid_submission (null = not evaluated)
- Check: committee_members array

GET /procurements/cba-signature-workflow/{id}/workflow-status/
- Check: pending_signatures array (who hasn't signed)
- Check: completed_signatures array (who has signed)
```

### Find POs waiting for CBA approval:
```
GET /procurements/purchase-order/?status=PENDING
Check each PO:
  - solicitation_detail exists?
  - Corresponding CBA status === 'APPROVED'?
```

---

## Performance Notes

### Cache Invalidation After Actions:
```typescript
// After CBA approval:
queryClient.invalidateQueries({ queryKey: ["cba", id] });
queryClient.invalidateQueries({ queryKey: ["cbas"] });
queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", id] });
queryClient.invalidateQueries({ queryKey: ["cba-signature-workflow", id] });

// After analysis submission:
queryClient.invalidateQueries({ queryKey: ["cba-analysis-results", cbaId] });
```

### Lazy Loading:
- CBA detail page loads: CBA data, workflow status, vendor submissions
- Analysis results only loaded when tab clicked
- Report generation on demand (not cached)

