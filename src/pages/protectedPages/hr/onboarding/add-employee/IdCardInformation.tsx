import { useLocation, useNavigate } from "react-router-dom";
import EmployeeRegistrationLayout from "./EmployeeRegistrationLayout";
import avatar from "assets/imgs/avartar.png";
import DescriptionCard from "components/shared/DescriptionCard";
import { Button } from "components/ui/button";
import PrinterIcon from "components/icons/PrinterIcon";
import { ChevronRight, Save } from "lucide-react";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";

const IdCardInformation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleNext = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/salary-account-details";
    navigate(path);
  };

  const onSubmit = () => {
    dispatch(
      openDialog({
        type: DialogType.HrSuccessModal,
        dialogProps: {
          label: "Employee information saved",
        },
      })
    );
  };

  return (
    <EmployeeRegistrationLayout>
      <div className="space-y-10 max-w-4xl mx-auto">
        <div>
          <h4 className="font-semibold text-lg text-center">
            ID Card Information Form
          </h4>
          <p className="text-small text-center">
            FORMS MUST BE AND COMPLETED IN UPPER CASE
          </p>
        </div>
        <div className="card-wrapper space-y-6">
          <div className="flex items-center gap-x-4">
            <img src={avatar} alt="avatar" width={100} />
            <h4 className="font-semibold">James Septimus</h4>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-6">
              <DescriptionCard
                label="Position Title"
                description="Field Officer"
              />
              <DescriptionCard label="Phone Number" description="08039876543" />
            </div>
            <div className="space-y-6">
              <DescriptionCard
                label="Employee Number"
                description="08039876543"
              />
              <DescriptionCard label="Employee Signature" description="" />
            </div>
            <div className="space-y-6">
              <DescriptionCard
                label="Email Address"
                description="jamesseptimus@ahnigeria.org"
              />
              <DescriptionCard label="Date" description="22/09/2024" />
            </div>
          </div>
          <Button>
            <PrinterIcon /> Print Passport
          </Button>
        </div>
        <div className="flex gap-x-6 justify-end">
          <Button onClick={onSubmit} variant="outline">
            <Save size={20} /> Save
          </Button>
          <Button type="button" onClick={handleNext}>
            Next
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </EmployeeRegistrationLayout>
  );
};

export default IdCardInformation;
