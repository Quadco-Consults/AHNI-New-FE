"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "components/ui/alert";
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "lib/utils";
import {
  downloadVendorTemplate,
  parseVendorCSV,
  validateVendorData,
  VendorTemplateData,
} from "@/features/procurement/utils/vendorTemplateGenerator";
import { toast } from "sonner";

interface VendorBulkUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (vendors: VendorTemplateData[]) => Promise<void>;
}

const VendorBulkUploadModal = ({ open, onClose, onUpload }: VendorBulkUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [vendors, setVendors] = useState<VendorTemplateData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    downloadVendorTemplate();
    toast.success("Template downloaded successfully!");
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setVendors([]);
    setUploadSuccess(false);

    try {
      const parsedVendors = await parseVendorCSV(selectedFile);
      setVendors(parsedVendors);

      // Validate data
      const validation = validateVendorData(parsedVendors);
      if (!validation.valid) {
        setErrors(validation.errors);
        toast.error(`Found ${validation.errors.length} validation error(s)`);
      } else {
        toast.success(`Successfully parsed ${parsedVendors.length} vendor(s)`);
      }
    } catch (error) {
      console.error("File parse error:", error);
      toast.error("Failed to parse CSV file. Please check the format.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (vendors.length === 0 || errors.length > 0) {
      toast.error("Please fix all errors before uploading");
      return;
    }

    setIsUploading(true);

    try {
      await onUpload(vendors);
      setUploadSuccess(true);
      toast.success(`Successfully uploaded ${vendors.length} vendor(s)!`);

      // Reset after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload vendors. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setVendors([]);
    setErrors([]);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setVendors([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload size={24} />
            Bulk Upload Vendors
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Step 1: Download Template */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Download Template</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Download the CSV template file with all required vendor fields
                </p>
                <Button
                  onClick={handleDownloadTemplate}
                  variant="outline"
                  className="mt-3"
                >
                  <Download size={16} className="mr-2" />
                  Download CSV Template
                </Button>
              </div>
            </div>
          </div>

          {/* Step 2: Fill Template */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Fill in Vendor Details</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Open the template in Excel or any spreadsheet software and fill in vendor information
                </p>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">Required Fields (marked with *):</p>
                  <ul className="text-xs text-yellow-700 mt-2 space-y-1 ml-4 list-disc">
                    <li>Company Name, RC Number, Tax ID Number</li>
                    <li>Company Email, Main Office Address, State</li>
                    <li>Products/Services, Area of Specialization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Upload File */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Upload Filled Template</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Save your file and upload it here
                </p>

                {!file ? (
                  <div className="mt-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="vendor-csv-upload"
                    />
                    <label htmlFor="vendor-csv-upload">
                      <Button variant="default" className="cursor-pointer" asChild>
                        <span>
                          <FileSpreadsheet size={16} className="mr-2" />
                          Choose CSV File
                        </span>
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet size={20} className="text-green-600" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        disabled={isUploading}
                      >
                        <X size={16} />
                      </Button>
                    </div>

                    {/* Validation Results */}
                    {vendors.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={20} className="text-green-600" />
                          <span className="text-sm font-medium">
                            Found {vendors.length} vendor(s) in file
                          </span>
                        </div>

                        {errors.length > 0 && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <p className="font-semibold mb-2">
                                {errors.length} validation error(s) found:
                              </p>
                              <ul className="text-xs space-y-1 max-h-40 overflow-y-auto">
                                {errors.slice(0, 10).map((error, index) => (
                                  <li key={index}>• {error}</li>
                                ))}
                                {errors.length > 10 && (
                                  <li className="font-semibold">
                                    ... and {errors.length - 10} more errors
                                  </li>
                                )}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}

                        {errors.length === 0 && (
                          <Alert className="border-green-200 bg-green-50">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              All vendor data is valid and ready to upload!
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Success Message */}
          {uploadSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <p className="font-semibold">Upload Successful!</p>
                <p className="text-sm mt-1">
                  {vendors.length} vendor(s) have been added to the database.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || vendors.length === 0 || errors.length > 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload {vendors.length} Vendor(s)
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorBulkUploadModal;
