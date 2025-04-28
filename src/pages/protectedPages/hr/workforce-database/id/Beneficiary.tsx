import DescriptionCard from "components/shared/DescriptionCard";
import { LoadingSpinner } from "components/shared/Loading";
import { Separator } from "components/ui/separator";
import { useGetHrBeneficiariesQuery } from "services/hrApi/hr-beneficiary";

const Beneficiary = () => {
  const { data, isLoading } = useGetHrBeneficiariesQuery({});

  const primaryBeneficiaries = data?.results?.filter(
    (beneficiary) => beneficiary.beneficiary_type === "primary"
  );
  const contingentBeneficiaries = data?.results?.filter(
    (beneficiary) => beneficiary.beneficiary_type === "contingent"
  );

  return (
    <div className="space-y-6">
      {isLoading && <LoadingSpinner />}
      <div className="card-wrapper space-y-6">
        <h4 className="text-red-500 text-lg font-medium">
          Primary Beneficiary(ies)
        </h4>
        <Separator />
        {primaryBeneficiaries?.map((beneficiary) => (
          <div
            key={beneficiary?.id}
            className="grid grid-cols-1 card-wrapper border-yellow-500 items-center gap-5 md:grid-cols-2 lg:grid-cols-2"
          >
            <DescriptionCard
              label="Beneficiary Names (Last, First)"
              description={beneficiary?.name}
            />
            <DescriptionCard
              label="% of Benefit"
              description={`${beneficiary?.percentage}%`}
            />
            <DescriptionCard
              label="Relationship with Employee"
              description={beneficiary?.relationship}
            />
            <DescriptionCard
              label="Phone Number"
              description={beneficiary?.phone_number}
            />
          </div>
        ))}
      </div>

      <Separator />
      <div className="card-wrapper space-y-6">
        <h4 className="text-red-500 text-lg font-medium">
          Contingent Beneficiary
        </h4>
        <Separator />
        {contingentBeneficiaries?.map((beneficiary) => (
          <div
            key={beneficiary?.id}
            className="card-wrapper space-y-6 border-yellow-500"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <DescriptionCard
                  label="Contingent Beneficiary Names (Last, First)"
                  description={beneficiary?.name}
                />
                <DescriptionCard
                  label="Phone Number"
                  description={beneficiary?.phone_number}
                />
              </div>
              <div className="space-y-6">
                <DescriptionCard
                  label="Relationship with employee"
                  description={beneficiary?.relationship}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Beneficiary;
