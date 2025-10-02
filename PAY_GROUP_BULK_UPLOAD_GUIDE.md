# Pay Group Bulk Upload Guide

## Overview

The Pay Group bulk upload feature allows you to create multiple pay group combinations at once by uploading an Excel or CSV file.

**What is a Pay Group?**
A Pay Group is a unique combination of:
- **Position** (e.g., Driver, Technical Officer, Admin Manager)
- **Grade** (e.g., grade 8, grade 9, grade 10)
- **Level** (e.g., step 1, step 2, step 3)

Each combination defines a compensation category used for employee salary structures.

---

## How to Use Bulk Upload

### Step 1: Access the Feature
1. Navigate to: http://localhost:3000/dashboard/hr/employee-benefit/pay-group
2. Click the **"Bulk Upload"** button (upload icon)

### Step 2: Download the Template
1. In the bulk upload modal, click **"Download Template"**
2. An Excel file (`PayGroup_Upload_Template.xlsx`) will download
3. The template contains:
   - **Pay Groups sheet** - Example data to be replaced
   - **Instructions sheet** - How to fill the template
   - **Available Values sheet** - All valid positions, grades, and levels from your system

### Step 3: Fill the Template

**Template Structure:**
```csv
Position,Grade,Level
Driver,grade 8,step 1
Technical Officer,grade 9,step 1
Admin Manager,grade 10,step 2
```

**Important Rules:**
- ✅ Use **exact names** - spelling and case must match
- ✅ Each row creates one pay group
- ✅ Delete example rows before adding your data
- ✅ Do not modify column headers
- ❌ Do not add extra columns
- ❌ Do not use commas within values
- ❌ Do not leave rows blank

**Example Valid Data:**
```csv
Position,Grade,Level
Driver,grade 8,step 1
Driver,grade 8,step 2
Driver,grade 9,step 1
Technical Officer,grade 8,step 1
Technical Officer,grade 9,step 1
Technical Officer,grade 10,step 1
Admin Manager,grade 9,step 2
Admin Manager,grade 10,step 2
MD,grade 11,step 2
STL,grade 9,step 1
Head HR,grade 10,step 2
```

### Step 4: Verify Values

**Before uploading, verify:**
1. Position names match exactly (check "Available Values" sheet)
2. Grade names match exactly (check "Available Values" sheet)
3. Level names match exactly (check "Available Values" sheet)

**Common Mistakes:**
- ❌ "Grade 8" instead of "grade 8" (wrong capitalization)
- ❌ "Step 1" instead of "step 1" (wrong capitalization)
- ❌ "Technical officer" instead of "Technical Officer" (wrong case)
- ❌ Extra spaces: "Driver " or " Driver"

### Step 5: Upload the File
1. Click **"Choose File"**
2. Select your filled Excel/CSV file
3. Wait for file to parse
4. You'll see: "File parsed successfully! X records found"
5. Review the preview (shows first 5 rows)
6. Click **"Upload X Pay Groups"**

### Step 6: Review Results
- ✅ Success message: "Successfully uploaded X pay groups!"
- ⚠️ Partial success: "X pay groups failed to upload"
- ❌ Check browser console for error details if any failures

---

## Template Format

### CSV Format
```csv
Position,Grade,Level
Driver,grade 8,step 1
Technical Officer,grade 9,step 1
```

### Excel Format
Same structure, but in Excel (.xlsx) format with multiple sheets:
- **Pay Groups** - Your data
- **Instructions** - How to fill
- **Available Values** - Reference data

---

## Error Handling

### Common Errors and Solutions

**Error: "Position 'XYZ' not found"**
- **Cause:** Position name doesn't exist or misspelled
- **Solution:** Check "Available Values" sheet for exact spelling

**Error: "Grade 'XYZ' not found"**
- **Cause:** Grade name doesn't exist or misspelled
- **Solution:** Verify grade names match exactly

**Error: "Level 'XYZ' not found"**
- **Cause:** Level name doesn't exist or misspelled
- **Solution:** Verify level names match exactly

**Error: "Failed to parse file"**
- **Cause:** Invalid file format or corrupted
- **Solution:** Re-download template and try again

**Duplicate Pay Groups**
- Pay groups must be unique (Position + Grade + Level)
- The system may reject duplicate combinations

---

## Best Practices

