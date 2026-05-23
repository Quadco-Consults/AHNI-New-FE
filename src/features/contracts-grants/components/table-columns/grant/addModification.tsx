"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextArea from "@/components/FormTextArea";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dailogSelector } from "@/store/ui";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import {
  IModificationSingleData,
  ModificationSchema,
  TModificationFormData,
} from "@/features/contracts-grants/types/modification";
import { useCreateModification } from "@/features/contracts-grants/controllers/grantController";
import { useCreateSubGrantModification } from "@/features/contracts-grants/controllers/subGrantModificationController";
import DateInput from "@/components/DateInput";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useMemo } from "react";

const AddModification = () => {
  const { dialogProps } = useAppSelector(dailogSelector);
  const [selectedModificationType, setSelectedModificationType] = useState<string>("");

  const result = dialogProps?.data as unknown as IModificationSingleData;
  console.log({ result });
  console.log("Dialog Props Full:", dialogProps);

  // Get project data for displaying current dates
  const projectData = dialogProps?.data as any;

  const form = useForm<TModificationFormData>({
    resolver: zodResolver(ModificationSchema),
    defaultValues: {
      project: result?.title ?? "",
      subgrant: (dialogProps?.data as any)?.subGrantName ?? "",
      modification_number: "",
      modification_type: "",
      reason: "",
      amount_usd: "",
      amount_ngn: "",
      start_date: "",
      end_date: "",
      approval_date: "", // Will be auto-generated
      notes: "",
      approved_by: "",
    },
  });
  const vn = form.getValues();
  console.log({ vn });

  const dispatch = useAppDispatch();

  // Detect if this is a subgrant or regular grant
  const subGrantId = dialogProps?.subGrantId as string;
  const grantId = dialogProps?.grantId as string;
  const isSubGrant = !!subGrantId;

  // Use appropriate controller based on type
  const { createModification: createGrantModification, isLoading: isGrantLoading } =
    useCreateModification(grantId || "");
  const { createModification: createSubGrantModification, isLoading: isSubGrantLoading } =
    useCreateSubGrantModification(subGrantId || "");

  // Fetch all users for the approved_by dropdown
  const { data: usersData } = useGetAllUsers({
    page: 1,
    size: 1000, // Get all users
    enabled: true,
  });

  // Create options for the approved_by dropdown
  const userOptions = useMemo(() => {
    if (!(usersData as any)?.data?.results) return [];

    return (usersData as any).data.results.map((user: any) => ({
      value: user.id,
      label: `${user.first_name} ${user.last_name} (${user.email})`,
    }));
  }, [usersData]);

  // USD to NGN conversion rate (you can make this dynamic by fetching from an API)
  const USD_TO_NGN_RATE = 1550; // Update this rate as needed

  // Watch modification_type to show/hide fields
  const modificationType = form.watch("modification_type");

  useEffect(() => {
    setSelectedModificationType(modificationType);
  }, [modificationType]);

  // Watch amount_usd and auto-convert to NGN
  const amountUsd = form.watch("amount_usd");

  useEffect(() => {
    if (amountUsd && !isNaN(Number(amountUsd))) {
      const usdValue = Number(amountUsd);
      const ngnValue = (usdValue * USD_TO_NGN_RATE).toFixed(2);
      form.setValue("amount_ngn", ngnValue);
    }
  }, [amountUsd, form]);

  // Helper functions to determine which fields to show
  const showAmountFields = selectedModificationType === 'INCREASE_OBLIGATION' || selectedModificationType === 'DE_OBLIGATION';
  const showPeriodFields = selectedModificationType === 'INCREASE_PERFORMANCE_PERIOD' || selectedModificationType === 'REDUCE_PERFORMANCE_PERIOD';
  const showScopeFields = selectedModificationType === 'SCOPE_CHANGE';

  // Format date for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return "Not set";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const onSubmit: SubmitHandler<TModificationFormData> = async (data) => {
    console.log({ crakcen: data });

    if (!isSubGrant && !grantId) {
      toast.error("Grant ID or SubGrant ID is required");
      return;
    }

    // Remove display-only fields (project and subgrant) from payload
    const { project, subgrant, ...submitData } = data;

    // Format dates to YYYY-MM-DD format
    const formatDate = (dateValue: string) => {
      if (!dateValue) return dateValue;

      // If it's already a string in YYYY-MM-DD format, return it
      if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
      }

      // If it's a Date object or other format, convert to YYYY-MM-DD
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return dateValue;
    };

    // Auto-generate approval date as today's date
    const today = new Date().toISOString().split('T')[0];
    const formattedApprovalDate = today;

    const formattedStartDate = formatDate(submitData.start_date || '');
    const formattedEndDate = formatDate(submitData.end_date || '');

    // Determine which fields to include based on modification type
    const isObligationChange = submitData.modification_type === 'INCREASE_OBLIGATION' || submitData.modification_type === 'DE_OBLIGATION';
    const isPerformancePeriodChange = submitData.modification_type === 'INCREASE_PERFORMANCE_PERIOD' || submitData.modification_type === 'REDUCE_PERFORMANCE_PERIOD';

    try {
      if (isSubGrant) {
        // For subgrants - build payload based on modification type
        const basePayload = {
          modification_number: submitData.modification_number,
          modification_type: submitData.modification_type,
          reason: submitData.reason,
          approval_date: formattedApprovalDate,
          notes: submitData.notes,
          approved_by: submitData.approved_by,
        };

        const subGrantPayload = {
          ...basePayload,
          ...(isObligationChange && {
            amount_usd: submitData.amount_usd,
            amount_ngn: submitData.amount_ngn,
          }),
          ...(isPerformancePeriodChange && {
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          }),
        };

        console.log('SubGrant Modification Payload:', subGrantPayload);
        await createSubGrantModification(subGrantPayload as any);
      } else {
        // For regular grants - build payload based on modification type
        const modificationTitle = `${submitData.modification_type.replace(/_/g, ' ')} - ${submitData.modification_number}`;

        const grantPayload: any = {
          title: modificationTitle,
          description: submitData.reason,
          date: formattedApprovalDate,
        };

        // Add amount only for obligation changes
        if (isObligationChange && submitData.amount_usd) {
          grantPayload.amount = submitData.amount_usd;
        }

        // Add period dates for performance period changes
        if (isPerformancePeriodChange) {
          grantPayload.start_date = formattedStartDate;
          grantPayload.end_date = formattedEndDate;
        }

        console.log('Grant Modification Payload:', grantPayload);
        await createGrantModification(grantPayload as any);
      }

      toast.success(isSubGrant ? "Sub-Grant Modified Successfully" : "Grant Modified Successfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      console.error("Modification error:", error);
      const errorMessage = error?.response?.data?.message || error?.data?.message || error?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <CardContent className='w-100% flex flex-col gap-y-10 p-0'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='bg-white rounded-[2rem] flex flex-col gap-y-7 pb-[2rem]'
        >
          <FormInput
            label='Project'
            name='project'
            placeholder='Enter Project'
            disabled={true}
          />

          {isSubGrant && (
            <FormInput
              label='Sub Grant'
              name='subgrant'
              placeholder='Enter Sub Grant'
              disabled={true}
            />
          )}

          <FormInput
            name='modification_number'
            label='Modification Number'
            required
            placeholder='Enter modification number'
            type='number'
          />

          <FormSelect
            name='modification_type'
            label='Modification Type'
            required
            placeholder='Select modification type'
            options={[
              { value: 'INCREASE_OBLIGATION', label: 'Increase Obligation' },
              { value: 'DE_OBLIGATION', label: 'De-Obligation' },
              { value: 'INCREASE_PERFORMANCE_PERIOD', label: 'Increase Performance Period' },
              { value: 'REDUCE_PERFORMANCE_PERIOD', label: 'Reduce Performance Period' },
              { value: 'SCOPE_CHANGE', label: 'Scope Change' },
            ]}
          />

          <FormTextArea
            label='Reason'
            name='reason'
            required
            placeholder='Enter reason for modification'
          />

          {/* Show amount fields for obligation changes */}
          {showAmountFields && (
            <>
              <FormInput
                name='amount_usd'
                label='Amount (USD)'
                required
                placeholder='Enter amount in USD'
                type='number'
              />

              <FormInput
                name='amount_ngn'
                label='Amount (NGN)'
                required
                placeholder='Enter amount in NGN'
                type='number'
              />
            </>
          )}

          {/* Show period fields for performance period changes */}
          {showPeriodFields && (
            <>
              {/* Display current dates */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-blue-900 text-sm">Current Performance Period</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600 font-medium">Current Start Date</label>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {formatDateForDisplay(projectData?.start_date)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 font-medium">Current End Date</label>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {formatDateForDisplay(projectData?.end_date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* New dates input */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm">New Performance Period</h4>
                <DateInput
                  label='New Start Date'
                  name='start_date'
                  required
                />

                <DateInput
                  label='New End Date'
                  name='end_date'
                  required
                />
              </div>
            </>
          )}

          <FormTextArea
            label='Notes'
            name='notes'
            required
            placeholder='Enter additional notes'
          />

          <FormSelect
            name='approved_by'
            label='Approved By'
            required
            placeholder='Select approver'
            options={userOptions}
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isGrantLoading || isSubGrantLoading} disabled={isGrantLoading || isSubGrantLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddModification;
