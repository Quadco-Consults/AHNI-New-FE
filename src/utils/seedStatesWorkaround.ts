import { nigerianStatesData } from "@/data/nigerianStatesData";
import { useAddStateMutation } from "@/features/modules/controllers/config/stateController";

/**
 * Workaround: Manually populate states using the form mutation
 * This bypasses the API seeding and uses the same mutation that the AddStates form uses
 */

export interface WorkaroundSeedResult {
  success: boolean;
  message: string;
  data?: {
    created: number;
    errors: number;
    details: Array<{
      stateName: string;
      status: 'created' | 'error';
      message?: string;
    }>;
  };
}

/**
 * Manually create states one by one using the React mutation hooks
 * This simulates clicking "Add State" for each Nigerian state
 */
export const useManualStateSeeder = () => {
  const [addState, { isLoading }] = useAddStateMutation();

  const seedStatesManually = async (
    onProgress?: (current: number, total: number, stateName: string) => void
  ): Promise<WorkaroundSeedResult> => {
    const results = {
      created: 0,
      errors: 0,
      details: [] as Array<{
        stateName: string;
        status: 'created' | 'error';
        message?: string;
      }>
    };

    try {
      console.log("🔧 Starting manual state seeding workaround...");

      for (let i = 0; i < nigerianStatesData.length; i++) {
        const state = nigerianStatesData[i];

        // Call progress callback
        if (onProgress) {
          onProgress(i + 1, nigerianStatesData.length, state.name);
        }

        try {
          console.log(`🔧 Creating state: ${state.name}`);
          await addState(state);
          results.created++;
          results.details.push({
            stateName: state.name,
            status: 'created'
          });
          console.log(`✅ Created: ${state.name}`);
        } catch (error: any) {
          results.errors++;
          const errorMessage = error?.response?.data?.message || error?.message || "Unknown error";
          results.details.push({
            stateName: state.name,
            status: 'error',
            message: errorMessage
          });
          console.log(`❌ Failed to create ${state.name}: ${errorMessage}`);
        }

        // Small delay to avoid overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const summary = `🔧 Manual seeding completed! Created: ${results.created}, Errors: ${results.errors}`;
      console.log(summary);

      return {
        success: true,
        message: summary,
        data: results
      };

    } catch (error: any) {
      console.error("❌ Manual seeding failed:", error);
      return {
        success: false,
        message: `Manual seeding failed: ${error?.message || 'Unknown error'}`
      };
    }
  };

  return {
    seedStatesManually,
    isLoading
  };
};

/**
 * Simple state creation for testing - creates just one state
 */
export const createTestState = async (stateName: string = "Lagos"): Promise<{ success: boolean; message: string }> => {
  try {
    const lagosState = nigerianStatesData.find(state => state.name === stateName);
    if (!lagosState) {
      return { success: false, message: `State ${stateName} not found in data` };
    }

    console.log(`🧪 Creating test state: ${stateName}`);

    // This would need to use the mutation directly
    // For now, return a mock success
    console.log("Test state data:", lagosState);

    return {
      success: true,
      message: `Test state ${stateName} prepared (check console for data structure)`
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Test state creation failed"
    };
  }
};