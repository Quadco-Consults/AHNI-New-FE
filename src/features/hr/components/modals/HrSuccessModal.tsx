import SuccessfulIcon from "components/icons/SuccessfulIcon";
import { Button } from "components/ui/button";
import { useAppSelector } from "hooks/useStore";
import { useDispatch } from "react-redux";
import { closeDialog, dailogSelector } from "store/ui";

const HrSuccessModal = () => {
  const { dialogProps } = useAppSelector(dailogSelector);
  const dispatch = useDispatch();

  const label = dialogProps?.label;
  return (
    <div className="grid place-content-center">
      <div className="flex flex-col items-center gap-y-5">
        <SuccessfulIcon />
        <p className="text-small">{label}</p>
        <Button onClick={() => dispatch(closeDialog())}>Ok</Button>
      </div>
    </div>
  );
};

export default HrSuccessModal;