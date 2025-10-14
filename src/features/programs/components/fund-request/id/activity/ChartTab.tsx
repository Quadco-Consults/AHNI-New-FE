import { TFundRequestResponseData } from "@/features/programs/types/fund-request";

interface ChartTabProps {
  fundRequest?: TFundRequestResponseData;
}

const ChartTab = ({ fundRequest }: ChartTabProps) => {
  if (!fundRequest) {
    return (
      <div className="text-center text-gray-500 py-8">
        No fund request data available
      </div>
    );
  }

  const startDate = fundRequest.project?.start_date
    ? new Date(fundRequest.project.start_date)
    : null;
  const endDate = fundRequest.project?.end_date
    ? new Date(fundRequest.project.end_date)
    : null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Project Timeline</h3>
        <p className="text-sm text-gray-600">
          Gantt chart visualization for project activities and milestones
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Project Start Date</p>
              <p className="text-lg font-semibold">
                {startDate ? startDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Project End Date</p>
              <p className="text-lg font-semibold">
                {endDate ? endDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-300">
            <h4 className="font-semibold mb-3">Project Objectives:</h4>
            {fundRequest.project?.objectives && fundRequest.project.objectives.length > 0 ? (
              <ul className="space-y-3">
                {fundRequest.project.objectives.map((obj, index) => (
                  <li key={index} className="bg-white p-4 rounded border border-gray-200">
                    <p className="font-medium text-gray-900">{obj.objective}</p>
                    {obj.sub_objectives && obj.sub_objectives.length > 0 && (
                      <ul className="mt-2 ml-4 space-y-1">
                        {obj.sub_objectives.map((subObj, subIndex) => (
                          <li key={subIndex} className="text-sm text-gray-600">
                            • {subObj}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No objectives defined</p>
            )}
          </div>

          <div className="pt-4 border-t border-gray-300 text-center">
            <p className="text-sm text-gray-500 italic">
              Full Gantt chart visualization with timeline bars will be implemented in future updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartTab;
