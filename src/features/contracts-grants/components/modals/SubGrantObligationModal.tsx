"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormTextArea from "@/components/atoms/FormTextArea";
import { Form } from "@/components/ui/form";
import {
  IObligationPaginatedData,
  ObligationSchema,
  TObligationFormData,
} from "@/features/contracts-grants/types/grants";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateSubGrantObligation,
  useUpdateSubGrantObligation,
} from "@/features/contracts-grants/controllers/subGrantObligationController";
import { toast } from "sonner";
import { closeDialog } from "@/store/ui";

export default function SubGrantObligationModal() {
  const { dialogProps } = useAppSelector((state) => state.ui.dialog);

  const obligation =
    dialogProps?.obligation as unknown as IObligationPaginatedData;

  const form = useForm<TObligationFormData>({
    resolver: zodResolver(ObligationSchema),
    defaultValues: {
      amount: obligation?.amount ?? "",
      description: obligation?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();

  const subGrantId = dialogProps?.subGrantId as string;

  const { createObligation, isLoading: isCreateLoading } =
    useCreateSubGrantObligation(subGrantId || "");

  const { updateObligation, isLoading: isModifyLoading } =
    useUpdateSubGrantObligation(subGrantId || "", obligation?.id || "");

  const onSubmit: SubmitHandler<TObligationFormData> = async (data) => {
    if (!subGrantId) {
      toast.error("Sub-Grant ID is required");
      return;
    }

    try {
      if (obligation?.id) {
        await updateObligation(data);
        toast.success("Obligation Updated");
      } else {
        await createObligation(data);
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
          type='number'
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
          <FormButton size='lg' loading={isCreateLoading || isModifyLoading}>
            Submit
          </FormButton>
        </div>
      </form>
    </Form>
  );
}
