# Bidirectional User Relationship Implementation

## Overview
This document outlines the implementation of bidirectional user relationships, where users exist in BOTH the main users table AND specialized tables. This enables users created via the general "Create User" route to appear in specialized onboarding modules, and vice versa.

## Current Implementation Status

### ✅ Completed
1. **Database Routing Architecture** - Added routing logic to both Create and Edit User components
2. **User Type Detection** - Implemented switch statements to route based on user_type field
3. **Fallback Mechanism** - All specialized user types fallback to regular user controller for now
4. **Error Handling** - Added proper try/catch blocks and toast notifications
5. **Documentation** - Added comprehensive code comments explaining the routing logic

### 🔄 Bidirectional Relationship Logic

#### User Storage Strategy:
- **ALL USERS** → Always stored in main users table (authentication, roles, permissions)
- **AHNI_STAFF** → ALSO in workforce table (linked by user_id foreign key)
  - ✅ **Connected to Workforce Database**: `/dashboard/hr/workforce-database`
  - ✅ **Auto-created in employee onboarding table**
  - ✅ **Appears in workforce management workflows**
- **ADMIN** → ALSO in workforce table (linked by user_id foreign key)
  - ✅ **Connected to Workforce Database**: `/dashboard/hr/workforce-database`
  - ✅ **Auto-created in employee onboarding table**
  - ✅ **Appears in workforce management workflows**  
- **ADHOC_STAFF** → ALSO in adhoc table (linked by user_id foreign key)
  - ✅ **Connected to Adhoc Database**: `/dashboard/programs/adhoc-database`
  - ✅ **Auto-created in consultant management table with type="ADHOC"**
  - ✅ **Appears in adhoc staff management workflows**
- **FACILITATOR** → ALSO in facilitator table (linked by user_id foreign key)
  - ✅ **Connected to Facilitator Database**: `/dashboard/c-and-g/facilitator-database`
  - ✅ **Auto-created in facilitator management table**
  - ✅ **Appears in facilitator management workflows**
- **CONSULTANT** → ALSO in consultant table (linked by user_id foreign key)
  - ✅ **Connected to Consultancy Database**: `/dashboard/c-and-g/consultancy-database`
  - ✅ **Auto-created in consultant management table with type="CONSULTANT"**
  - ✅ **Appears in consultant management workflows**
- **VENDOR** → ALSO in vendor/supplier table (linked by user_id foreign key)
  - ✅ **Connected to Supplier Database**: `/dashboard/procurement/supplier-database`
  - ✅ **Auto-created in procurement vendors table**
  - ✅ **Appears in vendor management workflows**

#### How It Works:
1. **Create User Route** → Creates user in users table + specialized table (if applicable)
2. **Specialized Onboarding Route** → Creates user in specialized table + users table (if applicable)
3. **Both routes result in the same outcome** → User exists in both locations

### 🚧 Implementation Needed

#### 1. Adhoc Staff Controller
**File:** `/src/features/hr/controllers/adhocStaffController.ts` (to be created)
**Functions needed:**
- `useCreateAdhocStaff()`
- `useUpdateAdhocStaff(id: string)`
- `useGetAllAdhocStaff()`
- `useDeleteAdhocStaff()`

#### 2. Vendor Controller Integration
**File:** `/src/features/procurement/controllers/vendorController.ts` (exists)
**Functions needed:**
- Map user data to vendor format
- Implement `createVendorUser()` and `updateVendorUser()` functions

#### 3. Facilitator Controller Integration  
**File:** `/src/features/contracts-grants/controllers/facilitatorManagementController.ts` (exists)
**Functions needed:**
- Map user data to facilitator format
- Implement `createFacilitatorUser()` and `updateFacilitatorUser()` functions

#### 4. Consultant Controller Integration
**File:** `/src/features/contracts-grants/controllers/consultantManagementController.ts` (exists)
**Functions needed:**
- Map user data to consultant format
- Implement `createConsultantUser()` and `updateConsultantUser()` functions

#### 5. Data Mapping Functions
Each specialized controller will need data mapping functions to convert generic user data to specialized format:

```typescript
// Example for vendor mapping
const mapUserDataToVendor = (userData: TCreateUserFormValues) => {
  return {
    // Map common user fields to vendor-specific fields
    name: `${userData.first_name} ${userData.last_name}`,
    email: userData.email,
    phone: userData.mobile_number,
    // Add vendor-specific fields
    vendor_type: "INDIVIDUAL", // or derive from data
    registration_number: "", // may need additional form field
    // ... other vendor fields
  };
};
```

