import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { Separator } from "components/ui/separator";
import { useGetHrBeneficiaries } from "@/features/hr/controllers/hrBeneficiaryController";

const Beneficiary = ({ id }: { id: string }) => {
  const { data, isLoading: primaryLoading } = useGetHrBeneficiaries({
    params: {
      employee: id as string,
    },
  });

  console.log("Primary beneficiaries: ", data);
  const primary = data?.data.results;

  return (
    <div className='space-y-6'>
      {primaryLoading && <LoadingSpinner />}

      <div className='card-wrapper space-y-6'>
        <h4 className='text-red-500 text-lg font-medium'>
          Primary Beneficiary(ies)
        </h4>

        <Separator />

        {primary && primary.length ? (
          primary?.map((beneficiary) => (
            <div
              key={beneficiary?.id}
              className='grid grid-cols-1 card-wrapper border-yellow-500 items-center gap-5 md:grid-cols-2 lg:grid-cols-2'
            >
              <DescriptionCard
                label='Beneficiary Names (Last, First)'
                description={beneficiary?.name}
              />
              <DescriptionCard
                label='% of Benefit'
                description={`${beneficiary?.percentage_of_benefit}%`}
              />
              <DescriptionCard
                label='Relationship with Employee'
                description={beneficiary?.relationship}
              />
              <DescriptionCard
                label='Phone Number'
                description={beneficiary?.phone_number}
              />
            </div>
          ))
        ) : (
          <h2 className='text-medium'>No Beneficiaries</h2>
        )}
      </div>

      <Separator />

      <div className='card-wrapper space-y-6'>
        <h4 className='text-red-500 text-lg font-medium'>
          Contingent Beneficiary
        </h4>

        <Separator />

        {/* {contingent?.map((beneficiary) => (
          <div
            key={beneficiary?.id}
            className='card-wrapper space-y-6 border-yellow-500'
          >
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              <div className='space-y-6'>
                <DescriptionCard
                  label='Contingent Beneficiary Names (Last, First)'
                  description={beneficiary?.name}
                />
                <DescriptionCard
                  label='Phone Number'
                  description={beneficiary?.phone_number}
                />
              </div>
              <div className='space-y-6'>
                <DescriptionCard
                  label='Relationship with employee'
                  description={beneficiary?.relationship}
                />
              </div>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Beneficiary;
