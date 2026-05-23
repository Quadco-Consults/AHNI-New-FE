"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Calendar, Info } from "lucide-react";
import { useCreateTimesheet } from "@/features/consultant-portal/controllers/timesheetController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

export default function CreateTimesheetPage() {
  const router = useRouter();
  const { mutate: createTimesheet, isPending } = useCreateTimesheet();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to get start of week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Helper function to get end of week (Sunday)
  const getWeekEnd = (start: Date) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  const handleQuickSelect = (type: 'current' | 'previous' | 'next') => {
    const today = new Date();
    let weekStart: Date;

    switch (type) {
      case 'current':
        weekStart = getWeekStart(today);
        break;
      case 'previous':
        const prevWeek = new Date(today);
        prevWeek.setDate(today.getDate() - 7);
        weekStart = getWeekStart(prevWeek);
        break;
      case 'next':
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        weekStart = getWeekStart(nextWeek);
        break;
      default:
        weekStart = getWeekStart(today);
    }

    const weekEnd = getWeekEnd(weekStart);

    setStartDate(weekStart.toISOString().split('T')[0]);
    setEndDate(weekEnd.toISOString().split('T')[0]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }

      // Check if it's a valid week (7 days)
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays !== 6) {
        newErrors.endDate = "Timesheet must be for a one-week period (Monday to Sunday)";
      }

      // Check if start is Monday
      if (start.getDay() !== 1) {
        newErrors.startDate = "Start date must be a Monday";
      }

      // Check if end is Sunday
      if (end.getDay() !== 0) {
        newErrors.endDate = "End date must be a Sunday";
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
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Timesheet created successfully!");
          router.push(`/consultant-portal/timesheets/${data.data.id}`);
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
          <p className="text-gray-600 mt-1">Start a new weekly timesheet</p>
        </div>
      </div>

      {/* Quick Week Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Week Selection</CardTitle>
          <CardDescription>Select a predefined week to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => handleQuickSelect('previous')}
              className="h-auto py-4 flex flex-col"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="font-semibold">Previous Week</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickSelect('current')}
              className="h-auto py-4 flex flex-col border-blue-500"
            >
              <Calendar className="h-6 w-6 mb-2 text-blue-500" />
              <span className="font-semibold">Current Week</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickSelect('next')}
              className="h-auto py-4 flex flex-col"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="font-semibold">Next Week</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timesheet Form */}
      <Card>
        <CardHeader>
          <CardTitle>Timesheet Period</CardTitle>
          <CardDescription>
            Timesheets must be for a full week (Monday to Sunday)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date (Monday) *</Label>
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

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Sunday) *</Label>
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

            {/* Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-semibold">Important Notes:</div>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Timesheets must start on Monday and end on Sunday</li>
                    <li>You can only have one timesheet per week</li>
                    <li>After creation, you'll be able to add time entries for each day</li>
                    <li>Weekends and leave days will be automatically blocked</li>
                    <li>Submit your timesheet for approval once all entries are added</li>
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Timesheet
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
