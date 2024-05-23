import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
// import SuccessProcess from "assets/imgs/successful-process.png";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";

type Props = {
  onClose: () => void;
  isOpen: () => void;
};

const SuccessModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const goBack = () => {
    onClose;
    navigate(-1);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-1/3 h-[60dvh] space-y-4 flex flex-col items-center justify-center overflow-hidden p-4">
        {/* <img src={SuccessProcess} alt="" className="w-[12rem]" /> */}
        <DialogDescription>
          Your request has been submitted successfully.
        </DialogDescription>
        <Button className="w-[70%] mx-auto" onClick={goBack}>
          Back to procurment plans
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
