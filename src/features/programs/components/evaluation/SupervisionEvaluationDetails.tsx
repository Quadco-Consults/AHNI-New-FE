"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  FileTextIcon,
  StarIcon,
  AlertTriangleIcon,
  PlusIcon,
  TrashIcon,
  SaveIcon,
  SendIcon,
} from "lucide-react";
import {
  useGetSingleSupervisionEvaluation,
  useGetEvaluationResponses,
  useUpdateEvaluationResponse,
  useCompleteSupervisionEvaluation,
} from "../../controllers/supervisionEvaluationController";
import {
  CompleteEvaluationSchema,
  CompleteEvaluationFormData,
  SupervisionEvaluationStatus,
  SupervisionEvaluationStatusLabels,
  EvaluationRatingScale,
  EvaluationRatingLabels,
  EvaluationQuestionType,
  IActionItem,
} from "../../types/supervision-evaluation";
import { formatDate, formatDateTime } from "@/utils/date";

interface SupervisionEvaluationDetailsProps {
  evaluationId: string;
}

interface ActionItemForm {
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assigned_to?: string;
  due_date?: string;
}

export default function SupervisionEvaluationDetails({
  evaluationId
}: SupervisionEvaluationDetailsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [actionItems, setActionItems] = useState<ActionItemForm[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});

  // API hooks
  const { data: evaluationData, isLoading } = useGetSingleSupervisionEvaluation(evaluationId);
  const { data: responsesData } = useGetEvaluationResponses(evaluationId);
  const updateResponseMutation = useUpdateEvaluationResponse(evaluationId);
  const completeEvaluationMutation = useCompleteSupervisionEvaluation(evaluationId);

  // Form for completion
  const completionForm = useForm<CompleteEvaluationFormData>({
    resolver: zodResolver(CompleteEvaluationSchema),
    defaultValues: {
      recommendations: "",
      follow_up_required: false,
      follow_up_date: "",
      follow_up_notes: "",
    },
  });

  const evaluation = evaluationData?.data;
  const isReadOnly = evaluation?.status === SupervisionEvaluationStatus.COMPLETED;
  const canEdit = evaluation?.status === SupervisionEvaluationStatus.IN_PROGRESS ||
                  evaluation?.status === SupervisionEvaluationStatus.PENDING;

  // Initialize responses when data loads
  useEffect(() => {
    if (responsesData?.results) {
      const responseMap: Record<string, any> = {};
      responsesData.results.forEach(response => {
        responseMap[response.criteria_id] = {
          response_value: response.response_value,
          rating_value: response.rating_value,
          text_response: response.text_response,
          comments: response.comments,
        };
      });
      setResponses(responseMap);
    }
  }, [responsesData]);

  // Initialize action items if editing
  useEffect(() => {
    if (evaluation?.action_items) {
      setActionItems(evaluation.action_items.map(item => ({
        description: item.description,
        priority: item.priority,
        assigned_to: item.assigned_to,
        due_date: item.due_date,
      })));
    }
  }, [evaluation]);

  // Handle response updates
  const handleResponseChange = async (criteriaId: string, field: string, value: any) => {
    if (isReadOnly) return;

    const newResponse = {
      ...responses[criteriaId],
      [field]: value,
    };

    setResponses(prev => ({
      ...prev,
      [criteriaId]: newResponse,
    }));

    // Debounced save (in a real app, you'd want to implement proper debouncing)
    try {
      await updateResponseMutation.mutateAsync({
        criteria_id: criteriaId,
        ...newResponse,
      });
    } catch (error) {
      // Handle error silently for now
      console.error("Failed to save response:", error);
    }
  };

  // Action items management
  const addActionItem = () => {
    setActionItems(prev => [...prev, {
      description: "",
      priority: "MEDIUM",
      assigned_to: "",
      due_date: "",
    }]);
  };

  const removeActionItem = (index: number) => {
    setActionItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateActionItem = (index: number, field: keyof ActionItemForm, value: string) => {
    setActionItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  // Complete evaluation
  const onCompleteEvaluation = async (data: CompleteEvaluationFormData) => {
    try {
      await completeEvaluationMutation.mutateAsync({
        ...data,
        action_items: actionItems.filter(item => item.description.trim() !== ""),
      });

      toast.success("Evaluation completed successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to complete evaluation");
    }
  };

  // Calculate completion progress
  const calculateProgress = () => {
    if (!evaluation || !responsesData?.results) return 0;

    const totalCriteria = evaluation.selected_criteria.length;
    const answeredCriteria = responsesData.results.filter(response =>
      response.response_value !== null ||
      response.rating_value !== null ||
      response.text_response
    ).length;

    return totalCriteria > 0 ? Math.round((answeredCriteria / totalCriteria) * 100) : 0;
  };

  const progress = calculateProgress();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Evaluation not found</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{evaluation.title}</h1>
            <Badge
              variant={
                evaluation.status === SupervisionEvaluationStatus.COMPLETED
                  ? "default"
                  : evaluation.status === SupervisionEvaluationStatus.IN_PROGRESS
                  ? "secondary"
                  : "outline"
              }
            >
              {SupervisionEvaluationStatusLabels[evaluation.status]}
            </Badge>
            {evaluation.overall_score && (
              <Badge variant="outline">
                Score: {Math.round(evaluation.overall_score * 10) / 10}/5
              </Badge>
            )}
          </div>
          <p className="text-gray-600">{evaluation.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          {canEdit && (
            <Button onClick={() => setActiveTab("completion")}>
              <SendIcon className="h-4 w-4 mr-2" />
              Complete Evaluation
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      {canEdit && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Completion Progress</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              {responsesData?.results?.length || 0} of {evaluation.selected_criteria.length} criteria completed
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="completion">Complete</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Evaluation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Evaluation Date:</span>
                    <p>{formatDate(evaluation.evaluation_date)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Created:</span>
                    <p>{formatDate(evaluation.created_datetime)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Evaluator:</span>
                    <p>{evaluation.evaluator_name}</p>
                  </div>
                  {evaluation.completed_date && (
                    <div>
                      <span className="font-medium text-gray-600">Completed:</span>
                      <p>{formatDate(evaluation.completed_date)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm">
                  <div className="mb-2">
                    <span className="font-medium text-gray-600">Location:</span>
                    <p>{evaluation.location_name}</p>
                  </div>
                  {evaluation.facility_name && (
                    <div className="mb-2">
                      <span className="font-medium text-gray-600">Facility:</span>
                      <p>{evaluation.facility_name}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-600">Site Visit:</span>
                    <p>{evaluation.site_visit_title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Categories ({evaluation.selected_categories.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.selected_categories.map((categoryId, index) => (
                      <Badge key={categoryId} variant="secondary">
                        Category {index + 1}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Criteria ({evaluation.selected_criteria.length})
                  </h4>
                  <p className="text-sm text-gray-600">
                    {evaluation.selected_criteria.length} evaluation criteria selected across {evaluation.selected_categories.length} categories
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluation Tab */}
        <TabsContent value="evaluation" className="space-y-6">
          {evaluation.selected_categories.map((categoryId, categoryIndex) => {
            const categoryResponses = responsesData?.results?.filter(r =>
              evaluation.selected_criteria.includes(r.criteria_id)
            ) || [];

            return (
              <Card key={categoryId}>
                <CardHeader>
                  <CardTitle>Category {categoryIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {evaluation.selected_criteria.map((criteriaId, criteriaIndex) => {
                    const response = responses[criteriaId] || {};

                    return (
                      <div key={criteriaId} className="border border-gray-200 rounded-lg p-4">
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Criteria {criteriaIndex + 1}
                          </h4>
                          {/* In a real implementation, you'd fetch the criteria details */}
                          <p className="text-sm text-gray-600">Criteria ID: {criteriaId}</p>
                        </div>

                        <div className="space-y-4">
                          {/* Rating Response */}
                          <div>
                            <Label className="text-sm font-medium">Rating (1-5)</Label>
                            <RadioGroup
                              value={response.rating_value?.toString() || ""}
                              onValueChange={(value) =>
                                handleResponseChange(criteriaId, "rating_value", parseInt(value))
                              }
                              className="flex gap-4 mt-2"
                              disabled={isReadOnly}
                            >
                              {Object.entries(EvaluationRatingLabels).map(([value, label]) => (
                                <div key={value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={value} id={`${criteriaId}-${value}`} />
                                  <Label htmlFor={`${criteriaId}-${value}`} className="text-sm">
                                    {value} - {label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>

                          {/* Text Response */}
                          <div>
                            <Label htmlFor={`text-${criteriaId}`} className="text-sm font-medium">
                              Additional Notes
                            </Label>
                            <Textarea
                              id={`text-${criteriaId}`}
                              value={response.text_response || ""}
                              onChange={(e) =>
                                handleResponseChange(criteriaId, "text_response", e.target.value)
                              }
                              placeholder="Enter detailed observations, comments, or explanations..."
                              className="mt-1"
                              rows={3}
                              disabled={isReadOnly}
                            />
                          </div>

                          {/* Comments */}
                          <div>
                            <Label htmlFor={`comments-${criteriaId}`} className="text-sm font-medium">
                              Comments
                            </Label>
                            <Textarea
                              id={`comments-${criteriaId}`}
                              value={response.comments || ""}
                              onChange={(e) =>
                                handleResponseChange(criteriaId, "comments", e.target.value)
                              }
                              placeholder="Additional comments or recommendations..."
                              className="mt-1"
                              rows={2}
                              disabled={isReadOnly}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {evaluation.status === SupervisionEvaluationStatus.COMPLETED ? (
            <div className="space-y-6">
              {/* Score Summary */}
              {evaluation.category_scores && (
                <Card>
                  <CardHeader>
                    <CardTitle>Category Scores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {evaluation.category_scores.map((score) => (
                        <div key={score.category_id} className="flex items-center justify-between">
                          <span className="font-medium">{score.category_name}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={score.percentage_score} className="w-24 h-2" />
                            <span className="text-sm font-medium">
                              {score.percentage_score}% ({score.total_score}/{score.max_possible_score})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {evaluation.recommendations && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{evaluation.recommendations}</p>
                  </CardContent>
                </Card>
              )}

              {/* Action Items */}
              {evaluation.action_items && evaluation.action_items.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Action Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {evaluation.action_items.map((item, index) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{item.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <Badge variant={
                                  item.priority === 'HIGH' ? 'destructive' :
                                  item.priority === 'MEDIUM' ? 'secondary' : 'outline'
                                }>
                                  {item.priority}
                                </Badge>
                                {item.assigned_to_name && (
                                  <span>Assigned to: {item.assigned_to_name}</span>
                                )}
                                {item.due_date && (
                                  <span>Due: {formatDate(item.due_date)}</span>
                                )}
                              </div>
                            </div>
                            <Badge variant={
                              item.status === 'COMPLETED' ? 'default' :
                              item.status === 'IN_PROGRESS' ? 'secondary' : 'outline'
                            }>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Results Not Available</h3>
                <p className="text-gray-600">
                  Complete the evaluation to view detailed results and scores.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Completion Tab */}
        <TabsContent value="completion" className="space-y-6">
          {canEdit ? (
            <form onSubmit={completionForm.handleSubmit(onCompleteEvaluation)} className="space-y-6">
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    {...completionForm.register("recommendations")}
                    placeholder="Enter your overall recommendations based on the evaluation..."
                    rows={5}
                  />
                </CardContent>
              </Card>

              {/* Action Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Action Items
                    <Button type="button" variant="outline" size="sm" onClick={addActionItem}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Action Item
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {actionItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Action Item {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActionItem(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label>Description *</Label>
                          <Textarea
                            value={item.description}
                            onChange={(e) => updateActionItem(index, "description", e.target.value)}
                            placeholder="Describe the action item..."
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label>Priority</Label>
                          <Select
                            value={item.priority}
                            onValueChange={(value) => updateActionItem(index, "priority", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="HIGH">High</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="LOW">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Due Date</Label>
                          <Input
                            type="date"
                            value={item.due_date}
                            onChange={(e) => updateActionItem(index, "due_date", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {actionItems.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <p>No action items added yet.</p>
                      <p className="text-sm">Click "Add Action Item" to create recommendations for improvement.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Follow-up */}
              <Card>
                <CardHeader>
                  <CardTitle>Follow-up Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="follow_up_required"
                      {...completionForm.register("follow_up_required")}
                      className="rounded"
                    />
                    <Label htmlFor="follow_up_required">Follow-up evaluation required</Label>
                  </div>

                  {completionForm.watch("follow_up_required") && (
                    <div className="space-y-4 ml-6">
                      <div>
                        <Label htmlFor="follow_up_date">Follow-up Date</Label>
                        <Input
                          id="follow_up_date"
                          type="date"
                          {...completionForm.register("follow_up_date")}
                        />
                        {completionForm.formState.errors.follow_up_date && (
                          <p className="text-red-500 text-sm mt-1">
                            {completionForm.formState.errors.follow_up_date.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="follow_up_notes">Follow-up Notes</Label>
                        <Textarea
                          id="follow_up_notes"
                          {...completionForm.register("follow_up_notes")}
                          placeholder="Enter notes about the follow-up evaluation..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline">
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  loading={completeEvaluationMutation.isPending}
                  disabled={progress < 100}
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  Complete Evaluation
                </Button>
              </div>

              {progress < 100 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
                    <p className="text-yellow-800">
                      Please complete all evaluation criteria before submitting ({progress}% completed).
                    </p>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Evaluation Completed</h3>
                <p className="text-gray-600">
                  This evaluation has been completed and cannot be modified.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}