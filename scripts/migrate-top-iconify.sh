#!/bin/bash

# Top @iconify icons to Lucide migration script
# Focuses on the most frequently used icons first

echo "🔄 Migrating top @iconify icons to Lucide React..."

# Array of files that contain @iconify imports
iconify_files=(
    "src/features/notifications/components/NotificationListInfinite.tsx"
    "src/features/notifications/components/NotificationPreferences.tsx"
    "src/features/notifications/components/notifications/index.tsx"
    "src/components/ProjectsEditHeading.tsx"
    "src/components/Sidebar.tsx"
    "src/components/EmployeeRegistrationHeading.tsx"
    "src/features/procurement/components/solicitation-management/RFQ/create/Quotation.tsx"
)

# Function to migrate a specific icon pattern
migrate_icon_pattern() {
    local file="$1"
    local iconify_icon="$2"
    local lucide_icon="$3"
    local import_name="$4"

    if grep -q "$iconify_icon" "$file"; then
        echo "  📝 Migrating $iconify_icon → $lucide_icon in $(basename "$file")"

        # Replace icon usage
        sed -i '' "s/<Icon icon=\"$iconify_icon\"[^>]*className=\"\([^\"]*\)\"[^>]*\/>/<$lucide_icon className=\"\1\" \/>/g" "$file"
        sed -i '' "s/<Icon icon=\"$iconify_icon\"[^>]*fontSize={\?\([0-9]*\)}\?[^>]*\/>/<$lucide_icon size={\1} \/>/g" "$file"
        sed -i '' "s/<Icon icon=\"$iconify_icon\"[^>]*\/>/<$lucide_icon \/>/g" "$file"

        # Add import if not already present
        if ! grep -q "import.*$import_name.*from.*lucide-react" "$file"; then
            if grep -q "from.*lucide-react" "$file"; then
                # Add to existing lucide import
                sed -i '' "s/import { \([^}]*\) } from ['\"]lucide-react['\"]/import { \1, $import_name } from 'lucide-react'/g" "$file"
            else
                # Add new import line after other imports
                sed -i '' "s/import { Icon } from ['\"]@iconify\/react['\"]/import { $import_name } from 'lucide-react';\nimport { Icon } from \"@iconify\/react\"/g" "$file"
            fi
        fi
    fi
}

# Function to clean up unused @iconify import
cleanup_unused_iconify() {
    local file="$1"

    if ! grep -q "<Icon" "$file" && grep -q "import { Icon } from \"@iconify/react\"" "$file"; then
        echo "  🗑️  Removing unused @iconify import from $(basename "$file")"
        sed -i '' '/import { Icon } from "@iconify\/react";/d' "$file"
    fi
}

echo "📋 Starting migration of most common icons..."

