# Automatic User Account Creation Implementation

## Overview
This document describes the automatic user account creation system for Consultants, Facilitators, and Adhoc Staff when they accept their contracts.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  CONTRACT ACCEPTANCE FLOW                    │
└─────────────────────────────────────────────────────────────┘

1. Applicant Reviews Contract
   ↓
2. Applicant Accepts Contract
   │
   ├──→ Update applicant record (offer_accepted = true)
   │
   └──→ Automatically create user account
        ├─→ Extract user data from applicant
        ├─→ Map to user creation format
        ├─→ POST to /users/ API
        │
        ├─→ Success: User can now login
        ├─→ Already Exists: Use existing account
        └─→ Failure: Admin creates manually

3. User appears in:
   - Consultant/Facilitator/Adhoc Database
   - Users Page (/dashboard/users)
```

## Implementation Files

### 1. Core Utility: `/src/utils/createUserFromApplicant.ts`

**Key Functions:**

#### `createUserAccountFromApplicant(applicantData, userType, defaultRoleId?)`
- **Purpose**: Create user account from applicant data
- **Parameters**:
  - `applicantData`: Applicant object with personal information
  - `userType`: "CONSULTANT" | "FACILITATOR" | "ADHOC_STAFF"
  - `defaultRoleId` (optional): Role to assign to user

- **Returns**: `{ success, data, userId, userExists?, error? }`

- **Features**:
  - Handles name extraction and parsing
  - Maps gender values to system enum
  - Auto-assigns department based on user type
  - Checks for existing users (prevents duplicates)
  - Comprehensive error handling and logging

#### `batchCreateUserAccounts(applicants, userType, defaultRoleId?)`
- **Purpose**: Create multiple user accounts at once
- **Use Case**: Bulk onboarding or historical data migration
- **Returns**: `{ created: [], existing: [], failed: [] }`

### 2. Integration Point: Contract Acceptance Forms

**Modified Files:**
- `/src/features/contracts-grants/components/contract-management/consultant-acceptance/id/AcceptanceForm.tsx`

**Integration Logic:**
```typescript
// After contract is accepted and applicant record is updated
try {
    const userType = applicant?.type || "ADHOC_STAFF";

    const userResult = await createUserAccountFromApplicant(
        applicant,
        userType
    );

    if (userResult.success) {
        toast.success("User account created!");
    } else if (userResult.userExists) {
        toast.success("Existing account activated!");
    }
} catch (error) {
    // Contract acceptance still succeeds
    toast.warning("Admin will create your account manually");
}
```

## User Type Mapping

| Applicant Type | User Type | Default Department | Default Position |
|---------------|-----------|-------------------|------------------|
| CONSULTANT    | CONSULTANT | Contracts & Grants | Position from contract |
| FACILITATOR   | FACILITATOR | Programs | Position from contract |
| ADHOC         | ADHOC_STAFF | Programs | Position from contract |

## Data Mapping

### From Applicant to User

| Applicant Field | User Field | Transformation |
|----------------|------------|----------------|
| name | first_name, last_name | Split by space |
| email | email | Direct |
| phone/mobile/contact | mobile_number | First available |
| gender | gender | Mapped to MALE/FEMALE/Other |
| location | location | Direct or from acceptance_country |
| state | state | Direct or from acceptance_city |
| address | address | Direct |
| position_under_contract | position | Direct or user_type as fallback |
| type | user_type | Direct |

## Required Fields for User Creation

**Minimum Required:**
- first_name ✓
- last_name ✓
- email ✓
- mobile_number ✓
- gender ✓
- department ✓
- position ✓

**Optional But Recommended:**
- location
- state
- address
- user_type
- roles

## Error Handling

### 1. Duplicate Email
- **Detection**: HTTP 400 with "email" and "exists" in message
- **Action**: Mark as `userExists: true`
- **User Message**: "Your existing user account is already active"

### 2. Missing Required Fields
- **Detection**: Validation error from API
- **Action**: Log error, continue with contract acceptance
- **User Message**: "Admin will create your account manually"

### 3. Network/API Errors
- **Detection**: Network timeout or 500 errors
- **Action**: Log error, continue with contract acceptance
- **User Message**: "Admin will create your account manually"

## Security Considerations

1. **No Password Creation**
   - System uses passwordless authentication or admin-set passwords
   - Users set password on first login or via email reset

2. **Email Verification**
   - Email must match applicant's verified email
   - Duplicate prevention ensures one account per email

3. **Audit Trail**
   - User creation is logged with:
     - Timestamp
     - Applicant ID
     - User type
     - Success/failure status

## Testing Checklist

### Manual Testing

- [ ] Consultant accepts contract → User created with type CONSULTANT
- [ ] Facilitator accepts contract → User created with type FACILITATOR
- [ ] Adhoc staff accepts contract → User created with type ADHOC_STAFF
- [ ] Accept contract with existing email → Shows "account already exists"
- [ ] Accept contract with missing phone → Handled gracefully
- [ ] User appears in Users page with correct type filter
- [ ] User appears in respective database (Consultant/Facilitator/Adhoc)

### Edge Cases

- [ ] Name with special characters (e.g., "O'Brien", "Marie-Claire")
- [ ] Single name (no space) → Both first_name and last_name set to same value
- [ ] Email already exists → Graceful handling, no duplicate
- [ ] Missing optional fields → User still created
- [ ] Network failure during user creation → Contract acceptance succeeds

## Future Enhancements

### 1. Role Assignment
- Auto-assign default role based on user type
- Example: "Consultant" role for CONSULTANT users

### 2. Welcome Email
- Send welcome email with login instructions
- Include password reset link

### 3. Onboarding Workflow
- Create onboarding tasks for new users
- Guide through profile completion

### 4. Bulk Import
- Admin interface to import historical applicants
- Create user accounts for all accepted applicants

### 5. Workforce Integration
- Extend to AHNI staff after onboarding completion
- Integration with HR onboarding system

## Admin Actions

### View Created Users
```
Navigate to: /dashboard/users
Filter by: User Type (Consultant/Facilitator/Adhoc Staff)
```

### Manually Create User for Failed Auto-Creation
1. Go to `/dashboard/users/create`
2. Fill in applicant details manually
3. Set user_type appropriately
4. Assign roles if needed

### Bulk Create Users
```typescript
// In browser console or admin panel
import { batchCreateUserAccounts } from '@/utils/createUserFromApplicant';

const acceptedApplicants = [...]; // Get from API
const result = await batchCreateUserAccounts(
    acceptedApplicants,
    "CONSULTANT"
);

console.log(`Created: ${result.created.length}`);
console.log(`Existing: ${result.existing.length}`);
console.log(`Failed: ${result.failed.length}`);
```

## Monitoring

### Logs to Watch

**Success:**
```
🔐 Creating user account for applicant: { name, email, userType }
📤 Sending user creation request: { userData }
✅ User account created successfully: { userId }
```

**Already Exists:**
```
ℹ️  User account already exists for this email
```

**Failure:**
```
❌ Failed to create user account: { error }
```

## Contact

For issues or questions about user account creation:
- Check logs in browser console (F12)
- Review error messages in toast notifications
- Contact system administrator for manual user creation

---

**Last Updated**: January 2025
**Version**: 1.0.0
