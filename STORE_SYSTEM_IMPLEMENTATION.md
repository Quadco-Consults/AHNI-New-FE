# Multi-Store System Implementation Guide

## Overview
This document tracks the implementation of a multi-store inventory management system for AHNI ERP, supporting a central warehouse at HQ and location-specific stores.

---

## ✅ Phase 1: Store Entity and Management (COMPLETED)

### Files Created:

#### 1. Type Definitions
- **File**: `src/features/admin/types/inventory-management/store.ts`
- **Content**: Store schema, types, and API response interfaces
- **Features**:
  - Zod validation schema for form validation
  - Store types: CENTRAL (HQ) and LOCATION (branches)
  - Parent-child store hierarchy support
  - Store keeper assignment
  - Active/inactive status management

#### 2. API Controller
- **File**: `src/features/admin/controllers/storeController.ts`
- **Endpoints**:
  - `useGetAllStores` - Paginated list with filters (location, type, status)
  - `useGetSingleStore` - Get store details with expanded relations
  - `useGetStoresByLocation` - Get stores for specific location
  - `useGetCentralStores` - Get only central stores (for parent selection)
  - `useCreateStore` - Create new store
  - `useUpdateStore` - Update existing store
  - `useDeleteStore` - Delete store
  - `useActivateStore` / `useDeactivateStore` - Toggle store status

#### 3. UI Components
- **List Page**: `src/features/admin/components/stores/index.tsx`
  - Data table with pagination
  - Filter by location, type, status
  - Actions: View, Edit, Delete, Activate/Deactivate
  - Confirmation dialogs for destructive actions

- **Create/Edit Form**: `src/features/admin/components/stores/create.tsx`
  - Store information fields
  - Store type selection (Central/Location)
  - Parent store selection (for location stores)
  - Store keeper assignment
  - Active status toggle
  - Info box explaining store types

- **Detail View**: `src/features/admin/components/stores/id.tsx`
  - Store information display
  - Location details
  - Store keeper information
  - Parent store (if applicable)
  - Audit trail (created by, updated by, timestamps)
  - Placeholder for inventory summary (Phase 2)

#### 4. Table Columns
- **File**: `src/features/admin/components/table-columns/inventory-management/store.tsx`
- **Columns**: Code, Name, Type, Location, Parent Store, Store Keeper, Status, Created Date, Actions

#### 5. Routes
- **Router Constants**: Updated `src/constants/RouterConstants.ts`
  - `STORES`: `/dashboard/admin/inventory-management/stores`
  - `STORES_CREATE`: `/dashboard/admin/inventory-management/stores/create`
  - `STORES_DETAIL`: `/dashboard/admin/inventory-management/stores/:id`

- **Next.js Pages**:
  - `src/app/dashboard/admin/inventory-management/stores/page.tsx`
  - `src/app/dashboard/admin/inventory-management/stores/create/page.tsx`
  - `src/app/dashboard/admin/inventory-management/stores/[id]/page.tsx`

### Features Implemented:
✅ Store entity with type (Central/Location)
✅ Location-based store assignment
✅ Store hierarchy (parent-child relationship)
✅ Store keeper management
✅ CRUD operations
✅ Active/Inactive status
✅ Full UI with list, create, edit, detail views
✅ Filtering and search
✅ Pagination support

### Backend Requirements:
For Phase 1 to work, the backend needs to implement:

```python
# Django Model Example
class Store(models.Model):
    STORE_TYPE_CHOICES = [
        ('CENTRAL', 'Central Store'),
        ('LOCATION', 'Location Store'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    location = models.ForeignKey('Location', on_delete=models.PROTECT)
    store_type = models.CharField(max_length=20, choices=STORE_TYPE_CHOICES)
    parent_store = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    store_keeper = models.ForeignKey('User', on_delete=models.PROTECT, related_name='managed_stores')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, related_name='stores_created')
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, related_name='stores_updated')

# API Endpoints Required:
GET    /admins/inventory/stores/                   # List stores (with filters)
POST   /admins/inventory/stores/                   # Create store
GET    /admins/inventory/stores/{id}/              # Get store details
PATCH  /admins/inventory/stores/{id}/              # Update store
DELETE /admins/inventory/stores/{id}/              # Delete store
POST   /admins/inventory/stores/{id}/activate/     # Activate store
POST   /admins/inventory/stores/{id}/deactivate/   # Deactivate store
```

---

## ✅ Phase 2: Migrate Existing Inventory to Store-Based System (COMPLETED)

