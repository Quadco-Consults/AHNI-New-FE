import { TCategoryData } from "@/features/admin/types/config/category";

/**
 * Item Type Constants
 */
export const ITEM_TYPES = {
  GOODS: "GOODS",
  SERVICE: "SERVICE",
  WORK: "WORK",
  OTHERS: "OTHERS",
} as const;

export type ItemType = typeof ITEM_TYPES[keyof typeof ITEM_TYPES];

/**
 * Filter categories by job_category (item type)
 */
export const filterCategoriesByType = (
  categories: TCategoryData[],
  itemType: ItemType
): TCategoryData[] => {
  return categories.filter((cat) => cat.job_category === itemType);
};

/**
 * Get top-level categories (categories without parent)
 */
export const getTopLevelCategories = (
  categories: TCategoryData[]
): TCategoryData[] => {
  return categories.filter((cat) => !cat.parent);
};

/**
 * Get child categories for a specific parent
 */
export const getChildCategories = (
  categories: TCategoryData[],
  parentId: string
): TCategoryData[] => {
  return categories.filter((cat) => {
    if (typeof cat.parent === "string") {
      return cat.parent === parentId;
    } else if (cat.parent && typeof cat.parent === "object") {
      return cat.parent.id === parentId;
    }
    return false;
  });
};

/**
 * Get categories filtered by item type and parent
 * Use this for cascading dropdowns:
 * 1. First select item type (GOODS/SERVICE/WORK)
 * 2. Then select parent category (Assets/Consumables for GOODS, etc.)
 * 3. Then select specific category (Vehicles/IT Equipment for Assets, etc.)
 */
export const getCategoriesByTypeAndParent = (
  categories: TCategoryData[],
  itemType: ItemType,
  parentId?: string
): TCategoryData[] => {
  const categoriesByType = filterCategoriesByType(categories, itemType);

  if (!parentId) {
    // Return top-level categories for this type
    return getTopLevelCategories(categoriesByType);
  }

  // Return child categories for the specified parent
  return getChildCategories(categoriesByType, parentId);
};

/**
 * Build category options for dropdown
 */
export const buildCategoryOptions = (
  categories: TCategoryData[]
): Array<{ label: string; value: string }> => {
  return categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));
};

/**
 * Get full category hierarchy path
 * Example: "Goods > Assets > Vehicles"
 */
export const getCategoryPath = (
  category: TCategoryData,
  allCategories: TCategoryData[]
): string => {
  const path: string[] = [category.name];
  let current = category;

  while (current.parent) {
    const parentId =
      typeof current.parent === "string"
        ? current.parent
        : current.parent.id;

    const parentCategory = allCategories.find((cat) => cat.id === parentId);
    if (parentCategory) {
      path.unshift(parentCategory.name);
      current = parentCategory;
    } else {
      break;
    }
  }

  // Add item type at the beginning
  if (category.job_category) {
    path.unshift(category.job_category);
  }

  return path.join(" > ");
};

/**
 * Check if a category has children
 */
export const hasChildren = (
  categoryId: string,
  allCategories: TCategoryData[]
): boolean => {
  return allCategories.some((cat) => {
    if (typeof cat.parent === "string") {
      return cat.parent === categoryId;
    } else if (cat.parent && typeof cat.parent === "object") {
      return cat.parent.id === categoryId;
    }
    return false;
  });
};

/**
 * Example category structure for reference:
 *
 * GOODS (job_category)
 * ├─ Assets (parent category, no parent)
 * │  ├─ Vehicles (child category, parent: Assets)
 * │  ├─ IT Equipment (child category, parent: Assets)
 * │  ├─ Machines (child category, parent: Assets)
 * │  └─ Buildings (child category, parent: Assets)
 * └─ Consumables (parent category, no parent)
 *    ├─ Medical Consumables (child category, parent: Consumables)
 *    ├─ IT Consumables (child category, parent: Consumables)
 *    └─ Office Consumables (child category, parent: Consumables)
 *
 * SERVICE (job_category)
 * ├─ HMO (parent category, no parent)
 * ├─ Lease (parent category, no parent)
 * └─ Other Services (parent category, no parent)
 *
 * WORK (job_category)
 * └─ ... (similar structure)
 */
