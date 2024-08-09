import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import Card from "components/shared/Card";
import {
  TFundingSource,
  fundingSourceSchema,
} from "definations/module-projects";
import { useAddFundingSourceMutation } from "services/moduleProjects";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const AddFundingSource = () => {
  const form = useForm<TFundingSource>({
    resolver: zodResolver(fundingSourceSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  });
  const [fundingSource, { isLoading }] = useAddFundingSourceMutation();

  const onSubmit: SubmitHandler<TFundingSource> = async (data) => {
    try {
      await fundingSource(data).unwrap();
      toast.success("Funding Source Added Succesfully");
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
            <div className="flex justify-start gap-4">
              <FormButton loading={isLoading}>Save</FormButton>
              <FormButton loading={isLoading}>Save and Add New</FormButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddFundingSource;