### Objectives:
1. ✅ Add `store` field to Item/Consumable models
2. ✅ Create ItemStoreStock model for per-store inventory tracking
3. ⏳ Migrate existing global inventory to HQ Central Store (Backend)
4. ✅ Update inventory APIs to be store-aware

### Tasks Completed:
- [x] Create ItemStoreStock type definitions
- [x] Update Item/Consumable types to include store_stocks array
- [x] Create ItemStoreStock API controller with all CRUD operations
- [x] Create ItemStoreStockCard component for displaying per-store stocks
- [x] Add stock alert level helpers (OK, LOW, CRITICAL, OUT_OF_STOCK)
- [x] Create stock movement tracking types
- [x] Add store stock summary types

### Files Created:
- `src/features/admin/types/inventory-management/item-store-stock.ts` - Complete type definitions
- `src/features/admin/controllers/itemStoreStockController.ts` - Full API controller
- `src/features/admin/components/inventory-management/ItemStoreStockCard.tsx` - Stock display component

### Files Modified:
- `src/features/admin/types/config/item.ts` - Added store_stocks field with backward compatibility
- `src/features/admin/types/inventory-management/consumable.ts` - Added store_stocks field with backward compatibility

### Backend API Endpoints Required:
```
GET    /admins/inventory/item-store-stocks/                      # List all item-store stocks (with filters)
POST   /admins/inventory/item-store-stocks/                      # Create item store stock
GET    /admins/inventory/item-store-stocks/{id}/                 # Get single item store stock
PATCH  /admins/inventory/item-store-stocks/{id}/                 # Update item store stock
DELETE /admins/inventory/item-store-stocks/{id}/                 # Delete item store stock
POST   /admins/inventory/item-store-stocks/{id}/adjust/          # Manual stock adjustment
GET    /admins/inventory/item-store-stocks/{id}/movements/       # Get stock movement history
GET    /admins/inventory/item-store-stocks/summary/              # Get store stock summary
```

### Backend Database Schema:
```sql
-- Item Store Stock table
CREATE TABLE item_store_stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    available_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    reserved_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    re_order_level DECIMAL(10, 2) DEFAULT 0,
    buffer_stock DECIMAL(10, 2) DEFAULT 0,
    max_stock DECIMAL(10, 2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_id, store_id)
);

-- Stock Movement Tracking table
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_store_stock_id UUID NOT NULL REFERENCES item_store_stocks(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL, -- IN, OUT, ADJUSTMENT, TRANSFER, REQUISITION
    quantity DECIMAL(10, 2) NOT NULL,
    previous_quantity DECIMAL(10, 2) NOT NULL,
    new_quantity DECIMAL(10, 2) NOT NULL,
    reference_type VARCHAR(20), -- GRN, TRANSFER, REQUISITION, ADJUSTMENT
    reference_id UUID,
    remark TEXT,
    created_by UUID REFERENCES users(id),
    created_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_item_store_stocks_item ON item_store_stocks(item_id);
CREATE INDEX idx_item_store_stocks_store ON item_store_stocks(store_id);
CREATE INDEX idx_stock_movements_item_store_stock ON stock_movements(item_store_stock_id);
CREATE INDEX idx_stock_movements_created ON stock_movements(created_datetime DESC);

-- Migration Script (Example)
-- This would migrate existing global inventory to HQ Central Store
INSERT INTO item_store_stocks (item_id, store_id, quantity, available_quantity, re_order_level, buffer_stock, max_stock)
SELECT
    id as item_id,
    (SELECT id FROM stores WHERE store_type = 'CENTRAL' LIMIT 1) as store_id,
    COALESCE(quantity, 0) as quantity,
    COALESCE(available_quantity, 0) as available_quantity,
    COALESCE(re_order_level, 0) as re_order_level,
    COALESCE(buffer_stock, 0) as buffer_stock,
    COALESCE(max_stock, 0) as max_stock
FROM items
WHERE quantity > 0 OR available_quantity > 0;
```

### Features Implemented:
✅ ItemStoreStock entity with full type safety
✅ Per-store inventory tracking
✅ Stock alert levels (OK, LOW, CRITICAL, OUT_OF_STOCK)
✅ Stock movement history tracking
✅ Store inventory summary
✅ Low stock alerts per store
✅ Manual stock adjustments
✅ Visual stock display component with color-coded alerts
✅ Backward compatibility with existing Item/Consumable types

---

## 📋 Phase 3: Update GRN to Specify Destination Store

### Objectives:
1. Add destination_store field to GRN
2. When GRN is accepted, add quantities to specified store's inventory
3. Update GRN creation form to include store selection

