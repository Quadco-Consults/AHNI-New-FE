import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAddCategoriesMutation, useUpdateCategoriesMutation } from "services/moduleConfig";
import { TCategories, categorySchema } from "definations/module-config";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";

const AddBudgetLine = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TCategories;
  const form = useForm<TCategories>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      job_category: data?.job_category ?? undefined,
      serial_number: data?.serial_number ?? "",
      code: data?.code ?? "",
    },
  });

  const [category, { isLoading }] = useAddCategoriesMutation();
  const [updateCategory, { isLoading: updateCategoryLoading }] = useUpdateCategoriesMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TCategories> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? updateCategory({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          }).unwrap()
        : await category(data).unwrap();
      toast.success("Category Added Succesfully");
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
            // onSubmit={form.handleSubmit(onSubmit)}
            onSubmit={() => dispatch(closeDialog() || form.handleSubmit(onSubmit))}
            className="flex flex-col gap-y-10"
          >
            <div className="grid grid-cols-1 gap-y-7">
              <FormInput
                label="Title"
                name="name"
                placeholder="e.g Travel: International Travel"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-x-1">
              <FormInput label="Description" name="description" required />
              <FormInput label="Code" name="code" required />
            </div>
            <div className="flex justify-start gap-4">
              <FormButton loading={isLoading || updateCategoryLoading}>Save</FormButton>
            </div>
          </form>
        </Form>
      </CardContent>
  )
}

export default AddBudgetLine