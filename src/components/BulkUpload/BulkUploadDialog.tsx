"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, Download, FileSpreadsheet, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { LoadingSpinner } from "@/components/Loading";

interface BulkUploadDialogProps {
  open: boolean;
  onClose: () => void;
  apiEndpoint: string; // e.g., "/config/locations"
  title: string; // e.g., "Locations"
  onUploadComplete?: () => void;
}

interface UploadResult {
  success_count: number;
  error_count: number;
  total_processed: number;
  created_count: number;
  updated_count: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}

export default function BulkUploadDialog({
  open,
  onClose,
  apiEndpoint,
  title,
  onUploadComplete,
}: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        toast.error('Invalid file type. Please upload Excel (.xlsx, .xls) or CSV file');
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
      const response = await AxiosWithToken.get(
        `${apiEndpoint}/download-template/`,
        {
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.toLowerCase()}_bulk_upload_template.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Template downloaded successfully');
    } catch (error: any) {
      console.error('Template download error:', error);
      toast.error(error?.response?.data?.error || 'Failed to download template');
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setUploadResult(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await AxiosWithToken.post(
        `${apiEndpoint}/bulk-upload/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const result = response.data.result;
      setUploadResult(result);

      if (result.error_count === 0) {
        toast.success(`Successfully imported ${result.success_count} ${title.toLowerCase()}`);
        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        toast.warning(
          `Import completed with errors: ${result.success_count} successful, ${result.error_count} failed`
        );
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUploadResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Bulk Upload {title}
          </DialogTitle>
          <DialogDescription>
            Upload an Excel or CSV file to import multiple {title.toLowerCase()} at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Step 1: Download Template */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-2">Download Template</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Download the Excel template with the correct column format and sample data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                  disabled={downloadingTemplate}
                >
                  {downloadingTemplate ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Step 2: Upload File */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-2">Upload File</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Select your filled Excel or CSV file to upload
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                  {!file ? (
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Click to upload
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                          />
                        </label>
                        <span className="text-sm text-gray-500"> or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Excel (.xlsx, .xls) or CSV files up to 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          setUploadResult(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Results */}
          {uploadResult && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                {uploadResult.error_count === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                Upload Results
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600">Total Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{uploadResult.total_processed}</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-green-600">{uploadResult.success_count}</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600">Created</p>
                  <p className="text-2xl font-bold text-blue-600">{uploadResult.created_count}</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600">Updated</p>
                  <p className="text-2xl font-bold text-purple-600">{uploadResult.updated_count}</p>
                </div>
              </div>

              {uploadResult.error_count > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm font-semibold text-red-800 mb-2">
                    Errors ({uploadResult.error_count}):
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {uploadResult.errors.map((error, index) => (
                      <div key={index} className="text-xs bg-white p-2 rounded border border-red-100">
                        <span className="font-semibold">Row {error.row}:</span> {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
