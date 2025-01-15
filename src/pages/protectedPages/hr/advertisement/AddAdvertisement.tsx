import FileUpload from "atoms/FileUpload";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

const AddAdvertisement = () => {
  const form = useForm();
  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <div className='space-y-4'>
      <GoBack />
      <Card>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <h4 className='font-medium text-lg pb-4'>
              Initiate New Advertisement
            </h4>

            <FormInput name='title' label='Title' required />
            <FormInput name='grade_level' label='Grade Level' required />
            <FormInput name='locations' label='Locations' required />
            <FormInput name='duration' label='Duration' required />
            <FormInput
              name='commencement_date'
              label='Commencement Date'
              required
            />
            <FormInput
              name='number_of_consultants'
              label='Number of Consultants'
              required
            />
            <FormInput name='supervisor' label='Supervisor' required />
            <FormInput name='info' label='Info' required />
            <FormTextArea name='background' label='Background' required />
            <FileUpload
              name='document'
              label='Upload Complete Advertisement Document'
            />

            <div className='flex justify-end'>
              <Button>Create</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddAdvertisement;
