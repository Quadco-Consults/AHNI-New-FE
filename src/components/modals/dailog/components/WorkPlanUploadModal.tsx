import { Button } from "components/ui/button";
import { FormEvent, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { LoadingSpinner } from "components/shared/Loading";
import WorkPlanAPi from "services/programsApi/work-plan";
import projectsAPi from "services/projectsApi/projectsApi";
import partnersAPi from "services/projectsApi/partnersApi";
import { ProjectsResultsData } from "definations/project-types/projects";
import { Label } from "components/ui/label";
import { PartnerResultsData } from "definations/project-types/partners";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";

const WorkPlanUploadModal = () => {
  const [partnerValue, setPartnerValue] = useState("");
  const [projectValue, setProjectValue] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handlePartnerValue = (value: string) => {
    setPartnerValue(value);
  };
  const handleProjectValue = (value: string) => {
    setProjectValue(value);
  };

  const projectsQueryResult = projectsAPi.useGetProjectsQuery(
    useMemo(
      () => ({
        params: {
          // fields: "id,name",
          no_paginate: true,
          // page_size: pagination.pageSize,
          // page: pagination.pageIndex + 1,
        },
      }),
      []
    )
  );
  const partnersQueryResult = partnersAPi.useGetPartnersQuery(
    useMemo(
      () => ({
        params: {
          // fields: "id,name",
          no_paginate: true,
          // page_size: pagination.pageSize,
          // page: pagination.pageIndex + 1,
        },
      }),
      []
    )
  );

  const projects = projectsQueryResult?.data?.results;

  const partners = partnersQueryResult?.data?.results;

  const [createWorkPlanMutation, { isLoading }] =
    WorkPlanAPi.useCreateWorkPlanDocumentMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("partner_id", partnerValue);
    formData.append("project_id", projectValue);
    formData.append("file", file);

    try {
      await createWorkPlanMutation(formData).unwrap();
      toast.success("Document upload successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setPartnerValue("");
    setProjectValue("");
    setFile(null);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label>
            Name of Project Partner <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={handlePartnerValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select project partner" />
            </SelectTrigger>
            <SelectContent>
              {partnersQueryResult?.isLoading ? (
                <LoadingSpinner />
              ) : (
                partners?.map((doc: PartnerResultsData) => (
                  <SelectItem key={doc?.id} value={doc.id}>
                    {doc.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Name of Project <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={handleProjectValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projectsQueryResult?.isLoading ? (
                <LoadingSpinner />
              ) : (
                projects?.map((doc: ProjectsResultsData) => (
                  <SelectItem key={doc?.id} value={doc.id}>
                    {doc.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
          <UploadFile size={20} />
          <div>
            <Input
              type="file"
              onChange={handleFileChange}
              className="bg-inherit border-none cursor-pointer "
            />
          </div>
        </div>

        <div className="flex justify-between gap-5 mt-16">
          <Button type="button" className="bg-[#FFF2F2] text-primary ">
            Cancel
          </Button>
          <FormButton loading={isLoading} type="submit" disabled={isLoading}>
            Done
          </FormButton>
        </div>
      </form>
    </div>
  );
};

export default WorkPlanUploadModal;
