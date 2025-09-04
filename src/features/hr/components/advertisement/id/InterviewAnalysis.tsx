import InterviewTable from "../table/InterviewTable";

const InterviewAnalysis = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Interview Management</h3>
        <div className="text-sm text-gray-500">
          Interview types available: COMMITTEE, NON COMMITTEE
        </div>
      </div>
      <InterviewTable />
    </div>
  );
};

export default InterviewAnalysis;
