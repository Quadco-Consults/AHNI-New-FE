import { useNavigate } from "react-router-dom";
import SupportiveSupervisionPlanLayout from "./SupportiveSupervisionPlanLayout";
import FormButton from "atoms/FormButton";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Checklist = () => {
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAIL);
    sessionStorage.removeItem("supportiveCompletedSteps");
  };
  return (
    <SupportiveSupervisionPlanLayout>
      <div className="px-3 ">
        <h2 className="text-lg font-bold">Evaluation Checklist</h2>
        <div className="mt-10">
          <div className="flex justify-between pt-24">
            <FormButton
              onClick={() => navigate(-1)}
              preffix={<ArrowLeft size={14} />}
              type="button"
              className="bg-[#FFF2F2] text-primary "
            >
              Back
            </FormButton>

            <FormButton
              onClick={() => onSubmit()}
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
