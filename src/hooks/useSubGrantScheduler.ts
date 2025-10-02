import { useEffect, useState } from "react";
import { subGrantScheduler } from "@/services/subGrantScheduler";

export interface SchedulerStatus {
  isRunning: boolean;
  nextCheckTime: Date | null;
  lastCheck: Date | null;
}

export const useSubGrantScheduler = () => {
  const [status, setStatus] = useState<SchedulerStatus>({
    isRunning: false,
    nextCheckTime: null,
    lastCheck: null,
  });

  useEffect(() => {
    // Initialize scheduler status
    const updateStatus = () => {
      setStatus({
        isRunning: subGrantScheduler.isRunning(),
        nextCheckTime: subGrantScheduler.isRunning()
          ? subGrantScheduler.getNextCheckTime()
          : null,
        lastCheck: new Date(),
      });
    };

    // Update status immediately
    updateStatus();

    // Update status every 30 seconds
    const statusInterval = setInterval(updateStatus, 30000);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  const startScheduler = () => {
    subGrantScheduler.startScheduler();
    setStatus(prev => ({
      ...prev,
      isRunning: true,
      nextCheckTime: subGrantScheduler.getNextCheckTime(),
    }));
  };

  const stopScheduler = () => {
    subGrantScheduler.stopScheduler();
    setStatus(prev => ({
      ...prev,
      isRunning: false,
      nextCheckTime: null,
    }));
  };

  const manualOpenSubmissions = async (subGrantId: string) => {
    try {
      await subGrantScheduler.manualOpenSubmissions(subGrantId);
      return { success: true };
    } catch (error) {
      console.error("Manual open submissions failed:", error);
      return { success: false, error };
    }
  };

  const manualCloseSubmissions = async (subGrantId: string) => {
    try {
      await subGrantScheduler.manualCloseSubmissions(subGrantId);
      return { success: true };
    } catch (error) {
      console.error("Manual close submissions failed:", error);
      return { success: false, error };
    }
  };

  return {
    status,
    startScheduler,
    stopScheduler,
    manualOpenSubmissions,
    manualCloseSubmissions,
  };
};