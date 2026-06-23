"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormCheckBox from "@/components/FormCheckBox";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dialogSelector } from "@/store/ui";
import {
  ApprovalThresholdSchema,
  TApprovalThresholdFormValues,
} from "@/features/admin/types/config/approval-threshold";
import {
  useAddApprovalThresholdMutation,
  useUpdateApprovalThresholdMutation,
} from "@/features/modules/controllers/config/approvalThresholdController";
import { useGetAllPositionsManager } from "@/features/modules/controllers/config/positionController";
import { useGetAllLocationsManager } from "@/features/modules/controllers/config/locationController";
import { ApprovalThresholdData } from "@/features/modules/types/config";
import { useMemo } from "react";

const AddApprovalThreshold = () => {
  const { dialogProps } = useAppSelector(dialogSelector);
  const data = dialogProps?.data as unknown as ApprovalThresholdData;

  // Fetch positions and locations for dropdowns
  const { data: positionsData } = useGetAllPositionsManager({ size: 1000 });
  const { data: locationsData } = useGetAllLocationsManager({ size: 1000 });

  const form = useForm<TApprovalThresholdFormValues>({
    resolver: zodResolver(ApprovalThresholdSchema),
    defaultValues: {
      transaction_type: data?.transaction_type ?? "",
      approval_level: data?.approval_level ?? "",
      position: data?.position ?? "",
      min_amount: data?.min_amount ?? "",
      max_amount: data?.max_amount ?? "",
      location: data?.location ?? "",
      priority: data?.priority ?? 1,
      is_active: data?.is_active ?? true,
    },
  });

  const dispatch = useAppDispatch();

  const [addThreshold, { isLoading: isAddLoading }] = useAddApprovalThresholdMutation();
  const [updateThreshold, { isLoading: isUpdateLoading }] = useUpdateApprovalThresholdMutation();

  // Transaction type options
  const transactionTypeOptions = [
    { label: "Purchase Request", value: "PURCHASE_REQUEST" },
    { label: "Payment Request", value: "PAYMENT_REQUEST" },
    { label: "Purchase Order", value: "PURCHASE_ORDER" },
    { label: "Expense Authorization", value: "EXPENSE_AUTHORIZATION" },
    { label: "Travel Expense Report", value: "TRAVEL_EXPENSE" },
  ];

  // Approval level options
  const approvalLevelOptions = [
    { label: "State Head (STO)", value: "STATE_HEAD" },
    { label: "Director", value: "DIRECTOR" },
    { label: "Managing Director", value: "MD" },
  ];

  // Position options from API
  const positionOptions = useMemo(() => {
    return positionsData?.data?.results?.map((pos) => ({
      label: pos.name,
      value: pos.id,
    })) ?? [];
  }, [positionsData]);

  // Location options from API
  const locationOptions = useMemo(() => {
    const locations = locationsData?.data?.data?.results?.map((loc) => ({
      label: loc.name,
      value: loc.id,
    })) ?? [];
    return [{ label: "System-wide (All Locations)", value: "" }, ...locations];
  }, [locationsData]);

  const onSubmit: SubmitHandler<TApprovalThresholdFormValues> = async (formData) => {
    try {
      // Convert priority to number if it's a string
      const submitData = {
        ...formData,
        priority: formData.priority ? Number(formData.priority) : 1,
        location: formData.location || undefined,
        max_amount: formData.max_amount || undefined,
      };

      if (dialogProps?.type === "update") {
        await updateThreshold({
          // @ts-ignore
          id: String(dialogProps?.data?.id),
          body: submitData,
        });
        toast.success("Approval Threshold Updated Successfully");
      } else {
        await addThreshold(submitData);
        toast.success("Approval Threshold Added Successfully");
      }

      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ?? error.message ?? "Something went wrong"
      );
    }
  };

  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5"
      >
        <FormSelect
          label="Transaction Type"
          name="transaction_type"
          placeholder="Select transaction type"
          options={transactionTypeOptions}
          required
        />

        <FormSelect
          label="Approval Level"
          name="approval_level"
          placeholder="Select approval level"
          options={approvalLevelOptions}
          required
        />

        <FormSelect
          label="Position"
          name="position"
          placeholder="Select position"
          options={positionOptions}
          required
        />

        <FormInput
          label="Minimum Amount (₦)"
          name="min_amount"
          type="number"
          placeholder="Enter minimum amount"
          required
        />

        <FormInput
          label="Maximum Amount (₦)"
          name="max_amount"
          type="number"
          placeholder="Leave empty for unlimited"
        />

        <FormSelect
          label="Location"
          name="location"
          placeholder="Select location"
          options={locationOptions}
        />

        <FormInput
          label="Priority"
          name="priority"
          type="number"
          placeholder="Enter priority (default: 1)"
        />

        <FormCheckBox
          label="Active"
          name="is_active"
          reverse
        />

        <div className="flex justify-start gap-4">
          <FormButton loading={isAddLoading || isUpdateLoading}>
            Save
          </FormButton>
        </div>
      </form>
    </Form>
  );
};

export default AddApprovalThreshold;
