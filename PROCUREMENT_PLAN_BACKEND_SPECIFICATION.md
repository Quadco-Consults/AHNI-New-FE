# Procurement Plan Backend API Specification

## Problem Statement

**Current Issue:**
The procurement plan upload endpoint (`/procurements/procurement-plans/upload/`) is creating a separate Procurement Plan record for each row in the uploaded Excel file. This is architecturally incorrect.

**Expected Behavior:**
A procurement plan is a comprehensive annual plan for a project. When an Excel file is uploaded:
- ONE Procurement Plan should be created (representing the entire plan)
- ALL rows in the Excel file should become Line Items within that single plan
- Each line item represents one procurement activity for the year

---

## Database Schema Requirements

### 1. Procurement Plan (Parent Entity)

**Table:** `procurement_plans`

```sql
CREATE TABLE procurement_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id),
    financial_year_id UUID NOT NULL REFERENCES financial_years(id),
    created_datetime TIMESTAMP DEFAULT NOW(),
    updated_datetime TIMESTAMP DEFAULT NOW(),
    created_by_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'draft',  -- draft, submitted, approved, rejected
    total_budget_ngn DECIMAL(15, 2),
    total_budget_usd DECIMAL(15, 2),
    notes TEXT,

    -- Ensure one plan per project per year
    UNIQUE(project_id, financial_year_id)
);
```

### 2. Procurement Plan Line Items (Child Entity)

**Table:** `procurement_plan_line_items`

```sql
CREATE TABLE procurement_plan_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procurement_plan_id UUID NOT NULL REFERENCES procurement_plans(id) ON DELETE CASCADE,

    -- Excel Column Mappings (all fields from your template)
    serial_number INTEGER,
    implementer VARCHAR(255),
    implementation_location VARCHAR(255),
    workplan_activity_reference VARCHAR(255),
    description TEXT,
    budget_ref_num VARCHAR(100),
    budget_line VARCHAR(100),
    approved_budget_amount_ngn DECIMAL(15, 2),
    approved_budget_amount_usd DECIMAL(15, 2),
    ppm BOOLEAN DEFAULT FALSE,
    non_ppm BOOLEAN DEFAULT FALSE,
    financial_year_targets INTEGER,
    total_quantity INTEGER,
    uom VARCHAR(50),
    responsible_pr_staff VARCHAR(255),
    mode_of_procurement VARCHAR(255),
    procurement_committee_review VARCHAR(100),
    solicitation_method VARCHAR(100),
    procurement_process VARCHAR(100),
    procurement_start_date DATE,
    procurement_method VARCHAR(100),
    evaluation_date DATE,
    rfq_start_date DATE,
    rfq_closing_date DATE,
    negotiation BOOLEAN,
    cba_report_date DATE,
    po_issue_date DATE,
    selected_supplier VARCHAR(255),
    expected_delivery_date DATE,
    delivery_to VARCHAR(255),
    delivery_leadtime VARCHAR(100),
    performance_score VARCHAR(100),
    performance_monitoring_remarks TEXT,
    unit_cost DECIMAL(15, 2),
    total_cost DECIMAL(15, 2),

    -- Additional procurement milestone fields
    bid_document_finalization_date DATE,
    advertisement_date DATE,
    bid_submission_deadline DATE,
    bid_opening_date DATE,
    technical_evaluation_date DATE,
    financial_evaluation_date DATE,
    negotiation_date DATE,
    contract_signing_date DATE,

    -- Categorization and specifications
    procurement_category VARCHAR(255),
    technical_specifications TEXT,
    evaluation_criteria TEXT,

    -- Budget allocation
    funding_source VARCHAR(255),
    budget_allocation_q1 DECIMAL(15, 2),
    budget_allocation_q2 DECIMAL(15, 2),
    budget_allocation_q3 DECIMAL(15, 2),
    budget_allocation_q4 DECIMAL(15, 2),

    -- Delivery and logistics
    delivery_location_details TEXT,
    delivery_terms VARCHAR(255),
    installation_required BOOLEAN,
    warranty_period VARCHAR(100),

    -- Risk and compliance
    risk_assessment TEXT,
    compliance_requirements TEXT,
    environmental_considerations TEXT,

    -- Monitoring and evaluation
    key_performance_indicators TEXT,
    monitoring_frequency VARCHAR(100),
    success_metrics TEXT,

    -- Supplier qualification
    pre_qualification_required BOOLEAN,
    market_survey_conducted BOOLEAN,
    supplier_database_available BOOLEAN,

    -- Status tracking
    current_status VARCHAR(100),
    completion_percentage DECIMAL(5, 2),

    -- Notes and comments
    internal_notes TEXT,
    stakeholder_comments TEXT,
    lessons_learned TEXT,

    created_datetime TIMESTAMP DEFAULT NOW(),
    updated_datetime TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_line_items_plan ON procurement_plan_line_items(procurement_plan_id);
```

