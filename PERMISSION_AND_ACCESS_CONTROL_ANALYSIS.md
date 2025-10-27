# AHNI-New-FE: User Permissions & Module Access Control Analysis

## Executive Summary

The AHNI-New-FE codebase implements a **role-based access control (RBAC) system** with the following layers:

1. **Authentication**: Token-based authentication with localStorage storage
2. **Authorization**: Role and permission-based access to features
3. **Module Assignment**: Users have `assigned_modules` that determine which departmental hubs they can access
4. **Navigation Control**: Sidebar dynamically shows modules based on user permissions
5. **Global Hub**: Currently shows universally available features (Purchase Requests, Item Requisitions, etc.)

The key insight is that **GLOBAL HUB is already designed to be universally accessible** — it contains cross-departmental features that all authenticated users should be able to access.

---

## 1. User Authentication Flow

### Current Implementation

**File**: `src/features/auth/controllers/authController.ts`

```typescript
export const useLogin = () => {
  const login = async (details: TLoginFormValues) => {
    const response = await callApi(details);
    
    // Store token and user data
    if (response.data?.access_token) {
      setAccessToken(response.data.access_token);
      
      if (response.data?.user) {
        setCurrentUser(response.data.user);  // Stores full user object
      }
    }
    return response;
  };
};
```

### User Data Structure

**File**: `src/features/auth/types/user.ts`

```typescript
export interface IUser {
  id: string;
  employee_id?: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  last_login: string;
  
  // CRITICAL FOR PERMISSIONS
  roles: Role[];              // User's assigned roles
  permissions: Permission[];  // Specific permissions
  assigned_modules: string[]; // Available modules
  
  // Additional properties
  designation: string;
  department: string;
  position: string;
  is_active: boolean;
  profile_picture: string;
  user_type: string;
  location: string;
  state: string;
  address: string;
}
```

### Token Storage

**File**: `src/utils/auth.ts`

```typescript
// Authentication is based on localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

export const setCurrentUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};
```

**Key Point**: User object is stored in localStorage, including:
- `assigned_modules` - array of module strings
- `roles` - array of role objects
- `permissions` - array of permission objects

---

## 2. User Permission & Role Structure

### Permission Types

**File**: `src/features/auth/types/permission.ts`

```typescript
export interface Permission {
  module: string;
  permissions: IPermission[];
}

export interface IPermission {
  id: number;
  name: string;
  codename: string;  // e.g., 'can_review', 'can_approve'
  module?: string;
  description?: string;
}

export interface IRole {
  id: string;
  name: string;
  permissions: Permission[];  // Permissions grouped by module
}

// Approval permissions helper
export function getApprovalPermissions(role: IRole): ApprovalPermissions {
  const approvalModule = role.permissions.find(p => p.module === 'approvals');
  
  return {
    can_review: approvalModule?.permissions.some(p => p.codename === 'can_review'),
    can_authorize: approvalModule?.permissions.some(p => p.codename === 'can_authorize'),
    can_approve: approvalModule?.permissions.some(p => p.codename === 'can_approve'),
  };
}
```

### Role Detection Pattern

**From**: `GOALS_ROLE_BASED_ACCESS.md`

```typescript
const userId = localStorage.getItem('user_id') || "";
const userRole = localStorage.getItem('user_role') || "";
const userGroups = localStorage.getItem('user_groups') || "";

const isAdmin = userRole === 'admin' ||
                userRole === 'hr' ||
                userGroups.includes('HR') ||
                userGroups.includes('Admin');
```

---

## 3. Module Assignment & Access Control

### How Modules Work

**File**: `src/routes/modules.tsx`

