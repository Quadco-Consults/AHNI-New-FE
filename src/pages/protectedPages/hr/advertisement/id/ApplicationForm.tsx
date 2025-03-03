import FileUpload from "atoms/FileUpload";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { HrRoutes } from "constants/RouterConstants";

import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import JobApplicationAPI from "services/hrApi/hr-job-applications";
import { toast } from "sonner";
const ApplicationForm = () => {
  const { id } = useParams();

  const [createJobApplication, { isLoading }] =
    JobApplicationAPI.useCreateJobApplicationMutation();
  const navigate = useNavigate();

  const form = useForm({
    // resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      applicant_name: "",
      applicant_email: "",
      application_notes: "",
      cover_letter: "",
      employment_type: "internal",
      job: id,
      position_applied: "",
      referee_1_name: "",
      referee_1_email: "",
      referee_2_name: "",
      referee_2_email: "",
      referee_3_name: "",
      referee_3_email: "",

      resume: null, // File will be converted to Base64
      status: "applied",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "resume" || key === "cover_letter") {
          if (value instanceof FileList && value.length > 0) {
            formData.append(key, value[0]); // ✅ Append only the first file
          }
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString()); // ✅ Convert to string for safety
        }
      });

      // @ts-ignore
      await createJobApplication(formData).unwrap();
      toast.success(" Application Submitted successfully");
      navigate(HrRoutes.ADVERTISEMENT);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const jobTypeOptions = [
    { value: "internal", label: "Internal" },
    { value: "external", label: "External" },
    { value: "both", label: "Both" },
  ];

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
              <FormInput name='applicant_name' label='Name' required />
              <FormInput
                name='applicant_email'
                label='Email'
                type='email'
                required
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput name='position_applied' label='Position' required />
              <FormSelect
                name='employment_type'
                label='Employement type'
                placeholder='Select Project'
                options={jobTypeOptions}
              />
            </div>
            <h5>Referee 1</h5>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput name='referee_1_name' label='Name' required />
              <FormInput
                name='referee_1_email'
                label='Email'
                type='email'
                required
              />
            </div>
            <h5>Referee 2</h5>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput name='referee_2_name' label='Name' required />
              <FormInput
                name='referee_2_email'
                label='Email'
                type='email'
                required
              />
            </div>{" "}
            <h5>Referee 3</h5>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput name='referee_3_name' label='Name' required />
              <FormInput
                name='referee_3_email'
                label='Email'
                type='email'
                required
              />
            </div>
            <FormTextArea name='application_notes' label='Note' required />
            <div className='grid grid-cols-2 gap-4'>
              <FileUpload name='resume' label='Upload Resume' />
              <FileUpload name='cover_letter' label='Upload Cover Letter' />
            </div>
            <div className='flex justify-end gap-3'>
              <Button className='bg-alternate text-primary'>Cancel</Button>
              <FormButton
                disabled={isLoading}
                loading={isLoading}
                type='submit'
              >
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ApplicationForm;
