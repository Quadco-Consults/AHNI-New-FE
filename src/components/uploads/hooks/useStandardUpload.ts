import { useState, useCallback } from 'react';
import { useUploadProgress } from './useUploadProgress';
import { UPLOAD_DESIGN } from '../design-tokens';

export interface UploadError {
  row?: number;
  column?: string;
  field_label?: string;
  value?: any;
  error: string;
  error_code?: string;
}

export interface UploadResult {
  total_rows?: number;
  created_count: number;
  updated_count?: number;
  failed_count: number;
  skipped_count?: number;
  errors: UploadError[];
  created_items?: any[];
}

export interface UseStandardUploadOptions {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
  validateBeforeUpload?: boolean;
  maxFileSize?: number; // in bytes
  acceptedFormats?: string[];
}

export interface UseStandardUploadReturn {
  upload: (file: File, additionalData?: Record<string, any>) => Promise<void>;
  isUploading: boolean;
  progress: number;
  stage: string | null;
  result: UploadResult | null;
  errors: UploadError[];
  reset: () => void;
  validateFile: (file: File) => { valid: boolean; error?: string };
}

/**
 * Hook to handle standardized file upload with progress tracking
 * Supports backward compatibility with multiple API response formats
 */
export function useStandardUpload(
  endpoint: string,
  options: UseStandardUploadOptions = {}
): UseStandardUploadReturn {
  const {
    onSuccess,
    onError,
    validateBeforeUpload = true,
    maxFileSize = UPLOAD_DESIGN.limits.maxFileSize,
    acceptedFormats = []
  } = options;

  const {
    progress: progressState,
    setProgress,
    startUpload: startProgressTracking,
    completeUpload,
    errorUpload,
    resetProgress
  } = useUploadProgress();

  const [result, setResult] = useState<UploadResult | null>(null);
  const [errors, setErrors] = useState<UploadError[]>([]);

  /**
   * Validate file before upload
   */
  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file size
      if (file.size > maxFileSize) {
        const sizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
        return {
          valid: false,
          error: `File size exceeds maximum limit of ${sizeMB}MB`
        };
      }

      // Check file format
      if (acceptedFormats.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const isValidFormat = acceptedFormats.some(format =>
          format.toLowerCase().replace('.', '') === fileExtension
        );

        if (!isValidFormat) {
          return {
            valid: false,
            error: `Invalid file format. Accepted formats: ${acceptedFormats.join(', ')}`
          };
        }
      }

      return { valid: true };
    },
    [maxFileSize, acceptedFormats]
  );

  /**
   * Parse response to standardized format
   * Supports multiple backend response formats for backward compatibility
   */
  const parseResponse = useCallback((response: any): UploadResult => {
    // Handle work plan sync format
    if (response.processed_sync && response.result) {
      const result = response.result;
      const activities = result.activities || [];
      return {
        total_rows: activities.length,
        created_count: activities.length,
        updated_count: 0,
        failed_count: 0,
        skipped_count: 0,
        errors: [],
        created_items: activities
      };
    }

    // Handle new standardized format
    if (response.data?.total_rows !== undefined) {
      return {
        total_rows: response.data.total_rows,
        created_count: response.data.created_count || 0,
        updated_count: response.data.updated_count || 0,
        failed_count: response.data.failed_count || 0,
        skipped_count: response.data.skipped_count || 0,
        errors: response.data.errors || [],
        created_items: response.data.created_items || []
      };
    }

    // Handle procurement plan format (new)
    if (response.data?.plan_number) {
      return {
        total_rows: response.data.total_line_items || 0,
        created_count: response.data.created_count || response.data.total_line_items || 0,
        failed_count: response.data.error_count || 0,
        errors: response.data.errors || [],
        created_items: []
      };
    }

    // Handle old procurement plan format
    if (response.summary) {
      return {
        total_rows:
          (response.summary.new_records_created || 0) +
          (response.summary.errors_found || 0),
        created_count: response.summary.new_records_created || 0,
        failed_count: response.summary.errors_found || 0,
        skipped_count: response.summary.rows_skipped || 0,
        errors: response.errors || [],
        created_items: []
      };
    }

    // Handle employee upload format (multiple variants)
    if (response.data?.successful !== undefined || response.data?.success_count !== undefined) {
      return {
        total_rows: response.data.total_rows || 0,
        created_count: response.data.successful || response.data.success_count || response.data.created_count || 0,
        failed_count: response.data.failed || response.data.error_count || 0,
        errors: response.data.errors || [],
        created_items: response.data.created_employees || []
      };
    }

    // Handle asset upload format
    if (response.data?.created_count !== undefined) {
      return {
        total_rows:
          (response.data.created_count || 0) +
          (response.data.updated_count || 0) +
          (response.data.failed_count || 0),
        created_count: response.data.created_count || 0,
        updated_count: response.data.updated_count || 0,
        failed_count: response.data.failed_count || 0,
        skipped_count: response.data.skipped_count || 0,
        errors: response.data.errors || [],
        created_items: []
      };
    }

    // Fallback to basic format
    return {
      created_count: response.created_count || response.successful || 0,
      failed_count: response.failed_count || response.failed || 0,
      errors: response.errors || [],
      created_items: []
    };
  }, []);

  /**
   * Upload file with progress tracking
   */
  const upload = useCallback(
    async (file: File, additionalData: Record<string, any> = {}) => {
      // Reset state
      setResult(null);
      setErrors([]);

      // Validate file if enabled
      if (validateBeforeUpload) {
        setProgress(10); // Validation stage
        const validation = validateFile(file);
        if (!validation.valid) {
          errorUpload();
          setErrors([{ error: validation.error || 'Validation failed' }]);
          if (onError) {
            onError(validation.error || 'Validation failed');
          }
          return;
        }
      }

      // Start upload
      startProgressTracking();
      setProgress(30); // Start uploading

      try {
        // Prepare FormData
        const formData = new FormData();
        formData.append('file', file);

        // Add additional data
        Object.entries(additionalData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });

        // Simulate progress during upload (more gradual for better visibility)
        const uploadInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 3, 60));
        }, 300);

        // Get authentication token
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        // Prepare headers
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Upload file
        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'include'
        });

        clearInterval(uploadInterval);
        setProgress(70); // Processing stage

        // Ensure progress bar is visible for at least a moment
        await new Promise(resolve => setTimeout(resolve, 500));

        // Parse response
        const data = await response.json();

        console.log('📥 Upload Response:', data); // Debug logging

        if (!response.ok) {
          throw new Error(
            data.error || data.message || 'Upload failed'
          );
        }

        // Parse to standardized format
        const parsedResult = parseResponse(data);
        console.log('📊 Parsed Result:', parsedResult); // Debug logging
        setResult(parsedResult);
        setErrors(parsedResult.errors);

        // Show 90% processing stage
        setProgress(90);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Complete
        completeUpload();

        // Call success callback
        if (onSuccess) {
          onSuccess(parsedResult);
        }
      } catch (error: any) {
        console.error('Upload error:', error);
        errorUpload();

        const errorMessage = error.message || 'Upload failed';
        setErrors([{ error: errorMessage }]);

        if (onError) {
          onError(errorMessage);
        }
      }
    },
    [
      endpoint,
      validateBeforeUpload,
      validateFile,
      parseResponse,
      onSuccess,
      onError,
      startProgressTracking,
      setProgress,
      completeUpload,
      errorUpload
    ]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setResult(null);
    setErrors([]);
    resetProgress();
  }, [resetProgress]);

  return {
    upload,
    isUploading: progressState.isUploading,
    progress: progressState.percentage,
    stage: progressState.stage?.name || null,
    result,
    errors,
    reset,
    validateFile
  };
}
