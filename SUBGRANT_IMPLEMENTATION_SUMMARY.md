# SubGrant Implementation Summary

## ✅ Problem Solved

**Original Issue**: Frontend was confused about using two separate IDs (SubGrant ID and SubGrantAward ID) for managing awards, obligations, and expenditures.

**Solution**: Use **ONE ID** (SubGrant ID) throughout the entire lifecycle, with different UI views based on the subgrant's status.

---

## 🏗️ New Architecture

### Backend Reality (How it's actually built)
```
SubGrant Model (One ID: 997f8c48-a28a-4c8d-9da0-27969ffcf773)
├── status: DRAFT → PUBLISHED → AWARDED → ACTIVE → CLOSED
├── award_decision: OneToOne → SubGrantAward (has its own ID but rarely used)
├── obligations: ForeignKey → SubGrantObligation[] (references SubGrant ID)
├── expenditures: ForeignKey → SubGrantExpenditure[] (references SubGrant ID)
└── modifications: ForeignKey → SubGrantModification[] (references SubGrant ID)
```

**Key Point**: Obligations, Expenditures, and Modifications ALL reference `SubGrant.id`, NOT `SubGrantAward.id`

### Backend Endpoints
```
# All use SubGrant ID (997f8c48...)
GET    /contract-grants/sub-grants/997f8c48.../
GET    /contract-grants/sub-grants/997f8c48.../obligations/
POST   /contract-grants/sub-grants/997f8c48.../obligations/
GET    /contract-grants/sub-grants/997f8c48.../expenditures/
POST   /contract-grants/sub-grants/997f8c48.../expenditures/
GET    /contract-grants/sub-grants/997f8c48.../modifications/
POST   /contract-grants/sub-grants/997f8c48.../modifications/
```

---

## 📂 New Frontend Structure

### Routes Created/Updated

#### 1. **Advert/Application Phase**
**Route**: `/dashboard/c-and-g/sub-grant/[id]/details`

**Page**: `src/app/dashboard/c-and-g/sub-grant/[id]/details/page.tsx`

**Component**: `src/features/contracts-grants/components/sub-grant/details/index.tsx`

**Tabs**:
- Details
- Submissions
- Shortlisted Sub-Grantees
- Assessment Results

**When to Show**: When `status` is DRAFT, PUBLISHED, RECEIVING_SUBMISSIONS, UNDER_EVALUATION

---

#### 2. **Award Management Phase** ⭐ NEW
**Route**: `/dashboard/c-and-g/sub-grant/[id]/management`

**Page**: `src/app/dashboard/c-and-g/sub-grant/[id]/management/page.tsx`

**Component**: `src/features/contracts-grants/components/sub-grant/management/index.tsx`

**Tabs**:
- Award Details (new)
- Obligations
- Expenditure History
- Modifications

**When to Show**: When `status` is AWARDED or ACTIVE

---

### Components Created

#### 1. **SubGrantManagement** (Main Container)
**File**: `src/features/contracts-grants/components/sub-grant/management/index.tsx`

**Features**:
- Uses SubGrant ID from URL params
- Checks if subgrant is actually awarded
- Shows appropriate tabs for award management
- Passes SubGrant ID to all child components

#### 2. **AwardDetailsTab**
**File**: `src/features/contracts-grants/components/sub-grant/management/AwardDetailsTab.tsx`

**Displays**:
- Award Summary (title, status, award date, type)
- Award Amounts (USD & NGN)
- Awarded Organization details
- Award Justification
- Special Conditions
- Award Period

#### 3. **SubGrantObligationHistory**
**File**: `src/features/contracts-grants/components/sub-grant/management/SubGrantObligationHistory.tsx`

**Uses**: `useGetAllSubGrantObligations({ subGrantId })`

#### 4. **SubGrantExpenditureHistory**
**File**: `src/features/contracts-grants/components/sub-grant/management/SubGrantExpenditureHistory.tsx`

**Uses**: `useGetAllSubGrantExpenditures({ subGrantId })`

#### 5. **SubGrantModificationHistory**
**File**: `src/features/contracts-grants/components/sub-grant/management/SubGrantModificationHistory.tsx`

**Uses**: `useGetAllSubGrantModifications({ subGrantId })`

---

## 🔧 Controllers Fixed

### Updated Parameter Names (awardId → subGrantId)

#### 1. **subGrantExpenditureController.ts**
**Changed**:
- `BASE_URL`: `/contract-grants/sub-grant-awards/` → `/contract-grants/sub-grants/`
- All functions now accept `subGrantId` instead of `awardId`
- Endpoints now use `/sub-grants/{subGrantId}/expenditures/`

#### 2. **subGrantModificationController.ts**
**Changed**:
- `BASE_URL`: `/contract-grants/sub-grant-awards/` → `/contract-grants/sub-grants/`
- All functions now accept `subGrantId` instead of `awardId`
- Endpoints now use `/sub-grants/{subGrantId}/modifications/`

#### 3. **subGrantObligationController.ts**
**Status**: ✅ Already correct! Was using `subGrantId` from the start.

---

## 🎯 How It Works Now

### User Flow

1. **Creating Subgrant Advert**
   ```
   User creates → SubGrant created with ID: 997f8c48...
   Status: DRAFT
   URL: /sub-grant/997f8c48.../details
   View: Advert phase (Details, Submissions, etc.)
   ```