```typescript
export const modules = [
  {
    path: "/dashboard/modules/project",
    element: lazy(() => import("pages/protectedPages/modules/projects")),
  },
  {
    path: "/dashboard/modules/programs",
    element: lazy(() => import("pages/protectedPages/modules/programs")),
  },
  {
    path: "/dashboard/modules/admin",
    element: lazy(() => import("pages/protectedPages/modules/admin")),
  },
  {
    path: "/dashboard/modules/config",
    element: lazy(() => import("pages/protectedPages/modules/config")),
  },
  {
    path: "/dashboard/modules/procurement",
    element: lazy(() => import("pages/protectedPages/modules/procurement")),
  },
  {
    path: "/dashboard/modules/hr",
    element: lazy(() => import("pages/protectedPages/modules/hr")),
  },
  {
    path: "/dashboard/modules/c-and-g",
    element: lazy(() => import("pages/protectedPages/modules/c-and-g")),
  },
];
```

### Current Sidebar Navigation Structure

**File**: `src/components/Sidebar.tsx`

The sidebar has three main sections:

#### Section 1: Dashboard Link
```typescript
<Link href="/dashboard">Dashboard</Link>
```

#### Section 2: DEPARTMENTAL HUB (lines 210-381)
```typescript
// Shows filtered departmental modules
const getDeparmentalLinks = () => {
  return [
    {
      name: "Programs",
      path: "/dashboard/programs",
      icon: <ProgramsIcon />,
      link: [/* sublinks */]
    },
    {
      name: "Procurement Management",
      path: "/dashboard/procurement",
      icon: <ProcurementManagementIcon />,
      link: [/* sublinks */]
    },
    // ... Admin, HR, C&G modules
  ];
};

// Usage in sidebar:
{getDeparmentalLinks(["procurement"]).map((link) => (
  // Render each module with its sublinks
))}
```

**Issue Identified**: The function signature shows `getDeparmentalLinks(["procurement"])` but it's called as `getDeparmentalLinks()` with no parameters. The filtering logic is NOT implemented.

```typescript
// Line 694-695
// const getDeparmentalLinks = (assignedModules: string[]) => {
const getDeparmentalLinks = () => {
  // NO FILTERING APPLIED - returns all modules regardless of user permissions
```

#### Section 3: GLOBAL HUB (lines 563-627)
```typescript
const globalHubMenu = [
  {
    label: "Purchase Requests",
    path: "/dashboard/procurement/purchase-request",
    icon: <ShoppingCart className="w-4 h-4" />,
    category: "procurement"
  },
  {
    label: "Item Requisition",
    path: "/dashboard/admin/inventory-management/item-requisition",
    icon: <FileText className="w-4 h-4" />,
    category: "inventory"
  },
  {
    label: "Vehicle Request",
    path: "/dashboard/admin/fleet-management/vehicle-request",
    icon: <Car className="w-4 h-4" />,
    category: "fleet"
  },
  // ... More cross-departmental features
];

// The globalHubMenu is ALREADY shown without any permission filtering
{globalHubMenu?.map(({ label, path, icon }, id) => (
  <Link href={path || "#"}>
    {label}
  </Link>
))}
```

**Key Finding**: GLOBAL HUB is **already universally accessible** to all authenticated users. No filtering is applied.

---

## 4. Route Protection & Authentication

### Dashboard Layout Protection

**File**: `src/app/dashboard/layout.tsx`

```typescript
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(false);
  
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      redirect("/auth/login");  // Redirect unauthenticated users
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar sidebarWidth={sidebarWidth} />
      {/* Dashboard content */}
    </div>
  );
}
```

**Protection Level**: Only checks for presence of token. Does NOT validate:
- Token expiration
- User permissions for specific routes
- Module assignments for specific features

---

## 5. Permission Checking Patterns in Use

### Example: Role-Based Goals Access

**From**: `GOALS_ROLE_BASED_ACCESS.md`

This document shows an example of how role-based access is SUPPOSED to work:

```typescript
// For Staff/Employees
const { data: myGoalsData } = useGetEmployeeGoals(
  currentUserId,  // Only fetch current user's goals
  !isAdmin && !!currentUserId  // enabled flag based on role
);

// For HR/Admin
const { data: allGoalsData } = useGetGoals({
  search: debouncedSearchTerm,
  page: 1,
  size: 20,
  enabled: isAdmin,  // Fetch all goals only for admins
});
```

