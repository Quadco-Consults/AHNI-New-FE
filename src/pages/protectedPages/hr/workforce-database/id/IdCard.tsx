import avatar from "assets/imgs/avartar.png";
import DescriptionCard from "components/shared/DescriptionCard";
import { Button } from "components/ui/button";
import PrinterIcon from "components/icons/PrinterIcon";

const IdCard = () => {
  return (
    <div className="space-y-10">
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
    </div>
  );
};

export default IdCard;
