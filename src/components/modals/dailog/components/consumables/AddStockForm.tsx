import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Form } from "components/ui/form";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { useEffect } from "react";

import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import {
  TStockCard,
  useCreateStockCardMutation,
  useUpdateStockCardMutation,
} from "services/adminApi/consumables";
import { toast } from "sonner";
import { closeDialog, dailogSelector } from "store/ui";
import { z } from "zod";

const options = [
  {
    label: "Receipt",
    value: "Receipt",
  },
  {
    label: "Issued",
    value: "Issued",
  },
];

const schema = z.object({
  particular: z.string().min(1, "Particular is required"),
  stock: z.string().min(1, "Stock must be a positive number"),
  date: z.string().min(1, "Date is required"),
  status: z
    .enum(["Receipt", "Issued"])
    .refine((value) => ["Receipt", "Issued"].includes(value), {
      message: "Invalid status selection",
    }),
});

const AddStockForm = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { dialogProps } = useAppSelector(dailogSelector);

  useEffect(() => {
    if (dialogProps?.data) {
      const { status, particular, date, stock } = dialogProps?.data as any;
      form.reset({
        particular,
        date,
        stock: String(stock),
        status,
      });
    }
  }, [dialogProps, form]);

  const [params] = useSearchParams();

  const dispatch = useAppDispatch();

  const stock = dialogProps?.data as unknown as TStockCard;

  const stockid = stock?.id;

  const id = params.get("id");

  const [createStock, { isLoading }] = useCreateStockCardMutation();
  const [updateStock, { isLoading: isLoadingUpdate }] =
    useUpdateStockCardMutation();

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    const payload = {
      ...data,
      consumable: id as string,
    };
    try {
      stockid
        ? await updateStock({
            id: stockid,
            body: payload,
          })
        : await createStock(payload).unwrap();
      toast.success("Stock added successfully");
      dispatch(closeDialog());
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="particular" label="User" />
            <FormInput name="stock" label="Stock" type="number" />
          </div>
          <div className="grid items-center grid-cols-2 gap-x-4">
            <FormInput name="date" label="Date" type="date" />
            <FormSelect name="status" label="Status" options={options} />
          </div>
          <div className="w-full mt-6">
            <FormButton loading={isLoading || isLoadingUpdate}>
              Submit
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddStockForm;
