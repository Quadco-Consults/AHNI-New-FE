import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";

import {
  TFundingSource,
  fundingSourceSchema,
} from "definations/module-projects";
import {
  useAddFundingSourceMutation,
  useUpdateFundingSourceMutation,
} from "services/moduleProjects";

import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

const AddFundingSource = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TFundingSource;

  const form = useForm<TFundingSource>({
    resolver: zodResolver(fundingSourceSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const dispatch = useAppDispatch();
  const [fundingSource, { isLoading }] = useAddFundingSourceMutation();

  const [updateFunding, { isLoading: updateFundingLoading }] =
    useUpdateFundingSourceMutation();

  const onSubmit: SubmitHandler<TFundingSource> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? updateFunding({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          }).unwrap()
        : await fundingSource(data).unwrap();
      toast.success("Funding Source Added Succesfully");
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
        <div className="grid grid-cols-1 gap-y-7">
          <FormInput label="Description" name="description" required />
        </div>
        <div className="flex justify-start gap-4">
          <FormButton loading={isLoading || updateFundingLoading}>
            Save
          </FormButton>
        </div>
      </form>
    </Form>
  );
};

export default AddFundingSource;
