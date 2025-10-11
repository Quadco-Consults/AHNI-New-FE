# Frontend-Backend Integration Guide

## Overview

This document shows how the frontend hierarchical category implementation integrates with the backend API.

## System Status

✅ **Backend:** Fully implemented with parent field, validation, and filtering
✅ **Frontend:** Fully implemented with cascading dropdowns
✅ **Build:** Passing successfully
✅ **Ready:** System is ready to use once categories are seeded

## API Integration

### 1. Category API Endpoint

**Backend Endpoint:** `/modules/config/category/`

**Frontend Controller:** `/src/features/modules/controllers/config/categoryController.ts`

The frontend already uses this endpoint through the `useGetAllCategories` hook:

```typescript
const { data: categories } = useGetAllCategories({
  page: 1,
  size: 1000, // Get all categories for filtering
  search: "",
});
```

### 2. Backend Filtering Support

The backend supports these query parameters (as documented):

```typescript
// Get top-level GOODS categories
GET /modules/config/category/?job_category=GOODS&parent=null

// Get children of Assets category
GET /modules/config/category/?parent=<assets-uuid>

// Search categories
GET /modules/config/category/?search=vehicle
```

The frontend doesn't use these filters yet (it fetches all and filters client-side), but you can optimize by adding:

```typescript
// Optional optimization: Fetch only needed categories
const { data: parentCategories } = useGetAllCategories({
  page: 1,
  size: 100,
  job_category: selectedItemType,
  parent: "null", // Top-level only
});
```

### 3. Data Flow

```
User Action → Frontend State → API Request → Backend Validation → Database
    ↓
Frontend receives response ← API Response ← Backend Serializer ← Database
```

#### Example: Creating an Asset with Category

**Step 1:** User selects cascading categories
- Item Type: `GOODS`
- Parent Category: `Assets` (UUID: `abc-123`)
- Final Category: `Vehicles` (UUID: `xyz-789`)

**Step 2:** Frontend stores final category ID
```typescript
form.setValue("category", "xyz-789"); // Vehicles UUID
```

**Step 3:** Form submits to item endpoint
```typescript
POST /config/item/
{
  "name": "Toyota Hilux",
  "description": "Project vehicle",
  "uom": "Unit",
  "category": "xyz-789" // References Vehicles category
}
```

**Step 4:** Backend validates and saves
- Checks that category `xyz-789` exists
- Saves item with category reference
- Returns created item

## Category Structure

### Backend Relationships

```python
# Category Model
class Category(models.Model):
    name = models.CharField(max_length=255)
    job_category = models.CharField(choices=[...])  # GOODS, SERVICE, WORK
    parent = models.ForeignKey('self', null=True, on_delete=models.PROTECT)
    # ... other fields

# Item Model
class Item(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    # ... other fields
```

### Frontend Structure

```typescript
interface CategoryData {
  id: string;
  name: string;
  job_category: "GOODS" | "SERVICE" | "WORK" | "OTHERS";
  parent?: string | CategoryData | null; // Flexible to handle both formats
  children?: CategoryData[];
}
```

## Compatibility Matrix

| Backend Field | Frontend Field | Type | Notes |
|--------------|----------------|------|-------|
| `id` | `id` | UUID string | ✅ Matches |
| `name` | `name` | string | ✅ Matches |
| `job_category` | `job_category` | ENUM | ✅ Matches |
| `parent` | `parent` | UUID/object/null | ✅ Frontend handles both |
| `code` | `code` | string | ✅ Matches |
| `serial_number` | `serial_number` | number | ✅ Matches |
| `description` | `description` | string | ✅ Matches |
| `children` (computed) | `children` | array | ✅ Frontend can use if provided |

## Testing the Integration

### 1. Seed Categories (Backend)

```bash
# Run the seeding script
python seed_categories.py
```

This creates:
```
GOODS
  ├─ Assets
  │  ├─ Vehicles
  │  ├─ IT Equipment
  │  ├─ Machines
  │  └─ Buildings
  └─ Consumables
     ├─ Medical Consumables
     ├─ IT Consumables
     └─ Office Consumables
```

### 2. Test Frontend Dropdowns

**Navigate to:** `/dashboard/admin/assets/create`

**Expected Behavior:**

1. **Item Type Dropdown**
   - Shows: Goods, Service, Work, Others
   - Parent Category: Disabled (grey)
   - Category: Disabled (grey)

2. **After selecting "Goods"**
   - Parent Category: Enabled, shows "Assets" and "Consumables"
   - Category: Still disabled

3. **After selecting "Assets"**
   - Category: Enabled, shows "Vehicles", "IT Equipment", "Machines", "Buildings"

4. **Select "Vehicles"**
   - Form is ready to submit
   - Category field contains Vehicles UUID

### 3. Verify API Calls

Open browser DevTools → Network tab:

```
# Initial load - fetches all categories
GET /modules/config/category/?page=1&size=1000&search=

Response:
{
  "status": "success",
  "data": {
    "results": [
      {
        "id": "uuid-1",
        "name": "Assets",
        "job_category": "GOODS",
        "parent": null
      },
      {
        "id": "uuid-2",
        "name": "Vehicles",
        "job_category": "GOODS",
        "parent": "uuid-1"  // or { "id": "uuid-1", "name": "Assets" }
      },
      // ... more categories
    ]
  }
}
```

