import LongArrowLeft from "components/icons/LongArrowLeft";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ProjectLayout from "./ProjectLayout";
import { Form } from "components/ui/form";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import FormButton from "atoms/FormButton";
import FileUpload from "atoms/FileUpload";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { useAppDispatch } from "hooks/useStore";
import { RouteEnum } from "constants/RouterConstants";
import projectDocumentAPi from "services/project-document";
import { useMemo } from "react";
import { Loading } from "components/shared/Loading";

const Uploads = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const projectDocumentsQueryResult =
    projectDocumentAPi.useGetProjectDocumentsQuery(
      useMemo(
        () => ({
          params: {
            // fields: "id,name",
            no_paginate: false,
            // page_size: pagination.pageSize,
            // page: pagination.pageIndex + 1,
          },
        }),
        []
      )
    );

  const projectDocumentsData = projectDocumentsQueryResult?.data?.results;

  const goBack = () => {
    navigate(-1);
  };

  const form = useForm();

  const { handleSubmit } = form;

  const onSubmit = () => {
    sessionStorage.removeItem("projectsCompletedSteps");
    navigate(RouteEnum.PROJECTS);
  };

  return (
    <div className="space-y-6 min-h-screen">
      <button
        onClick={goBack}
        className="w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <ProjectLayout>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="space-y-6 py-5">
              <h4 className="text-lg font-semibold">Uploads</h4>

              {projectDocumentsQueryResult?.isLoading ? (
                <Loading />
              ) : (
                <div className="flex items-center flex-wrap flex-grow gap-5">
                  {projectDocumentsData?.map((doc) => (
                    <div key={doc.id}>{doc.title}</div>
                  ))}

                  <Button
                    className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500"
                    type="button"
                    onClick={() => {
                      dispatch(
                        openDialog({
                          type: DialogType.ProjectUploadModal,
                          dialogProps: {
                            header: "Upload New Document",
                            width: "max-w-md",
                          },
                        })
                      );
                    }}
                  >
                    <AddSquareIcon />
                    Upload New Document
                  </Button>
                </div>
              )}
            </Card>
            <div className="flex justify-between gap-5 mt-10">
              <Button
                onClick={goBack}
                type="button"
                className="bg-[#FFF2F2] text-primary "
              >
                Previous
              </Button>
              <FormButton>Finish</FormButton>
            </div>
          </form>
        </Form>
      </ProjectLayout>
    </div>
  );
};

export default Uploads;
