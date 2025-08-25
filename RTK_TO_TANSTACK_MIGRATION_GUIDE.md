# RTK Query → TanStack Query Component Migration Guide

## 🎯 Migration Status

**COMPLETED:** Admin Agreement, Auth components (3 files), Projects components (5 files)
**REMAINING:** ~50+ components across all modules

## 📋 Complete List of Components Needing Updates

Based on my comprehensive scan, here are ALL components that still use RTK Query hooks:

### **AUTH MODULE COMPONENTS** ✅ COMPLETED
- `src/features/auth/components/Users/AssignRole.tsx` - ✅ Updated
- `src/features/auth/components/Users/AllPermissions.tsx` - ✅ Updated  
- `src/features/auth/components/Users/AssignPermission.tsx` - ✅ Updated

### **PROJECTS MODULE COMPONENTS** ✅ PARTIALLY COMPLETED
- `src/features/projects/components/projects/index.tsx` - ✅ Updated
- `src/features/projects/components/projects/[id]/index.tsx` - ✅ Updated
- `src/features/projects/components/projects/[id]/Upload.tsx` - ✅ Updated
- `src/features/projects/components/projects/create/Uploads.tsx` - ❌ Needs Update
- `src/features/projects/components/projects/create/DocumentCard.tsx` - ❌ Needs Update
- `src/features/projects/components/projects/create/Summary.tsx` - ❌ **COMPLEX - Multiple services**
- `src/features/projects/components/modals/ConsortiumModal.tsx` - ✅ Updated
- `src/features/projects/components/modals/ChangeProjectStatusModal.tsx` - ✅ Updated  
- `src/features/projects/components/modals/ProjectDetailsUploadModal.tsx` - ❌ Needs Update
- `src/features/projects/components/modals/ProjectUploadModal.tsx` - ❌ Needs Update
- `src/features/projects/components/modules/AllPartner.tsx` - ❌ Needs Update
- `src/features/projects/components/modules/AddBeneficiary.tsx` - ❌ Needs Update
- `src/features/projects/components/modules/AllDocumentTypes.tsx` - ❌ Needs Update
- `src/features/projects/components/modules/AllBeneficiary.tsx` - ❌ Needs Update  
- `src/features/projects/components/modules/AddDocumentType.tsx` - ❌ Needs Update
- `src/features/projects/components/modules/AddPartner.tsx` - ❌ Needs Update
- `src/features/projects/components/modules/AddFundingSource.tsx` - ❌ Needs Update
- `src/features/projects/components/modules/AllFundingSource.tsx` - ❌ Needs Update
- `src/features/projects/components/table-columns/project/partner.tsx` - ❌ Needs Update
- `src/features/projects/components/table-columns/project-columns.tsx` - ❌ Needs Update

### **ADMIN MODULE COMPONENTS** ❌ NOT STARTED
- `src/features/admin/components/facility-management/facility-maintenance/index.tsx`
- `src/features/admin/components/facility-management/facility-maintenance/create.tsx`
- `src/features/admin/components/facility-management/facility-maintenance/id.tsx`
- `src/features/admin/components/payment-request/index.tsx`
- `src/features/admin/components/payment-request/id.tsx`
- `src/features/admin/components/payment-request/create/index.tsx`
- `src/features/admin/components/payment-request/create/uploads.tsx`
- `src/features/admin/components/AddAssetConditions.tsx`
- `src/features/admin/components/expense-authorization/index.tsx`
- `src/features/admin/components/expense-authorization/create.tsx`
- `src/features/admin/components/expense-authorization/id.tsx`
- `src/features/admin/components/fleet-management/vehicle-request/index.tsx`
- `src/features/admin/components/fleet-management/vehicle-request/create.tsx`
- `src/features/admin/components/fleet-management/vehicle-request/id.tsx`
- `src/features/admin/components/fleet-management/vehicle-maintenance/index.tsx`
- `src/features/admin/components/fleet-management/vehicle-maintenance/create.tsx`
- `src/features/admin/components/fleet-management/vehicle-maintenance/id.tsx`
- `src/features/admin/components/fleet-management/fuel-request/index.tsx`
- `src/features/admin/components/fleet-management/fuel-request/create.tsx`
- `src/features/admin/components/fleet-management/fuel-request/id.tsx`

### **HR MODULE COMPONENTS** ❌ NOT STARTED  
- `src/features/hr/components/leave-management/Assign.tsx`
- `src/features/hr/components/grievance-management/index.tsx`
- `src/features/hr/components/grievance-management/create.tsx`
- `src/features/hr/components/grievance-management/id.tsx`
- `src/features/hr/components/employee-benefits/index.tsx`
- `src/features/hr/components/onboarding/index.tsx`
- `src/features/hr/components/workforce-database/index.tsx`
- `src/features/hr/components/performance-management/index.tsx`
- Plus 15+ more HR components

