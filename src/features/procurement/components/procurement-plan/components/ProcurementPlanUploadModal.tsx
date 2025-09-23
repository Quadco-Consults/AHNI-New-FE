"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import * as XLSX from "xlsx";
import { Input } from "components/ui/input";
import Modal from "react-modal";
import { useCreateProcurementPlan } from "@/features/procurement/controllers/procurementPlanController";
import { toast } from "sonner";
import { useGetAllFinancialYearsManager } from "@/features/modules/controllers/config/financialYearController";
import { closeDialog } from "store/ui";
import { useDispatch } from "react-redux";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";

type PropsType = {
  isOpen: boolean;
  onCancel: () => void;
  onOk: () => void;
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const FormSchema = z.object({
  financial_year: z.string().min(1, "Please select a Financial Year"),
  file: z.string().min(1, "Please select a file to upload"),
  project: z.string().min(1, "Please select a Project"),
});

const ProcurementPlanUploadModal = (props: PropsType) => {
  const dispatch = useDispatch();

  const [file, setFile] = useState<File | Blob | null>(null);


  const { createProcurementPlan, isLoading: creatingPlan } = useCreateProcurementPlan();

  const { data: financialYear } = useGetAllFinancialYearsManager({
    size: 1000,
  });

  const { data: project } = useGetAllProjects({
    page: 1,
    size: 1000000,
  });
  // @ts-ignore
  const financialYearOptions = financialYear?.data.results.map(
    // @ts-ignore
    ({ year, id }) => ({
      label: year,
      value: id,
    })
  );

  // @ts-ignore
  const projectOptions = project?.data.results.map(({ title, id }) => ({
    label: title,
    value: id,
  }));

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      financial_year: "",
      file: "1",
      project: "",
    },
  });

  const { handleSubmit } = form;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    
    if (file) {
      // Check if file is Excel
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only Excel files (.xlsx, .xls) are allowed.");
        e.target.value = ""; // Reset the input
        setFile(null);
        return;
      }
    }

    setFile(file);
  };

  const onSubmit = async (data: { financial_year: string | Blob; project: string | Blob }) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", file as Blob);
    formData.append("financial_year", data?.financial_year as string);
    formData.append("project", data?.project as string);
    
    // Debug logging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    try {
      await createProcurementPlan(formData as any);
      props.onCancel();
      dispatch(closeDialog());
    } catch (error: any) {
      console.error("Upload error details:", error);

      // Extract error details from the response
      const errorData = error?.response?.data || error?.data;
      let errorMessage = error?.message || "An error occurred during upload";

      // Handle missing columns error (new format)
      if (errorMessage.includes("Missing essential columns")) {
        // Extract column names from the nested error message
        // Pattern: ['Error processing file: ["❌ Missing essential columns: ['COLUMN1', 'COLUMN2']"]']
        const match = errorMessage.match(/Missing essential columns: \[([^\]]+)\]/);
        if (match) {
          // Remove quotes and backslashes, then split
          const missingColumns = match[1]
            .replace(/\\'/g, '')  // Remove escaped quotes
            .replace(/'/g, '')    // Remove remaining quotes
            .split(', ')
            .filter(col => col.trim() !== '');

          toast.error("❌ Missing required Excel columns:", {
            duration: 10000,
          });

          missingColumns.forEach((column: string, index: number) => {
            if (index < 5) { // Limit to avoid spam
              toast.error(`• ${column.trim()}`, {
                duration: 8000,
              });
            }
          });

          toast.info("📥 Please download the template to get the correct Excel format with all required columns", {
            duration: 12000,
          });
          return;
        }
      }

      // Handle specific backend validation errors
      if (errorData && errorData.errors && Array.isArray(errorData.errors)) {
        const validationErrors = errorData.errors;
        const summary = errorData.summary;

        // Show summary first
        if (summary) {
          toast.error(`Upload failed: ${summary.errors_found} errors found in ${summary.total_rows_processed} rows`, {
            duration: 8000,
          });
        }

        // Show specific field errors
        validationErrors.forEach((err: any, index: number) => {
          if (index < 3) { // Limit to first 3 errors to avoid spam
            const fieldError = err.error?.[0] || err.error || "Unknown error";

            // Extract meaningful error messages
            if (fieldError.includes("procurement_process") && fieldError.includes("not-null constraint")) {
              toast.error(`Row ${err.row}: Missing required field "procurement_process"`, {
                duration: 6000,
              });
            } else if (fieldError.includes("not-null constraint")) {
              const match = fieldError.match(/column "(\w+)"/);
              const fieldName = match ? match[1] : "unknown field";
              toast.error(`Row ${err.row}: Missing required field "${fieldName}"`, {
                duration: 6000,
              });
            } else {
              toast.error(`Row ${err.row}: ${err.description || 'Data validation error'}`, {
                duration: 6000,
              });
            }
          }
        });

        // Show helpful message
        if (validationErrors.some((err: any) => err.error?.[0]?.includes("procurement_process"))) {
          toast.info("Please ensure your Excel file includes all required columns including 'procurement_process'", {
            duration: 10000,
          });
        }

      } else if (errorMessage.includes("Missing required columns")) {
        toast.error(errorMessage, {
          duration: 8000,
        });
      } else {
        toast.error(errorMessage);
      }
    }

    // const reader = new FileReader();

    // reader.onload = (e) => {
    //   // @ts-ignore
    //   const data = new Uint8Array(e.target.result);
    //   const workbook = XLSX.read(data, { type: "array" });
    //   const sheetName = workbook.SheetNames[0];
    //   const worksheet = workbook.Sheets[sheetName];
    //   const jsonData = XLSX.utils.sheet_to_json(worksheet);
    //   props.onOk(jsonData);
    //   props.onCancel();
    // };

    // reader.readAsArrayBuffer(file as Blob);
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
      ariaHideApp={false}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className='font-bold text-[18px] text-center'>
            Upload Procurement Plan
          </h2>

          <div className='mt-5 flex flex-col gap-5'>
            <div className='flex items-center gap-2'>
              <FormSelect
                label='Financial Year'
                name='financial_year'
                required
                options={financialYearOptions}
              />
            </div>
            <div className='flex items-center gap-2'>
              <FormSelect
                label='Project'
                name='project'
                required
                options={projectOptions}
              />
            </div>
            <div className='w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center px-5'>
              <UploadFileSvg />
              <div>
                <Input
                  type='file'
                  className='bg-inherit border-none cursor-pointer'
                  multiple={false}
                  accept='.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
                  onChange={handleFileChange}
                  name=''
                />

                <FormInput type='hidden' label='' name='file' />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <Button
                type='button'
                className='bg-[#FFF2F2] text-primary border-none'
                onClick={props.onCancel}
              >
                Cancel
              </Button>
              <FormButton className='bg-primary text-white border-none'>
                Done
              </FormButton>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default ProcurementPlanUploadModal;
