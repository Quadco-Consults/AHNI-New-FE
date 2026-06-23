#!/bin/bash

# AHNI Color Migration Script
# Replaces hardcoded hex colors with design tokens
# Preserves AHNI brand identity while improving consistency

set -e

echo "🎨 AHNI Color Migration Script"
echo "================================"
echo ""
echo "This script will replace hardcoded hex colors with design tokens"
echo "while preserving the AHNI brand colors (#FF0000, #FFF2F2)"
echo ""

# Create backup
BACKUP_DIR="../ahni-fe-backup-$(date +%Y%m%d-%H%M%S)"
echo "📦 Creating backup at: $BACKUP_DIR"
cp -r ../ahni-fe "$BACKUP_DIR"
echo "✅ Backup created"
echo ""

# Counter for tracking changes
TOTAL_CHANGES=0

echo "🚀 Starting migration..."
echo ""

# Priority 1: High usage colors with existing tokens

echo "📦 [1/8] Migrating #DEA004 (Yellow/Gold) - 180 uses..."
BEFORE=$(grep -r "DEA004" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/text-\[#DEA004\]/text-yellow-darker/g' {} + \
  -exec sed -i '' 's/bg-\[#DEA004\]/bg-yellow-darker/g' {} + \
  -exec sed -i '' 's/border-\[#DEA004\]/border-yellow-darker/g' {} +
AFTER=$(grep -r "DEA004" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
CHANGED=$((BEFORE - AFTER))
TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGED))
echo "   ✅ Migrated $CHANGED occurrences"
echo ""

echo "📦 [2/8] Migrating #756D6D (Gray Text) - 112 uses..."
BEFORE=$(grep -r "756D6D" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/text-\[#756D6D\]/text-gray-text/g' {} + \
  -exec sed -i '' 's/bg-\[#756D6D\]/bg-gray-text/g' {} + \
  -exec sed -i '' 's/border-\[#756D6D\]/border-gray-text/g' {} +
AFTER=$(grep -r "756D6D" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
CHANGED=$((BEFORE - AFTER))
TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGED))
echo "   ✅ Migrated $CHANGED occurrences"
echo ""

echo "📦 [3/8] Migrating #FF0000 (AHNI Primary Red) - 96 uses..."
BEFORE=$(grep -r "FF0000" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/text-\[#FF0000\]/text-primary/g' {} + \
  -exec sed -i '' 's/bg-\[#FF0000\]/bg-primary/g' {} + \
  -exec sed -i '' 's/border-\[#FF0000\]/border-primary/g' {} +
AFTER=$(grep -r "FF0000" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
CHANGED=$((BEFORE - AFTER))
TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGED))
echo "   ✅ Migrated $CHANGED occurrences"
echo ""

echo "📦 [4/8] Migrating #C7CBD5 (Gray Border) - 95 uses..."
BEFORE=$(grep -r "C7CBD5" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/border-\[#C7CBD5\]/border-gray-border/g' {} + \
  -exec sed -i '' 's/bg-\[#C7CBD5\]/bg-gray-border/g' {} + \
  -exec sed -i '' 's/text-\[#C7CBD5\]/text-gray-border/g' {} +
AFTER=$(grep -r "C7CBD5" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
CHANGED=$((BEFORE - AFTER))
TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGED))
echo "   ✅ Migrated $CHANGED occurrences"
echo ""

echo "📦 [5/8] Migrating #FFF2F2 (AHNI Light Pink) - 62 uses..."
BEFORE=$(grep -r "FFF2F2" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/bg-\[#FFF2F2\]/bg-brand-light/g' {} + \
  -exec sed -i '' 's/text-\[#FFF2F2\]/text-brand-light/g' {} + \
  -exec sed -i '' 's/border-\[#FFF2F2\]/border-brand-light/g' {} +
AFTER=$(grep -r "FFF2F2" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
CHANGED=$((BEFORE - AFTER))
TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGED))
echo "   ✅ Migrated $CHANGED occurrences"
echo ""

echo "📦 [6/8] Migrating #F9F9F9 (Alternate Light) - 60 uses..."
BEFORE=$(grep -r "F9F9F9" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/bg-\[#F9F9F9\]/bg-alternate-light/g' {} + \
  -exec sed -i '' 's/text-\[#F9F9F9\]/text-alternate-light/g' {} + \
  -exec sed -i '' 's/border-\[#F9F9F9\]/border-alternate-light/g' {} +
AFTER=$(grep -r "F9F9F9" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
CHANGED=$((BEFORE - AFTER))
TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGED))
echo "   ✅ Migrated $CHANGED occurrences"
echo ""

echo "📦 [7/8] Migrating #10B981 (Success Green) - 45 uses..."
BEFORE=$(grep -r "10B981" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/text-\[#10B981\]/text-success/g' {} + \
  -exec sed -i '' 's/bg-\[#10B981\]/bg-success/g' {} + \
  -exec sed -i '' 's/border-\[#10B981\]/border-success/g' {} +
AFTER=$(grep -r "10B981" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
CHANGED=$((BEFORE - AFTER))
TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGED))
echo "   ✅ Migrated $CHANGED occurrences"
echo ""

echo "📦 [8/8] Migrating #D92D20 (Error Red) - 43 uses..."
BEFORE=$(grep -r "D92D20" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
find src/ -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/text-\[#D92D20\]/text-error/g' {} + \
  -exec sed -i '' 's/bg-\[#D92D20\]/bg-error/g' {} + \
  -exec sed -i '' 's/border-\[#D92D20\]/border-error/g' {} +
AFTER=$(grep -r "D92D20" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | xargs)
CHANGED=$((BEFORE - AFTER))
TOTAL_CHANGES=$((TOTAL_CHANGES + CHANGED))
echo "   ✅ Migrated $CHANGED occurrences"
echo ""

echo "================================"
echo "✅ Migration Complete!"
echo ""
echo "📊 Summary:"
echo "   Total occurrences migrated: $TOTAL_CHANGES"
echo "   Backup location: $BACKUP_DIR"
echo ""
echo "⚠️  IMPORTANT: Manual review needed for:"
echo "   1. SVG fillColor props (e.g., <Icon fillColor='#FF0000' />)"
echo "   2. Inline style objects (e.g., style={{ color: '#FF0000' }})"
echo "   3. Template literals with colors"
echo ""
echo "🔍 To find remaining hardcoded colors:"
echo "   grep -r '#[0-9A-Fa-f]\\{6\\}' src/ --include='*.tsx' --include='*.ts' | grep -v node_modules"
echo ""
echo "🧪 Next steps:"
echo "   1. Run: npm run build"
echo "   2. Test in browser (light mode)"
echo "   3. Test in browser (dark mode)"
echo "   4. Review and commit changes"
echo ""
echo "📝 See COLOR_MIGRATION_PLAN.md for full details"
echo ""
