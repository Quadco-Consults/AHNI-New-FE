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

// Version marker to verify code is loading
console.log('🚀🚀🚀 BulkUploadDialog V3 LOADED - 2025-01-09-18:00 🚀🚀🚀');

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
      console.log('🔄 Dialog opened, fetching lookup data...');
      setIsLoadingLookups(true);
      fetchAssetUploadLookups()
        .then((data) => {
          console.log('✅ Lookup data fetched successfully:', {
            assetTypes: data.assetTypes.size,
            projects: data.projects.size,
            donors: data.donors.size,
            implementers: data.implementers.size,
            locations: data.locations.size,
            classifications: data.classifications.size,
            conditions: data.conditions.size,
            employees: data.employees.size
          });
          setLookups(data);
          setIsLoadingLookups(false);
        })
        .catch((error) => {
          console.error("❌ Error loading lookup data:", error);
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
    // VERSION: 2025-01-09-17:45 - Name to UUID preprocessing active
    alert('🚀 NEW CODE V2 LOADED! Upload button clicked with file: ' + (selectedFile?.name || 'none'));
    console.log('🚀 NEW CODE V2 - handleUpload called at', new Date().toISOString());

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
      console.log('🔄 Starting preprocessing for file:', selectedFile.name, selectedFile.type, selectedFile.size);
      console.log('📊 Lookups available:', {
        assetTypes: lookups.assetTypes.size,
        projects: lookups.projects.size,
        donors: lookups.donors.size,
        implementers: lookups.implementers.size,
        locations: lookups.locations.size,
        classifications: lookups.classifications.size,
        conditions: lookups.conditions.size,
        employees: lookups.employees.size
      });
      toast.info("Converting names to system IDs...");

      let processedFile;
      try {
        processedFile = await preprocessAssetCSV(selectedFile, lookups);
        console.log('✅ Preprocessing completed successfully');
        console.log('📄 Processed file:', processedFile.name, processedFile.type, processedFile.size);
      } catch (preprocessError) {
        console.error('❌ Preprocessing failed:', preprocessError);
        clearInterval(progressInterval);
        throw new Error(`Failed to preprocess file: ${preprocessError instanceof Error ? preprocessError.message : 'Unknown error'}`);
      }

      // Update progress
      clearInterval(progressInterval);
      setUploadProgress(80);

      // Upload the processed file
      console.log('Uploading processed file:', processedFile.name, processedFile.type, processedFile.size);

      // DEBUG: Read the actual file content before uploading
      const verifyReader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        verifyReader.onload = (e) => resolve(e.target?.result as string);
        verifyReader.onerror = reject;
        verifyReader.readAsText(processedFile);
      });
      console.log('📄 ACTUAL FILE CONTENT BEING UPLOADED:');
      console.log('First 500 chars:', fileContent.substring(0, 500));
      console.log('Last 200 chars:', fileContent.substring(Math.max(0, fileContent.length - 200)));
      console.log('Total length:', fileContent.length, 'characters');
      console.log('Number of lines:', fileContent.split('\n').length);

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
    // Get sample names from lookup data for template (only available after lookups are fetched)
    const sampleAssetType = (lookups?.assetTypes.size && lookups.assetTypes.size > 0)
      ? Array.from(lookups.assetTypes.keys())[0]
      : '';
    const sampleDonor = (lookups?.donors.size && lookups.donors.size > 0)
      ? Array.from(lookups.donors.keys())[0]
      : '';
    const sampleLocation = (lookups?.locations.size && lookups.locations.size > 0)
      ? Array.from(lookups.locations.keys())[0]
      : '';
    const sampleClassification = (lookups?.classifications.size && lookups.classifications.size > 0)
      ? Array.from(lookups.classifications.keys())[0]
      : '';
    const sampleCondition = (lookups?.conditions.size && lookups.conditions.size > 0)
      ? Array.from(lookups.conditions.keys())[0]
      : '';
    const sampleImplementer = (lookups?.implementers.size && lookups.implementers.size > 0)
      ? Array.from(lookups.implementers.keys())[0]
      : '';

    // Create CSV template with asset fields including category
    // Helper text in parentheses is automatically cleaned by the backend
    const headers = [
      "category (Required)",
      "name (Required)",
      "description (Optional)",
      "uom (Required)",
      "asset_code (Optional)",
      "plate_number (Optional - Vehicles)",
      "chasis_number (Optional - Vehicles)",
      "asset_type (Optional - ID or name)",
      "project (Optional - ID or name)",
      "donor (Optional - ID or name)",
      "assignee (Optional - Email or ID)",
      "implementer (Optional - ID or name)",
      "location (Optional - ID or name)",
      "state (Optional)",
      "classification (Optional - ID or name)",
      "asset_condition (Optional - ID or name)",
      "acquisition_date (Optional - YYYY-MM-DD)",
      "estimated_life_span (Optional - Years)",
      "usd_cost (Optional)",
      "ngn_cost (Optional)",
      "unit (Required - Quantity)",
      "depreciation_rate (Optional - %)",
      "insurance_duration (Optional - Months)"
    ];

    // Sample data rows - Uses REAL names from your system
    // Replace with your actual data, but these are valid examples
    const sampleData1 = [
      "Fixed Assets",  // category - REQUIRED (must match exactly)
      "Example Laptop",  // name - REQUIRED
      "Sample laptop for demonstration",  // description
      "Unit",  // uom - REQUIRED
      "AST-2024-001",  // asset_code
      "",  // plate_number - leave empty for non-vehicles
      "",  // chasis_number - leave empty for non-vehicles
      sampleAssetType,  // asset_type - Real name from your system
      "",  // project - Use exact project name or leave empty (note: projects endpoint may be returning 0 results)
      sampleDonor,  // donor - Real name from your system
      "admin@mail.com",  // assignee - Use employee email or leave empty
      sampleImplementer,  // implementer - Real partner name from your system
      sampleLocation,  // location - Real location name from your system
      "",  // state
      sampleClassification,  // classification - Real classification name from your system
      sampleCondition,  // asset_condition - Real condition name from your system
      "2024-01-15",  // acquisition_date (YYYY-MM-DD)
      "5",  // estimated_life_span (years)
      "1200",  // usd_cost
      "",  // ngn_cost
      "1",  // unit - REQUIRED (quantity)
      "",  // depreciation_rate
      ""  // insurance_duration
    ];

    const sampleData2 = [
      "Fixed Assets",
      "Example Office Desk",
      "Sample desk for demonstration",
      "Unit",
      "AST-2024-002",
      "",
      "",
      sampleAssetType,  // Use real Asset Type from system
      "",  // Project - leave empty if projects endpoint is not working
      sampleDonor,  // Use real Donor from system
      "",  // Assignee - leave empty or use valid email
      "",  // Implementer
      "",  // Location
      "",
      sampleClassification,  // Use real Classification from system
      sampleCondition,  // Use real Condition from system
      "2024-02-20",
      "10",
      "300",
      "",
      "1",
      "",
      ""
    ];

    // Build helpful comment with available options
    const availableOptions = [];
    if (lookups) {
      if (lookups.assetTypes.size > 0) {
        const types = Array.from(lookups.assetTypes.keys()).slice(0, 5).join(', ');
        availableOptions.push(`# Available Asset Types: ${types}${lookups.assetTypes.size > 5 ? `, ... (${lookups.assetTypes.size} total)` : ''}`);
      }
      if (lookups.donors.size > 0) {
        const donors = Array.from(lookups.donors.keys()).slice(0, 5).join(', ');
        availableOptions.push(`# Available Donors: ${donors}${lookups.donors.size > 5 ? `, ... (${lookups.donors.size} total)` : ''}`);
      }
      if (lookups.locations.size > 0) {
        const locations = Array.from(lookups.locations.keys()).slice(0, 5).join(', ');
        availableOptions.push(`# Available Locations: ${locations}${lookups.locations.size > 5 ? `, ... (${lookups.locations.size} total)` : ''}`);
      }
      if (lookups.classifications.size > 0) {
        const classifications = Array.from(lookups.classifications.keys()).slice(0, 5).join(', ');
        availableOptions.push(`# Available Classifications: ${classifications}${lookups.classifications.size > 5 ? `, ... (${lookups.classifications.size} total)` : ''}`);
      }
      if (lookups.conditions.size > 0) {
        const conditions = Array.from(lookups.conditions.keys()).slice(0, 5).join(', ');
        availableOptions.push(`# Available Conditions: ${conditions}${lookups.conditions.size > 5 ? `, ... (${lookups.conditions.size} total)` : ''}`);
      }
    }

    const csvContent = [
      headers.join(","),
      "# INSTRUCTIONS: Replace sample data with your actual asset information",
      "# Use EXACT names as they appear below (case-sensitive for foreign key fields)",
      "# Required fields: category, name, uom, unit",
      "# Optional fields can be left empty",
      ...availableOptions,
      "#",
      "# SAMPLE DATA (uses real names from your system):",
      sampleData1.join(","),
      sampleData2.join(","),
      "# Add more assets below - one row per asset",
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
