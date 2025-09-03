"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "components/atoms/FileUpload";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Form } from "components/ui/form";
import { HrRoutes } from "constants/RouterConstants";
import { jobAdvertismentSchema } from "features/hr/types/hr-validator";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateJobAdvertisement } from "@/features/hr/controllers/jobAdvertisementController";
import { toast } from "sonner";
import { z } from "zod";

export type TFormValues = z.infer<typeof jobAdvertismentSchema>;

const AddEditAdvertisement = () => {
  const router = useRouter();

  const { createJobAdvertisement, isLoading: isCreatingLoading } =
    useCreateJobAdvertisement();

  const form = useForm<TFormValues>({
    resolver: zodResolver(jobAdvertismentSchema),
    defaultValues: {
      title: "",
      grade_level: "",
      locations: "",
      job_type: "Internal",
      duration: "",
      commencement_date: "",
      number_of_positions: 1,
      any_other_info: "",
      background: "",
      advert_document: null,
    },
  });


  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<TFormValues> = async (data: TFormValues) => {
    try {
      // Convert form data to the expected format, excluding interviewers and supervisor
      const { interviewers, supervisor, ...cleanData } = data;
      const submitData = {
        ...cleanData,
        commencement_date: new Date(cleanData.commencement_date),
        advert_document: data.advert_document?.[0] || null,
      };

      await createJobAdvertisement(submitData);
      toast.success("Job advertisement created successfully");
      router.push(HrRoutes.ADVERTISEMENT);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const jobTypeOptions = [
    { value: "Internal", label: "Internal" },
    { value: "External", label: "External" },
    { value: "Both", label: "Both" },
  ];

  const isLoading = false;
  const isSubmitting = isCreatingLoading;

  return (
    <div className='space-y-4'>
      <GoBack />
      <Card>
        {isLoading ? (
          <div className='p-6 text-center'>Loading data...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <h4 className='font-medium text-lg pb-4'>
                Initiate New Advertisement
              </h4>

              <FormInput name='title' label='Position' required />
              <FormInput name='grade_level' label='Grade Level' required />
              <FormInput name='locations' label='Locations' required />
              <FormSelect
                name='job_type'
                label='Advert Status'
                placeholder='Select Project'
                options={jobTypeOptions}
              />
              <FormInput
                name='duration'
                label='Duration (Weeks)'
                placeholder='Example: 9 months'
                required
              />
              <FormInput
                name='commencement_date'
                label='Expiry Date'
                required
                type='date'
              />
              <FormInput
                name='number_of_positions'
                label='Number Required'
                required
                type='number'
              />

              {/* <FormInput name='any_other_info' label='Info' /> */}
              <FormTextArea name='background' label='Background' required />
              <FileUpload
                name='advert_document'
                label="Upload Complete Advertisement Document"
              />

              <div className='flex justify-end'>
                <FormButton loading={isSubmitting} disabled={isSubmitting}>
                  Create
                </FormButton>
              </div>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default AddEditAdvertisement;