### **PROCUREMENT MODULE COMPONENTS** ❌ NOT STARTED
- All vendor management components  
- All purchase order components
- All solicitation components
- CBA components
- Plus 20+ procurement components

### **CONTRACTS & GRANTS MODULE COMPONENTS** ❌ NOT STARTED
- Grant management components
- Sub-grant components  
- Contract management components
- Plus 12+ C&G components

### **PROGRAMS MODULE COMPONENTS** ❌ NOT STARTED
- Activity plan components
- Fund request components
- Stakeholder management components
- Plus 10+ program components

### **SHARED COMPONENTS**
- `src/components/Sidebar.tsx` - ❌ Needs Update
- `src/components/Table/columns/lease.tsx` - ❌ Needs Update

## 🔧 Migration Patterns Established

### **Import Pattern:**
```typescript
// OLD
import { useGetAllUsersQuery } from "services/auth/user";

// NEW  
import { useGetAllUsers } from "@/features/auth/controllers/userController";
```

### **Hook Usage Pattern:**
```typescript
// OLD RTK Query Pattern
const { data, isFetching } = useGetAllUsersQuery({ page: 1, size: 20 });
const [createUser, { isLoading }] = useCreateUserMutation();

// NEW TanStack Query Pattern
const { data: usersData, isLoading } = useGetAllUsers({ 
  page: 1, 
  size: 20, 
  search: "" 
});
const { createUser, isLoading: creating } = useCreateUser();
```

### **Controller Import Mapping:**

| Service Import | Controller Import |
|----------------|-------------------|
| `services/auth/user` | `@/features/auth/controllers/userController` |
| `services/auth/role` | `@/features/auth/controllers/roleController` |
| `services/project` | `@/features/projects/controllers/projectController` |
| `services/project/document` | `@/features/projects/controllers/projectDocumentController` |
| `services/admin/payment-request` | `@/features/admin/controllers/paymentRequestController` |
| `services/admin/facility-management/facility-maintenance` | `@/features/admin/controllers/facilityMaintenanceController` |
| `services/modules/project/beneficiaries` | `@/features/modules/controllers/project/beneficiaryController` |
| `services/modules/config/location` | `@/features/modules/controllers/config/locationController` |

## 🚀 Systematic Migration Approach

### **Phase 1: Complex Multi-Service Components** (HIGH PRIORITY)
These components import from multiple services and need careful handling:

1. **`projects/create/Summary.tsx`** - Uses 8+ different services
   - `services/auth/user` → `@/features/auth/controllers/userController`
   - `services/project` → `@/features/projects/controllers/projectController`
   - `services/modules/project/beneficiaries` → `@/features/modules/controllers/project/beneficiaryController`
   - `services/modules/project/partners` → `@/features/modules/controllers/project/partnerController`
   - `services/modules/config/location` → `@/features/modules/controllers/config/locationController`
   - Plus several others

### **Phase 2: Single-Service Components** (MEDIUM PRIORITY)
Components using 1-2 services - easier to migrate:
- All the module components (Add/All patterns)
- Individual entity management pages

### **Phase 3: Shared/Table Components** (LOW PRIORITY)  
- Sidebar component
- Table column components

## 📝 Migration Checklist Template

For each component:
- [ ] ✅ Read current file and identify all RTK Query imports
- [ ] ✅ Map each service import to corresponding TanStack controller
- [ ] ✅ Update all import statements
- [ ] ✅ Convert all hook usage to destructuring pattern
- [ ] ✅ Add required parameters (search, etc.)
- [ ] ✅ Change `isFetching` to `isLoading`
- [ ] ✅ Update mutation patterns from `[mutation, { state }]` to `{ mutation, state }`
- [ ] ✅ Test component still works

## 🎯 Expected Outcomes

After completing this migration:
- **Performance**: Better caching and request deduplication
- **DX**: Improved TypeScript support and error handling  
- **Consistency**: All components use same destructuring pattern
- **Maintainability**: Single source of truth for API logic
- **Modern Stack**: Latest React Query patterns

## 📊 Progress Tracking

**TOTAL COMPONENTS TO MIGRATE:** ~80 components
**COMPLETED:** 9 components (11%)
**REMAINING:** ~71 components (89%)

Each component migration typically takes 5-15 minutes depending on complexity.