2. **Publishing & Receiving Applications**
   ```
   Same ID: 997f8c48...
   Status: PUBLISHED → RECEIVING_SUBMISSIONS
   Same URL: /sub-grant/997f8c48.../details
   Same View: Advert phase
   ```

3. **Evaluating & Awarding**
   ```
   Same ID: 997f8c48...
   Status: UNDER_EVALUATION → AWARDED
   A SubGrantAward record is created (with its own ID)
   BUT we still use SubGrant ID in frontend!
   ```

4. **Managing Awarded Subgrant**
   ```
   Same ID: 997f8c48...
   Status: AWARDED/ACTIVE
   NEW URL: /sub-grant/997f8c48.../management
   NEW View: Award management (Obligations, Expenditures, etc.)

   All API calls:
   - GET /sub-grants/997f8c48.../obligations/
   - GET /sub-grants/997f8c48.../expenditures/
   - GET /sub-grants/997f8c48.../modifications/
   ```

---

## 📊 Data Flow Example

```typescript
// Component: SubGrantManagement
const params = useParams();
const subGrantId = params?.id;  // 997f8c48-a28a-4c8d-9da0-27969ffcf773

// Fetch subgrant details
const { data } = useGetSingleSubGrant(subGrantId);
const subgrant = data?.data;
const awardDecision = subgrant?.award_decision;  // OneToOne relationship

// Fetch obligations (uses SubGrant ID, not Award ID!)
const { data: obligations } = useGetAllSubGrantObligations({ subGrantId });

// Fetch expenditures (uses SubGrant ID, not Award ID!)
const { data: expenditures } = useGetAllSubGrantExpenditures({ subGrantId });

// Fetch modifications (uses SubGrant ID, not Award ID!)
const { data: modifications } = useGetAllSubGrantModifications({ subGrantId });
```

---

## ✨ Key Benefits

### 1. **Single Source of Truth**
- ONE ID throughout entire lifecycle
- No confusion about which ID to use
- Simpler mental model for developers

### 2. **Matches Backend Implementation**
- Frontend now correctly uses SubGrant ID
- API endpoints match backend design
- No unnecessary Award ID lookups

### 3. **Clear Separation of Concerns**
- **Advert View** (`/details`): For creating and evaluating
- **Management View** (`/management`): For managing awarded grants

### 4. **Easy Status-Based Routing**
```typescript
// In navigation or routing logic
const route = subgrant.status === 'AWARDED' || subgrant.status === 'ACTIVE'
  ? `/sub-grant/${subgrant.id}/management`
  : `/sub-grant/${subgrant.id}/details`;
```

---

## 🚀 Next Steps

### 1. Update Navigation Components
Update any navigation/sidebar components to route to the correct view based on status:

```typescript
// Example: SubGrantListItem
<Link to={
  subgrant.status === 'AWARDED' || subgrant.status === 'ACTIVE'
    ? `/sub-grant/${subgrant.id}/management`
    : `/sub-grant/${subgrant.id}/details`
}>
  {subgrant.title}
  <Badge>{subgrant.status}</Badge>
</Link>
```

### 2. Update Dialog Components
Ensure dialogs (Add Obligation, Add Expenditure, etc.) use `subGrantId`:

```typescript
// In dialog component
const { subGrantId } = dialogProps;
const { createObligation } = useCreateSubGrantObligation(subGrantId);
```

### 3. Test the Flow
1. Create a subgrant → View at `/details`
2. Publish it → Still at `/details`
3. Award it → Navigate to `/management`
4. Add obligations → Should work with SubGrant ID
5. Add expenditures → Should work with SubGrant ID

### 4. Remove Old Sub-Grant-Award Routes
The old `/sub-grant-award/[id]/details` route can be deprecated since we now use `/sub-grant/[id]/management`.

---

## 📝 Important Notes

### SubGrantAward ID Exists But Rarely Used
- SubGrantAward has its own ID (stored in database)
- It's accessible via `subgrant.award_decision.id`
- **BUT**: We don't use it in URLs or API calls
- It's only for internal database relationships

### Why Not Use Award ID?
Because the backend relationships are designed this way:
```python
# Backend models
class SubGrantObligation:
    sub_grant = ForeignKey(SubGrant)  # ← References SubGrant, not SubGrantAward!

class SubGrantExpenditure:
    sub_grant = ForeignKey(SubGrant)  # ← References SubGrant, not SubGrantAward!
```

### Status Field is King
The `status` field determines:
- Which view to show (details vs management)
- What actions are available
- Where to navigate the user

---

## 🎉 Summary

**Before**:
- ❌ Confusion about SubGrant ID vs Award ID
- ❌ Controllers using wrong endpoints (`/sub-grant-awards/`)
- ❌ Trying to fetch Award ID then use it for obligations
- ❌ Mixed routing logic

**After**:
- ✅ ONE ID (SubGrant ID) used everywhere
- ✅ Controllers fixed to use correct endpoints (`/sub-grants/`)
- ✅ Direct API calls with SubGrant ID
- ✅ Clear routing: `/details` for advert, `/management` for awarded grants
- ✅ Matches backend implementation perfectly

**The frontend now correctly reflects the backend architecture!** 🎊
