import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useMemo, useState } from "react";
import { formatNumberCurrency } from "utils/utls";
import { toast } from "sonner";
import {
  usePublishSubGrant,
  useOpenSubmissions,
  useCloseSubmissions
} from "@/features/contracts-grants/controllers/subGrantWorkflowController";
import { PlayCircle, StopCircle, CheckCircle, Edit } from "lucide-react";
import Link from "next/link";

const SubGrantAwardDetails = ({
  id,
  title,
  sub_grant_administrator,
  award_type,
  technical_staff,
  business_unit,
  amount_usd,
  amount_ngn,
  start_date,
  end_date,
  submission_start_date,
  submission_end_date,
  evaluation_applicants,
  status: initialStatus,
  locations,
}: ISubGrantSingleData) => {
  const [status, setStatus] = useState<string>(initialStatus || "DRAFT");

  const { publishSubGrant, isLoading: isPublishing } = usePublishSubGrant(id);
  const { openSubmissions, isLoading: isOpening } = useOpenSubmissions(id);
  const { closeSubmissions, isLoading: isClosing } = useCloseSubmissions(id);

  const handlePublish = async () => {
    try {
      await publishSubGrant();
      setStatus("ADVERTISED");
      toast.success("Sub-grant published successfully!");
      // Reload the page to reflect updated status
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || "Failed to publish sub-grant");
    }
  };

  const handleOpenSubmissions = async () => {
    try {
      await openSubmissions();
      setStatus("SUBMISSION_OPEN");
      toast.success("Submissions opened successfully!");
      // Reload the page to reflect updated status
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || "Failed to open submissions");
    }
  };

  const handleCloseSubmissions = async () => {
    try {
      await closeSubmissions();
      setStatus("SUBMISSION_CLOSED");
      toast.success("Submissions closed successfully!");
      // Reload the page to reflect updated status
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || "Failed to close submissions");
    }
  };
  const details = useMemo(() => {
    return [
      {
        id: 1,
        label: "Project Title",
        value: `${title}`,
      },

      {
        id: 2,
        label: "AHNI  Project Number",
        value: "N/A",
      },

      {
        id: 3,
        label: "AHNI Grant Administrator",
        value: `${sub_grant_administrator.first_name} ${sub_grant_administrator.last_name}`,
      },

      {
        id: 4,
        label: "Country of Performance",
        value: "Nigeria",
      },

      {
        id: 5,
        label: "AHNI Originating Funder / Funding Source",
        value: "N/A",
      },

      {
        id: 6,
        label: "Subaward Type (Proposed)",
        value: award_type,
      },

      {
        id: 7,
        label: "AHNI Program/Technical Staff Contact",
        value: `${technical_staff.first_name} ${technical_staff.last_name}`,
      },

      {
        id: 8,
        label: "Business Unit",
        value: business_unit,
      },
      {
        id: 9,
        label: "Project Locations",
        value: locations && locations.length > 0
          ? locations.map(loc => loc.name || loc.city).join(", ")
          : "N/A",
      },
      {
        id: 10,
        label: "Subaward Life of Project Value (USD)",
        value: formatNumberCurrency(amount_usd, "USD"),
      },
      {
        id: 11,
        label: "Subaward Life of Project Value (Local Currency)",
        value: formatNumberCurrency(amount_ngn, "NGN"),
      },

      { id: 12, label: "Start Date", value: start_date },

      { id: 13, label: "End Date", value: end_date },

      {
        id: 14,
        label: "Submission Start Date",
        value: submission_start_date,
      },

      {
        id: 15,
        label: "Submission End Date",
        value: submission_end_date,
      },

      {
        id: 16,
        label: "Commitees",
        value: evaluation_applicants
          .map((member) => `${member.first_name} ${member.last_name}`)
          .join(", "),
      },
    ];
  }, [title, sub_grant_administrator, award_type, technical_staff, business_unit, locations, amount_usd, amount_ngn, start_date, end_date, submission_start_date, submission_end_date, evaluation_applicants]);

  return (
    <div className="bg-white rounded-2xl flex flex-col gap-y-[1.25rem] py-5 px-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Award Details</h3>
        <div className="flex items-center gap-3">
          <Badge variant={status === "DRAFT" ? "secondary" : "default"}>
            {status}
          </Badge>
          <Link href={`/dashboard/c-and-g/sub-grant/create-sub-grant?editId=${id}`}>
            <Button variant="outline" size="sm">
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Workflow Actions */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <Button
          onClick={handlePublish}
          disabled={isPublishing || status !== "DRAFT"}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlayCircle size={16} className="mr-2" />
          {isPublishing ? "Publishing..." : "Publish"}
        </Button>

        <Button
          onClick={handleOpenSubmissions}
          disabled={isOpening || status !== "ADVERTISED"}
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          <PlayCircle size={16} className="mr-2" />
          {isOpening ? "Opening..." : "Open Submissions"}
        </Button>

        <Button
          onClick={handleCloseSubmissions}
          disabled={isClosing || status !== "SUBMISSION_OPEN"}
          size="sm"
          className="bg-orange-600 hover:bg-orange-700"
        >
          <StopCircle size={16} className="mr-2" />
          {isClosing ? "Closing..." : "Close Submissions"}
        </Button>
      </div>

      <Card className="grid grid-cols-2 gap-8">
        {details.map(({ label, value }, index) => (
          <DescriptionCard key={index} label={label} description={value} />
        ))}
      </Card>
    </div>
  );
};

export default SubGrantAwardDetails;
