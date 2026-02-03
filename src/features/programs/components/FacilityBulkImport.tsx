"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateFacilityManager } from "@/features/modules/controllers/program/facilityController";

interface FacilityImportData {
  name: string;
  contact_person: string;
  postion: string;
  email: string;
  phone: string;
  state: string;
  lga: string;
}

const FacilityBulkImport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createFacility, isLoading } = CreateFacilityManager();

  // CSV Template for download
  const generateCSVTemplate = () => {
    const headers = [
      "Facility Name",
      "Contact Person",
      "Position",
      "Email",
      "Phone Number",
      "State",
      "LGA"
    ];

    const sampleData = [
      [
        "Primary Health Center Kano",
        "Dr. Amina Hassan",
        "Medical Director",
        "amina.hassan@phc.gov.ng",
        "08012345678",
        "Kano",
        "Kano Municipal"
      ],
      [
        "General Hospital Kaduna",
        "Dr. Ibrahim Yusuf",
        "Chief Medical Officer",
        "ibrahim.yusuf@hospital.gov.ng",
        "08098765432",
        "Kaduna",
        "Kaduna South"
      ]
    ];

    const csvContent = [
      headers.join(","),
      ...sampleData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "facilities_template.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Parse CSV file
  const parseCSV = (text: string): FacilityImportData[] => {
    const lines = text.split("\n").filter(line => line.trim());
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));

    return lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
      const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ""));

      return {
        name: cleanValues[0] || "",
        contact_person: cleanValues[1] || "",
        postion: cleanValues[2] || "",
        email: cleanValues[3] || "",
        phone: cleanValues[4] || "",
        state: cleanValues[5] || "",
        lga: cleanValues[6] || ""
      };
    }).filter(item => item.name); // Filter out empty rows
  };

  // Validate facility data
  const validateFacility = (item: FacilityImportData): string | null => {
    if (!item.name || item.name.trim() === "") {
      return "Facility Name is required";
    }
    if (!item.contact_person || item.contact_person.trim() === "") {
      return "Contact Person is required";
    }
    if (!item.postion || item.postion.trim() === "") {
      return "Position is required";
    }
    if (!item.email || item.email.trim() === "") {
      return "Email is required";
    }
    if (!item.phone || item.phone.trim() === "") {
      return "Phone Number is required";
    }
    if (!item.state || item.state.trim() === "") {
      return "State is required";
    }
    if (!item.lga || item.lga.trim() === "") {
      return "LGA is required";
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(item.email)) {
      return "Invalid email format";
    }

    return null;
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportResults(null);

    try {
      const text = await file.text();
      const facilities = parseCSV(text);

      const errors: string[] = [];
      let successCount = 0;

      for (let i = 0; i < facilities.length; i++) {
        const item = facilities[i];
        const validationError = validateFacility(item);

        if (validationError) {
          errors.push(`Row ${i + 2}: ${validationError}`);
          continue;
        }

        try {
          await createFacility({
            name: item.name.trim(),
            contact_person: item.contact_person.trim(),
            postion: item.postion.trim(),
            email: item.email.trim(),
            phone: item.phone.trim(),
            state: item.state.trim(),
            lga: item.lga.trim()
          });
          successCount++;
        } catch (error: any) {
          const errorMsg = error?.response?.data?.message || error?.message || "Unknown error";
          errors.push(`Row ${i + 2} (${item.name}): ${errorMsg}`);
        }
      }

      setImportResults({ success: successCount, errors });

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} facilit${successCount === 1 ? 'y' : 'ies'}`);
      }

      if (errors.length > 0) {
        toast.error(`${errors.length} error(s) occurred during import`);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to process file. Please check the format.");
      console.error("File processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setImportResults(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#0A7E32] border-[1px] border-[#C7CBD5]"
        >
          <Upload className="h-4 w-4" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Bulk Import Facilities
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple facilities at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Download */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-blue-900 mb-1">
                  Download Template
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Download the CSV template and fill in your facility data
                </p>
                <Button
                  onClick={generateCSVTemplate}
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </Card>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload CSV File</label>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isProcessing || isLoading}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Accepted format: CSV files only
            </p>
          </div>

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Instructions:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Download the template and fill it with your data</li>
                <li>All fields are required (Name, Contact Person, Position, Email, Phone, State, LGA)</li>
                <li>Ensure email addresses are valid</li>
                <li>Save the file as CSV format</li>
                <li>Upload the file using the input above</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Processing Status */}
          {isProcessing && (
            <Alert>
              <AlertCircle className="h-4 w-4 animate-spin" />
              <AlertDescription>Processing file, please wait...</AlertDescription>
            </Alert>
          )}

          {/* Import Results */}
          {importResults && (
            <div className="space-y-3">
              {importResults.success > 0 && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Successfully imported {importResults.success} facilit{importResults.success === 1 ? 'y' : 'ies'}
                  </AlertDescription>
                </Alert>
              )}

              {importResults.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-semibold mb-2">
                      {importResults.errors.length} error(s) occurred:
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {importResults.errors.map((error, index) => (
                        <div key={index} className="text-xs">
                          • {error}
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isProcessing || isLoading}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityBulkImport;
