"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
  BeneficiarySchema,
  TBeneficiaryData,
  TBeneficiaryFormValues,
} from "@/features/projects/types/project/beneficiaries";
import {
  useAddBeneficiary,
  useUpdateBeneficiary,
} from "@/features/modules/controllers/project/beneficiaryController";
import FormTextArea from "components/atoms/FormTextArea";

const AddBeneficiaries = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TBeneficiaryData;
  const form = useForm<TBeneficiaryFormValues>({
    resolver: zodResolver(BeneficiarySchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const { addBeneficiary: beneficiary, isLoading } = useAddBeneficiary();
  const { updateBeneficiary, isLoading: updateBeneficiaryLoading } =
    useUpdateBeneficiary();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TBeneficiaryFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateBeneficiary({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await beneficiary(data);
      toast.success("Beneficiary Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  return (
    <CardContent>
      <Form {...form}>
        <form
          action=''
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-y-7'
        >
          <FormInput
            label='Name'
            name='name'
            placeholder='Enter Name'
            required
          />

          <FormTextArea
            label='Description'
            name='description'
            placeholder='Enter Description'
          />

          <div className='flex justify-start gap-4'>
            <FormButton loading={isLoading || updateBeneficiaryLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddBeneficiaries;
