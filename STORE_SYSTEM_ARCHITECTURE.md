# 🏗️ Multi-Store System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AHNI Multi-Store ERP System                 │
└─────────────────────────────────────────────────────────────────┘
                                  │
                ┌─────────────────┴─────────────────┐
                │                                   │
        ┌───────▼────────┐                  ┌──────▼──────┐
        │  Store Entity  │                  │  Inventory  │
        │  (Phase 1)     │                  │  (Phase 2)  │
        └───────┬────────┘                  └──────┬──────┘
                │                                   │
        ┌───────▼─────────────────────────────────▼────────┐
        │                                                   │
┌───────▼────────┐  ┌──────────────┐  ┌──────────────────▼─┐
│ Central Store  │  │ Location     │  │ Item Store Stock   │
│ (HQ Warehouse) │  │ Stores       │  │ (Per-Store Qty)    │
└────────────────┘  └──────────────┘  └────────────────────┘
```

---

## Entity Relationship Diagram

```
┌─────────────────┐
│     Store       │
│─────────────────│
│ id              │◄──────────┐
│ name            │           │
│ code            │           │ parent_store
│ store_type      │           │ (self-reference)
│ location_id     │──┐        │
│ parent_store_id │──┘        │
│ store_keeper_id │           │
│ is_active       │           │
└─────────────────┘           │
         │                    │
         │                    │
         │                    │
         ▼                    │
┌─────────────────┐           │
│ ItemStoreStock  │           │
│─────────────────│           │
│ id              │           │
│ item_id         │───────┐   │
│ store_id        │───────┼───┘
│ quantity        │       │
│ available_qty   │       │
│ reserved_qty    │       │
│ re_order_level  │       │
│ buffer_stock    │       │
│ max_stock       │       │
└─────────────────┘       │
         │                │
         │                │
         ▼                ▼
┌─────────────────┐ ┌────────────┐
│ StockMovement   │ │    Item    │
│─────────────────│ │────────────│
│ id              │ │ id         │
│ item_stock_id   │ │ name       │
│ movement_type   │ │ category   │
│ quantity        │ │ uom        │
│ reference_type  │ │ ...        │
│ reference_id    │ └────────────┘
│ remark          │
└─────────────────┘
```

---

## Store Hierarchy Example

```
                    ┌──────────────────────────┐
                    │  AHNI HQ Central Store   │
                    │  (Type: CENTRAL)         │
                    │  Code: HQ-MAIN           │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴────────────────────┐
                    │                                 │
         ┌──────────▼──────────┐         ┌───────────▼──────────┐
         │  FOMWAN Store       │         │  ADSO Store          │
         │  (Type: LOCATION)   │         │  (Type: LOCATION)    │
         │  Code: FOMWAN-01    │         │  Code: ADSO-01       │
         │  Parent: HQ-MAIN    │         │  Parent: HQ-MAIN     │
         └─────────────────────┘         └──────────────────────┘

                    ┌──────────────────────────┐
                    │  Jigawa Office Store     │
                    │  (Type: LOCATION)        │
                    │  Code: JIGAWA-01         │
                    │  Parent: HQ-MAIN         │
                    └──────────────────────────┘
```

---

## Inventory Flow Diagram

### Current Implementation (Phase 1 & 2)

```
┌──────────────┐
│  Vendor      │
└──────┬───────┘
       │ delivers goods
       ▼
┌──────────────────────────────────────┐
│  Good Receive Note (GRN)             │ ← Phase 3: Will add destination_store
│  - Purchase Order reference          │
│  - Items received                    │
│  - Quantities                        │
└──────┬───────────────────────────────┘
       │ (accepted)
       ▼
┌──────────────────────────────────────┐
│  Store Inventory                     │
│  (ItemStoreStock)                    │
│  - Increment quantity                │
│  - Create stock movement record      │
└──────┬───────────────────────────────┘
       │
       │
       ▼
