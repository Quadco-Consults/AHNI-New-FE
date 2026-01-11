#!/bin/bash

echo "🔧 Fixing BarChart3 imports across the codebase..."

# List of files that contain BarChart3
files=(
  "src/features/procurement/components/competitive-bid-analysis/[id]/committee-evaluation/MemberEvaluationDashboard.tsx"
  "src/app/dashboard/Dashboard.tsx"
  "src/features/procurement/components/Price-intelligence.tsx"
  "src/app/about/page.tsx"
  "src/features/procurement/components/rfq-management/RFQDistributionStatus.tsx"
  "src/components/VendorSidebar.tsx"
  "src/features/programs/components/table-columns/evaluation/site-visits-evaluation.tsx"
  "src/features/programs/components/plan/site-visit/SiteVisitDashboard.tsx"
  "src/features/programs/components/plan/site-visit/EnhancedSiteVisitDashboard.tsx"
  "src/features/programs/components/plan/annual-supervision/AnnualPlanDashboard.tsx"
  "src/features/programs/components/evaluation/SupervisionEvaluationDashboard.tsx"
  "src/features/procurement/components/competitive-bid-analysis/[id]/committee-evaluation/RFPDocumentViewer.tsx"
  "src/features/hr/components/workforce-need-analysis/view/index.tsx"
  "src/features/hr/components/leave-management/LeaveDashboard.tsx"
  "src/features/finance/components/dashboard/FinanceDashboardStats.tsx"
  "src/components/icons/IconifyToLucideMap.tsx"
  "src/components/icons/IconMap.tsx"
  "src/app/dashboard/programs/plan/supervision-evaluation/page.tsx"
  "src/app/dashboard/programs/plan/supervision-evaluation-new/page.tsx"
)

# Replace BarChart3 with BarChart in all files
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Processing: $file"
    sed -i '' 's/BarChart3/BarChart/g' "$file"
  else
    echo "⚠️  File not found: $file"
  fi
done

echo "✅ All BarChart3 references have been replaced with BarChart"
echo "🔄 Please restart your development server for changes to take effect"