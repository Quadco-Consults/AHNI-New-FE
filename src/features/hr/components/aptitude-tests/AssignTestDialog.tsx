"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AptitudeTest, BulkAssignTestForm } from "@/features/hr/types";
import { useBulkAssignTest } from "@/features/hr/controllers/aptitudeTestController";
import { useGetJobApplications } from "@/features/hr/controllers/hrJobApplicationsController";
import { Loading } from "@/components/Loading";
import { Calendar } from "lucide-react";

interface AssignTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: AptitudeTest;
  advertisementId: string;
}

const AssignTestDialog = ({
  open,
  onOpenChange,
  test,
  advertisementId,
}: AssignTestDialogProps) => {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const { data: applicationsData, isLoading } = useGetJobApplications(
    {
      advertisement: advertisementId,
      status: "SHORTLISTED", // Only show shortlisted candidates
    },
    open
  );

  const bulkAssign = useBulkAssignTest();

  const applications = applicationsData?.data || [];

  const form = useForm({
    defaultValues: {
      due_date: "",
    },
  });

  useEffect(() => {
    if (selectAll) {
      setSelectedApplicants(applications.map((app: any) => app.id));
    } else {
      setSelectedApplicants([]);
    }
  }, [selectAll, applications]);

  const toggleApplicant = (applicantId: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(applicantId)
        ? prev.filter((id) => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const onSubmit = async (data: any) => {
    const assignData: BulkAssignTestForm = {
      test_id: test.id,
      application_ids: selectedApplicants,
      due_date: data.due_date,
    };

    await bulkAssign.mutateAsync(assignData);
    onOpenChange(false);
    setSelectedApplicants([]);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Test to Candidates</DialogTitle>
          <DialogDescription>
            Select shortlisted candidates to assign &quot;{test.title}&quot;. They will receive
            an email with a unique test link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due_date">Test Due Date *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="due_date"
                type="datetime-local"
                className="pl-10"
                {...form.register("due_date", { required: true })}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Candidates must complete the test before this deadline
            </p>
          </div>

          {/* Candidates Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Candidates</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => setSelectAll(!!checked)}
                />
                <span className="text-sm">Select All</span>
              </div>
            </div>

            {isLoading ? (
              <Loading />
            ) : applications.length === 0 ? (
              <div className="border rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  No shortlisted candidates found for this job advertisement.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please shortlist candidates before assigning tests.
                </p>
              </div>
            ) : (
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={(checked) => setSelectAll(!!checked)}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Application Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application: any) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedApplicants.includes(application.id)}
                            onCheckedChange={() => toggleApplicant(application.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {application.first_name} {application.last_name}
                        </TableCell>
                        <TableCell>{application.email}</TableCell>
                        <TableCell>{application.phone_number}</TableCell>
                        <TableCell>
                          {new Date(application.created_datetime).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              {selectedApplicants.length} candidate(s) selected
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedApplicants([]);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                bulkAssign.isPending ||
                selectedApplicants.length === 0 ||
                !form.watch("due_date")
              }
            >
              {bulkAssign.isPending
                ? "Assigning..."
                : `Assign Test to ${selectedApplicants.length} Candidate(s)`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTestDialog;
