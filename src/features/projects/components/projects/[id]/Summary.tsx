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
  } = props;

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='border-b pb-4'>
        <h2 className='text-2xl font-bold text-gray-900'>Project Summary</h2>
        <p className='text-sm text-gray-500 mt-1'>Comprehensive overview of project details</p>
      </div>

      {/* Basic Information - 2 Column Grid */}
      <div className='space-y-4'>
        <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>Basic Information</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Project Title</span>
            <span className='text-sm text-gray-900'>{title}</span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Location</span>
            <span className='text-sm text-gray-900'>
              {Array.isArray(location)
                ? location.map((loc: any) => loc.name).join(", ")
                : location?.name || "Not specified"}
            </span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Project Manager(s)</span>
            <span className='text-sm text-gray-900'>
              {project_managers
                ?.map((manager: any) => `${manager?.first_name} ${manager?.last_name}`)
                .join(", ") || "Not assigned"}
            </span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Intervention Areas</span>
            <span className='text-sm text-gray-900'>
              {intervention_areas && intervention_areas.length > 0
                ? intervention_areas.map((area: any) => area.name).join(", ")
                : "Not specified"}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Information - 2 Column Grid */}
      <div className='space-y-4 border-t pt-6'>
        <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>Financial Information</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Total Budget</span>
            <span className='text-lg font-bold text-green-700'>
              {formatNumberCurrency(budget, currency)}
            </span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Total Obligation Amount</span>
            <span className='text-lg font-bold text-gray-900'>
              {total_obligation_amount
                ? formatNumberCurrency(total_obligation_amount, currency)
                : "N/A"}
            </span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Start Date</span>
            <span className='text-sm text-gray-900'>{start_date}</span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>End Date</span>
            <span className='text-sm text-gray-900'>{end_date}</span>
          </div>

          {total_obligation_amount && (
            <div className='flex flex-col md:col-span-2'>
              <span className='text-xs font-medium text-gray-500 mb-2'>Budget Utilization</span>
              <div className='space-y-1'>
                <div className='flex justify-between text-xs text-gray-600'>
                  <span>
                    {formatNumberCurrency(total_obligation_amount, currency)} of {formatNumberCurrency(budget, currency)}
                  </span>
                  <span className='font-semibold'>
                    {Math.min(Math.round((parseFloat(total_obligation_amount) / budget) * 100), 100)}%
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-blue-600 h-2 rounded-full'
                    style={{
                      width: `${Math.min((parseFloat(total_obligation_amount) / budget) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stakeholders & Funding - 2 Column Grid */}
      <div className='space-y-4 border-t pt-6'>
        <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>Stakeholders & Funding</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Funding Sources</span>
            <span className='text-sm text-gray-900'>
              {funding_sources && funding_sources.length > 0
                ? funding_sources.map((source: any) => source?.name).join(", ")
                : "Not specified"}
            </span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Target Population / Beneficiaries</span>
            <span className='text-sm text-gray-900'>
              {beneficiaries && beneficiaries.length > 0
                ? beneficiaries.map((b: any) => b.name).join(", ")
                : "Not specified"}
            </span>
          </div>
        </div>
      </div>

      {/* Project Goals & Outcomes */}
      <div className='space-y-4 border-t pt-6'>
        <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>Project Goals & Expected Outcomes</h3>
        <div className='space-y-4'>
          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-2'>Project Goal</span>
            <p className='text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border border-gray-200'>
              {goal || "Not specified"}
            </p>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-2'>Expected Results</span>
            <p className='text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border border-gray-200'>
              {expected_results || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* Consortium Partners */}
      {partners && partners.length > 0 && (
        <div className='space-y-4 border-t pt-6'>
          <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
            Consortium Partners ({partners.length})
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {partners.map((partner: any) => (
              <div key={partner.id} className='border border-gray-200 p-4 space-y-2 rounded bg-white'>
                <h4 className='font-semibold text-sm text-gray-900'>{partner.name}</h4>
                <div className='flex items-start gap-2 text-xs text-gray-600'>
                  <LocationSvg className="flex-shrink-0 mt-0.5" />
                  <span>{partner.state || 'Location not specified'}</span>
                </div>
                {partner.partner_type && (
                  <span className='inline-block text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded'>
                    {partner.partner_type.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