---

## API Endpoints Specification

### 1. Upload Procurement Plan (Excel)

**Endpoint:** `POST /procurements/procurement-plans/upload/`

**Request:**
```http
POST /procurements/procurement-plans/upload/
Content-Type: multipart/form-data

{
  "file": <Excel File (.xlsx)>,
  "project": "uuid-of-project",
  "financial_year": "uuid-of-financial-year"
}
```

**Processing Logic:**

1. **Validate Request:**
   - Check if file is Excel (.xlsx, .xls)
   - Validate project exists
   - Validate financial_year exists
   - Check if plan already exists for project + financial_year combination

2. **Parse Excel File:**
   - Read all rows from the Excel file
   - Map Excel columns to database fields (use exact column names from template)
   - Validate each row has required fields
   - Collect validation errors

3. **Database Transaction:**
   ```python
   BEGIN TRANSACTION;

   # Step 1: Check if plan exists
   existing_plan = ProcurementPlan.objects.filter(
       project_id=project_id,
       financial_year_id=financial_year_id
   ).first()

   if existing_plan:
       # Update mode: Delete old line items
       ProcurementPlanLineItem.objects.filter(
           procurement_plan_id=existing_plan.id
       ).delete()
       plan = existing_plan
   else:
       # Create mode: Create new plan
       plan = ProcurementPlan.objects.create(
           project_id=project_id,
           financial_year_id=financial_year_id,
           created_by_id=request.user.id
       )

   # Step 2: Create all line items
   line_items = []
   for row_index, row_data in enumerate(excel_rows):
       line_item = ProcurementPlanLineItem(
           procurement_plan_id=plan.id,
           serial_number=row_index + 1,
           implementer=row_data.get('IMPLEMENTER (OWNER)'),
           implementation_location=row_data.get('Implementation Location'),
           description=row_data.get('Description Of Procurement Activities'),
           # ... map all other fields
       )
       line_items.append(line_item)

   # Bulk create for performance
   ProcurementPlanLineItem.objects.bulk_create(line_items)

   # Step 3: Update plan totals
   plan.total_budget_ngn = sum(item.approved_budget_amount_ngn or 0 for item in line_items)
   plan.total_budget_usd = sum(item.approved_budget_amount_usd or 0 for item in line_items)
   plan.save()

   COMMIT;
   ```

**Success Response (201):**
```json
{
  "message": "Procurement plan uploaded successfully",
  "data": {
    "id": "c746adf9-139c-4ad8-bedf-a16b76d985eb",
    "project": {
      "id": "project-uuid",
      "name": "Human Assurance Director",
      "code": "HAD-2024"
    },
    "financial_year": {
      "id": "year-uuid",
      "year": "2024/2025",
      "name": "FY 2024/2025"
    },
    "total_line_items": 150,
    "total_budget_ngn": "1360000000.00",
    "total_budget_usd": "1101545.00",
    "created_datetime": "2025-10-19T13:58:33.770554Z",
    "updated_datetime": "2025-10-19T13:58:33.770564Z",
    "status": "draft"
  }
}
```

**Error Response (400) - Validation Errors:**
```json
{
  "message": "Excel file has validation errors",
  "errors": [
    {
      "row": 5,
      "field": "procurement_process",
      "error": "This field is required",
      "value": null
    },
    {
      "row": 12,
      "field": "approved_budget_amount_ngn",
      "error": "Must be a valid number",
      "value": "invalid"
    }
  ],
  "summary": {
    "total_rows_processed": 150,
    "successful_rows": 148,
    "failed_rows": 2,
    "errors_found": 2
  }
}
```

**Error Response (409) - Duplicate:**
```json
{
  "message": "A procurement plan already exists for this project and financial year",
  "existing_plan_id": "existing-uuid",
  "suggestion": "Use PUT /procurements/procurement-plans/{id}/upload/ to update"
}
```

---

### 2. Get Single Procurement Plan with Line Items

**Endpoint:** `GET /procurements/procurement-plans/{id}/`

**Request:**
```http
GET /procurements/procurement-plans/c746adf9-139c-4ad8-bedf-a16b76d985eb/
```

