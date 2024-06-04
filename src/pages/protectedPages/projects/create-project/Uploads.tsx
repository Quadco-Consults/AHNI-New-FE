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

const Uploads = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

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

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FileUpload label="Project agreement" />
                <FileUpload label="Project Narrative" />
                <FileUpload label="Project work plans" />
                <FileUpload label="Project M&E Plan" />
                <FileUpload label="Project M&E/Result framework" />
                <FileUpload label="Project sustainability plan" />
                <FileUpload label="project risk management plan" />
                <Button
                  className="flex gap-2 mt-0 py-6 bg-[#FFF2F2] text-red-500 md:mt-8"
                  type="button"
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: DialogType.ProjectUploadModal,
                        dialogProps: {
                          header: "Upload New Document",
                          width: "max-w-2xl",
                        },
                      })
                    );
                  }}
                >
                  <AddSquareIcon />
                  Upload New Document
                </Button>
              </div>
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
