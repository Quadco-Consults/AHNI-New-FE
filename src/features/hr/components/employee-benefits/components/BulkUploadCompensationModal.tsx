"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, FileDown, FileUp, Upload } from 'lucide-react';
import { Icon } from "@iconify/react";
import { XLSX } from "@/utils/excelUtils";
import readXlsxFile from 'read-excel-file';
import { useCreateCompensation } from "@/features/hr/controllers/compensationController";
import { useGetPayGroups } from "@/features/hr/controllers/payGroupController";

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
    maxWidth: "600px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
  },
};

const BulkUploadCompensationModal = (props: PropsType) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);

  const { createCompensation } = useCreateCompensation();
  const { data: payGroupsData } = useGetPayGroups();

  const downloadTemplate = () => {
    // Create template data matching your structure
    const templateData = [
      {
        "Compensation Name": "Housing",
        "Type (Deduction/Earning)": "Earning",
        "Amount or Percentage": "Amount",
        "Amount": 200000,
        "Percentage": "",
        "Position": "Driver",
        "Grade": "grade 8",
        "Level": "step 1",
        "Period (Daily/Weekly/Monthly/Annually/One-Off)": "Monthly",
      },
      {
        "Compensation Name": "Transport",
        "Type (Deduction/Earning)": "Earning",
        "Amount or Percentage": "Amount",
        "Amount": 120000,
        "Percentage": "",
        "Position": "Technical Officer",
        "Grade": "grade 8",
        "Level": "step 1",
        "Period (Daily/Weekly/Monthly/Annually/One-Off)": "Monthly",
      },
      {
        "Compensation Name": "WARDROBE",
        "Type (Deduction/Earning)": "Earning",
        "Amount or Percentage": "Amount",
        "Amount": 200000,
        "Percentage": "",
        "Position": "Technical Officer",
        "Grade": "grade 9",
        "Level": "step 1",
        "Period (Daily/Weekly/Monthly/Annually/One-Off)": "Monthly",
      },
      {
        "Compensation Name": "Newspaper",
        "Type (Deduction/Earning)": "Earning",
        "Amount or Percentage": "Amount",
        "Amount": 100000,
        "Percentage": "",
        "Position": "Technical Officer",
        "Grade": "grade 9",
        "Level": "step 1",
        "Period (Daily/Weekly/Monthly/Annually/One-Off)": "Monthly",
      },
      {
        "Compensation Name": "Housing allowance",
        "Type (Deduction/Earning)": "Earning",
        "Amount or Percentage": "Amount",
        "Amount": 100000,
        "Percentage": "",
        "Position": "Admin manager",
        "Grade": "grade 9",
        "Level": "step 2",
        "Period (Daily/Weekly/Monthly/Annually/One-Off)": "Weekly",
      },
      {
        "Compensation Name": "Tax Deduction",
        "Type (Deduction/Earning)": "Deduction",
        "Amount or Percentage": "Percentage",
        "Amount": "",
        "Percentage": 10,
        "Position": "All Positions",
        "Grade": "All Grades",
        "Level": "All Levels",
        "Period (Daily/Weekly/Monthly/Annually/One-Off)": "Monthly",
      },
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compensations");

    // Add instructions sheet
    const instructions = [
      { COLUMN: "Compensation Name", DESCRIPTION: "Name of the compensation (e.g., Housing, Transport, WARDROBE, Newspaper)" },
      { COLUMN: "Type", DESCRIPTION: "Either 'Deduction' or 'Earning'" },
      { COLUMN: "Amount or Percentage", DESCRIPTION: "Choose 'Amount' for fixed value or 'Percentage' for percentage" },
      { COLUMN: "Amount", DESCRIPTION: "Fixed amount in numbers (leave blank if using Percentage)" },
      { COLUMN: "Percentage", DESCRIPTION: "Percentage value (leave blank if using Amount)" },
      { COLUMN: "Position", DESCRIPTION: "Position name (e.g., Driver, Technical Officer, Admin manager)" },
      { COLUMN: "Grade", DESCRIPTION: "Grade level (e.g., grade 8, grade 9)" },
      { COLUMN: "Level", DESCRIPTION: "Level/Step (e.g., step 1, step 2)" },
      { COLUMN: "Period", DESCRIPTION: "Daily, Weekly, Monthly, Annually, or One-Off" },
      { COLUMN: "", DESCRIPTION: "" },
      { COLUMN: "IMPORTANT NOTES:", DESCRIPTION: "" },
      { COLUMN: "1", DESCRIPTION: "Delete example rows and add your compensation data" },
      { COLUMN: "2", DESCRIPTION: "For Amount: fill Amount column, leave Percentage blank" },
      { COLUMN: "3", DESCRIPTION: "For Percentage: fill Percentage column, leave Amount blank" },
      { COLUMN: "4", DESCRIPTION: "Position, Grade, and Level define the pay group" },
      { COLUMN: "5", DESCRIPTION: "Use exact names as they appear in your system" },
      { COLUMN: "6", DESCRIPTION: "Do not use commas in numbers (use 200000 not 200,000)" },
      { COLUMN: "7", DESCRIPTION: "Save file and upload in the system" },
    ];
    const instructionsWs = XLSX.utils.json_to_sheet(instructions);
    XLSX.utils.book_append_sheet(wb, instructionsWs, "Instructions");

    // Download
    XLSX.writeFile(wb, "Compensation_Upload_Template.xlsx");
    toast.success("Template downloaded successfully!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      parseExcelFile(selectedFile);
    }
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        // TODO: Replace with readXlsxFile - const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setParsedData(jsonData);
        toast.success(`File parsed successfully! ${jsonData.length} records found.`);
      } catch (error) {
        toast.error("Error parsing file. Please check the format.");
        setFile(null);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    if (!parsedData || parsedData.length === 0) {
      toast.error("No data to upload. Please select a valid file.");
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    try {
      for (const row of parsedData) {
        try {
          // Find matching pay group based on Position, Grade, and Level
          const position = row["Position"];
          const grade = row["Grade"];
          const level = row["Level"];

          let payGroupId = undefined;

          // Try to find matching pay group
          if (position && grade && level && payGroupsData?.data?.results) {
            const matchingPayGroup = payGroupsData.data.results.find((pg: any) => {
              const positionMatch = pg?.position?.name?.toLowerCase() === position?.toLowerCase();
              const gradeMatch = pg?.grade?.name?.toLowerCase() === grade?.toLowerCase();
              const levelMatch = pg?.level?.name?.toLowerCase() === level?.toLowerCase();
              return positionMatch && gradeMatch && levelMatch;
            });

            payGroupId = matchingPayGroup?.id;
          }

          const compensationData = {
            name: row["Compensation Name"],
            type: row["Type (Deduction/Earning)"],
            amount_or_percentage: row["Amount or Percentage"],
            amount: row["Amount"] ? parseFloat(row["Amount"]?.toString().replace(/,/g, '')) : undefined,
            percentage: row["Percentage"] ? parseFloat(row["Percentage"]?.toString()) : undefined,
            pay_group: payGroupId,
            period: row["Period (Daily/Weekly/Monthly/Annually/One-Off)"],
          };

          await createCompensation(compensationData);
          successCount++;
        } catch (error: any) {
          errorCount++;
          errors.push(`${row["Compensation Name"]}: ${error.message || 'Failed'}`);
          console.error("Error creating compensation:", error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} compensations!`);
        props.onSuccess();
        props.onCancel();
        setFile(null);
        setParsedData([]);
      }

      if (errorCount > 0) {
        toast.warning(`${errorCount} compensations failed to upload. Check console for details.`);
        console.log("Upload errors:", errors);
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
        <h2 className="text-lg font-bold mb-6">Bulk Upload Compensations</h2>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="flex items-start gap-3">
              <FileDown size={16} />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Step 1: Download Template</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Download the Excel template and fill in your compensation data
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
          <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="flex items-start gap-3">
              <FileUp size={16} />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Step 2: Upload Filled Template</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Upload the completed Excel file with compensation data
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
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
                    {parsedData.length} records ready to upload
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          {parsedData.length > 0 && (
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              <h4 className="font-semibold text-sm mb-3">Preview (First 5 rows)</h4>
              <div className="text-xs space-y-2">
                {parsedData.slice(0, 5).map((row, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded border">
                    <div className="font-semibold text-blue-600 mb-1">
                      {row["Compensation Name"]} - {row["Type (Deduction/Earning)"]}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-gray-600">
                      <span>Amount: {row["Amount"] || row["Percentage"] ?
                        (row["Amount"] ? `₦${parseFloat(row["Amount"]).toLocaleString()}` : `${row["Percentage"]}%`)
                        : 'N/A'}</span>
                      <span>Period: {row["Period (Daily/Weekly/Monthly/Annually/One-Off)"]}</span>
                      <span className="col-span-2">
                        Position: {row["Position"]} | Grade: {row["Grade"]} | Level: {row["Level"]}
                      </span>
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
                Upload {parsedData.length} Compensations
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkUploadCompensationModal;