### 1. Plan Your Pay Groups
Before uploading, list all combinations you need:
```
Drivers: grade 8 (step 1, step 2), grade 9 (step 1)
Technical Officers: grade 8-10 (step 1 each)
Managers: grade 9-10 (step 2 each)
```

### 2. Start Small
- Upload 5-10 pay groups first to test
- Verify they appear correctly
- Then upload remaining pay groups

### 3. Keep a Master File
- Save your template with all pay groups
- Use it as reference for future updates
- Add comments/notes for documentation

### 4. Verify After Upload
- Check the pay groups list after upload
- Confirm all combinations are present
- Test creating compensation spread with new pay groups

---

## Example: Creating Pay Structure

**Scenario:** You want to create pay groups for your organization

**Step 1: Identify Positions**
- Driver
- Technical Officer
- Admin Manager
- STL
- Head HR
- MD

**Step 2: Define Grades per Position**
- Entry level: grade 8
- Mid level: grade 9
- Senior level: grade 10
- Executive: grade 11

**Step 3: Define Steps/Levels**
- step 1 (starting)
- step 2 (experienced)
- step 3 (advanced)

**Step 4: Create Combinations**
```csv
Position,Grade,Level
Driver,grade 8,step 1
Driver,grade 8,step 2
Driver,grade 9,step 1
Technical Officer,grade 8,step 1
Technical Officer,grade 9,step 1
Technical Officer,grade 10,step 1
Admin Manager,grade 9,step 2
Admin Manager,grade 10,step 2
STL,grade 9,step 1
STL,grade 10,step 1
Head HR,grade 10,step 2
Head HR,grade 11,step 1
MD,grade 11,step 2
```

**Result:** 13 pay groups created for your compensation structure

---

## Integration with Compensation System

### After Creating Pay Groups

**1. Link Compensations to Pay Groups**
- Navigate to: `/dashboard/hr/employee-benefit/compensation`
- Create compensations (Housing, Transport, etc.)
- Assign each compensation to a pay group

**2. Create Compensation Templates**
- Navigate to: `/dashboard/hr/employee-benefit/pay-group-compensation`
- Define complete compensation packages per pay group
- Set Basic, Housing, Transport, Meal, Miscellaneous, 13th Month

**3. Assign to Employees**
- Navigate to: `/dashboard/hr/employee-benefit/compensation-spread`
- Select employee
- Compensation auto-populates based on their pay group
- Adjust if needed and save

---

## Sample Data

### Typical Organization Structure

**Entry Level (Grade 8)**
```csv
Position,Grade,Level
Driver,grade 8,step 1
Driver,grade 8,step 2
Clerk,grade 8,step 1
Assistant,grade 8,step 1
```

**Mid Level (Grade 9)**
```csv
Position,Grade,Level
Technical Officer,grade 9,step 1
Technical Officer,grade 9,step 2
Admin Manager,grade 9,step 2
```

**Senior Level (Grade 10)**
```csv
Position,Grade,Level
Senior Technical Officer,grade 10,step 1
Head HR,grade 10,step 2
Department Manager,grade 10,step 2
```

**Executive Level (Grade 11)**
```csv
Position,Grade,Level
MD,grade 11,step 2
CEO,grade 11,step 3
Director,grade 11,step 2
```

---

## API Information (for backend developers)

### Endpoint
`POST /hr/employee-benefits/pay-groups/`

### Request Format
```json
{
  "position": "position-uuid",
  "grade": "grade-uuid",
  "level": "level-uuid"
}
```

### Bulk Upload Process
The frontend:
1. Parses Excel/CSV file
2. Looks up Position/Grade/Level IDs by name
3. Creates individual POST requests for each pay group
4. Reports success/failure counts

---

## Troubleshooting

### Upload button is disabled
- **Cause:** No file selected or file not parsed
- **Solution:** Choose a valid Excel/CSV file

### Preview shows wrong data
- **Cause:** Wrong sheet selected in Excel
- **Solution:** Ensure data is in first sheet

### All records fail to upload
- **Cause:** Position/Grade/Level names don't match
- **Solution:** Download fresh template to see current values

### Some records succeed, others fail
- **Cause:** Mix of valid and invalid names
- **Solution:** Check console for specific errors, fix those rows

---

## Support

**Need Help?**
- Check "Available Values" sheet in template
- Verify exact spelling and case
- Test with 1-2 records first
- Contact system administrator if positions/grades/levels are missing

---

**Generated:** 2025-10-02
**Version:** 1.0
**Feature:** Pay Group Bulk Upload
