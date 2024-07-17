import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const AddTargetPopulation = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success("Project Added Succesfully");
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
              <FormInput label="Name" name="name" placeholder="admin@demo.com" required />
            </div>
            <div className="grid grid-cols-1 gap-y-7">
              <FormInput label="Description" name="description" required />
            </div>
            <div className="flex justify-start gap-4">
              <FormButton>Save</FormButton>
              <FormButton>Save and Add New</FormButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddTargetPopulation;
