import { nigerianStatesData } from "@/data/nigerianStatesData";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { StateFormValues } from "@/features/admin/types/config/state";

/**
 * Utility to seed Nigerian States data to the backend
 */

interface SeedResult {
  success: boolean;
  message: string;
  data?: {
    created: number;
    skipped: number;
    errors: number;
    details: Array<{
      stateName: string;
      status: 'created' | 'skipped' | 'error';
      message?: string;
    }>;
  };
}

/**
 * Check if states already exist in the system
 */
export const checkExistingStates = async (): Promise<string[]> => {
  try {
    console.log("🔍 Checking for existing states...");
    const response = await AxiosWithToken.get("/config/states/", {
      params: { page: 1, size: 50, search: "" }
    });

    console.log("📊 States API response:", response.data);

    if (response.data?.data?.results) {
      const existingStateNames = response.data.data.results.map((state: any) => state.name);
      console.log("📝 Found existing states:", existingStateNames);
      return existingStateNames;
    }

    console.log("⚠️ No results found in API response");
    return [];
  } catch (error: any) {
    console.error("❌ Error checking existing states:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.message,
      url: error?.config?.url
    });
    return [];
  }
};

/**
 * Create a single state
 */
const createState = async (stateData: StateFormValues): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log("🔥 Attempting to create state:", stateData.name);
    const response = await AxiosWithToken.post("/config/states/", stateData);
    console.log("✅ Successfully created state:", stateData.name, response.data);
    return { success: true };
  } catch (error: any) {
    console.error("❌ Failed to create state:", stateData.name, error);
    const errorMessage = error?.response?.data?.message || error?.message || error?.toString() || "Unknown error";
    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Seed all Nigerian states to the backend
 */
export const seedNigerianStates = async (
  onProgress?: (current: number, total: number, stateName: string) => void
): Promise<SeedResult> => {
  try {
    console.log("🌱 Starting Nigerian States seeding process...");

    // Check existing states
    const existingStates = await checkExistingStates();
    console.log(`📊 Found ${existingStates.length} existing states`);

    const results = {
      created: 0,
      skipped: 0,
      errors: 0,
      details: [] as Array<{
        stateName: string;
        status: 'created' | 'skipped' | 'error';
        message?: string;
      }>
    };

    // Process each state
    for (let i = 0; i < nigerianStatesData.length; i++) {
      const state = nigerianStatesData[i];

      // Call progress callback
      if (onProgress) {
        onProgress(i + 1, nigerianStatesData.length, state.name);
      }

      // Check if state already exists
      if (existingStates.includes(state.name)) {
        results.skipped++;
        results.details.push({
          stateName: state.name,
          status: 'skipped',
          message: 'State already exists'
        });
        console.log(`⏭️  Skipped ${state.name} (already exists)`);
        continue;
      }

      // Create the state
      const createResult = await createState(state);

      if (createResult.success) {
        results.created++;
        results.details.push({
          stateName: state.name,
          status: 'created'
        });
        console.log(`✅ Created ${state.name}`);
      } else {
        results.errors++;
        results.details.push({
          stateName: state.name,
          status: 'error',
          message: createResult.message
        });
        console.log(`❌ Failed to create ${state.name}: ${createResult.message}`);
      }

      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const summary = `✨ Seeding completed! Created: ${results.created}, Skipped: ${results.skipped}, Errors: ${results.errors}`;
    console.log(summary);

    return {
      success: true,
      message: summary,
      data: results
    };

  } catch (error: any) {
    console.error("❌ Seeding failed:", error);
    return {
      success: false,
      message: `Seeding failed: ${error?.message || 'Unknown error'}`
    };
  }
};

/**
 * Validate that all required states exist
 */
export const validateStatesCompleteness = async (): Promise<{
  isComplete: boolean;
  missing: string[];
  total: number;
  existing: number;
}> => {
  try {
    const existingStates = await checkExistingStates();
    const requiredStateNames = nigerianStatesData.map(state => state.name);
    const missing = requiredStateNames.filter(name => !existingStates.includes(name));

    return {
      isComplete: missing.length === 0,
      missing,
      total: requiredStateNames.length,
      existing: existingStates.length
    };
  } catch (error) {
    console.error("Error validating states:", error);
    return {
      isComplete: false,
      missing: [],
      total: nigerianStatesData.length,
      existing: 0
    };
  }
};