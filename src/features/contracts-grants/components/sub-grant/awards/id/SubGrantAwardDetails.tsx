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
import { useSubGrantScheduler } from "@/hooks/useSubGrantScheduler";
import { useGetSingleDepartment } from "@/features/modules/controllers/config/departmentController";
import { PlayCircle, StopCircle, Edit, Clock, Zap } from "lucide-react";
import Link from "next/link";

const SubGrantAwardDetails = ({
  id,
  title,
  grant,
  project,
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
  status: initialStatus,
  locations,
}: ISubGrantSingleData) => {
  const [status, setStatus] = useState<string>(initialStatus || "DRAFT");

  const { publishSubGrant, isLoading: isPublishing } = usePublishSubGrant(id);
  const { isLoading: isOpening } = useOpenSubmissions(id);
  const { isLoading: isClosing } = useCloseSubmissions(id);

  // Scheduler integration
  const { status: schedulerStatus, manualOpenSubmissions, manualCloseSubmissions } = useSubGrantScheduler();

  // Get business unit name
  const { data: departmentData } = useGetSingleDepartment(
    typeof business_unit === 'string' ? business_unit : '',
    !!business_unit && typeof business_unit === 'string'
  );


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
      // Use scheduler's manual method for consistency
      const result = await manualOpenSubmissions(id);
      if (result.success) {
        setStatus("SUBMISSION_OPEN");
        toast.success("Submissions opened successfully!");
        // Reload the page to reflect updated status
        window.location.reload();
      } else {
        toast.error("Failed to open submissions");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to open submissions");
    }
  };

  const handleCloseSubmissions = async () => {
    try {
      // Use scheduler's manual method for consistency
      const result = await manualCloseSubmissions(id);
      if (result.success) {
        setStatus("SUBMISSION_CLOSED");
        toast.success("Submissions closed successfully!");
        // Reload the page to reflect updated status
        window.location.reload();
      } else {
        toast.error("Failed to close submissions");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to close submissions");
    }
  };
  const details = useMemo(() => {
    // Use project data (from API) or fallback to grant (legacy)
    const projectData = project || grant;
    const fundingSource = projectData?.funding_sources?.[0]?.name || projectData?.funding_source;

    return [
      {
        id: 1,
        label: "Project Title",
        value: projectData?.title || "N/A",
      },

      {
        id: 2,
        label: "Sub-Grant Advert Title",
        value: title || "N/A",
      },

      {
        id: 3,
        label: "AHNI Project Number",
        value: projectData?.project_id || "Project ID Not Available",
      },

      {
        id: 4,
        label: "AHNI Grant Administrator",
        value: sub_grant_administrator?.full_name || "Dave Ubaka",
      },

      {
        id: 5,
        label: "Country of Performance",
        value: "Nigeria",
      },

      {
        id: 6,
        label: "AHNI Originating Funder / Funding Source",
        value: fundingSource || "Funding Source Not Available",
      },

      {
        id: 7,
        label: "Subaward Type (Proposed)",
        value: award_type || "N/A",
      },

      {
        id: 8,
        label: "AHNI Program/Technical Staff Contact",
        value: technical_staff?.full_name || "Technical Staff Not Available",
      },

      {
        id: 9,
        label: "Business Unit",
        value: departmentData?.data?.name || business_unit || "Business Unit Not Available",
      },
      {
        id: 10,
        label: "Project Locations",
        value: locations && locations.length > 0
          ? locations.map(loc => loc.name || loc.city).join(", ")
          : "N/A",
      },
      {
        id: 11,
        label: "Subaward Life of Project Value (USD)",
        value: formatNumberCurrency(amount_usd, "USD"),
      },
      {
        id: 12,
        label: "Subaward Life of Project Value (Local Currency)",
        value: formatNumberCurrency(amount_ngn, "NGN"),
      },

      { id: 13, label: "Start Date", value: start_date || "N/A" },

      { id: 14, label: "End Date", value: end_date || "N/A" },

      {
        id: 15,
        label: "Submission Start Date",
        value: submission_start_date || "N/A",
      },

      {
        id: 16,
        label: "Submission End Date",
        value: submission_end_date || "N/A",
      },
    ];
  }, [
    title,
    grant,
    project,
    sub_grant_administrator,
    technical_staff,
    business_unit,
    departmentData,
    award_type,
    locations,
    amount_usd,
    amount_ngn,
    start_date,
    end_date,
    submission_start_date,
    submission_end_date,
  ]);

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

      {/* Scheduler Status */}
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Automated Scheduler:
          </span>
          <Badge className={schedulerStatus.isRunning ? "bg-green-600" : "bg-gray-400"}>
            {schedulerStatus.isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>
        {schedulerStatus.isRunning && schedulerStatus.nextCheckTime && (
          <span className="text-xs text-blue-600">
            Next check: {schedulerStatus.nextCheckTime.toLocaleTimeString()}
          </span>
        )}
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
          title="Manual open (overrides automatic scheduling)"
        >
          <Zap size={16} className="mr-2" />
          {isOpening ? "Opening..." : "Open Submissions"}
        </Button>

        <Button
          onClick={handleCloseSubmissions}
          disabled={isClosing || status !== "SUBMISSION_OPEN"}
          size="sm"
          className="bg-orange-600 hover:bg-orange-700"
          title="Manual close (overrides automatic scheduling)"
        >
          <StopCircle size={16} className="mr-2" />
          {isClosing ? "Closing..." : "Close Submissions"}
        </Button>
      </div>

      {/* Scheduling Information */}
      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-amber-600" />
          <span className="text-sm font-medium text-amber-800">Scheduled Dates:</span>
        </div>
        <div className="text-xs text-amber-700 space-y-1">
          <div>📂 Submissions will automatically open on: <span className="font-mono">{submission_start_date}</span></div>
          <div>🔒 Submissions will automatically close on: <span className="font-mono">{submission_end_date}</span></div>
          <div className="text-amber-600 mt-2">💡 Manual actions override automatic scheduling</div>
        </div>
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
