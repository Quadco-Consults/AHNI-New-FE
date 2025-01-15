import FileUpload from "atoms/FileUpload";
import FormInput from "atoms/FormInput";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
const ApplicationForm = () => {
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
            <h4 className='font-medium text-lg pb-4 text-primary'>
              Applicant Details
            </h4>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput name='name' label='Name' required />
              <FormInput name='email' label='Email' required />
            </div>
            <h5>Referee 1</h5>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput name='referee-1-name' label='Name' required />
              <FormInput name='referee-1-email' label='Email' required />
            </div>
            <h5>Referee 2</h5>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput name='referee-2-name' label='Name' required />
              <FormInput name='referee-2-email' label='Email' required />
            </div>{" "}
            <h5>Referee 3</h5>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput name='referee-3-name' label='Name' required />
              <FormInput name='referee-3-email' label='Email' required />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <FileUpload name='resume-document' label='Upload Resume' />
              <FileUpload
                name='cover-letter-document'
                label='Upload Cover Letter'
              />
            </div>
            <div className='flex justify-end gap-3'>
              <Button className='bg-alternate text-primary'>Cancel</Button>
              <Button>Submit</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ApplicationForm;
