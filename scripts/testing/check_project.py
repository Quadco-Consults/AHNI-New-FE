#!/usr/bin/env python3
import requests
import json
import sys

project_id = '962613ed-d960-4d3f-b0cf-1fff2574ac52'
base_url = 'https://ahnibe.rexwift.org/api/v1'

# Try without authentication first (might be public)
try:
    print(f"\n🔍 Fetching project {project_id}...\n")

    response = requests.get(f'{base_url}/projects/{project_id}/')

    if response.status_code == 200:
        data = response.json()
        project = data.get('data', {})

        print("=" * 60)
        print("PROJECT DETAILS")
        print("=" * 60)

        print(f"\n📋 BASIC INFO:")
        print(f"  Title: {project.get('title', 'N/A')}")
        print(f"  Project ID: {project.get('project_id', 'N/A')}")
        print(f"  Status: {project.get('status', 'N/A')}")

        print(f"\n💰 FINANCIAL INFO:")
        print(f"  Budget: {project.get('currency', '')} {project.get('budget', 'N/A')}")
        print(f"  Total Obligation: {project.get('total_obligation_amount', 'N/A')}")
        print(f"  Currency: {project.get('currency', 'N/A')}")

        print(f"\n📅 TIMELINE:")
        print(f"  Start Date: {project.get('start_date', 'N/A')}")
        print(f"  End Date: {project.get('end_date', 'N/A')}")

        print(f"\n📊 STAKEHOLDERS:")
        print(f"  Project Managers: {len(project.get('project_managers', []))}")
        print(f"  Beneficiaries: {len(project.get('beneficiaries', []))}")
        print(f"  Funding Sources: {len(project.get('funding_sources', []))}")

        print(f"\n🎯 PERFORMANCE:")
        print(f"  Targets Defined: {len(project.get('targets', []))}")
        print(f"  Achievement vs Target: {project.get('achievement_against_target', 'N/A')}")
        print(f"  Budget Performance: {project.get('budget_performance', 'N/A')}")

        print(f"\n📍 LOCATION:")
        locations = project.get('location', [])
        if locations:
            print(f"  {', '.join([loc.get('name', '') for loc in locations])}")
        else:
            print("  N/A")

        print(f"\n📝 DESCRIPTION:")
        goal = project.get('goal', '')
        if goal:
            print(f"  Goal: {goal[:150]}{'...' if len(goal) > 150 else ''}")
        else:
            print("  Goal: N/A")

        print("\n" + "=" * 60)
        print("✅ PROJECT HAS:")
        print("=" * 60)

        has_budget = bool(project.get('budget'))
        has_obligation = bool(project.get('total_obligation_amount'))
        has_timeline = bool(project.get('start_date') and project.get('end_date'))
        has_managers = len(project.get('project_managers', [])) > 0
        has_targets = len(project.get('targets', [])) > 0

        print(f"  {'✅' if has_budget else '❌'} Budget Information")
        print(f"  {'✅' if has_obligation else '❌'} Obligation Amount")
        print(f"  {'✅' if has_timeline else '❌'} Timeline (Start/End dates)")
        print(f"  {'✅' if has_managers else '❌'} Project Managers")
        print(f"  {'✅' if has_targets else '❌'} Performance Targets")

        print("\n" + "=" * 60)
        print("FULL JSON RESPONSE:")
        print("=" * 60)
        print(json.dumps(project, indent=2))

    else:
        print(f"❌ Error: HTTP {response.status_code}")
        print(f"Response: {response.text}")

except requests.exceptions.RequestException as e:
    print(f"❌ Request failed: {e}")
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    import traceback
    traceback.print_exc()
