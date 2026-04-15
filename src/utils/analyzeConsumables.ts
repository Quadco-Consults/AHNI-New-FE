/**
 * Utility to analyze consumables and suggest subcategories
 *
 * Run this from browser console on the consumables page:
 * Copy and paste this into console after the page loads
 */

import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const CONSUMABLES_CATEGORY_UUID = "fadb6228-23de-4b04-9eac-b75940cf622f";

// Keywords to identify different types of consumables
const CATEGORY_KEYWORDS = {
  "Office Consumable": ["pen", "paper", "folder", "stapler", "file", "envelope", "notebook", "marker", "highlighter", "clipboard", "binder"],
  "Kitchen Consumable": ["soup", "coffee", "tea", "cup", "plate", "fork", "spoon", "napkin", "tissue"],
  "Office Equipment": ["desk", "chair", "table", "cabinet"],
  "IT Consumable": ["photocopying", "printer", "toner", "cartridge", "cable", "usb", "flash drive", "battery"],
  "Facility Equipment": ["air conditioning", "water treatment", "generator", "hvac"],
  "Cleaning Consumable": ["disinfectant", "detergent", "soap", "mop", "broom", "cleaner"],
  "Medical Consumable": ["bandage", "gauze", "syringe", "mask", "glove", "sanitizer"],
  "Disposable Items": ["disposable", "plastic"],
};

export async function analyzeConsumables() {
  try {
    console.log("🔍 Fetching all consumables...");

    const response = await AxiosWithToken.get("config/items/", {
      params: {
        category: CONSUMABLES_CATEGORY_UUID,
        size: 1000,
        page: 1,
      },
    });

    const items = response.data?.data?.results || [];
    console.log(`📦 Found ${items.length} consumable items`);

    // Categorize items
    const categorized: Record<string, string[]> = {};
    const uncategorized: string[] = [];

    items.forEach((item: any) => {
      const itemName = item.name.toLowerCase();
      let matched = false;

      for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => itemName.includes(keyword))) {
          if (!categorized[category]) {
            categorized[category] = [];
          }
          categorized[category].push(item.name);
          matched = true;
          break;
        }
      }

      if (!matched) {
        uncategorized.push(item.name);
      }
    });

    // Print results
    console.log("\n📊 CATEGORIZATION RESULTS:\n");

    Object.entries(categorized).forEach(([category, items]) => {
      console.log(`\n✅ ${category} (${items.length} items):`);
      items.forEach(name => console.log(`   - ${name}`));
    });

    if (uncategorized.length > 0) {
      console.log(`\n⚠️ Uncategorized items (${uncategorized.length}):`);
      uncategorized.forEach(name => console.log(`   - ${name}`));
    }

    console.log("\n\n📝 SUGGESTED SUBCATEGORIES TO CREATE:\n");
    Object.keys(categorized).forEach(category => {
      console.log(`✓ ${category}`);
    });

    return {
      categorized,
      uncategorized,
      suggestedCategories: Object.keys(categorized),
    };
  } catch (error) {
    console.error("❌ Error analyzing consumables:", error);
    throw error;
  }
}

// Export for use
export default analyzeConsumables;
