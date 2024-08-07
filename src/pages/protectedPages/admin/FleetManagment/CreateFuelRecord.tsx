import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useGetAssetsQuery } from "services/adminApi/assetsApi";
import { useCreateVehicleFuelRecordMutation } from "services/adminApi/VehicleRequestApi";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
  odometer: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)),
      "Price per liter must be a valid number"
    ),
  distance_covered: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)),
      "Price per liter must be a valid number"
    ),
  price_per_liter: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)),
      "Price per liter must be a valid number"
    ),
  quantity: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)),
      "Price per liter must be a valid number"
    ),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), "Amount must be a valid number"),
  vehicle: z.string().uuid("Invalid vehicle ID"),
});

export type FuelRecordForm = z.infer<typeof formSchema>;

const CreateFuelRecord = () => {
  const form = useForm<FuelRecordForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle: "",
      odometer: "",
      distance_covered: "",
      price_per_liter: "",
      quantity: "",
      amount: "",
    },
  });

  const { data } = useGetAssetsQuery({ classification: "Vehicle" });

  const [createFuelRecord, { isLoading }] =
    useCreateVehicleFuelRecordMutation();

  const drivedData = useMemo(() => {
    return data?.results?.map((item) => ({
      label: item.asset_type.name,
      value: item.id,
    }));
  }, [data]);

  const onSubmit = async (values: FuelRecordForm) => {
    try {
      await createFuelRecord(values).unwrap();
      toast.success("Fuel record created successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to create fuel record");
    }
  };
  return (
    <div>
      <BackNavigation extraText="New Fuel Consumption Record" />
      <Card>
        <CardContent className="p-5">
          <Form {...form}>
            <form
              className="flex flex-col gap-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormSelect
                required
                label="Vehicle"
                name="vehicle"
                options={drivedData}
              />
              <div className="grid grid-cols-3 gap-4 ">
                <FormInput
                  name="odometer"
                  label="Odometer Reading"
                  type="number"
                  required
                />
                <FormInput required name="date" label="Date" type="date" />
                <FormInput
                  name="distance_covered"
                  label="Distance Covered"
                  type="number"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4 ">
                <FormInput
                  name="price_per_liter"
                  label="Price Per Liter"
                  type="number"
                  required
                />
                <FormInput
                  name="quantity"
                  label="Quantity"
                  type="number"
                  required
                />

                <FormInput
                  name="amount"
                  label="Amount (₦)"
                  type="number"
                  required
                />
              </div>
              <FormButton loading={isLoading} className="w-2/12">
                Submit
              </FormButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateFuelRecord;
