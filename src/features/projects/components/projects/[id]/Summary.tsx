import LocationSvg from "assets/svgs/LocationSvg";
import { Badge } from "@/components/ui/badge";
import { IProjectSingleData } from "definations/project";
import { formatNumberCurrency } from "@/utils/utls";

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
    intervention_areas,
    total_obligation_amount,
    // grant,
  } = props;
  //   const { name: grantName = "", grant_id = "" } = grant;
  //   console.log({ props });

  return (
    <div className='space-y-8'>
      <div className='border-b pb-4'>
        <h4 className='font-semibold text-xl'>Project Summary</h4>
        <p className='text-sm text-gray-500 mt-1'>Overview of project details and key information</p>
      </div>

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

      {/* Intervention Areas Section */}
      {intervention_areas && intervention_areas.length > 0 && (
        <div className='space-y-3'>
          <h3 className='font-semibold'>Intervention Areas</h3>
          <div className='flex flex-wrap gap-3'>
            {intervention_areas.map((area: any) => (
              <Badge
                variant='default'
                key={area.id}
                className='bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg'
              >
                {area.name}
              </Badge>
            ))}
          </div>
        </div>
      )}


      {/* Timeline & Budget Section */}
      <div className='border-t pt-6'>
        <h3 className='font-semibold text-lg mb-4'>Timeline & Budget</h3>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-gray-600'>Start Date</h4>
            <p className='text-base font-semibold'>{start_date}</p>
          </div>

          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-gray-600'>End Date</h4>
            <p className='text-base font-semibold'>{end_date}</p>
          </div>

          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-gray-600'>Budget (Total Estimated Amount)</h4>
            <p className='text-base font-semibold text-green-600'>
              {formatNumberCurrency(budget, currency)}
            </p>
          </div>

          <div className='space-y-2'>
            <h4 className='font-medium text-sm text-gray-600'>Total Obligation</h4>
            <p className='text-base font-semibold'>
              {total_obligation_amount
                ? formatNumberCurrency(total_obligation_amount, currency)
                : "N/A"}
            </p>
            {total_obligation_amount && (
              <div className='space-y-1'>
                <div className='flex justify-between text-xs text-gray-600'>
                  <span>Budget Utilization</span>
                  <span>{Math.min(Math.round((parseFloat(total_obligation_amount) / budget) * 100), 100)}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${Math.min((parseFloat(total_obligation_amount) / budget) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className='space-y-1 md:col-span-2'>
            <h4 className='font-medium text-sm text-gray-600'>Project Manager</h4>
            <p className='text-base font-semibold'>
              {project_managers
                ?.map(
                  (manager: any) => `${manager?.first_name} ${manager?.last_name}`
                )
                .join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Stakeholders Section */}
      <div className='border-t pt-6 space-y-6'>
        <h3 className='font-semibold text-lg'>Stakeholders & Funding</h3>

        <div className='space-y-3'>
          <h4 className='font-medium text-sm text-gray-600'>Funding Sources</h4>
          <div className='flex flex-wrap gap-2'>
            {funding_sources?.map((option: any, index: number) => (
              <Badge
                variant='default'
                key={index}
                className='bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-lg'
              >
                {option?.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className='space-y-3'>
          <h4 className='font-medium text-sm text-gray-600'>Target Population</h4>
          <div className='flex flex-wrap gap-2'>
            {beneficiaries?.map((option: any) => (
              <Badge
                variant='default'
                key={option.id}
                className='bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 rounded-lg'
              >
                {option.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Project Goals Section */}
      <div className='border-t pt-6 space-y-4'>
        <h3 className='font-semibold text-lg'>Project Goals & Outcomes</h3>

        <div className='space-y-1'>
          <h4 className='font-medium text-sm text-gray-600'>Goal of the Project</h4>
          <p className='text-sm text-gray-700 leading-relaxed'>{goal}</p>
        </div>

        <div className='space-y-1'>
          <h4 className='font-medium text-sm text-gray-600'>Expected Results</h4>
          <p className='text-sm text-gray-700 leading-relaxed'>{expected_results}</p>
        </div>
      </div>

      {/* Consortium Partners Section */}
      <div className='border-t pt-6'>
        <h3 className='font-semibold text-lg mb-4'>Consortium Partners</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {partners?.map((partner: any) => (
            <div key={partner.id} className='border border-gray-200 p-4 space-y-3 rounded-lg hover:shadow-md transition-shadow'>
              <h4 className='font-semibold text-base'>{partner.name}</h4>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <LocationSvg />
                <span>{partner.state || 'Location not specified'}</span>
              </div>
              {partner.partner_type && (
                <Badge variant='outline' className='text-xs'>
                  {partner.partner_type.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
