"use client";

import "@/utils/polyfills";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "components/atoms/FileUpload";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
// import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
// import { HrRoutes } from "constants/RouterConstants";
import { jobApplicationSchema } from "features/hr/types/hr-validator";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useGetJobAdvertisement } from "@/features/hr/controllers/jobAdvertisementController";
import { useCreateJobApplication } from "@/features/hr/controllers/hrJobApplicationsController";
import { toast } from "sonner";
import { z } from "zod";
export type TFormValues = z.infer<typeof jobApplicationSchema>;

const ApplicationForm = () => {
  const params = useParams();
  const id = params?.id as string;

  const { createJobApplication, isLoading } =
    useCreateJobApplication();
  const { data: adDetails } = useGetJobAdvertisement(id);
  const router = useRouter();

  const form = useForm<TFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      applicant_first_name: "",
      applicant_last_name: "",
      applicant_middle_name: "",
      applicant_email: "",
      application_notes: "",
      cover_letter: "",
      employment_type: "INTERNAL",
      advertisement: id || "",
      interview_date: "",
      position_applied: "",
      referees: [{ name: "Kelu", email: "grjshs@gmail.com" }], // we need to sort the refferee requirements
      resume: null,
      status: "applied",
    },
  });

  const tramp = form.getValues();
  console.log({ tramp });

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
    console.log({ data, cram: "rengoku" });

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

      await createJobApplication(payload);
      toast.success("Application Submitted successfully");
      router.back();
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
              <FormInput
                name='applicant_first_name'
                label='First Name'
                required
              />
              <FormInput
                name='applicant_middle_name'
                label='Middle Name'
                required
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <FormInput
                name='applicant_last_name'
                label=' Last Name'
                required
              />
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
                onClick={() => router.back()}
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
