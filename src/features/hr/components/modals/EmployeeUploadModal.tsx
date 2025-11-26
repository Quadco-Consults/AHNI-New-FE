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
import { CheckCircle, AlertTriangle, FileSpreadsheet, Upload, Download } from "lucide-react";
import { XLSX } from "@/utils/excelUtils";
import readXlsxFile from 'read-excel-file';
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

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

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);
    setStatusMessage("Uploading employee data file...");

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend with progress tracking
      setUploadProgress(30);
      setStatusMessage("Validating file format...");

      const response = await AxiosWithToken.post('/hr/employees/bulk-upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(Math.min(percentCompleted, 90));
          }
        }
      });

      setUploadProgress(90);
      setStatusMessage("Processing employee records...");

      // Processing phase
      setUploadStatus('processing');
      setStatusMessage("Creating employee records in database...");

      // Wait a bit for processing to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Extract results from response
      const result = response.data;
      const successCount = result.data?.success_count || result.data?.created_count || 0;
      const errorCount = result.data?.error_count || 0;
      const errors = result.data?.errors || [];

      setUploadProgress(100);
      setUploadStatus('success');

      if (errorCount > 0) {
        setStatusMessage(`Processed ${successCount} employees. ${errorCount} errors found.`);
        toast.warning(`Upload completed with warnings. ${successCount} created, ${errorCount} errors.`);
        console.warn("Upload errors:", errors);
      } else {
        setStatusMessage(`Successfully processed ${successCount} employee records!`);
        toast.success(`Upload completed! ${successCount} employees created.`);
      }

      // Call the onUpload callback if provided
      onUpload?.(file, result);

      // Auto-close after success
      setTimeout(() => {
        onClose?.() || dispatch(closeDialog());
      }, 2000);

    } catch (error: any) {
      setUploadStatus('error');
      const errorMessage = error?.response?.data?.message || error?.message || "Upload failed. Please try again.";
      setStatusMessage(errorMessage);
      setIsUploading(false);
      console.error("Upload error:", error);
      toast.error(errorMessage);
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

  const downloadTemplate = async () => {
    try {
      // Try to download from backend first
      const response = await AxiosWithToken.get('/hr/employees/bulk-upload-template/', {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Employee_Upload_Template_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.warn("Backend template download failed, using client-side generation:", error);

      // Fallback to client-side generation
      const templateData = [
        {
          "Staff ID": "AHNI-001",
          "First Name": "John",
          "Last Name": "Doe",
          "Email": "john.doe@example.com",
          "Phone Number": "+234-XXX-XXX-XXXX",
          "Employment Type": "Full-Time",
          "Position": "Software Engineer",
          "Department": "Engineering",
          "Location": "Lagos",
          "Start Date": "2025-01-01",
          "Date of Birth": "1990-01-15",
          "Gender": "Male",
          "Marital Status": "Single",
          "Address": "123 Main Street, Lagos",
          "Bank Name": "First Bank",
          "Account Number": "1234567890",
          "Account Name": "John Doe",
          "Emergency Contact Name": "Jane Doe",
          "Emergency Contact Phone": "+234-XXX-XXX-XXXX",
          "Emergency Contact Relationship": "Spouse",
        }
      ];

      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Employee Template");

      const colWidths = [
        { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 18 },
        { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
        { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 15 },
        { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 20 },
      ];
      ws['!cols'] = colWidths;

      const fileName = `Employee_Upload_Template_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Template downloaded successfully!");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Upload Employees Data</h3>
            <p className="text-sm text-gray-600">
              Upload a CSV or Excel file containing multiple employee records for bulk processing.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900 space-y-1">
            <p className="font-medium">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800">
              <li>Click "Download Template" to get the Excel template</li>
              <li>Fill in employee details in the template</li>
              <li>Save the file and upload it below</li>
              <li>Review and confirm the uploaded data</li>
            </ol>
          </div>
        </div>
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
              onClick={handleUpload}
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