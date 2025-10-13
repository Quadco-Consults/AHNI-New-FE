"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import { Form } from "@/components/ui/form";
import {
  IObligationPaginatedData,
  ObligationSchema,
  TObligationFormData,
} from "features/contracts-grants/types/grants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateObligation,
  useModifyObligation,
} from "@/features/contracts-grants/controllers/obligationController";
import {
  useCreateSubGrantObligation,
  useUpdateSubGrantObligation,
} from "@/features/contracts-grants/controllers/subGrantObligationController";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

export default function ObligationModal() {
  const { dialogProps } = useAppSelector((state) => state.ui.dailog);

  const obligation =
    dialogProps?.obligation as unknown as IObligationPaginatedData;

  const grantId = dialogProps?.grantId as string;
  const subGrantId = dialogProps?.subGrantId as string;

  const form = useForm<TObligationFormData>({
    resolver: zodResolver(ObligationSchema),
    defaultValues: {
      amount: obligation?.amount ?? "",
      description: obligation?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();

  // For regular grants
  const { createObligation, isLoading: isCreateLoading } =
    useCreateObligation(grantId || "");

  const { updateObligation, isLoading: isModifyLoading } =
    useModifyObligation(grantId || "", obligation?.id || "");

  // For sub-grants
  const { createObligation: createSubGrantObligation, isLoading: isCreateSubGrantLoading } =
    useCreateSubGrantObligation(subGrantId || "");

  const { updateObligation: updateSubGrantObligation, isLoading: isUpdateSubGrantLoading } =
    useUpdateSubGrantObligation(subGrantId || "", obligation?.id || "");

  const onSubmit: SubmitHandler<TObligationFormData> = async (data) => {
    // Check if we're dealing with a subgrant or regular grant
    const isSubGrant = !!subGrantId;
    const isGrant = !!grantId;

    if (!isSubGrant && !isGrant) {
      toast.error("Grant ID or SubGrant ID is required");
      return;
    }

    try {
      if (obligation?.id) {
        // Update existing obligation
        if (isSubGrant) {
          await updateSubGrantObligation(data);
        } else {
          await updateObligation(data);
        }
        toast.success("Obligation Updated");
      } else {
        // Create new obligation
        if (isSubGrant) {
          await createSubGrantObligation(data);
        } else {
          await createObligation(data);
        }
        toast.success("Obligation Created");
      }

      dispatch(closeDialog());
    } catch (error: any) {
      toast.error(error?.data?.message ?? error?.message ?? "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <FormInput
          label='Amount'
          name='amount'
          placeholder='Enter Amount'
          required
        />

        <FormTextArea
          label='Description'
          name='description'
          placeholder='Enter Description'
          required
        />

        <div className='flex justify-end'>
          <FormButton
            size='lg'
            loading={isCreateLoading || isModifyLoading || isCreateSubGrantLoading || isUpdateSubGrantLoading}
          >
            Submit
          </FormButton>
        </div>
      </form>
    </Form>
  );
}