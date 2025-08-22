import { Badge } from "components/ui/badge";
import { Card } from "components/ui/card";
import { TWorkPlanSingleResponse } from "features/programs/types/work-plan";
import { formatNumberCurrency } from "utils/utls";

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
    <Card className='space-y-10 p-5'>
      <div className='space-y-3'>
        <h3 className='font-semibold text-lg'>Project Name</h3>

        <p className='text-sm text-gray-500'>{title}</p>

        <h3 className='font-semibold text-lg'>Budget</h3>

        <p className='text-sm text-gray-500'>
          {formatNumberCurrency(budget, currency)}
        </p>
      </div>

      <hr />

      <div className='space-y-3'>
        <h3 className='text-xl font-semibold text-[#FF0000]'>
          Project Objectives
        </h3>

        {objectives?.length === 0 ? (
          <div>
            <p>No objectives found</p>
          </div>
        ) : (
          <div className='flex gap-10'>
            {objectives?.map((obj) => (
              <div key={obj?.objective} className='space-y-2'>
                <p className='text-sm text-gray-500'>{obj?.objective}</p>

                <p className='font-semibold text-sm'>Sub-Objectives</p>

                <ol className='pl-5'>
                  {obj?.sub_objectives?.map((obj: any) => (
                    <li
                      key={obj}
                      className='text-sm list-decimal text-gray-500'
                    >
                      {obj}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr />

      <div className='space-y-3'>
        <h3 className='font-semibold text-xl'>Financial Year</h3>
        <p>{financial_year?.year || 'N/A'}</p>

        <h3 className='font-semibold text-lg'>Project Location</h3>
        <div className='flex flex-wrap gap-3'>
          {partners?.map((project) => (
            <Badge
              variant='default'
              key={project.id}
              className='bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg'
            >
              {project?.state}
            </Badge>
          ))}
        </div>

        <h3 className='font-semibold text-lg'>Project Partners</h3>
        <div className='flex flex-wrap gap-3'>
          {partners?.map((partner) => (
            <div key={partner.id}>
              <Badge
                variant='default'
                key={partner?.id}
                className='bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg'
              >
                {partner?.name}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
