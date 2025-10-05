"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { subGrantScheduler } from "@/services/subGrantScheduler";

interface SubGrantSchedulerContextType {
  isSchedulerRunning: boolean;
  startScheduler: () => void;
  stopScheduler: () => void;
}

const SubGrantSchedulerContext = createContext<SubGrantSchedulerContextType | undefined>(undefined);

export const useSubGrantSchedulerContext = () => {
  const context = useContext(SubGrantSchedulerContext);
  if (!context) {
    throw new Error("useSubGrantSchedulerContext must be used within a SubGrantSchedulerProvider");
  }
  return context;
};

interface SubGrantSchedulerProviderProps {
  children: React.ReactNode;
}

export const SubGrantSchedulerProvider: React.FC<SubGrantSchedulerProviderProps> = ({ children }) => {
  const [isSchedulerRunning, setIsSchedulerRunning] = useState(false);

  useEffect(() => {
    // Auto-start the scheduler when the component mounts
    if (typeof window !== "undefined") {
      try {
        subGrantScheduler.startScheduler();
        setIsSchedulerRunning(true);
        console.log("✅ Sub-Grant Scheduler started successfully");
      } catch (error) {
        console.error("❌ Failed to start Sub-Grant Scheduler:", error);
      }
    }

    // Cleanup on unmount
    return () => {
      subGrantScheduler.stopScheduler();
      setIsSchedulerRunning(false);
    };
  }, []);

  const startScheduler = () => {
    try {
      subGrantScheduler.startScheduler();
      setIsSchedulerRunning(true);
    } catch (error) {
      console.error("Failed to start scheduler:", error);
    }
  };

  const stopScheduler = () => {
    try {
      subGrantScheduler.stopScheduler();
      setIsSchedulerRunning(false);
    } catch (error) {
      console.error("Failed to stop scheduler:", error);
    }
  };

  const value = {
    isSchedulerRunning,
    startScheduler,
    stopScheduler,
  };

  return (
    <SubGrantSchedulerContext.Provider value={value}>
      {children}
    </SubGrantSchedulerContext.Provider>
  );
};