"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { Label } from "components/ui/label";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog } from "store/ui";
import { toast } from "sonner";
import { cn } from "lib/utils";
import { Angry } from "lucide-react";
import { useRejectFundRequest } from "../../controllers/fundRequestWorkflowController";

const RejectSchema = z.object({
  comments: z.string().min(1, "Reason for rejection is required")
});

type TRejectFormValues = z.infer<typeof RejectSchema>;

interface FundRequestRejectModalProps {
  fundRequestId?: string;
}

const FundRequestRejectModal: React.FC<FundRequestRejectModalProps> = ({
  fundRequestId
}) => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.ui.dailog);
  
  const form = useForm<TRejectFormValues>({
    resolver: zodResolver(RejectSchema),
    defaultValues: {
      comments: ""
    }
  });

  const rejectMutation = useRejectFundRequest();

  const handleSubmit = async (data: TRejectFormValues) => {
    if (!fundRequestId) {
      toast.error("Fund request ID is required");
      return;
    }

    try {
      await rejectMutation.reject(fundRequestId, data.comments);
      toast.success("Fund request rejected");
      dispatch(closeDialog());
      form.reset();
    } catch (error: any) {
      console.error("Rejection error:", error);
      
      if (error.message?.includes("not found")) {
        toast.error("Fund request not found. It may have been deleted or moved.");
      } else if (error.message?.includes("permission")) {
        toast.error("You don't have permission to perform this action.");
      } else if (error.message?.includes("models")) {
        toast.error("Server configuration error. Please contact support.");
      } else {
        toast.error(error.message || error.data?.message || "Rejection failed. Please try again.");
      }
    }
  };

  const handleClose = () => {
    dispatch(closeDialog());
    form.reset();
  };

  const isLoading = rejectMutation.isPending;

  if (!isOpen || !fundRequestId) return null;

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Reject Fund Request</h3>
        <p className="text-sm text-gray-600 mt-1">Please provide a reason for rejecting this fund request</p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
        <div className="flex justify-center">
          <div className="p-6 rounded-lg text-center border-2 border-red-500 text-red-500 bg-red-50">
            <Angry className="mx-auto mb-2" size={32} />
            <h4 className="font-medium">Reject Request</h4>
          </div>
        </div>

        <div>
          <Label htmlFor="comments">Reason for Rejection *</Label>
          <Textarea
            id="comments"
            placeholder="Please provide a detailed reason for rejecting this fund request..."
            {...form.register("comments")}
            className="mt-1"
            rows={4}
          />
          {form.formState.errors.comments && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.comments.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Reject Request"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FundRequestRejectModal;