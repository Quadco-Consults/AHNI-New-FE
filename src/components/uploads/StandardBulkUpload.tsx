"use client";

import React, { useState, useRef, DragEvent } from 'react';
import { X, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useStandardUpload, UseStandardUploadOptions } from './hooks/useStandardUpload';
import { UPLOAD_DESIGN } from './design-tokens';

export interface StandardBulkUploadProps {
  /** API endpoint for upload */
  endpoint: string;

  /** Optional template download URL */
  templateUrl?: string;

  /** Accepted file formats (e.g., ['.xlsx', '.csv']) */
  acceptedFormats?: string[];

  /** Maximum file size in MB */
  maxFileSizeMB?: number;

  /** Additional form data to send with upload */
  additionalData?: Record<string, any>;

  /** Title for the upload section */
  title?: string;

  /** Description text */
  description?: string;

  /** Callback when upload succeeds */
  onSuccess?: (result: any) => void;

  /** Callback when upload fails */
  onError?: (error: string) => void;

  /** Show/hide template download button */
  showTemplateDownload?: boolean;

  /** Validate file before upload */
  validateBeforeUpload?: boolean;

  /** Auto-close after successful upload (milliseconds) */
  autoCloseDelay?: number;

  /** Close callback (for modal usage) */
  onClose?: () => void;
}

/**
 * Standardized Bulk Upload Component
 * Provides consistent UX across all bulk data imports with:
 * - Drag & drop interface
 * - Progress tracking (0-100% with stages)
 * - Detailed error reporting with row/column numbers
 * - Template download integration
 * - Backward compatible with multiple API response formats
 */
