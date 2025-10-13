"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";

import GoBack from "components/GoBack";

import { Form } from "components/ui/form";
import { Separator } from "components/ui/separator";
import FormTextArea from "components/atoms/FormTextArea";
import { HrRoutes } from "constants/RouterConstants";

import { UploadIcon } from "lucide-react";

import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FileUpload from "components/atoms/FileUpload";
import { useCreateGrievance } from "@/features/hr/controllers/grievanceController";
import {
  GrievianceManagementSchema,
  TGrievianceManagementFormData,
} from "@/features/hr/types/grieviance-management";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// import ItemsAPI from "@/features/modules/controllers/config/itemsController";

// import PurchaseRequestAPI from "@/features/procurementApi/purchase-requestController";
// import { toast } from "sonner";
// import { z } from "zod";

const GrievanceManagementForm = () => {
  const form = useForm<TGrievianceManagementFormData>({
    resolver: zodResolver(GrievianceManagementSchema),
    defaultValues: {
      type: "",
      title: "",
      description: "",
      document_name: "",
      date: "",
    },
  });

  const options = [
    { label: "Complaint", value: "COMPLAINT" },
    { label: "Whistleblowing", value: "WHISTLEBLOWING" },
  ];

  const router = useRouter();

  const { handleSubmit } = form;

  //   const { fields, append, remove } = useFieldArray({
  //     control,
  //     name: "expenses",
  //   });

  const { createGrievance, isLoading: isCreateLoading } =
    useCreateGrievance();

  const onSubmit: SubmitHandler<TGrievianceManagementFormData> = async (
    data
  ) => {
    try {
      console.log("Form data received:", data);

      // Validate required fields
      if (!data.type) {
        toast.error("Please select a type (Complaint or Whistleblowing)");
        return;
      }

      // Create complaint without document first
      const complaintData: any = {
        type: data.type,
        title: data.title,
        description: data.description,
        whistle_blower: "Anonymous",
      };

      if (data.date) {
        complaintData.date = data.date;
      }

      console.log("Submitting complaint data:", complaintData);
      const result = await createGrievance(complaintData);
      console.log("API Response:", result);

      // TODO: If document exists, upload it separately to the uploads endpoint
      if (data.document && data.document.length > 0 && data.document[0] instanceof File) {
        console.log("Document will need to be uploaded separately:", data.document[0].name);
        // For now, just log - we'll need to create a separate upload endpoint call
      }

      toast.success("Complaint Submitted Successfully!");

      // Add small delay before redirect to ensure data is saved
      setTimeout(() => {
        router.push(HrRoutes.GRIEVANCE_MANAGEMENT);
      }, 1000);
    } catch (error: any) {
      console.error("Submission error:", error);
      console.error("Full error object:", error);
      toast.error(error?.response?.data?.message ?? error?.message ?? "Something went wrong");
    }
  };

  return (
    <div className=''>
      <GoBack />

      <div className='pt-10'>
        <h3 className='text-[18px] pb-10'>New Grievance</h3>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className='grid grid-cols-2 gap-5'>
              <div className='col-span-2'>
                <FormSelect
                  label='Type'
                  name='type'
                  placeholder='Select type'
                  required
                  options={options}
                />
              </div>

              <div className='col-span-2'>
                <FormInput label='Title' name='title' placeholder='Enter title' required />
              </div>

              <div className='col-span-2'>
                <FormTextArea label='Description' name='description' required />
              </div>

              <div className='col-span-1'>
                <FormInput label='Date' name='date' type='date' required />
              </div>
            </div>

            <FormInput
              label='Name of Document (Optional)'
              name='document_name'
              type='text'
            />

            <FileUpload name='document' label='' />

            <Separator className='my-4' />
            <div className='flex justify-end gap-2'>
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='button'
                className='flex items-center justify-center gap-2 bg-alternate text-primary'
                onClick={() => router.push(HrRoutes.GRIEVANCE_MANAGEMENT)}
              >
                Cancel
              </FormButton>
              <FormButton
                loading={isCreateLoading}
                disabled={isCreateLoading}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                <UploadIcon />
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GrievanceManagementForm;
