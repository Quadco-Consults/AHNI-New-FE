import { useNavigate } from "react-router-dom";
import SupportiveSupervisionPlanLayout from "./SupportiveSupervisionPlanLayout";
import FormButton from "atoms/FormButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { openDialog } from "store/ui";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { Label } from "components/ui/label";
import { useAppDispatch } from "hooks/useStore";
import { Button } from "components/ui/button";

const Checklist = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const onSubmit = () => {
    sessionStorage.removeItem("supportiveCompletedSteps");
  };
  return (
    <SupportiveSupervisionPlanLayout>
      <div className="px-3 ">
        <h2 className="text-lg font-bold">Evaluation Checklist</h2>

        <div className="flex flex-col w-[299px] mt-10 space-y-3">
          <Label className="text-lg text-red-500">Objectives</Label>
          <Button
            type="button"
            variant="outline"
            className="text-[#DEA004]"
            onClick={() => {
              dispatch(
                openDialog({
                  type: DialogType.Checklist,
                  dialogProps: {
                    ...largeDailogScreen,
                  },
                })
              );
            }}
          >
            Click to select checklist criteria
          </Button>
        </div>
        <div className="mt-10">
          <div className="flex justify-end gap-5 pt-24">
            <FormButton
              onClick={() => navigate(-1)}
              preffix={<ArrowLeft size={14} />}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Back
            </FormButton>

            <FormButton
              onClick={() => {
                onSubmit();
                dispatch(
                  openDialog({
                    type: DialogType.SuccessModal,
                    dialogProps: {
                      width: "max-w-lg",
                    },
                  })
                );
              }}
              suffix={<ArrowRight size={14} />}
            >
              Finish
            </FormButton>
          </div>
        </div>
      </div>
    </SupportiveSupervisionPlanLayout>
  );
};

export default Checklist;
