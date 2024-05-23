import FileUpload from "atoms/FileUpload";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

const ActivityUploadModal = () => {
  const form = useForm({
    defaultValues: {
      title: [
        {
          descriptionOfItems: "",
          numberOfPersons: "",
          numberOfDays: "",
          fco: "",
          unitCost: "",
          total: "",
        },
      ],
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.table(">>>>>>>>>>>>>>>>", data);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormInput name="project-name" label="Project Name" />
        </form>
      </Form>

      <FileUpload />

      <div className="flex justify-between gap-5 mt-16">
        <Button type="button" className="bg-[#FFF2F2] text-primary ">
          Cancel
        </Button>
        <FormButton>Done</FormButton>
      </div>
    </div>
  );
};

export default ActivityUploadModal;
