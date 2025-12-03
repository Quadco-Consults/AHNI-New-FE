#!/bin/bash

# @iconify/react to Lucide React Migration Script
# This script systematically replaces @iconify icons with their Lucide equivalents

echo "🔄 Starting @iconify/react to Lucide React migration..."

# Create backup
echo "📁 Creating backup of src directory..."
cp -r src src_backup_$(date +%Y%m%d_%H%M%S)

# Function to replace iconify with lucide import and usage
migrate_file() {
    local file="$1"
    echo "📝 Migrating: $file"

    # Create temp file for processing
    local temp_file="${file}.temp"
    cp "$file" "$temp_file"

    # Track if we need to add lucide imports
    local needs_lucide_import=false
    local lucide_imports=()

    # Solar Icons - High Usage (8 icons each)
    if grep -q 'icon="solar:pen-bold-duotone"' "$temp_file"; then
        sed -i '' 's/<Icon icon="solar:pen-bold-duotone"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<Edit size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="solar:pen-bold-duotone"[^>]*\/>/<Edit size={16} \/>/g' "$temp_file"
        lucide_imports+=("Edit")
        needs_lucide_import=true
    fi

    # Ant Design delete icons (8 usages)
    if grep -q 'icon="ant-design:delete-twotone"' "$temp_file"; then
        sed -i '' 's/<Icon icon="ant-design:delete-twotone"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<Trash2 size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="ant-design:delete-twotone"[^>]*\/>/<Trash2 size={16} \/>/g' "$temp_file"
        lucide_imports+=("Trash2")
        needs_lucide_import=true
    fi

    # Solar check circle (6 usages)
    if grep -q 'icon="solar:check-circle-bold"' "$temp_file"; then
        sed -i '' 's/<Icon icon="solar:check-circle-bold"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<CheckCircle size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="solar:check-circle-bold"[^>]*\/>/<CheckCircle size={16} \/>/g' "$temp_file"
        lucide_imports+=("CheckCircle")
        needs_lucide_import=true
    fi

    # Phosphor upload (6 usages)
    if grep -q 'icon="ph:upload"' "$temp_file"; then
        sed -i '' 's/<Icon icon="ph:upload"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<Upload size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="ph:upload"[^>]*\/>/<Upload size={16} \/>/g' "$temp_file"
        lucide_imports+=("Upload")
        needs_lucide_import=true
    fi

    # Phosphor eye duotone (6 usages)
    if grep -q 'icon="ph:eye-duotone"' "$temp_file"; then
        sed -i '' 's/<Icon icon="ph:eye-duotone"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<Eye size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="ph:eye-duotone"[^>]*\/>/<Eye size={16} \/>/g' "$temp_file"
        lucide_imports+=("Eye")
        needs_lucide_import=true
    fi

    # Iconoir slash (6 usages)
    if grep -q 'icon="iconoir:slash"' "$temp_file"; then
        sed -i '' 's/<Icon icon="iconoir:slash"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<X size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="iconoir:slash"[^>]*\/>/<X size={16} \/>/g' "$temp_file"
        lucide_imports+=("X")
        needs_lucide_import=true
    fi

    # Solar verified check (5 usages)
    if grep -q 'icon="solar:verified-check-bold"' "$temp_file"; then
        sed -i '' 's/<Icon icon="solar:verified-check-bold"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<CheckCircle2 size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="solar:verified-check-bold"[^>]*\/>/<CheckCircle2 size={16} \/>/g' "$temp_file"
        lucide_imports+=("CheckCircle2")
        needs_lucide_import=true
    fi

    # Solar document bold duotone (5 usages)
    if grep -q 'icon="solar:document-bold-duotone"' "$temp_file"; then
        sed -i '' 's/<Icon icon="solar:document-bold-duotone"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<FileText size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="solar:document-bold-duotone"[^>]*\/>/<FileText size={16} \/>/g' "$temp_file"
        lucide_imports+=("FileText")
        needs_lucide_import=true
    fi

    # MDI alert circle (5 usages)
    if grep -q 'icon="mdi:alert-circle"' "$temp_file"; then
        sed -i '' 's/<Icon icon="mdi:alert-circle"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<AlertCircle size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="mdi:alert-circle"[^>]*\/>/<AlertCircle size={16} \/>/g' "$temp_file"
        lucide_imports+=("AlertCircle")
        needs_lucide_import=true
    fi

    # Continue with remaining high-frequency icons...

    # Phosphor download (4 usages)
    if grep -q 'icon="ph:download"' "$temp_file"; then
        sed -i '' 's/<Icon icon="ph:download"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<Download size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="ph:download"[^>]*\/>/<Download size={16} \/>/g' "$temp_file"
        lucide_imports+=("Download")
        needs_lucide_import=true
    fi

    # Phosphor check circle (4 usages)
    if grep -q 'icon="ph:check-circle"' "$temp_file"; then
        sed -i '' 's/<Icon icon="ph:check-circle"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<CheckCircle size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="ph:check-circle"[^>]*\/>/<CheckCircle size={16} \/>/g' "$temp_file"
        lucide_imports+=("CheckCircle")
        needs_lucide_import=true
    fi

    # MDI check circle (4 usages)
    if grep -q 'icon="mdi:check-circle"' "$temp_file"; then
        sed -i '' 's/<Icon icon="mdi:check-circle"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<CheckCircle size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="mdi:check-circle"[^>]*\/>/<CheckCircle size={16} \/>/g' "$temp_file"
        lucide_imports+=("CheckCircle")
        needs_lucide_import=true
    fi

    # Add more common patterns...

    # Loading icons
    if grep -q 'icon="lucide:loader-2"' "$temp_file"; then
        sed -i '' 's/<Icon icon="lucide:loader-2"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<Loader2 size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="lucide:loader-2"[^>]*\/>/<Loader2 size={16} \/>/g' "$temp_file"
        lucide_imports+=("Loader2")
        needs_lucide_import=true
    fi

    if grep -q 'icon="eos-icons:loading"' "$temp_file"; then
        sed -i '' 's/<Icon icon="eos-icons:loading"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<Loader2 size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="eos-icons:loading"[^>]*\/>/<Loader2 size={16} \/>/g' "$temp_file"
        lucide_imports+=("Loader2")
        needs_lucide_import=true
    fi

    if grep -q 'icon="line-md:loading-loop"' "$temp_file"; then
        sed -i '' 's/<Icon icon="line-md:loading-loop"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<Loader2 size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="line-md:loading-loop"[^>]*\/>/<Loader2 size={16} \/>/g' "$temp_file"
        lucide_imports+=("Loader2")
        needs_lucide_import=true
    fi

    # Search icons
    if grep -q 'icon="iconamoon:search-light"' "$temp_file"; then
        sed -i '' 's/<Icon icon="iconamoon:search-light"[^>]*fontSize={\?[0-9]*}\?[^>]*\/>/<Search size={16} \/>/g' "$temp_file"
        sed -i '' 's/<Icon icon="iconamoon:search-light"[^>]*\/>/<Search size={16} \/>/g' "$temp_file"
        lucide_imports+=("Search")
        needs_lucide_import=true
    fi

    # Remove duplicate imports
    IFS=" " read -ra UNIQUE_IMPORTS <<< "$(printf '%s\n' "${lucide_imports[@]}" | sort -u | tr '\n' ' ')"

    # If we need lucide imports, add them
    if [ "$needs_lucide_import" = true ]; then
        # Check if lucide-react is already imported
        if grep -q "from ['\"]lucide-react['\"]" "$temp_file"; then
            # Add to existing import
            for import in "${UNIQUE_IMPORTS[@]}"; do
                if ! grep -q "$import" "$temp_file"; then
                    # Add to the import list
                    sed -i '' "s/import { \([^}]*\) } from ['\"]lucide-react['\"]/import { \1, $import } from 'lucide-react'/g" "$temp_file"
                fi
            done
        else
            # Add new lucide-react import
            imports_string=$(IFS=', '; echo "${UNIQUE_IMPORTS[*]}")
            if grep -q "from ['\"]@iconify/react['\"]" "$temp_file"; then
                # Add before iconify import
                sed -i '' "s/import { Icon } from ['\"]@iconify\/react['\"]/import { $imports_string } from 'lucide-react';\nimport { Icon } from \"@iconify\/react\"/g" "$temp_file"
            else
                # Add at the top with other imports
                sed -i '' "1i\\
import { $imports_string } from 'lucide-react';
" "$temp_file"
            fi
        fi

        # Remove @iconify import if no more Icon usage
        if ! grep -q "<Icon" "$temp_file"; then
            sed -i '' '/import { Icon } from "@iconify\/react";/d' "$temp_file"
        fi
    fi

    # Replace original file with migrated version
    mv "$temp_file" "$file"
}

# Get all files using @iconify/react
echo "🔍 Finding files with @iconify/react usage..."
iconify_files=$(grep -r "from ['\"]@iconify/react['\"]" src --include="*.tsx" --include="*.ts" -l)

if [ -z "$iconify_files" ]; then
    echo "✅ No @iconify/react imports found!"
    exit 0
fi

echo "📋 Found $(echo "$iconify_files" | wc -l) files to migrate:"
echo "$iconify_files"

# Migrate each file
while IFS= read -r file; do
    migrate_file "$file"
done <<< "$iconify_files"

echo "✅ Migration phase 1 complete!"
echo "🔍 Checking for remaining @iconify usage..."

remaining=$(grep -r "Icon.*icon=" src --include="*.tsx" --include="*.ts" | wc -l)
echo "📊 Remaining @iconify icon usages: $remaining"

if [ "$remaining" -gt 0 ]; then
    echo "⚠️  Some icons may need manual migration. Check the migration map:"
    echo "📁 src/components/icons/IconifyToLucideMap.tsx"
fi

echo "🎉 @iconify/react migration script completed!"