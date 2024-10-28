import { zodResolver } from "@hookform/resolvers/zod";
import RoundBack from "assets/svgs/RoundBack";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import Card from "components/shared/Card";
import { Form } from "components/ui/form";
import { ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  useCosumablesItemsQuery,
  useCreateConsumablesMutation,
} from "services/adminApi/consumables";
import { toast } from "sonner";
import { z } from "zod";

const stockControl = [
  { label: "Stock Level", value: "stock_level" },
  { label: "Availability", value: "availability" },
  { label: "Just In Time", value: "just_in_time" },
];

const category = [
  { label: "Stationary", value: "Stationary" },
  { label: "Fuel & Diesel", value: "Fuel & Diesel" },
  { label: "M&E Tools", value: "M&E Tools" },
  { label: "PPEs", value: "PPEs" },
];

const defaultValues = {
  item: "",
  category: "",
  expiry_date: "",
  minimum_stock_level: "",
  quantity: "",
  stock_control_method: "",
};

const formSchema = z.object({
  item: z.string().min(1, "item is required"),
  category: z.string().optional(),
  expiry_date: z.string().optional(),
  minimum_stock_level: z.string().optional(),
  quantity: z.string().optional(),
  stock_control_method: z.string().optional(),
});

const CreateConsumables = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  const { data } = useCosumablesItemsQuery();

  const drivedData = useMemo(() => {
    return data?.results.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [data?.results]);

  const [createConsumable, { isLoading }] = useCreateConsumablesMutation();

  const onSubmit: SubmitHandler<Partial<z.infer<typeof formSchema>>> = async (
    data
  ) => {
    try {
      await createConsumable(data).unwrap();
      form.reset(defaultValues);
      toast.success("Item created successfully");
    } catch (error: any) {
      toast.error(
        error.data.message || "Something went wrong, please try again"
      );
    }
  };

  return (
    <div>
      <div className="flex items-center gap-x-2">
        <div onClick={() => navigate(-1)}>
          <RoundBack />
        </div>
        <h4 className="text-xl font-bold">Item Registration</h4>
      </div>
      <Card>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-8"
            action=""
          >
            <FormSelect
              name="item"
              label="Item"
              required
              options={drivedData}
            />
            <div className="grid grid-cols-8 gap-x-16">
              <div className="col-span-2">
                <FormInput name="quantity" type="number" label="Quantity" />
              </div>
              <div className="col-span-3">
                <FormSelect
                  name="stock_control_method"
                  label="Stock Control Method"
                  options={stockControl}
                />
              </div>
              <div className="col-span-3">
                <FormSelect
                  name="category"
                  label="Category"
                  options={category}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormInput name="expiry_date" type="date" label="Expiry Date" />
              <FormInput
                name="minimum_stock_level"
                type="number"
                label="Minimum Stock Level"
              />
              <FormInput name="" type="number" label="Previous Quantity" />
              <FormInput name="" type="number" label="Re-order Level" />
              <FormInput name="" type="number" label="Buffer Stock" />
              <FormInput name="" type="number" label="Minimum Stock" />
              <FormInput name="" type="number" label="Max Stock" />
              <FormInput name="" type="number" label="Level" />
              <FormInput name="" type="date" label="Entry Date" />
              <FormInput name="" type="number" label="Available Quantity" />
              <FormInput name="" type="number" label="Cost of Item" />
            </div>
            <FormButton
              loading={isLoading}
              className="w-28"
              suffix={<ChevronRight size={14} />}
            >
              Continue
            </FormButton>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateConsumables;
