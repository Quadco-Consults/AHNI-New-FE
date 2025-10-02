import PencilIcon from "components/icons/PencilIcon";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { Button } from "components/ui/button";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { SeparationManagement } from "@/features/hr/types/separation-management";

interface FeedbackProps {
  data?: SeparationManagement;
}

const Feedback = ({ data }: FeedbackProps) => {
  const dispatch = useAppDispatch();

  if (!data) return null;

  const employeeName = `${data.employee?.legal_firstname || ""} ${data.employee?.legal_lastname || ""}`.toUpperCase();

  return (
    <div className="space-y-8">
      <div className="flex-items">
        <h4 className="font-semibold text-xl">{employeeName}</h4>
        <Button
          onClick={() =>
            dispatch(
              openDialog({
                type: DialogType.FeedbackModal,
                dialogProps: {
                  width: "max-w-md",
                },
              })
            )
          }
          variant="custom"
        >
          <PencilIcon /> Write Feedback
        </Button>
      </div>

      <Card className="space-y-6">
        <p className="font-semibold text-yellow-600">Performance & Evaluation</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DescriptionCard
            label="Performance Rating"
            description={data.performance_rating || "N/A"}
          />
          <DescriptionCard
            label="Rehire Eligible"
            description={data.rehire_eligible ? "Yes" : "No"}
          />
        </div>
      </Card>

      {data.evaluation_notes && (
        <Card className="space-y-6">
          <p className="font-semibold">Evaluation Notes</p>
          <p className="text-sm">{data.evaluation_notes}</p>
        </Card>
      )}

      {data.exit_feedback && (
        <Card className="space-y-6">
          <p className="font-semibold">Exit Feedback</p>
          <p className="text-sm">{data.exit_feedback}</p>
        </Card>
      )}

      {!data.evaluation_notes && !data.exit_feedback && (
        <Card className="p-6 text-center text-gray-500">
          No evaluation or feedback has been provided yet.
        </Card>
      )}
    </div>
  );
};

export default Feedback;
