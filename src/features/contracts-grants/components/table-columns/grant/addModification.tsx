"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "components/FormButton";
import FormInput from "components/FormInput";
import FormSelect from "components/FormSelect";
import FormTextArea from "components/FormTextArea";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import { useEffect } from "react";

import {
  IModificationSingleData,
  ModificationSchema,
  TModificationFormData,
} from "features/contracts-grants/types/modification";
import { useCreateModification } from "@/features/contracts-grants/controllers/grantController";
import { useCreateSubGrantModification } from "@/features/contracts-grants/controllers/subGrantModificationController";
import DateInput from "@/components/DateInput";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useMemo } from "react";

const AddModification = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const result = dialogProps?.data as unknown as IModificationSingleData;
  console.log({ result });

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
      effective_date: "",
      approval_date: "",
      notes: "",
      approved_by: "",
    },
  });
  const vn = form.getValues();
  console.log({ vn });

  const dispatch = useAppDispatch();

  // Detect if this is a subgrant or regular grant
  const subGrantId = dialogProps?.subGrantId as string;
  const grantId = dialogProps?.grantId as string || (result as any)?.id; // Fallback to result.id if grantId not provided
  const isSubGrant = !!subGrantId;

  console.log("Debug grant/subgrant IDs:", {
    subGrantId,
    grantId,
    isSubGrant,
    dialogProps,
    resultId: result?.id
  });

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
    if (!usersData?.data?.results) return [];

    return usersData.data.results.map((user) => ({
      value: user.id,
      label: `${user.first_name} ${user.last_name} (${user.email})`,
    }));
  }, [usersData]);

  // USD to NGN conversion rate (you can make this dynamic by fetching from an API)
  const USD_TO_NGN_RATE = 1550; // Update this rate as needed

  // Watch amount_usd and auto-convert to NGN
  const amountUsd = form.watch("amount_usd");

  useEffect(() => {
    if (amountUsd && !isNaN(Number(amountUsd))) {
      const usdValue = Number(amountUsd);
      const ngnValue = (usdValue * USD_TO_NGN_RATE).toFixed(2);
      form.setValue("amount_ngn", ngnValue);
    }
  }, [amountUsd, form]);

  const onSubmit: SubmitHandler<TModificationFormData> = async (data) => {
    console.log({ crakcen: data });

    if (!grantId && !subGrantId) {
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

    const formattedEffectiveDate = formatDate(submitData.effective_date);
    const formattedApprovalDate = formatDate(submitData.approval_date);

    try {
      // Generate title from modification type and number
      const title = `${submitData.modification_type.replace(/_/g, ' ')} #${submitData.modification_number}`;

      if (isSubGrant) {
        // For subgrants
        await createSubGrantModification({
          title: title,
          modification_number: submitData.modification_number,
          modification_type: submitData.modification_type,
          reason: submitData.reason,
          description: submitData.reason, // Use reason as description
          amount: submitData.amount_usd, // Use USD as primary amount
          amount_usd: submitData.amount_usd,
          amount_ngn: submitData.amount_ngn,
          effective_date: formattedEffectiveDate,
          approval_date: formattedApprovalDate,
          notes: submitData.notes,
          approved_by: submitData.approved_by,
        } as any);
      } else {
        // For regular grants
        await createGrantModification({
          title: title,
          modification_number: submitData.modification_number,
          modification_type: submitData.modification_type,
          reason: submitData.reason,
          description: submitData.reason, // Use reason as description
          amount: submitData.amount_usd, // Use USD as primary amount
          amount_usd: submitData.amount_usd,
          amount_ngn: submitData.amount_ngn,
          effective_date: formattedEffectiveDate,
          approval_date: formattedApprovalDate,
          notes: submitData.notes,
          approved_by: submitData.approved_by,
        } as any);
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
              { value: 'FUNDING_INCREASE', label: 'Funding Increase' },
              { value: 'FUNDING_DECREASE', label: 'Funding Decrease' },
              { value: 'TIME_EXTENSION', label: 'Time Extension' },
              { value: 'SCOPE_CHANGE', label: 'Scope Change' },
              { value: 'OTHER', label: 'Other' },
            ]}
          />

          <FormTextArea
            label='Reason'
            name='reason'
            required
            placeholder='Enter reason for modification'
          />

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

          <DateInput
            label='Effective Date'
            name='effective_date'
            required
          />

          <DateInput
            label='Approval Date'
            name='approval_date'
            required
          />

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
