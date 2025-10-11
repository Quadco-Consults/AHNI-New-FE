# Comprehensive Vehicle Fields for Asset Management

## Overview

This document lists all vehicle-specific fields available in the asset management system. These fields are organized into categories for better fleet management, compliance tracking, and maintenance scheduling.

## Field Categories

### 1. **Basic Vehicle Information**
Essential fields for vehicle identification and specifications.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `plate_number` | String | License plate number | "ABC-123-XY" |
| `chasis_number` | String | VIN (Vehicle Identification Number) | "1HGCM82633A123456" |
| `engine_number` | String | Engine identification number | "ENG-789456" |
| `odometer_reading` | Number/String | Current odometer reading (km) | "45000" |
| `make` | String | Vehicle manufacturer | "Toyota", "Honda", "Ford" |
| `model` | String | Vehicle model | "Hilux", "Accord", "F-150" |

### 2. **Additional Vehicle Details**
Fields for comprehensive vehicle specifications and categorization.

| Field | Type | Description | Example | Options |
|-------|------|-------------|---------|---------|
| `manufacture_year` | Number/String | Year the vehicle was manufactured | "2020", "2023" | |
| `vehicle_color` | String | Exterior color of the vehicle | "White", "Silver", "Blue" | |
| `fuel_type` | String | Type of fuel the vehicle uses | "Petrol" | Petrol, Diesel, Electric, Hybrid, CNG, LPG |
| `seating_capacity` | Number/String | Number of passenger seats | "5", "7", "15" | |
| `vehicle_type` | String | Category/type of vehicle | "Sedan" | Sedan, SUV, Truck, Van, Pickup, Bus, Motorcycle |

### 3. **Registration & Insurance**
Critical fields for legal compliance and insurance tracking.

| Field | Type | Description | Example | Important |
|-------|------|-------------|---------|-----------|
| `registration_number` | String | Government vehicle registration number | "REG-2023-001234" | ⚠️ Legal requirement |
| `registration_expiry_date` | Date | When vehicle registration expires | "2025-12-31" | ⚠️ Must renew before expiry |
| `insurance_policy_number` | String | Insurance policy identification number | "POL-2024-789456" | ⚠️ Required for operation |
| `insurance_provider` | String | Insurance company name | "ABC Insurance Ltd" | |
| `insurance_expiry_date` | Date | When insurance policy expires | "2025-06-30" | ⚠️ Must renew before expiry |

### 4. **Maintenance & Service**
Fields for tracking vehicle maintenance schedules and service history.

| Field | Type | Description | Example | Purpose |
|-------|------|-------------|---------|---------|
| `last_service_date` | Date | Date of last maintenance/service | "2024-11-15" | Track service history |
| `next_service_date` | Date | Next scheduled service date | "2025-02-15" | Service reminders |
| `service_interval_km` | Number/String | Service every X kilometers | "5000", "10000" | Auto-schedule maintenance |

## Implementation Status

### ✅ Currently Implemented in Code
All fields listed above have been added to:
- ✅ `AssetSchema` (Zod validation) - `/src/features/admin/types/inventory-management/asset.ts`
- ✅ `TAssetSingleData` (TypeScript interface) - `/src/features/admin/types/inventory-management/asset.ts`
- ✅ `ItemFormValues` (API payload type) - `/src/features/modules/types/config/index.ts`

### ⚠️ Pending Implementation
These fields still need to be added to:
- ⚠️ Asset creation/edit form UI (`create.tsx`) - Form inputs not yet added
- ⚠️ Asset details page UI (`AssetDetails.tsx`) - Display fields not yet added
- ⚠️ Backend Django model - Database fields may not exist
- ⚠️ Backend Django serializer - Fields may not be included in API

## Use Cases

### 1. **Fleet Compliance Management**
Track expiring registrations and insurance policies:
```typescript
// Get vehicles with expiring registration
const expiringRegistration = vehicles.filter(v => {
  const expiryDate = new Date(v.registration_expiry_date);
  const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry <= 30; // Expiring in next 30 days
});
```

### 2. **Maintenance Scheduling**
Auto-schedule services based on odometer readings:
```typescript
// Check if vehicle needs service
const needsService = (vehicle) => {
  const currentOdometer = Number(vehicle.odometer_reading);
  const lastServiceOdometer = Number(vehicle.last_service_odometer); // Could be tracked separately
  const serviceInterval = Number(vehicle.service_interval_km);

  return (currentOdometer - lastServiceOdometer) >= serviceInterval;
};
```

