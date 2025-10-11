# Hierarchical Category System Implementation

## Overview

This document describes the implementation of the hierarchical category system that allows items to be organized in a structured manner: **Item Type → Parent Category → Child Category**.

## System Architecture

### Three-Level Hierarchy

```
Item Type (job_category)
└─> Parent Category (category with no parent)
    └─> Child Category (category with parent)
```

### Example Structure

```
GOODS (job_category)
├─ Assets (parent category)
│  ├─ Vehicles (child category)
│  ├─ IT Equipment (child category)
│  ├─ Machines (child category)
│  └─ Buildings (child category)
└─ Consumables (parent category)
   ├─ Medical Consumables (child category)
   ├─ IT Consumables (child category)
   └─ Office Consumables (child category)

SERVICE (job_category)
├─ HMO (parent category)
├─ Lease (parent category)
└─ Other Services (parent category)

WORK (job_category)
└─ ... (similar structure)
```

## Database Schema Changes

### Category Model

The category model now includes a `parent` field for hierarchical relationships:

```typescript
interface CategoryData {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  job_category: "GOODS" | "SERVICE" | "WORK" | "OTHERS"; // Item type
  code: string;
  serial_number: any;
  parent?: string | CategoryData | null; // Parent category ID or object
  children?: CategoryData[]; // Child categories (populated by backend)
}
```

### Backend Requirements

The backend API should:

1. **Accept `parent` field** when creating/updating categories
2. **Return parent data** - Either as nested object or just ID (frontend handles both)
3. **Support filtering by `job_category`** - To get categories of specific type
4. **Support filtering by `parent`** - To get child categories of a specific parent
5. **Prevent circular references** - A category cannot be its own parent or ancestor

## API Endpoints

### Category Endpoints

#### GET `/config/category/`
**Query Parameters:**
- `page` (number): Page number for pagination
- `size` (number): Number of results per page
- `search` (string): Search term for filtering
- `job_category` (optional): Filter by item type (GOODS, SERVICE, WORK, OTHERS)
- `parent` (optional): Filter by parent category ID (use `null` for top-level)

**Response:**
```json
{
  "status": "success",
  "data": {
    "results": [
      {
        "id": "uuid-1",
        "name": "Assets",
        "description": "Asset category",
        "job_category": "GOODS",
        "code": "AST",
        "serial_number": 1,
        "parent": null,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      },
      {
        "id": "uuid-2",
        "name": "Vehicles",
        "description": "Vehicle assets",
        "job_category": "GOODS",
        "code": "VEH",
        "serial_number": 2,
        "parent": "uuid-1", // Can also be nested object
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "count": 10,
      "page": 1,
      "page_size": 20
    }
  }
}
```

#### POST `/config/category/`
**Request Body:**
```json
{
  "name": "Vehicles",
  "description": "Vehicle assets",
  "job_category": "GOODS",
  "code": "VEH",
  "serial_number": 2,
  "parent": "uuid-of-assets-category" // Optional - omit for top-level
}
```

#### PATCH `/config/category/{id}/`
**Request Body:** Same as POST

## Frontend Implementation

### File Structure

```
src/
├── utils/
│   └── categoryHelpers.ts          # Helper functions for category hierarchy
├── features/
│   ├── admin/
│   │   ├── types/
│   │   │   └── config/
│   │   │       └── category.ts     # Category type definitions
│   │   └── components/
│   │       ├── config/
│   │       │   └── AddCategories.tsx  # Category form with parent selection
│   │       ├── assets/
│   │       │   └── create.tsx      # Asset form with cascading dropdowns
│   │       └── inventory-management/
│   │           └── consumable/
│   │               └── create.tsx  # Consumable form with cascading dropdowns
│   └── modules/
│       ├── types/
│       │   └── config/
│       │       └── index.ts        # Updated CategoryData interface
│       └── controllers/
│           └── config/
│               └── categoryController.ts  # API hooks
```

