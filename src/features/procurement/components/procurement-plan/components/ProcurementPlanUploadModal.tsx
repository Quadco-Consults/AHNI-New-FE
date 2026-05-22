"use client";

import React, { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "@/components/atoms/FormSelectField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "react-modal";
import { useGetAllProcurementPlans } from "@/features/procurement/controllers/procurementPlanController";
import { toast } from "sonner";
import { useGetAllFinancialYearsManager } from "@/features/modules/controllers/config/financialYearController";
import { closeDialog } from "@/store/ui";
import { useDispatch } from "react-redux";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useQueryClient } from "@tanstack/react-query";
import { StandardBulkUpload } from "@/components/uploads";

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
    maxWidth: "800px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto"
  },
};

const FormSchema = z.object({
  financial_year: z.string().min(1, "Please select a Financial Year"),
  project: z.string().min(1, "Please select a Project"),
});

const ProcurementPlanUploadModal = (props: PropsType) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [existingPlan, setExistingPlan] = React.useState<any>(null);
  const [isUpdateMode, setIsUpdateMode] = React.useState(false);

  // Fetch all procurement plans to check for duplicates
  const { data: allPlans } = useGetAllProcurementPlans({
    page: 1,
    size: 1000,
    enabled: props.isOpen,
  });

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
      project: "",
    },
  });

  const { handleSubmit, watch } = form;

  // Watch form values to check for existing plans
  const watchedProject = watch("project");
  const watchedFinancialYear = watch("financial_year");

  // Check if a plan already exists for this project/year combination
  const checkExistingPlan = useMemo(() => {
    if (!allPlans?.data?.results || !watchedProject || !watchedFinancialYear) {
      setExistingPlan(null);
      setIsUpdateMode(false);
      return null;
    }

    const existing = allPlans.data.results.find((plan: any) =>
      plan.project === watchedProject && plan.financial_year === watchedFinancialYear
    );

    if (existing) {
      setExistingPlan(existing);
      setIsUpdateMode(true);
      return existing;
    } else {
      setExistingPlan(null);
      setIsUpdateMode(false);
      return null;
    }
  }, [allPlans, watchedProject, watchedFinancialYear]);

  // Reset state when modal closes
  useEffect(() => {
    if (!props.isOpen) {
      setExistingPlan(null);
      setIsUpdateMode(false);
      form.reset();
    }
  }, [props.isOpen]);

  // Check if form is valid (project and financial year selected)
  const isFormValid = watchedProject && watchedFinancialYear;

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onCancel}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="space-y-6">
        <h2 className='font-bold text-xl text-center'>
          {isUpdateMode ? "Update Procurement Plan" : "Upload Procurement Plan"}
        </h2>

        <Form {...form}>
          <form onSubmit={handleSubmit((data) => {})} className="space-y-4">
            {/* Warning for existing plan */}
            {isUpdateMode && existingPlan && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  ⚠️ A procurement plan already exists for this project and financial year.
                  Uploading will <strong>update the existing plan</strong> instead of creating a new one.
                </p>
                <p className="text-yellow-600 text-xs mt-1">
                  Existing plan ID: {existingPlan.id}
                </p>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label='Financial Year'
                name='financial_year'
                required
                options={financialYearOptions}
              />
              <FormSelect
                label='Project'
                name='project'
                required
                options={projectOptions}
              />
            </div>

            {/* Upload Section */}
            {!isFormValid && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-blue-700 text-sm">
                  Please select both Financial Year and Project to continue
                </p>
              </div>
            )}

            {isFormValid && (
              <StandardBulkUpload
                endpoint={`${process.env.NEXT_PUBLIC_API_URL}/procurements/procurement-plans-new/upload/`}
                templateUrl={`${process.env.NEXT_PUBLIC_API_URL}/procurements/procurement-plans-new/template/`}
                acceptedFormats={['.xlsx', '.xls']}
                maxFileSizeMB={10}
                title="Upload Procurement Plan File"
                description="Download the template, fill it out, then upload your completed Excel file"
                additionalData={{
                  project: watchedProject,
                  financial_year: watchedFinancialYear,
                }}
                onSuccess={(result) => {
                  // Invalidate queries to refresh data
                  queryClient.invalidateQueries({
                    queryKey: ["procurement-plans"],
                    refetchType: "all"
                  });

                  const message = isUpdateMode
                    ? `Procurement Plan updated successfully! ${result.created_count} line items processed.`
                    : `Procurement Plan created successfully! ${result.created_count} line items created.`;

                  toast.success(message);

                  // Let user review results before manually closing
                }}
                onError={(error) => {
                  toast.error(error);
                }}
                showTemplateDownload={true}
                validateBeforeUpload={true}
                autoCloseDelay={0} // Don't auto-close, we handle it manually
              />
            )}

            {/* Cancel Button */}
            <div className="flex justify-end">
              <Button
                type='button'
                className='bg-gray-200 text-gray-700 hover:bg-gray-300'
                onClick={props.onCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default ProcurementPlanUploadModal;

/*
===================================================================================
OLD IMPLEMENTATION (BACKUP - DO NOT DELETE)
Keep this for 2 weeks after successful deployment, then remove
===================================================================================

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelectField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChangeEvent, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import Modal from "react-modal";
import { useUploadProcurementPlan, useGetAllProcurementPlans, useUpdateProcurementPlan } from "@/features/procurement/controllers/procurementPlanController";
import { toast } from "sonner";
import { useGetAllFinancialYearsManager } from "@/features/modules/controllers/config/financialYearController";
import { closeDialog } from "@/store/ui";
import { useDispatch } from "react-redux";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const [file, setFile] = useState<File | Blob | null>(null);
  const [existingPlan, setExistingPlan] = useState<any>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const { uploadProcurementPlan, isLoading: creatingPlan } = useUploadProcurementPlan();

  const { updateProcurementPlan, isLoading: updatingPlan } = useUpdateProcurementPlan(existingPlan?.id || "");

  const { data: allPlans } = useGetAllProcurementPlans({
    page: 1,
    size: 1000,
    enabled: props.isOpen,
  });

  const { data: financialYear } = useGetAllFinancialYearsManager({
    size: 1000,
  });

  const { data: project } = useGetAllProjects({
    page: 1,
    size: 1000000,
  });

  const financialYearOptions = financialYear?.data.results.map(
    ({ year, id }) => ({
      label: year,
      value: id,
    })
  );

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

  const { handleSubmit, watch } = form;

  const watchedProject = watch("project");
  const watchedFinancialYear = watch("financial_year");

  const checkExistingPlan = useMemo(() => {
    if (!allPlans?.data?.results || !watchedProject || !watchedFinancialYear) {
      setExistingPlan(null);
      setIsUpdateMode(false);
      return null;
    }

    const existing = allPlans.data.results.find((plan: any) =>
      plan.project === watchedProject && plan.financial_year === watchedFinancialYear
    );

    if (existing) {
      setExistingPlan(existing);
      setIsUpdateMode(true);
      return existing;
    } else {
      setExistingPlan(null);
      setIsUpdateMode(false);
      return null;
    }
  }, [allPlans, watchedProject, watchedFinancialYear]);

  useEffect(() => {
    if (!props.isOpen) {
      setFile(null);
      setExistingPlan(null);
      setIsUpdateMode(false);
      form.reset();
    }
  }, [props.isOpen]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Only Excel files (.xlsx, .xls) are allowed.");
        e.target.value = "";
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

    try {
      const response = await uploadProcurementPlan({
        project: data.project as string,
        financial_year: data.financial_year as string,
        file: file as File,
      });

      const responseData = (response as any)?.data?.data || (response as any)?.data;

      const createdCount = responseData?.created_count || 0;
      const errorCount = responseData?.error_count || 0;
      const errors = responseData?.errors || [];

      const hasBackendCountFields = responseData?.hasOwnProperty('created_count') || responseData?.hasOwnProperty('error_count');
      const isResponseSuccess = !errorCount && (!hasBackendCountFields || createdCount > 0);

      if (errorCount > 0 || (hasBackendCountFields && createdCount === 0)) {
        toast.error(`Upload failed: ${errorCount} errors, ${createdCount} records created`, {
          duration: 5000
        });

        if (errors.length > 0) {
          const firstError = errors[0];
          toast.error(`Row ${firstError.row}: ${firstError.error}`, {
            duration: 10000
          });

          const uniqueErrors = [...new Set(errors.map((e: any) => e.error))];
          if (uniqueErrors.length === 1) {
            toast.warning(`Backend Error: ${uniqueErrors[0]}`, {
              duration: 15000,
              description: "This is a backend issue that needs to be fixed. Please contact the development team."
            });
          }
        }

        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["procurement-plans"],
        refetchType: "all"
      });

      const successMessage = hasBackendCountFields
        ? `Procurement Plan uploaded successfully! ${createdCount} line items created.`
        : `Procurement Plan uploaded successfully!`;

      toast.success(successMessage);
      props.onCancel();
      dispatch(closeDialog());
    } catch (error: any) {
      console.error("Upload error details:", error);

      const errorData = error?.response?.data || error?.data;
      let errorMessage = error?.message || "An error occurred during upload";

      if (errorMessage.includes("Missing essential columns")) {
        const match = errorMessage.match(/Missing essential columns: \[([^\]]+)\]/);
        if (match) {
          const missingColumns = match[1]
            .replace(/\\'/g, '')
            .replace(/'/g, '')
            .split(', ')
            .filter(col => col.trim() !== '');

          toast.error("❌ Missing required Excel columns:", {
            duration: 10000,
          });

          missingColumns.forEach((column: string, index: number) => {
            if (index < 5) {
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

      if (errorData && errorData.errors && Array.isArray(errorData.errors)) {
        const validationErrors = errorData.errors;
        const summary = errorData.summary;

        const allDuplicateErrors = validationErrors.every((err: any) => {
          const errorMsg = err.error?.[0] || err.error || "";
          return errorMsg.includes("duplicate key value violates unique constraint");
        });

        if (allDuplicateErrors) {
          toast.error("❌ Duplicate Procurement Plans Detected", {
            duration: 10000,
          });

          toast.warning(
            `All ${summary.total_rows_processed} rows already exist in the database for this project (${summary.project}) and financial year (${summary.financial_year}).`,
            {
              duration: 12000,
            }
          );

          toast.info(
            "💡 To update existing records, please delete the old procurement plans first, or contact the administrator to enable bulk updates.",
            {
              duration: 15000,
            }
          );

          return;
        }

        if (summary) {
          toast.error(`Upload failed: ${summary.errors_found} errors found in ${summary.total_rows_processed} rows`, {
            duration: 8000,
          });
        }

        validationErrors.forEach((err: any, index: number) => {
          if (index < 3) {
            const fieldError = err.error?.[0] || err.error || "Unknown error";

            if (fieldError.includes("duplicate key value violates unique constraint")) {
              toast.error(`Row ${err.row}: Duplicate record - this budget line and description already exists`, {
                duration: 6000,
              });
            }
            else if (fieldError.includes("procurement_process") && fieldError.includes("not-null constraint")) {
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
            {isUpdateMode ? "Update Procurement Plan" : "Upload Procurement Plan"}
          </h2>

          {isUpdateMode && existingPlan && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700 text-sm">
                ⚠️ A procurement plan already exists for this project and financial year.
                Uploading will <strong>update the existing plan</strong> instead of creating a new one.
              </p>
              <p className="text-yellow-600 text-xs mt-1">
                Existing plan ID: {existingPlan.id}
              </p>
            </div>
          )}

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
              <FormButton
                className='bg-primary text-white border-none'
                disabled={creatingPlan || updatingPlan}
              >
                {creatingPlan || updatingPlan
                  ? (isUpdateMode ? "Updating..." : "Uploading...")
                  : (isUpdateMode ? "Update Plan" : "Upload Plan")
                }
              </FormButton>
            </div>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default ProcurementPlanUploadModal;

===================================================================================
END OF OLD IMPLEMENTATION
===================================================================================
*/