### 3. **Fleet Analytics**
Analyze fleet composition by fuel type, vehicle type, age:
```typescript
// Fleet composition by fuel type
const fuelTypeDistribution = vehicles.reduce((acc, v) => {
  acc[v.fuel_type] = (acc[v.fuel_type] || 0) + 1;
  return acc;
}, {});

// Average vehicle age
const currentYear = new Date().getFullYear();
const avgAge = vehicles.reduce((sum, v) =>
  sum + (currentYear - v.manufacture_year), 0
) / vehicles.length;
```

### 4. **Insurance Management**
Track insurance costs and providers:
```typescript
// Group vehicles by insurance provider
const byInsurer = vehicles.reduce((acc, v) => {
  if (!acc[v.insurance_provider]) acc[v.insurance_provider] = [];
  acc[v.insurance_provider].push(v);
  return acc;
}, {});
```

## Field Validation Rules

### Odometer Reading
- Must be numeric
- Cannot decrease (tampering detection)
- Should be reasonable (not 1 million km in 1 day)

### Dates
- Registration/Insurance expiry dates must be in the future when creating
- Can be in the past for historical records
- Last service date must be in the past
- Next service date should be in the future

### Fuel Type Options
```typescript
const FUEL_TYPES = [
  { label: "Petrol", value: "PETROL" },
  { label: "Diesel", value: "DIESEL" },
  { label: "Electric", value: "ELECTRIC" },
  { label: "Hybrid", value: "HYBRID" },
  { label: "CNG (Compressed Natural Gas)", value: "CNG" },
  { label: "LPG (Liquefied Petroleum Gas)", value: "LPG" },
];
```

### Vehicle Type Options
```typescript
const VEHICLE_TYPES = [
  { label: "Sedan", value: "SEDAN" },
  { label: "SUV", value: "SUV" },
  { label: "Truck", value: "TRUCK" },
  { label: "Van", value: "VAN" },
  { label: "Pickup", value: "PICKUP" },
  { label: "Bus", value: "BUS" },
  { label: "Motorcycle", value: "MOTORCYCLE" },
  { label: "Other", value: "OTHER" },
];
```

## Next Steps to Complete Implementation

### Step 1: Add Form Fields to `create.tsx`
Add the new vehicle fields to the asset creation/edit form:
```tsx
{/* Vehicle Details Section */}
{isVehicle && (
  <>
    <h3 className='col-span-3 font-semibold text-gray-700'>Vehicle Details</h3>

    {/* Row 1: Basic Info (already exists) */}
    <FormInput label='Plate Number' name='plate_number' />
    <FormInput label='VIN Number' name='chasis_number' />
    <FormInput label='Engine Number' name='engine_number' />

    {/* Row 2: Additional Details (NEW) */}
    <FormInput label='Manufacture Year' name='manufacture_year' type='number' />
    <FormInput label='Vehicle Color' name='vehicle_color' />
    <FormSelect label='Fuel Type' name='fuel_type' options={FUEL_TYPES} />

    {/* Row 3: More Details (NEW) */}
    <FormInput label='Seating Capacity' name='seating_capacity' type='number' />
    <FormSelect label='Vehicle Type' name='vehicle_type' options={VEHICLE_TYPES} />
    <FormInput label='Make' name='make' />

    {/* Row 4: Model & Odometer */}
    <FormInput label='Model' name='model' />
    <FormInput label='Current Odometer (km)' name='odometer_reading' type='number' />

    <h3 className='col-span-3 font-semibold text-gray-700 mt-4'>Registration & Insurance</h3>

    {/* Registration Fields (NEW) */}
    <FormInput label='Registration Number' name='registration_number' />
    <FormInput label='Registration Expiry' name='registration_expiry_date' type='date' />

    {/* Insurance Fields (NEW) */}
    <FormInput label='Insurance Policy Number' name='insurance_policy_number' />
    <FormInput label='Insurance Provider' name='insurance_provider' />
    <FormInput label='Insurance Expiry' name='insurance_expiry_date' type='date' />

    <h3 className='col-span-3 font-semibold text-gray-700 mt-4'>Maintenance Schedule</h3>

    {/* Maintenance Fields (NEW) */}
    <FormInput label='Last Service Date' name='last_service_date' type='date' />
    <FormInput label='Next Service Date' name='next_service_date' type='date' />
    <FormInput label='Service Interval (km)' name='service_interval_km' type='number' />
  </>
)}
```

