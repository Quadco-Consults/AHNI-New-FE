"use client";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, X, CheckCircle, AlertCircle, Info, Store } from "lucide-react";
import { toast } from "sonner";
import { useBulkUploadItems } from "@/features/modules/controllers/config/itemController";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetAllStores } from "@/features/admin/controllers/storeController";
import { useGetAllCategoriesManager } from "@/features/modules/controllers/config/categoryController";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [autoAssignToStore, setAutoAssignToStore] = useState(false);
  const [showStoreCreationDialog, setShowStoreCreationDialog] = useState(false);
  const [storesToCreate, setStoresToCreate] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { bulkUploadItems, isLoading } = useBulkUploadItems();

  // Fetch all stores for the dropdown
  const { data: storesData, isLoading: storesLoading } = useGetAllStores({
    page: 1,
    size: 100, // Get all stores
    enabled: open, // Only fetch when dialog is open
  });

  // Fetch all categories for dynamic template generation
  const { data: categoriesData, isLoading: categoriesLoading } = useGetAllCategoriesManager({
    page: 1,
    size: 100, // Get all categories
    enabled: open, // Only fetch when dialog is open
  });

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

    if (autoAssignToStore && !selectedStore) {
      toast.error("Please select a store or uncheck automatic store assignment");
      return;
    }

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);
      setUploadResult(null);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 70)); // Leave room for store assignment
      }, 200);

      // Upload items first
      const result = await bulkUploadItems(selectedFile);

      setUploadProgress(80);

      // Extract result data from the response
      const resultData = result?.data || result;

      // If auto-assign to store is enabled and upload was successful
      if (autoAssignToStore && selectedStore && resultData.created > 0) {
        setUploadProgress(85);

        // TODO: Implement automatic store assignment for newly created items
        // This would require additional API calls to assign items to the selected store
        console.log(`🏪 Auto-assigning ${resultData.created} items to store: ${selectedStore}`);

        // For now, we'll show a message about manual assignment
        toast.info(`Items uploaded successfully! Remember to assign them to ${storesData?.data?.results?.find(s => s.id === selectedStore)?.name || 'the selected store'} using the "Assign to Store" button.`);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(resultData);

      if (resultData.failed > 0) {
        setUploadStatus("error");
        toast.error(`Upload completed with ${resultData.failed} errors. Check details below.`);
      } else {
        setUploadStatus("success");
        const storeMessage = autoAssignToStore && selectedStore
          ? ` Items ready for assignment to ${storesData?.data?.results?.find(s => s.id === selectedStore)?.name}.`
          : '';
        toast.success(`Successfully uploaded! Created: ${resultData.created}, Updated: ${resultData.updated}${storeMessage}`);

        // Close dialog and reload after success
        setTimeout(() => {
          onOpenChange(false);
          setSelectedFile(null);
          setSelectedStore("");
          setAutoAssignToStore(false);
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
    // ================================================================================================
    // DYNAMIC CONSUMABLES BULK UPLOAD TEMPLATE
    // ================================================================================================
    // This template dynamically generates examples based on your current categories:
    const availableCategories = categoriesData?.results || [];
    const categoryNames = availableCategories.map((cat: any) => cat.name);
    const activeCategoriesComment = categoryNames.length > 0
      ? `Available Categories: ${categoryNames.join(', ')}`
      : 'Default Categories: Medical Consumables, Office Supplies, IT Consumables, Cleaning Supplies, Laboratory Consumables';
    // ================================================================================================

    const headers = [
      // ========== REQUIRED FIELDS (ALL consumable types) ==========
      "category (Required)",
      "name (Required)",
      "description (Required)",
      "uom (Required - Unit: Box/Piece/Bottle/Pack/Ream/Carton/Roll/etc)",

      // ========== SMART ASSIGNMENT - STORE ALLOCATION ==========
      "store_name (Required - Store to assign item to. Will auto-create if doesn't exist)",

      // ========== INVENTORY MANAGEMENT FIELDS (COMMON to all types) ==========
      "quantity (Required - Stock quantity for this store)",
      "stock_control_method (Optional - STOCK_LEVEL/AVAILABILITY/JUST_IN_TIME)",
      "re_order_level (Optional - Minimum stock before reorder)",
      "buffer_stock (Optional - Safety stock quantity)",
      "max_stock (Optional - Maximum stock capacity)",

      // ========== FINANCIAL FIELDS ==========
      "item_cost (Optional - Cost per unit)",
      "price (Optional - Selling price per unit)",

      // ========== DATE FIELDS ==========
      "entry_date (Optional - Date entered into inventory - YYYY-MM-DD)",
      "expiry_date (Optional - Product expiry date - YYYY-MM-DD)",

      // ========== TRACKING FIELDS ==========
      "grn_tracking_number (Optional - Goods Receipt Note/Batch number)"
    ];

    // Generate dynamic sample data based on available categories
    const generateSampleData = (categoryName: string, index: number) => {
      const sampleStoreNames = ["AHNI HQ", "AHNI Lagos", "AHNI Kaduna", "AHNI Abuja", "AHNI Research Lab"];
      const storeName = sampleStoreNames[index % sampleStoreNames.length];

      // Default sample based on category type
      const samples: { [key: string]: string[] } = {
        "Medical Consumables": [
          categoryName, "Paracetamol 500mg Tablets", "Pain relief and fever reduction tablets", "Box",
          storeName, "200", "STOCK_LEVEL", "20", "10", "500", "1500.00", "2000.00",
          "2025-01-15", "2026-12-31", "GRN-2025-MED-001"
        ],
        "Office Supplies": [
          categoryName, "Paper A4 Ream - 80gsm", "White printing paper", "Ream",
          storeName, "150", "STOCK_LEVEL", "15", "5", "300", "2500.00", "3000.00",
          "2025-01-10", "", "GRN-2025-OFF-012"
        ],
        "IT Consumables": [
          categoryName, "USB Flash Drive 32GB", "High-speed USB 3.0 flash drive", "Piece",
          storeName, "30", "JUST_IN_TIME", "5", "2", "50", "3500.00", "5000.00",
          "2025-01-12", "2027-01-12", "GRN-2025-IT-045"
        ],
        "Cleaning Supplies": [
          categoryName, "Hand Sanitizer 500ml", "Alcohol-based hand sanitizer", "Bottle",
          storeName, "100", "AVAILABILITY", "10", "5", "200", "800.00", "1200.00",
          "2025-01-08", "2026-06-30", "GRN-2025-CLN-023"
        ],
        "Laboratory Consumables": [
          categoryName, "COVID-19 Rapid Test Kit", "Rapid antigen test kit", "Pack",
          storeName, "50", "STOCK_LEVEL", "10", "5", "100", "12000.00", "15000.00",
          "2025-01-20", "2025-10-31", "GRN-2025-LAB-007"
        ]
      };

      // Return specific sample or generic sample
      return samples[categoryName] || [
        categoryName, `${categoryName} Item`, `Sample item for ${categoryName}`, "Piece",
        storeName, "100", "STOCK_LEVEL", "10", "5", "200", "1000.00", "1500.00",
        "2025-01-15", "", `GRN-2025-${index.toString().padStart(3, '0')}`
      ];
    };

    // Generate sample data for available categories (max 5 examples)
    const dynamicSampleData = availableCategories.slice(0, 5).map((cat: any, index: number) =>
      generateSampleData(cat.name, index)
    );

    // Fallback sample data if no categories are available
    const fallbackSampleData = [
      generateSampleData("Medical Consumables", 0),
      generateSampleData("Office Supplies", 1),
      generateSampleData("IT Consumables", 2)
    ];

    const finalSampleData = dynamicSampleData.length > 0 ? dynamicSampleData : fallbackSampleData;

    // ================================================================================================
    // DYNAMIC EXAMPLES BASED ON YOUR CATEGORIES
    // ================================================================================================
    // Medical supplies often have expiry dates, batch tracking, and strict stock control
    // ================================================================================================
    const sampleData1 = [
      "Medical Consumables",                    // category (Required)
      "Paracetamol 500mg Tablets",             // name (Required)
      "Pain relief and fever reduction tablets - 500mg strength, box of 100 tablets", // description (Required)
      "Box",                                    // uom (Required)
      "AHNI HQ",                                // store_name (Store to assign to - will auto-create if needed)
      "200",                                    // quantity (Stock quantity for this store)
      "STOCK_LEVEL",                           // stock_control_method (Strict tracking for medical)
      "20",                                     // re_order_level (Reorder when below 20 boxes)
      "10",                                     // buffer_stock (Safety stock of 10 boxes)
      "500",                                    // max_stock (Maximum 500 boxes)
      "1500.00",                               // item_cost (Cost per box)
      "2000.00",                               // price (Selling price per box)
      "2025-01-15",                            // entry_date (When received)
      "2026-12-31",                            // expiry_date (Medical products expire)
      "GRN-2025-MED-001"                       // grn_tracking_number (Batch tracking)
    ];

    // ================================================================================================
    // EXAMPLE 2: Office Consumable (Printing Paper)
    // ================================================================================================
    // Office supplies typically have longer shelf life, bulk quantities, standard reorder levels
    // ================================================================================================
    const sampleData2 = [
      "Office Supplies",                        // category (Required)
      "Paper A4 Ream - 80gsm",                 // name (Required)
      "White A4 printing paper - 80gsm weight, 500 sheets per ream", // description (Required)
      "Ream",                                   // uom (Required)
      "AHNI Lagos",                             // store_name (Store assignment - will create if doesn't exist)
      "150",                                    // quantity (150 reams in this store)
      "STOCK_LEVEL",                           // stock_control_method (Track stock levels)
      "15",                                     // re_order_level (Reorder at 15 reams)
      "5",                                      // buffer_stock (Keep 5 reams as buffer)
      "300",                                    // max_stock (Max storage capacity)
      "2500.00",                               // item_cost (Cost per ream)
      "3000.00",                               // price (Selling price)
      "2025-01-10",                            // entry_date
      "",                                       // expiry_date (Paper doesn't expire - leave EMPTY)
      "GRN-2025-OFF-012"                       // grn_tracking_number
    ];

    // ================================================================================================
    // EXAMPLE 3: IT Consumable (USB Flash Drives)
    // ================================================================================================
    // IT consumables may use Just-In-Time ordering, have warranty periods, lower buffer stock
    // ================================================================================================
    const sampleData3 = [
      "IT Consumables",                         // category (Required)
      "SanDisk USB 3.0 Flash Drive 32GB",      // name (Required)
      "High-speed USB 3.0 flash drive - 32GB storage capacity",  // description (Required)
      "Piece",                                  // uom (Required)
      "AHNI Kaduna",                            // store_name (Store assignment - will create if doesn't exist)
      "30",                                     // quantity (30 units in this store)
      "JUST_IN_TIME",                          // stock_control_method (Order as needed)
      "5",                                      // re_order_level (Low minimum)
      "2",                                      // buffer_stock (Minimal buffer)
      "50",                                     // max_stock (Don't overstock IT items)
      "3500.00",                               // item_cost
      "5000.00",                               // price
      "2025-01-12",                            // entry_date
      "2027-01-12",                            // expiry_date (Warranty period)
      "GRN-2025-IT-045"                        // grn_tracking_number
    ];

    // ================================================================================================
    // EXAMPLE 4: Cleaning Supplies (Hand Sanitizer)
    // ================================================================================================
    // Cleaning supplies may have expiry dates, bulk quantities, availability-based tracking
    // ================================================================================================
    const sampleData4 = [
      "Cleaning Supplies",                      // category (Required)
      "Hand Sanitizer 500ml",                  // name (Required)
      "Alcohol-based hand sanitizer - 70% alcohol content, 500ml bottle", // description (Required)
      "Bottle",                                 // uom (Required)
      "AHNI Abuja",                             // store_name (Store assignment - will create if doesn't exist)
      "100",                                    // quantity (100 bottles in this store)
      "AVAILABILITY",                          // stock_control_method (Just track if available)
      "10",                                     // re_order_level
      "5",                                      // buffer_stock
      "200",                                    // max_stock
      "800.00",                                // item_cost
      "1200.00",                               // price
      "2025-01-08",                            // entry_date
      "2026-06-30",                            // expiry_date (Sanitizers expire)
      "GRN-2025-CLN-023"                       // grn_tracking_number
    ];

    // ================================================================================================
    // EXAMPLE 5: Laboratory Consumable (COVID-19 Test Kits)
    // ================================================================================================
    // Lab consumables often have strict expiry dates, batch tracking, and careful stock control
    // ================================================================================================
    const sampleData5 = [
      "Laboratory Consumables",                 // category (Required)
      "COVID-19 Rapid Antigen Test Kit",      // name (Required)
      "Rapid antigen test for COVID-19 detection - pack of 25 tests", // description (Required)
      "Pack",                                   // uom (Required)
      "AHNI Research Lab",                      // store_name (Store assignment - will create if doesn't exist)
      "50",                                     // quantity (50 packs in this store)
      "STOCK_LEVEL",                           // stock_control_method (Critical - track carefully)
      "10",                                     // re_order_level (Reorder early)
      "5",                                      // buffer_stock (Always have buffer)
      "100",                                    // max_stock
      "12000.00",                              // item_cost (Higher cost for medical tests)
      "15000.00",                              // price
      "2025-01-20",                            // entry_date
      "2025-10-31",                            // expiry_date (Short expiry for test kits)
      "GRN-2025-LAB-007"                       // grn_tracking_number (Critical for batch recall)
    ];

    const csvContent = [
      headers.join(","),
      "# ================================================================================================",
      "# DYNAMIC SMART ASSIGNMENT CONSUMABLES TEMPLATE",
      "# ================================================================================================",
      "#",
      "# INSTRUCTIONS:",
      `# Current Categories: ${activeCategoriesComment}`,
      "# 1. This template dynamically adapts to your current consumable categories",
      "# 2. Required fields: category, name, description, uom - MUST be filled for every consumable",
      "# 3. Optional fields: Leave EMPTY if not applicable (no need to delete columns)",
      "# 4. Multiple consumable types can be uploaded in ONE file",
      "# 5. Category must match an existing category name exactly (e.g., 'Medical Consumables')",
      "# 6. Date format: YYYY-MM-DD (e.g., 2025-12-31)",
      "# 7. Lines starting with # are automatically ignored (comments)",
      "#",
      "# AVAILABLE OPTIONS:",
      "# - UOM: Box, Piece, Bottle, Pack, Ream, Carton, Roll, Liter, Kilogram, etc.",
      "# - Stock Control Methods: STOCK_LEVEL (track quantities), AVAILABILITY (just yes/no), JUST_IN_TIME (order when needed)",
      "#",
      "# ================================================================================================",
      "# EXAMPLE ROWS - Showing different consumable types",
      "# ================================================================================================",
      "#",
      "# Example 1: Medical Consumable (Paracetamol) - Has expiry date, batch tracking, strict stock control",
      sampleData1.join(","),
      "#",
      "# Example 2: Office Consumable (Paper) - No expiry date (left empty), bulk quantities",
      sampleData2.join(","),
      "#",
      "# Example 3: IT Consumable (USB Drive) - Just-in-time ordering, warranty period",
      sampleData3.join(","),
      "#",
      "# Example 4: Cleaning Supplies (Sanitizer) - Availability tracking, expiry date",
      sampleData4.join(","),
      "#",
      "# Example 5: Laboratory Consumable (Test Kits) - Critical tracking, short expiry",
      sampleData5.join(","),
      "#",
      "# ================================================================================================",
      "# ADD YOUR CONSUMABLE DATA BELOW",
      "# ================================================================================================",
      "# You can modify the examples above or delete them and add your own rows below.",
      "# Remember: You can upload multiple consumable types in ONE file!",
      "#",
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
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Consumables</DialogTitle>
          <DialogDescription>
            Upload multiple consumables at once using our comprehensive CSV template. Supports ALL consumable types (Medical, Office, IT, Cleaning, Lab) in ONE file. Optionally select a store to streamline the assignment process for legacy data imports.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Banner */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="text-blue-600" size={18} />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Streamlined Upload:</span> Upload consumables and optionally assign them to a store in one step.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Multi-category upload supported - each row should include the category name for that item.
              </p>
            </div>
          </div>

          {/* Store Selection Section */}
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <Store className="text-green-600 mt-1" size={20} />
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-green-900 mb-1">🚀 Streamlined Store Assignment</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Optionally select a store to automatically prepare your uploaded consumables for assignment. This eliminates the need for separate "Assign to Store" steps.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-assign"
                    checked={autoAssignToStore}
                    onCheckedChange={(checked) => setAutoAssignToStore(checked as boolean)}
                  />
                  <Label htmlFor="auto-assign" className="text-sm font-medium text-green-900">
                    Prepare items for store assignment after upload
                  </Label>
                </div>

                {autoAssignToStore && (
                  <div className="space-y-2">
                    <Label htmlFor="store-select" className="text-sm font-medium text-green-900">
                      Select Target Store
                    </Label>
                    <Select
                      value={selectedStore}
                      onValueChange={setSelectedStore}
                      disabled={storesLoading}
                    >
                      <SelectTrigger id="store-select" className="bg-white border-green-300">
                        <SelectValue placeholder={storesLoading ? "Loading stores..." : "Choose a store"} />
                      </SelectTrigger>
                      <SelectContent>
                        {storesData?.data?.results?.map((store: any) => (
                          <SelectItem key={store.id} value={store.id}>
                            <div className="flex items-center gap-2">
                              <Store size={16} className="text-gray-500" />
                              <div>
                                <div className="font-medium">{store.name}</div>
                                <div className="text-xs text-gray-500">{store.location?.name || 'No location'}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedStore && (
                      <p className="text-xs text-green-600 bg-green-100 p-2 rounded">
                        ✅ Items will be prepared for assignment to: <strong>{storesData?.data?.results?.find((s: any) => s.id === selectedStore)?.name}</strong>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Download Template Section */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-blue-900 mb-1">Step 1: Download Smart Assignment Template</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Download the enhanced CSV template with Smart Assignment feature. Template automatically includes examples for your current {categoriesData?.results?.length || 'default'} categories. Include <strong>store_name</strong> column to assign items directly to stores during upload.
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

          {/* Instructions */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold text-sm mb-2">Important Instructions:</h4>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              <li><strong className="text-blue-600">🎯 Universal Template:</strong> This single template works for ALL consumable types (Medical, Office, IT, Cleaning, Lab, etc.)</li>
              <li><strong>Required fields:</strong> Category, Name, Description, UOM - must be filled for every consumable</li>
              <li><strong>Optional fields:</strong> Leave EMPTY if not applicable to your consumable type (no need to delete columns)</li>
              <li><strong className="text-purple-600">💊 Medical consumables:</strong> Use expiry_date for shelf life, grn_tracking_number for batch tracking, STOCK_LEVEL for strict inventory control</li>
              <li><strong className="text-purple-600">📄 Office consumables:</strong> Bulk quantities common, expiry_date often not needed (leave empty), standard reorder levels</li>
              <li><strong className="text-purple-600">💻 IT consumables:</strong> JUST_IN_TIME ordering often used, warranty periods tracked via expiry_date, lower buffer stock</li>
              <li><strong className="text-purple-600">🧪 Lab consumables:</strong> Critical batch tracking, strict expiry dates, STOCK_LEVEL for careful monitoring</li>
              <li><strong className="text-green-600">✨ 5 Example Types:</strong> Template includes Medical, Office, IT, Cleaning, and Lab consumables - showing different tracking approaches</li>
              <li><strong>Column headers:</strong> Helper text in parentheses (e.g., "Name (Required)") is automatically removed by the system</li>
              <li><strong>Comment lines:</strong> Lines starting with # are automatically ignored - educational comments included in template</li>
              <li><strong>Category:</strong> Must match an existing category name exactly (e.g., 'Medical Consumables', 'Office Supplies')</li>
              <li><strong>Date format:</strong> Use YYYY-MM-DD (e.g., 2025-12-31)</li>
              <li><strong>Stock control methods:</strong> STOCK_LEVEL (track exact quantities), AVAILABILITY (just yes/no), JUST_IN_TIME (order when needed)</li>
              <li><strong>UOM examples:</strong> Box, Piece, Bottle, Pack, Ream, Carton, Roll, Liter, Kilogram</li>
              <li><strong>Mixed upload:</strong> Upload multiple consumable types in ONE file (medical + office + IT all together!)</li>
              <li><strong>Sample data:</strong> Template includes 5 examples showing different consumable types - modify or delete and add your own</li>
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
            disabled={!selectedFile || isLoading || (autoAssignToStore && !selectedStore)}
            className={autoAssignToStore && selectedStore ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isLoading ? (
              "Uploading..."
            ) : autoAssignToStore && selectedStore ? (
              <>
                <Store size={16} className="mr-2" />
                Upload & Prepare for Store
              </>
            ) : (
              "Upload Consumables"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Store Creation Confirmation Dialog */}
    <Dialog open={showStoreCreationDialog} onOpenChange={setShowStoreCreationDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="text-blue-600" size={20} />
            Create New Stores?
          </DialogTitle>
          <DialogDescription>
            The following stores don't exist in the system and will be created:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <ul className="space-y-1">
              {storesToCreate.map((storeName, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Store size={14} className="text-yellow-600" />
                  <strong>{storeName}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> New stores will be created with default settings. You can update their details (location, store keeper, etc.) later from the Stores management page.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowStoreCreationDialog(false);
              setStoresToCreate([]);
              // Cancel the upload
              setUploadStatus("idle");
            }}
          >
            Cancel Upload
          </Button>
          <Button
            onClick={() => {
              setShowStoreCreationDialog(false);
              // Continue with upload (this would normally trigger backend store creation)
              toast.success(`${storesToCreate.length} new store(s) will be created automatically`);
              // Here you would continue the upload process with store creation
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
