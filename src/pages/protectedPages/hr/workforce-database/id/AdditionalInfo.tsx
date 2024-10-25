import DescriptionCard from "components/shared/DescriptionCard";
import { Separator } from "components/ui/separator";
import { WorkforceResults } from "definations/hr-types/workforce";

const AdditionalInfo = ({ data }: { data: WorkforceResults }) => {
  return (
    <div className="card-wrapper space-y-10">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 lg:grid-cols-2">
        <DescriptionCard
          label="Department/Unit"
          description={data?.department?.name}
        />
        <DescriptionCard
          label="Date of Birth"
          description={data?.date_of_birth}
        />
        <DescriptionCard label="Religion" description={data?.religion} />
        <DescriptionCard
          label="Marital Status"
          description={data?.marital_status}
        />
      </div>

      <div className="card-wrapper space-y-8">
        <h4 className="text-red-500 text-lg font-medium">
          Emergency Contact One
        </h4>
        <Separator />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DescriptionCard
            label="Name"
            description={data?.emergency_contact_one?.name}
          />
          <DescriptionCard
            label="Relationship"
            description={data?.emergency_contact_one?.relationship}
          />
          <DescriptionCard
            label="Email"
            description={data?.emergency_contact_one?.email}
          />
          <DescriptionCard
            label="Address"
            description={data?.emergency_contact_one?.address}
          />
          <DescriptionCard
            label="Phone Number"
            description={data?.emergency_contact_one?.phone_number_1}
          />
          <DescriptionCard
            label="Other Number"
            description={data?.emergency_contact_one?.phone_number_2}
          />
        </div>
      </div>

      <div className="card-wrapper space-y-8">
        <h4 className="text-red-500 text-lg font-medium">
          Emergency Contact Two
        </h4>
        <Separator />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DescriptionCard
            label="Name"
            description={data?.emergency_contact_two?.name}
          />
          <DescriptionCard
            label="Relationship"
            description={data?.emergency_contact_two?.relationship}
          />
          <DescriptionCard
            label="Email"
            description={data?.emergency_contact_two?.email}
          />
          <DescriptionCard
            label="Address"
            description={data?.emergency_contact_two?.address}
          />
          <DescriptionCard
            label="Phone Number"
            description={data?.emergency_contact_two?.phone_number_1}
          />
          <DescriptionCard
            label="Other Number"
            description={data?.emergency_contact_two?.phone_number_2}
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
