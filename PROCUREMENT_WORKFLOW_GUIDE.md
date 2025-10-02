# Procurement Workflow Guide

## Overview
The procurement system now supports **THREE** independent workflows:

---

## 1. ✅ Create Purchase Request WITH Activity Memo (Integrated Flow)

**Use Case:** When you need to create a purchase request that includes an activity memo with expense details.

### Steps:
1. Navigate to **Procurement → Purchase Request**
2. Click "Create Purchase Request"
3. Create Activity Memo first at `/dashboard/procurement/purchase-request/activity-memo`
   - Fill in basic information
   - Add expenses to the expense table
   - Submit
4. The system will redirect to Purchase Request form with the Activity Memo data pre-filled
5. Complete the Purchase Request form
6. Submit

**URL Flow:**
```
/dashboard/procurement/purchase-request/activity-memo
  → (creates activity memo) →
/dashboard/procurement/purchase-request/create?request={memo_id}
```

**Features:**
- Activity Memo expenses are automatically populated in Purchase Request
- Activity Memo FCO numbers are pre-selected
- Activity Memo data is linked to Purchase Request via `request_memo` field

---

## 2. ✅ Create Purchase Request WITHOUT Activity Memo (Standalone)

**Use Case:** When you need a simple purchase request without detailed activity memo/expenses.

### Steps:
1. Navigate to **Procurement → Purchase Request**
2. Click "Create Purchase Request"
3. Go directly to `/dashboard/procurement/purchase-request/create`
4. Fill in Purchase Request form manually
5. Submit

**URL:**
```
/dashboard/procurement/purchase-request/create
```

**Features:**
- No Activity Memo required
- Manual entry of all purchase request details
- No expenses table integration

---

## 3. ✅ Create Activity Memo WITHOUT Purchase Request (Standalone)

**Use Case:** When you need to document activities and expenses without creating a purchase request.

### Steps:
1. Navigate to **Procurement → Activity Memo** (new menu item)
2. Click "Create Activity Memo"
3. Fill in:
   - Basic Information (Memo Title, Project, Description, Purpose)
   - Activity Details (Location, Start/End Date)
   - Expenses Breakdown Table
4. Submit

**URL:**
```
/dashboard/procurement/activity-memo/create
```

**Features:**
- Completely standalone
- No Purchase Request created
- Expense table with auto-calculation:
  - Add/Remove rows dynamically
  - Quantity × Unit Cost = Total
  - Grand Total calculated automatically
- Can be used for:
  - Activity reporting
  - Expense tracking
  - Budget planning
  - Documentation purposes

---

## Menu Structure

### Procurement Management Sidebar:
```
├── Overview
├── Vendor Management
├── Supplier Database
├── Price Intelligence
├── Procurement Plan
├── Procurement Tracker
├── Purchase Request ← (with tabs: Created | Approved)
├── Activity Memo ← (NEW - with tabs: Created | Approved)
├── Solicitation Management
├── Competitive Bid Analysis
├── Purchase Order
└── Procurement Report
```

---

## Tab Structure

### Purchase Request Tabs:
1. **Created Purchase Requests** - All pending/created purchase requests
2. **Approved Purchase Requests** - All approved purchase requests

### Activity Memo Tabs:
1. **Created Activity Memos** - All pending/created activity memos
2. **Approved Activity Memos** - All approved activity memos

---

## Data Relationship

### When Created Together:
```
Activity Memo (id: abc-123)
    ↓
Purchase Request (request_memo: abc-123)
```

### When Created Separately:
```
Activity Memo (id: xyz-789)
    ← No relationship →
Purchase Request (request_memo: null)
```

---

## Key Files

### Purchase Request:
- Main Page: `/src/app/dashboard/procurement/purchase-request/page.tsx`
- Component: `/src/features/procurement/components/purchase-request/index.tsx`
- Create Form: `/src/features/procurement/components/purchase-request/create-purchase-request/form/index.tsx`

### Activity Memo (Integrated):
- Path: `/src/app/dashboard/procurement/purchase-request/activity-memo/page.tsx`
- Component: `/src/features/procurement/components/purchase-request/activity-memo/form/index.tsx`

### Activity Memo (Standalone):
- Main Page: `/src/app/dashboard/procurement/activity-memo/page.tsx`
- Component: `/src/features/procurement/components/activity-memo/index.tsx`
- Create Form: `/src/features/procurement/components/activity-memo/create/CreateActivityMemoForm.tsx`

### Navigation:
- Sidebar: `/src/components/Sidebar.tsx` (line 744: Activity Memo menu item)

---

## Summary

✅ **All three workflows are now supported:**
1. Purchase Request + Activity Memo (integrated)
2. Purchase Request only (standalone)
3. Activity Memo only (standalone)

✅ **Both menus have tabs** for Created and Approved views

✅ **Expense tables** with automatic calculations in Activity Memo

✅ **Clean navigation** with separate menu items