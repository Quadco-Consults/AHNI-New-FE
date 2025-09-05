"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { ProjectDocumentSchema } from "definations/project-validator";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetAllDocumentTypes } from "@/features/modules/controllers/project/documentTypeController";
import { Input } from "@/components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { z } from "zod";
import { LoadingSpinner } from "@/components/Loading";
import { ProjectDocumentTypesResultsData } from "definations/project-types/project-document-types";
import { toast } from "sonner";
import FormButton from "components/atoms/FormButton";
import { useCreateProjectDocument } from "../../controllers";
// import { useCreateProjectDocumentController } from "@/features/project/documentController";

const ProjectDetailsUploadModal = () => {
  const [locationValue, setLocationValue] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const projectID = localStorage.getItem("projectDetailID");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleLocation = (value: string) => {
    setLocationValue(value);
  };

  const { projectDocumentController, isLoading } = useCreateProjectDocument();

  // const documentTypesControllerResults = useGetProjectDocumentTypes(
  //     useMemo(
  //         () => ({
  //             params: {
  //                 // fields: "id,name",
  //                 no_paginate: false,
  //                 // page_size: pagination.pageSize,
  //                 // page: pagination.pageIndex + 1,
  //             },
  //         }),
  //         []
  //     )
  // );

  // const documentTypesData = documentTypesControllerResults?.data?.results;

  const form = useForm<z.infer<typeof ProjectDocumentSchema>>({
    defaultValues: {
      project: projectID as string,
      // document: null as any,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: any) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("title", locationValue);
    formData.append("project", data?.project);

    try {
      // await projectDocumentController(formData) ;
      toast.success("Document upload successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    localStorage.removeItem("projectDetailID");
  };

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          {/* <Select onValueChange={handleLocation}>
                        <SelectTrigger>
                            <SelectValue placeholder="Document type" />
                        </SelectTrigger>

                        <SelectContent>
                            {documentTypesControllerResults?.isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                documentTypesData?.map(
                                    (doc: ProjectDocumentTypesResultsData) => (
                                        <SelectItem
                                            key={doc?.id}
                                            value={doc.name}
                                        >
                                            {doc.name}
                                        </SelectItem>
                                    )
                                )
                            )}
                        </SelectContent>
                    </Select> */}

          <div className='w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center'>
            <UploadFile size={20} />
            <div>
              <Input
                type='file'
                onChange={handleFileChange}
                className='bg-inherit border-none cursor-pointer '
              />
            </div>
          </div>

          <div className='flex justify-between gap-5 mt-10'>
            <Button
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
            >
              Cancel
            </Button>
            <FormButton loading={isLoading} disabled={isLoading} type='submit'>
              Done
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectDetailsUploadModal;
