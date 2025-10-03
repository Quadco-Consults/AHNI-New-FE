import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { SeparationManagement } from "@/features/hr/types/separation-management";

interface ExitSummaryProps {
  data?: SeparationManagement;
}

const ExitSummary = ({ data }: ExitSummaryProps) => {
  // Debug logging
  console.log("ExitSummary - Received props data:", data);
  console.log("ExitSummary - Type of data:", typeof data);
  console.log("ExitSummary - Keys in data:", data ? Object.keys(data) : 'no data');

  if (!data) {
    console.log("ExitSummary - No data provided");
    return null;
  }

  // Check if data has the API wrapper structure {status, message, data}
  const actualData = (data as any).data || data;

  console.log("ExitSummary - Actual data to use:", actualData);
  console.log("ExitSummary - Employee data:", actualData?.employee);
  console.log("ExitSummary - Employee type:", typeof actualData?.employee);

  const employeeName = `${actualData.employee?.legal_firstname || ""} ${actualData.employee?.legal_lastname || ""}`.toUpperCase();
  const submitDate = actualData.submit_date ? new Date(actualData.submit_date).toLocaleDateString() : "N/A";
  const exitDate = actualData.exit_date ? new Date(actualData.exit_date).toLocaleDateString() : "N/A";

  console.log("ExitSummary - Calculated values:", {
    employeeName,
    submitDate,
    exitDate,
    employeeNumber: actualData.employee?.employee_number,
    position: actualData.employee?.position,
    grade: actualData.employee?.grade,
    location: actualData.employee?.location
  });

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-xl">{employeeName}</h4>

      <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DescriptionCard label="Employee Number" description={actualData.employee?.employee_number || "N/A"} />
        <DescriptionCard label="Position" description={actualData.employee?.position?.name || "N/A"} />
        <DescriptionCard label="Grade" description={actualData.employee?.grade || "N/A"} />
        <DescriptionCard label="Location" description={actualData.employee?.location?.name || "N/A"} />
      </Card>

      <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DescriptionCard label="Exit Method" description={actualData.exit_method || "N/A"} />
        <DescriptionCard label="Project" description={actualData.project?.title || actualData.project?.project_name || "N/A"} />
        <DescriptionCard label="Submission Date" description={submitDate} />
        <DescriptionCard label="Exit Date" description={exitDate} />
      </Card>

      <Card className="space-y-6">
        <p className="font-semibold text-yellow-600">Exit Information</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DescriptionCard
            label="Status"
            description={actualData.status || "N/A"}
          />
          <DescriptionCard
            label="Clearance Status"
            description={actualData.clearance_status || "N/A"}
          />
          <DescriptionCard
            label="Handover Completed"
            description={actualData.handover_completed ? "Yes" : "No"}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DescriptionCard
            label="Assets Returned"
            description={actualData.assets_returned ? "Yes" : "No"}
          />
          <DescriptionCard
            label="Notice Period"
            description={actualData.notice_period ? `${actualData.notice_period} days` : "N/A"}
          />
          <DescriptionCard
            label="Rehire Eligible"
            description={actualData.rehire_eligible ? "Yes" : "No"}
          />
        </div>
      </Card>

      {actualData.reason_for_leaving && (
        <Card>
          <DescriptionCard
            label="Reason for Leaving"
            description={actualData.reason_for_leaving}
          />
        </Card>
      )}
    </div>
  );
};

export default ExitSummary;
