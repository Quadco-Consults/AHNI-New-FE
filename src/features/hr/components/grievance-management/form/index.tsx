"use client";

// import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";

import GoBack from "components/GoBack";

import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
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
    defaultValues: {},
  });

  const options = ["Complaint", "Whistleblowing"].map((option) => ({
    label: option,
    value: option,
  }));

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
      const formData = new FormData();
      formData.append("type", data.title); // Map title selection to type field
      formData.append("title", data.title); // Also keep title for display
      formData.append("description", data.description);
      formData.append("whistle_blower", "Anonymous"); // Set default whistle_blower
      if (data.date) formData.append("date", data.date);
      
      // Handle document upload - only if a file is actually selected
      console.log("Document data:", {
        document: data.document,
        documentLength: data.document?.length,
        documentName: data.document_name,
        isFile: data.document?.[0] instanceof File
      });
      
      if (data.document && data.document.length > 0 && data.document[0] instanceof File) {
        // File is selected, include both document and document_name
        formData.append("document", data.document[0]);
        formData.append("document_name", data.document_name || data.document[0].name);
        console.log("Document attached:", data.document[0].name, data.document[0].type);
      } else {
        // No file selected, don't send document fields at all
        console.log("No document selected - skipping document fields");
      }
      
      console.log("Submitting form data:", Object.fromEntries(formData));
      console.log("Raw FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const result = await createGrievance(formData);
      console.log("API Response:", result);
      toast.success("Complaint Submitted Successfully!");
      
      // Add small delay before redirect to ensure data is saved
      setTimeout(() => {
        router.push(HrRoutes.GRIEVANCE_MANAGEMENT);
      }, 1000);
    } catch (error: any) {
      console.error("Submission error:", error);
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
                <FormSelect label='Title' name='title' required>
                  <SelectContent>
                    {options?.map((title) => (
                      <SelectItem key={title.label} value={title.value}>
                        {title.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormSelect>
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
