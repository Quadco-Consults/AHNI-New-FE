# Backend API Requirement: Vendor Field for SINGLE SOURCE / CLOSED SOURCE RFQs

## Issue Summary

When creating a SINGLE SOURCE or CLOSED SOURCE RFQ (Request For Quotation), the `vendor` field is being sent from the frontend but is **NOT being saved or returned** by the backend API.

## Evidence

### Frontend is Working Correctly

The frontend application is correctly:
1. ✅ Capturing the vendor selection in the RFQ creation form
2. ✅ Including the `vendor` field in the API POST request
3. ✅ Sending the vendor UUID to the backend

**Proof from Console Logs:**
```javascript
// Frontend sends this data to the API
{
  title: 'Another test',
  rfq_id: 'RFQ 00099',
  background: 'kjdbdksjbdkjdbjk',
  request_type: 'REQUEST FOR QUOTATION',
  tender_type: 'SINGLE SOURCE',
  job_category: 'SERVICES',
  vendor: '1efdf0d4-0611-4a8a-8a3e-67b9230cbed5',  // ✅ Vendor ID is included
  purchase_request: null,
  eoi_tender: '',
  categories: [],
  documents: [],
  solicitation_items: [...],
  solicitation_evaluations: []
}
```

### Backend is NOT Returning the Vendor Field

The backend API response **does NOT include** the `vendor` field:

```javascript
// Backend returns this (vendor field is missing)
{
  id: '7e99153c-da7e-490c-859e-828d1748b14e',
  rfq_id: 'RFQ 00099',
  purchase_request: null,
  eoi_tender: null,
  title: 'Another test',
  specification_document_detail: null,
  specification_document: null,
  background: 'kjdbdksjbdkjdbjk',
  status: 'OPEN',
  opening_date: null,
  closing_date: null,
  tender_type: 'SINGLE SOURCE',
  rfq_type: 'PROCUREMENT',
  request_type: 'REQUEST FOR QUOTATION',
  procurement_type: null,
  solicitation_items: [...],
  solicitation_evaluations: []
  // ❌ vendor field is MISSING!
}
```

**Fields returned (17 total):**
`['id', 'rfq_id', 'purchase_request', 'eoi_tender', 'title', 'specification_document_detail', 'specification_document', 'background', 'status', 'opening_date', 'closing_date', 'tender_type', 'rfq_type', 'request_type', 'procurement_type', 'solicitation_items', 'solicitation_evaluations']`

## Required Backend Changes

### 1. Database Schema
Ensure the `Solicitation` model has a `vendor` field:

```python
class Solicitation(models.Model):
    # ... existing fields ...
    tender_type = models.CharField(max_length=50)  # Existing
    vendor = models.ForeignKey(
        'Vendor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='solicitations',
        help_text='Required for SINGLE SOURCE and CLOSED SOURCE tender types'
    )
    # ... other fields ...
```

### 2. Serializer
Update the `SolicitationSerializer` to include the `vendor` field:

```python
class SolicitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solicitation
        fields = [
            'id', 'rfq_id', 'purchase_request', 'eoi_tender', 'title',
            'specification_document_detail', 'specification_document',
            'background', 'status', 'opening_date', 'closing_date',
            'tender_type', 'rfq_type', 'request_type', 'procurement_type',
            'vendor',  # ← ADD THIS FIELD
            'solicitation_items', 'solicitation_evaluations'
        ]
        read_only_fields = ['id']

    def validate(self, data):
        # Validate that vendor is provided for SINGLE SOURCE and CLOSED SOURCE
        tender_type = data.get('tender_type')
        vendor = data.get('vendor')

        if tender_type in ['SINGLE SOURCE', 'CLOSED SOURCE'] and not vendor:
            raise serializers.ValidationError({
                'vendor': 'Vendor is required for SINGLE SOURCE and CLOSED SOURCE tender types'
            })

        return data
```

