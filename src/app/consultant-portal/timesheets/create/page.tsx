"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Calendar, Info, Send } from "lucide-react";
import { useCreateTimesheet } from "@/features/consultant-portal/controllers/timesheetController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

export default function CreateTimesheetPage() {
  const router = useRouter();
  const { mutate: createTimesheet, isPending } = useCreateTimesheet();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
    }

    if (!activity.trim()) {
      newErrors.activity = "Activity/work done is required";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        newErrors.endDate = "End date must be on or after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    createTimesheet(
      {
        start_date: startDate,
        end_date: endDate,
        period_type: 'custom',
        activities: [
          {
            activity: activity.trim(),
            description: description.trim(),
            hours: 8, // Default hours
          }
        ],
        submit_immediately: true, // Auto-submit for supervisor approval
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Timesheet submitted for approval!");
          router.push(`/consultant-portal/timesheets`);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message ||
                             error?.message ||
                             "Failed to create timesheet";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Timesheet</h1>
          <p className="text-gray-600 mt-1">Submit your work for the period</p>
        </div>
      </div>

      {/* Timesheet Form */}
      <Card>
        <CardHeader>
          <CardTitle>Timesheet Details</CardTitle>
          <CardDescription>
            Enter the date range and describe what you did during this period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setErrors({ ...errors, startDate: "" });
                  }}
                  className={errors.startDate ? "border-red-500" : ""}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setErrors({ ...errors, endDate: "" });
                  }}
                  className={errors.endDate ? "border-red-500" : ""}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Activity */}
            <div className="space-y-2">
              <Label htmlFor="activity">What did you work on? *</Label>
              <Input
                id="activity"
                type="text"
                placeholder="e.g., Project coordination, Field research, Report writing"
                value={activity}
                onChange={(e) => {
                  setActivity(e.target.value);
                  setErrors({ ...errors, activity: "" });
                }}
                className={errors.activity ? "border-red-500" : ""}
              />
              {errors.activity && (
                <p className="text-sm text-red-500">{errors.activity}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Additional Details (Optional)</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Provide more details about your work during this period..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div className="font-semibold">Note:</div>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Your timesheet will be automatically submitted to your supervisor for approval</li>
                    <li>You'll receive a notification once it's been reviewed</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Timesheet
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
