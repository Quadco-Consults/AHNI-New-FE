# Pay Group Bulk Upload - Quick Start Guide

## 🚀 In 5 Steps

### 1. Go to Pay Groups Page
```
http://localhost:3000/dashboard/hr/employee-benefit/pay-group
```

### 2. Click "Bulk Upload"
Look for the upload icon button next to "Add New"

### 3. Download Template
Click "Download Template" - gets you an Excel file with:
- Examples
- Instructions
- Valid values (positions, grades, levels)

### 4. Fill Template
```csv
Position,Grade,Level
Driver,grade 8,step 1
Technical Officer,grade 9,step 1
Admin Manager,grade 10,step 2
```

**Rules:**
- ✅ Use exact names (check "Available Values" sheet)
- ✅ Delete example rows
- ❌ Don't modify headers
- ❌ No typos (case-sensitive!)

### 5. Upload & Done!
- Choose your file
- Preview shows
- Click "Upload X Pay Groups"
- ✅ Success!

---

## 📋 Template Format

### Minimum Example:
```csv
Position,Grade,Level
Driver,grade 8,step 1
```

### Full Example:
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
Head HR,grade 10,step 2
MD,grade 11,step 2
```

---

## ⚠️ Common Mistakes

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| Grade 8 | grade 8 |
| Step 1 | step 1 |
| technical officer | Technical Officer |
| "Driver " (extra space) | Driver |

---

## 🆘 Quick Troubleshooting

**Problem:** Upload button disabled
- **Fix:** Select a file first

**Problem:** "Position 'XYZ' not found"
- **Fix:** Check spelling in "Available Values" sheet

**Problem:** "Some records failed"
- **Fix:** Check browser console for details

**Problem:** File won't parse
- **Fix:** Re-download template and try again

---

## 💡 Pro Tips

1. **Test First:** Upload 2-3 pay groups to verify
2. **Check Values:** Always look at "Available Values" sheet
3. **Keep Master:** Save your template for future reference
4. **Verify After:** Check pay groups list after upload

---

## 📞 Need More Help?

See full documentation:
- `PAY_GROUP_BULK_UPLOAD_GUIDE.md` - Complete guide
- `PAYGROUP_BULK_UPLOAD_SUMMARY.md` - Technical details

---

**Quick Access:** http://localhost:3000/dashboard/hr/employee-benefit/pay-group → "Bulk Upload"