┌──────────────────────────────────────┐
│  Available for:                      │
│  - Item Requisitions (Phase 5)       │
│  - Store Transfers (Phase 4)         │
│  - Direct Issues                     │
└──────────────────────────────────────┘
```

### Future Implementation (Phase 3-7)

```
                    ┌──────────────┐
                    │   Vendor     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     GRN      │
                    │ + Store      │ ← Phase 3
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌─────────────────┐      ┌─────────────────┐
    │  Central Store  │      │  Location Store │
    │  (HQ)           │      │  (Direct)       │
    └────────┬────────┘      └─────────────────┘
             │
             │ Transfer (Phase 4)
             │
             ▼
    ┌─────────────────┐
    │  Location Store │
    │  (Distributed)  │
    └────────┬────────┘
             │
             │ Requisition (Phase 5)
             │
             ▼
    ┌─────────────────┐
    │  End User       │
    │  (Staff)        │
    └─────────────────┘
```

---

## Data Flow Architecture

### Store Management (Phase 1)

```
┌─────────────┐    HTTP Request    ┌──────────────┐    Database Query    ┌──────────┐
│   Browser   │ ──────────────────>│   Backend    │ ──────────────────>  │   DB     │
│   (React)   │                    │   (Django)   │                      │ (Stores) │
└─────────────┘                    └──────────────┘                      └──────────┘
      │                                    │                                   │
      │ API Response                       │ Data                              │
      │<───────────────────────────────────┤<──────────────────────────────────┤
      │                                    │                                   │
      ▼                                    │                                   │
┌─────────────┐                            │                                   │
│ React Query │                            │                                   │
│   Cache     │                            │                                   │
└─────────────┘                            │                                   │
      │                                    │                                   │
      ▼                                    │                                   │
┌─────────────┐                            │                                   │
│  UI Table   │                            │                                   │
│  Component  │                            │                                   │
└─────────────┘                            │                                   │
```

### Inventory Tracking (Phase 2)

```
┌──────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Item   │────────>│ ItemStoreStock   │────────>│  Store          │
│          │ 1:many  │                  │ many:1  │                 │
└──────────┘         └──────────────────┘         └─────────────────┘
                              │
                              │ 1:many
                              ▼
                     ┌──────────────────┐
                     │ StockMovement    │
                     │ (History)        │
                     └──────────────────┘
```

---

## Stock Alert System

```
┌─────────────────────────────────────────────────┐
│         Stock Alert Level Decision Tree         │
└─────────────────────────────────────────────────┘

available_quantity = 0?
  │
  ├─ YES ──> 🔴 OUT_OF_STOCK
  │
  └─ NO
     │
     available_quantity <= buffer_stock?
     │
     ├─ YES ──> 🟠 CRITICAL
     │
     └─ NO
        │
        available_quantity <= re_order_level?
        │
        ├─ YES ──> 🟡 LOW
        │
        └─ NO ──> 🟢 OK
```

### Alert Colors

- 🟢 **OK (Green)**: Stock is sufficient
- 🟡 **LOW (Yellow)**: Below reorder level - consider ordering
- 🟠 **CRITICAL (Orange)**: Below buffer stock - urgent reorder needed
- 🔴 **OUT_OF_STOCK (Red)**: Zero stock - immediate action required

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    App Router (Next.js)                      │
└──────────────────────┬───────────────────────────────────────┘
                       │
    ┌──────────────────┴──────────────────┐
    │                                     │
    ▼                                     ▼
┌────────────────┐               ┌─────────────────┐
│  Store Pages   │               │  API Routes     │
└────────┬───────┘               └────────┬────────┘
         │                                 │
         ▼                                 ▼
┌────────────────┐               ┌─────────────────┐
│ Store Components│              │  Controllers    │
│  - index.tsx   │               │  - storeCtrl    │
│  - create.tsx  │               │  - stockCtrl    │
│  - id.tsx      │               └────────┬────────┘
└────────┬───────┘                        │
         │                                 ▼
         │                        ┌─────────────────┐
         │                        │  React Query    │
         │                        │  (TanStack)     │
         │                        └────────┬────────┘
         │                                 │
         └─────────────────┬───────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  UI Components  │
                  │  - Cards        │
                  │  - Tables       │
                  │  - Badges       │
                  └─────────────────┘
```

