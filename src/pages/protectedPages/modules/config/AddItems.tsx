import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useAddItemsMutation,
  useUpdateItemsMutation,
} from "services/moduleConfig";
import { TItems, itemsSchema } from "definations/module-config";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";

const AddItems = () => {
  const { dialogProps } = useAppSelector(dailogSelector);

  const data = dialogProps?.data as unknown as TItems;
  const form = useForm<TItems>({
    resolver: zodResolver(itemsSchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      uom: data?.uom ?? "",
      category: data?.category ?? "",
    },
  });

  const [items, { isLoading }] = useAddItemsMutation();
  const [updateItems, { isLoading: updateItemsLoading }] =
    useUpdateItemsMutation();

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<TItems> = async (data) => {
    try {
      dialogProps?.type === "update"
        ? updateItems({
            //@ts-ignore
            id: String(dialogProps?.data?.id),
            body: data,
          }).unwrap()
        : await items(data).unwrap();
      toast.success("Item Added Succesfully");
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
          <div className="grid grid-cols-2 gap-x-1">
            <FormInput label="UOM" name="uom" required />
            <FormInput label="Category" name="category" required />
          </div>
          <div className="flex justify-start gap-4">
            <FormButton loading={isLoading || updateItemsLoading}>
              Save
            </FormButton>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default AddItems;
