import { useState, useCallback, useEffect } from 'react';
import { UPLOAD_DESIGN, UploadStage } from '../design-tokens';

export interface UploadProgress {
  percentage: number;
  stage: UploadStage | null;
  isUploading: boolean;
  isComplete: boolean;
  hasError: boolean;
}

export interface UseUploadProgressReturn {
  progress: UploadProgress;
  setProgress: (percentage: number) => void;
  setStage: (stageName: string) => void;
  startUpload: () => void;
  completeUpload: () => void;
  errorUpload: () => void;
  resetProgress: () => void;
  getCurrentStage: () => UploadStage | null;
}

/**
 * Hook to manage upload progress and stages
 * Provides consistent progress tracking across all upload components
 */
export function useUploadProgress(): UseUploadProgressReturn {
  const [progress, setProgressState] = useState<UploadProgress>({
    percentage: 0,
    stage: null,
    isUploading: false,
    isComplete: false,
    hasError: false
  });

  /**
   * Determine current stage based on percentage
   */
  const getCurrentStage = useCallback((): UploadStage | null => {
    const { percentage } = progress;

    for (const stage of UPLOAD_DESIGN.stages) {
      const [min, max] = stage.range;
      if (percentage >= min && percentage <= max) {
        return stage;
      }
    }

    return null;
  }, [progress.percentage]);

  /**
   * Update progress percentage and automatically determine stage
   */
  const setProgress = useCallback((percentage: number) => {
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setProgressState(prev => ({
      ...prev,
      percentage: clampedPercentage,
      stage: UPLOAD_DESIGN.stages.find(
        s => clampedPercentage >= s.range[0] && clampedPercentage <= s.range[1]
      ) || prev.stage,
      isComplete: clampedPercentage >= 100
    }));
  }, []);

  /**
   * Manually set stage by name
   */
  const setStage = useCallback((stageName: string) => {
    const stage = UPLOAD_DESIGN.stages.find(s => s.name === stageName);

    if (stage) {
      setProgressState(prev => ({
        ...prev,
        stage,
        percentage: stage.range[0]
      }));
    }
  }, []);

  /**
   * Start upload process
   */
  const startUpload = useCallback(() => {
    setProgressState({
      percentage: 0,
      stage: UPLOAD_DESIGN.stages[0], // Validating
      isUploading: true,
      isComplete: false,
      hasError: false
    });
  }, []);

  /**
   * Complete upload successfully
   */
  const completeUpload = useCallback(() => {
    setProgressState({
      percentage: 100,
      stage: UPLOAD_DESIGN.stages[UPLOAD_DESIGN.stages.length - 1], // Complete
      isUploading: false,
      isComplete: true,
      hasError: false
    });
  }, []);

  /**
   * Mark upload as failed
   */
  const errorUpload = useCallback(() => {
    setProgressState(prev => ({
      ...prev,
      isUploading: false,
      hasError: true
    }));
  }, []);

  /**
   * Reset to initial state
   */
  const resetProgress = useCallback(() => {
    setProgressState({
      percentage: 0,
      stage: null,
      isUploading: false,
      isComplete: false,
      hasError: false
    });
  }, []);

  return {
    progress,
    setProgress,
    setStage,
    startUpload,
    completeUpload,
    errorUpload,
    resetProgress,
    getCurrentStage
  };
}
