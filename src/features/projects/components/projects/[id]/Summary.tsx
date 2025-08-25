import LocationSvg from "assets/svgs/LocationSvg";
import { Badge } from "components/ui/badge";
import { IProjectSingleData } from "definations/project";
import { formatNumberCurrency } from "utils/utls";

export default function ProjectSummary(props: IProjectSingleData) {
  const {
    title,
    goal,
    start_date,
    end_date,
    budget,
    project_managers,
    funding_sources,
    expected_results,
    beneficiaries,
    partners,
    currency,
    location,
    total_obligation_amount,
    // grant,
  } = props;
  //   const { name: grantName = "", grant_id = "" } = grant;
  //   console.log({ props });

  return (
    <div className='space-y-10'>
      <h4 className='font-semibold text-lg'>Project Summary</h4>
      <hr />

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='space-y-1'>
          <h3 className='font-semibold'>Project Title</h3>
          <p className='text-sm text-gray-500'>{title}</p>
        </div>

        <div className='space-y-1'>
          <h3 className='font-semibold'>Project Location</h3>
          <p className='text-sm text-gray-500'>
            {Array.isArray(location)
              ? location.map((loc: any) => loc.name).join(", ")
              : location?.name}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {/* <div className='space-y-1'>
          <h3 className='font-semibold'>Grant Name</h3>
          <p className='text-sm text-gray-500'>{grantName}</p>
        </div> */}

        {/* <div className='space-y-1'>
          <h3 className='font-semibold'>Grant ID</h3>
          <p className='text-sm text-gray-500'>{grant_id}</p>
        </div> */}
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='space-y-1'>
          <h3 className='font-semibold'>Goal of the project</h3>
          <p className='text-sm text-gray-500'>{goal}</p>
        </div>

        <div className='space-y-1'>
          <h3 className='font-semibold'>Total Obligation</h3>
          <p className='text-sm text-gray-500'>
            {total_obligation_amount
              ? formatNumberCurrency(total_obligation_amount, currency)
              : "N/A"}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='space-y-1'>
          <h3 className='font-semibold'>Start Date</h3>
          <p className='text-sm text-gray-500'>{start_date}</p>
        </div>

        <div className='space-y-1'>
          <h3 className='font-semibold'>End Date</h3>
          <p className='text-sm text-gray-500'>{end_date}</p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='space-y-1'>
          <h3 className='font-semibold'>Budget (Total Estimated Amount)</h3>
          <p className='text-sm text-gray-500'>
            {formatNumberCurrency(budget, currency)}
          </p>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <div className='space-y-1'>
            <h3 className='font-semibold'>Project Manager</h3>
            <p className='text-sm text-gray-500'>
              {project_managers
                ?.map(
                  (manager) => `${manager?.first_name} ${manager?.last_name}`
                )
                .join(", ")}
            </p>
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        <h3 className='font-semibold'>Funding Source</h3>

        <div className='flex flex-wrap gap-3'>
          {funding_sources?.map((option: any, index: number) => (
            <Badge
              variant='default'
              key={index}
              className='bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg'
            >
              {option?.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='space-y-1'>
          <h3 className='font-semibold'>Expected Results</h3>
          <p className='text-sm text-gray-500'>{expected_results}</p>
        </div>
      </div>

      <div className='space-y-3 py-5'>
        <h3 className='font-semibold'>Target Population</h3>
        <div className='flex flex-wrap gap-3'>
          {beneficiaries?.map((option: any) => (
            <Badge
              variant='default'
              key={option.id}
              className='bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg'
            >
              {option.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='space-y-1'>
          <h3 className='font-semibold'>Consortium Partners</h3>

          <div className='flex flex-wrap gap-3'>
            {partners?.map((partner) => (
              <div key={partner.id} className='border p-5 space-y-3 rounded-lg'>
                <div className='flex gap-3 items-center'>
                  <h4 className='font-semibold'>{partner.name}</h4>
                </div>

                <div className='flex items-cemter gap-2'>
                  <LocationSvg />
                  {partner.state}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
