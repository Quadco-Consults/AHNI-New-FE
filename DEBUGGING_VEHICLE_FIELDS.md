# Debugging Guide: Vehicle Fields Not Saving

## Issue
Vehicle-specific fields (Engine Number, Current Odometer Reading, Make) are showing "N/A" on the asset details page even though they appear to be entered in the form.

## Investigation Steps

I've added comprehensive logging throughout the entire data flow to help identify where the data is being lost. Here's what to check:

### 1. Test the Update Flow

1. Navigate to the asset edit page:
   ```
   http://localhost:3000/dashboard/admin/assets/create?id=<your-asset-id>
   ```

2. Fill in the missing vehicle fields:
   - **Engine Number**: (enter a value, e.g., "ENG-12345")
   - **Current Odometer Reading**: (enter a value, e.g., "100000")
   - **Make**: Honda (since the model is Accord)

3. Click **Submit**

4. **Open Browser Developer Console** (F12 or Cmd+Option+I)

### 2. Console Logs to Check

You'll see a series of debug logs that trace the data through the entire system:

#### **Step 1: Form Submission (create.tsx)**
```
=== ASSET FORM SUBMISSION DEBUG ===
1. Raw form data: {...}
2. Filtered data (being sent to backend): {...}
3. Vehicle-specific fields:
   - engine_number: <value>
   - odometer_reading: <value>
   - make: <value>
4. Asset ID: <id>
5. Operation: UPDATE
6. Calling editItem with filtered data...
```

**What to check:**
- ✅ Are the vehicle fields present in "Raw form data"?
- ✅ Are the vehicle fields present in "Filtered data"?
- ❌ If missing in "Filtered data", they're being filtered out (empty strings)

#### **Step 2: Item Controller (itemController.ts)**
```
=== ITEM CONTROLLER UPDATE ===
1. Update endpoint: /config/items/<id>/
2. Payload being sent to backend: {...}
3. Payload keys: [...]
4. Vehicle fields in payload:
   - engine_number: <value>
   - odometer_reading: <value>
   - make: <value>
5. Backend update successful!
```

**What to check:**
- ✅ Do the vehicle fields appear in the payload?
- ✅ Are the payload keys correct?
- ❌ If missing here, the data was lost between form submission and controller

#### **Step 3: HTTP Request (mainController.ts)**
```
=== MAIN CONTROLLER HTTP REQUEST ===
Method: PATCH
Endpoint: /config/items/<id>/
Request payload: {
  "engine_number": "ENG-12345",
  "odometer_reading": "100000",
  "make": "Honda",
  ...
}
Config: {...}
```

**What to check:**
- ✅ Are the vehicle fields in the request payload JSON?
- ✅ Is the endpoint correct?
- ✅ Is the method PATCH (not POST or PUT)?

#### **Step 4: HTTP Response**
```
=== HTTP RESPONSE ===
Status: 200
Response data: {
  "status": true,
  "message": "Item updated successfully",
  "data": {...}
}
```

**What to check:**
- ✅ Status should be 200 or 201
- ✅ Message should indicate success
- ✅ **CRITICAL**: Check if `data` contains the updated vehicle fields

### 3. Network Tab Investigation

1. Open Browser DevTools → **Network** tab
2. Filter by "items" or "assets"
3. Submit the form
4. Find the **PATCH** request to `/config/items/<id>/`
5. Click on it and check:
   - **Request Headers**: Verify `Content-Type: application/json`
   - **Request Payload**: Verify vehicle fields are present
   - **Response**: Check if backend acknowledges the fields

### 4. Common Issues and Solutions

#### Issue A: Fields Not in "Filtered Data"
**Symptom**: Fields present in "Raw form data" but missing in "Filtered data"

**Cause**: Empty strings or whitespace-only values are being filtered out

**Solution**: Make sure fields have actual values before submitting

#### Issue B: Backend Not Accepting Fields
**Symptom**: Fields in request payload but backend response doesn't include them

**Possible Causes**:
1. **Backend model doesn't have these fields**
   - Check Django model for `engine_number`, `odometer_reading`, `make`
   - Ensure fields exist in the Item model

2. **Backend serializer doesn't include these fields**
   - Check Django serializer `fields` or `exclude` settings
   - Add vehicle fields to serializer if missing

