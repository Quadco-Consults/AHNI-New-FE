import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "components/ui/form";
import FormInput from "atoms/FormInput";
import BackNavigation from "atoms/BackNavigation";
import FormSelect from "atoms/FormSelect";
import { Card, CardContent } from "components/ui/card";
import { useCreateAgreementMutation } from "services/adminApi/agreements";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";

const agreementTypes = [
  { label: "Lease", value: "Lease" },
  { label: "SLA", value: "SLA" },
  { label: "HMO", value: "HMO" },
  { label: "Security", value: "Security" },
  { label: "Insurance", value: "Insurance" },
  { label: "Ticketing", value: "Ticketing" },
];

const defaultValues = {
  provider: "",
  service: "",
  type: "",
  start_date: "",
  end_date: "",
};

const formSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  service: z.string().min(1, "Service is required"),
  type: z.string().min(1, "Type is required"),
  start_date: z.string(),
  end_date: z.string(),
});

const CreateAgreement = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [createagreement, { isLoading }] = useCreateAgreementMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createagreement(values).unwrap();
      toast.success("Agreement created successfully");
      Object.keys(values).forEach((item) => {
        form.setValue(item as keyof typeof defaultValues, " ");
      });
    } catch (error: any) {
      toast.error(error.message || "Error creating agreement");
    }
  }

  return (
    <div className="space-y-6">
      <BackNavigation extraText="New Agreement" />
      <Card>
        <CardContent className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <FormInput name="provider" label="Provider" />
                <FormInput name="service" label="Service" />
                <FormSelect label="Type" name="type" options={agreementTypes} />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <FormInput name="start_date" type="date" label="Start Date" />
                <FormInput name="end_date" type="date" label="End Date" />
              </div>
              {/* Add similar FormField components for service and type */}
              {/* Add date inputs for start and end dates */}
              <FormButton loading={isLoading} type="submit">
                Create
              </FormButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAgreement;