export function StandardBulkUpload({
  endpoint,
  templateUrl,
  acceptedFormats = ['.xlsx', '.xls', '.csv'],
  maxFileSizeMB = 10,
  additionalData = {},
  title = 'Bulk Upload',
  description = 'Upload a file to import multiple records at once',
  onSuccess,
  onError,
  showTemplateDownload = true,
  validateBeforeUpload = true,
  autoCloseDelay,
  onClose
}: StandardBulkUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    upload,
    isUploading,
    progress,
    stage,
    result,
    errors,
    reset,
    validateFile
  } = useStandardUpload(endpoint, {
    onSuccess: (uploadResult) => {
      if (onSuccess) {
        onSuccess(uploadResult);
      }

      // Auto-close after delay if configured
      if (autoCloseDelay && onClose && uploadResult.failed_count === 0) {
        setTimeout(() => {
          onClose();
        }, autoCloseDelay);
      }
    },
    onError,
    validateBeforeUpload,
    maxFileSize: maxFileSizeMB * 1024 * 1024,
    acceptedFormats
  } as UseStandardUploadOptions);

  /**
   * Handle file selection
   */
  const handleFileSelect = (file: File) => {
    const validation = validateFile(file);

    if (!validation.valid) {
      if (onError) {
        onError(validation.error || 'Invalid file');
      }
      return;
    }

    setSelectedFile(file);
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handle drag events
   */
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handle upload button click
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    await upload(selectedFile, additionalData);
  };

  /**
   * Handle template download
   */
  const handleDownloadTemplate = async () => {
    if (!templateUrl) return;

    setIsDownloadingTemplate(true);
    try {
      // Get authentication token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      // Prepare headers
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(templateUrl, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template-${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Template download error:', error);
      if (onError) {
        onError('Failed to download template');
      }
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  /**
   * Handle reset
   */
  const handleReset = () => {
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Determine drop zone classes
  const dropZoneClasses = [
    UPLOAD_DESIGN.dropZone.borderStyle,
    'flex flex-col items-center justify-center p-8 transition-all duration-200'
  ];

  if (isDragging) {
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.borderColor.active);
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.background.active);
  } else if (result?.failed_count && result.failed_count > 0) {
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.borderColor.error);
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.background.error);
  } else if (result?.created_count && result.created_count > 0) {
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.borderColor.success);
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.background.success);
  } else {
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.borderColor.default);
    dropZoneClasses.push(UPLOAD_DESIGN.dropZone.background.default);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      {/* Template Download */}
      {showTemplateDownload && templateUrl && (
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={isDownloadingTemplate}
            className={UPLOAD_DESIGN.template.button}
          >
            <Download className={UPLOAD_DESIGN.template.icon} />
            <span className={UPLOAD_DESIGN.template.text}>
              {isDownloadingTemplate ? 'Downloading...' : 'Download Template'}
            </span>
          </button>
          <span className="text-xs text-gray-500">
            Download the template, fill it out, then upload below
          </span>
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={dropZoneClasses.join(' ')}
        style={{ minHeight: UPLOAD_DESIGN.dropZone.height }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {!selectedFile ? (
          <>
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Drag and drop your file here
            </p>
            <p className="text-xs text-gray-500 mb-4">or</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={UPLOAD_DESIGN.buttons.secondary}
              disabled={isUploading}
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Accepted formats: {acceptedFormats.join(', ')} • Max size: {maxFileSizeMB}MB
            </p>
          </>
        ) : (
          <div className={UPLOAD_DESIGN.fileDisplay.container}>
            <FileSpreadsheet className={UPLOAD_DESIGN.fileDisplay.icon} />
            <div className="flex-1">
              <p className={UPLOAD_DESIGN.fileDisplay.name}>{selectedFile.name}</p>
              <p className={UPLOAD_DESIGN.fileDisplay.size}>
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={handleReset}
                className={UPLOAD_DESIGN.fileDisplay.removeButton}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={stage ? UPLOAD_DESIGN.stages.find(s => s.name === stage)?.color : 'text-gray-600'}>
              {stage || 'Uploading'}...
            </span>
            <span className="text-gray-600 font-medium">{progress}%</span>
          </div>
          <div className={UPLOAD_DESIGN.progressBar.containerClass}>
            <div
              className={`${UPLOAD_DESIGN.progressBar.colors.fill} h-full ${UPLOAD_DESIGN.progressBar.animation}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className={UPLOAD_DESIGN.stats.container}>
          <div className={UPLOAD_DESIGN.stats.card}>
            <p className={UPLOAD_DESIGN.stats.label}>Total Rows</p>
            <p className={`${UPLOAD_DESIGN.stats.value} ${UPLOAD_DESIGN.stats.colors.total}`}>
              {result.total_rows || 0}
            </p>
          </div>
          <div className={UPLOAD_DESIGN.stats.card}>
            <p className={UPLOAD_DESIGN.stats.label}>Successfully Created</p>
            <p className={`${UPLOAD_DESIGN.stats.value} ${UPLOAD_DESIGN.stats.colors.success}`}>
              {result.created_count}
            </p>
          </div>
          {result.updated_count !== undefined && result.updated_count > 0 && (
            <div className={UPLOAD_DESIGN.stats.card}>
              <p className={UPLOAD_DESIGN.stats.label}>Updated</p>
              <p className={`${UPLOAD_DESIGN.stats.value} ${UPLOAD_DESIGN.stats.colors.warning}`}>
                {result.updated_count}
              </p>
            </div>
          )}
          <div className={UPLOAD_DESIGN.stats.card}>
            <p className={UPLOAD_DESIGN.stats.label}>Failed</p>
            <p className={`${UPLOAD_DESIGN.stats.value} ${UPLOAD_DESIGN.stats.colors.error}`}>
              {result.failed_count}
            </p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {result && result.failed_count === 0 && result.created_count > 0 && (
        <div className={UPLOAD_DESIGN.success.container}>
          <div className="flex items-start space-x-3">
            <CheckCircle className={UPLOAD_DESIGN.success.icon} />
            <div>
              <p className={UPLOAD_DESIGN.success.title}>Upload Successful!</p>
              <p className={UPLOAD_DESIGN.success.text}>
                Successfully created {result.created_count} {result.created_count === 1 ? 'record' : 'records'}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className={UPLOAD_DESIGN.errors.container}>
          <div className="flex items-start space-x-2 mb-3">
            <AlertCircle className={UPLOAD_DESIGN.errors.icon} />
            <p className={UPLOAD_DESIGN.errors.title}>
              {errors.length} {errors.length === 1 ? 'Error' : 'Errors'} Found
            </p>
          </div>
          <div className={UPLOAD_DESIGN.errors.list}>
            {errors.slice(0, UPLOAD_DESIGN.errors.maxVisible).map((error, index) => (
              <div key={index} className={UPLOAD_DESIGN.errors.item}>
                <AlertTriangle className={UPLOAD_DESIGN.errors.icon} />
                <div className="flex-1">
                  {error.row && (
                    <span className={UPLOAD_DESIGN.errors.badge}>
                      Row {error.row}
                    </span>
                  )}
                  {error.column && (
                    <span className={`${UPLOAD_DESIGN.errors.badge} ml-1`}>
                      {error.field_label || error.column}
                    </span>
                  )}
                  <p className="mt-1">{error.error}</p>
                  {error.value && (
                    <p className="text-xs mt-1 text-red-600">Value: {String(error.value)}</p>
                  )}
                </div>
              </div>
            ))}
            {errors.length > UPLOAD_DESIGN.errors.maxVisible && (
              <p className="text-sm text-red-600 mt-2">
                ... and {errors.length - UPLOAD_DESIGN.errors.maxVisible} more errors
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3">
        {result && (
          <button
            type="button"
            onClick={handleReset}
            className={UPLOAD_DESIGN.buttons.secondary}
          >
            Upload Another File
          </button>
        )}

        {!result && selectedFile && !isUploading && (
          <>
            <button
              type="button"
              onClick={handleReset}
              className={UPLOAD_DESIGN.buttons.secondary}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className={UPLOAD_DESIGN.buttons.primary}
            >
              Upload File
            </button>
          </>
        )}

        {result && onClose && (
          <button
            type="button"
            onClick={onClose}
            className={UPLOAD_DESIGN.buttons.primary}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
