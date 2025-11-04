# Backend API Requirements for Fund Request Unique Identifier

## New API Endpoint Required

### Endpoint: `POST /api/v1/programs/fund-requests/next-sequence/`

**Purpose**: Get the next sequence number for fund request unique identifier generation

**Request Body**:
```json
{
  "project_id": "ACE1-1001000",
  "location_code": "ASO",
  "year": 2025,
  "month": 11
}
```

**Response**:
```json
{
  "status": true,
  "message": "Next sequence number retrieved successfully",
  "data": {
    "next_sequence": 2
  }
}
```

**Logic**:
1. Query existing fund requests for the given combination of:
   - project_id
   - location_code
   - year
   - month
2. Count the number of existing requests
3. Return count + 1 as the next sequence number

**Example SQL Query** (adjust for your ORM):
```sql
SELECT COUNT(*) + 1 as next_sequence
FROM fund_requests
WHERE project_id = 'ACE1-1001000'
  AND location_code = 'ASO'
  AND YEAR(created_date) = 2025
  AND MONTH(created_date) = 11;
```

## Fund Request Unique Identifier Format

The new format is: `{PROJECT_ID}-{LOCATION_CODE}-{YEAR}-{MONTH}-{SEQUENCE}`

**Examples**:
- First request: `ACE1-1001000-ASO-25-11-01`
- Second request: `ACE1-1001000-ASO-25-11-02`
- Third request: `ACE1-1001000-ASO-25-11-03`

**Year Format**: Last 2 digits (2025 → 25)
**Month Format**: 2 digits with leading zero (November → 11, January → 01)
**Sequence Format**: 2 digits with leading zero (1 → 01, 15 → 15)

## Database Changes Required

If not already present, ensure the fund_requests table has:
- `uuid_code` field to store the unique identifier
- Proper indexing on project_id, location_code, and date fields for performance

## Implementation Notes

1. The frontend currently falls back to sequence number `01` if the API call fails
2. Authentication header may be required (Bearer token)
3. Consider caching or optimizing this endpoint as it may be called frequently during form filling
4. Ensure thread safety if multiple users create requests simultaneously for the same project/location/month combination

## Testing

Test cases to verify:
1. First request for a project/location/month returns sequence 01
2. Subsequent requests increment the sequence correctly
3. Different months reset the sequence to 01
4. Different locations have independent sequences
5. Handle edge cases like missing data gracefully