---

## API Request Flow

### Example: Get All Stores

```
1. User clicks "Stores" menu
   │
   ▼
2. React component mounts
   │
   ▼
3. useGetAllStores() hook called
   │
   ▼
4. React Query checks cache
   │
   ├─ Cache Hit ──> Return cached data
   │
   └─ Cache Miss
       │
       ▼
5. HTTP GET /admins/inventory/stores/?page=1&size=20
   │
   ▼
6. Backend processes request
   - Apply filters
   - Paginate results
   - Expand relations (location, store_keeper)
   │
   ▼
7. Return JSON response
   │
   ▼
8. React Query caches response
   │
   ▼
9. Component receives data
   │
   ▼
10. DataTable renders with data
```

---

## Security & Access Control (Phase 6 - Future)

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ has
       ▼
┌─────────────┐      ┌──────────────┐
│  Location   │      │    Role      │
└──────┬──────┘      └──────┬───────┘
       │                    │
       │ determines         │ grants
       │                    │
       ▼                    ▼
┌──────────────────────────────────┐
│     Store Access Control         │
│  - Can view stores               │
│  - Can manage stores             │
│  - Can request from stores       │
│  - Can transfer between stores   │
└──────────────────────────────────┘
```

### Access Rules (Planned)

| User Type | Location | Can View | Can Manage | Can Request | Can Transfer |
|-----------|----------|----------|------------|-------------|--------------|
| HQ Admin | HQ | All Stores | All Stores | HQ Store | To All |
| Location Staff | FOMWAN | FOMWAN Store | None | FOMWAN Store | None |
| Store Keeper | FOMWAN | FOMWAN Store | FOMWAN Store | FOMWAN Store | Receive Only |
| Super Admin | Any | All Stores | All Stores | All Stores | All |

---

## Performance Considerations

### Caching Strategy

```
┌──────────────────────────────────────────┐
│         React Query Cache                │
├──────────────────────────────────────────┤
│  - Stores list: 5 minutes                │
│  - Store details: 10 minutes             │
│  - Item stock: 2 minutes (real-time)     │
│  - Low stock alerts: 1 minute            │
│  - Movement history: 10 minutes          │
└──────────────────────────────────────────┘
```

### Pagination

- Default page size: 20 items
- Store list: Paginated
- Item stock by store: Up to 1000 items (no pagination)
- Stock movements: Last 100 movements

### Database Indexes

```sql
-- Critical indexes for performance
CREATE INDEX idx_item_store_stocks_item ON item_store_stocks(item_id);
CREATE INDEX idx_item_store_stocks_store ON item_store_stocks(store_id);
CREATE INDEX idx_item_store_stocks_alert ON item_store_stocks(available_quantity, re_order_level);
CREATE INDEX idx_stores_location ON stores(location_id);
CREATE INDEX idx_stores_type ON stores(store_type);
CREATE INDEX idx_stock_movements_created ON stock_movements(created_datetime DESC);
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Icons**: Lucide React

### Backend (Required)
- **Framework**: Django + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT Tokens
- **API Style**: RESTful

---

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────────┐
│                         Cloud Infrastructure                 │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
    ┌───────▼────────┐                  ┌──────▼──────┐
    │   Frontend     │                  │   Backend   │
    │   (Vercel)     │                  │  (AWS/GCP)  │
    └───────┬────────┘                  └──────┬──────┘
            │                                   │
            │                                   │
            └───────────────┬───────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Database     │
                    │  (PostgreSQL)  │
                    └────────────────┘
```

---

*Architecture Version: 1.0.0*
*Last Updated: 2025-10-12*
*Status: Phase 1 & 2 Implemented*
