import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAddDocumentTypesMutation } from "services/moduleProjects";
import { TDocumentTypes, documentTypesSchema } from "definations/module-projects";
import { toast } from "sonner";

const AddDocumentTypes = () => {

  const form = useForm<TDocumentTypes>({
    resolver: zodResolver(documentTypesSchema),
    defaultValues: {
      name: "",
      description: "",
    }
  });
  const [documentTypes, { isLoading }] = useAddDocumentTypesMutation();

  const onSubmit: SubmitHandler<TDocumentTypes> = async (data) => {
    try {
      await documentTypes(data).unwrap();
      toast.success("Document Type Added Succesfully");
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
              <FormInput label="Name" name="name" placeholder="admin@demo.com" required />
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

export default AddDocumentTypes;
