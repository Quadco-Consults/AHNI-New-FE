import UserIcon from "components/icons/UserIcon";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import GoBack from "components/shared/GoBack";
import PdfContent from "components/shared/PdfContent";
import { Button } from "components/ui/button";

const SubmittedApplicationDetail = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <GoBack />
        <Button>
          <UserIcon /> Shortlist Applicant
        </Button>
      </div>
      <Card className="space-y-8">
        <h4 className="text-lg font-medium">James Septimus</h4>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="space-y-4">
            <h4 className="font-medium">Referee 1</h4>
            <DescriptionCard aside label="Name" description="Craig Torff" />
            <DescriptionCard
              aside
              label="Email"
              description="craigtorff@gmail.com"
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Referee 2</h4>
            <DescriptionCard aside label="Name" description="Craig Torff" />
            <DescriptionCard
              aside
              label="Email"
              description="craigtorff@gmail.com"
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Referee 3</h4>
            <DescriptionCard aside label="Name" description="Craig Torff" />
            <DescriptionCard
              aside
              label="Email"
              description="craigtorff@gmail.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <PdfContent />
        </div>
      </Card>
    </div>
  );
};

export default SubmittedApplicationDetail;
