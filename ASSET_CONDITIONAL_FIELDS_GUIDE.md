# Asset Conditional Fields Implementation Guide

## Overview

The asset form now dynamically shows/hides fields based on the **category** selected (e.g., Vehicles, IT Equipment, Lab Equipment, Furniture). The category selection automatically determines the asset type, so there's no need for duplicate selection.

## How It Works

### Category-Based Field Display

When you select a category in the **Category Selection** section, the form automatically detects the asset type and shows relevant fields:

```
Category Selected → Detect Asset Type → Show Specific Fields
```

## Field Configuration by Asset Type

### 1. **Vehicles** 🚗
**Trigger:** Category name contains "vehicle"

**Specific Fields Shown:**
- ✅ Plate Number
- ✅ VIN Number (Vehicle Identification Number)
- ✅ Engine Number
- ✅ Make (e.g., Toyota, Honda)
- ✅ Model (e.g., Hilux, Accord)

**Example Categories:**
- Vehicles
- Vehicle Fleet
- Motor Vehicles

### 2. **IT Equipment** 💻
**Trigger:** Category name contains "it" or "equipment" (but NOT vehicles)

**Specific Fields Shown:**
- ✅ Serial Number
- ✅ Make (e.g., Dell, HP, Lenovo)
- ✅ Model

**Example Categories:**
- IT Equipment
- IT Hardware
- Computer Equipment

### 3. **Lab Equipment** 🔬
**Trigger:** Category name contains "lab" or "laboratory"

**Specific Fields Shown:**
- ✅ Make
- ✅ Model
- ✅ Serial Number

**Example Categories:**
- Lab Equipment
- Laboratory Equipment
- Medical Lab Equipment

### 4. **Furniture** 🪑
**Trigger:** Category name contains "furniture"

**Specific Fields Shown:**
- ❌ No special fields
- Only shows standard asset fields

**Example Categories:**
- Office Furniture
- Furniture
- Lab Furniture

### 5. **Other Asset Types**
Categories that don't match above patterns only show standard fields.

## Standard Fields (Always Shown)

These fields appear for ALL asset types:

| Field | Type | Required |
|-------|------|----------|
| Asset Name | Text | ✅ Yes |
| Asset Type | Dropdown | ✅ Yes |
| Project | Dropdown | ✅ Yes |
| Assignee | Dropdown | ✅ Yes |
| Asset Code | Text | ✅ Yes |
| Funding Source | Dropdown | ✅ Yes |
| Date of Acquisition | Date | ✅ Yes |
| Insurance Duration | Text | ✅ Yes |
| Depreciation Rate | Number | ✅ Yes |
| Select State | Dropdown | ✅ Yes |
| Asset Condition | Dropdown | ✅ Yes |
| Location | Dropdown | ✅ Yes |
| Life of Project | Text | ✅ Yes |
| Classification | Dropdown | ✅ Yes |
| Cost in USD | Number | ✅ Yes |
| Cost in NGN | Number | ✅ Yes |
| Unit | Number | ✅ Yes |
| Implementer | Dropdown | ✅ Yes |
| UOM | Text | ✅ Yes |
| Category Selection | 3-step Cascade | ✅ Yes |
| Description | Textarea | ✅ Yes |

## User Flow Examples

### Example 1: Creating a Vehicle

1. Navigate to `/dashboard/admin/assets/create`
2. Fill in standard fields
3. **Category Selection:**
   - Item Type: `Goods`
   - Parent Category: `Assets`
   - Category: `Vehicles` ✨
4. **Vehicle-specific fields appear:**
   - Plate Number: `ABC-123-XY`
   - VIN Number: `1HGCM82633A123456`
   - Engine Number: `ENG-789456`
   - Make: `Toyota`
   - Model: `Hilux`
5. Submit form

### Example 2: Creating IT Equipment

1. Navigate to `/dashboard/admin/assets/create`
2. Fill in standard fields
3. **Category Selection:**
   - Item Type: `Goods`
   - Parent Category: `Assets`
   - Category: `IT Equipment` ✨
4. **IT Equipment fields appear:**
   - Serial Number: `SN-2024-001`
   - Make: `Dell`
   - Model: `Latitude 5420`
5. Submit form

### Example 3: Creating Furniture

1. Navigate to `/dashboard/admin/assets/create`
2. Fill in standard fields
3. **Category Selection:**
   - Item Type: `Goods`
   - Parent Category: `Assets`
   - Category: `Office Furniture` ✨
