#!/bin/bash
# Remove old directories that have been moved to features
rm -rf src/components/forms
rm -rf src/components/features  
rm -rf src/components/account
rm -rf src/components/audit-log
rm -rf src/components/configs-types
rm -rf src/components/dashboard
rm -rf src/components/modals/dailog

echo "Cleanup completed - old directories removed"