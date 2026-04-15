/**
 * Utility to create consumable subcategories
 *
 * Run this from browser console:
 * import('/utils/createConsumableSubcategories').then(m => m.createConsumableSubcategories())
 */

import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

// Consumables parent category UUID
const CONSUMABLES_CATEGORY_UUID = "fadb6228-23de-4b04-9eac-b75940cf622f";

// Common consumable subcategories
const CONSUMABLE_SUBCATEGORIES = [
  {
    name: "Office Consumable",
    description: "Office supplies and stationery items like pens, paper, folders, etc.",
  },
  {
    name: "Medical Consumable",
    description: "Medical supplies like bandages, syringes, masks, gloves, etc.",
  },
  {
    name: "IT Consumable",
    description: "IT supplies like cables, USB drives, batteries, toner cartridges, etc.",
  },
  {
    name: "Lab Consumable",
    description: "Laboratory supplies like test tubes, chemicals, reagents, etc.",
  },
  {
    name: "Cleaning Consumable",
    description: "Cleaning supplies like detergents, disinfectants, mops, brooms, etc.",
  },
  {
    name: "Kitchen Consumable",
    description: "Kitchen supplies like utensils, disposable cups, napkins, etc.",
  },
  {
    name: "Safety Consumable",
    description: "Safety equipment like helmets, safety vests, first aid kits, etc.",
  },
];

export async function createConsumableSubcategories() {
  console.log("🚀 Starting to create consumable subcategories...");

  const results = {
    created: [] as string[],
    failed: [] as string[],
  };

  for (const subcategory of CONSUMABLE_SUBCATEGORIES) {
    try {
      console.log(`📝 Creating: ${subcategory.name}...`);

      const response = await AxiosWithToken.post("config/category/", {
        name: subcategory.name,
        description: subcategory.description,
        parent: CONSUMABLES_CATEGORY_UUID,
      });

      console.log(`✅ Created: ${subcategory.name}`);
      results.created.push(subcategory.name);
    } catch (error: any) {
      console.error(`❌ Failed to create ${subcategory.name}:`, error.response?.data || error.message);
      results.failed.push(subcategory.name);
    }
  }

  console.log("\n📊 Summary:");
  console.log(`✅ Successfully created: ${results.created.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.created.length > 0) {
    console.log("\n✅ Created subcategories:");
    results.created.forEach((name) => console.log(`  - ${name}`));
  }

  if (results.failed.length > 0) {
    console.log("\n❌ Failed subcategories:");
    results.failed.forEach((name) => console.log(`  - ${name}`));
  }

  console.log("\n🎉 Done! You can now edit your consumable items to assign them to these subcategories.");

  return results;
}

// Also export individual subcategories for reference
export { CONSUMABLE_SUBCATEGORIES, CONSUMABLES_CATEGORY_UUID };