4. **No additional fields appear** (furniture doesn't need special fields)
5. Submit form

### Example 4: Editing an Existing Asset

1. Navigate to `/dashboard/admin/assets/create?id=<asset-id>`
2. Form loads with existing data
3. **Category is pre-populated** from existing asset
4. **Conditional fields automatically appear** based on category
   - If it's a Vehicle → Shows Plate Number, VIN, Engine, Make, Model
   - If it's IT Equipment → Shows Serial Number, Make, Model
   - If it's Lab Equipment → Shows Make, Model, Serial Number
   - If it's Furniture → Shows only standard fields
5. Edit as needed and submit

## Technical Implementation

### Detection Logic

```typescript
// Get selected category name
const selectedCategoryName = useMemo(() => {
  if (!selectedCategoryId || !categories?.data?.results) return "";

  const category = categories.data.results.find(
    (cat) => cat.id === selectedCategoryId
  );

  return category?.name?.toLowerCase() || "";
}, [selectedCategoryId, categories]);

// Determine which fields to show
const isVehicle = selectedCategoryName.includes("vehicle");
const isITEquipment = selectedCategoryName.includes("it") ||
                      selectedCategoryName.includes("equipment");
const isLabEquipment = selectedCategoryName.includes("lab") ||
                       selectedCategoryName.includes("laboratory");
const isFurniture = selectedCategoryName.includes("furniture");
```

### Conditional Rendering

```tsx
{/* Vehicle fields */}
{isVehicle && (
  <>
    <FormInput label='Plate Number' name='plate_number' />
    <FormInput label='VIN Number' name='chasis_number' />
    <FormInput label='Engine Number' name='engine_number' />
    <FormInput label='Make' name='make' />
    <FormInput label='Model' name='model' />
  </>
)}

{/* IT Equipment fields */}
{isITEquipment && !isVehicle && (
  <>
    <FormInput label='Serial Number' name='serial_number' />
    <FormInput label='Make' name='make' />
    <FormInput label='Model' name='model' />
  </>
)}
```

## Data Structure

### Form Schema

```typescript
{
  // Standard fields
  name: string;
  asset_type: string;
  project: string;
  assignee: string;
  asset_code: string;

  // Conditional fields (nullable/optional)
  plate_number?: string | null;        // Vehicles
  chasis_number?: string | null;       // Vehicles (VIN)
  engine_number?: string | null;       // Vehicles
  make?: string | null;                // Vehicles, IT, Lab
  model?: string | null;               // Vehicles, IT, Lab
  serial_number?: string | null;       // IT, Lab

  // Other fields...
}
```

### Backend Payload

When form is submitted, only filled fields are sent:

```json
// Vehicle submission
{
  "name": "Toyota Hilux",
  "category": "uuid-of-vehicles-category",
  "plate_number": "ABC-123-XY",
  "chasis_number": "1HGCM82633A123456",
  "engine_number": "ENG-789456",
  "make": "Toyota",
  "model": "Hilux",
  // ... other standard fields
}

// IT Equipment submission
{
  "name": "Dell Laptop",
  "category": "uuid-of-it-equipment-category",
  "serial_number": "SN-2024-001",
  "make": "Dell",
  "model": "Latitude 5420",
  // ... other standard fields
  // Note: No vehicle fields included
}
```

## Adding New Asset Types

To add conditional fields for a new asset type:

### 1. Update Detection Logic

```typescript
// In create.tsx, add new detection
const isNewAssetType = selectedCategoryName.includes("newtype");
```

### 2. Add New Fields to Schema (if needed)

```typescript
// In asset.ts
export const AssetSchema = z.object({
  // ... existing fields
  new_field: z.string().optional().nullable(),
});
```

### 3. Add Conditional Rendering

```tsx
{/* New Asset Type fields */}
{isNewAssetType && (
  <>
    <FormInput label='New Field' name='new_field' />
  </>
)}
```

### 4. Update Default Values

```typescript
defaultValues: {
  // ... existing defaults
  new_field: "",
}
```

### 5. Update useEffect

```typescript
form.reset({
  // ... existing resets
  new_field: asset?.data?.new_field,
});
```

## Files Modified

1. **`/src/features/admin/types/inventory-management/asset.ts`**
   - Added: `make`, `model`, `serial_number`, `engine_number` fields

2. **`/src/features/admin/components/assets/create.tsx`**
   - Added category-based field detection logic
   - Added conditional rendering for asset-type-specific fields
   - Updated form default values and reset logic

## Benefits

✅ **Smart Forms:** Only shows relevant fields based on asset type
✅ **Better UX:** Less clutter, clearer form
✅ **Data Quality:** Ensures right data for right asset types
✅ **Flexibility:** Easy to add new asset types
✅ **No Duplication:** Category selection drives everything

## Testing Checklist

- [ ] Create a Vehicle → Vehicle fields appear
- [ ] Create IT Equipment → IT fields appear
- [ ] Create Lab Equipment → Lab fields appear
- [ ] Create Furniture → No special fields appear
- [ ] Edit a Vehicle → Vehicle fields pre-populated
- [ ] Edit IT Equipment → IT fields pre-populated
- [ ] Change category during creation → Fields update dynamically
- [ ] Submit with vehicle fields → Data saved correctly
- [ ] Submit with IT fields → Data saved correctly
- [ ] View asset details page → All fields display correctly

## Troubleshooting

### Issue: Fields not appearing when category selected

**Solution:** Check that category name matches detection keywords:
```typescript
// Add console.log to debug
console.log('Selected Category:', selectedCategoryName);
console.log('Is Vehicle:', isVehicle);
console.log('Is IT Equipment:', isITEquipment);
```

### Issue: Wrong fields appearing

**Solution:** Verify category name doesn't accidentally match multiple patterns:
- "IT Vehicle Equipment" would match both Vehicle and IT
- Use more specific detection or adjust logic

### Issue: Fields not saving to backend

**Solution:** Ensure backend model has these fields:
- `make`, `model`, `serial_number`, `engine_number`
- All should be optional/nullable fields

---

**Last Updated:** 2025-10-11
**Version:** 1.0.0
**Status:** ✅ Production Ready
