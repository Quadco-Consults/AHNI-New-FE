import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export interface ScheduledSubGrant {
  id: string;
  title: string;
  status: string;
  submission_start_date: string;
  submission_end_date: string;
}

export class SubGrantScheduler {
  private static instance: SubGrantScheduler;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 60000; // Check every minute

  private constructor() {}

  public static getInstance(): SubGrantScheduler {
    if (!SubGrantScheduler.instance) {
      SubGrantScheduler.instance = new SubGrantScheduler();
    }
    return SubGrantScheduler.instance;
  }

  public startScheduler() {
    if (this.intervalId) {
      this.stopScheduler();
    }

    console.log("🕐 Starting Sub-Grant submission scheduler...");
    this.intervalId = setInterval(() => {
      this.checkScheduledActions();
    }, this.CHECK_INTERVAL);

    // Run immediately on start
    this.checkScheduledActions();
  }

  public stopScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("⏹️ Sub-Grant submission scheduler stopped");
    }
  }

  private async checkScheduledActions() {
    try {
      console.log("🔍 Checking for scheduled submission actions...");

      // Get all published sub-grants
      const response = await AxiosWithToken.get("/contract-grants/sub-grants/", {
        params: { size: 100, status: "ADVERTISED" }
      });

      const subGrants: ScheduledSubGrant[] = response.data?.data?.results || [];

      for (const subGrant of subGrants) {
        await this.processSubGrantSchedule(subGrant);
      }

      // Also check for submission_open sub-grants that need to be closed
      const openResponse = await AxiosWithToken.get("/contract-grants/sub-grants/", {
        params: { size: 100, status: "SUBMISSION_OPEN" }
      });

      const openSubGrants: ScheduledSubGrant[] = openResponse.data?.data?.results || [];

      for (const subGrant of openSubGrants) {
        await this.processSubGrantSchedule(subGrant);
      }

    } catch (error) {
      console.error("❌ Error in submission scheduler:", error);
    }
  }

  private async processSubGrantSchedule(subGrant: ScheduledSubGrant) {
    const now = new Date();
    const submissionStartDate = new Date(subGrant.submission_start_date);
    const submissionEndDate = new Date(subGrant.submission_end_date);

    try {
      // Check if submissions should be opened
      if (
        subGrant.status === "ADVERTISED" &&
        now >= submissionStartDate &&
        now < submissionEndDate
      ) {
        console.log(`📂 Opening submissions for: ${subGrant.title}`);
        await this.openSubmissions(subGrant.id);
      }

      // Check if submissions should be closed
      if (
        subGrant.status === "SUBMISSION_OPEN" &&
        now >= submissionEndDate
      ) {
        console.log(`🔒 Closing submissions for: ${subGrant.title}`);
        await this.closeSubmissions(subGrant.id);
      }
    } catch (error) {
      console.error(`❌ Error processing schedule for ${subGrant.title}:`, error);
    }
  }

  private async openSubmissions(subGrantId: string) {
    try {
      await AxiosWithToken.post(`/contract-grants/sub-grants/workflow/${subGrantId}/open-submissions/`);
      console.log(`✅ Successfully opened submissions for sub-grant: ${subGrantId}`);
    } catch (error) {
      console.error(`❌ Failed to open submissions for sub-grant: ${subGrantId}`, error);
      throw error;
    }
  }

  private async closeSubmissions(subGrantId: string) {
    try {
      await AxiosWithToken.post(`/contract-grants/sub-grants/workflow/${subGrantId}/close-submissions/`);
      console.log(`✅ Successfully closed submissions for sub-grant: ${subGrantId}`);
    } catch (error) {
      console.error(`❌ Failed to close submissions for sub-grant: ${subGrantId}`, error);
      throw error;
    }
  }

  // Manual methods for immediate actions
  public async manualOpenSubmissions(subGrantId: string): Promise<void> {
    console.log(`🔧 Manually opening submissions for: ${subGrantId}`);
    await this.openSubmissions(subGrantId);
  }

  public async manualCloseSubmissions(subGrantId: string): Promise<void> {
    console.log(`🔧 Manually closing submissions for: ${subGrantId}`);
    await this.closeSubmissions(subGrantId);
  }

  // Get status of scheduler
  public isRunning(): boolean {
    return this.intervalId !== null;
  }

  // Get next check time
  public getNextCheckTime(): Date {
    return new Date(Date.now() + this.CHECK_INTERVAL);
  }
}

// Export singleton instance
export const subGrantScheduler = SubGrantScheduler.getInstance();

// Auto-start the scheduler (you can make this configurable)
if (typeof window !== "undefined") {
  // Only run in browser environment
  subGrantScheduler.startScheduler();
}