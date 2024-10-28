import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { TAssetTypes, assetTypesSchema } from "definations/module-admin";
import {
  useAddAssetTypesMutation,
  useUpdateAssetTypesMutation,
} from "services/moduleAdmin";

import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

const AddAssetTypes = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TAssetTypes;

  const form = useForm<TAssetTypes>({
    resolver: zodResolver(assetTypesSchema),
    defaultValues: {
      name: data?.name ?? "",
      manufacturer: data?.manufacturer ?? "",
      model: data?.model ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const [assetTypes, { isLoading }] = useAddAssetTypesMutation();

  const [updateAssetTypes, { isLoading: updateAssetTypesLoading }] =
    useUpdateAssetTypesMutation();

  const onSubmit: SubmitHandler<TAssetTypes> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? updateAssetTypes({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          }).unwrap()
        : await assetTypes(data).unwrap();
      toast.success("Asset Type Added Succesfully");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };
  return (
    <Form {...form}>
      <form
        action=""
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-10"
      >
        <div className="grid grid-cols-1 gap-y-7">
          <FormInput
            label="Name"
            name="name"
            placeholder="admin@demo.com"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FormInput label="Manufacturer" name="manufacturer" required />
          <FormInput label="model" name="model" required />
        </div>
        <div className="flex justify-start gap-4">
          <FormButton loading={isLoading || updateAssetTypesLoading}>
            Save
          </FormButton>
        </div>
      </form>
    </Form>
  );
};

export default AddAssetTypes;
