import { Card } from "@/components/ui/card";
import { TWorkPlanSingleResponse } from "@/features/programs/types/work-plan";
import { formatNumberCurrency } from "@/utils/utls";

type PropsType = {
  data: TWorkPlanSingleResponse;
};

export default function Summary({
  data: {
    project: { objectives, partners, title, budget, currency },
    financial_year,
  },
}: PropsType) {
  return (
    <Card className='p-6 space-y-6'>
      {/* Header */}
      <div className='border-b pb-4'>
        <h2 className='text-2xl font-bold text-gray-900'>Work Plan Summary</h2>
        <p className='text-sm text-gray-500 mt-1'>Overview of work plan details and objectives</p>
      </div>

      {/* Basic Information - 2 Column Grid */}
      <div className='space-y-4'>
        <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>Basic Information</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Project Name</span>
            <span className='text-sm text-gray-900'>{title || "Not specified"}</span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Financial Year</span>
            <span className='text-sm text-gray-900'>{financial_year?.year || 'N/A'}</span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Total Budget</span>
            <span className='text-lg font-bold text-green-700'>
              {formatNumberCurrency(budget, currency)}
            </span>
          </div>

          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500 mb-1'>Number of Partners</span>
            <span className='text-sm text-gray-900'>{partners?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Project Objectives */}
      <div className='space-y-4 border-t pt-6'>
        <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
          Project Objectives
        </h3>

        {!objectives || objectives.length === 0 ? (
          <p className='text-sm text-gray-500 bg-gray-50 p-4 rounded border border-gray-200'>
            No objectives defined for this project
          </p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {objectives.map((obj, index) => (
              <div key={obj?.objective || index} className='bg-gray-50 p-4 rounded border border-gray-200'>
                <div className='space-y-3'>
                  <div>
                    <span className='text-xs font-medium text-gray-500 uppercase'>Main Objective</span>
                    <p className='text-sm text-gray-900 mt-1'>{obj?.objective}</p>
                  </div>

                  {obj?.sub_objectives && obj.sub_objectives.length > 0 && (
                    <div>
                      <span className='text-xs font-medium text-gray-500 uppercase'>Sub-Objectives</span>
                      <ol className='pl-5 mt-2 space-y-1'>
                        {obj.sub_objectives.map((subObj: any, subIndex: number) => (
                          <li
                            key={subIndex}
                            className='text-sm list-decimal text-gray-700'
                          >
                            {subObj}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Locations */}
      <div className='space-y-4 border-t pt-6'>
        <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
          Project Locations
        </h3>
        <div className='flex flex-col'>
          <span className='text-sm text-gray-900'>
            {partners && partners.length > 0
              ? partners.map((partner) => partner?.state).filter(Boolean).join(", ") || "Not specified"
              : "Not specified"}
          </span>
        </div>
      </div>

      {/* Consortium Partners */}
      {partners && partners.length > 0 && (
        <div className='space-y-4 border-t pt-6'>
          <h3 className='text-sm font-semibold text-gray-900 uppercase tracking-wide'>
            Consortium Partners ({partners.length})
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {partners.map((partner) => (
              <div key={partner.id} className='border border-gray-200 p-4 space-y-2 rounded bg-white'>
                <h4 className='font-semibold text-sm text-gray-900'>{partner.name}</h4>
                {partner.state && (
                  <p className='text-xs text-gray-600'>{partner.state}</p>
                )}
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
    </Card>
  );
}
