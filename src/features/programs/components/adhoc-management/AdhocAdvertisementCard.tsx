"use client";

import {
  ClockTimingSvg,
  DataCalenderSvg,
  LocationSvg,
  PeoplePositionsSvg,
  SuiteCase,
} from "assets/svgs/CAndGSvgs";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { CardTitle } from "components/ui/card";
import { ProgramRoutes } from "constants/RouterConstants";
import { format, isValid, differenceInMonths } from "date-fns";
import { IAdhocAdvertisement } from "@/features/programs/types/adhoc-management";
import { useState } from "react";
import Link from "next/link";
import { useDeleteAdhocAdvertisement, useUpdateAdhocAdvertisement, usePublishAdvertisement } from "@/features/programs/controllers/adhocAdvertisementController";
import { toast } from "sonner";
import { Users, CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

export default function AdhocAdvertisementCard(advertisement: IAdhocAdvertisement) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
  const [applicationDeadline, setApplicationDeadline] = useState(
    advertisement.application_deadline || ""
  );

  const deleteMutation = useDeleteAdhocAdvertisement();
  const updateMutation = useUpdateAdhocAdvertisement(advertisement.id);
  const publishMutation = usePublishAdvertisement(advertisement.id);

  // DEBUG: Log advertisement data to console
  if (process.env.NODE_ENV === 'development') {
    const hasJobDesc = !!advertisement.job_description && advertisement.job_description.trim() !== '';
    const hasKeyResp = !!advertisement.key_responsibilities && advertisement.key_responsibilities.trim() !== '';
    const hasQuals = (!!advertisement.qualifications && advertisement.qualifications.trim() !== '') ||
                     (!!advertisement.qualifications_required && advertisement.qualifications_required.trim() !== '');
    const hasDeadline = !!advertisement.application_deadline;

    console.log(`📋 ${advertisement.advertisement_number}:`, {
      readyToPublish: hasJobDesc && hasKeyResp && hasQuals && hasDeadline,
      checks: {
        '✓ Job Description': hasJobDesc,
        '✓ Key Responsibilities': hasKeyResp,
        '✓ Qualifications': hasQuals,
        '✓ Application Deadline': hasDeadline,
      },
      values: {
        job_description: advertisement.job_description ? `"${advertisement.job_description.substring(0, 40)}..."` : '❌ MISSING',
        key_responsibilities: advertisement.key_responsibilities ? `"${advertisement.key_responsibilities.substring(0, 40)}..."` : '❌ MISSING',
        qualifications: advertisement.qualifications ? `"${advertisement.qualifications.substring(0, 40)}..."` : '(empty)',
        qualifications_required: advertisement.qualifications_required ? `"${advertisement.qualifications_required.substring(0, 40)}..."` : '❌ MISSING',
        application_deadline: advertisement.application_deadline || '❌ MISSING',
      }
    });
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(advertisement.id);
      toast.success("Advertisement deleted successfully");
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to delete advertisement");
    }
  };

  const handleSaveDeadline = async () => {
    if (!applicationDeadline) {
      toast.error("Please select an application deadline");
      return;
    }

    try {
      // First, save the deadline
      await updateMutation.mutateAsync({
        application_deadline: applicationDeadline,
      });

      setShowDeadlineDialog(false);
      toast.success("Application deadline added!");

      // Then automatically publish
      setTimeout(async () => {
        try {
          await publishMutation.mutateAsync();
          toast.success("Advertisement published successfully!");
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to publish advertisement";
          toast.error(errorMessage);
        }
      }, 500);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update advertisement";
      toast.error(errorMessage);
    }
  };

  const handlePublish = async () => {
    // Validate required fields before publishing
    const missingFields: string[] = [];

    if (!advertisement.application_deadline) {
      missingFields.push("Application Deadline");
    }
    if (!advertisement.job_description || advertisement.job_description.trim() === "") {
      missingFields.push("Job Description");
    }
    if (!advertisement.key_responsibilities || advertisement.key_responsibilities.trim() === "") {
      missingFields.push("Key Responsibilities");
    }
    if (!advertisement.qualifications && !advertisement.qualifications_required) {
      missingFields.push("Qualifications");
    }

    if (missingFields.length > 0) {
      // If only application deadline is missing, offer quick add
      if (missingFields.length === 1 && missingFields[0] === "Application Deadline") {
        setShowDeadlineDialog(true);
        return;
      }

      toast.error(
        `Cannot publish: Please edit the advertisement and add: ${missingFields.join(", ")}`,
        { duration: 6000 }
      );
      return;
    }

    try {
      await publishMutation.mutateAsync();
      toast.success("Advertisement published successfully!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to publish advertisement";
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  // Calculate duration in months
  const duration = advertisement.start_date && advertisement.end_date
    ? differenceInMonths(new Date(advertisement.end_date), new Date(advertisement.start_date))
    : 0;

  // Check if advertisement is ready to publish
  const isReadyToPublish = () => {
    return !!(
      advertisement.application_deadline &&
      advertisement.job_description &&
      advertisement.key_responsibilities &&
      (advertisement.qualifications || advertisement.qualifications_required)
    );
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-700";
      case "PUBLISHED":
        return "bg-green-100 text-green-700";
      case "CLOSED":
        return "bg-red-100 text-red-700";
      case "CANCELLED":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-[49.5%]">
      <Card className="flex flex-col gap-y-[.625rem] w-full min-h-[25rem] justify-between relative p-[2rem]">
        <div className="w-full space-y-[1.5rem]">
          {/* Header with Date and Status */}
          <div className="flex justify-between items-center">
            <p className="bg-[#8C6400] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-white text-sm">
              <span className="font-medium">Posted: </span>
              {advertisement.created_datetime && isValid(new Date(advertisement.created_datetime))
                ? format(new Date(advertisement.created_datetime), "MMM dd, yyyy")
                : "Date not available"}
            </p>
            <p className={`text-[.625rem] py-1 px-[.625rem] w-fit rounded-full ${getStatusColor(advertisement.status)}`}>
              {advertisement.status_display}
            </p>
          </div>

          {/* Title and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-black text-[1.25rem]" title="Advertisement Title">
                {advertisement.position_title}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {advertisement.advertisement_number}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {advertisement.status === "DRAFT" && (
                <>
                  {!isReadyToPublish() && (
                    <div className="flex items-center gap-1 text-orange-600 text-xs mr-2" title="Complete all required fields to publish">
                      <AlertTriangle size={16} />
                      <span className="hidden md:inline">Incomplete</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    onClick={handlePublish}
                    disabled={updateMutation.isPending || publishMutation.isPending}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    title={
                      isReadyToPublish()
                        ? "Publish Advertisement"
                        : "Complete all required fields before publishing"
                    }
                  >
                    <CheckCircle size={20} />
                  </Button>
                </>
              )}
              <Link
                href={{
                  pathname: ProgramRoutes.CREATE_ADHOC_DETAILS,
                  search: `?id=${advertisement.id}`,
                }}
              >
                <Button variant="ghost" title="Edit Advertisement">
                  <PencilIcon />
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(true)}
                disabled={advertisement.status !== "DRAFT"}
                title="Delete Advertisement"
              >
                <DeleteIcon />
              </Button>
            </div>
          </div>

          {/* Details Tags */}
          <div className="w-full flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem]">
            <DetailsTag
              icon={<PeoplePositionsSvg />}
              label={`${advertisement.number_of_positions} ${advertisement.number_of_positions === 1 ? 'position' : 'positions'}`}
            />

            <DetailsTag
              icon={<ClockTimingSvg />}
              label={`${duration} ${duration === 1 ? 'month' : 'months'}`}
            />

            {advertisement.end_date && (
              <DetailsTag
                icon={<DataCalenderSvg />}
                label={
                  isValid(new Date(advertisement.end_date))
                    ? format(new Date(advertisement.end_date), "MMM dd, yyyy")
                    : "Date not available"
                }
              />
            )}

            <DetailsTag
              icon={<LocationSvg />}
              label={advertisement.location_name || "Location not specified"}
            />

            <DetailsTag
              icon={<SuiteCase />}
              label={`₦${parseFloat(advertisement.proposed_salary || '0').toLocaleString()}/month`}
            />

            {/* Applicant Stats */}
            {advertisement.total_applicants !== undefined && (
              <DetailsTag
                icon={<Users size={16} />}
                label={`${advertisement.total_applicants} applicant${advertisement.total_applicants !== 1 ? 's' : ''}`}
              />
            )}
          </div>
        </div>

        {/* Footer with View Button */}
        <div className="relative">
          <div className="space-y-2">
            {advertisement.qualifications && (
              <p className="text-sm text-gray-600 line-clamp-2">
                <span className="font-medium">Requirements: </span>
                {advertisement.qualifications}
              </p>
            )}
            {advertisement.application_deadline && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Deadline: </span>
                {isValid(new Date(advertisement.application_deadline))
                  ? format(new Date(advertisement.application_deadline), "MMM dd, yyyy")
                  : "Not set"}
              </p>
            )}
          </div>

          <div className="w-full flex flex-col items-center justify-center absolute bottom-0 left-0 py-[.75rem] bg-gradient-to-b from-white/50 via-white/60 to-white/90">
            <div className="bg-white w-fit">
              <Link href={ProgramRoutes.ADHOC_DETAILS.replace(':id', advertisement.id)}>
                <Button className="bg-white text-primary z-[99] border border-[#00000012]">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <ConfirmationDialog
        open={isModalOpen}
        title="Delete Advertisement"
        description="Are you sure you want to delete this advertisement? This action cannot be undone."
        onCancel={() => setIsModalOpen(false)}
        onOk={handleDelete}
        loading={deleteMutation.isPending}
      />

      {/* Quick Add Application Deadline Dialog */}
      <Dialog open={showDeadlineDialog} onOpenChange={setShowDeadlineDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Application Deadline</DialogTitle>
            <DialogDescription>
              Set the deadline for applicants to submit their applications for this position.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deadline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Application Deadline *
              </Label>
              <Input
                id="deadline"
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <p className="text-xs text-muted-foreground">
                Applicants will be able to apply until this date
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeadlineDialog(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveDeadline}
              disabled={updateMutation.isPending || !applicationDeadline}
            >
              {updateMutation.isPending ? "Saving..." : "Save & Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const DetailsTag = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string | number;
}) => {
  return (
    <div className="flex items-center border border-[#C7CBD5] text-sm p-1 px-[.625rem] gap-x-[.25rem] rounded-full">
      {icon}
      <p>{label}</p>
    </div>
  );
};