### 4. Create an Asset

Fill in the form and submit:

```
# Form submission
POST /config/item/
{
  "name": "Toyota Hilux",
  "description": "Project vehicle",
  "uom": "Unit",
  "category": "uuid-2", // Vehicles category
  "asset_type": "...",
  // ... other fields
}

Response:
{
  "status": "success",
  "data": {
    "id": "item-uuid",
    "name": "Toyota Hilux",
    "category": {
      "id": "uuid-2",
      "name": "Vehicles",
      "job_category": "GOODS",
      "parent": {
        "id": "uuid-1",
        "name": "Assets"
      }
    }
  }
}
```

## Error Handling

### Frontend Validation

```typescript
// Form validation (Zod schema)
category: z.string().min(1, "Please select a Category")

// User sees error if:
// - Item Type not selected → "Please select Item Type first"
// - Parent Category not selected → "Please select Parent Category first"
// - Category not selected → Form validation error
```

### Backend Validation

```python
# Circular reference validation
if parent == self:
    raise ValidationError("Category cannot be its own parent")

# Nested circular reference check
# Frontend won't trigger this since it only shows valid options
```

### Network Errors

```typescript
// Frontend handles API errors
try {
  await createItem(data);
  router.push(AdminRoutes.ASSETS);
} catch (error: any) {
  toast.error(error?.data?.message ?? "Something went wrong");
}
```

## Performance Considerations

### Current Implementation (Client-Side Filtering)

```typescript
// Fetches all categories once
const { data: categories } = useGetAllCategories({
  page: 1,
  size: 1000,
  search: "",
});

// Filters in browser
const filtered = getCategoriesByTypeAndParent(
  categories.data.results,
  selectedItemType,
  selectedParentCategory
);
```

**Pros:**
- Fast dropdown updates (no network delay)
- Works offline once loaded
- Simple implementation

**Cons:**
- Loads all categories upfront
- Uses more memory

### Optional Optimization (Server-Side Filtering)

If you have many categories (1000+), you can optimize:

```typescript
// Fetch only what's needed
const { data: parentCategories } = useGetAllCategories({
  page: 1,
  size: 100,
  job_category: selectedItemType,
  parent: "null",
});

const { data: childCategories } = useGetAllCategories({
  page: 1,
  size: 100,
  parent: selectedParentCategory,
});
```

**Pros:**
- Lower memory usage
- Faster initial load
- Scales better with large datasets

**Cons:**
- Network delay on each dropdown change
- More complex code
- Requires backend filtering support (✅ already implemented!)

## Troubleshooting

### Issue: Dropdowns are empty

**Check:**
1. Are categories seeded in the database?
   ```bash
   python manage.py shell
   >>> from apps.config.models import Category
   >>> Category.objects.all().count()
   ```

2. Does the API return categories?
   ```bash
   curl http://localhost:8000/modules/config/category/?page=1&size=20
   ```

3. Check browser console for errors

### Issue: Parent dropdown shows wrong categories

**Check:**
1. Verify `job_category` matches:
   ```typescript
   console.log('Selected Item Type:', selectedItemType);
   console.log('Categories:', categories?.data?.results);
   console.log('Filtered:', parentCategoryOptions);
   ```

2. Ensure parent categories have `parent: null`

### Issue: Category dropdown shows wrong categories

**Check:**
1. Verify parent selection:
   ```typescript
   console.log('Selected Parent:', selectedParentCategory);
   ```

2. Check category `parent` field:
   ```typescript
   console.log('Child Categories:',
     categories?.data?.results.filter(c =>
       c.parent === selectedParentCategory ||
       c.parent?.id === selectedParentCategory
     )
   );
   ```

### Issue: Form submission fails

**Check:**
1. Network tab → Request payload
2. Backend logs → Validation errors
3. Ensure category UUID is valid:
   ```bash
   Category.objects.filter(id='<uuid>').exists()
   ```

## Migration from Old System

If you have existing items with categories:

### Scenario 1: Old categories are top-level (no parent)

✅ **No changes needed** - Items continue to work

Example:
```
Old: Item → Category: "Vehicles"
New: Item → Category: "Vehicles" (parent: "Assets")
```

The item still references "Vehicles" category, which now has a parent.

### Scenario 2: Need to reorganize categories

**Backend task:** Update category parent relationships

```python
# In Django shell
vehicles = Category.objects.get(name='Vehicles')
assets = Category.objects.get(name='Assets')

vehicles.parent = assets
vehicles.save()
```

✅ **Items don't need updates** - They still reference the same category UUID

## Summary

### What's Working

✅ Backend has `parent` field and validation
✅ Frontend has cascading dropdowns
✅ API integration is compatible
✅ Build is passing
✅ Error handling is in place

### What's Needed

1. **Seed categories** using the provided script
2. **Test the flow** in the UI
3. **Optionally optimize** with server-side filtering

### Quick Start

```bash
# 1. Backend - Seed categories
python seed_categories.py

# 2. Frontend - Start dev server
npm run dev

# 3. Navigate to asset creation
http://localhost:3000/dashboard/admin/assets/create

# 4. Test cascading dropdowns
Select: Goods → Assets → Vehicles
```

The system is **ready to use**! 🎉

---

**Last Updated:** 2025-10-11
**Status:** ✅ Integration Complete