**Response (200):**
```json
{
  "message": "Procurement plan retrieved successfully",
  "data": {
    "id": "c746adf9-139c-4ad8-bedf-a16b76d985eb",
    "project": {
      "id": "project-uuid",
      "name": "Human Assurance Director",
      "code": "HAD-2024",
      "budget": 5000000000
    },
    "financial_year": {
      "id": "year-uuid",
      "year": "2024/2025",
      "name": "FY 2024/2025"
    },
    "status": "draft",
    "total_budget_ngn": "1360000000.00",
    "total_budget_usd": "1101545.00",
    "created_datetime": "2025-10-19T13:58:33.770554Z",
    "updated_datetime": "2025-10-19T13:58:33.770564Z",
    "line_items": [
      {
        "id": "item-uuid-1",
        "serial_number": 1,
        "implementer": "PHO-Adamawa",
        "implementation_location": "Adamawa State",
        "workplan_activity_reference": "WP-2024-001",
        "description": "Prevention, Care & Treatment Medical Equipment",
        "budget_ref_num": "PROJECT 2.1.6",
        "approved_budget_amount_usd": "11015.45",
        "approved_budget_amount_ngn": "13600000.00",
        "ppm": true,
        "non_ppm": false,
        "total_quantity": 10000,
        "uom": "UNITS",
        "responsible_pr_staff": "Local Procurement Team",
        "mode_of_procurement": "International Competitive Bidding",
        "procurement_committee_review": "Yes - existing",
        "solicitation_method": "RFP",
        "procurement_process": "RFP",
        "procurement_start_date": "2024-10-01",
        "selected_supplier": "MedTech Solutions Ltd",
        "expected_delivery_date": "2025-01-09",
        "delivery_to": "PHO Adamawa",
        "unit_cost": "1360.00",
        "total_cost": "13600000.00"
        // ... all other fields
      },
      {
        "id": "item-uuid-2",
        // ... second line item
      }
      // ... up to 150+ line items
    ],
    "items_count": 150
  }
}
```

---

### 3. Get All Procurement Plans (List)

**Endpoint:** `GET /procurements/procurement-plans/`

**Query Parameters:**
- `page` (integer): Page number
- `size` (integer): Items per page
- `search` (string): Search in project name, description
- `financial_year` (uuid): Filter by financial year
- `project` (uuid): Filter by project
- `status` (string): Filter by status

**Request:**
```http
GET /procurements/procurement-plans/?page=1&size=20&financial_year=year-uuid
```

**Response (200):**
```json
{
  "count": 45,
  "next": "http://api.example.com/procurements/procurement-plans/?page=2",
  "previous": null,
  "number_of_pages": 3,
  "results": [
    {
      "id": "plan-uuid-1",
      "project": {
        "id": "project-uuid-1",
        "name": "Human Assurance Director",
        "code": "HAD-2024"
      },
      "financial_year": {
        "id": "year-uuid",
        "year": "2024/2025"
      },
      "status": "draft",
      "total_budget_ngn": "1360000000.00",
      "total_budget_usd": "1101545.00",
      "items_count": 150,
      "created_datetime": "2025-10-19T13:58:33.770554Z"
    },
    // ... more plans
  ]
}
```

---

### 4. Update Procurement Plan (Re-upload)

**Endpoint:** `PUT /procurements/procurement-plans/{id}/upload/`

**Request:**
```http
PUT /procurements/procurement-plans/{id}/upload/
Content-Type: multipart/form-data

{
  "file": <Excel File (.xlsx)>
}
```

**Processing Logic:**
1. Validate plan exists
2. Delete all existing line items for this plan
3. Parse new Excel file
4. Create new line items
5. Update plan totals

**Response:** Same as upload endpoint

---

### 5. Download Procurement Plan as Excel

**Endpoint:** `GET /procurements/procurement-plans/{id}/download/`

**Request:**
```http
GET /procurements/procurement-plans/c746adf9-139c-4ad8-bedf-a16b76d985eb/download/
```

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Downloads Excel file with all line items in the original template format

---

## Excel Column Mapping Reference

