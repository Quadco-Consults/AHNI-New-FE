#!/usr/bin/env python3
"""
Script to create 3 test vendor submissions for EOI testing
"""
import requests
import json

# Configuration
BASE_URL = "http://4.222.217.212:8000"  # Your backend URL
API_ENDPOINT = f"{BASE_URL}/api/procurements/vendors/"
EOI_ID = "81943e05-dba3-44d8-865b-b855249bdc5b"

# You'll need to get a valid auth token - replace this
AUTH_TOKEN = "YOUR_AUTH_TOKEN_HERE"

headers = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json"
}

# Test vendor data
vendors = [
    {
        "company_name": "TechSupply Nigeria Ltd",
        "company_registration_number": "RC-123456",
        "year_or_incorperation": "2018",
        "type_of_business": "Limited Liability Company",
        "nature_of_business": "IT Equipment Supply",
        "company_address": "45 Allen Avenue, Ikeja, Lagos State",
        "email": "info@techsupply.ng",
        "phone_number": "+234-803-555-1234",
        "tin": "12345678-0001",
        "status": "Pending",
        "state": "Lagos",
        "eoi": EOI_ID,
        "submitted_categories": ["EOIAHNi05", "EOIAHNi06"],  # IT Equipment
        "company_chairman": "John Adebayo",
        "number_of_permanent_staff": "25",
        "bank_name": "First Bank of Nigeria",
        "account_name": "TechSupply Nigeria Ltd",
        "account_number": "0123456789",
        "bank_address": "Ikeja Branch, Lagos"
    },
    {
        "company_name": "MedLab Solutions",
        "company_registration_number": "RC-789012",
        "year_or_incorperation": "2015",
        "type_of_business": "Limited Liability Company",
        "nature_of_business": "Medical Laboratory Equipment & Consumables",
        "company_address": "12 Wuse Zone 5, Abuja FCT",
        "email": "contact@medlabsolutions.com.ng",
        "phone_number": "+234-806-777-5678",
        "tin": "87654321-0001",
        "status": "Approved",
        "state": "FCT",
        "eoi": EOI_ID,
        "submitted_categories": ["EOIAHNi01", "EOIAHNi02"],  # Lab consumables & equipment
        "company_chairman": "Dr. Sarah Okonkwo",
        "number_of_permanent_staff": "40",
        "bank_name": "Zenith Bank",
        "account_name": "MedLab Solutions",
        "account_number": "9876543210",
        "bank_address": "Wuse II, Abuja"
    },
    {
        "company_name": "PrintPro Services Ltd",
        "company_registration_number": "RC-345678",
        "year_or_incorperation": "2020",
        "type_of_business": "Limited Liability Company",
        "nature_of_business": "Printing and Design Services",
        "company_address": "78 Ring Road, Benin City, Edo State",
        "email": "hello@printpro.ng",
        "phone_number": "+234-802-444-9876",
        "tin": "45678912-0001",
        "status": "Pending",
        "state": "Edo",
        "eoi": EOI_ID,
        "submitted_categories": ["EOIAHNi03"],  # Design and Printing
        "company_chairman": "Emmanuel Eze",
        "number_of_permanent_staff": "15",
        "bank_name": "GTBank",
        "account_name": "PrintPro Services Ltd",
        "account_number": "5551234567",
        "bank_address": "Ring Road, Benin"
    }
]

def create_vendors():
    """Create test vendors"""
    print(f"Creating 3 test vendors for EOI: {EOI_ID}")
    print("=" * 60)

    for i, vendor_data in enumerate(vendors, 1):
        print(f"\n{i}. Creating vendor: {vendor_data['company_name']}")
        print(f"   Categories: {', '.join(vendor_data['submitted_categories'])}")
        print(f"   Status: {vendor_data['status']}")

        try:
            response = requests.post(
                API_ENDPOINT,
                headers=headers,
                json=vendor_data
            )

            if response.status_code in [200, 201]:
                result = response.json()
                vendor_id = result.get('data', {}).get('id', 'Unknown')
                print(f"   ✅ SUCCESS - Vendor ID: {vendor_id}")
            else:
                print(f"   ❌ ERROR: {response.status_code}")
                print(f"   Response: {response.text}")
        except Exception as e:
            print(f"   ❌ EXCEPTION: {str(e)}")

    print("\n" + "=" * 60)
    print("Done! Check the Vendor Submissions tab now.")

if __name__ == "__main__":
    print("\n⚠️  IMPORTANT: You need to set AUTH_TOKEN first!")
    print("Get your token from the browser's localStorage or network tab.\n")

    # Uncomment the line below after setting AUTH_TOKEN
    # create_vendors()
