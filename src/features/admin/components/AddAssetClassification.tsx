"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
  AssetClassificationSchema,
  IAssetClassificationData,
  TAssetClassificationFormValues,
} from "@/features/admin/types/admin/asset-classification";
import {
  useCreateAssetClassificationMutation,
  useEditAssetClassificationMutation,
} from "@/features/modules/controllers/config/assetClassificationController";
import FormTextArea from "components/atoms/FormTextArea";

export default function AddAssetClassification() {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as IAssetClassificationData;

  const form = useForm<TAssetClassificationFormValues>({
    resolver: zodResolver(AssetClassificationSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();

  const [createAssetClassification, { isLoading: isAddLoading }] =
    useCreateAssetClassificationMutation();

  const [editAssetClassification, { isLoading: isUpdateLoading }] =
    useEditAssetClassificationMutation();

  const onSubmit: SubmitHandler<TAssetClassificationFormValues> = async (
    data
  ) => {
    try {
      if (dialogProps?.type === "update") {
        await editAssetClassification({
          // @ts-ignore
          id: String(dialogProps?.data?.id),
          body: data,
        });
      } else {
        await createAssetClassification(data);
      }

      toast.success("Asset Classification Created");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };
  return (
    <Form {...form}>
      <form
        action=''
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-y-7'
      >
        <FormInput label='Name' name='name' placeholder='Enter Name' required />

        <FormTextArea
          label='Description'
          name='description'
          placeholder='Enter Description'
          required
        />

        <div className='flex justify-start gap-4'>
          <FormButton loading={isAddLoading || isUpdateLoading}>
            Save
          </FormButton>
        </div>
      </form>
    </Form>
  );
}