### Key Components

#### 1. Category Helper Functions (`utils/categoryHelpers.ts`)

```typescript
// Filter categories by item type
filterCategoriesByType(categories, itemType)

// Get top-level categories (no parent)
getTopLevelCategories(categories)

// Get child categories of a parent
getChildCategories(categories, parentId)

// Get categories by type and parent (for cascading)
getCategoriesByTypeAndParent(categories, itemType, parentId?)

// Build dropdown options
buildCategoryOptions(categories)

// Get full hierarchy path
getCategoryPath(category, allCategories) // Returns "GOODS > Assets > Vehicles"
```

#### 2. Category Form (`AddCategories.tsx`)

Features:
- Job category selection (GOODS/SERVICE/WORK/OTHERS)
- Parent category dropdown (filtered by job category)
- Prevents circular references (cannot select self as parent)
- Only shows top-level categories as parent options

#### 3. Asset/Consumable Forms

Features:
- **Step 1:** Select Item Type (GOODS/SERVICE/WORK/OTHERS)
- **Step 2:** Select Parent Category (Assets, Consumables, etc.)
- **Step 3:** Select Final Category (Vehicles, IT Equipment, etc.)
- Cascading dropdowns - each step enables the next
- Clear visual feedback with placeholder text

### Usage Example

```typescript
// In asset/consumable create form
const [selectedItemType, setSelectedItemType] = useState("");
const [selectedParentCategory, setSelectedParentCategory] = useState("");

// Fetch all categories
const { data: categories } = useGetAllCategories({
  page: 1,
  size: 1000,
  search: "",
});

// Build parent category options
const parentCategoryOptions = useMemo(() => {
  if (!categories?.data?.results || !selectedItemType) return [];

  const topLevelCategories = getCategoriesByTypeAndParent(
    categories.data.results,
    selectedItemType
  );

  return buildCategoryOptions(topLevelCategories);
}, [categories, selectedItemType]);

// Build final category options
const finalCategoryOptions = useMemo(() => {
  if (!categories?.data?.results || !selectedItemType) return [];

  const childCategories = getCategoriesByTypeAndParent(
    categories.data.results,
    selectedItemType,
    selectedParentCategory || undefined
  );

  return buildCategoryOptions(childCategories);
}, [categories, selectedItemType, selectedParentCategory]);
```

## User Flow

### Creating a Category

1. Navigate to Categories page
2. Click "Add Category"
3. Fill in:
   - Name (e.g., "Vehicles")
   - Description
   - Code (e.g., "VEH")
   - Serial Number
   - Job Category (e.g., "GOODS")
   - Parent Category (optional, e.g., "Assets")
4. Submit

### Creating an Asset/Consumable

1. Navigate to Assets or Consumables page
2. Click "Create"
3. Fill in item details
4. **Category Selection:**
   - Select Item Type (e.g., "Goods")
   - Select Parent Category (e.g., "Assets")
   - Select Category (e.g., "Vehicles")
5. Submit

## Data Flow

```
User selects Item Type
    ↓
Frontend filters categories by job_category
    ↓
User selects Parent Category
    ↓
Frontend filters categories by parent ID
    ↓
User selects Final Category
    ↓
Form submits with category ID to backend
```

## Backend Setup Checklist

### Required Changes

- [ ] Add `parent` field to Category model (ForeignKey to self, null=True, blank=True)
- [ ] Add `parent` to Category serializer (read and write)
- [ ] Update Category API to accept `parent` in POST/PATCH
- [ ] Add filtering by `parent` query parameter
- [ ] Add validation to prevent circular references
- [ ] Ensure existing categories can be migrated (set parent=null for existing)

### Optional Enhancements

- [ ] Add `children` property to serializer (list of child categories)
- [ ] Add endpoint to get category tree (nested structure)
- [ ] Add validation to ensure parent has same job_category
- [ ] Add soft delete to prevent breaking references

