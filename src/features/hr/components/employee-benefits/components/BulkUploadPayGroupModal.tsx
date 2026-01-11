"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Loader2, FileDown, FileUp, Upload } from 'lucide-react';
import { Icon } from "@iconify/react";
import { XLSX } from "@/utils/excelUtils";
import readXlsxFile from 'read-excel-file';
import { useCreatePayGroup } from "@/features/hr/controllers/payGroupController";
import { useGetAllPositionsManager } from "@/features/modules/controllers/config/positionController";
import { useGetAllGradesManager } from "@/features/modules/controllers/config/gradeController";
import { useGetAllLevelsManager } from "@/features/modules/controllers/config/levelController";

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

const BulkUploadPayGroupModal = (props: PropsType) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);

  const { createPayGroup } = useCreatePayGroup();

  // Fetch positions, grades, and levels for mapping
  const { data: positionsData } = useGetAllPositionsManager({ page: 1, size: 200000 });
  const { data: gradesData } = useGetAllGradesManager({ page: 1, size: 200000 });
  const { data: levelsData } = useGetAllLevelsManager({ page: 1, size: 200000 });

  const downloadTemplate = () => {
    // Get sample data for template
    const positions = positionsData?.data?.results || [];
    const grades = gradesData?.data?.results || [];
    const levels = levelsData?.data?.results || [];

    // Create template data
    const templateData = [
      {
        "Position": positions[0]?.name || "Driver",
        "Grade": grades[0]?.name || "grade 8",
        "Level": levels[0]?.name || "step 1",
      },
      {
        "Position": positions[1]?.name || "Technical Officer",
        "Grade": grades[1]?.name || "grade 9",
        "Level": levels[1]?.name || "step 1",
      },
      {
        "Position": positions[2]?.name || "Admin Manager",
        "Grade": grades[2]?.name || "grade 9",
        "Level": levels[1]?.name || "step 2",
      },
    ];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pay Groups");

    // Create instructions sheet
    const instructions = [
      { COLUMN: "Position", DESCRIPTION: "Position name (must match existing positions in system)" },
      { COLUMN: "Grade", DESCRIPTION: "Grade name (must match existing grades in system)" },
      { COLUMN: "Level", DESCRIPTION: "Level/Step name (must match existing levels in system)" },
      { COLUMN: "", DESCRIPTION: "" },
      { COLUMN: "IMPORTANT NOTES:", DESCRIPTION: "" },
      { COLUMN: "1", DESCRIPTION: "Delete example rows and add your pay group data" },
      { COLUMN: "2", DESCRIPTION: "Position, Grade, and Level must exactly match existing values" },
      { COLUMN: "3", DESCRIPTION: "Each combination of Position + Grade + Level creates a unique pay group" },
      { COLUMN: "4", DESCRIPTION: "Use exact names - case sensitive" },
      { COLUMN: "5", DESCRIPTION: "Save file and upload in the system" },
    ];

    // Add available values sheet for reference
    const availableValues = [
      { TYPE: "POSITIONS", VALUES: "" },
      ...positions.map((p: any) => ({ TYPE: "", VALUES: p.name })),
      { TYPE: "", VALUES: "" },
      { TYPE: "GRADES", VALUES: "" },
      ...grades.map((g: any) => ({ TYPE: "", VALUES: g.name })),
      { TYPE: "", VALUES: "" },
      { TYPE: "LEVELS", VALUES: "" },
      ...levels.map((l: any) => ({ TYPE: "", VALUES: l.name })),
    ];

    const instructionsWs = XLSX.utils.json_to_sheet(instructions);
    const valuesWs = XLSX.utils.json_to_sheet(availableValues);
    XLSX.utils.book_append_sheet(wb, instructionsWs, "Instructions");
    XLSX.utils.book_append_sheet(wb, valuesWs, "Available Values");

    // Download
    XLSX.writeFile(wb, "PayGroup_Upload_Template.xlsx");
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
          // Find matching position, grade, and level IDs - trim whitespace
          const positionName = row["Position"]?.trim();
          const gradeName = row["Grade"]?.trim();
          const levelName = row["Level"]?.trim();

          let positionId = undefined;
          let gradeId = undefined;
          let levelId = undefined;

          // Find position ID
          if (positionName && positionsData?.data?.results) {
            const matchingPosition = positionsData.data.results.find((p: any) =>
              p?.name?.toLowerCase()?.trim() === positionName?.toLowerCase()
            );
            positionId = matchingPosition?.id;
          }

          // Find grade ID
          if (gradeName && gradesData?.data?.results) {
            const matchingGrade = gradesData.data.results.find((g: any) =>
              g?.name?.toLowerCase()?.trim() === gradeName?.toLowerCase()
            );
            gradeId = matchingGrade?.id;
          }

          // Find level ID
          if (levelName && levelsData?.data?.results) {
            const matchingLevel = levelsData.data.results.find((l: any) =>
              l?.name?.toLowerCase()?.trim() === levelName?.toLowerCase()
            );
            levelId = matchingLevel?.id;
          }

          // Validate all IDs found - skip if missing
          if (!positionId) {
            console.warn(`Position "${positionName}" not found - skipping row`);
            errorCount++;
            errors.push(`${positionName} + ${gradeName} + ${levelName}: Position not found in system`);
            continue;
          }
          if (!gradeId) {
            console.warn(`Grade "${gradeName}" not found - skipping row`);
            errorCount++;
            errors.push(`${positionName} + ${gradeName} + ${levelName}: Grade not found in system`);
            continue;
          }
          if (!levelId) {
            console.warn(`Level "${levelName}" not found - skipping row`);
            errorCount++;
            errors.push(`${positionName} + ${gradeName} + ${levelName}: Level not found in system`);
            continue;
          }

          const payGroupData = {
            position: positionId,
            grade: gradeId,
            level: levelId,
          };

          await createPayGroup(payGroupData);
          successCount++;
        } catch (error: any) {
          errorCount++;
          errors.push(`${row["Position"]} + ${row["Grade"]} + ${row["Level"]}: ${error.message || 'Failed'}`);
          console.error("Error creating pay group:", error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} pay groups!`);
      }

      if (errorCount > 0) {
        toast.warning(`${errorCount} rows skipped. Missing positions/grades/levels in system.`);
        console.log("Upload errors:", errors);
      }

      if (successCount > 0) {
        props.onSuccess();
        props.onCancel();
        setFile(null);
        setParsedData([]);
      } else if (errorCount > 0) {
        toast.error("All rows failed. Please ensure positions, grades, and levels exist in the system first.");
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
        <h2 className="text-lg font-bold mb-6">Bulk Upload Pay Groups</h2>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="flex items-start gap-3">
              <FileDown size={16} />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Step 1: Download Template</h3>
                <p className="text-xs text-gray-600 mb-3">
                  Download the Excel template with available positions, grades, and levels
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
                  Upload the completed Excel file with pay group combinations
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
                      Pay Group #{index + 1}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-gray-600">
                      <span>Position: {row["Position"]}</span>
                      <span>Grade: {row["Grade"]}</span>
                      <span>Level: {row["Level"]}</span>
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
                Upload {parsedData.length} Pay Groups
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BulkUploadPayGroupModal;
