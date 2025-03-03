import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "atoms/FileUpload";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Form } from "components/ui/form";
import { HrRoutes } from "constants/RouterConstants";
import { jobAdvertismentSchema } from "definations/hr-validator";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import JobAdvertisementAPI from "services/hrApi/hr-job-advertisement";
import { toast } from "sonner";

const AddAdvertisement = () => {
  const [createJobAdvertisementMutation, isLoading] =
    JobAdvertisementAPI.useCreateJobAdvertisementMutation();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(jobAdvertismentSchema),
    defaultValues: {
      title: "",
      grade_level: "",
      locations: "",
      job_type: "INTERNAL",
      duration: "",
      commencement_date: "",
      number_of_positions: "",
      supervisor: "",
      any_other_info: "",
      background: "",
      advert_document: null,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key]) => {
        if (key === "advert_document" && data[key]?.length) {
          // Ensure it's a single file, not FileList
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      // @ts-ignore
      await createJobAdvertisementMutation(formData).unwrap();
      toast.success("Job advertisement created successfully");
      navigate(HrRoutes.ADVERTISEMENT);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };
  const jobTypeOptions = [
    { value: "INTERNAL", label: "Internal" },
    { value: "EXTERNAL", label: "External" },
    { value: "BOTH", label: "Both" },
  ];
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
            <FormSelect
              name='job_type'
              label='Job type'
              placeholder='Select Project'
              options={jobTypeOptions}
            />
            <FormInput name='duration' label='Duration' required />
            <FormInput
              name='commencement_date'
              label='Commencement Date'
              required
              type='date'
            />
            <FormInput
              name='number_of_positions'
              label='Number of Consultants'
              required
              type='number'
            />
            <FormInput name='supervisor' label='Supervisor' required />
            <FormInput name='any_other_info' label='Info' required />
            <FormTextArea name='background' label='Background' required />
            <FileUpload
              name='advert_document'
              label='Upload Complete Advertisement Document'
            />

            <div className='flex justify-end'>
              <FormButton
                loading={isLoading === isLoading || false}
                disabled={isLoading === isLoading || false}
              >
                Create
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AddAdvertisement;
