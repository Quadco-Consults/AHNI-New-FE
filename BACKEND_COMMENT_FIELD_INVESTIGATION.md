# Backend Comment Field Investigation

## 🐛 Problem
Frontend keeps getting error: **`"comment: This field may not be blank."`** even when we omit the comment field from the request payload.

## 📋 Current Situation

### Frontend Behavior
We're sending requests in two ways:

**Option 1: Omit field completely** (Currently implemented)
```typescript
// When no comment provided:
const payload = {}; // No comment key at all
await callApi(payload);

// When comment provided:
const payload = { comment: "Some comment text" };
await callApi(payload);
```

**Option 2: Send empty string** (Tried, failed)
```typescript
const payload = { comment: "" }; // Backend rejects this
```

**Option 3: Send null** (Not tried)
```typescript
const payload = { comment: null }; // Need to test
```

### Backend Error Response
```json
{
  "status": false,
  "error_code": "blank",
  "message": "comment: This field may not be blank.",
  "data": null
}
```

## 🔍 What We Need from Backend

### 1. Check Serializer Definition

Please check the serializer for approval endpoints (`submit/`, `review/`, `complete_review/`, `authorize/`, `approve/`).

**Question:** What is the `comment` field defined as?

**Scenario A - Field is required but can be blank:**
```python
class ApprovalSerializer(serializers.Serializer):
    comment = serializers.CharField(required=False, allow_blank=True)
    # ✅ This allows: {} or {"comment": ""} or {"comment": "text"}
```

**Scenario B - Field is required and cannot be blank:**
```python
class ApprovalSerializer(serializers.Serializer):
    comment = serializers.CharField(required=False, allow_blank=False)
    # ❌ This rejects: {"comment": ""} but should accept: {}
    # 🐛 BUG: If you're using this, it might require the field when present
```

**Scenario C - Field is optional:**
```python
class ApprovalSerializer(serializers.Serializer):
    comment = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    # ✅ This allows: {} or {"comment": ""} or {"comment": null} or {"comment": "text"}
```

**Scenario D - Field is completely optional (default):**
```python
class ApprovalSerializer(serializers.Serializer):
    # comment field not in serializer at all
    # Uses request.data.get('comment', None) in view
    # ✅ This allows any payload
```

### 2. Check View/Endpoint Code

For each approval endpoint, please check:

```python
@action(detail=True, methods=['post'])
def submit(self, request, pk=None):
    contract_request = self.get_object()

    # How is comment extracted?
    # Option A: From serializer (uses serializer validation)
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    comment = serializer.validated_data.get('comment', None)

    # Option B: Direct from request.data (bypasses serializer)
    comment = request.data.get('comment', None)

    # Option C: Required from serializer
    comment = serializer.validated_data['comment']  # Will fail if not present
```

### 3. Specific Endpoints to Check

Please verify these endpoints:
- `POST /contract-grants/contract-requests/{id}/submit/`
- `POST /contract-grants/contract-requests/{id}/review/`
- `POST /contract-grants/contract-requests/{id}/complete_review/`
- `POST /contract-grants/contract-requests/{id}/authorize/`
- `POST /contract-grants/contract-requests/{id}/approve/`
- `POST /contract-grants/contract-requests/{id}/reject/` (This one SHOULD require comment)

## 🎯 Recommended Backend Fix

### Best Practice for Optional Comments

**For non-reject actions (submit, review, complete_review, authorize, approve):**

```python
class ApprovalActionSerializer(serializers.Serializer):
    comment = serializers.CharField(
        required=False,        # Field is optional
        allow_blank=True,      # Empty string is allowed
        allow_null=True,       # Null is allowed
        max_length=1000        # Set reasonable limit
    )
```

**For reject action (comment should be required):**

```python
class RejectActionSerializer(serializers.Serializer):
    comment = serializers.CharField(
        required=True,         # Field is required
        allow_blank=False,     # Empty string NOT allowed
        max_length=1000
    )
```

### View Implementation

