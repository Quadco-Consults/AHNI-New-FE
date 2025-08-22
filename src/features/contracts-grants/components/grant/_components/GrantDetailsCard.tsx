import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
// import { projectColumns } from "components/Table/columns/project/project-columns";
// import DataTable from "components/Table/DataTable";
import { IGrantSingleData } from "features/contracts-grants/types/grants";
import { useMemo } from "react";
import { formatNumberCurrency } from "utils/utls";

// const GrantDetailsCard = ({
//     award_type,
//     award_amount,
//     reference_number,
// }: IGrantSingleData) => {

const GrantDetailsCard = ({
  award_type,
  title,
  project_id,
  funding_source,
  award_reference_number,
  award_amount,
  pipeline,
  money_months_remaining,
  burn_rate,
  modifications,
}: IGrantSingleData) => {
  const CardDetails = useMemo(() => {
    return [
      {
        id: 1,
        label: "Grant Name",
        value: title || "N/A",
      },

      {
        id: 2,
        label: "Grant ID",
        value: project_id || "N/A",
      },

      {
        id: 3,
        label: "Funding Source",
        value: funding_source || "N/A",
      },

      {
        id: 4,
        label: "Award Type",
        value: award_type || "N/A",
      },

      {
        id: 5,
        label: "Award Reference Number",
        value: award_reference_number || "N/A",
      },

      {
        id: 5,
        label: "Award Amount",
        value: formatNumberCurrency(award_amount, "USD"),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='w-full bg-white px-[2.5rem] py-[1.25rem] rounded-2xl flex flex-col gap-y-[1.25rem]'>
      <h3 className='text-xl font-bold'>Grant Details</h3>
      <Card>
        <div className='grid grid-cols-3 gap-10'>
          {CardDetails.map((item, index) => (
            <DescriptionCard
              key={index}
              label={item.label}
              description={item.value}
            />
          ))}
        </div>
      </Card>

      <Card>
        <h3 className='font-semibold'>Grant Analytics</h3>
        <div className='grid grid-cols-2 gap-5 mt-5'>
          <DescriptionCard label='Pipeline' description={pipeline || "N/A"} />
          <DescriptionCard label='Burn Rate' description={burn_rate || "N/A"} />
          <DescriptionCard
            label='Money Month Remaining'
            description={money_months_remaining || "N/A"}
          />
        </div>
      </Card>

      {modifications && modifications.length > 0 && (
        <Card>
          <h3 className='font-semibold'>Modifications</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
            {modifications.map((mod: any) => (
              <div
                key={mod.id}
                className='border rounded-lg p-4 space-y-2 bg-gray-50'
              >
                <h4 className='font-bold text-base'>{mod.title}</h4>
                <p className='text-sm text-gray-600'>
                  Description: {mod.description}
                </p>
                <p className='text-sm'>
                  Amount: {formatNumberCurrency(mod.amount, "USD")}
                </p>
                <p className='text-xs text-gray-400'>Date: {mod.date}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default GrantDetailsCard;