# Migrate most common icons across all files
for file in "${iconify_files[@]}"; do
    if [ -f "$file" ]; then
        echo "📝 Processing: $file"

        # High-frequency icons (8+ usages each)
        migrate_icon_pattern "$file" "solar:pen-bold-duotone" "Edit" "Edit"
        migrate_icon_pattern "$file" "ant-design:delete-twotone" "Trash2" "Trash2"

        # Medium-high frequency icons (6 usages each)
        migrate_icon_pattern "$file" "solar:check-circle-bold" "CheckCircle" "CheckCircle"
        migrate_icon_pattern "$file" "ph:upload" "Upload" "Upload"
        migrate_icon_pattern "$file" "ph:eye-duotone" "Eye" "Eye"
        migrate_icon_pattern "$file" "iconoir:slash" "X" "X"

        # Medium frequency icons (5 usages each)
        migrate_icon_pattern "$file" "solar:verified-check-bold" "CheckCircle2" "CheckCircle2"
        migrate_icon_pattern "$file" "solar:document-bold-duotone" "FileText" "FileText"
        migrate_icon_pattern "$file" "mdi:alert-circle" "AlertCircle" "AlertCircle"

        # Common functional icons (4+ usages)
        migrate_icon_pattern "$file" "ph:download" "Download" "Download"
        migrate_icon_pattern "$file" "ph:check-circle" "CheckCircle" "CheckCircle"
        migrate_icon_pattern "$file" "ph:check-circle-duotone" "CheckCircle" "CheckCircle"
        migrate_icon_pattern "$file" "mdi:check-circle" "CheckCircle" "CheckCircle"

        # Loading/spinner icons
        migrate_icon_pattern "$file" "lucide:loader-2" "Loader2" "Loader2"
        migrate_icon_pattern "$file" "eos-icons:loading" "Loader2" "Loader2"
        migrate_icon_pattern "$file" "line-md:loading-loop" "Loader2" "Loader2"
        migrate_icon_pattern "$file" "ph:spinner" "Loader2" "Loader2"

        # Navigation icons
        migrate_icon_pattern "$file" "ph:arrow-left-duotone" "ArrowLeft" "ArrowLeft"
        migrate_icon_pattern "$file" "ph:arrow-left" "ArrowLeft" "ArrowLeft"
        migrate_icon_pattern "$file" "ph:arrow-right" "ArrowRight" "ArrowRight"
        migrate_icon_pattern "$file" "hugeicons:arrow-left-double" "DoubleArrowLeft" "DoubleArrowLeft"
        migrate_icon_pattern "$file" "hugeicons:arrow-right-double" "DoubleArrowRight" "DoubleArrowRight"

        # Notification icons
        migrate_icon_pattern "$file" "mdi:notification-clear-all" "Bell" "Bell"
        migrate_icon_pattern "$file" "mdi:bell-outline" "Bell" "Bell"
        migrate_icon_pattern "$file" "mdi:check-all" "CheckCircle2" "CheckCircle2"
        migrate_icon_pattern "$file" "mdi:chevron-down" "ChevronDown" "ChevronDown"

        # Search icons
        migrate_icon_pattern "$file" "iconamoon:search-light" "Search" "Search"
        migrate_icon_pattern "$file" "ph:magnifying-glass" "Search" "Search"

        # Document icons
        migrate_icon_pattern "$file" "solar:document-text-bold" "FileText" "FileText"
        migrate_icon_pattern "$file" "solar:document-text-bold-duotone" "FileText" "FileText"
        migrate_icon_pattern "$file" "solar:document-bold" "File" "File"
        migrate_icon_pattern "$file" "solar:document-add-bold" "FilePlus" "FilePlus"
        migrate_icon_pattern "$file" "ph:file-text-duotone" "FileText" "FileText"
        migrate_icon_pattern "$file" "ph:file-pdf-duotone" "File" "File"
        migrate_icon_pattern "$file" "mdi:file-outline" "File" "File"
        migrate_icon_pattern "$file" "mdi:file-document-outline" "FileText" "FileText"

        # User icons
        migrate_icon_pattern "$file" "solar:user-bold" "User" "User"
        migrate_icon_pattern "$file" "solar:user-id-bold-duotone" "UserCheck" "UserCheck"
        migrate_icon_pattern "$file" "ph:user-circle-duotone" "User" "User"
        migrate_icon_pattern "$file" "ph:user-focus-duotone" "UserFocus" "UserFocus"
        migrate_icon_pattern "$file" "mdi:account-plus" "UserPlus" "UserPlus"
        migrate_icon_pattern "$file" "mdi:account-group-outline" "Users" "Users"
        migrate_icon_pattern "$file" "solar:users-group-rounded-bold-duotone" "Users" "Users"
        migrate_icon_pattern "$file" "solar:users-group-two-rounded-bold-duotone" "Users" "Users"
        migrate_icon_pattern "$file" "ph:users-three-duotone" "Users" "Users"

        # Information/feedback icons
        migrate_icon_pattern "$file" "mdi:information-outline" "Info" "Info"
        migrate_icon_pattern "$file" "ph:info-duotone" "Info" "Info"
        migrate_icon_pattern "$file" "solar:info-circle-bold" "Info" "Info"
        migrate_icon_pattern "$file" "heroicons:information-circle" "Info" "Info"

        # Clock/time icons
        migrate_icon_pattern "$file" "mdi:clock-outline" "Clock" "Clock"
        migrate_icon_pattern "$file" "mdi:clock-fast" "Clock" "Clock"
        migrate_icon_pattern "$file" "ph:clock-duotone" "Clock" "Clock"
        migrate_icon_pattern "$file" "ph:clock-countdown-duotone" "Clock" "Clock"
        migrate_icon_pattern "$file" "ph:clock-countdown" "Clock" "Clock"

        # Calendar icons
        migrate_icon_pattern "$file" "solar:calendar-bold-duotone" "Calendar" "Calendar"
        migrate_icon_pattern "$file" "ph:calendar-duotone" "Calendar" "Calendar"
        migrate_icon_pattern "$file" "ph:calendar-check-duotone" "CalendarCheck" "CalendarCheck"
        migrate_icon_pattern "$file" "mdi:calendar-clock" "CalendarClock" "CalendarClock"

        # Clean up unused imports
        cleanup_unused_iconify "$file"
    fi
done

echo "✅ Top icons migration completed!"
echo "🔍 Checking remaining @iconify usage..."

remaining=$(find src -name "*.tsx" -o -name "*.ts" | xargs grep -l "Icon.*icon=" | wc -l)
remaining_icons=$(find src -name "*.tsx" -o -name "*.ts" | xargs grep -o 'icon="[^"]*"' | sort | uniq | wc -l)

echo "📊 Files with remaining @iconify usage: $remaining"
echo "📊 Unique remaining icons: $remaining_icons"

if [ "$remaining" -gt 0 ]; then
    echo ""
    echo "📋 Remaining icons to migrate:"
    find src -name "*.tsx" -o -name "*.ts" | xargs grep -o 'icon="[^"]*"' | sort | uniq
fi

echo ""
echo "🎉 Migration script completed!"