### Tasks:
- [ ] Update GoodReceiveNoteSchema to include destination_store
- [ ] Update GRN types to include store information
- [ ] Add store selection dropdown to GRN create form
- [ ] Filter stores by user's location or show only central store
- [ ] Update GRN detail page to show destination store
- [ ] Backend: On GRN acceptance, increment store inventory

---

## 📋 Phase 4: Implement Store Transfers

### Objectives:
1. Create Store Transfer entity
2. Implement transfer workflow (Pending → Approved → In Transit → Received)
3. Create UI for initiating and managing transfers
4. Update inventory on both source and destination stores

### Tasks:
- [ ] Create StoreTransfer type definitions
- [ ] Create storeTransferController
- [ ] Create Store Transfer table columns
- [ ] Create Store Transfer list page
- [ ] Create Store Transfer creation form
- [ ] Create Store Transfer detail/tracking page
- [ ] Implement transfer approval workflow
- [ ] Implement receive transfer functionality
- [ ] Add transfer history to store detail page

---

## 📋 Phase 5: Update Item Requisitions with Store Selection

### Objectives:
1. Add source_store field to Item Requisition
2. Filter available items by selected store's inventory
3. Deduct from store inventory on approval

### Tasks:
- [ ] Update ItemRequisitionSchema to include source_store
- [ ] Update requisition types
- [ ] Add store selection to requisition form
- [ ] Filter items to show only those available in selected store
- [ ] Show stock levels for selected store
- [ ] Update requisition approval to deduct from store inventory
- [ ] Add store information to requisition detail page

---

## 📋 Phase 6: Location-Based Access Controls

### Objectives:
1. Implement backend permission checks for store access
2. Users can only see/access stores in their assigned location
3. HQ users can see all stores
4. Store keepers can manage their assigned store(s)

### Tasks:
- [ ] Add location-based filtering to all store APIs
- [ ] Implement permission checks in backend
- [ ] Add user location context to API requests
- [ ] Create store access rules by user role
- [ ] Update frontend to respect access controls
- [ ] Add permission checks before showing store selection

---

## 📋 Phase 7: Store-Level Reports and Analytics

### Objectives:
1. Stock level reports per store
2. Store transfer reports
3. Low stock alerts per store
4. Store performance metrics

### Tasks:
- [ ] Create store inventory summary report
- [ ] Create store transfer report
- [ ] Implement low stock alerts per store
- [ ] Create store utilization dashboard
- [ ] Add store comparison analytics
- [ ] Export functionality for reports

---

## Navigation and Access

### Where to Find Stores:
1. **Dashboard**: Admin → Inventory Management → Stores
2. **URL**: `http://localhost:3000/dashboard/admin/inventory-management/stores`

### User Permissions Required:
- **View Stores**: ADMIN, STORE_KEEPER, AHNI_STAFF
- **Create/Edit Stores**: ADMIN
- **Manage Store Inventory**: ADMIN, STORE_KEEPER (for assigned store)

---

## Testing Checklist (Phase 1)

### Create Store
- [ ] Create central store at HQ
- [ ] Create location store with parent
- [ ] Validate required fields
- [ ] Assign store keeper
- [ ] Set active/inactive status

### List Stores
- [ ] View all stores in table
- [ ] Filter by location
- [ ] Filter by store type
- [ ] Filter by status
- [ ] Pagination works correctly

### Update Store
- [ ] Edit store details
- [ ] Change store keeper
- [ ] Update parent store
- [ ] Toggle active status

### Delete Store
- [ ] Delete store
- [ ] Confirm deletion dialog
- [ ] Verify store is removed from list

### View Store Details
- [ ] View store information
- [ ] See location details
- [ ] See store keeper info
- [ ] See parent store (if applicable)
- [ ] View audit trail

---

## Next Steps

1. ✅ **Phase 1 Complete**: Store entity and management fully implemented
2. 🔄 **Phase 2 Starting**: Migrate existing inventory to store-based system
3. ⏳ **Phase 3-7**: Awaiting Phase 2 completion

---

## Notes

- Frontend is fully implemented for Phase 1
- Backend API endpoints need to be created at `/admins/inventory/stores/`
- All store management features are ready to use once backend is deployed
- Phase 2 will require coordinating with backend team for data migration

---

## Support

For questions or issues:
- Check this document for implementation details
- Review type definitions in `src/features/admin/types/inventory-management/store.ts`
- Review API controller in `src/features/admin/controllers/storeController.ts`
