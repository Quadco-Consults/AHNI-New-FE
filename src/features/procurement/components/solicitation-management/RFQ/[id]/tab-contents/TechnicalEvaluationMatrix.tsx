"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Card from "@/components/Card";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import TechnicalPrequalificationAPI from "@/features/procurement/controllers/technicalPrequalificationController";

interface TechnicalEvaluationMatrixProps {
  solicitationId: string;
}

const TechnicalEvaluationMatrix = ({
  solicitationId,
}: TechnicalEvaluationMatrixProps) => {
  const queryClient = useQueryClient();

  // State
  const [showCriteriaSelector, setShowCriteriaSelector] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [currentCbaId, setCurrentCbaId] = useState<string | null>(null);
  const [notesDialog, setNotesDialog] = useState<{
    open: boolean;
    bidId: string;
    criteriaId: string;
    notes: string;
    passed: boolean;
  }>({
    open: false,
    bidId: "",
    criteriaId: "",
    notes: "",
    passed: false,
  });

  // Fetch vendor submissions
  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetSolicitationSubmission(solicitationId, !!solicitationId);

  // Get all CBAs to find one for this solicitation
  const { data: cbaData } = CbaAPI.useGetAllCbas({});
  const existingCba = cbaData?.results?.find(
    (cba: any) => cba.solicitation?.id === solicitationId
  );

  // Fetch criteria library
  const { data: criteriaLibraryData, isLoading: criteriaLibraryLoading } =
    TechnicalPrequalificationAPI.useGetCriteriaLibrary({
      is_active: true,
      enabled: showCriteriaSelector,
    });

  // Fetch categories
  const { data: categoriesData } =
    TechnicalPrequalificationAPI.useGetCriteriaCategories(showCriteriaSelector);

  // Fetch evaluation matrix if CBA exists
  const { data: matrixData, isLoading: matrixLoading } =
    TechnicalPrequalificationAPI.useGetEvaluationMatrix(
      currentCbaId || "",
      !!currentCbaId
    );

  // Mutations
  const { createCba, isLoading: creating } = CbaAPI.useCreateCba();
  const { initializeCriteria, isLoading: initializing } =
    TechnicalPrequalificationAPI.useInitializeCriteriaFromLibrary();
  const { bulkEvaluate, isLoading: evaluating } =
    TechnicalPrequalificationAPI.useBulkEvaluate();
  const { completeEvaluation, isLoading: completing } =
    TechnicalPrequalificationAPI.useCompleteEvaluation(currentCbaId || "");

  // Set current CBA ID when found
  useEffect(() => {
    if (existingCba?.id) {
      setCurrentCbaId(existingCba.id);
    }
  }, [existingCba]);

  // Extract submissions
  const submissions =
    (submissionsData as any)?.data?.data?.results ||
    (submissionsData as any)?.data?.results ||
    [];

  // Handle CBA creation
  const handleCreateCba = async () => {
    try {
      const result = await createCba({
        solicitation: solicitationId,
        cba_date: new Date().toISOString().split("T")[0],
        status: "DRAFT",
      });

      if (result?.data?.id) {
        setCurrentCbaId(result.data.id);
        toast.success("CBA created successfully");
        queryClient.invalidateQueries({ queryKey: ["cbas"] });
        setShowCriteriaSelector(true);
      }
    } catch (error) {
      toast.error("Failed to create CBA");
      console.error(error);
    }
  };

  // Handle criteria initialization
  const handleInitializeCriteria = async () => {
    if (!currentCbaId || selectedCriteria.length === 0) {
      toast.error("Please select at least one criterion");
      return;
    }

    try {
      await initializeCriteria({
        cba_id: currentCbaId,
        criteria_ids: selectedCriteria,
      });

      toast.success(
        `Initialized ${selectedCriteria.length} criteria for evaluation`
      );
      queryClient.invalidateQueries({
        queryKey: ["technical-evaluation-matrix"],
      });
      setShowCriteriaSelector(false);
      setSelectedCriteria([]);
    } catch (error) {
      toast.error("Failed to initialize criteria");
      console.error(error);
    }
  };

  // Handle pass/fail toggle
  const handleToggleEvaluation = async (
    bidSubmissionId: string,
    criteriaId: string,
    currentPassed: boolean | null,
    notes: string = ""
  ) => {
    try {
      await bulkEvaluate({
        evaluations: [
          {
            bid_submission_id: bidSubmissionId,
            criteria_id: criteriaId,
            passed: currentPassed === null ? true : !currentPassed,
            notes,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["technical-evaluation-matrix"],
      });
    } catch (error) {
      toast.error("Failed to update evaluation");
      console.error(error);
    }
  };

  // Handle notes update
  const handleSaveNotes = async () => {
    try {
      await bulkEvaluate({
        evaluations: [
          {
            bid_submission_id: notesDialog.bidId,
            criteria_id: notesDialog.criteriaId,
            passed: notesDialog.passed,
            notes: notesDialog.notes,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["technical-evaluation-matrix"],
      });
      toast.success("Notes saved successfully");
      setNotesDialog({
        open: false,
        bidId: "",
        criteriaId: "",
        notes: "",
        passed: false,
      });
    } catch (error) {
      toast.error("Failed to save notes");
      console.error(error);
    }
  };

  // Handle complete evaluation
  const handleCompleteEvaluation = async () => {
    if (!currentCbaId) return;

    try {
      await completeEvaluation();
      toast.success("Technical evaluation completed and vendors shortlisted!");
      queryClient.invalidateQueries({
        queryKey: ["technical-evaluation-matrix"],
      });
      queryClient.invalidateQueries({ queryKey: ["cbas"] });
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to complete evaluation. Please ensure all vendors are evaluated."
      );
      console.error(error);
    }
  };

  // Render criteria selector dialog
  const renderCriteriaSelector = () => (
    <Dialog open={showCriteriaSelector} onOpenChange={setShowCriteriaSelector}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Technical Evaluation Criteria</DialogTitle>
          <DialogDescription>
            Choose criteria from the library to evaluate vendors for this RFQ.
            All selected criteria will be mandatory.
          </DialogDescription>
        </DialogHeader>

        {criteriaLibraryLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-4">
            {categoriesData?.data?.categories?.map((category: string) => {
              const categoryCriteria =
                criteriaLibraryData?.results?.filter(
                  (c: any) => c.category === category
                ) || [];

              return (
                <div key={category} className="space-y-2">
                  <h4 className="font-semibold text-sm">{category}</h4>
                  <div className="space-y-2 pl-4">
                    {categoryCriteria.map((criteria: any) => (
                      <div
                        key={criteria.id}
                        className="flex items-start space-x-2"
                      >
                        <Checkbox
                          checked={selectedCriteria.includes(criteria.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCriteria([
                                ...selectedCriteria,
                                criteria.id,
                              ]);
                            } else {
                              setSelectedCriteria(
                                selectedCriteria.filter(
                                  (id) => id !== criteria.id
                                )
                              );
                            }
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {criteria.criteria_name}
                          </p>
                          {criteria.description && (
                            <p className="text-xs text-gray-500">
                              {criteria.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCriteriaSelector(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleInitializeCriteria}
                disabled={selectedCriteria.length === 0 || initializing}
              >
                {initializing ? "Initializing..." : "Initialize Criteria"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // Render notes dialog
  const renderNotesDialog = () => (
    <Dialog
      open={notesDialog.open}
      onOpenChange={(open) =>
        setNotesDialog({ ...notesDialog, open })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Evaluation Notes</DialogTitle>
          <DialogDescription>
            Add notes or comments for this evaluation
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notesDialog.notes}
              onChange={(e) =>
                setNotesDialog({ ...notesDialog, notes: e.target.value })
              }
              placeholder="Enter evaluation notes..."
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setNotesDialog({ ...notesDialog, open: false })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleSaveNotes} disabled={evaluating}>
              {evaluating ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Loading state
  if (submissionsLoading || matrixLoading) {
    return <LoadingSpinner />;
  }

  // No submissions
  if (!submissions || submissions.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <Icon
            icon="mdi:file-document-alert-outline"
            className="mx-auto text-gray-400"
            width={64}
          />
          <h3 className="text-lg font-semibold">No Vendor Submissions</h3>
          <p className="text-gray-500">
            No vendor submissions found for this RFQ. Technical evaluation
            requires vendor submissions.
          </p>
        </div>
      </Card>
    );
  }

  // No CBA created yet
  if (!currentCbaId) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <Icon
            icon="mdi:clipboard-check-outline"
            className="mx-auto text-primary"
            width={64}
          />
          <h3 className="text-lg font-semibold">
            Initialize Technical Prequalification
          </h3>
          <p className="text-gray-500">
            Create evaluation criteria to begin technical prequalification for
            this National Open Tender RFQ.
          </p>
          <Button onClick={handleCreateCba} disabled={creating}>
            {creating ? "Creating..." : "Start Technical Evaluation"}
          </Button>
        </div>
      </Card>
    );
  }

  // No criteria initialized yet
  const criteria = matrixData?.data?.matrix?.criteria || [];
  if (criteria.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <Icon
            icon="mdi:format-list-checks"
            className="mx-auto text-primary"
            width={64}
          />
          <h3 className="text-lg font-semibold">Select Evaluation Criteria</h3>
          <p className="text-gray-500">
            Choose technical criteria from the library to evaluate vendors.
          </p>
          <Button onClick={() => setShowCriteriaSelector(true)}>
            Select Criteria
          </Button>
        </div>
        {renderCriteriaSelector()}
      </Card>
    );
  }

  // Main evaluation matrix
  const vendors = matrixData?.data?.matrix?.vendors || [];
  const cbaInfo = matrixData?.data?.cba;
  const evaluationComplete = cbaInfo?.technical_evaluation_completed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Technical Prequalification Matrix
            </h3>
            <p className="text-sm text-gray-500">
              Evaluate vendors against technical criteria. Vendors must pass all
              mandatory criteria to be shortlisted for CBA.
            </p>
            <div className="mt-4 flex gap-4">
              <Badge variant="outline">
                <Icon icon="mdi:account-group" className="mr-1" width={16} />
                {vendors.length} Vendors
              </Badge>
              <Badge variant="outline">
                <Icon icon="mdi:format-list-checks" className="mr-1" width={16} />
                {criteria.length} Criteria
              </Badge>
              {evaluationComplete && (
                <Badge className="bg-green-100 text-green-800">
                  <Icon icon="mdi:check-circle" className="mr-1" width={16} />
                  Evaluation Complete
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!evaluationComplete && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCriteriaSelector(true)}
                >
                  <Icon icon="mdi:plus" className="mr-1" width={16} />
                  Add Criteria
                </Button>
                <Button
                  size="sm"
                  onClick={handleCompleteEvaluation}
                  disabled={completing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Icon icon="mdi:check-circle" className="mr-1" width={16} />
                  {completing ? "Completing..." : "Complete Evaluation"}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Evaluation Matrix Table */}
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">S/N</TableHead>
              <TableHead className="min-w-[200px]">Vendor Name</TableHead>
              {criteria.map((criterion: any) => (
                <TableHead key={criterion.id} className="text-center min-w-[120px]">
                  <div className="space-y-1">
                    <div className="font-semibold text-xs">
                      Criterion {criterion.criteria_number}
                    </div>
                    <div
                      className="text-xs font-normal text-gray-600"
                      title={criterion.criteria_name}
                    >
                      {criterion.criteria_name.substring(0, 30)}
                      {criterion.criteria_name.length > 30 ? "..." : ""}
                    </div>
                    {criterion.is_mandatory && (
                      <Badge variant="destructive" className="text-[10px] px-1 py-0">
                        Mandatory
                      </Badge>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-center">Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor: any) => {
              const summary = vendor.summary;
              const isShortlisted = summary?.is_shortlisted;

              return (
                <TableRow
                  key={vendor.bid_submission_id}
                  className={cn(
                    isShortlisted && "bg-green-50"
                  )}
                >
                  <TableCell className="font-medium">{vendor.sn}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vendor.vendor_name}</p>
                      {isShortlisted && (
                        <Badge className="mt-1 bg-green-600 text-white text-[10px]">
                          <Icon icon="mdi:check-circle" className="mr-1" width={12} />
                          Shortlisted
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {criteria.map((criterion: any) => {
                    const evaluation =
                      vendor.evaluations[`criteria_${criterion.criteria_number}`];
                    const passed = evaluation?.passed;
                    const notes = evaluation?.notes || "";

                    return (
                      <TableCell key={criterion.id} className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Checkbox
                            checked={passed === true}
                            onCheckedChange={() =>
                              !evaluationComplete &&
                              handleToggleEvaluation(
                                vendor.bid_submission_id,
                                criterion.id,
                                passed,
                                notes
                              )
                            }
                            disabled={evaluationComplete}
                          />
                          {notes && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                !evaluationComplete &&
                                setNotesDialog({
                                  open: true,
                                  bidId: vendor.bid_submission_id,
                                  criteriaId: criterion.id,
                                  notes: notes,
                                  passed: passed || false,
                                })
                              }
                              disabled={evaluationComplete}
                            >
                              <Icon
                                icon="mdi:note-text"
                                width={16}
                                className="text-blue-600"
                              />
                            </Button>
                          )}
                          {!notes && passed !== null && !evaluationComplete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 hover:opacity-100"
                              onClick={() =>
                                setNotesDialog({
                                  open: true,
                                  bidId: vendor.bid_submission_id,
                                  criteriaId: criterion.id,
                                  notes: "",
                                  passed: passed || false,
                                })
                              }
                            >
                              <Icon icon="mdi:note-plus" width={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    {summary ? (
                      <div className="text-center space-y-1">
                        <div className="text-sm font-semibold">
                          {summary.criteria_passed}/{summary.total_criteria}
                        </div>
                        <div className="text-xs text-gray-500">
                          Mandatory: {summary.mandatory_criteria_passed}/
                          {summary.mandatory_criteria_count}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-gray-400">-</div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Summary Stats */}
      {matrixData?.data?.matrix?.summary && (
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Evaluation Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {matrixData.data.matrix.summary.total_vendors}
              </div>
              <div className="text-sm text-gray-500">Total Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {matrixData.data.matrix.summary.shortlisted_vendors}
              </div>
              <div className="text-sm text-gray-500">Shortlisted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {matrixData.data.matrix.summary.not_shortlisted}
              </div>
              <div className="text-sm text-gray-500">Not Shortlisted</div>
            </div>
          </div>
        </Card>
      )}

      {/* Render dialogs */}
      {renderCriteriaSelector()}
      {renderNotesDialog()}
    </div>
  );
};

export default TechnicalEvaluationMatrix;
