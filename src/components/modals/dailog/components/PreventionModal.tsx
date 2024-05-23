import img from "assets/imgs/undraw.png";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";
import { useNavigate } from "react-router-dom";
import { closeDialog } from "store/ui";

const PreventionModal = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCloseDailog = () => {
    navigate(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);

    dispatch(closeDialog());
  };
  const handleCloseDailogs = () => {
    navigate(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION_DETAILS_APPROVAL);

    dispatch(closeDialog());
  };

  return (
    <div className="text-center space-y-5">
      <img className="mx-auto" src={img} alt="success" width={150} />
      <h4>
        You have successfully submitted the SSP evaluation, the <br />{" "}
        designated signatories will give their consent before the final <br />{" "}
        approval, this can take up to 3 working days.
      </h4>

      <div className="flex justify-between gap-5 mt-16">
        <Button onClick={handleCloseDailogs} type="button">
          View Approval Status
        </Button>

        <Button onClick={handleCloseDailog} className=" bg-yellow-600">
          Later
        </Button>
      </div>
    </div>
  );
};

export default PreventionModal;
