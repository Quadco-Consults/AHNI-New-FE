import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "atoms/FileUpload";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
// import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
// import { HrRoutes } from "constants/RouterConstants";
import { jobApplicationSchema } from "definations/hr-validator";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useGetJobAdvertisementQuery } from "services/hrApi/hr-job-advertisement";
import { useCreateJobApplicationMutation } from "services/hrApi/hr-job-applications";
import { toast } from "sonner";
import { z } from "zod";
export type TFormValues = z.infer<typeof jobApplicationSchema>;

const ApplicationForm = () => {
  const { id } = useParams();

  const [createJobApplication, { isLoading }] =
    useCreateJobApplicationMutation();
  const { data: adDetails } = useGetJobAdvertisementQuery({ id: id! });
  const navigate = useNavigate();

  const form = useForm<TFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      applicant_name: "",
      applicant_email: "",
      application_notes: "",
      cover_letter: "",
      employment_type: "INTERNAL",
      advertisement: id,
      interview_date: "",
      position_applied: "",
      referees: [{ name: "", email: "" }],
      resume: null,
      status: "applied",
    },
  });

  // Update form values when advertisement details load
  useEffect(() => {
    if (adDetails?.data) {
      // @ts-ignore
      form.setValue("employment_type", adDetails.data.job_type.toUpperCase());
      form.setValue("position_applied", adDetails.data.title!);
      form.setValue(
        "interview_date",
        adDetails.data.commencement_date?.toString()
      );
    }
  }, [adDetails, form]);

  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "referees",
  // });

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<TFormValues> = async (data: any) => {
    try {
      const fileToBase64 = async (
        file: File | FileList | string
      ): Promise<string | null> => {
        // If already base64 string, return it
        if (typeof file === "string" && file.startsWith("data:")) return file;

        // Handle FileList
        const actualFile = file instanceof FileList ? file[0] : file;
        if (!(actualFile instanceof File)) return null;

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(actualFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      // Prepare files - handles both initial submit and edit cases
      const [resumeBase64, coverLetterBase64] = await Promise.all([
        fileToBase64(data.resume),
        fileToBase64(data.cover_letter),
      ]);
      const payload = {
        ...data,
        resume: resumeBase64,
        cover_letter: coverLetterBase64,
      };

      await createJobApplication(payload).unwrap();
      toast.success("Application Submitted successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  // const jobTypeOptions = [
  //   { value: "INTERNAL", label: "Internal" },
  //   { value: "EXTERNAL", label: "External" },
  //   { value: "BOTH", label: "Both" },
  // ];

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
              <FormInput
                name='position_applied'
                label='Position'
                required
                disabled
              />
              {/* Replaced dropdown with disabled input */}
              <FormInput
                name='employment_type'
                label='Employment type'
                disabled
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormInput
                name='dob'
                label='Date of Birth'
                required
                type='date'
              />
              {/* Replaced dropdown with  input */}
              <FormInput name='phone' label='Phone' />
            </div>

            {/* <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-medium'>Referees</h3>
                <div
                  onClick={() => append({ name: "", email: "" })}
                  className='text-primary-500 cursor-pointer hover:text-primary-700'
                >
                  + Add Referee
                </div>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <h5>Referee {index + 1}</h5>
                    {index > 0 && (
                      <button
                        type='button'
                        onClick={() => remove(index)}
                        className='text-red-500 hover:text-red-700 text-sm'
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <FormInput
                      name={`referees.${index}.name`}
                      label='Name'
                      control={form.control}
                      rules={{ required: "Name is required" }}
                    />
                    <FormInput
                      name={`referees.${index}.email`}
                      label='Email'
                      type='email'
                      control={form.control}
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      }}
                    />
                  </div>
                </div>
              ))}
            </div> */}
            <FormTextArea name='application_notes' label='Note' />
            <div className='grid grid-cols-2 gap-4'>
              <FileUpload name='resume' label='Upload Resume' />
              <FileUpload name='cover_letter' label='Upload Cover Letter' />
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                type='button'
                className='bg-alternate text-primary'
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
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
