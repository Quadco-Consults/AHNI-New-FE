import PencilIcon from "@/components/icons/PencilIcon";
import Card from "@/components/Card";
import DescriptionCard from "@/components/DescriptionCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SeparationManagement } from "@/features/hr/types/separation-management";
import { useUpdateSeparationManagement } from "@/features/hr/controllers/separationManagementController";
import { useState } from "react";
import { toast } from "sonner";
import FeedbackModal from "@/features/common/components/modals/FeedbackModal";
import { useParams } from "next/navigation";

interface FeedbackProps {
  data?: SeparationManagement;
}

const Feedback = ({ data }: FeedbackProps) => {
  const { id } = useParams();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { updateSeparationManagement, isLoading } = useUpdateSeparationManagement(id as string);

  if (!data) return null;

  // Handle API wrapper structure
  const actualData = (data as any).data || data;

  const employeeName = `${actualData.employee?.legal_firstname || ""} ${actualData.employee?.legal_lastname || ""}`.toUpperCase();

  const handleFeedbackSubmit = async (formData: { feedback: string }) => {
    try {
      await updateSeparationManagement({
        exit_feedback: formData.feedback
      });
      toast.success("Feedback saved successfully");
      setDialogOpen(false);
      // Refresh the page to show updated feedback
      window.location.reload();
    } catch (error) {
      toast.error("Failed to save feedback");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex-items">
        <h4 className="font-semibold text-xl">{employeeName}</h4>
        <Button
          onClick={() => setDialogOpen(true)}
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
            description={actualData.performance_rating || "N/A"}
          />
          <DescriptionCard
            label="Rehire Eligible"
            description={actualData.rehire_eligible ? "Yes" : "No"}
          />
        </div>
      </Card>

      {actualData.evaluation_notes && (
        <Card className="space-y-6">
          <p className="font-semibold">Evaluation Notes</p>
          <p className="text-sm">{actualData.evaluation_notes}</p>
        </Card>
      )}

      {actualData.exit_feedback && (
        <Card className="space-y-6">
          <p className="font-semibold">Exit Feedback</p>
          <p className="text-sm">{actualData.exit_feedback}</p>
        </Card>
      )}

      {!actualData.evaluation_notes && !actualData.exit_feedback && (
        <Card className="p-6 text-center text-gray-500">
          No evaluation or feedback has been provided yet.
        </Card>
      )}

      {/* Feedback Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <FeedbackModal
            onSubmit={handleFeedbackSubmit}
            onClose={() => setDialogOpen(false)}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Feedback;
