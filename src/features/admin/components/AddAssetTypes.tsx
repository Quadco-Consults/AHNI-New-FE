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
  AssetTypeSchema,
  TAssetTypeData,
  TAssetTypeFormValues,
} from "@/features/admin/types/admin/asset-type";
import {
  useAddAssetTypeMutation,
  useUpdateAssetTypeMutation,
} from "@/features/modules/controllers/admin/assetTypeController";

const AddAssetTypes = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TAssetTypeData;

  const form = useForm<TAssetTypeFormValues>({
    resolver: zodResolver(AssetTypeSchema),
    defaultValues: {
      name: data?.name ?? "",
      manufacturer: data?.manufacturer ?? "",
      model: data?.model ?? "",
      serial_number: data?.serial_number ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const [assetTypes, { isLoading }] = useAddAssetTypeMutation();

  const [updateAssetTypes, { isLoading: updateAssetTypesLoading }] =
    useUpdateAssetTypeMutation();

  const onSubmit: SubmitHandler<TAssetTypeFormValues> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? await updateAssetTypes({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          })
        : await assetTypes(data);

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

        <FormInput
          label='Manufacturer'
          placeholder='Enter Manufacturer'
          name='manufacturer'
          required
        />

        <FormInput
          label='Model'
          name='model'
          placeholder='Enter Model'
          required
        />

        <FormInput
          label='Serial Number'
          name='serial_number'
          placeholder='Enter Serial Number'
          required
        />

        <div className='flex justify-start gap-4'>
          <FormButton loading={isLoading || updateAssetTypesLoading}>
            Save
          </FormButton>
        </div>
      </form>
    </Form>
  );
};

export default AddAssetTypes;
