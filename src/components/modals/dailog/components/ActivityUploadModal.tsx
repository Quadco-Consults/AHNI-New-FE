import { Button } from "components/ui/button";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
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
import projectsAPi from "services/projectsApi/projectsApi";
import { ProjectsResultsData } from "definations/project-types/projects";
import { Label } from "components/ui/label";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";
import WeeklyActivityAPI from "services/programsApi/weekly-activity";

const ActivityUploadModal = () => {
  const [projectID, setProjectID] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleProjectID = (value: string) => {
    setProjectID(value);
  };

  const projectsQueryResult = projectsAPi.useGetProjectsParamsQuery(
    useMemo(
      () => ({
        params: {
          no_paginate: true,
        },
      }),
      []
    )
  );

  const projects = projectsQueryResult?.data;

  const [uploadWeeklyActivityMutation, { isLoading }] =
    WeeklyActivityAPI.useUploadWeeklyActivityMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadWeeklyActivityMutation({
        path: { id: projectID },
        body: formData,
      }).unwrap();
      toast.success("Document upload successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setProjectID("");
    setFile(null);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-2">
          <Label>
            Name of Project <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={handleProjectID}>
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
          <Button
            onClick={() => dispatch(closeDialog())}
            type="button"
            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
          >
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

export default ActivityUploadModal;