3. **Backend validation is rejecting the fields**
   - Check Django logs for validation errors
   - Look for field name mismatches (snake_case vs camelCase)

#### Issue C: Data Not Persisting to Database
**Symptom**: Backend accepts fields but they don't save to database

**Possible Causes**:
1. **Migration not applied**
   - Run `python manage.py makemigrations`
   - Run `python manage.py migrate`

2. **Database field constraints**
   - Check if fields have constraints (max_length, validators)
   - Look for database-level validation errors

3. **Signal or save() override issues**
   - Check if model has custom `save()` method
   - Check for Django signals that might interfere

### 5. Backend Checklist

If frontend logs show data is being sent correctly, check backend:

#### Django Model (`models.py`)
```python
class Item(models.Model):
    # ... existing fields

    # Vehicle-specific fields (should exist)
    engine_number = models.CharField(max_length=100, blank=True, null=True)
    odometer_reading = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    make = models.CharField(max_length=100, blank=True, null=True)
    plate_number = models.CharField(max_length=50, blank=True, null=True)
    chasis_number = models.CharField(max_length=100, blank=True, null=True)  # VIN
    model = models.CharField(max_length=100, blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
```

#### Django Serializer (`serializers.py`)
```python
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            # ... existing fields
            'engine_number',
            'odometer_reading',
            'make',
            'plate_number',
            'chasis_number',
            'model',
            'serial_number',
        ]
        # OR if using __all__:
        # fields = '__all__'
```

#### Django View/ViewSet
```python
# Ensure PATCH method is allowed
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']  # PATCH should be here
```

### 6. Quick Test Commands

#### Frontend Test
```bash
# Check if form data is being captured
cd /Users/muhammadilu/AHNI-New-FE
npm run dev

# Navigate to: http://localhost:3000/dashboard/admin/assets/create?id=<asset-id>
# Fill in vehicle fields and submit
# Check browser console for debug logs
```

#### Backend Test (if you have access)
```bash
# Check Django logs
tail -f /path/to/django/logs/debug.log

# Or run Django dev server with verbose logging
python manage.py runserver --verbosity 3
```

### 7. Expected Results

#### ✅ Success Case
```
Console logs show:
1. Fields present in raw form data ✅
2. Fields present in filtered data ✅
3. Fields in item controller payload ✅
4. Fields in HTTP request payload ✅
5. HTTP response status 200 ✅
6. Response data contains updated fields ✅
7. Asset details page shows updated values ✅
```

#### ❌ Failure Cases

**Case 1: Fields Lost During Filtering**
- Present in raw form data
- Missing in filtered data
- **Solution**: Ensure fields have non-empty values

**Case 2: Backend Not Accepting Fields**
- Present in HTTP request
- Backend response doesn't include them
- **Solution**: Check backend model, serializer, and migrations

**Case 3: Fields Not Loading on Details Page**
- Backend has correct data
- Details page shows N/A
- **Solution**: Check AssetDetails.tsx field mapping

## Files Modified for Debugging

1. **`/src/features/admin/components/assets/create.tsx`** (lines 306-350)
   - Added form submission debug logs

2. **`/src/features/modules/controllers/config/itemController.ts`** (lines 82-101)
   - Added item controller debug logs

3. **`/src/constants/mainController.ts`** (lines 73-108)
   - Added HTTP request/response debug logs

## Next Steps

1. **Run the test** as described above
2. **Collect console logs** from all steps
3. **Identify where data is lost**:
   - If lost at step 1-2: Frontend form issue
   - If lost at step 3-4: Controller/HTTP issue
   - If lost after step 4: Backend issue
4. **Check backend** if frontend logs show data is being sent correctly
5. **Share findings** with backend team if necessary

## Cleanup

Once debugging is complete, you can remove the debug logs by searching for:
- `console.log("=== ASSET FORM SUBMISSION DEBUG ===");`
- `console.log("=== ITEM CONTROLLER UPDATE ===");`
- `console.log("=== MAIN CONTROLLER HTTP REQUEST ===");`

Or keep them for future debugging with a DEBUG flag.

---

**Last Updated**: 2025-10-11
**Status**: 🔍 Debugging in Progress
