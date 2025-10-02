"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Button } from "components/ui/button";
import { Progress } from "components/ui/progress";
import { CheckCircle, AlertCircle, Upload, FileText, Users } from "lucide-react";
import { toast } from "sonner";
import { HrRoutes } from "constants/RouterConstants";

interface UploadedEmployee {
  file: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
  employee_type: string;
  department: string;
  position: string;
  description: string;
  timestamp: number;
  status: string;
}

const EmployeeUploadProcessor = () => {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedEmployee[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  useEffect(() => {
    // Load uploaded files from session storage
    const tempEmployees = JSON.parse(sessionStorage.getItem('tempEmployeeUploads') || '[]');
    setUploadedFiles(tempEmployees);
  }, []);

  const simulateProcessing = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessedCount(0);

    // Simulate processing each file
    for (let i = 0; i < uploadedFiles.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time

      const progress = ((i + 1) / uploadedFiles.length) * 100;
      setProcessingProgress(progress);
      setProcessedCount(i + 1);

      // Update file status
      const updatedFiles = uploadedFiles.map((file, index) => {
        if (index === i) {
          return { ...file, status: 'processed' };
        }
        return file;
      });
      setUploadedFiles(updatedFiles);
    }

    setIsProcessing(false);
    toast.success(`Successfully processed ${uploadedFiles.length} employee file(s)!`);
  };

  const clearProcessedFiles = () => {
    sessionStorage.removeItem('tempEmployeeUploads');
    setUploadedFiles([]);
    setProcessingProgress(0);
    setProcessedCount(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getEmployeeTypeIcon = (type: string) => {
    switch (type) {
      case 'bulk_upload':
        return <Users className="w-4 h-4" />;
      case 'new_employee':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      case 'pending_processing':
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <>
      <GoBack />

      <div className="mt-6 space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-lg">Employee Upload Queue</h4>
            {uploadedFiles.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={simulateProcessing}
                  disabled={isProcessing}
                  variant="default"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Process All Files"}
                </Button>
                <Button
                  onClick={clearProcessedFiles}
                  variant="outline"
                  disabled={isProcessing}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {uploadedFiles.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
              <p className="text-gray-500 mb-4">
                Upload employee files from the workforce database to see them here.
              </p>
              <Button onClick={() => router.push(HrRoutes.WORKFORCE_DATABASE)}>
                Go to Workforce Database
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {isProcessing && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      Processing employee files... ({processedCount}/{uploadedFiles.length})
                    </span>
                    <span className="text-sm text-blue-700">{Math.round(processingProgress)}%</span>
                  </div>
                  <Progress value={processingProgress} className="w-full" />
                </div>
              )}

              {uploadedFiles.map((upload, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getEmployeeTypeIcon(upload.employee_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium text-gray-900 truncate">
                          {upload.file.name}
                        </h5>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(upload.file.size)} • {upload.employee_type.replace('_', ' ')}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {upload.department}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {upload.position}
                          </span>
                        </div>
                        {upload.description && (
                          <p className="mt-1 text-xs text-gray-600">
                            {upload.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getStatusColor(upload.status)}`}>
                        {upload.status === 'processed' ? 'Processed' :
                         upload.status === 'processing' ? 'Processing' : 'Pending'}
                      </span>
                      {upload.status === 'processed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {upload.status === 'pending_processing' && (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Placeholder sections for future backend integration */}
        <Card>
          <h4 className="font-semibold text-lg mb-4">Processing Guidelines</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Bulk upload files should be in CSV or Excel format with required columns</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Individual employee documents (PDF, images) will be attached to profiles</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>All uploads are validated for data integrity and format compliance</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span>Backend integration pending - currently using placeholder processing</span>
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="font-semibold text-lg mb-4">Upload Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{uploadedFiles.length}</div>
              <div className="text-sm text-blue-800">Total Files</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {uploadedFiles.filter(f => f.status === 'processed').length}
              </div>
              <div className="text-sm text-green-800">Processed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {uploadedFiles.filter(f => f.status === 'pending_processing').length}
              </div>
              <div className="text-sm text-yellow-800">Pending</div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default EmployeeUploadProcessor;