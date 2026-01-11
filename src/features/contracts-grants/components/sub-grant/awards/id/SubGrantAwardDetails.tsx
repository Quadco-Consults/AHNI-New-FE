import Card from "@/components/Card";
import DescriptionCard from "@/components/DescriptionCard";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useMemo } from "react";
import { formatNumberCurrency } from "@/utils/utls";
import { useGetSingleDepartment } from "@/features/modules/controllers/config/departmentController";

const SubGrantAwardDetails = ({
  id,
  title,
  grant,
  project,
  sub_grant_administrator,
  award_type,
  technical_staff,
  business_unit,
  amount_usd,
  amount_ngn,
  start_date,
  end_date,
  submission_start_date,
  submission_end_date,
  status,
  locations,
  modifications,
}: ISubGrantSingleData) => {
  // Get business unit name
  const { data: departmentData } = useGetSingleDepartment(
    typeof business_unit === 'string' ? business_unit : '',
    !!business_unit && typeof business_unit === 'string'
  );
  const CardDetails = useMemo(() => {
    // Use project data (from API) or fallback to grant (legacy)
    const projectData = project || grant;
    const fundingSource = projectData?.funding_sources?.[0]?.name || projectData?.funding_source;

    return [
      {
        id: 1,
        label: "Sub-Grant Name",
        value: title || "N/A",
      },

      {
        id: 2,
        label: "Project Name",
        value: projectData?.title || "N/A",
      },

      {
        id: 3,
        label: "Project ID",
        value: projectData?.project_id || "N/A",
      },

      {
        id: 4,
        label: "Funding Source",
        value: fundingSource || "N/A",
      },

      {
        id: 5,
        label: "Award Type",
        value: award_type || "N/A",
      },

      {
        id: 6,
        label: "Award Amount (USD)",
        value: formatNumberCurrency(amount_usd, "USD"),
      },

      {
        id: 7,
        label: "Award Amount (NGN)",
        value: formatNumberCurrency(amount_ngn, "NGN"),
      },

      {
        id: 8,
        label: "Administrator",
        value: sub_grant_administrator?.full_name || "N/A",
      },

      {
        id: 9,
        label: "Technical Staff",
        value: technical_staff?.full_name || "N/A",
      },

      {
        id: 10,
        label: "Business Unit",
        value: departmentData?.data?.name || business_unit || "N/A",
      },

      {
        id: 11,
        label: "Locations",
        value: locations && locations.length > 0
          ? locations.map(loc => loc.name || loc.city).join(", ")
          : "N/A",
      },

      { id: 12, label: "Start Date", value: start_date || "N/A" },

      { id: 13, label: "End Date", value: end_date || "N/A" },

      {
        id: 14,
        label: "Status",
        value: status || "N/A",
      },
    ];
  }, [
    title,
    grant,
    project,
    sub_grant_administrator,
    technical_staff,
    business_unit,
    departmentData,
    award_type,
    locations,
    amount_usd,
    amount_ngn,
    start_date,
    end_date,
    status,
  ]);

  return (
    <div className='w-full bg-white px-[2.5rem] py-[1.25rem] rounded-2xl flex flex-col gap-y-[1.25rem]'>
      <h3 className='text-xl font-bold'>Sub-Grant Award Details</h3>
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

export default SubGrantAwardDetails;
