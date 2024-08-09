import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCreateFacilityMutation } from "services/adminApi/faciityMaintenance";
import { useFacilitiesQuery } from "services/module-programs";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  facility: z.string().min(1, "Facility is required"),
  maintenance_type: z.string().min(1, "Maintenance type is required"),
  description_of_problem: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

const FacilitiesMaintanance = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      facility: "",
      maintenance_type: "",
      description_of_problem: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { data } = useFacilitiesQuery({});

  const [createFacility, { isLoading }] = useCreateFacilityMutation();

  const drivedData = useMemo(() => {
    return data?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [data]);

  const onSubmit = async (data: FormValues) => {
    try {
      await createFacility(data).unwrap();
      toast.success("Facility Maintenance Ticket Created");
      form.reset();
    } catch (error) {
      toast.error("Failed to create facility maintenance ticket");
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      <BackNavigation extraText="Facility Maintenance Ticket" />
      <Card>
        <CardContent className="py-7">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-6"
              action=""
            >
              <div className="grid grid-cols-2 gap-x-4">
                <FormSelect
                  label="Facility "
                  name="facility"
                  required
                  options={drivedData}
                />
                <FormInput
                  label="Maintenance Type "
                  name="maintenance_type"
                  required
                />
              </div>
              <FormInput
                label="Description of Proplem"
                name="description_of_problem"
                required
              />
              <FormButton loading={isLoading} className="w-32">
                Raise Request
              </FormButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilitiesMaintanance;
