"use client";

import { useState } from "react";
import UploadIcon from "@/components/icons/UploadIcon";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";
import { useRouter } from "next/navigation";
import { HrRoutes } from "constants/RouterConstants";
import { CheckCircle, AlertTriangle, FileSpreadsheet, Upload } from "lucide-react";

interface EmployeeUploadModalProps {
  onClose?: () => void;
  onUpload?: (file: File, data: any) => void;
}

export default function EmployeeUploadModal({ onClose, onUpload }: EmployeeUploadModalProps) {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Validate file type (accept CSV and Excel files for bulk employee data)
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please select a CSV or Excel file containing employee data");
        return;
      }

      // Validate file size (max 10MB for employee data files)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        setError("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
      setError("");
      setUploadStatus('idle');
      setStatusMessage("");
    }
  };

  const simulateUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setStatusMessage("Uploading employee data file...");

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);

        if (i === 30) setStatusMessage("Validating file format...");
        if (i === 60) setStatusMessage("Processing employee records...");
        if (i === 90) setStatusMessage("Finalizing upload...");
      }

      // Simulate processing phase
      setUploadStatus('processing');
      setStatusMessage("Processing employee data and creating records...");
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store the uploaded file info for demo purposes
      const uploadedFile = {
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        },
        timestamp: Date.now(),
        status: "processed",
        employeeCount: Math.floor(Math.random() * 50) + 10 // Random count for demo
      };

      const tempUploads = JSON.parse(sessionStorage.getItem('tempEmployeeUploads') || '[]');
      tempUploads.push(uploadedFile);
      sessionStorage.setItem('tempEmployeeUploads', JSON.stringify(tempUploads));

      setUploadStatus('success');
      setStatusMessage(`Successfully processed ${uploadedFile.employeeCount} employee records!`);

      toast.success(`Upload completed! ${uploadedFile.employeeCount} employees processed.`);

      // Call the onUpload callback if provided
      onUpload?.(file, uploadedFile);

      // Auto-close after success
      setTimeout(() => {
        onClose?.() || dispatch(closeDialog());
      }, 2000);

    } catch (error) {
      setUploadStatus('error');
      setStatusMessage("Upload failed. Please try again.");
      setIsUploading(false);
      console.error("Upload error:", error);
      toast.error("Failed to upload employee data. Please try again.");
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'processing':
        return <FileSpreadsheet className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Upload Employees Data</h3>
        <p className="text-sm text-gray-600">
          Upload a CSV or Excel file containing multiple employee records for bulk processing.
        </p>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <input
          type="file"
          id="employee-bulk-upload"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={handleChange}
          disabled={isUploading}
        />

        <label
          htmlFor="employee-bulk-upload"
          className={`block w-full ${isUploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        >
          <div className="flex flex-col items-center justify-center gap-4 w-full h-32 px-4 py-6 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-8 h-8 text-gray-400" />
              <UploadIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {file ? file.name : "Click to select employee data file"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                CSV or Excel files only (Max 10MB)
              </p>
            </div>
          </div>
        </label>

        {file && !isUploading && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {file.name}
              </span>
              <span className="text-xs text-blue-700">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Section */}
      {(isUploading || uploadStatus !== 'idle') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{statusMessage}</span>
          </div>

          {uploadStatus === 'uploading' && (
            <Progress value={uploadProgress} className="w-full" />
          )}

          {uploadStatus === 'processing' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            router.push(`${HrRoutes.WORKFORCE_DATABASE}/upload`);
            onClose?.() || dispatch(closeDialog());
          }}
          disabled={isUploading}
        >
          View Upload History
        </Button>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose || (() => dispatch(closeDialog()))}
            disabled={isUploading}
          >
            {uploadStatus === 'success' ? 'Close' : 'Cancel'}
          </Button>

          {uploadStatus !== 'success' && (
            <Button
              onClick={simulateUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Data'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}