**Pattern**: 
1. Detect user role from localStorage
2. Conditionally fetch data based on role
3. Conditionally render UI elements based on role

### Example: User Filtering

**File**: `src/utils/userFilters.ts`

```typescript
export function filterAhniStaffOnly(users: IUser[]): IUser[] {
  return users.filter((user) => {
    const userType = user?.user_type?.toUpperCase()?.trim() || '';
    
    const isAhniStaff =
      userType === 'AHNI_STAFF' ||
      userType === 'ADMIN' ||
      userType === 'SUPERADMIN' ||
      userType === 'STAFF';

    return isAhniStaff;
  });
}

// Usage
const { data: users } = useGetAllUsers({ page: 1, size: 2000000 });
const ahniStaffUsers = filterAhniStaffOnly((users?.results || []) as any[]);
```

---

## 6. Current State Analysis

### What's Working

1. ✅ **Authentication**: Token-based login, stored in localStorage
2. ✅ **User Data Storage**: Full user object (with roles, permissions, assigned_modules) stored
3. ✅ **Global Hub Navigation**: Available to all authenticated users
4. ✅ **User Type Filtering**: Utilities exist to filter users by type (AHNI staff, vendors, consultants)
5. ✅ **Role Detection**: Pattern established for checking user roles from localStorage
6. ✅ **Permission Structure**: Backend provides role and permission objects

### What's NOT Fully Implemented

1. ❌ **Module Assignment Filtering**: `assigned_modules` is stored but NOT used in sidebar
   - The `getDeparmentalLinks()` function doesn't filter based on user's modules
   - All departmental modules shown regardless of user's actual module assignments

