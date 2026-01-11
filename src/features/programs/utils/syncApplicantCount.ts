import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

/**
 * Utility function to sync advertisement's total_applicants with actual applicant count
 * This can be called after any operation that adds/removes applicants
 */
export const syncAdvertisementApplicantCount = async (advertisementId: string): Promise<void> => {
  try {
    // Get current applicant count
    const applicantsResponse = await AxiosWithToken.get("programs/adhoc/applicants/", {
      params: {
        page: 1,
        size: 100000000, // Get all to count them
        advertisement_id: advertisementId,
      },
    });

    const actualCount = applicantsResponse.data.data.results.length;

    // Update the advertisement with the correct count
    await AxiosWithToken.patch(`programs/adhoc/advertisements/${advertisementId}/`, {
      total_applicants: actualCount,
    });

    console.log(`✅ Synced applicant count for advertisement ${advertisementId}: ${actualCount}`);
  } catch (error) {
    console.error(`❌ Failed to sync applicant count for advertisement ${advertisementId}:`, error);
  }
};

/**
 * React hook version for easy use in components
 */
export const useSyncApplicantCount = () => {
  const syncCount = async (advertisementId: string) => {
    return syncAdvertisementApplicantCount(advertisementId);
  };

  return { syncCount };
};