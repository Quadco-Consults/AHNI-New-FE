"use client";

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { generateTargetsTemplate, parseTargetsFile, TargetTemplateData } from '@/features/projects/utils/targetTemplateGenerator';
import { ProjectTargetDefinition } from '@/features/projects/types/project';

interface TargetBulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (targets: ProjectTargetDefinition[]) => void;
  viewMode: 'simple' | 'quarterly';
}

export default function TargetBulkUploadModal({
  open,
  onClose,
  onImport,
  viewMode
}: TargetBulkUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<TargetTemplateData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    try {
      await generateTargetsTemplate(viewMode);
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
      console.error(error);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);
    setErrors([]);
    setPreviewData([]);

    try {
      const result = await parseTargetsFile(file, viewMode);

      if (result.errors.length > 0) {
        setErrors(result.errors);
        if (result.data.length === 0) {
          toast.error('File contains errors. Please fix and try again.');
        } else {
          toast.warning(`Imported ${result.data.length} targets with ${result.errors.length} errors`);
        }
      } else {
        toast.success(`Successfully parsed ${result.data.length} targets`);
      }

      setPreviewData(result.data);
    } catch (error) {
      toast.error('Failed to process file');
      console.error(error);
      setErrors(['Failed to process file. Please check the format and try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleImport = () => {
    if (previewData.length === 0) {
      toast.error('No valid targets to import');
      return;
    }

    // Convert template data to ProjectTargetDefinition format
    const targets: ProjectTargetDefinition[] = previewData.map((item, index) => ({
      id: `upload_${Date.now()}_${index}`,
      indicator_code: item.indicator_code,
      indicator_name: item.indicator_name || '',
      tracking_mode: item.tracking_mode,
      fiscal_year: item.fiscal_year,
      annual_target: item.annual_target,
      q1_target: item.q1_target,
      q2_target: item.q2_target,
      q3_target: item.q3_target,
      q4_target: item.q4_target,
      target_notes: item.target_notes || '',
    }));

    onImport(targets);
    toast.success(`Imported ${targets.length} targets successfully`);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setErrors([]);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Performance Targets</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import multiple targets at once. Download the template to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Step 1: Download Template */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <h3 className="font-semibold">Download Template</h3>
            </div>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-600">
                Download the Excel template for {viewMode === 'quarterly' ? 'quarterly' : 'simple'} tracking mode.
              </p>
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Download className="mr-2" size={16} />
                Download Template ({viewMode === 'quarterly' ? 'Quarterly' : 'Simple'} Mode)
              </Button>
            </div>
          </div>

          {/* Step 2: Fill Template */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <h3 className="font-semibold">Fill in the Template</h3>
            </div>
            <div className="ml-8">
              <p className="text-sm text-gray-600">
                Open the downloaded file in Excel, fill in your target data, and save the file.
              </p>
            </div>
          </div>

          {/* Step 3: Upload File */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <h3 className="font-semibold">Upload Completed Template</h3>
            </div>
            <div className="ml-8">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    {selectedFile ? (
                      <FileSpreadsheet className="text-green-600" size={32} />
                    ) : (
                      <Upload className="text-gray-400" size={32} />
                    )}
                  </div>
                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Drag and drop your file here, or
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                      >
                        <Upload className="mr-2" size={16} />
                        Browse Files
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {selectedFile && (
                <div className="mt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewData([]);
                      setErrors([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="mr-1" size={14} />
                    Remove File
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-blue-600 py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm">Processing file...</span>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 text-sm">
                    {errors.length} Error{errors.length > 1 ? 's' : ''} Found
                  </h4>
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {errors.map((error, index) => (
                      <p key={index} className="text-xs text-red-700">
                        • {error}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {previewData.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 text-sm">
                    {previewData.length} Target{previewData.length > 1 ? 's' : ''} Ready to Import
                  </h4>
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {previewData.slice(0, 5).map((target, index) => (
                      <p key={index} className="text-xs text-green-700">
                        • {target.indicator_code} ({target.fiscal_year}): {target.annual_target.toLocaleString()}
                      </p>
                    ))}
                    {previewData.length > 5 && (
                      <p className="text-xs text-green-700 italic">
                        ... and {previewData.length - 5} more
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={previewData.length === 0 || isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="mr-2" size={16} />
            Import {previewData.length} Target{previewData.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