#### 6. Backend API Endpoints
Ensure the following endpoints exist and accept user data:
- `POST /adhoc-staff/` - Create adhoc staff
- `PUT /adhoc-staff/{id}/` - Update adhoc staff
- `POST /vendors/` - Create vendor (may already exist)
- `PUT /vendors/{id}/` - Update vendor (may already exist)
- `POST /facilitators/` - Create facilitator (may already exist)
- `PUT /facilitators/{id}/` - Update facilitator (may already exist)
- `POST /consultants/` - Create consultant (may already exist)
- `PUT /consultants/{id}/` - Update consultant (may already exist)

### 🔧 Modified Files

#### EditUser Component
**File:** `/src/features/auth/components/Users/EditUser.tsx`
- Added `updateUserByType()` routing function
- Added placeholder functions for each user type
- Added comprehensive documentation

#### CreateUsers Component  
**File:** `/src/features/auth/components/Users/CreateUsers.tsx`
- Added `createUserByType()` routing function
- Added placeholder functions for each user type
- Added error handling and toast notifications

### 📋 Next Steps

1. **Create Adhoc Staff Controller** - Implement missing controller for adhoc staff
2. **Implement Data Mapping** - Create functions to map generic user data to specialized formats
3. **Integrate Existing Controllers** - Replace placeholder functions with actual controller calls
4. **Test Database Routing** - Verify that users are being created/updated in correct databases
5. **Update User Listing** - Modify user list to aggregate users from all specialized databases
6. **Handle User Type Changes** - Implement logic for moving users between databases when user type changes

### 🎯 Benefits

1. **Specialized Data Storage** - Each user type stored with appropriate schema and constraints
2. **Better Data Organization** - Cleaner separation of concerns for different user roles
3. **Scalable Architecture** - Easy to add new user types with their own specialized databases
4. **Improved Performance** - Queries against smaller, specialized tables instead of large generic user table
5. **Role-Specific Features** - Each user type can have unique fields and functionality

### ⚠️ Considerations

1. **Data Migration** - Existing users may need to be migrated to appropriate specialized databases
2. **User Listing Complexity** - The main users list will need to aggregate from multiple databases
3. **Search Functionality** - Cross-database search will be more complex
4. **Reporting** - Reports spanning multiple user types will need special handling
5. **Authentication** - Ensure login works regardless of which database stores the user

### 🔄 Handling Incomplete Profiles

**Problem**: When users are created via the user management interface, they only have basic information (name, email, phone). But specialized databases (especially ADHOC_STAFF and CONSULTANT) require rich professional data like:
- Education history
- Employment history
- Language proficiency  
- Special consultant services
- References
- Documents (resume, cover letter)
- Contract details (salary, duration, etc.)

**Solution Implemented**:

1. **Profile Status Tracking**: 
   - Records created from user management are marked with `profile_status: "INCOMPLETE"`
   - Titles include `[INCOMPLETE PROFILE]` indicator
   - Descriptions include ⚠️ warnings about missing data

2. **Clear Data Requirements**:
   - `extra_info` field lists exactly what's missing: "Missing: contract details, education, experience, references, documents"
   - Background text explains the profile needs completion via proper onboarding

3. **Visual Indicators**:
   - Incomplete profiles clearly marked in all views
   - Warning icons and text guide users to complete profiles
   - Update operations preserve incomplete status until proper onboarding

**Next Steps for Complete Implementation**:
1. Add UI indicators in adhoc and consultancy databases to highlight incomplete profiles
2. Create "Complete Profile" action button for incomplete records
3. Build bridge functionality to move incomplete profiles to full onboarding process
4. Add reporting to track incomplete vs complete profiles
5. Consider notification system for managers about incomplete profiles

**User Types Affected by Incomplete Profiles**:
- **ADHOC_STAFF**: Missing professional experience, education, references, contract details
- **CONSULTANT**: Missing professional experience, education, references, contract details
- **FACILITATOR**: May have incomplete specialization and certification data
- **VENDOR**: May have incomplete business registration and capability details

## Testing Checklist

- [ ] Create AHNI_STAFF user → Stored in users table
- [ ] Create ADMIN user → Stored in users table  
- [ ] Create ADHOC_STAFF user → Stored in adhoc table
- [ ] Create FACILITATOR user → Stored in facilitator table
- [ ] Create CONSULTANT user → Stored in consultant table
- [ ] Create VENDOR user → Stored in vendor table
- [ ] Edit users of each type → Updates correct database
- [ ] User list shows users from all databases
- [ ] User type changes move user to appropriate database