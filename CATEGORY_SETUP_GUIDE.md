# Quick Category Setup Guide

## For Backend Engineers

### 1. Database Schema

Add this field to your Category model:

```python
parent = models.ForeignKey(
    'self',
    null=True,
    blank=True,
    on_delete=models.PROTECT,  # Prevent deleting parents with children
    related_name='children',
    to='config.Category'
)
```

### 2. Run Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Update Serializer

```python
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'code',
            'serial_number', 'job_category',
            'parent',  # Add this
            'created_at', 'updated_at'
        ]

    def validate(self, data):
        # Prevent circular references
        parent = data.get('parent')
        if parent:
            if parent == self.instance:
                raise serializers.ValidationError(
                    "Category cannot be its own parent"
                )

            # Check for circular reference
            current = parent
            while current and current.parent:
                if current.parent == self.instance:
                    raise serializers.ValidationError(
                        "Circular reference detected"
                    )
                current = current.parent

        return data
```

### 4. Seed Example Data

```python
# In Django shell or data migration
from apps.config.models import Category

# Create top-level GOODS categories
assets = Category.objects.create(
    name='Assets',
    job_category='GOODS',
    code='AST',
    serial_number=1,
    parent=None
)

consumables = Category.objects.create(
    name='Consumables',
    job_category='GOODS',
    code='CON',
    serial_number=2,
    parent=None
)

# Create child categories under Assets
Category.objects.create(
    name='Vehicles',
    job_category='GOODS',
    code='VEH',
    serial_number=3,
    parent=assets
)

Category.objects.create(
    name='IT Equipment',
    job_category='GOODS',
    code='ITE',
    serial_number=4,
    parent=assets
)

Category.objects.create(
    name='Machines',
    job_category='GOODS',
    code='MAC',
    serial_number=5,
    parent=assets
)

Category.objects.create(
    name='Buildings',
    job_category='GOODS',
    code='BLD',
    serial_number=6,
    parent=assets
)

# Create child categories under Consumables
Category.objects.create(
    name='Medical Consumables',
    job_category='GOODS',
    code='MED',
    serial_number=7,
    parent=consumables
)

Category.objects.create(
    name='IT Consumables',
    job_category='GOODS',
    code='ITC',
    serial_number=8,
    parent=consumables
)

Category.objects.create(
    name='Office Consumables',
    job_category='GOODS',
    code='OFC',
    serial_number=9,
    parent=consumables
)

# Create SERVICE categories (top-level only, no children)
Category.objects.create(
    name='HMO',
    job_category='SERVICE',
    code='HMO',
    serial_number=10,
    parent=None
)

Category.objects.create(
    name='Lease',
    job_category='SERVICE',
    code='LSE',
    serial_number=11,
    parent=None
)
```

### 5. Test API

```bash
# Get all categories
GET /config/category/?page=1&size=20

# Get only GOODS categories
GET /config/category/?job_category=GOODS

# Get top-level categories (no parent)
GET /config/category/?parent=null

# Get children of Assets category
GET /config/category/?parent=<assets-uuid>

# Create a category with parent
POST /config/category/
{
  "name": "Generators",
  "job_category": "GOODS",
  "code": "GEN",
  "serial_number": 12,
  "parent": "<assets-uuid>"
}
```

## Recommended Category Structure

### GOODS

**Assets** (Parent)
- Vehicles
- IT Equipment
- Machines
- Buildings
- Generators
- Furniture
- Medical Equipment

**Consumables** (Parent)
- Medical Consumables
- IT Consumables
- Office Consumables
- Laboratory Consumables
- Cleaning Supplies

### SERVICE

**Top-level only** (no children needed yet)
- HMO
- Lease
- Maintenance
- Consulting
- Training

### WORK

**Top-level only** (no children needed yet)
- Construction
- Renovation
- Installation
- Repairs

## Verification

After setup, verify:

1. **Top-level categories exist:**
   ```bash
   Category.objects.filter(parent__isnull=True).count()  # Should be > 0
   ```

2. **Child categories exist:**
   ```bash
   Category.objects.filter(parent__isnull=False).count()  # Should be > 0
   ```

3. **Hierarchy is correct:**
   ```bash
   assets = Category.objects.get(code='AST')
   assets.children.all()  # Should show Vehicles, IT Equipment, etc.
   ```

4. **API returns parent data:**
   ```bash
   curl http://localhost:8000/config/category/?page=1&size=20
   # Check that items have "parent" field
   ```

## Common Issues

**Issue:** "Cannot assign 'str': Category.parent must be a Category instance"
- **Solution:** Ensure you're passing parent UUID as string in the API, serializer will handle conversion

**Issue:** "Category matching query does not exist"
- **Solution:** Make sure parent category exists before creating child

**Issue:** "Circular reference detected"
- **Solution:** This is intentional validation - choose a different parent

## Quick Commands

```bash
# Count categories by type
Category.objects.values('job_category').annotate(count=models.Count('id'))

# List all parent categories
Category.objects.filter(parent__isnull=True)

# List all child categories of a parent
Category.objects.filter(parent__code='AST')

# Delete a category (will fail if it has children - PROTECT)
category.delete()  # Will raise ProtectedError if children exist
```

---

That's it! Once this is set up, the frontend will automatically work with the cascading dropdowns.
