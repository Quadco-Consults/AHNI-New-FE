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
import { useCreateJobAdvertisement, useGetJobAdvertisement } from "@/features/hr/controllers/jobAdvertisementController";
import useApiManager from "@/constants/mainController";
import { useGetPositionPaginate } from "@/features/modules/controllers/config/positionController";
import { useGetAllGrades } from "@/features/modules/controllers/config/gradeController";
import { useGetLocationList } from "@/features/modules/controllers/config/locationController";
import { toast } from "sonner";
import { z } from "zod";
import React, { useMemo } from "react";
import { formatDate } from "@/utils/date";

export type TFormValues = z.infer<typeof jobAdvertismentSchema>;

const AddEditAdvertisement = () => {
  const router = useRouter();

  // Get URL params to check if we're in edit mode
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const editId = searchParams?.get('edit');
  const isEditing = !!editId;

  console.log("Edit mode:", isEditing, "Edit ID:", editId);

  // Note: keeping this for potential future use without file uploads
  // const { createJobAdvertisement, isLoading: isCreatingLoading } = useCreateJobAdvertisement();

  // File upload API manager for FormData
  const { callApi: uploadJobAdvertisement, isLoading: isUploadLoading } = useApiManager<
    any,
    Error,
    FormData
  >({
    endpoint: "/hr/jobs/advertisements/",
    queryKey: ["job-advertisements"],
    isAuth: true,
    method: "POST",
    contentType: "multipart/form-data",
  });

  // Fetch dropdown options
  const { data: positions, isLoading: positionsLoading } = useGetPositionPaginate({
    page: 1,
    size: 1000,
    search: "",
  });
  const { data: grades, isLoading: gradesLoading } = useGetAllGrades({
    page: 1,
    size: 1000,
    search: "",
  });
  const { data: locations, isLoading: locationsLoading } = useGetLocationList({
    page: 1,
    size: 1000,
    search: "",
  });

  // Fetch advertisement data if in edit mode
  const { data: editData, isLoading: editLoading } = useGetJobAdvertisement(
    editId || "",
    isEditing
  );

  console.log("Edit advertisement data:", editData);



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

  // Update form values when edit data is loaded
  React.useEffect(() => {
    if (isEditing && editData?.data && !editLoading) {
      const data = editData.data;
      console.log("Setting form values for edit:", data);

      // Ensure all values are strings, not objects
      const getStringValue = (value: any): string => {
        if (!value) return "";
        if (typeof value === "string") return value;
        if (typeof value === "object" && value.id) return String(value.id);
        if (typeof value === "object" && value.name) return String(value.name);
        return String(value);
      };

      form.reset({
        title: getStringValue(data.position),
        grade_level: getStringValue(data.grade),
        locations: getStringValue(data.locations?.[0] || data.locations),
        job_type: data.job_type || "Internal",
        duration: data.duration || "",
        commencement_date: data.commencement_date || "",
        number_of_positions: data.number_of_positions || 1,
        any_other_info: data.any_other_info || "",
        background: data.background || "",
        advert_document: null,
      });
    }
  }, [isEditing, editData, editLoading, form]);


  const { handleSubmit } = form;

  // Debug form values
  const formValues = form.watch();
  console.log("Current form values:", formValues);
  console.log("Form values types:", {
    title: typeof formValues.title,
    grade_level: typeof formValues.grade_level,
    locations: typeof formValues.locations,
  });

  const onSubmit: SubmitHandler<TFormValues> = async (data: TFormValues) => {
    try {
      // Convert form data to FormData for file upload
      const { interviewers, supervisor, ...cleanData } = data;

      const formData = new FormData();

      // Append all fields to FormData with correct field names
      formData.append("position", cleanData.title); // title field contains position ID
      formData.append("grade", cleanData.grade_level); // try "grade" instead of "grade_level"
      formData.append("locations", cleanData.locations);

      // Debug: log what we're sending
      console.log("FormData being sent:");
      console.log("position (from title field):", cleanData.title);
      console.log("grade (from grade_level field):", cleanData.grade_level);
      console.log("locations:", cleanData.locations);
      formData.append("job_type", cleanData.job_type);
      formData.append("duration", cleanData.duration);
      formData.append("commencement_date", formatDate(cleanData.commencement_date));
      formData.append("number_of_positions", cleanData.number_of_positions.toString());
      formData.append("background", cleanData.background);

      if (cleanData.any_other_info) {
        formData.append("any_other_info", cleanData.any_other_info);
      }

      // Handle file upload
      if (data.advert_document && data.advert_document[0]) {
        formData.append("advert_document", data.advert_document[0]);
      }

      console.log("Submitting FormData with file:", data.advert_document?.[0]?.name); // Debug log

      // Use the FormData API manager
      await uploadJobAdvertisement(formData);

      toast.success("Job advertisement created successfully");
      router.push(HrRoutes.ADVERTISEMENT);
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Submit error:", error);
    }
  };

  // Prepare dropdown options with fallback for different API response structures
  const positionOptions = useMemo(
    () => {
      const positionData = (positions as any)?.data?.results || positions?.results || [];
      console.log("Raw position data:", positionData);

      if (!Array.isArray(positionData)) {
        console.log("Position data is not an array:", positionData);
        return [];
      }

      const options = positionData.map((position: any) => ({
        label: String(position.name || position.title || 'Unknown'),
        value: String(position.id || ''),
      }));
      console.log("Position options:", options);
      return options;
    },
    [positions]
  );

  const gradeOptions = useMemo(
    () => {
      const gradeData = (grades as any)?.data?.results || grades?.results || [];
      console.log("Raw grade data:", gradeData);

      if (!Array.isArray(gradeData)) {
        console.log("Grade data is not an array:", gradeData);
        return [];
      }

      const options = gradeData.map((grade: any) => ({
        label: String(grade.name || 'Unknown'),
        value: String(grade.id || ''),
      }));
      console.log("Grade options:", options);
      return options;
    },
    [grades]
  );

  const locationOptions = useMemo(
    () => {
      const locationData = (locations as any)?.data?.results || locations?.results || [];
      console.log("Raw location data:", locationData);

      if (!Array.isArray(locationData)) {
        console.log("Location data is not an array:", locationData);
        return [];
      }

      const options = locationData.map((location: any) => ({
        label: String(location.name || 'Unknown'),
        value: String(location.id || ''),
      }));
      console.log("Location options:", options);
      return options;
    },
    [locations]
  );

  const jobTypeOptions = [
    { value: "Internal", label: "Internal" },
    { value: "External", label: "External" },
    { value: "Both", label: "Both" },
  ];

  const isLoading = false;
  const isSubmitting = isUploadLoading;

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

              <FormSelect
                name='title'
                label={`Position (${positionOptions.length} options)`}
                placeholder={positionsLoading ? 'Loading positions...' : 'Select Position'}
                options={positionOptions}
                required
              />
              <FormSelect
                name='grade_level'
                label={`Grade Level (${gradeOptions.length} options)`}
                placeholder={gradesLoading ? 'Loading grades...' : 'Select Grade Level'}
                options={gradeOptions}
                required
              />
              <FormSelect
                name='locations'
                label={`Location (${locationOptions.length} options)`}
                placeholder={locationsLoading ? 'Loading locations...' : 'Select Location'}
                options={locationOptions}
                required
              />
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
