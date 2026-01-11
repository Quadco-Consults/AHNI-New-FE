"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Copy,
  Plus,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateCostCategoryManager } from "@/features/modules/controllers/finance/costCategoryController";

interface ActivityImportData {
  activity_description: string;
  quantity: string;
  unit_cost: string;
  frequency: string;
  comment: string;
  category: string;
}

interface ActivityBulkImportProps {
  onImport: (activities: ActivityImportData[]) => void;
  categories: Array<{ id: string; name: string }>;
  onAddMultiple: (count: number) => void;
  existingActivities?: ActivityImportData[];
  onCategoriesCreated?: () => void; // Callback to refresh categories
}

const ActivityBulkImport = ({
  onImport,
  categories,
  onAddMultiple,
  existingActivities = [],
  onCategoriesCreated
}: ActivityBulkImportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);
  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [showCategoryConfirmation, setShowCategoryConfirmation] = useState(false);
  const [pendingActivities, setPendingActivities] = useState<ActivityImportData[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createCostCategory, isLoading: isCreatingCategory } = CreateCostCategoryManager();

  // CSV Template for download
  const generateCSVTemplate = () => {
    const headers = [
      "Activity Description",
      "Quantity",
      "Unit Cost",
      "Frequency",
      "Comment",
      "Category"
    ];

    const sampleData = [
      [
        "Training Workshop on Financial Management",
        "5",
        "50000",
        "1",
        "Monthly training sessions",
        categories[0]?.name || "Training"
      ],
      [
        "Office Supplies and Materials",
        "100",
        "500",
        "12",
        "Monthly office supply procurement",
        categories[1]?.name || "Supplies"
      ]
    ];

    const csvContent = [
      headers.join(","),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fund_request_activities_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("CSV template downloaded successfully!");
  };

  // Parse CSV file
  const parseCSV = (text: string): { activities: ActivityImportData[], newCategories: string[] } => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error("CSV must have at least a header row and one data row");

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
    const expectedHeaders = [
      'activity description', 'quantity', 'unit cost', 'frequency', 'comment', 'category'
    ];

    // Validate headers
    const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const activities: ActivityImportData[] = [];
    const errors: string[] = [];
    const detectedNewCategories = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());

        if (values.length !== headers.length) {
          errors.push(`Row ${i + 1}: Column count mismatch`);
          continue;
        }

        const activity: ActivityImportData = {
          activity_description: values[headers.indexOf('activity description')] || '',
          quantity: values[headers.indexOf('quantity')] || '',
          unit_cost: values[headers.indexOf('unit cost')] || '',
          frequency: values[headers.indexOf('frequency')] || '',
          comment: values[headers.indexOf('comment')] || '',
          category: values[headers.indexOf('category')] || '',
        };

        // Basic validation
        if (!activity.activity_description) {
          errors.push(`Row ${i + 1}: Activity description is required`);
          continue;
        }

        if (!activity.quantity || isNaN(Number(activity.quantity))) {
          errors.push(`Row ${i + 1}: Valid quantity is required`);
          continue;
        }

        if (!activity.unit_cost || isNaN(Number(activity.unit_cost))) {
          errors.push(`Row ${i + 1}: Valid unit cost is required`);
          continue;
        }

        if (!activity.frequency || isNaN(Number(activity.frequency))) {
          errors.push(`Row ${i + 1}: Valid frequency is required`);
          continue;
        }

        // Check if category exists (case-insensitive)
        const categoryExists = categories.some(cat =>
          cat.name.toLowerCase() === activity.category.toLowerCase()
        );

        if (!categoryExists && activity.category) {
          // Track new category instead of throwing error
          detectedNewCategories.add(activity.category);
        }

        activities.push(activity);
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    }

    if (errors.length > 0) {
      setImportResults({ success: activities.length, errors });
    }

    return {
      activities,
      newCategories: Array.from(detectedNewCategories)
    };
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      toast.error("Please upload a CSV file");
      return;
    }

    setIsProcessing(true);

    try {
      const text = await file.text();
      const { activities, newCategories: detectedNewCategories } = parseCSV(text);

      if (activities.length === 0) {
        toast.error("No valid activities found in the file");
        return;
      }

      // If new categories detected, show confirmation dialog
      if (detectedNewCategories.length > 0) {
        setNewCategories(detectedNewCategories);
        setPendingActivities(activities);
        setShowCategoryConfirmation(true);
        setIsProcessing(false);
        return;
      }

      // No new categories, proceed with import
      onImport(activities);
      setImportResults({ success: activities.length, errors: [] });
      toast.success(`Successfully imported ${activities.length} activities!`);

    } catch (error) {
      console.error("Import error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to import activities");
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle creating new categories and proceeding with import
  const handleCreateCategoriesAndImport = async () => {
    setIsProcessing(true);

    try {
      // Create all new categories
      const createdCategories: Array<{ name: string, id: string }> = [];

      for (const categoryName of newCategories) {
        try {
          await createCostCategory({ name: categoryName });
          toast.success(`Category "${categoryName}" created successfully`);
        } catch (error) {
          console.error(`Error creating category ${categoryName}:`, error);
          toast.error(`Failed to create category "${categoryName}"`);
        }
      }

      // Refresh categories list
      if (onCategoriesCreated) {
        onCategoriesCreated();
      }

      // Small delay to allow categories to be refreshed
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Proceed with import
      onImport(pendingActivities);
      setImportResults({
        success: pendingActivities.length,
        errors: []
      });

      toast.success(
        `Successfully created ${newCategories.length} categories and imported ${pendingActivities.length} activities!`
      );

      // Reset state
      setShowCategoryConfirmation(false);
      setNewCategories([]);
      setPendingActivities([]);

    } catch (error) {
      console.error("Error in category creation:", error);
      toast.error("Failed to create categories");
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle canceling category creation
  const handleCancelCategoryCreation = () => {
    setShowCategoryConfirmation(false);
    setNewCategories([]);
    setPendingActivities([]);
    setIsProcessing(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info("Import cancelled");
  };

  // Export existing activities to CSV
  const exportActivitiesToCSV = () => {
    if (existingActivities.length === 0) {
      toast.error("No activities to export");
      return;
    }

    const headers = [
      "Activity Description",
      "Quantity",
      "Unit Cost",
      "Frequency",
      "Comment",
      "Category"
    ];

    const csvContent = [
      headers.join(","),
      ...existingActivities.map(activity => [
        `"${activity.activity_description}"`,
        `"${activity.quantity}"`,
        `"${activity.unit_cost}"`,
        `"${activity.frequency}"`,
        `"${activity.comment}"`,
        `"${activity.category}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'current_activities.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Activities exported successfully!");
  };

  return (
    <div className="flex gap-3 mb-4">
      {/* Bulk Import Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Upload size={16} />
            Bulk Import
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bulk Import Activities</DialogTitle>
            <DialogDescription>
              Import multiple activities from a CSV file. Download the template to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Template Download */}
            <Card className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <FileSpreadsheet size={16} />
                Step 1: Download Template
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Download the CSV template with the correct headers and sample data.
              </p>
              <Button onClick={generateCSVTemplate} variant="outline" size="sm">
                <Download size={14} className="mr-2" />
                Download CSV Template
              </Button>
            </Card>

            {/* File Upload */}
            <Card className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Upload size={16} />
                Step 2: Upload Your File
              </h3>
              <div className="space-y-3">
                <Label htmlFor="activity-file">Select CSV file with your activities</Label>
                <Input
                  ref={fileInputRef}
                  id="activity-file"
                  type="file"
                  accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
                {isProcessing && (
                  <p className="text-sm text-blue-600">Processing file...</p>
                )}
              </div>
            </Card>

            {/* Import Results */}
            {importResults && (
              <Card className="p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  {importResults.errors.length === 0 ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <AlertCircle size={16} className="text-yellow-600" />
                  )}
                  Import Results
                </h3>

                {importResults.success > 0 && (
                  <Alert className="mb-3">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Successfully imported {importResults.success} activities!
                    </AlertDescription>
                  </Alert>
                )}

                {importResults.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium mb-2">
                        {importResults.errors.length} errors found:
                      </p>
                      <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                        {importResults.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </Card>
            )}

            {/* Valid Categories Reference */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Valid Categories</h3>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Use these exact category names in your CSV:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <span
                      key={category.id}
                      className="px-2 py-1 bg-gray-100 rounded text-xs"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Categories Confirmation Dialog */}
      <Dialog open={showCategoryConfirmation} onOpenChange={setShowCategoryConfirmation}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info size={20} className="text-blue-600" />
              New Categories Detected
            </DialogTitle>
            <DialogDescription>
              The following categories don't exist in your system yet. Would you like to create them?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-2">
                  {newCategories.length} new {newCategories.length === 1 ? 'category' : 'categories'} will be created:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newCategories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>Import Summary:</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• {pendingActivities.length} activities ready to import</li>
                <li>• {newCategories.length} new categories to create</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancelCategoryCreation}
              disabled={isProcessing || isCreatingCategory}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategoriesAndImport}
              disabled={isProcessing || isCreatingCategory}
            >
              {isProcessing || isCreatingCategory ? (
                <>Creating Categories...</>
              ) : (
                <>Create & Import</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddMultiple(10)}
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        Add 10 Rows
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddMultiple(5)}
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        Add 5 Rows
      </Button>

      {existingActivities.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={exportActivitiesToCSV}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Export Current
        </Button>
      )}
    </div>
  );
};

export default ActivityBulkImport;