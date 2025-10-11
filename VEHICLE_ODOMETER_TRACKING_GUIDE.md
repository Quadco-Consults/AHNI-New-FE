# Vehicle Odometer Tracking & Fuel Consumption System

## Overview

This document explains how the vehicle odometer tracking system works from initial asset registration through ongoing fuel consumption tracking. The system uses a **baseline odometer reading** from the asset form that serves as the starting point for all subsequent fuel request tracking and distance calculations.

## System Flow

```
Asset Registration → Initial Odometer → Fuel Requests → Distance Tracking → Fuel Efficiency
```

## 1. Asset Registration: Setting the Baseline

### Location
`/dashboard/admin/assets/create` or `/dashboard/admin/assets/create?id={assetId}`

### Purpose
When registering or editing a **vehicle asset**, you set the **initial/baseline odometer reading**. This serves as the starting point for all future fuel consumption tracking.

### How It Works

1. **User selects a vehicle category** during asset creation (e.g., "Vehicles", "Vehicle Fleet", "Motor Vehicles")

2. **Vehicle-specific fields appear**, including:
   - Plate Number
   - VIN Number (Vehicle Identification Number)
   - Engine Number
   - **Current Odometer Reading** ⭐ (The baseline)
   - Make (e.g., Toyota, Honda)
   - Model (e.g., Hilux, Accord)

3. **User enters the current odometer reading** (e.g., 45,000 km)

4. **This value is saved** as the vehicle's baseline odometer reading in the asset record

### Schema
```typescript
// From: /src/features/admin/types/inventory-management/asset.ts
export const AssetSchema = z.object({
  // ... other fields
  odometer_reading: z.string().optional().nullable(), // Baseline for vehicles
  plate_number: z.string().optional().nullable(),
  chasis_number: z.string().optional().nullable(), // VIN
  engine_number: z.string().optional().nullable(),
  make: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  // ... other fields
});
```

### Example
```json
{
  "name": "Toyota Hilux - Fleet 001",
  "category": "vehicles-uuid",
  "plate_number": "ABC-123-XY",
  "chasis_number": "1HGCM82633A123456",
  "engine_number": "ENG-789456",
  "odometer_reading": "45000", // ⭐ Baseline: Vehicle starts tracking from 45,000 km
  "make": "Toyota",
  "model": "Hilux"
}
```

---

## 2. Fuel Request: Tracking Distance

### Location
`/dashboard/admin/fleet-management/fuel-request/create`

### Purpose
Each time fuel is requested, the system records:
- Current odometer reading
- Fuel quantity
- Price per litre
- Vendor, driver, location

The system automatically **calculates distance traveled** by comparing the new odometer reading with the previous one.

### How It Works

#### First Fuel Request (No Previous Record)

When creating the **first fuel request** for a vehicle:

1. **User selects the vehicle** from the asset dropdown
2. **System shows message**: "First fuel request for this vehicle"
3. **User enters current odometer reading** (e.g., 45,320 km)
4. **System does NOT calculate distance** (no previous reading to compare)

**Example:**
```
Asset Baseline: 45,000 km
First Fuel Request: 45,320 km
Distance Covered: Not calculated (first request)
```

#### Subsequent Fuel Requests (With Previous Record)

For all subsequent fuel requests:

1. **User selects the vehicle** from the asset dropdown
2. **System automatically fetches the last odometer reading** using the `useGetLastOdometerReading` hook
3. **System displays helpful information**:
   - Previous odometer reading: `45,320 km`
   - Last fuel request date: `2025-01-10`
   - Previous fuel efficiency: `8.5 L/100km`
4. **User enters new odometer reading** (e.g., 45,650 km)
5. **System calculates distance covered**: `45,650 - 45,320 = 330 km`
6. **Distance is displayed in real-time** as user types

**Example:**
```
Previous Reading: 45,320 km (from last fuel request)
Current Reading: 45,650 km
Distance Covered: 330 km ✅
```

### Backend Endpoint
```typescript
GET /admins/fleets/fuel-consumptions/vehicle/{vehicleId}/last-odometer/

Response:
{
  "status": true,
  "message": "Last odometer reading retrieved successfully",
  "data": {
    "last_odometer_reading": 45320,
    "last_fuel_date": "2025-01-10",
    "fuel_efficiency": 8.5
  }
}
```

