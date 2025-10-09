"use client";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { useBulkUploadItems } from "@/features/modules/controllers/config/itemController";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchAssetUploadLookups, preprocessAssetCSV, type AssetUploadLookups } from "@/features/admin/utils/assetBulkUploadHelper";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId?: string; // Keep for backward compatibility but no longer used
}

interface UploadResult {
  created: number;
  updated: number;
  failed: number;
  skipped?: number;
  errors?: Array<{ row: number; item_name?: string; errors: string[] | string }>;
}

export default function AssetBulkUploadDialog({ open, onOpenChange }: BulkUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [lookups, setLookups] = useState<AssetUploadLookups | null>(null);
  const [isLoadingLookups, setIsLoadingLookups] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { bulkUploadItems, isLoading } = useBulkUploadItems();

  // Fetch lookup data when dialog opens
  useEffect(() => {
    if (open && !lookups) {
      setIsLoadingLookups(true);
      fetchAssetUploadLookups()
        .then((data) => {
          setLookups(data);
          setIsLoadingLookups(false);
        })
        .catch((error) => {
          console.error("Error loading lookup data:", error);
          toast.error("Failed to load reference data. Some name lookups may not work.");
          setIsLoadingLookups(false);
        });
    }
  }, [open, lookups]);

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

    if (!lookups) {
      toast.error("Reference data is still loading. Please wait a moment.");
      return;
    }

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);
      setUploadResult(null);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 70));
      }, 200);

      // Preprocess CSV to convert names to UUIDs
      toast.info("Converting names to system IDs...");
      const processedFile = await preprocessAssetCSV(selectedFile, lookups);

      // Update progress
      clearInterval(progressInterval);
      setUploadProgress(80);

      // Upload the processed file
      toast.info("Uploading assets...");
      const result = await bulkUploadItems(processedFile);

      setUploadProgress(100);

      // Extract result data from the response
      const resultData = result?.data || result;
      setUploadResult(resultData);

      if (resultData.failed > 0) {
        setUploadStatus("error");
        toast.error(`Upload completed with ${resultData.failed} errors. Check details below.`);
      } else {
        setUploadStatus("success");
        toast.success(`Successfully uploaded! Created: ${resultData.created}, Updated: ${resultData.updated}`);

        // Close dialog and reload after success
        setTimeout(() => {
          onOpenChange(false);
          setSelectedFile(null);
          setUploadStatus("idle");
          setUploadResult(null);
          window.location.reload();
        }, 3000);
      }
    } catch (error: any) {
      setUploadStatus("error");
      setUploadProgress(0);

      console.error("Bulk upload error:", error);

      // Extract detailed error message
      let errorMessage = "Failed to upload assets";

      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          // Check if errors are simple strings (validation errors) or objects (row errors)
          if (errorData.errors.length > 0 && typeof errorData.errors[0] === 'string') {
            // Simple validation errors - show them directly
            errorMessage = errorData.message || "Upload failed";
            if (errorData.errors.length > 0) {
              errorMessage += `: ${errorData.errors.join(', ')}`;
            }
          } else {
            // Row-specific errors
            setUploadResult(errorData);
            errorMessage = `Upload failed: ${errorData.errors.length} row(s) had errors`;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template with asset fields including category
    // Use exact column names as expected by backend
    const headers = [
      "Category",
      "Name",
      "Description",
      "UOM",
      "Asset Code",
      "Plate Number",
      "Chasis Number",
      "Asset Type",
      "Project",
      "Donor",
      "Assignee",
      "Implementer",
      "Location",
      "State",
      "Classification",
      "Asset Condition",
      "Acquisition Date",
      "Estimated Life Span",
      "USD Cost",
      "NGN Cost",
      "Unit",
      "Depreciation Rate",
      "Insurance Duration"
    ];

    // Sample data rows with proper values
    // You can use names for Asset Type, Project, Donor, Location, etc. - they will be automatically converted to UUIDs
    const sampleData1 = [
      "Fixed Assets",
      "Toyota Hilux",
      "4x4 Double Cab Pickup",
      "Unit",
      "AST-2024-001",
      "ABC-123-XY",
      "JTFDE626500123456",
      "Vehicle", // Asset Type - use name from system
      "Project A", // Project - use name from system
      "USAID", // Donor - use name from system
      "admin@mail.com", // Assignee - use email
      "ABC Organization", // Implementer - use partner name
      "Lagos Office", // Location - use location name
      "Lagos",
      "Fixed Asset", // Classification - use name
      "Good", // Asset Condition - use name
      "2024-01-15",
      "10",
      "45000",
      "72000000",
      "1",
      "10",
      "12"
    ];

    const sampleData2 = [
      "Fixed Assets",
      "HP Laptop",
      "HP EliteBook 840 G8 - Core i7",
      "Unit",
      "AST-2024-002",
      "",
      "",
      "IT Equipment", // Asset Type - use name
      "Project B", // Project - use name
      "USAID", // Donor - use name
      "user@mail.com", // Assignee - use email
      "ABC Organization", // Implementer - use partner name
      "Abuja Office", // Location - use location name
      "FCT",
      "IT Asset", // Classification - use name
      "Excellent", // Asset Condition - use name
      "2024-02-20",
      "5",
      "1200",
      "1920000",
      "1",
      "20",
      "0"
    ];

    const sampleData3 = [
      "Fixed Assets",
      "Office Desk",
      "Wooden executive desk with drawers",
      "Unit",
      "AST-2024-003",
      "",
      "",
      "Furniture", // Asset Type - use name
      "", // Project - leave empty if not needed
      "", // Donor - leave empty if not needed
      "", // Assignee - leave empty if not needed
      "", // Implementer - leave empty if not needed
      "Lagos Office", // Location - use location name
      "Lagos",
      "Furniture", // Classification - use name
      "Good", // Asset Condition - use name
      "2024-03-10",
      "15",
      "300",
      "480000",
      "1",
      "10",
      "0"
    ];

    const csvContent = [
      headers.join(","),
      "# Sample data below - modify or replace with your own data",
      sampleData1.join(","),
      sampleData2.join(","),
      sampleData3.join(","),
      "# Add your asset data below",
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Assets</DialogTitle>
          <DialogDescription>
            Upload multiple assets at once using an Excel or CSV file. Download the template to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Loading Lookups Indicator */}
          {isLoadingLookups && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-900">
                Loading reference data for name resolution...
              </p>
            </div>
          )}

          {/* Info Banners */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="text-blue-600" size={18} />
              <div className="flex-1">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">Multi-Category Upload:</span> You can now upload assets from different categories in a single file.
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Each row in your CSV should include the category name for that asset.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-300 rounded-lg">
              <CheckCircle className="text-green-600" size={18} />
              <div className="flex-1">
                <p className="text-sm text-green-900">
                  <span className="font-medium">✨ Smart Name Resolution:</span> Use friendly names for Asset Type, Project, Donor, Location, etc.
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Names will be automatically converted to the correct system IDs. Leave fields empty if not needed.
                </p>
              </div>
            </div>
          </div>

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

            {/* Upload Progress */}
            {uploadStatus === "uploading" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Uploading...</span>
                  <span className="text-gray-900 font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Upload Results */}
            {uploadResult && (
              <div className="space-y-3">
                {/* Summary */}
                <div className={`p-4 rounded-lg border ${
                  uploadResult.failed === 0
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}>
                  <div className="flex items-start gap-3">
                    {uploadResult.failed === 0 ? (
                      <CheckCircle className="text-green-600 mt-0.5" size={20} />
                    ) : (
                      <Info className="text-yellow-600 mt-0.5" size={20} />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2">Upload Summary</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Created</p>
                          <p className="text-green-700 font-semibold text-lg">{uploadResult.created}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Updated</p>
                          <p className="text-blue-700 font-semibold text-lg">{uploadResult.updated}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Failed</p>
                          <p className="text-red-700 font-semibold text-lg">{uploadResult.failed}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Details */}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="border rounded-lg border-red-200 bg-red-50">
                    <div className="p-3 border-b border-red-200 bg-red-100">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="text-red-600" size={18} />
                        <h4 className="font-semibold text-sm text-red-900">
                          Error Details ({uploadResult.errors.length} errors)
                        </h4>
                      </div>
                    </div>
                    <ScrollArea className="h-[200px]">
                      <div className="p-3 space-y-2">
                        {uploadResult.errors.map((error, index) => (
                          <div key={index} className="p-2 bg-white border border-red-200 rounded text-xs">
                            <p className="font-semibold text-red-800">
                              Row {error.row}{error.item_name ? `: ${error.item_name}` : ''}
                            </p>
                            <div className="text-red-700 mt-1">
                              {Array.isArray(error.errors) ? (
                                error.errors.map((err, i) => (
                                  <p key={i}>• {err}</p>
                                ))
                              ) : (
                                <p>{error.errors}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}

            {uploadStatus === "error" && !uploadResult && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-sm text-red-800">Upload failed. Please check the error messages above.</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-sm mb-2">Important Instructions:</h4>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              <li><strong>Column headers:</strong> Do not modify the header row - keep column names exactly as provided in the template</li>
              <li><strong>Comment lines:</strong> Lines starting with # are automatically ignored - you can leave them or delete them</li>
              <li><strong>Required fields:</strong> Category, Name, UOM, Unit</li>
              <li><strong>Optional fields:</strong> Can be left empty - the system will handle them correctly</li>
              <li><strong>Category:</strong> Must match an existing category name exactly (case-sensitive)</li>
              <li><strong>Date format:</strong> Use YYYY-MM-DD (e.g., 2024-01-15)</li>
              <li><strong>Vehicle fields:</strong> Plate Number and Chasis Number (only for vehicles)</li>
              <li><strong className="text-green-600">✨ Name-based Fields:</strong> For Asset Type, Project, Donor, Location, Classification, and Asset Condition, you can use their names as they appear in the system (e.g., "Vehicle", "Project A", "USAID"). Names will be automatically converted to system IDs.</li>
              <li><strong>Assignee field:</strong> Use email address (e.g., admin@mail.com) and it will be matched to the employee</li>
              <li><strong>Asset codes:</strong> Should be unique if provided</li>
              <li><strong>Multiple categories:</strong> You can include assets from different categories in one upload</li>
              <li><strong>Sample data:</strong> You can modify the sample rows or delete them and add your own</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading || isLoadingLookups}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading || isLoadingLookups || !lookups}
          >
            {isLoadingLookups ? "Loading reference data..." : isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
