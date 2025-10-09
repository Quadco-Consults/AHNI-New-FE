"use client";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { useBulkUploadItems } from "@/features/modules/controllers/config/itemController";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId?: string; // Keep for backward compatibility but no longer used
}

interface UploadResult {
  created: number;
  updated: number;
  failed: number;
  errors?: Array<{ row: number; error: string }>;
}

export default function BulkUploadDialog({ open, onOpenChange }: BulkUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
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
      setUploadStatus("uploading");
      setUploadProgress(0);
      setUploadResult(null);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Don't pass categoryId - it's now in the CSV file
      const result = await bulkUploadItems(selectedFile);

      clearInterval(progressInterval);
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
      let errorMessage = "Failed to upload consumables";

      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          setUploadResult(errorData);
          errorMessage = `Upload failed: ${errorData.errors.length} row(s) had errors`;
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
    // Create CSV template with all consumable fields including category
    const headers = [
      "category",
      "name",
      "description",
      "uom",
      "quantity",
      "stock_control_method",
      "expiry_date",
      "re_order_level",
      "buffer_stock",
      "max_stock",
      "entry_date",
      "item_cost",
      "price"
    ];

    // Sample data rows with proper values
    const sampleData1 = [
      "Office Supplies",
      "Paper A4 Ream",
      "White A4 printing paper - 500 sheets per ream",
      "Ream",
      "100",
      "STOCK_LEVEL",
      "2025-12-31",
      "10",
      "5",
      "200",
      "2025-01-15",
      "2500.00",
      "2500.00"
    ];

    const sampleData2 = [
      "Office Supplies",
      "Ballpoint Pen Blue",
      "Blue ballpoint pen for office use",
      "Box",
      "50",
      "AVAILABILITY",
      "2026-06-30",
      "15",
      "10",
      "100",
      "2025-01-20",
      "1200.00",
      "1500.00"
    ];

    const sampleData3 = [
      "IT Equipment",
      "USB Flash Drive 32GB",
      "High-speed USB 3.0 flash drive",
      "Piece",
      "25",
      "JUST_IN_TIME",
      "2027-12-31",
      "5",
      "3",
      "50",
      "2025-01-22",
      "1500.00",
      "2000.00"
    ];

    // Add instruction row
    const instructionRow = [
      "REQUIRED: Category name",
      "REQUIRED: Item name",
      "REQUIRED: Item description",
      "REQUIRED: Unit (Piece/Box/Liter/etc)",
      "OPTIONAL: Starting quantity",
      "OPTIONAL: STOCK_LEVEL/AVAILABILITY/JUST_IN_TIME",
      "OPTIONAL: YYYY-MM-DD",
      "OPTIONAL: Min stock before reorder",
      "OPTIONAL: Safety stock",
      "OPTIONAL: Max capacity",
      "OPTIONAL: YYYY-MM-DD",
      "OPTIONAL: Cost/unit",
      "OPTIONAL: Price/unit"
    ];

    const noteRow = [
      "⚠️ DELETE THIS ROW AND THE NEXT ROW BEFORE UPLOADING ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️",
      "⚠️ DELETE THIS ROW ⚠️"
    ];

    const csvContent = [
      headers.join(","),
      noteRow.join(","),
      instructionRow.join(","),
      "# SAMPLE DATA BELOW - You can delete these rows and add your own",
      sampleData1.join(","),
      sampleData2.join(","),
      sampleData3.join(","),
      "# Add your consumable data below (delete this comment line)",
      Array(headers.length).fill("").join(","),
      Array(headers.length).fill("").join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "consumables_upload_template.csv");
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
          <DialogTitle>Bulk Upload Consumables</DialogTitle>
          <DialogDescription>
            Upload multiple consumables at once using an Excel or CSV file. Download the template to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Banner */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="text-blue-600" size={18} />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Multi-Category Upload:</span> You can now upload items from different categories in a single file.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Each row in your CSV should include the category name for that item.
              </p>
            </div>
          </div>

          {/* Download Template Section */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-blue-900 mb-1">Step 1: Download Template</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Download the CSV template, fill in your consumable data, and upload it back here.
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
                            <p className="font-semibold text-red-800">Row {error.row}:</p>
                            <p className="text-red-700 mt-1">{error.error}</p>
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

          {/* Critical Warning */}
          <div className="border-2 rounded-lg p-4 bg-red-50 border-red-300">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-sm text-red-900 mb-2">⚠️ CRITICAL: Delete Warning Rows Before Upload!</h4>
                <p className="text-sm text-red-800 mb-2">
                  The template contains instruction rows marked with <strong>"⚠️ DELETE THIS ROW ⚠️"</strong>
                </p>
                <p className="text-sm text-red-800 font-semibold">
                  You MUST delete rows 2 and 3 (warning and instruction rows) before uploading, or the upload will fail!
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-sm mb-2">Important Instructions:</h4>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              <li className="text-red-700 font-bold">⚠️ DELETE rows 2-3 (warning & instruction rows) before uploading</li>
              <li className="text-red-700 font-bold">⚠️ DELETE comment lines (starting with #) before uploading</li>
              <li><strong>Required fields:</strong> category, name, description, uom</li>
              <li><strong>Category:</strong> Must match an existing category name exactly (case-sensitive)</li>
              <li><strong>Date format:</strong> Use YYYY-MM-DD (e.g., 2025-12-31)</li>
              <li><strong>Stock control methods:</strong> STOCK_LEVEL, AVAILABILITY, or JUST_IN_TIME</li>
              <li><strong>Numeric fields:</strong> Use numbers only (no letters or special characters)</li>
              <li><strong>UOM examples:</strong> Piece, Box, Carton, Liter, Kilogram, Ream, Pack</li>
              <li><strong>Multiple categories:</strong> You can include items from different categories in one upload</li>
              <li>Do not modify the header row in the template</li>
            </ul>
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
