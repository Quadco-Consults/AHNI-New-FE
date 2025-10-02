import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { SeparationManagement } from "@/features/hr/types/separation-management";

interface ExitSummaryProps {
  data?: SeparationManagement;
}

const ExitSummary = ({ data }: ExitSummaryProps) => {
  if (!data) return null;

  const employeeName = `${data.employee?.legal_firstname || ""} ${data.employee?.legal_lastname || ""}`.toUpperCase();
  const submitDate = data.submit_date ? new Date(data.submit_date).toLocaleDateString() : "N/A";
  const exitDate = data.exit_date ? new Date(data.exit_date).toLocaleDateString() : "N/A";

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-xl">{employeeName}</h4>

      <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DescriptionCard label="Employee Number" description={data.employee?.employee_number || "N/A"} />
        <DescriptionCard label="Position" description={data.employee?.position?.name || "N/A"} />
        <DescriptionCard label="Grade" description={data.employee?.grade || "N/A"} />
        <DescriptionCard label="Location" description={data.employee?.location?.name || "N/A"} />
      </Card>

      <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DescriptionCard label="Exit Method" description={data.exit_method} />
        <DescriptionCard label="Project" description={data.project?.title || data.project?.project_name || "N/A"} />
        <DescriptionCard label="Submission Date" description={submitDate} />
        <DescriptionCard label="Exit Date" description={exitDate} />
      </Card>

      <Card className="space-y-6">
        <p className="font-semibold text-yellow-600">Exit Information</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DescriptionCard
            label="Status"
            description={data.status}
          />
          <DescriptionCard
            label="Clearance Status"
            description={data.clearance_status || "N/A"}
          />
          <DescriptionCard
            label="Handover Completed"
            description={data.handover_completed ? "Yes" : "No"}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DescriptionCard
            label="Assets Returned"
            description={data.assets_returned ? "Yes" : "No"}
          />
          <DescriptionCard
            label="Notice Period"
            description={data.notice_period ? `${data.notice_period} days` : "N/A"}
          />
          <DescriptionCard
            label="Rehire Eligible"
            description={data.rehire_eligible ? "Yes" : "No"}
          />
        </div>
      </Card>

      {data.reason_for_leaving && (
        <Card>
          <DescriptionCard
            label="Reason for Leaving"
            description={data.reason_for_leaving}
          />
        </Card>
      )}
    </div>
  );
};

export default ExitSummary;
