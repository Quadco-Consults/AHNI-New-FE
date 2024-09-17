import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAddBeneficiariesMutation, useUpdateBeneficiariesMutation } from "services/moduleProjects";
import {
  TBeneficiaries,
  beneficiariesSchema,
} from "definations/module-projects";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";

const AddBeneficiaries = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TBeneficiaries;
  const form = useForm<TBeneficiaries>({
    resolver: zodResolver(beneficiariesSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
    },
  });

  const [beneficiary, { isLoading }] = useAddBeneficiariesMutation();
  const [updateBeneficiary, { isLoading: updateBeneficiaryLoading }] = useUpdateBeneficiariesMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TBeneficiaries> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? updateBeneficiary({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          }).unwrap()
        : await beneficiary(data).unwrap();
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
              <FormButton loading={isLoading || updateBeneficiaryLoading}>Save</FormButton>
            </div>
          </form>
        </Form>
      </CardContent>
  );
};

export default AddBeneficiaries;
