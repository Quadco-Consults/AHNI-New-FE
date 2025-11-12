"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import FormSelect from "@/components/FormSelect";
import { Form } from "@/components/ui/form";
import {
  IDisbursementPaginatedData,
  DisbursementSchema,
  TDisbursementFormData,
} from "features/contracts-grants/types/grants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { closeDialog } from "store/ui";
import { useCreateDisbursement, useUpdateDisbursement } from "../../controllers/disbursementController";
import { queryClient } from "constants/mainController";


export default function DisbursementModal() {
  const { dialogProps } = useAppSelector((state) => state.ui.dailog);

  const disbursement =
    dialogProps?.disbursement as unknown as IDisbursementPaginatedData;

  const grantId = dialogProps?.grantId as string;
  const projectId = dialogProps?.projectId as string;

  const form = useForm<TDisbursementFormData>({
    resolver: zodResolver(DisbursementSchema),
    defaultValues: {
      amount: disbursement?.amount ?? "",
      description: disbursement?.description ?? "",
      disbursement_date: disbursement?.disbursement_date ?? "",
      disbursement_method: disbursement?.disbursement_method ?? "",
      reference_number: disbursement?.reference_number ?? "",
      project: projectId ?? disbursement?.project ?? "",
      grant: grantId ?? disbursement?.grant ?? "",
      obligation: disbursement?.obligation ?? "",
    },
  });

  const dispatch = useAppDispatch();

  const { createDisbursement, isLoading: isCreateLoading } =
    useCreateDisbursement(grantId || "");

  const { updateDisbursement, isLoading: isUpdateLoading } =
    useUpdateDisbursement(grantId || "", disbursement?.id || "");

  const disbursementMethods = [
    { label: "Bank Transfer", value: "bank_transfer" },
    { label: "Wire Transfer", value: "wire_transfer" },
    { label: "Check", value: "check" },
    { label: "Cash", value: "cash" },
    { label: "Electronic Payment", value: "electronic_payment" },
  ];

  const onSubmit: SubmitHandler<TDisbursementFormData> = async (data) => {
    if (!grantId) {
      toast.error("Grant ID is required");
      return;
    }

    try {
      if (disbursement?.id) {
        // Update existing disbursement
        await updateDisbursement(data);
        toast.success("Disbursement Updated");
      } else {
        // Create new disbursement
        await createDisbursement(data);
        toast.success("Disbursement Created");
      }

      // Refresh disbursements list
      queryClient.invalidateQueries({ queryKey: ["disbursements", grantId] });

      dispatch(closeDialog());
    } catch (error: any) {
      toast.error(error?.data?.message ?? error?.message ?? "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Amount"
          name="amount"
          placeholder="Enter Amount (e.g., 25000.00)"
          type="number"
          step="0.01"
          required
        />

        <FormTextArea
          label="Description"
          name="description"
          placeholder="Enter disbursement description"
          required
        />

        <FormInput
          label="Disbursement Date"
          name="disbursement_date"
          type="date"
          required
        />

        <FormSelect
          label="Disbursement Method"
          name="disbursement_method"
          placeholder="Select disbursement method"
          options={disbursementMethods}
        />

        <FormInput
          label="Reference Number"
          name="reference_number"
          placeholder="Enter reference number (optional)"
        />

        <div className="flex justify-end">
          <FormButton
            size="lg"
            loading={isCreateLoading || isUpdateLoading}
          >
            {disbursement?.id ? "Update" : "Create"} Disbursement
          </FormButton>
        </div>
      </form>
    </Form>
  );
}