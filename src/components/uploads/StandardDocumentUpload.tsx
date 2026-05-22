"use client";

import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Image as ImageIcon, File, AlertCircle, CheckCircle } from 'lucide-react';
import { useStandardUpload } from './hooks/useStandardUpload';
import { UPLOAD_DESIGN } from './design-tokens';

export interface StandardDocumentUploadProps {
  /** API endpoint for upload */
  endpoint: string;

  /** Accepted file formats (e.g., ['.pdf', '.jpg', '.png']) */
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

  /** Show preview of uploaded file */
  showPreview?: boolean;

  /** Allow multiple file selection */
  multiple?: boolean;
}

/**
 * Standardized Document Upload Component
 * For single document/file uploads (PDFs, images, etc.)
 * Simpler version of StandardBulkUpload for non-bulk scenarios
 */
export function StandardDocumentUpload({
  endpoint,
  acceptedFormats = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  maxFileSizeMB = 10,
  additionalData = {},
  title = 'Upload Document',
  description = 'Select a file to upload',
  onSuccess,
  onError,
  showPreview = true,
  multiple = false
}: StandardDocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
    onSuccess,
    onError,
    validateBeforeUpload: true,
    maxFileSize: maxFileSizeMB * 1024 * 1024,
    acceptedFormats
  });

  /**
   * Get file icon based on type
   */
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension || '')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }

    if (['pdf'].includes(extension || '')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    }

    return <File className="h-8 w-8 text-gray-500" />;
  };

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

    // Generate preview for images
    if (showPreview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
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
   * Handle upload button click
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    await upload(selectedFile, additionalData);
  };

  /**
   * Handle reset
   */
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>

      {/* File Selection */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
          multiple={multiple}
        />

        {!selectedFile ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Choose File</span>
          </button>
        ) : (
          <div className="space-y-3">
            {/* File Display */}
            <div className={UPLOAD_DESIGN.fileDisplay.container}>
              {getFileIcon(selectedFile.name)}
              <div className="flex-1 min-w-0">
                <p className={`${UPLOAD_DESIGN.fileDisplay.name} truncate`}>
                  {selectedFile.name}
                </p>
                <p className={UPLOAD_DESIGN.fileDisplay.size}>
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              {!isUploading && !result && (
                <button
                  type="button"
                  onClick={handleReset}
                  className={UPLOAD_DESIGN.fileDisplay.removeButton}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-contain bg-gray-50"
                />
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2">
          Accepted: {acceptedFormats.join(', ')} • Max: {maxFileSizeMB}MB
        </p>
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

      {/* Success Message */}
      {result && !errors.length && (
        <div className={UPLOAD_DESIGN.success.container}>
          <div className="flex items-center space-x-2">
            <CheckCircle className={UPLOAD_DESIGN.success.icon} />
            <p className={UPLOAD_DESIGN.success.text}>
              File uploaded successfully!
            </p>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className={UPLOAD_DESIGN.errors.container}>
          <div className="flex items-start space-x-2">
            <AlertCircle className={UPLOAD_DESIGN.errors.icon} />
            <div>
              <p className={UPLOAD_DESIGN.errors.title}>Upload Failed</p>
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-700 mt-1">
                  {error.error}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {selectedFile && !result && !isUploading && (
        <div className="flex items-center justify-end space-x-3">
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
            Upload
          </button>
        </div>
      )}

      {result && (
        <button
          type="button"
          onClick={handleReset}
          className={UPLOAD_DESIGN.buttons.secondary + ' w-full'}
        >
          Upload Another File
        </button>
      )}
    </div>
  );
}