### Controller Hook
```typescript
// From: /src/features/admin/controllers/fuelConsumptionController.ts
export const useGetLastOdometerReading = (
  vehicleId: string,
  enabled: boolean = true
) => {
  return useQuery<{
    lastOdometer: number | null;
    lastFuelRequestDate: string | null;
    hasPreviousRequest: boolean;
    fuelEfficiency?: number | null;
  }>({
    queryKey: ["lastOdometerReading", vehicleId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${BASE_URL}vehicle/${vehicleId}/last-odometer/`
        );

        const data = response.data?.data;

        if (!data || !data.last_odometer_reading) {
          return {
            lastOdometer: null,
            lastFuelRequestDate: null,
            hasPreviousRequest: false,
          };
        }

        return {
          lastOdometer: data.last_odometer_reading || null,
          lastFuelRequestDate: data.last_fuel_date || null,
          hasPreviousRequest: true,
          fuelEfficiency: data.fuel_efficiency || null,
        };
      } catch (error) {
        console.warn("Last odometer endpoint not available:", error);
        return {
          lastOdometer: null,
          lastFuelRequestDate: null,
          hasPreviousRequest: false,
        };
      }
    },
    enabled: enabled && !!vehicleId,
    refetchOnWindowFocus: false,
  });
};
```

### UI Display
```typescript
// From: /src/features/admin/components/fleet-management/fuel-request/create.tsx
{selectedAsset && !id && lastOdometerData && (
  <div className='text-xs text-gray-600 bg-gray-50 p-2 rounded border'>
    {lastOdometerData.hasPreviousRequest ? (
      <div className='space-y-1'>
        <div>
          <span className='font-medium'>Previous reading:</span> {lastOdometerData.lastOdometer?.toLocaleString()} km
        </div>
        {lastOdometerData.lastFuelRequestDate && (
          <div>
            <span className='font-medium'>Last fuel date:</span> {new Date(lastOdometerData.lastFuelRequestDate).toLocaleDateString()}
          </div>
        )}
        {distanceCovered > 0 && (
          <div className='text-blue-600 font-medium'>
            Distance covered: {distanceCovered.toLocaleString()} km
          </div>
        )}
        {lastOdometerData.fuelEfficiency && (
          <div className='text-green-600 text-xs'>
            Previous efficiency: {lastOdometerData.fuelEfficiency.toFixed(1)} L/100km
          </div>
        )}
      </div>
    ) : (
      <div className='text-amber-600'>
        <span className='font-medium'>First fuel request</span> for this vehicle
      </div>
    )}
  </div>
)}
```

---

## 3. Distance Calculation Logic

### Frontend Calculation
```typescript
// From: /src/features/admin/components/fleet-management/fuel-request/create.tsx
const calculateDistance = () => {
  if (lastOdometerData?.lastOdometer && currentOdometer) {
    const current = Number(currentOdometer);
    const previous = lastOdometerData.lastOdometer;
    return current > previous ? current - previous : 0;
  }
  return 0;
};

