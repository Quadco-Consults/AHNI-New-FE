import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAddSupervisionCategoryMutation } from "services/module-programs";
import {
  TSupervisionCategory,
  supervisionCategorySchema,
} from "definations/module-programs";

const jobCategoryOptions = [
  { label: "Goods", value: "Goods" },
  { label: "Service", value: "Service" },
  { label: "Work", value: "Work" },
  { label: "Others", value: "Others" },
];

const AddSupervisionCategory = () => {
  const form = useForm<TSupervisionCategory>({
    resolver: zodResolver(supervisionCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      job_category: undefined,
      serial_number: "",
      code: "",
    },
  });
  const [supervisionCategory, { isLoading }] =
    useAddSupervisionCategoryMutation();

  const onSubmit: SubmitHandler<TSupervisionCategory> = async (data) => {
    try {
      await supervisionCategory(data).unwrap();
      toast.success("Supervision Category Added Succesfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong");
    }
  };

  return (
    <Card className="max-w-[743px]">
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
            <div className="grid grid-cols-2 gap-x-7">
              <FormInput
                label="Serial Number"
                name="serial_number"
                type="number"
                required
              />
              <FormSelect
                label="Job Category"
                name="job_category"
                required
                options={jobCategoryOptions}
              />
            </div>
            <div className="flex justify-start gap-4">
              <FormButton loading={isLoading}>Save</FormButton>
              <FormButton>Save and Add New</FormButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddSupervisionCategory;