2. ❌ **Route-Level Permission Checks**: No guards on specific routes
   - Can technically access any dashboard route if token exists
   - Backend presumably enforces (frontend doesn't)

3. ❌ **Dynamic Sidebar**: Sidebar doesn't adapt to user's actual permissions
   - Commented code exists suggesting it WAS planned: `// const getDeparmentalLinks = (assignedModules: string[]) => {`
   - Never implemented

4. ❌ **Permission Validation**: No utility to check if user has specific permissions
   - Unlike approval permissions helper, no generic permission checker

---

## 7. Global Hub - Current Implementation

### What's in Global Hub

**File**: `src/components/Sidebar.tsx` (lines 45-135)

```typescript
const globalHubMenu = [
  // Procurement & Purchasing
  { label: "Purchase Requests", path: "/dashboard/procurement/purchase-request" },
  { label: "Item Requisition", path: "/dashboard/admin/inventory-management/item-requisition" },
  
  // Fleet & Transport
  { label: "Vehicle Request", path: "/dashboard/admin/fleet-management/vehicle-request" },
  { label: "Fuel Request", path: "/dashboard/admin/fleet-management/fuel-request" },
  
  // Maintenance
  { label: "Facility Maintenance", path: "/dashboard/admin/facility-management/facility-maintenance" },
  { label: "Asset Maintenance", path: "/dashboard/admin/asset-maintenance" },
  
  // Financial
  { label: "Payment Request", path: "/dashboard/admin/payment-request" },
  { label: "Expense Authorization", path: "/dashboard/admin/expense-authorization" },
  { label: "Travel Expense Report", path: "/dashboard/admin/travel-expenses-report" },
  
  // Contracts & HR
  { label: "Contract Request", path: "/dashboard/c-and-g/contract-request" },
  { label: "Consultancy Report", path: "/dashboard/c-and-g/consultancy-report" },
  { label: "Adhoc Staff Requisition", path: "/dashboard/adhoc-requisition" },
  
  // Support
  { label: "Support", path: "/dashboard/support" },
];
```

### Rendering Logic

```typescript
{globalHubMenu?.map(({ label, path, icon }, id) => {
  const isActive = path && pathname && pathname.startsWith(path);
  return (
    <Link
      href={path || "#"}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-gray-700 hover:bg-primary/5 hover:text-primary"
      )}
    >
      {icon}
      {label}
    </Link>
  );
})}
```

### Current State: ✅ Already Universally Accessible

- **NO permission checks** are applied to global hub items
- All authenticated users can see and access all items
- This is the INTENDED behavior for cross-departmental features

---

## 8. How to Make GLOBAL HUB Universally Accessible (Recommendations)

### Current Status
The Global Hub **IS ALREADY universally accessible**. However, to ENSURE this remains true and make it explicit:

### Option 1: Add Explicit Comment & Validation (Minimal Change)

```typescript
// In Sidebar.tsx - add at globalHubMenu definition
const globalHubMenu = [
  // NOTE: These items are universally accessible to ALL authenticated users
  // regardless of their assigned modules. These are cross-departmental features.
  {
    label: "Purchase Requests",
    path: "/dashboard/procurement/purchase-request",
    icon: <ShoppingCart className="w-4 h-4" />,
    category: "procurement",
    requiresAuth: true,  // Only require authentication, no specific modules
  },
  // ... rest of items
];
```

### Option 2: Create a Permission Check Utility (Recommended)

Create a utility to verify global hub access:

**File**: `src/utils/permissionHelpers.ts`

```typescript
/**
 * Check if user has access to a specific feature
 * Global Hub features require only authentication
 */
export function hasAccessToGlobalHubFeature(
  userObj: IUser | null
): boolean {
  // Only requirement: user must be authenticated
  // (token check already done at layout level)
  return !!userObj?.id;
}

/**
 * Check if user has access to a specific module
 */
export function hasAccessToModule(
  userObj: IUser | null,
  moduleName: string
): boolean {
  if (!userObj) return false;
  
  // Check if module is in assigned_modules array
  return userObj.assigned_modules?.includes(moduleName) || false;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userObj: IUser | null,
  codename: string,
  moduleName?: string
): boolean {
  if (!userObj) return false;
  
  // Check in user's permissions
  if (moduleName) {
    return userObj.permissions?.some(p => 
      p.module === moduleName && 
      p.permissions?.some(perm => perm.codename === codename)
    ) || false;
  }
  
  // Check across all permissions
  return userObj.permissions?.some(p =>
    p.permissions?.some(perm => perm.codename === codename)
  ) || false;
}

/**
 * Get all accessible module names for a user
 */
export function getAccessibleModules(userObj: IUser | null): string[] {
  return userObj?.assigned_modules || [];
}

/**
 * Check if user is admin/HR
 */
export function isAdminUser(userObj: IUser | null): boolean {
  if (!userObj) return false;
  
  return userObj.roles?.some(role =>
    role.name?.toLowerCase() === 'admin' ||
    role.name?.toLowerCase() === 'hr' ||
    role.name?.toLowerCase() === 'superadmin'
  ) || false;
}
```

### Option 3: Implement Module-Based Sidebar Filtering (Full Solution)

Enable the commented-out filtering in Sidebar:

```typescript
// Get current user
const { data: currentUserData } = useGetCurrentUser();
const currentUser = currentUserData?.data;
const assignedModules = currentUser?.assigned_modules || [];

// Implement filtering
const getDeparmentalLinks = (assignedModules: string[]) => {
  const allModules = [
    // Programs module
    {
      name: "Programs",
      path: "/dashboard/programs",
      moduleKey: "programs",
      // ... rest
    },
    // Procurement module
    {
      name: "Procurement Management",
      path: "/dashboard/procurement",
      moduleKey: "procurement",
      // ... rest
    },
    // ... other modules
  ];
  
  // Filter based on assigned modules
  return allModules.filter(module =>
    assignedModules.includes(module.moduleKey)
  );
};

// Use filtered links in render
{getDeparmentalLinks(assignedModules).map((link) => (
  // Render module
))}
```

### Option 4: Route-Level Guards (Advanced)

Create a route protection component:

```typescript
// src/components/ProtectedRoute.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/utils/auth";
import { hasAccessToModule } from "@/utils/permissionHelpers";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
  requiredPermission?: string;
}

export function ProtectedRoute({
  children,
  requiredModule,
  requiredPermission,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Check module access
    if (requiredModule && !hasAccessToModule(user, requiredModule)) {
      router.push("/dashboard"); // Redirect to dashboard
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router, requiredModule, requiredPermission]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <div>Unauthorized Access</div>;
  }

  return <>{children}</>;
}

// Usage in a layout or page:
export default function ProcurementPage() {
  return (
    <ProtectedRoute requiredModule="procurement">
      {/* Procurement content */}
    </ProtectedRoute>
  );
}
```

---

## 9. Implementation Roadmap

### Phase 1: Add Permission Utilities (Low Risk, High Value)
1. Create `src/utils/permissionHelpers.ts` with permission checking functions
2. Add JSDoc comments explaining the permission model
3. Create a reference guide document

**Effort**: 1-2 hours
**Risk**: None (additive only)

### Phase 2: Enable Module-Based Sidebar (Medium Risk, High Value)
1. Fetch current user in Sidebar component
2. Pass `assigned_modules` to `getDeparmentalLinks()`
3. Implement filtering logic
4. Test with users having different module assignments

**Effort**: 3-4 hours
**Risk**: Medium (UI changes, needs testing)
**Backend Requirement**: Backend must populate `assigned_modules` correctly

### Phase 3: Add Route Guards (Medium Risk, High Value)
1. Create ProtectedRoute component
2. Wrap departmental routes with guards
3. Keep Global Hub routes unguarded
4. Add unauthorized access handling

**Effort**: 4-5 hours
**Risk**: Medium (affects routing)
**Testing**: Comprehensive testing needed

### Phase 4: Create Permission Matrix Documentation (Low Risk, High Value)
1. Document which features require which permissions
2. Create permission assignment guide
3. Create permission validation checklist

**Effort**: 2-3 hours
**Risk**: None (documentation only)

---

## 10. Key Files Reference

### Authentication & Authorization
- `src/features/auth/types/user.ts` - User data model
- `src/features/auth/types/auth.ts` - Auth flow types
- `src/features/auth/types/permission.ts` - Permission model
- `src/features/auth/controllers/authController.ts` - Login logic
- `src/utils/auth.ts` - Auth utilities

### User Management
- `src/features/auth/controllers/userController.ts` - User queries
- `src/utils/userFilters.ts` - User filtering utilities

### Navigation & Routes
- `src/components/Sidebar.tsx` - Navigation sidebar (CRITICAL)
- `src/routes/modules.tsx` - Module routes
- `src/app/dashboard/layout.tsx` - Dashboard layout with auth check

### State Management
- `src/store/auth/authSlice.ts` - Redux auth state

---

## 11. Critical Insights

### 1. Global Hub is ALREADY Universally Accessible ✅
- No permission filtering is applied
- All authenticated users see all global hub items
- This is the current design and appears intentional

### 2. Departmental Modules ARE NOT Yet Filtered ❌
- The `assigned_modules` array exists in user data but is not used
- Code to filter exists but is commented out
- All users currently see all departmental modules in sidebar

### 3. Authentication is Token-Based ✅
- JWT token stored in localStorage
- Token presence checked at dashboard layout level
- User object with full permission data stored alongside token

### 4. Permission Model is Comprehensive ✅
- Roles contain permissions
- Permissions are grouped by module
- Support for specific actions (can_review, can_approve, can_authorize)

### 5. Frontend Doesn't Enforce Backend Permissions ⚠️
- Frontend shows/hides UI based on roles
- Frontend filtering is UX only
- Backend must enforce actual permissions (CRITICAL!)

---

## 12. Recommendations Summary

To ensure GLOBAL HUB is universally accessible and best practices are followed:

1. **Immediate**: Add permission helper utilities (low risk, clarifies intent)
2. **Short-term**: Enable module filtering in sidebar (medium risk, improves UX)
3. **Medium-term**: Add route guards (medium risk, improves security)
4. **Ongoing**: Document permission matrix (low risk, improves maintainability)

**Most Important**: Ensure backend validates all permissions - frontend filtering is UX only!
