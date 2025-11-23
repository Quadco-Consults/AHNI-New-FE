/**
 * Permission Debugging Utility
 *
 * This utility helps debug permission issues by showing:
 * 1. What permissions the user has
 * 2. What permissions each sidebar item requires
 * 3. Why specific items are hidden/shown
 * 4. Mismatches between required and available permissions
 */

interface PermissionDebugInfo {
  userModules: string[];
  userPermissions: { [module: string]: string[] };
  sidebarRequirements: { [itemName: string]: any };
  mismatches: { [itemName: string]: string[] };
  recommendations: string[];
}

export function debugUserPermissions(
  userPermissions: any[],
  sidebarItems: any[],
  globalHubItems?: any[]
): PermissionDebugInfo {
  console.log('🚀 === PERMISSION DEBUGGING STARTED ===');

  // Extract user's modules and codenames
  const userModules = userPermissions.map(p => p.module);
  const userPermissionsByModule: { [module: string]: string[] } = {};

  userPermissions.forEach(modulePerms => {
    userPermissionsByModule[modulePerms.module] = modulePerms.permissions.map(
      (p: any) => p.codename
    );
  });

  console.log('👤 USER HAS ACCESS TO MODULES:', userModules);
  console.log('🔐 USER PERMISSIONS BY MODULE:', userPermissionsByModule);

  // Analyze sidebar requirements
  const sidebarRequirements: { [itemName: string]: any } = {};
  const mismatches: { [itemName: string]: string[] } = {};

  const analyzeItem = (item: any, path: string = '') => {
    const itemPath = path ? `${path} > ${item.name}` : item.name;

    if (item.permissions && item.permissions.length > 0) {
      sidebarRequirements[itemPath] = item.permissions;

      // Check if user has required permissions
      const hasAccess = item.permissions.some((requirement: any) => {
        const userModulePerms = userPermissionsByModule[requirement.module];

        if (!userModulePerms) {
          mismatches[itemPath] = [`Missing module: ${requirement.module}`];
          return false;
        }

        const missingCodenames = requirement.codenames.filter(
          (codename: string) => !userModulePerms.includes(codename)
        );

        if (missingCodenames.length > 0) {
          mismatches[itemPath] = [
            `Missing codenames in ${requirement.module}: ${missingCodenames.join(', ')}`
          ];
          return false;
        }

        return true;
      });

      console.log(`${hasAccess ? '✅' : '❌'} ${itemPath}`);
      if (!hasAccess && mismatches[itemPath]) {
        console.log(`   ❗ ${mismatches[itemPath].join('; ')}`);
      }
    } else {
      console.log(`⚪ ${itemPath} (No permissions required)`);
    }

    // Recursively check children
    if (item.children) {
      item.children.forEach((child: any) => analyzeItem(child, itemPath));
    }
  };

  console.log('\n📋 ANALYZING SIDEBAR ITEMS:');
  sidebarItems.forEach(item => analyzeItem(item));

  if (globalHubItems) {
    console.log('\n🌐 ANALYZING GLOBAL HUB ITEMS:');
    globalHubItems.forEach(item => {
      const itemName = `Global Hub: ${item.label}`;

      if (item.permissions && item.permissions.length > 0) {
        sidebarRequirements[itemName] = item.permissions;

        const hasAccess = item.permissions.some((requirement: any) => {
          const userModulePerms = userPermissionsByModule[requirement.module];

          if (!userModulePerms) {
            mismatches[itemName] = [`Missing module: ${requirement.module}`];
            return false;
          }

          const missingCodenames = requirement.codenames.filter(
            (codename: string) => !userModulePerms.includes(codename)
          );

          if (missingCodenames.length > 0) {
            mismatches[itemName] = [
              `Missing codenames in ${requirement.module}: ${missingCodenames.join(', ')}`
            ];
            return false;
          }

          return true;
        });

        console.log(`${hasAccess ? '✅' : '❌'} ${itemName}`);
        if (!hasAccess && mismatches[itemName]) {
          console.log(`   ❗ ${mismatches[itemName].join('; ')}`);
        }
      } else {
        console.log(`⚪ ${itemName} (No permissions required)`);
      }
    });
  }

  // Generate recommendations
  const recommendations: string[] = [];

  // Check what modules user has that might not be used
  const usedModules = Object.values(sidebarRequirements)
    .flat()
    .map((req: any) => req.module)
    .filter((module, index, arr) => arr.indexOf(module) === index);

  const unusedModules = userModules.filter(module => !usedModules.includes(module));

  if (unusedModules.length > 0) {
    recommendations.push(
      `User has permissions for modules not used in sidebar: ${unusedModules.join(', ')}`
    );
  }

  // Check for common missing modules
  const commonMissingModules = ['programs', 'procurements', 'hr', 'finance', 'contract_grants']
    .filter(module => !userModules.includes(module));

  if (commonMissingModules.length > 0) {
    recommendations.push(
      `Consider adding permissions for common modules: ${commonMissingModules.join(', ')}`
    );
  }

  console.log('\n💡 RECOMMENDATIONS:');
  recommendations.forEach(rec => console.log(`   • ${rec}`));

  console.log('\n🚀 === PERMISSION DEBUGGING COMPLETED ===');

  return {
    userModules,
    userPermissions: userPermissionsByModule,
    sidebarRequirements,
    mismatches,
    recommendations
  };
}

/**
 * Quick permission checker for a specific item
 */
export function checkSpecificPermission(
  userPermissions: any[],
  requiredModule: string,
  requiredCodenames: string[]
): {
  hasAccess: boolean;
  missing: string[];
  available: string[];
} {
  const userModulePerms = userPermissions.find(p => p.module === requiredModule);

  if (!userModulePerms) {
    return {
      hasAccess: false,
      missing: [`Module ${requiredModule} not available`],
      available: []
    };
  }

  const userCodenames = userModulePerms.permissions.map((p: any) => p.codename);
  const missing = requiredCodenames.filter(codename => !userCodenames.includes(codename));

  return {
    hasAccess: missing.length === 0,
    missing,
    available: userCodenames
  };
}

/**
 * Find items user CAN access
 */
export function findAccessibleItems(
  userPermissions: any[],
  sidebarItems: any[],
  globalHubItems?: any[]
): string[] {
  const accessible: string[] = [];

  const checkItem = (item: any, path: string = '') => {
    const itemPath = path ? `${path} > ${item.name}` : item.name;

    if (!item.permissions || item.permissions.length === 0) {
      accessible.push(itemPath + ' (No permissions required)');
      return;
    }

    const hasAccess = item.permissions.some((requirement: any) => {
      const result = checkSpecificPermission(
        userPermissions,
        requirement.module,
        requirement.codenames
      );
      return result.hasAccess;
    });

    if (hasAccess) {
      accessible.push(itemPath);
    }

    if (item.children) {
      item.children.forEach((child: any) => checkItem(child, itemPath));
    }
  };

  sidebarItems.forEach(item => checkItem(item));

  if (globalHubItems) {
    globalHubItems.forEach(item => {
      const itemName = `Global Hub: ${item.label}`;

      if (!item.permissions || item.permissions.length === 0) {
        accessible.push(itemName + ' (No permissions required)');
        return;
      }

      const hasAccess = item.permissions.some((requirement: any) => {
        const result = checkSpecificPermission(
          userPermissions,
          requirement.module,
          requirement.codenames
        );
        return result.hasAccess;
      });

      if (hasAccess) {
        accessible.push(itemName);
      }
    });
  }

  return accessible;
}