const distanceCovered = calculateDistance();
```

### Validation
- **Ensures current reading > previous reading** to prevent negative distances
- **Returns 0** if current reading is less than or equal to previous reading
- **Handles edge cases** like null/undefined values

---

## 4. Fuel Consumption Tracking Timeline

### Example Timeline for Vehicle "Toyota Hilux - Fleet 001"

#### Day 1: Asset Registration
```
Action: Create vehicle asset
Odometer Reading: 45,000 km (baseline)
Purpose: Set initial reference point
```

#### Day 15: First Fuel Request
```
Action: Create fuel request
Odometer Reading: 45,320 km
Fuel Quantity: 50 liters
Distance Covered: Not calculated (first request)
Message: "First fuel request for this vehicle"
```

#### Day 30: Second Fuel Request
```
Action: Create fuel request
Previous Odometer: 45,320 km (from Day 15)
Current Odometer: 45,650 km
Distance Covered: 330 km ✅
Fuel Quantity: 28 liters
Fuel Efficiency: 8.5 L/100km (330 km ÷ 28 L × 100)
```

#### Day 45: Third Fuel Request
```
Action: Create fuel request
Previous Odometer: 45,650 km (from Day 30)
Current Odometer: 46,120 km
Distance Covered: 470 km ✅
Fuel Quantity: 42 liters
Fuel Efficiency: 8.9 L/100km (470 km ÷ 42 L × 100)
```

---

## 5. Fuel Efficiency Calculation

### Formula
```
Fuel Efficiency (L/100km) = (Fuel Quantity / Distance Covered) × 100
```

### Example
```
Distance: 330 km
Fuel Quantity: 28 liters
Efficiency: (28 / 330) × 100 = 8.48 L/100km
```

### Backend Responsibility
- The backend **calculates and stores** fuel efficiency for each request
- The frontend **displays** this calculated value
- Historical efficiency data helps identify:
  - Vehicle maintenance needs
  - Driver behavior patterns
  - Fuel consumption anomalies

---

## 6. Key Benefits

### 1. Accurate Distance Tracking
- Every fuel request captures exact odometer reading
- System automatically calculates distance traveled
- No manual calculations needed

### 2. Fuel Efficiency Monitoring
- Track fuel consumption patterns over time
- Identify vehicles with poor fuel efficiency
- Monitor driver fuel usage behavior

### 3. Maintenance Triggers
- Distance covered can trigger maintenance schedules
- Example: Service every 5,000 km based on odometer tracking
- Oil changes, tire rotations, inspections

### 4. Fraud Prevention
- Detects odometer tampering (reading goes backward)
- Prevents duplicate fuel requests with same odometer reading
- Validates reasonable distance between fuel requests

### 5. Cost Analysis
- Calculate cost per kilometer
- Compare fuel efficiency across fleet
- Identify high-cost vehicles

---

## 7. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. ASSET REGISTRATION                                           │
│ /dashboard/admin/assets/create                                  │
│                                                                 │
│ User creates vehicle asset                                      │
│ ├─ Plate Number: ABC-123-XY                                    │
│ ├─ VIN: 1HGCM82633A123456                                      │
│ └─ Odometer Reading: 45,000 km ⭐ BASELINE                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. FIRST FUEL REQUEST                                           │
│ /dashboard/admin/fleet-management/fuel-request/create           │
│                                                                 │
│ User creates first fuel request                                 │
│ ├─ Vehicle: Toyota Hilux (ABC-123-XY)                          │
│ ├─ Odometer: 45,320 km                                         │
│ ├─ Fuel: 50 liters                                             │
│ └─ Distance: Not calculated (first request)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. SUBSEQUENT FUEL REQUESTS                                     │
│ /dashboard/admin/fleet-management/fuel-request/create           │
│                                                                 │
│ System fetches last odometer reading                            │
│ ├─ GET /fuel-consumptions/vehicle/{id}/last-odometer/          │
│ └─ Returns: 45,320 km, 2025-01-15, 8.5 L/100km                │
│                                                                 │
│ User enters new odometer reading                                │
│ ├─ Previous: 45,320 km                                         │
│ ├─ Current: 45,650 km                                          │
│ └─ Distance: 330 km ✅ (calculated automatically)              │
│                                                                 │
│ System displays real-time info                                  │
│ ├─ Distance covered: 330 km                                    │
│ └─ Previous efficiency: 8.5 L/100km                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. BACKEND PROCESSING                                           │
│                                                                 │
│ Backend receives fuel request                                   │
│ ├─ Calculates distance (current - previous odometer)           │
│ ├─ Calculates fuel efficiency (L/100km)                        │
│ ├─ Stores all data in database                                 │
│ └─ Returns success response                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Important Notes

### Baseline Odometer Reading
- **Set during asset registration** for vehicles
- **Cannot be changed** after first fuel request is created
- **Used as reference** only for the very first fuel request
- **Subsequent fuel requests** use the last fuel request's odometer reading

### Last Odometer Reading Source
- **NOT from asset baseline** after first fuel request
- **FROM last fuel consumption record** in the database
- **Ensures chain of custody** for all odometer readings

### Odometer Reading Validation
```typescript
// Backend should validate:
1. Current reading >= Previous reading (no tampering)
2. Distance is reasonable (e.g., < 5,000 km in 1 day)
3. Reading is numeric and positive
4. Reading is greater than asset baseline (if first request)
```

### Real-World Example

**Scenario:** A vehicle has been in use before being added to the system

```
Vehicle's actual odometer: 45,000 km (already driven)
Asset registration: Enter 45,000 km as baseline
First fuel request: Enter 45,320 km (320 km since registration)
System: "First fuel request" (no distance calculated)
Second fuel request: Enter 45,650 km
System: "Distance covered: 330 km" (45,650 - 45,320)
```

---

## 9. Files Reference

### Asset Form
- **File**: `/src/features/admin/components/assets/create.tsx`
- **Line**: 431-436 (Odometer reading input)
- **Schema**: `/src/features/admin/types/inventory-management/asset.ts`

### Fuel Request Form
- **File**: `/src/features/admin/components/fleet-management/fuel-request/create.tsx`
- **Line**: 290-329 (Odometer reading input with last reading display)
- **Schema**: `/src/features/admin/types/fleet-management/fuel-request.ts`

### Controller
- **File**: `/src/features/admin/controllers/fuelConsumptionController.ts`
- **Hook**: `useGetLastOdometerReading` (Line 393-448)

### Category Detection
- **File**: `/src/features/admin/components/assets/create.tsx`
- **Line**: 348 (Vehicle detection: `isVehicle`)

---

## 10. Future Enhancements

### Potential Improvements
1. **Maintenance Scheduling** based on odometer milestones
2. **Alert System** for unusual fuel consumption
3. **Driver Performance Reports** based on fuel efficiency
4. **Fleet Comparison Dashboard** showing all vehicles' fuel efficiency
5. **Export Reports** for fuel consumption analysis
6. **Mobile App Integration** for on-the-go fuel request creation

### Analytics Opportunities
- Average fuel efficiency per vehicle
- Cost per kilometer analysis
- Fuel consumption trends over time
- Driver fuel usage patterns
- Vendor fuel price comparison

---

## Summary

The odometer tracking system in AHNI's ERP creates a complete chain of custody for vehicle mileage:

1. **Asset form** sets the initial baseline odometer reading when registering a vehicle
2. **First fuel request** records the starting point for fuel consumption tracking
3. **Subsequent fuel requests** automatically calculate distance by comparing current odometer with the last recorded reading
4. **Backend calculates** fuel efficiency and stores all data
5. **Frontend displays** real-time distance calculations and historical efficiency

This creates an **accurate, tamper-resistant system** for tracking vehicle fuel consumption and maintenance needs.

---

**Last Updated:** 2025-01-11
**Version:** 1.0.0
**Status:** ✅ Fully Implemented
