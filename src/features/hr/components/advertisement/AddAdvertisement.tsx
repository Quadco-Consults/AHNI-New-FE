import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "components/atoms/FileUpload";
import FormButton from "components/atoms/FormButton";
import FormInput from "components/atoms/FormInput";
import FormMultiSelect from "components/atoms/FormMultiSelect";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Form } from "components/ui/form";
import { HrRoutes } from "constants/RouterConstants";
import { jobAdvertismentSchema } from "features/hr/types/hr-validator";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } 
import {
  useCreateJobAdvertisement,
  useUpdateJobAdvertisement,
} from "@/features/hr/controllers/jobAdvertisementControllerController";
import { useGetUsers } from "@/features/usersAPI";
import { toast } from "sonner";
import { z } from "zod";

export type TFormValues = z.infer<typeof jobAdvertismentSchema>;

const AddEditAdvertisement = () => {
  // Get router state which may contain advertisement data
  const pathname = usePathname();
  const router = useRouter();

  // Check if we're in edit mode
  const isEditMode = location.state?.isEditing || false;

  // Get advertisement data from state if available
  const advertisementData = location.state?.advertisementData || null;

  const { data: interviewers, isLoading: isGettingUsers } = useGetUsers();

  const { createJobAdvertisement, isLoading: isCreatingLoading } =
    useCreateJobAdvertisement();

  const { updateJobAdvertisement, isLoading: isUpdatingLoading } =
    useUpdateJobAdvertisement();

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
      supervisor: "",
      any_other_info: "",
      background: "",
      interviewers: [],
      advert_document: null,
    },
  });

  // Populate form when advertisement data is available in edit mode
  useEffect(() => {
    if (isEditMode && advertisementData) {
      const ad = advertisementData;

      // Format the date to YYYY-MM-DD for the date input
      const formattedDate = ad.commencement_date
        ? new Date(ad.commencement_date).toISOString().split("T")[0]
        : "";

      // Get interviewer IDs
      const interviewerIds = ad.interviewers
        ? ad.interviewers.map((interviewer) => interviewer.id)
        : [];

      // Set form values from the data passed via state
      form.reset({
        title: ad.title || "",
        grade_level: ad.grade_level || "",
        locations: ad.locations || "",
        job_type: ad.job_type || "Internal",
        duration: ad.duration || "",
        commencement_date: formattedDate,
        number_of_positions: ad.number_of_positions || 1,
        supervisor: ad.supervisor || "",
        any_other_info: ad.any_other_info || "",
        background: ad.background || "",
        interviewers: interviewerIds,
        advert_document: null, // Can't pre-fill file inputs
      });
    }
  }, [isEditMode, advertisementData, form]);

  const { handleSubmit, getValues } = form;
  const values = getValues();
  console.log({ values, advertisementData, interviewers });

  const onSubmit: SubmitHandler<TFormValues> = async (data: any) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        // Handle file upload
        if (key === "advert_document") {
          // Only append file if a new one was selected
          if (value && value.length) {
            formData.append(key, value[0]);
          } else if (!isEditMode) {
            // In create mode, document is required
            formData.append(key, value);
          }
          // In edit mode, if no new file, don't append to keep the existing file
        }
        // Handle interviewers array
        else if (key === "interviewers" && Array.isArray(value)) {
          value.forEach((uuid) => {
            formData.append(key, uuid);
          });
        }
        // Handle all other fields
        else {
          formData.append(key, value);
        }
      });

      if (isEditMode) {
        // Update existing advertisement
        await updateJobAdvertisement({
          id: advertisementData.id,
          body: formData,
        })();
        toast.success("Job advertisement updated successfully");
      } else {
        // Create new advertisement
        await createJobAdvertisement(formData)();
        toast.success("Job advertisement created successfully");
      }

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

  const interviewersOption =
    interviewers?.data?.results?.map((el) => ({
      value: el?.id,
      label: `${el?.first_name} ${el?.last_name}`,
    })) || [];

  const isLoading = isGettingUsers;
  const isSubmitting = isCreatingLoading || isUpdatingLoading;

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
                {isEditMode
                  ? "Edit Advertisement"
                  : "Initiate New Advertisement"}
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

              <FormMultiSelect
                name='interviewers'
                label='Interviewers'
                required
                placeholder='Select interviewers'
                options={interviewersOption}
              />

              <FormSelect
                name='supervisor'
                label='Supervisor'
                placeholder='Select supervisor'
                options={interviewersOption}
              />
              {/* <FormInput name='any_other_info' label='Info' /> */}
              <FormTextArea name='background' label='Background' required />
              <FileUpload
                name='advert_document'
                label={
                  isEditMode
                    ? "Upload New Advertisement Document (leave empty to keep current)"
                    : "Upload Complete Advertisement Document"
                }
                required={!isEditMode}
              />

              <div className='flex justify-end'>
                <FormButton loading={isSubmitting} disabled={isSubmitting}>
                  {isEditMode ? "Update" : "Create"}
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
