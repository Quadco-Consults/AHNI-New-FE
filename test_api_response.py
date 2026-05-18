#!/usr/bin/env python3
"""Test API response for activity memo"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from modules.procurements.models import PurchaseRequestMemo
from modules.procurements.serializers.requests_and_orders.purchase_request_memo import PurchaseRequestMemoSerializer

print("\n=== TESTING API SERIALIZER OUTPUT ===\n")

# Get a memo with financial data
memo = PurchaseRequestMemo.objects.filter(ref_number__contains='TEST').prefetch_related(
    'budget_line', 'modules', 'fconumber', 'cost_categories', 
    'cost_grouping', 'cost_input', 'intervention_areas', 'funding_source'
).first()

if not memo:
    memo = PurchaseRequestMemo.objects.prefetch_related(
        'budget_line', 'modules', 'fconumber', 'cost_categories', 
        'cost_grouping', 'cost_input', 'intervention_areas', 'funding_source'
    ).first()

if memo:
    print(f"Testing memo: {memo.ref_number or 'No Ref'} - {memo.subject}\n")
    
    # Serialize it
    serializer = PurchaseRequestMemoSerializer(memo)
    data = serializer.data
    
    print("Financial Data in Serialized Response:")
    print(f"  budget_line (IDs): {data.get('budget_line', [])}")
    print(f"  budget_line_details: {data.get('budget_line_details', [])}")
    print(f"  module (IDs): {data.get('module', [])}")
    print(f"  modules (IDs): {data.get('modules', [])}")
    print(f"  modules_details: {data.get('modules_details', [])}")
    print(f"  fconumber (IDs): {data.get('fconumber', [])}")
    print(f"  fconumber_details: {data.get('fconumber_details', [])}")
    print(f"  cost_categories (IDs): {data.get('cost_categories', [])}")
    print(f"  cost_categories_details: {data.get('cost_categories_details', [])}")
    print(f"  cost_grouping (IDs): {data.get('cost_grouping', [])}")
    print(f"  cost_grouping_details: {data.get('cost_grouping_details', [])}")
    
    print(f"\n  intervention_areas (IDs): {data.get('intervention_areas', [])}")
    print(f"  intervention_areas_details: {data.get('intervention_areas_details', [])}")
    print(f"  cost_input (IDs): {data.get('cost_input', [])}")
    print(f"  cost_inputs_details: {data.get('cost_inputs_details', [])}")
    print(f"  funding_source (IDs): {data.get('funding_source', [])}")
    print(f"  funding_sources_details: {data.get('funding_sources_details', [])}")
    
    print(f"\n  through (IDs): {data.get('through', [])}")
    print(f"  through_details: {data.get('through_details', [])}")
    print(f"  authorised_by (IDs): {data.get('authorised_by', [])}")
    print(f"  authorised_by_details: {data.get('authorised_by_details', [])}")
else:
    print("No memos found!")
