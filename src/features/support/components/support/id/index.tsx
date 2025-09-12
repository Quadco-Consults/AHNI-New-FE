"use client";

import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useGetSingleTicket, useEditTicket } from "@/features/support/controllers/supportController";
import { LoadingSpinner } from "components/Loading";
import DescriptionCard from "components/DescriptionCard";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import BackNavigation from "components/atoms/BackNavigation";
import { Button } from "components/ui/button";
import { CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function SupportDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: ticket, isLoading, refetch } = useGetSingleTicket(id, !!id);
  const { editTicket } = useEditTicket(id);

  const handleCloseTicket = async () => {
    if (!ticket) return;
    
    setIsUpdating(true);
    try {
      await editTicket({
        status: "RESOLVED"
      });
      
      toast.success("Ticket closed successfully");
      await refetch(); // Refresh the ticket data
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Failed to close ticket");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReopenTicket = async () => {
    if (!ticket) return;
    
    setIsUpdating(true);
    try {
      await editTicket({
        status: "PENDING"
      });
      
      toast.success("Ticket reopened successfully");
      await refetch(); // Refresh the ticket data
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Failed to reopen ticket");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackNavigation />
        <Card>
          <CardHeader className="font-bold">
            Support Ticket Details
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent>
            <LoadingSpinner />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <BackNavigation />
        <Card>
          <CardHeader className="font-bold">
            Support Ticket Details
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Support ticket not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "bg-green-200 text-green-500";
      case "MEDIUM":
        return "bg-yellow-200 text-yellow-500";
      case "HIGH":
        return "text-red-500 bg-red-200";
      default:
        return "bg-gray-200 text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-200 text-green-500";
      case "PENDING":
        return "bg-yellow-200 text-yellow-500";
      case "IN_PROGRESS":
        return "bg-blue-200 text-blue-500";
      default:
        return "bg-gray-200 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <BackNavigation />
      
      <Card>
        <CardHeader className="font-bold">
          Support Ticket Details
          <Separator className="mt-4" />
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DescriptionCard
            label="Subject"
            description={ticket.data.subject}
          />

          <DescriptionCard
            label="Sender"
            description={ticket.data.sender || "N/A"}
          />

          <DescriptionCard
            label="Email"
            description={ticket.data.email}
          />

          <DescriptionCard
            label="Phone Number"
            description={ticket.data.phone_number || "N/A"}
          />

          <DescriptionCard
            label="Department"
            description={ticket.data.department}
          />

          <div>
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <div className="mt-1">
              <Badge
                variant="default"
                className={cn(
                  "p-2 rounded-lg",
                  getPriorityColor(ticket.data.priority)
                )}
              >
                {ticket.data.priority}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              <Badge
                variant="default"
                className={cn(
                  "p-2 rounded-lg",
                  getStatusColor(ticket.data.status)
                )}
              >
                {ticket.data.status}
              </Badge>
            </div>
          </div>

          <DescriptionCard
            label="Created Date"
            description={
              ticket.data.created_datetime
                ? new Date(ticket.data.created_datetime).toLocaleDateString("en-US")
                : "N/A"
            }
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            {ticket.data.status === "RESOLVED" ? (
              <Button
                onClick={handleReopenTicket}
                disabled={isUpdating}
                variant="outline"
                className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Clock className="h-4 w-4" />
                {isUpdating ? "Reopening..." : "Reopen Ticket"}
              </Button>
            ) : (
              <Button
                onClick={handleCloseTicket}
                disabled={isUpdating}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4" />
                {isUpdating ? "Closing..." : "Close Ticket"}
              </Button>
            )}
            
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              Back to Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Issue Description */}
      <Card>
        <CardHeader className="font-bold">
          Issue Description
          <Separator className="mt-4" />
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {ticket.data.issue_description || "No description provided"}
          </p>
        </CardContent>
      </Card>

      {/* Remarks */}
      {ticket.data.remark && (
        <Card>
          <CardHeader className="font-bold">
            Remarks
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {ticket.data.remark}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Attachment */}
      {ticket.data.remark_file && (
        <Card>
          <CardHeader className="font-bold">
            Attachment
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent>
            <a
              href={ticket.data.remark_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Download Attachment
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}