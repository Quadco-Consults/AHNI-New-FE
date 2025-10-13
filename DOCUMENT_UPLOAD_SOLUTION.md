# Document Upload Solution

## Current State

The agreement creation flow (`create-refactored.tsx`) is a **3-step wizard**:
1. Step 1: Select Agreement Type
2. Step 2: Enter Details
3. Step 3: Review & Create Agreement → **Redirects immediately to agreements list**

**Problem**: No opportunity to upload documents during creation!

## Solution Options

### Option A: Add 4th Step - Upload Documents (RECOMMENDED)
**Pros:**
- Keeps the wizard flow consistent
- User completes everything in one session
- Documents are uploaded immediately after agreement creation
- Better UX - user doesn't need to navigate elsewhere

**Cons:**
- Need to modify the create-refactored.tsx file
- Slightly longer wizard

### Option B: Use Separate Uploads Page
**Pros:**
- Uploads page already exists
- Separation of concerns

**Cons:**
- Extra navigation step
- sessionStorage complexity
- User might skip uploads

### Option C: Upload on View Page (CURRENT WORKAROUND)
**Pros:**
- Already implemented
- Works for existing agreements

**Cons:**
- Backend GET /documents/ returns empty array
- Requires workaround with local state

## Recommended: Option A - Add 4th Step

### Implementation Plan

1. **Modify Steps Array**:
   ```typescript
   const steps = ["Agreement Type", "Details", "Review", "Upload Documents"];
   ```

2. **After Agreement Creation Success**:
   - Don't redirect immediately
   - Store created agreement ID
   - Move to Step 4

3. **Step 4 - Upload Documents**:
   - File upload interface
   - Document type selection
   - Upload to `/agreements/{id}/documents/`
   - Show uploaded documents list
   - "Finish" button → Redirect to agreements list

4. **Allow Skip**:
   - "Skip & Finish" button for users who want to add documents later

Would you like me to implement Option A?

