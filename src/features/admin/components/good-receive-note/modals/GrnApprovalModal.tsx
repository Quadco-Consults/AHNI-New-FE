"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import FormButton from "@/components/FormButton";
import { toast } from "sonner";
import {
  useMarkGoodReceiveNoteAsReceivedMutation,
  useApproveGoodReceiveNoteMutation,
  useRejectGoodReceiveNoteMutation,
} from "@/features/admin/controllers/goodReceiveNoteController";
import { useQueryClient } from "@tanstack/react-query";

interface GrnApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  grnId: string;
  action: "received" | "accept" | "reject";
  onSuccess?: () => void;
}

export default function GrnApprovalModal({
  isOpen,
  onClose,
  grnId,
  action,
  onSuccess,
}: GrnApprovalModalProps) {
  const [comments, setComments] = useState("");
  const queryClient = useQueryClient();

  const { markGoodReceiveNoteAsReceived, isLoading: isMarkingReceived } =
    useMarkGoodReceiveNoteAsReceivedMutation(grnId);

  const { approveGoodReceiveNote, isLoading: isApproving } =
    useApproveGoodReceiveNoteMutation(grnId);

  const { rejectGoodReceiveNote, isLoading: isRejecting } =
    useRejectGoodReceiveNoteMutation(grnId);

  const handleSubmit = async () => {
    if (!comments.trim()) {
      toast.error("Please enter comments");
      return;
    }

    try {
      if (action === "received") {
        await markGoodReceiveNoteAsReceived(comments.trim());
        toast.success("Good Receive Note marked as received successfully");
      } else if (action === "accept") {
        await approveGoodReceiveNote(comments.trim());
        toast.success("Good Receive Note accepted successfully");
      } else if (action === "reject") {
        await rejectGoodReceiveNote(comments.trim());
        toast.success("Good Receive Note rejected successfully");
      }

      // Invalidate queries to refresh the table data
      queryClient.invalidateQueries({ queryKey: ["goodReceiveNote"] });

      setComments("");
      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error(`${action} failed:`, error);
      toast.error(
        error?.data?.message ||
          `Failed to ${action} GRN. Please try again.`
      );
    }
  };

  const handleClose = () => {
    setComments("");
    onClose();
  };

  if (!isOpen) return null;

  const isLoading = isMarkingReceived || isApproving || isRejecting;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="p-6 w-96 max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {action === "received" ? "Mark GRN as Received" :
           action === "accept" ? "Accept GRN" : "Reject GRN"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments *
            </label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={`Enter your ${action === "received" ? "receipt confirmation" : action === "accept" ? "acceptance" : "rejection"} comments...`}
              rows={4}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormButton
              onClick={handleSubmit}
              loading={isLoading}
              disabled={!comments.trim()}
              className={
                action === "received"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : action === "accept"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }
            >
              Confirm {action === "received" ? "Received" : action === "accept" ? "Accept" : "Reject"}
            </FormButton>
          </div>
        </div>
      </Card>
    </div>
  );
}