### Database Migration Example

```python
# Django migration example
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('config', 'previous_migration'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='parent',
            field=models.ForeignKey(
                null=True,
                blank=True,
                on_delete=models.PROTECT,  # Prevent deleting parent with children
                related_name='children',
                to='config.category'
            ),
        ),
    ]
```

### Validation Example

```python
# Django model example
class Category(models.Model):
    name = models.CharField(max_length=255)
    job_category = models.CharField(
        max_length=20,
        choices=[
            ('GOODS', 'Goods'),
            ('SERVICE', 'Service'),
            ('WORK', 'Work'),
            ('OTHERS', 'Others'),
        ]
    )
    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name='children'
    )

    def clean(self):
        # Prevent circular reference
        if self.parent:
            if self.parent == self:
                raise ValidationError("Category cannot be its own parent")

            # Check if parent is a descendant
            current = self.parent
            while current:
                if current == self:
                    raise ValidationError("Circular reference detected")
                current = current.parent

            # Ensure parent has same job_category
            if self.parent.job_category != self.job_category:
                raise ValidationError("Parent must have the same job category")
```

## Testing

### Test Cases

1. **Create top-level category** (no parent)
   - GOODS → Assets (no parent)
   - Verify saved with parent=null

2. **Create child category**
   - GOODS → Assets → Vehicles (parent: Assets)
   - Verify saved with correct parent reference

3. **Cascading selection**
   - Select Item Type: GOODS
   - Verify parent dropdown shows only GOODS top-level categories
   - Select Parent: Assets
   - Verify final dropdown shows only Assets children

4. **Form validation**
   - Try submitting without Item Type → Should fail
   - Try submitting without Parent Category → Should fail
   - Try submitting without Final Category → Should fail

5. **Edit existing category**
   - Load category with parent
   - Verify parent is pre-selected
   - Change parent
   - Verify saved correctly

## Migration Guide

### For Existing Categories

If you have existing categories without hierarchy:

1. **Identify top-level categories** (Assets, Consumables, etc.)
   - These should have `parent = null`

2. **Identify child categories** (Vehicles, IT Equipment, etc.)
   - Update these to reference their parent

3. **SQL Example:**
```sql
-- Set parent for Vehicles category
UPDATE config_category
SET parent_id = (SELECT id FROM config_category WHERE name = 'Assets')
WHERE name = 'Vehicles';
```

### For Existing Items

Existing items should continue to work as they reference the final category (e.g., Vehicles) directly. No changes needed to item records.

## Troubleshooting

### Common Issues

**Issue:** Parent dropdown is empty
- **Cause:** No top-level categories exist for selected item type
- **Solution:** Create top-level category first (without parent)

**Issue:** Final category dropdown is empty
- **Cause:** No child categories exist for selected parent
- **Solution:** Create child category with parent reference

**Issue:** Cannot save category with parent
- **Cause:** Backend doesn't accept parent field
- **Solution:** Ensure backend migration is applied and serializer includes parent

**Issue:** Circular reference error
- **Cause:** Trying to set a category's child as its parent
- **Solution:** Backend validation should prevent this

## Future Enhancements

1. **Multi-level hierarchy** - Support more than 2 levels (grandparent → parent → child → grandchild)
2. **Drag-and-drop reordering** - Visual category tree management
3. **Bulk import** - Import category hierarchy from CSV/Excel
4. **Category templates** - Pre-defined category structures
5. **Category tree view** - Visual representation of entire hierarchy
6. **Category path display** - Show full path in item listings (GOODS > Assets > Vehicles)

## Support

For questions or issues with the hierarchical category system:
1. Check this documentation first
2. Review the helper functions in `utils/categoryHelpers.ts`
3. Examine example usage in `assets/create.tsx` or `consumable/create.tsx`
4. Contact the development team

---

**Last Updated:** 2025-10-11
**Version:** 1.0.0
**Author:** Claude Code
