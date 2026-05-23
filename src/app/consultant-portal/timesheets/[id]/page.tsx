"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Info,
} from "lucide-react";
import {
  useTimesheetDetail,
  useProjects,
  useCreateTimesheetEntry,
  useDeleteTimesheetEntry,
  useSubmitTimesheet,
} from "@/features/consultant-portal/controllers/timesheetController";
import { LoadingSpinner } from "@/components/Loading";
import { toast } from "sonner";

export default function TimesheetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const timesheetId = params.id as string;

  const { data: timesheetData, isLoading, error } = useTimesheetDetail(timesheetId);
  const { data: projectsData } = useProjects();
  const createEntryMutation = useCreateTimesheetEntry();
  const deleteEntryMutation = useDeleteTimesheetEntry();
  const submitTimesheetMutation = useSubmitTimesheet();

  const timesheet = timesheetData?.data;
  const projects = projectsData?.data || [];

  // Form state
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [hoursWorked, setHoursWorked] = useState<string>("");
  const [customActivity, setCustomActivity] = useState<string>("");
  const [entryDescription, setEntryDescription] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  // Submit confirmation dialog
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500"><Edit className="h-3 w-3 mr-1" />Draft</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-500"><Send className="h-3 w-3 mr-1" />Submitted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const isDateBlocked = (date: string): { blocked: boolean; reason?: string } => {
    if (!timesheet) return { blocked: false };

    const blockedDate = timesheet.blocked_dates?.find(bd => bd.date === date);
    if (blockedDate) {
      return { blocked: true, reason: blockedDate.reason };
    }

    return { blocked: false };
  };

  const getAvailableDates = (): string[] => {
    if (!timesheet) return [];
    return timesheet.available_dates || [];
  };

  const getTotalHoursForDate = (date: string): number => {
    if (!timesheet?.entries) return 0;
    return timesheet.entries
      .filter(entry => entry.date === date)
      .reduce((sum, entry) => sum + entry.hours_worked, 0);
  };

  const validateEntryForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedProject) {
      errors.project = "Please select a project";
    }

    if (!selectedDate) {
      errors.date = "Please select a date";
    } else {
      const blockedCheck = isDateBlocked(selectedDate);
      if (blockedCheck.blocked) {
        errors.date = `This date is blocked: ${blockedCheck.reason}`;
      }

      const currentHours = getTotalHoursForDate(selectedDate);
      const newHours = parseFloat(hoursWorked || "0");
      if (currentHours + newHours > 24) {
        errors.hours = `Total hours for this date would exceed 24 hours (current: ${currentHours})`;
      }
    }

    if (!hoursWorked || parseFloat(hoursWorked) <= 0) {
      errors.hours = "Please enter valid hours worked";
    } else if (parseFloat(hoursWorked) > 24) {
      errors.hours = "Hours cannot exceed 24 for a single entry";
    }

    if (!customActivity.trim()) {
      errors.activity = "Please enter activity description";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEntry = async () => {
    if (!validateEntryForm()) return;

    try {
      await createEntryMutation.mutateAsync({
        timesheet_id: timesheetId,
        project_id: selectedProject,
        date: selectedDate,
        hours_worked: parseFloat(hoursWorked),
        custom_activity: customActivity,
        description: entryDescription,
      });

      toast.success("Time entry added successfully");

      // Reset form
      setSelectedProject("");
      setSelectedDate("");
      setHoursWorked("");
      setCustomActivity("");
      setEntryDescription("");
      setFormErrors({});
      setShowEntryForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add time entry");
    }
  };

  const handleDeleteEntry = async () => {
    if (!entryToDelete) return;

    try {
      await deleteEntryMutation.mutateAsync(entryToDelete);
      toast.success("Time entry deleted successfully");
      setShowDeleteDialog(false);
      setEntryToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete time entry");
    }
  };

  const handleSubmitTimesheet = async () => {
    try {
      await submitTimesheetMutation.mutateAsync(timesheetId);
      toast.success("Timesheet submitted successfully");
      setShowSubmitDialog(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit timesheet");
    }
  };

  const confirmDelete = (entryId: string) => {
    setEntryToDelete(entryId);
    setShowDeleteDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
        <span className="ml-2">Loading timesheet...</span>
      </div>
    );
  }

  if (error || !timesheet) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load timesheet. It may not exist or you don't have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const canEdit = timesheet.is_editable;
  const canSubmit = canEdit && timesheet.entry_count > 0;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Timesheet Details</h1>
            <p className="text-gray-600 mt-1">
              {formatDate(timesheet.start_date)} - {formatDate(timesheet.end_date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(timesheet.status)}
          {canSubmit && (
            <Button onClick={() => setShowSubmitDialog(true)}>
              <Send className="h-4 w-4 mr-2" />
              Submit Timesheet
            </Button>
          )}
        </div>
      </div>

      {/* Rejection Reason Alert */}
      {timesheet.status === 'rejected' && timesheet.rejection_reason && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold">Timesheet Rejected</div>
            <div className="text-sm mt-1">{timesheet.rejection_reason}</div>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="text-2xl font-bold">{timesheet.total_hours}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Time Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-green-500" />
              <div className="text-2xl font-bold">{timesheet.entry_count}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold capitalize">{timesheet.status}</div>
            {timesheet.submitted_datetime && (
              <div className="text-sm text-gray-600 mt-1">
                Submitted: {formatDateShort(timesheet.submitted_datetime)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Time Entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>
                Track your daily hours and activities
              </CardDescription>
            </div>
            {canEdit && (
              <Button onClick={() => setShowEntryForm(!showEntryForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Entry Form */}
          {showEntryForm && canEdit && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project">Project *</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger id="project" className={formErrors.project ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title} {project.project_code && `(${project.project_code})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.project && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.project}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger id="date" className={formErrors.date ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a date" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableDates().map((date) => {
                          const totalHours = getTotalHoursForDate(date);
                          return (
                            <SelectItem key={date} value={date}>
                              {formatDateShort(date)} {totalHours > 0 && `(${totalHours}h logged)`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {formErrors.date && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.date}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="hours">Hours Worked *</Label>
                    <Input
                      id="hours"
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={hoursWorked}
                      onChange={(e) => setHoursWorked(e.target.value)}
                      placeholder="e.g., 8"
                      className={formErrors.hours ? "border-red-500" : ""}
                    />
                    {formErrors.hours && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.hours}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="activity">Activity *</Label>
                    <Input
                      id="activity"
                      value={customActivity}
                      onChange={(e) => setCustomActivity(e.target.value)}
                      placeholder="e.g., Development, Meeting, Research"
                      className={formErrors.activity ? "border-red-500" : ""}
                    />
                    {formErrors.activity && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.activity}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={entryDescription}
                      onChange={(e) => setEntryDescription(e.target.value)}
                      placeholder="Provide additional details about your work..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleAddEntry}
                    disabled={createEntryMutation.isPending}
                  >
                    {createEntryMutation.isPending ? (
                      <>
                        <LoadingSpinner />
                        <span className="ml-2">Adding...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Entry
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEntryForm(false);
                      setFormErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Entries List */}
          {timesheet.entries && timesheet.entries.length > 0 ? (
            <div className="space-y-3">
              {timesheet.entries
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">{formatDateShort(entry.date)}</Badge>
                          <Badge className="bg-blue-500">{entry.hours_worked}h</Badge>
                          <span className="font-semibold">{entry.project.title}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Activity:</span> {entry.activity_name || entry.is_custom_activity}
                        </div>
                        {entry.description && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Description:</span> {entry.description}
                          </div>
                        )}
                      </div>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(entry.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Time Entries</h3>
              <p className="text-gray-600 mb-4">
                Add your first time entry to start tracking your hours.
              </p>
              {canEdit && !showEntryForm && (
                <Button onClick={() => setShowEntryForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approver Information */}
      {timesheet.approver && (
        <Card>
          <CardHeader>
            <CardTitle>Approver Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-semibold mt-1">{timesheet.approver.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-semibold mt-1">{timesheet.approver.email}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="font-semibold mb-2">Timesheet Guidelines</div>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Add time entries for each day you worked during the week</li>
            <li>Maximum 24 hours can be logged per day across all entries</li>
            <li>Ensure all entries are accurate before submitting</li>
            <li>Once submitted, the timesheet cannot be edited until reviewed</li>
            <li>Contact your approver if you have questions: {timesheet.approver?.name}</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Time Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this time entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEntry}
              disabled={deleteEntryMutation.isPending}
            >
              {deleteEntryMutation.isPending ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Deleting...</span>
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Timesheet</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this timesheet for approval? Once submitted, you won't be able to make changes until it's reviewed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-sm text-gray-600">
              <div className="font-semibold mb-2">Summary:</div>
              <ul className="space-y-1">
                <li>Total Hours: {timesheet.total_hours}</li>
                <li>Time Entries: {timesheet.entry_count}</li>
                <li>Period: {formatDate(timesheet.start_date)} - {formatDate(timesheet.end_date)}</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitTimesheet}
              disabled={submitTimesheetMutation.isPending}
            >
              {submitTimesheetMutation.isPending ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
