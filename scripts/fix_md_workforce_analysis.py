#!/usr/bin/env python
"""
Django Shell Script to Fix Missing MD Position Workforce Analysis Records

This script should be run in your Django backend project directory using:
python manage.py shell < fix_md_workforce_analysis.py

Or copy and paste the contents into Django shell manually.
"""

# Import necessary Django models (adjust import paths as needed for your project)
from django.db import transaction
from decimal import Decimal

# You may need to adjust these import paths based on your Django app structure
try:
    from hr.models import Employee, Position, Location, WorkForceNeedAnalysis
    from configs.models import Position as ConfigPosition, Location as ConfigLocation
except ImportError as e:
    print(f"⚠️  Import Error: {e}")
    print("📝 Please adjust the import statements to match your Django app structure")
    print("🔍 Common paths might be:")
    print("   - from apps.hr.models import Employee, WorkForceNeedAnalysis")
    print("   - from apps.configs.models import Position, Location")
    exit(1)

def create_md_workforce_analysis():
    """
    Creates missing WorkForceNeedAnalysis records for MD position
    """
    print("🚀 Starting MD Workforce Analysis Record Creation")
    print("=" * 60)

    # Find MD position (based on debug output showing position ID)
    md_position_id = "36fbeb0d-a57d-442d-959e-6e57a5739ff7"

    try:
        # Try to find MD position by ID first
        try:
            md_position = Position.objects.get(id=md_position_id)
            print(f"✅ Found MD Position by ID: {md_position.name} (ID: {md_position.id})")
        except Position.DoesNotExist:
            # Fallback: find by name if ID doesn't work
            md_position = Position.objects.filter(name__icontains="md").first()
            if not md_position:
                md_position = Position.objects.filter(name__icontains="managing director").first()

            if not md_position:
                print("❌ No MD position found. Creating one...")
                md_position = Position.objects.create(
                    name="Managing Director",
                    description="Chief Executive Officer and Managing Director"
                )
                print(f"✅ Created MD Position: {md_position.name} (ID: {md_position.id})")
            else:
                print(f"✅ Found MD Position by name: {md_position.name} (ID: {md_position.id})")

        # Get all locations in the system
        locations = Location.objects.all()
        print(f"📍 Found {locations.count()} locations in system")

        if locations.count() == 0:
            print("⚠️  No locations found. Creating default location...")
            default_location = Location.objects.create(
                name="Head Office",
                state="Default State",
                city="Default City"
            )
            locations = [default_location]

        # Get MD employees for analysis
        md_employees = Employee.objects.filter(position=md_position)
        print(f"👥 Found {md_employees.count()} MD employees")

        if md_employees.count() == 0:
            print("⚠️  No MD employees found in system")

        # Create workforce analysis records for each location
        created_count = 0
        updated_count = 0

        with transaction.atomic():
            for location in locations:
                # Count current MD staff at this location
                current_md_staff = md_employees.filter(location=location).count()

                # WISN methodology calculations for MD position
                # For executive positions like MD, typically:
                # - Required staff = 1 per location (one MD per facility)
                # - Workload is strategic/administrative
                required_staff = 1
                shortage_excess = current_md_staff - required_staff

                # Calculate WISN ratio
                if required_staff > 0:
                    wisn_ratio = round(current_md_staff / required_staff, 2)
                else:
                    wisn_ratio = 0.0

                # Determine workforce problem status
                if shortage_excess > 0:
                    workforce_problem = "SURPLUS"
                elif shortage_excess < 0:
                    workforce_problem = "SHORTAGE"
                else:
                    workforce_problem = "BALANCE"

                # Determine workload pressure
                if wisn_ratio > 1.2:
                    workload_problem = "NONE"  # Overstaffed
                elif wisn_ratio < 0.8:
                    workload_problem = "HIGH"  # Understaffed
                else:
                    workload_problem = "NORMAL"

                # Check if record already exists
                existing_record = WorkForceNeedAnalysis.objects.filter(
                    position=md_position,
                    location=location
                ).first()

                record_data = {
                    'current_staff_count': current_md_staff,
                    'wisn_required_staff_count': required_staff,
                    'shortage_excess_count': shortage_excess,
                    'wisn_ratio': str(wisn_ratio),
                    'workforce_problem': workforce_problem,
                    'workload_problem': workload_problem
                }

                if existing_record:
                    # Update existing record
                    for field, value in record_data.items():
                        setattr(existing_record, field, value)
                    existing_record.save()
                    updated_count += 1
                    action = "Updated"
                else:
                    # Create new record
                    WorkForceNeedAnalysis.objects.create(
                        position=md_position,
                        location=location,
                        **record_data
                    )
                    created_count += 1
                    action = "Created"

                print(f"  {action} record for {location.name}:")
                print(f"    Current Staff: {current_md_staff}")
                print(f"    Required Staff: {required_staff}")
                print(f"    Shortage/Excess: {shortage_excess}")
                print(f"    WISN Ratio: {wisn_ratio}")
                print(f"    Workforce Status: {workforce_problem}")
                print(f"    Workload Pressure: {workload_problem}")
                print()

        print("=" * 60)
        print(f"✅ COMPLETED: Created {created_count} new records, Updated {updated_count} existing records")
        print(f"🎯 Total MD workforce analysis records: {created_count + updated_count}")
        print()
        print("🔄 Next Steps:")
        print("1. Refresh your frontend workforce analysis page")
        print("2. Select MD position in the dropdown")
        print("3. You should now see workforce analysis data instead of 0 results")
        print()
        print("📊 Expected Results After Fix:")
        for location in locations:
            current_staff = md_employees.filter(location=location).count()
            print(f"  📍 {location.name}: {current_staff} MD staff")

    except Exception as e:
        print(f"❌ Error occurred: {str(e)}")
        print("🔍 Please check your model imports and database connection")
        raise

if __name__ == "__main__":
    create_md_workforce_analysis()