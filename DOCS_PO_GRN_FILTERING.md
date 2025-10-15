# Purchase Order Filtering for GRN Creation

## Problem Statement

When creating a Good Receive Note (GRN), users should only see Purchase Orders (POs) that:
1. Are **APPROVED** (ready for goods receipt)
2. Do **NOT** already have an existing GRN

This prevents accidental duplicate GRN creation for the same PO.

---

## Current Solution (Frontend Filtering)

### Implementation Location
`src/features/admin/components/good-receive-note/create/summary.tsx` (Lines 53-96)

### How It Works

1. **Fetch Approved POs**
   ```typescript
   const { data: purchaseOrder } = useGetAllPurchaseOrders({
     page: 1,
     size: 2000000,
     status: "APPROVED", // Only show approved POs
   });
   ```

2. **Fetch All Existing GRNs**
   ```typescript
   const { data: allGRNs } = useGetAllGoodReceiveNote({
     page: 1,
     size: 10000, // Fetch all GRNs
   });
   ```

3. **Cross-Reference and Filter**
   ```typescript
   const usedPOIds = new Set(
     allGRNs?.data?.results?.map((grn) => grn.purchase_order) || []
   );

   const availablePOs = purchaseOrder.results.filter((po) =>
     !usedPOIds.has(po.id)
   );
   ```

4. **Display with Vendor Info**
   ```typescript
   return availablePOs.map(({ purchase_order_number, id, vendor_detail }) => ({
     label: `${purchase_order_number} - ${vendor_detail?.company_name || 'Unknown Vendor'}`,
     value: id,
   }));
   ```

### Logging for Debugging

Console logs help track the filtering process:
- `🔍 Total POs`: Total approved POs fetched
- `🔍 Used PO IDs`: List of PO IDs that already have GRNs
- `⚠️ PO {number} already has a GRN - excluding`: Which POs are being filtered out
- `✅ Available POs for GRN`: Final count of available POs

---

## Limitations of Current Approach

1. **Performance Impact**
   - Fetches ALL POs and ALL GRNs on every page load
   - Two separate API calls required
   - Large datasets may cause slow load times

2. **Data Consistency**
   - Small window where concurrent users might see same PO
   - No server-side enforcement prevents duplicate GRNs

3. **Pagination Issues**
   - Using `size: 2000000` to bypass pagination
   - Not scalable for large datasets

---

## Recommended Backend Solution

### Option 1: Backend Filter Endpoint (Preferred)

Add a query parameter to the Purchase Order API:

```python
# Django Example
GET /api/v1/procurements/purchase-order/?available_for_grn=true

# Filter POs that:
# 1. status_level = 'APPROVED'
# 2. Do NOT have any related GoodReceiveNote objects
```

**Backend Implementation Example:**
```python
class PurchaseOrderViewSet(ModelViewSet):
    def get_queryset(self):
        queryset = PurchaseOrder.objects.all()

        # Filter for POs without GRNs
        if self.request.query_params.get('available_for_grn') == 'true':
            queryset = queryset.filter(
                status_level='APPROVED',
                good_receive_notes__isnull=True  # No GRN exists
            ).distinct()

        return queryset
```

**Frontend Usage:**
```typescript
const { data: purchaseOrder } = useGetAllPurchaseOrders({
  page: 1,
  size: 20,
  available_for_grn: true  // Backend handles filtering
});
```

### Option 2: Add `has_grn` Field to PO Response

Modify the Purchase Order serializer to include a computed field:

```python
class PurchaseOrderSerializer(serializers.ModelSerializer):
    has_grn = serializers.SerializerMethodField()

    def get_has_grn(self, obj):
        return obj.good_receive_notes.exists()

    class Meta:
        model = PurchaseOrder
        fields = ['id', 'purchase_order_number', 'has_grn', ...]
```

**Frontend Filtering:**
```typescript
const availablePOs = purchaseOrder.results.filter(po => !po.has_grn);
```

### Option 3: Backend Constraint (Data Integrity)

Add a database-level or application-level constraint:

```python
class GoodReceiveNote(models.Model):
    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name='good_receive_notes',
        unique=True  # Enforce one GRN per PO
    )
```

---

## Benefits of Backend Solution

1. **Performance**
   - Single API call
   - Efficient database queries with indexes
   - Proper pagination support

2. **Data Integrity**
   - Server-side validation prevents duplicate GRNs
   - Race condition protection
   - Centralized business logic

3. **Scalability**
   - Works efficiently with thousands of POs/GRNs
   - Reduced frontend bundle size
   - Better caching opportunities

4. **Maintainability**
   - Business rules enforced in one place
   - Easier to update filtering logic
   - Less complex frontend code

---

## Migration Path

### Phase 1: Keep Current Solution (✅ Complete)
- Frontend filtering works for immediate needs
- No backend changes required

### Phase 2: Add Backend Filter (Recommended)
1. Backend team implements `available_for_grn` filter
2. Frontend switches to new endpoint
3. Remove cross-reference logic from frontend

### Phase 3: Add Database Constraint (Optional)
1. Add unique constraint on `purchase_order` field in GRN model
2. Handle existing duplicates (if any)
3. Remove frontend/backend filtering (database enforces it)

---

## Testing Checklist

- [ ] Approved POs without GRNs appear in dropdown
- [ ] POs with existing GRNs do NOT appear in dropdown
- [ ] Pending/Draft POs do NOT appear (status filter)
- [ ] Warning message shows when no POs available
- [ ] Console logs show correct filtering counts
- [ ] Vendor name displays correctly in dropdown
- [ ] Creating GRN removes PO from future dropdown loads

---

## Related Files

- **Form Component**: `src/features/admin/components/good-receive-note/create/summary.tsx`
- **GRN Controller**: `src/features/admin/controllers/goodReceiveNoteController.ts`
- **PO Controller**: `src/features/procurement/controllers/purchaseOrderController.ts`
- **GRN Types**: `src/features/admin/types/inventory-management/good-receive-note.ts`
- **PO Types**: `src/features/procurement/types/purchase-order.ts`

---

## Contact

For backend implementation support, please coordinate with the Django/Python backend team to implement Option 1 (preferred) or Option 2.
