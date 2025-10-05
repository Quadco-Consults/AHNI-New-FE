"use client";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useBulkUploadItems } from "@/features/modules/controllers/config/itemController";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
}

export default function AssetBulkUploadDialog({ open, onOpenChange, categoryId }: BulkUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { bulkUploadItems, isLoading } = useBulkUploadItems();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv"
      ];

      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast.error("Please upload a valid Excel or CSV file");
        return;
      }

      setSelectedFile(file);
      setUploadStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      await bulkUploadItems(selectedFile);
      setUploadStatus("success");
      toast.success("Assets uploaded successfully!");

      // Close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setSelectedFile(null);
        setUploadStatus("idle");
        // Reload the page to show new data
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      setUploadStatus("error");
      toast.error(error?.message || "Failed to upload assets");
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template with asset fields
    const headers = [
      "name",
      "description",
      "uom",
      "asset_code",
      "plate_number",
      "chasis_number",
      "asset_type",
      "project",
      "donor",
      "assignee",
      "implementer",
      "location",
      "state",
      "classification",
      "asset_condition",
      "acquisition_date",
      "estimated_life_span",
      "usd_cost",
      "ngn_cost",
      "unit",
      "depreciation_rate",
      "insurance_duration"
    ];

    const sampleData = [
      "Toyota Hilux",
      "4x4 Double Cab Pickup",
      "Unit",
      "AST-2024-001",
      "ABC-123-XY",
      "JTFDE626500123456",
      "Vehicle",
      "Project A",
      "USAID",
      "John Doe",
      "ABC Organization",
      "Lagos Office",
      "Lagos",
      "Fixed Asset",
      "Good",
      "2024-01-15",
      "10 years",
      "45000",
      "72000000",
      "1",
      "10",
      "12 months"
    ];

    const instructionRow = [
      "Required",
      "Optional",
      "Required (e.g., Unit, Each)",
      "Optional (Unique code)",
      "Optional (For vehicles)",
      "Optional (For vehicles)",
      "Optional (ID or name)",
      "Optional (ID or name)",
      "Optional (ID or name)",
      "Optional (User ID or email)",
      "Optional (User ID or name)",
      "Optional (ID or name)",
      "Optional (State name)",
      "Optional (ID or name)",
      "Optional (ID or name)",
      "Optional (YYYY-MM-DD)",
      "Optional (e.g., 10 years)",
      "Optional (USD amount)",
      "Optional (NGN amount)",
      "Required (Number)",
      "Optional (Percentage)",
      "Optional (Duration)"
    ];

    const csvContent = [
      headers.join(","),
      instructionRow.join(","),
      sampleData.join(","),
      // Add empty rows for user to fill
      Array(headers.length).fill("").join(","),
      Array(headers.length).fill("").join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "assets_upload_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Template downloaded successfully!");
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Assets</DialogTitle>
          <DialogDescription>
            Upload multiple assets at once using an Excel or CSV file. Download the template to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Download Template Section */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-blue-900 mb-1">Step 1: Download Template</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Download the CSV template, fill in your asset data, and upload it back here.
                </p>
                <Button
                  onClick={handleDownloadTemplate}
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-100"
                >
                  <Download size={16} className="mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Step 2: Upload Filled Template</h4>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {!selectedFile ? (
                  <>
                    <Upload className="mx-auto mb-3 text-gray-400" size={40} />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to select or drag and drop your file here
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Supported formats: CSV, XLS, XLSX (Max 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          Select File
                        </span>
                      </Button>
                    </label>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="text-green-600" size={24} />
                      <div className="text-left">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={isLoading}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Status */}
            {uploadStatus === "success" && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
                <p className="text-sm text-green-800">Upload completed successfully!</p>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-sm text-red-800">Upload failed. Please try again.</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-sm mb-2">Important Instructions:</h4>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              <li><strong>Required fields:</strong> name, uom, unit, category</li>
              <li><strong>Optional fields:</strong> All other fields can be left empty if not applicable</li>
              <li>Use the correct date format: <strong>YYYY-MM-DD</strong> for dates (e.g., 2024-01-15)</li>
              <li>For foreign key fields (project, donor, assignee, etc.), use either ID or name</li>
              <li>Asset codes should be unique if provided</li>
              <li>Vehicle-specific fields: plate_number and chasis_number (only for vehicles)</li>
              <li>Numeric fields (usd_cost, ngn_cost, unit, depreciation_rate) should contain only numbers</li>
              <li>Do not modify the header row in the template</li>
            </ul>
          </div>

          {/* Field Reference */}
          <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
            <h4 className="font-semibold text-sm text-amber-900 mb-2">Quick Field Reference:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="font-medium text-amber-900">Asset Information:</p>
                <p className="text-amber-800">name, description, asset_code</p>
              </div>
              <div>
                <p className="font-medium text-amber-900">Vehicle Details:</p>
                <p className="text-amber-800">plate_number, chasis_number</p>
              </div>
              <div>
                <p className="font-medium text-amber-900">Classification:</p>
                <p className="text-amber-800">asset_type, classification, asset_condition</p>
              </div>
              <div>
                <p className="font-medium text-amber-900">Financial:</p>
                <p className="text-amber-800">usd_cost, ngn_cost, depreciation_rate</p>
              </div>
              <div>
                <p className="font-medium text-amber-900">Assignment:</p>
                <p className="text-amber-800">assignee, implementer, location, state</p>
              </div>
              <div>
                <p className="font-medium text-amber-900">Project Info:</p>
                <p className="text-amber-800">project, donor</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