| Excel Column Header | Database Field | Data Type | Required |
|-------------------|----------------|-----------|----------|
| SN | serial_number | INTEGER | No (auto) |
| IMPLEMENTER (OWNER) | implementer | VARCHAR(255) | Yes |
| Implementation Location | implementation_location | VARCHAR(255) | Yes |
| Workplan Activity Reference | workplan_activity_reference | VARCHAR(255) | No |
| Description Of Procurement Activities | description | TEXT | Yes |
| BUDGET REFERENCE NUMBER | budget_ref_num | VARCHAR(100) | No |
| Budget Line | budget_line | VARCHAR(100) | No |
| APPROVED BUDGET AMOUNT (₦) | approved_budget_amount_ngn | DECIMAL | Yes |
| APPROVED BUDGET AMOUNT ($) | approved_budget_amount_usd | DECIMAL | Yes |
| PPM | ppm | BOOLEAN | No |
| NON-PPM | non_ppm | BOOLEAN | No |
| FY25 TARGETS | financial_year_targets | INTEGER | No |
| QUANTITY | total_quantity | INTEGER | No |
| UOM | uom | VARCHAR(50) | No |
| RESPONSIBLE PR STAFF | responsible_pr_staff | VARCHAR(255) | No |
| MODE OF PROCUREMENT | mode_of_procurement | VARCHAR(255) | Yes |
| PROCURMENT COMMITTEE REVIEW | procurement_committee_review | VARCHAR(100) | No |
| APPLICABLE SOLICITATION METHOD | solicitation_method | VARCHAR(100) | Yes |
| PROCUREMENT START DATE | procurement_start_date | DATE | Yes |
| PROCUREMENT METHOD | procurement_method | VARCHAR(100) | Yes |
| EVALUATION | evaluation_date | DATE | No |
| Start Date of RFQ | rfq_start_date | DATE | No |
| Closing Date of RFQ | rfq_closing_date | DATE | No |
| Negotiation (if Applicable) | negotiation | BOOLEAN | No |
| Date CBA and Report is Finalised | cba_report_date | DATE | No |
| Date Purchase Order/PC is issued | po_issue_date | DATE | No |
| SELECTED SUPPLIER | selected_supplier | VARCHAR(255) | No |
| EXPECTED DELIVERY DUE DATE | expected_delivery_date | DATE | No |
| DELIVERY TO | delivery_to | VARCHAR(255) | No |
| DELIVERY LEADTIME | delivery_leadtime | VARCHAR(100) | No |
| PROCUREMENT PERFORMANCE SCORE | performance_score | VARCHAR(100) | No |
| PROCUREMENT PERFORMANCE/MONITORING REMARKS | performance_monitoring_remarks | TEXT | No |

---

## Validation Rules

### 1. File Validation
- File must be Excel format (.xlsx or .xls)
- File size limit: 10MB
- Must contain at least 1 data row (excluding headers)
- Maximum 1000 rows per file

### 2. Required Fields (Per Row)
- `implementer`
- `implementation_location`
- `description`
- `approved_budget_amount_ngn` OR `approved_budget_amount_usd`
- `mode_of_procurement`
- `solicitation_method`
- `procurement_start_date`
- `procurement_method`

### 3. Data Type Validation
- **Dates**: Must be in format YYYY-MM-DD or DD/MM/YYYY
- **Decimals**: Must be valid numbers with up to 2 decimal places
- **Booleans**: Accept "Yes/No", "True/False", "1/0", or actual boolean

### 4. Business Rules
- If `ppm` is true, `non_ppm` must be false (and vice versa)
- `total_cost` should equal `unit_cost * total_quantity` (if both provided)
- `procurement_start_date` must be within the selected financial year
- `expected_delivery_date` should be after `procurement_start_date`

---

## Error Handling

### 1. Validation Errors
Return detailed errors with:
- Row number
- Field name
- Error message
- Invalid value

### 2. System Errors
```json
{
  "message": "Failed to process Excel file",
  "error": "Error details",
  "error_code": "EXCEL_PARSE_ERROR"
}
```

### 3. Transaction Rollback
If any error occurs during line item creation:
- Rollback the entire transaction
- Do not create partial data
- Return all errors to user

---

## Performance Considerations

1. **Bulk Operations:** Use `bulk_create()` for line items instead of individual inserts
2. **Indexing:** Create indexes on `procurement_plan_id` and search fields
3. **Pagination:** Always return line items with pagination support
4. **Async Processing:** For files with >500 rows, consider background job processing

---

## Frontend Impact

Once this backend structure is implemented, the frontend will:

1. **Upload Flow:**
   - Send file + project + financial_year
   - Receive ONE plan with all line items
   - Display success with item count

2. **View Flow:**
   - Fetch single plan with all line items
   - Display in Excel Data View tab (already implemented)
   - Show all rows and columns in table format

3. **List View:**
   - Show plans with item counts
   - Each row in the table = ONE complete procurement plan (not one line item)

---

## Migration Strategy

### For Existing Data

If there's already wrongly structured data:

```sql
-- Step 1: Identify plans from same project/year
SELECT project_id, financial_year_id, COUNT(*) as plan_count
FROM procurement_plans
GROUP BY project_id, financial_year_id
HAVING COUNT(*) > 1;

-- Step 2: For each group, merge into one plan
-- (Run migration script to consolidate)
```

---

## Testing Checklist

- [ ] Upload Excel with 1 row → Creates 1 plan with 1 line item
- [ ] Upload Excel with 100 rows → Creates 1 plan with 100 line items
- [ ] Upload same file twice → Updates existing plan (doesn't duplicate)
- [ ] Invalid row data → Returns validation errors, no plan created
- [ ] Download plan → Generates Excel with all line items
- [ ] Get plan by ID → Returns plan with all nested line items
- [ ] List plans → Shows item counts correctly
- [ ] Delete plan → Cascades to delete all line items

---

## Priority: CRITICAL

This affects the core functionality of the procurement module and must be fixed before production deployment.

**Estimated Backend Effort:** 3-5 days
**Database Migration Required:** Yes
**Breaking Change:** Yes (existing data structure will change)
