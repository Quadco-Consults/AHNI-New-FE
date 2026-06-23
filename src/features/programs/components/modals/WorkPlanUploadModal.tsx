"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import FormSelect from "@/components/FormSelect";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/useStore";
import { toast } from "sonner";
import { closeDialog } from "@/store/ui";
import { useGetAllFinancialYearsQuery } from "@/features/modules/controllers/config/financialYearController";
import { useGetAllProjectsQuery } from "@/features/projects/controllers/projectController";
import { useQueryClient } from "@tanstack/react-query";
import { StandardBulkUpload } from "@/components/uploads";

const FormSchema = z.object({
  project: z.string().min(1, "This field is required"),
  financial_year: z.string().min(1, "This field is required"),
});

export type TFormValues = z.infer<typeof FormSchema>;

const WorkPlanUploadModal = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const { data: project } = useGetAllProjectsQuery({
    page: 1,
    size: 2000000,
  });

  const { data: financialYear } = useGetAllFinancialYearsQuery({
    page: 1,
    size: 2000000,
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

  const form = useForm<TFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      project: "",
      financial_year: "",
    },
  });

  const { handleSubmit, watch } = form;

  // Watch form values to determine if form is valid
  const watchedProject = watch("project");
  const watchedFinancialYear = watch("financial_year");

  // Check if form is valid (both fields selected)
  const isFormValid = watchedProject && watchedFinancialYear;

  return (
    <div className='w-full'>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(() => {})} className='flex flex-col gap-6'>
          <h2 className='font-bold text-xl text-center mb-2'>
            Upload Work Plan
          </h2>

          <FormSelect
            label='Project'
            name='project'
            required
            multiple={false}
            placeholder='Select Project'
            options={projectOptions}
          />

          <FormSelect
            label='Financial Year'
            name='financial_year'
            required
            placeholder='Select Financial Year'
            options={financialYearOptions}
          />

          {/* Show message if form not valid */}
          {!isFormValid && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-blue-700 text-sm">
                Please select both Project and Financial Year to continue
              </p>
            </div>
          )}

          {/* Show upload component when form is valid */}
          {isFormValid && (
            <StandardBulkUpload
              endpoint={`${process.env.NEXT_PUBLIC_API_URL}/programs/plans/works/sheet/upload/`}
              templateUrl="/AHNI_Workplan_Template.xlsx"
              acceptedFormats={['.xlsx', '.xls']}
              maxFileSizeMB={10}
              title="Upload Work Plan File"
              description="Download the template, fill it out, then upload your completed Excel file"
              additionalData={{
                project: watchedProject,
                financial_year: watchedFinancialYear,
                process_sync: true, // Process synchronously to get immediate results
              }}
              onSuccess={(result) => {
                // Invalidate queries to refresh data
                queryClient.invalidateQueries({
                  queryKey: ["work-plans"],
                  refetchType: "all"
                });

                toast.success(
                  `Work Plan uploaded successfully! ${result.created_count || 'Records'} created.`
                );

                // Let user review results before manually closing
              }}
              onError={(error) => {
                toast.error(error);
              }}
              showTemplateDownload={true}
              validateBeforeUpload={true}
              autoCloseDelay={0}
            />
          )}

          <div className='flex justify-between gap-5'>
            <Button
              onClick={() => dispatch(closeDialog())}
              type='button'
              className='bg-gray-200 text-gray-700 hover:bg-gray-300'
            >
              Cancel
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default WorkPlanUploadModal;

/*
===================================================================================
OLD IMPLEMENTATION (BACKUP - DO NOT DELETE)
Keep this for 2 weeks after successful deployment, then remove
===================================================================================

"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import FormButton from "@/components/FormButton";
import { closeDialog } from "@/store/ui";
import { z } from "zod";
import FormSelect from "@/components/FormSelect";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/useStore";
import { toast } from "sonner";
import { useUploadWorkPlanMutation } from "@/features/programs/controllers/workPlanController";
import { useGetAllFinancialYearsQuery } from "@/features/modules/controllers/config/financialYearController";
import { useGetAllProjectsQuery } from "@/features/projects/controllers/projectController";

const FormSchema = z.object({
  project: z.string().min(1, "This field is required"),
  financial_year: z.string().min(1, "This field is required"),
});

export type TFormValues = z.infer<typeof FormSchema>;

const WorkPlanUploadModal = () => {
  const dispatch = useAppDispatch();

  const { data: project } = useGetAllProjectsQuery({
    page: 1,
    size: 2000000,
  });

  const { data: financialYear } = useGetAllFinancialYearsQuery({
    page: 1,
    size: 2000000,
  });

  const financialYearOptions = financialYear?.data.results.map(
    ({ year, id }) => ({
      label: year,
      value: id,
    })
  );

  const { uploadWorkPlan, isLoading: isUploadLoading } =
    useUploadWorkPlanMutation();

  const [file, setFile] = useState<File>();

  const projectOptions = project?.data.results.map(({ title, id }) => ({
    label: title,
    value: id,
  }));

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const form = useForm<TFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      project: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<TFormValues> = async ({
    project,
    financial_year,
  }) => {
    if (!file) {
      return;
    }

    try {
      await uploadWorkPlan({ project, financial_year, file });

      dispatch(closeDialog());
    } catch (error: any) {
      //   toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className='w-full'>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <FormSelect
            label='Project'
            name='project'
            required
            multiple={false}
            placeholder='Select Project'
            options={projectOptions}
          />

          <FormSelect
            label='Financial Year'
            name='financial_year'
            required
            placeholder='Select Financial Year'
            options={financialYearOptions}
          />

          <div className='w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center'>
            <UploadFile size={20} />
            <div>
              <Input
                type='file'
                onChange={handleChangeFile}
                className='bg-inherit border-none cursor-pointer '
              />
            </div>
          </div>

          <div className='flex justify-between gap-5 mt-16'>
            <Button
              onClick={() => dispatch(closeDialog())}
              type='button'
              className='bg-brand-light text-primary dark:text-gray-500'
            >
              Cancel
            </Button>
            <FormButton
              loading={isUploadLoading}
              type='submit'
              disabled={isUploadLoading}
            >
              Done
            </FormButton>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default WorkPlanUploadModal;

===================================================================================
END OF OLD IMPLEMENTATION
===================================================================================
*/
