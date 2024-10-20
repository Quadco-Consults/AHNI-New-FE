import DescriptionCard from "components/shared/DescriptionCard";
import { Separator } from "components/ui/separator";

const AdditionalInfo = () => {
  return (
    <div className="card-wrapper space-y-10">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:grid-cols-2">
        <DescriptionCard
          label="Department/Unit"
          description="Operations and Programs Management Unit"
        />
        <DescriptionCard label="Tel. Ext." description="+2348061234567" />
        <DescriptionCard label="Project Name" description="ACEBAY Project" />
        <DescriptionCard label="Type" description="---" />
        <DescriptionCard label="Status" description="---" />
        <DescriptionCard label="Do you have a Computer?" description="Yes" />
        <DescriptionCard
          label="Do you require Email access?"
          description="No"
        />
      </div>

      <div className="card-wrapper space-y-8">
        <h4 className="text-red-500 text-lg font-medium">
          Group Membership & Location
        </h4>
        <Separator />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DescriptionCard label="Group Membership" description="---" />
          <DescriptionCard label="Location" description="----" />
        </div>
      </div>

      <div className="card-wrapper space-y-6">
        <h4 className="text-red-500 text-lg font-medium">
          System Analyst Authorization
        </h4>
        <Separator />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <DescriptionCard
            label="User Login Name"
            description="gadebayo_AHNI."
          />
          <DescriptionCard
            label="Computer Name (Only if previously granted)"
            description="---"
          />
          <DescriptionCard
            label="User Login Name"
            description="gadebayo_AHNI."
          />
          <DescriptionCard
            label="E-mail MailBox Alias (only if previously approved)"
            description=""
          />
          <DescriptionCard label="Training Completed" description="Yes" />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
