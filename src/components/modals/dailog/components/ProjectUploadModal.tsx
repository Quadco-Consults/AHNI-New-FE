import FileUpload from "atoms/FileUpload";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { ProjectDocumentSchema } from "definations/validator";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import projectsAPi from "services/projectsApi";
import { z } from "zod";

const ProjectUploadModal = () => {
  const { data } = projectsAPi.useGetProjectsQuery(
    useMemo(
      () => ({
        params: {
          // fields: "id, logo, name, state",
          // page_size: pagination.pageSize,
          // page: pagination.pageIndex + 1,
        },
      }),
      []
    )
  );
  const form = useForm<z.infer<typeof ProjectDocumentSchema>>({
    defaultValues: {
      title: "",
      // document: FileList,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    const formData = new FormData();
    // const file = data?.file[0];
    // const blob = new Blob([file], { type: file?.type });
    formData.append("file", data?.file[0]);
    console.log(formData);
    console.table(">>>>>>>>>>>>>>>>", data);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormInput name="name" label="Name of Document" />

          <FileUpload />
        </form>
      </Form>

      <div className="flex justify-between gap-5 mt-16">
        <Button type="button" className="bg-[#FFF2F2] text-primary ">
          Cancel
        </Button>
        <FormButton>Done</FormButton>
      </div>
    </div>
  );
};

export default ProjectUploadModal;