### Step 2: Add Display Fields to `AssetDetails.tsx`
Display the new fields on the asset details page:
```tsx
{isVehicle && (
  <>
    {/* Existing fields */}
    <DescriptionCard label='Plate Number' description={asset?.data?.plate_number || "N/A"} />
    <DescriptionCard label='VIN Number' description={asset?.data?.chasis_number || "N/A"} />
    <DescriptionCard label='Engine Number' description={asset?.data?.engine_number || "N/A"} />

    {/* NEW: Additional Details */}
    <DescriptionCard label='Manufacture Year' description={asset?.data?.manufacture_year || "N/A"} />
    <DescriptionCard label='Color' description={asset?.data?.vehicle_color || "N/A"} />
    <DescriptionCard label='Fuel Type' description={asset?.data?.fuel_type || "N/A"} />
    <DescriptionCard label='Seating Capacity' description={asset?.data?.seating_capacity ? `${asset.data.seating_capacity} seats` : "N/A"} />
    <DescriptionCard label='Vehicle Type' description={asset?.data?.vehicle_type || "N/A"} />

    {/* NEW: Registration & Insurance */}
    <DescriptionCard label='Registration Number' description={asset?.data?.registration_number || "N/A"} />
    <DescriptionCard
      label='Registration Expiry'
      description={asset?.data?.registration_expiry_date
        ? new Date(asset.data.registration_expiry_date).toLocaleDateString()
        : "N/A"
      }
    />
    <DescriptionCard label='Insurance Policy #' description={asset?.data?.insurance_policy_number || "N/A"} />
    <DescriptionCard label='Insurance Provider' description={asset?.data?.insurance_provider || "N/A"} />
    <DescriptionCard
      label='Insurance Expiry'
      description={asset?.data?.insurance_expiry_date
        ? new Date(asset.data.insurance_expiry_date).toLocaleDateString()
        : "N/A"
      }
    />

    {/* NEW: Maintenance */}
    <DescriptionCard
      label='Last Service Date'
      description={asset?.data?.last_service_date
        ? new Date(asset.data.last_service_date).toLocaleDateString()
        : "N/A"
      }
    />
    <DescriptionCard
      label='Next Service Date'
      description={asset?.data?.next_service_date
        ? new Date(asset.data.next_service_date).toLocaleDateString()
        : "N/A"
      }
    />
    <DescriptionCard
      label='Service Interval'
      description={asset?.data?.service_interval_km
        ? `Every ${Number(asset.data.service_interval_km).toLocaleString()} km`
        : "N/A"
      }
    />
  </>
)}
```

### Step 3: Backend Implementation
Backend team needs to add these fields to Django model:

```python
# models.py
class Item(models.Model):
    # Existing fields...

    # Vehicle - Additional Details
    manufacture_year = models.IntegerField(blank=True, null=True)
    vehicle_color = models.CharField(max_length=50, blank=True, null=True)
    fuel_type = models.CharField(max_length=50, blank=True, null=True)
    seating_capacity = models.IntegerField(blank=True, null=True)
    vehicle_type = models.CharField(max_length=50, blank=True, null=True)

    # Vehicle - Registration & Insurance
    registration_number = models.CharField(max_length=100, blank=True, null=True)
    registration_expiry_date = models.DateField(blank=True, null=True)
    insurance_policy_number = models.CharField(max_length=100, blank=True, null=True)
    insurance_provider = models.CharField(max_length=200, blank=True, null=True)
    insurance_expiry_date = models.DateField(blank=True, null=True)

    # Vehicle - Maintenance
    last_service_date = models.DateField(blank=True, null=True)
    next_service_date = models.DateField(blank=True, null=True)
    service_interval_km = models.IntegerField(blank=True, null=True)
```

### Step 4: Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

## Benefits of Comprehensive Vehicle Tracking

### ✅ Compliance Management
- Track vehicle registration renewals
- Monitor insurance policy expiries
- Avoid fines and legal issues

### ✅ Maintenance Optimization
- Schedule preventive maintenance
- Track service history
- Reduce vehicle downtime
- Extend vehicle lifespan

### ✅ Fleet Analytics
- Analyze fuel consumption by fuel type
- Track vehicle age and replacement needs
- Monitor fleet composition
- Optimize vehicle allocation

### ✅ Cost Management
- Track insurance costs by provider
- Monitor maintenance expenses
- Calculate total cost of ownership
- Identify high-cost vehicles

### ✅ Safety & Compliance
- Ensure all vehicles are properly registered
- Maintain valid insurance coverage
- Track vehicle inspections
- Monitor vehicle condition

## Summary

This comprehensive vehicle field structure provides:
- **18 vehicle-specific fields** across 4 categories
- **Complete compliance tracking** (registration & insurance)
- **Maintenance scheduling** capabilities
- **Fleet analytics** support
- **TypeScript type safety** throughout the application

**Total Vehicle Fields**: 18
- Basic Info: 6 fields
- Additional Details: 5 fields
- Registration & Insurance: 5 fields
- Maintenance: 3 fields

---

**Last Updated**: 2025-10-11
**Version**: 2.0.0
**Status**: ✅ Types Implemented | ⚠️ UI Pending | ⚠️ Backend Pending
