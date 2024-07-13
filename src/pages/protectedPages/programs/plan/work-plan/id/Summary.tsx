import { Badge } from "components/ui/badge";
import { WorkPlanDetails } from "definations/program-types/program-workplan";

const Summary = (data: WorkPlanDetails) => {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Project Name</h3>

        <p className="text-sm text-gray-500">{data?.project?.title}</p>

        <h3 className="font-semibold text-lg">Budget</h3>

        <p className="text-sm text-gray-500">
          ${data?.project?.budget.toLocaleString()}
        </p>
      </div>

      <hr />

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#FF0000]">
          Project Objectives
        </h3>

        <div className="space-y-5">
          {data?.project?.project_objectives?.map((obj: any) => (
            <div key={obj?.id} className="space-y-2">
              <p className="text-sm text-gray-500">{obj?.title}</p>

              <p className="font-semibold text-sm">Project Sub-Objectives</p>
              <ul className="space-y-2">
                {obj.sub_objectives?.map((obj: any) => (
                  <li
                    key={obj?.id}
                    className="text-sm text-gray-500 list-disc pl-5"
                  >
                    {obj?.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <hr />

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Financial Year</h3>
        {data?.workplans?.map((workplan: any) => (
          <h6 key={workplan.id} className="text-sm text-gray-500">
            {workplan.financial_year}
          </h6>
        ))}

        <h3 className="font-semibold text-lg">Project Location</h3>
        <div className="flex flex-wrap gap-3">
          {data?.project?.project_partners?.map(
            (option: any, index: number) => (
              <Badge
                variant="default"
                key={index}
                className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
              >
                {option?.location?.name}
              </Badge>
            )
          )}
        </div>

        <h3 className="font-semibold text-lg">Project Partners</h3>
        <div className="flex flex-wrap gap-3">
          {data?.project?.project_partners?.map(
            (option: any, index: number) => (
              <div key={index}>
                {option?.partners.map((partner: any) => (
                  <Badge
                    variant="default"
                    key={partner?.id}
                    className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
                  >
                    {partner?.name}
                  </Badge>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
