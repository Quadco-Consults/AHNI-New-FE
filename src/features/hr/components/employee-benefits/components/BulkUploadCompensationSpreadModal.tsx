"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, FileDown, FileUp, Upload } from 'lucide-react';
import { Icon } from "@iconify/react";
import { XLSX } from "@/utils/excelUtils";
import readXlsxFile from 'read-excel-file';
import { useCreateCompensationSpread } from "@/features/hr/controllers/hrCompensationSpreadController";

type PropsType = {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "700px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

const BulkUploadCompensationSpreadModal = (props: PropsType) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);

  const { createCompensationSpread } = useCreateCompensationSpread();

  const downloadTemplate = () => {
    // Create template data with example
    const templateData = [
      {
        "Employee ID": "EMP001",
        "Employee Number": "AHIN0001",
        "Project": "Palm Estate ERP",
        "Basic Salary": 2550000,
        "Housing": 200000,
        "Transport": 120000,
        "Meal": 58000,
        "Miscellaneous": 480000,
        "13th Month": 820000,
      },
      {
        "Employee ID": "EMP002",
        "Employee Number": "AHIN0002",
        "Project": "Field Operations",
        "Basic Salary": 2250000,
        "Housing": 200000,
        "Transport": 120000,
        "Meal": 58000,
        "Miscellaneous": 480000,
        "13th Month": 820000,
      },
      {
        "Employee ID": "EMP003",
        "Employee Number": "AHIN0003",
        "Project": "HR Department",
        "Basic Salary": 3660000,
        "Housing": 360000,
        "Transport": 210000,
        "Meal": 174000,
        "Miscellaneous": 820000,
        "13th Month": 1554000,
      },
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee Compensations");

    // Add instructions sheet
    const instructions = [
      { "COLUMN": "Employee ID", "DESCRIPTION": "Required - ID of the employee from your system" },
      { "COLUMN": "Employee Number", "DESCRIPTION": "Required - Employee number (e.g., AHIN0001)" },
      { "COLUMN": "Project", "DESCRIPTION": "Optional - Project name the employee is assigned to" },
      { "COLUMN": "Basic Salary", "DESCRIPTION": "Required - Basic salary amount" },
      { "COLUMN": "Housing", "DESCRIPTION": "Housing allowance amount (default: 0)" },
      { "COLUMN": "Transport", "DESCRIPTION": "Transport allowance amount (default: 0)" },
      { "COLUMN": "Meal", "DESCRIPTION": "Meal allowance amount (default: 0)" },
      { "COLUMN": "Miscellaneous", "DESCRIPTION": "Miscellaneous allowance amount (default: 0)" },
      { "COLUMN": "13th Month", "DESCRIPTION": "13th month payment amount (default: 0)" },
      { "COLUMN": "", "DESCRIPTION": "" },
      { "COLUMN": "NOTES:", "DESCRIPTION": "" },
      { "COLUMN": "1", "DESCRIPTION": "Total Allowance and Gross Total will be calculated automatically" },
      { "COLUMN": "2", "DESCRIPTION": "Total Allowance = Housing + Transport + Meal + Miscellaneous" },
      { "COLUMN": "3", "DESCRIPTION": "Gross Total = Basic + Total Allowance + 13th Month" },
      { "COLUMN": "4", "DESCRIPTION": "Employee ID must match existing employees in the system" },
      { "COLUMN": "5", "DESCRIPTION": "Delete example rows and add your employee data" },
      { "COLUMN": "6", "DESCRIPTION": "All amounts should be numbers without commas or currency symbols" },
    ];
    const instructionsWs = XLSX.utils.json_to_sheet(instructions);
    XLSX.utils.book_append_sheet(wb, instructionsWs, "Instructions");

    // Download
    XLSX.writeFile(wb, "Employee_Compensation_Spread_Template.xlsx");
    toast.success("Template downloaded successfully!");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      await parseExcelFile(selectedFile);
    }
  };

  const parseExcelFile = async (file: File) => {
    try {
      const jsonData = await readXlsxFile(file);

      // Convert array of arrays to array of objects (header is first row)
      if (jsonData.length === 0) {
        toast.error("File is empty.");
        setFile(null);
        return;
      }

      const headers = jsonData[0] as string[];
      const dataRows = jsonData.slice(1);

      const convertedData = dataRows.map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });

      setParsedData(convertedData);
      toast.success(`File parsed successfully! ${convertedData.length} employee records found.`);
    } catch (error) {
      toast.error("Error parsing file. Please check the format.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!parsedData || parsedData.length === 0) {
      toast.error("No data to upload. Please select a valid file.");
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const row of parsedData) {
        try {
          const basic = parseFloat(row["Basic Salary"]?.toString() || "0");
          const housing = parseFloat(row["Housing"]?.toString() || "0");
          const transport = parseFloat(row["Transport"]?.toString() || "0");
          const meal = parseFloat(row["Meal"]?.toString() || "0");
          const miscellaneous = parseFloat(row["Miscellaneous"]?.toString() || "0");
          const thirteenth_month = parseFloat(row["13th Month"]?.toString() || "0");

          const total_allowance = housing + transport + meal + miscellaneous;
          const gross_total = basic + total_allowance + thirteenth_month;

          const compensationData = {
            employee: row["Employee ID"],
            project: row["Project"] || "",
            basic,
            housing,
            transport,
            meal,
            miscellaneous,
            total_allowance,
            thirteenth_month,
            gross_total,
          };

          await createCompensationSpread(compensationData);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error("Error creating compensation spread:", error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} employee compensation records!`);
        props.onSuccess();
        props.onCancel();
        setFile(null);
        setParsedData([]);
      }

      if (errorCount > 0) {
        toast.warning(`${errorCount} records failed to upload. Check employee IDs.`);
      }
    } catch (error) {
      toast.error("Error during bulk upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={props.isOpen} onRequestClose={props.onCancel} style={customStyles} ariaHideApp={false}>
      <div className="px-3">
        <h2 className="text-lg font-bold mb-6">Bulk Upload Employee Compensations</h2>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-blue-50">
            <div className="flex items-start gap-3">
              <FileDown size={16} />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Step 1: Download Template</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Download the Excel template with employee compensation columns
                </p>
                <Button
                  onClick={downloadTemplate}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download size={16} />
                  Download Template
                </Button>
              </div>
            </div>
          </div>

          {/* Upload File */}
          <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-green-50">
            <div className="flex items-start gap-3">
              <FileUp size={16} />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Step 2: Upload Filled Template</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Upload the Excel file with employee compensation data
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload-spread"
                />
                <label htmlFor="file-upload-spread">
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <span>
                      <Upload size={16} />
                      Choose File
                    </span>
                  </Button>
                </label>
                {file && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle size={16} />
                    <span>{file.name}</span>
                  </div>
                )}
                {parsedData.length > 0 && (
                  <p className="mt-2 text-xs text-blue-600">
                    ✅ {parsedData.length} employee records ready to upload
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          {parsedData.length > 0 && (
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto bg-white">
              <h4 className="font-semibold text-sm mb-3 sticky top-0 bg-white pb-2">
                Preview (First 5 employees)
              </h4>
              <div className="text-xs space-y-2">
                {parsedData.slice(0, 5).map((row, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded border">
                    <div className="font-semibold text-blue-600 mb-1">
                      {row["Employee Number"]} - {row["Project"]}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                      <span>Basic: ₦{parseFloat(row["Basic Salary"] || 0).toLocaleString()}</span>
                      <span>Housing: ₦{parseFloat(row["Housing"] || 0).toLocaleString()}</span>
                      <span>Transport: ₦{parseFloat(row["Transport"] || 0).toLocaleString()}</span>
                      <span>Meal: ₦{parseFloat(row["Meal"] || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
          <Button
            type="button"
            onClick={props.onCancel}
            variant="outline"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!parsedData.length || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload {parsedData.length} Employees
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkUploadCompensationSpreadModal;
