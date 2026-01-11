#!/bin/bash

# Script to remove leading slashes from all endpoint definitions
# This prevents double slash issues in API URLs

echo "Finding and fixing endpoints with leading slashes..."

# Find all .ts and .tsx files with endpoint definitions that have leading slashes
# and remove the leading slash

find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  -e 's/endpoint: "\/\(.*\)"/endpoint: "\1"/g' \
  -e "s/endpoint: '\/\(.*\)'/endpoint: '\1'/g" \
  {} +

echo "✅ Fixed all endpoint definitions"
echo "Verifying changes..."

# Count remaining endpoints with leading slashes
remaining=$(grep -r "endpoint.*:[[:space:]]*['\"]/" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | wc -l)
echo "Remaining endpoints with leading slashes: $remaining"
