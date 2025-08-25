"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { closeDialog } from "store/ui";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
// import { useCreateProjectDocumentController } from "@/features/project/documentController";
import { useSearchParams } from "next/navigation";
import FormSelect from "@/components/FormSelect";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useGetAllDocumentType } from "@/features/modules/controllers/project/document-types";
import {
  ProjectDocumentSchema,
  TProjectDocumentFormValues,
} from "features/projects/types/project/document";
import { useCreateProjectDocument } from "../../controllers";
import { useGetAllDocumentTypes } from "@/features/modules/controllers";

const ProjectUploadModal = () => {
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();

  const { createProjectDocument, isLoading } = useCreateProjectDocument();

  const { data: documentTypes } = useGetAllDocumentTypes({
    page: 1,
    size: 2000000,
  });

  const documentTypeOptions = documentTypes?.data.results.map((doc) => ({
    label: doc.name,
    value: doc.id,
  }));

  const form = useForm<TProjectDocumentFormValues>({
    resolver: zodResolver(ProjectDocumentSchema),
    defaultValues: {
      title: "",
      document_type: "",
      file: "",
    },
  });

  const { dialogProps } = useAppSelector((state) => state.ui.dailog);

  const projectId = dialogProps?.projectId as string;

  const { handleSubmit, setValue } = form;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setValue("file", event.target.files[0].name);
    }
  };

  const onSubmit: SubmitHandler<TProjectDocumentFormValues> = async (data) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("file", file);
    formData.append("document_type", data.document_type);
    formData.append("project", projectId);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      await createProjectDocument(formData);
      toast.success("Document upload successfully.");
      dispatch(closeDialog());
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
    }

    setFile(null);
  };
  console.log({ form: form.getValues() });

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <FormInput
            name='title'
            label='Document Title'
            placeholder='Enter Document Title'
            required
          />

          <FormSelect
            label='Document Type'
            name='document_type'
            placeholder='Select Document Type'
            required
            options={documentTypeOptions}
          />

          <div>
            <div className='w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center'>
              <UploadFile size={20} />
              <Input
                type='file'
                onChange={handleFileChange}
                className='bg-inherit border-none cursor-pointer '
              />
            </div>

            <FormInput type='hidden' name='file' />
          </div>

          <div className='flex justify-between gap-5 mt-10'>
            <Button
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              onClick={() => dispatch(closeDialog())}
            >
              Cancel
            </Button>
            <FormButton loading={isLoading} disabled={isLoading} type='submit'>
              Upload
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectUploadModal;
