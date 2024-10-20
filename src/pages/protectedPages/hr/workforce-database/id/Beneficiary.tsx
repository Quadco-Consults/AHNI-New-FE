import DescriptionCard from "components/shared/DescriptionCard";
import { Separator } from "components/ui/separator";

const Beneficiary = () => {
  return (
    <div className="space-y-6">
      <div className="card-wrapper space-y-6">
        <h4 className="text-red-500 text-lg font-medium">
          Primary Beneficiary(ies)
        </h4>
        <Separator />
        <div className="grid grid-cols-1 card-wrapper border-yellow-500 items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
          <DescriptionCard
            label="Beneficiary Names (Last, First)"
            description="Adebayo Grace"
          />
          <DescriptionCard label="% of Benefit" description="50%" />
          <DescriptionCard
            label="Relationship with Employee"
            description="Spouse"
          />
          <DescriptionCard label="Phone Number" description="08039876543" />
        </div>
        <div className="grid grid-cols-1 card-wrapper border-yellow-500 items-center gap-5 md:grid-cols-2 lg:grid-cols-2">
          <DescriptionCard
            label="Beneficiary Names (Last, First)"
            description="Adebayo Grace"
          />
          <DescriptionCard label="% of Benefit" description="20%" />
          <DescriptionCard
            label="Relationship with Employee"
            description="Spouse"
          />
          <DescriptionCard label="Phone Number" description="08039876543" />
        </div>
      </div>

      <Separator />
      <div className="card-wrapper space-y-6">
        <h4 className="text-red-500 text-lg font-medium">
          Contingent Beneficiary
        </h4>
        <Separator />
        <div className="card-wrapper space-y-6 border-yellow-500">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <DescriptionCard
                label="Contingent Beneficiary Names (Last, First)"
                description="Adebayo Grace"
              />
              <DescriptionCard label="Phone Number" description="08039876543" />
            </div>
            <div className="space-y-6">
              <DescriptionCard
                label="Relationship with employee"
                description="Brother"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beneficiary;
