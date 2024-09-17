import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAddFinancialYearMutation, useUpdateFinancialYearMutation } from "services/moduleConfig";
import { TFinancialYear, financialYearSchema } from "definations/module-config";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";

const isCurrent = [
    { label: "false", value: "false" },
    { label: "true", value: "true" },
  ];

const AddFinancialYear = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TFinancialYear;
  const form = useForm<TFinancialYear>({
    resolver: zodResolver(financialYearSchema),
    defaultValues: {
      year: data?.year ?? "",
      dynamic_order: data?.dynamic_order ?? "",
      is_current: data?.is_current ?? undefined,
    },
  });

  const [financialYear, { isLoading }] = useAddFinancialYearMutation();
  const [updateFinancialYear, { isLoading: updateFinancialYearLoading }] = useUpdateFinancialYearMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TFinancialYear> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? updateFinancialYear({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          }).unwrap()
        : await financialYear(data).unwrap();
      toast.success("Financial Year Added Succesfully");
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
                label="Year"
                name="year"
                placeholder="2020/2021"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-x-1">
              <FormInput label="Dynamic Order" name="dynamic_order" type="number" required />
              {/* <FormInput label="Current" name="is_current" required /> */}
              <FormSelect
                label="Current"
                name="is_current"
                required
                options={isCurrent}
              />
            </div>
            <div className="flex justify-start gap-4">
              <FormButton loading={isLoading || updateFinancialYearLoading}>Save</FormButton>
            </div>
          </form>
        </Form>
      </CardContent>
  )
}

export default AddFinancialYear