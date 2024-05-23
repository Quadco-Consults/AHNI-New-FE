import successProcess from "assets/imgs/successful.png";
import { Button } from "components/ui/button";
import { RouteEnum } from "constants/RouterConstants";
import { useAppDispatch } from "hooks/useStore";
import { useNavigate } from "react-router-dom";
import { closeDialog } from "store/ui";

const SuccessModal = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCloseDailog = () => {
    navigate(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);

    dispatch(closeDialog());
  };

  return (
    <div className="text-center space-y-5">
      <img className="mx-auto" src={successProcess} alt="success" width={150} />
      <h4>supervision plan have been successfully created.</h4>

      <Button onClick={handleCloseDailog}>Back to SSP</Button>
    </div>
  );
};

export default SuccessModal;