### 3. API Endpoint
Ensure the POST `/api/v1/procurements/solicitations/` endpoint:
- Accepts the `vendor` field in the request body
- Saves the `vendor` to the database
- Returns the `vendor` in the response

### 4. GET Endpoint
Ensure the GET `/api/v1/procurements/solicitations/{id}` endpoint:
- Returns the `vendor` field in the response
- Optionally includes `vendor_detail` with vendor information

## Business Logic

### When Vendor Field Should Be Used:

1. **SINGLE SOURCE** - One specific vendor is selected
   - `vendor` field should be **required**
   - Manual bid submission should **pre-select** this vendor
   - Vendor dropdown should be **disabled** (read-only)

2. **CLOSED SOURCE** - Limited to invited vendors
   - `vendor` field can store the primary vendor
   - Manual bid submission should **pre-select** this vendor

3. **Other Tender Types** (OPENED SOURCE, LIMITED SOLICITATION, NATIONAL OPEN TENDER)
   - `vendor` field should be **optional** or `null`
   - Manual bid submission allows any vendor selection

## Impact

Without the `vendor` field being saved and returned:
- ❌ Manual bid submission page cannot pre-populate the vendor for SINGLE SOURCE RFQs
- ❌ Users must manually re-select the vendor when submitting bids
- ❌ Risk of selecting the wrong vendor for SINGLE SOURCE contracts
- ❌ Data inconsistency between RFQ creation and bid submission

## Testing

After implementing the backend changes, verify:

1. **Create a SINGLE SOURCE RFQ** with a vendor selected
2. **Check the API response** includes the `vendor` field
3. **Retrieve the RFQ** via GET endpoint and verify `vendor` is present
4. **Navigate to Manual Bid Submission** and verify vendor is pre-selected

## API Request/Response Examples

### POST Request (What Frontend Sends)
```http
POST /api/v1/procurements/solicitations/
Content-Type: application/json

{
  "title": "Test Single Source RFQ",
  "rfq_id": "RFQ-001",
  "background": "Testing vendor field",
  "request_type": "REQUEST FOR QUOTATION",
  "tender_type": "SINGLE SOURCE",
  "job_category": "SERVICES",
  "vendor": "1efdf0d4-0611-4a8a-8a3e-67b9230cbed5",
  "solicitation_items": [...],
  "solicitation_evaluations": [...]
}
```

### POST Response (What Backend Should Return)
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": "success",
  "message": "Created successfully.",
  "data": {
    "id": "7e99153c-da7e-490c-859e-828d1748b14e",
    "rfq_id": "RFQ-001",
    "title": "Test Single Source RFQ",
    "tender_type": "SINGLE SOURCE",
    "vendor": "1efdf0d4-0611-4a8a-8a3e-67b9230cbed5",  // ← MUST BE INCLUDED
    // ... other fields ...
  }
}
```

### GET Response (Retrieve Solicitation)
```http
GET /api/v1/procurements/solicitations/7e99153c-da7e-490c-859e-828d1748b14e
Content-Type: application/json

{
  "status": "success",
  "message": "Retrieved successfully.",
  "data": {
    "id": "7e99153c-da7e-490c-859e-828d1748b14e",
    "rfq_id": "RFQ-001",
    "title": "Test Single Source RFQ",
    "tender_type": "SINGLE SOURCE",
    "vendor": "1efdf0d4-0611-4a8a-8a3e-67b9230cbed5",  // ← MUST BE INCLUDED
    "vendor_detail": {  // ← OPTIONAL: Include vendor details
      "id": "1efdf0d4-0611-4a8a-8a3e-67b9230cbed5",
      "company_name": "ABC Vendor Ltd",
      "email": "vendor@example.com"
    },
    // ... other fields ...
  }
}
```

## Priority

**HIGH** - This is blocking the proper workflow for SINGLE SOURCE and CLOSED SOURCE RFQs.

## Contact

Frontend Team: Muhammad Ilu
Date Reported: 2025-10-10
Environment: Production/Development