```python
@action(detail=True, methods=['post'])
def authorize(self, request, pk=None):
    contract_request = self.get_object()

    # Option 1: Use serializer (recommended)
    serializer = ApprovalActionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    comment = serializer.validated_data.get('comment', None)

    # Option 2: Direct extraction (simpler, less validation)
    comment = request.data.get('comment', None)
    if comment == '':  # Convert empty string to None
        comment = None

    # Perform authorization
    contract_request.authorize(user=request.user, comment=comment)

    return Response({
        'status': True,
        'message': 'Request authorized successfully',
        'data': ContractRequestSerializer(contract_request).data
    })
```

## 🧪 Test Cases for Backend

Please test these payloads for **non-reject endpoints**:

### Test 1: No comment field
```bash
curl -X POST /api/v1/contract-grants/contract-requests/{id}/authorize/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'
```
**Expected:** ✅ Success (comment saved as null/empty)

### Test 2: Empty string comment
```bash
curl -X POST /api/v1/contract-grants/contract-requests/{id}/authorize/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"comment": ""}'
```
**Expected:** ✅ Success (comment saved as null/empty)

### Test 3: Null comment
```bash
curl -X POST /api/v1/contract-grants/contract-requests/{id}/authorize/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"comment": null}'
```
**Expected:** ✅ Success (comment saved as null)

### Test 4: Valid comment
```bash
curl -X POST /api/v1/contract-grants/contract-requests/{id}/authorize/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Approved for budget allocation"}'
```
**Expected:** ✅ Success (comment saved)

### Test 5: Reject WITHOUT comment
```bash
curl -X POST /api/v1/contract-grants/contract-requests/{id}/reject/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'
```
**Expected:** ❌ Error "comment: This field is required."

### Test 6: Reject WITH comment
```bash
curl -X POST /api/v1/contract-grants/contract-requests/{id}/reject/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Budget not available"}'
```
**Expected:** ✅ Success

## 🔧 Frontend Current Implementation

We've already implemented the frontend to handle this correctly:

```typescript
// contractController.ts
export const useAuthorizeContractRequest = (id: string) => {
  const authorizeContractRequest = async (comment?: string) => {
    try {
      // Only include comment if it has content
      const payload = comment?.trim() ? { comment: comment.trim() } : {};
      await callApi(payload as { comment?: string });
    } catch (error) {
      console.error("Contract request authorize error:", error);
      throw error;
    }
  };

  return { authorizeContractRequest, data, isLoading, isSuccess, error };
};
```

**This sends:**
- `{}` when no comment (field omitted)
- `{"comment": "text"}` when comment provided

## ❓ Questions for Backend Developer

1. **What is the exact serializer definition for the `comment` field in approval endpoints?**
   - Copy-paste the serializer class code

2. **Are you using `allow_blank=False` on the comment field?**
   - If yes, this is causing the issue when we send empty object `{}`

3. **Why is the error happening even when we omit the field?**
   - Is there custom validation?
   - Is there a `validate_comment()` method?

4. **Can you change the serializer to:**
   ```python
   comment = serializers.CharField(required=False, allow_blank=True, allow_null=True)
   ```

5. **Or should we send `{"comment": null}` instead of `{}`?**

## 🎯 Proposed Solution

### Backend Change (Recommended)
Update serializer to allow optional blank comments:

```python
class ApprovalActionSerializer(serializers.Serializer):
    comment = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        max_length=1000
    )

    def validate_comment(self, value):
        """Convert empty strings to None for consistency"""
        if value == '':
            return None
        return value
```

### Frontend Adaptation (If backend can't change)
If backend requires `{"comment": null}` instead of `{}`:

```typescript
// Change from:
const payload = comment?.trim() ? { comment: comment.trim() } : {};

// To:
const payload = { comment: comment?.trim() || null };
```

## 📝 Next Steps

1. Backend developer shares the serializer code
2. Backend developer tests the 6 test cases above
3. We decide on one of:
   - **Option A:** Backend fixes serializer (recommended)
   - **Option B:** Frontend sends `null` instead of omitting field
   - **Option C:** Frontend always sends empty string and backend allows it

---

**Created:** 2025-10-05
**Issue:** Frontend getting "comment: This field may not be blank" error
**Status:** ⏳ Awaiting backend investigation
