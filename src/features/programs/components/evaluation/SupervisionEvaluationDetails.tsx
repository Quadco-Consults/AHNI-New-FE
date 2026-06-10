"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import FormRadio from "@/components/atoms/FormRadio";
import FormInput from "@/components/atoms/FormInput";
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
  ExternalLinkIcon,
  ClipboardList,
} from "lucide-react";
import {
  useGetSingleSupervisionEvaluation,
  useGetEvaluationResponses,
  useUpdateEvaluationResponse,
  useCompleteSupervisionEvaluation,
} from "../../controllers/supervisionEvaluationController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import {
  useGetEvaluationCategories,
  useGetEvaluationCategoryCriteria,
} from "../../controllers/evaluationCategoriesController";
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
  const { data: evaluationData, isLoading, error: evaluationError } = useGetSingleSupervisionEvaluation(evaluationId);
  const { data: responsesData, isLoading: isLoadingResponses, error: responsesError } = useGetEvaluationResponses(evaluationId);
  const updateResponseMutation = useUpdateEvaluationResponse(evaluationId);
  const completeEvaluationMutation = useCompleteSupervisionEvaluation(evaluationId);

  // Debug: Log API fetch status
  React.useEffect(() => {
    console.log("🔍 API Fetch Status:", {
      evaluationId,
      isLoading,
      hasEvaluationData: !!evaluationData,
      evaluationData: evaluationData,
      evaluationError: evaluationError,
      hasError: !!evaluationError,
    });
  }, [evaluationId, isLoading, evaluationData, evaluationError]);


  // Fetch categories and criteria for the evaluation
  const { data: categoriesData } = useGetEvaluationCategories(true);

  // Create a map of category ID to category data for easy lookup
  const categoriesMap = React.useMemo(() => {
    // The hook returns the data directly as an array
    const categories = categoriesData || [];
    const map = new Map();
    if (Array.isArray(categories)) {
      categories.forEach(category => map.set(category.id, category));
    }
    return map;
  }, [categoriesData]);

  // Create a map of criteria ID to criteria data
  const [criteriaMap, setCriteriaMap] = useState<Map<string, any>>(new Map());

  // Fetch criteria for all selected categories
  React.useEffect(() => {
    // Note: retrieve endpoint returns data directly (not wrapped in .data)
    const currentEvaluation = evaluationData;

    // Try both field names: selected_categories/criteria and categories/criteria
    const evaluationCategories = currentEvaluation?.selected_categories || currentEvaluation?.categories;
    const evaluationCriteria = currentEvaluation?.selected_criteria || currentEvaluation?.criteria;

    console.log("🔍 Current Evaluation for criteria fetch:", {
      currentEvaluation,
      selected_categories: currentEvaluation?.selected_categories,
      selected_criteria: currentEvaluation?.selected_criteria,
      categories: currentEvaluation?.categories,
      criteria: currentEvaluation?.criteria,
      evaluationCategories,
      evaluationCriteria,
      categoriesData: categoriesData?.length || 0
    });

    if (!evaluationCategories) {
      console.log("❌ Criteria fetch skipped:", {
        hasSelectedCategories: !!currentEvaluation?.selected_categories,
        hasCategories: !!currentEvaluation?.categories,
        hasEvaluationCategories: !!evaluationCategories,
        evaluationCategoriesLength: evaluationCategories?.length,
        hasCategoriesData: !!categoriesData,
        categoriesDataLength: categoriesData?.length
      });
      return;
    }

    console.log("✅ Criteria fetch proceeding:", {
      evaluationCategories,
      categoriesDataAvailable: !!categoriesData
    });

    const fetchCriteria = async () => {
      const criteriaPromises = evaluationCategories.map(async (categoryId) => {
        try {
          // Use AxiosWithToken to fetch criteria for each category
          const response = await AxiosWithToken.get("programs/supervision-evaluation-criteria/", {
            params: {
              page: 1,
              size: 100,
              search: "",
              evaluation_category: categoryId
            }
          });
          console.log(`📊 Criteria API Response for category ${categoryId}:`, response.data);
          const criteria = response.data?.data?.results || response.data?.results || [];
          return { categoryId, criteria };
        } catch (error) {
          console.error(`Error fetching criteria for category ${categoryId}:`, error);
          return { categoryId, criteria: [] };
        }
      });

      const results = await Promise.all(criteriaPromises);
      const newCriteriaMap = new Map();

      results.forEach(({ categoryId, criteria }) => {
        console.log(`📝 Processing category ${categoryId}:`, criteria);
        criteria.forEach(criterion => {
          newCriteriaMap.set(criterion.id, { ...criterion, categoryId });
        });
      });

      console.log("✅ Criteria map created:", {
        mapSize: newCriteriaMap.size,
        criteriaIds: Array.from(newCriteriaMap.keys()),
        sampleCriterion: newCriteriaMap.size > 0 ? newCriteriaMap.values().next().value : null
      });

      setCriteriaMap(newCriteriaMap);
    };

    fetchCriteria();
  }, [evaluationData?.selected_categories, evaluationData?.categories]);

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

  // Note: retrieve endpoint returns data directly (not wrapped in .data)
  const evaluation = evaluationData;

  // Create unified responses data - use evaluation_items if responses endpoint is empty
  const unifiedResponsesData = useMemo(() => {
    // If we have responses from the dedicated endpoint, use those
    if (responsesData?.results && responsesData.results.length > 0) {
      return responsesData;
    }

    // Otherwise, convert evaluation_items to response format
    if (evaluation?.evaluation_items && evaluation.evaluation_items.length > 0) {
      const convertedResults = evaluation.evaluation_items.map(item => ({
        id: item.id,
        criteria_id: item.criteria,
        // Map all compliance-related fields
        compliance_status: item.compliance_status,     // 'YES'/'NO'/'NA'
        is_compliant: item.is_compliant,               // boolean
        response_value: item.is_compliant,             // for legacy support
        // Map all comment fields
        observations: item.observations,               // primary field
        text_response: item.observations,              // legacy support
        comments: item.observations,                   // legacy support
        recommendations: item.recommendations,
        rating_value: item.score,
        evidence: item.evidence,
        rating: item.rating,
        created_datetime: item.created_datetime,
        updated_datetime: item.updated_datetime
      }));

      return {
        results: convertedResults,
        count: convertedResults.length,
        next: null,
        previous: null
      };
    }

    return null;
  }, [responsesData, evaluation?.evaluation_items]);

  // Debug: Log evaluation and response data
  React.useEffect(() => {
    // Note: retrieve endpoint returns data directly (not wrapped in .data)
    const evalData = evaluationData;
    console.log("🔍 DETAILS PAGE DEBUG:", {
      evaluation: {
        id: evalData?.id,
        status: evalData?.status,
        overall_score: evalData?.overall_score,
        selected_categories: evalData?.selected_categories || [],
        selected_categories_count: (evalData?.selected_categories || []).length,
        selected_criteria: evalData?.selected_criteria || [],
        selected_criteria_count: (evalData?.selected_criteria || []).length,
        categories: evalData?.categories || [],
        criteria_names: evalData?.criteria_names || [],
        evaluation_items: evalData?.evaluation_items || [],
        evaluation_items_count: (evalData?.evaluation_items || []).length,
        // Sample first evaluation item to check data structure
        firstEvaluationItem: (evalData?.evaluation_items || [])[0],
      },
      responses: {
        rawResponses: responsesData?.results || [],
        rawCount: responsesData?.results?.length || 0,
        unifiedResponses: unifiedResponsesData?.results || [],
        unifiedCount: unifiedResponsesData?.results?.length || 0,
        // Sample first unified response to check conversion
        firstUnifiedResponse: (unifiedResponsesData?.results || [])[0],
      },
      maps: {
        categoriesMapSize: categoriesMap.size,
        criteriaMapSize: criteriaMap.size,
      }
    });

    // Warning if no responses
    if (!unifiedResponsesData?.results || unifiedResponsesData.results.length === 0) {
      console.warn("⚠️ NO UNIFIED RESPONSES AVAILABLE!");
      console.warn("   - Raw responses:", responsesData?.results?.length || 0);
      console.warn("   - Evaluation items:", (evalData?.evaluation_items || []).length);
      console.warn("   - Selected categories:", (evalData?.selected_categories || []).length);
      console.warn("   - Selected criteria:", (evalData?.selected_criteria || []).length);
    } else {
      // Log detailed info about the first few responses
      console.log("📊 Sample Unified Responses:", unifiedResponsesData.results.slice(0, 3).map((r: any) => ({
        criteria_id: r.criteria_id,
        compliance_status: r.compliance_status,
        is_compliant: r.is_compliant,
        observations: r.observations,
        text_response: r.text_response,
        comments: r.comments,
      })));
    }
  }, [evaluationData, responsesData, unifiedResponsesData, categoriesMap, criteriaMap]);

  const isReadOnly = evaluation?.status === SupervisionEvaluationStatus.COMPLETED;
  const canEdit = evaluation?.status === SupervisionEvaluationStatus.IN_PROGRESS ||
                  evaluation?.status === SupervisionEvaluationStatus.PENDING;

  // Initialize responses when data loads
  useEffect(() => {
    if (unifiedResponsesData?.results) {
      const responseMap: Record<string, any> = {};
      unifiedResponsesData.results.forEach((response: any) => {
        // Map backend compliance_status to frontend format
        let compliance_status;
        if (response.compliance_status === "YES") {
          compliance_status = "yes";
        } else if (response.compliance_status === "NO") {
          compliance_status = "no";
        } else if (response.compliance_status === "NA") {
          compliance_status = "na";
        }

        // Use observations field (primary backend field) for comments
        const comments = response.observations || response.comments || response.text_response || "";

        responseMap[response.criteria_id] = {
          compliance_status, // Converted to lowercase for RadioGroup
          response_value: response.response_value,
          rating_value: response.rating_value,
          text_response: comments,  // Use observations as primary source
          comments: comments,       // Also set comments field
        };
      });

      console.log("📝 Responses Map Populated:", {
        totalResponses: Object.keys(responseMap).length,
        sampleResponse: Object.values(responseMap)[0],
        criteriaIds: Object.keys(responseMap).slice(0, 5)
      });

      setResponses(responseMap);
    }
  }, [unifiedResponsesData]);

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

  // Save progress function
  const handleSaveProgress = async () => {
    try {
      const responsesToSave = Object.entries(responses)
        .filter(([_, response]) => response.compliance_status || response.comments)
        .map(([criteriaId, response]) => {
          // Map frontend "yes"/"no" to backend "YES"/"NO"/"NA"
          let compliance_status;
          if (response.compliance_status === "yes") {
            compliance_status = "YES";
          } else if (response.compliance_status === "no") {
            compliance_status = "NO";
          } else if (response.compliance_status === "na") {
            compliance_status = "NA";
          }

          return {
            criteria_id: criteriaId,
            compliance_status,  // New field matching backend
            observations: response.comments || "",  // Backend field name
          };
        });

      console.log("💾 Saving responses:", responsesToSave);

      if (responsesToSave.length === 0) {
        toast.warning("No responses to save. Please make at least one selection or add a comment.");
        return;
      }

      // Save each response individually
      let savedCount = 0;
      for (const response of responsesToSave) {
        try {
          console.log(`📤 Attempting to save response:`, response);
          const result = await updateResponseMutation.mutateAsync(response);
          console.log(`✅ Successfully saved response for criteria ${response.criteria_id}:`, result);
          savedCount++;
        } catch (error: any) {
          console.error(`❌ Error saving response for criteria ${response.criteria_id}:`, {
            error,
            response: error.response?.data,
            status: error.response?.status,
            statusText: error.response?.statusText,
            requestData: response
          });
          // Continue with other responses even if one fails
        }
      }

      if (savedCount > 0) {
        toast.success(`Successfully saved ${savedCount} response(s)!`);
        // Refresh the evaluation data
        router.refresh();
      } else {
        toast.error("Failed to save responses. Please try again.");
      }
    } catch (error: any) {
      console.error("Save progress error:", error);
      toast.error(error.message || "Failed to save progress");
    }
  };

  // Handle response updates
  const handleResponseChange = (criteriaId: string, field: string, value: any) => {
    if (isReadOnly) return;

    const newResponse = {
      ...responses[criteriaId],
      [field]: value,
    };

    setResponses(prev => ({
      ...prev,
      [criteriaId]: newResponse,
    }));

    // Note: Auto-save removed - user must click "Save Progress" button
    // This matches the physical form workflow where evaluators fill out the form
    // and submit it all at once
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
    if (!evaluation) return 0;

    const totalCriteria = evaluation.selected_criteria?.length || 0;

    // Count both saved responses and current local responses
    const savedAnswered = responsesData?.results?.filter(response =>
      response.compliance_status // Only count if Yes/No is selected
    ).length || 0;

    const localAnswered = Object.values(responses).filter(response =>
      response.compliance_status // Count local responses with Yes/No selected
    ).length;

    // Use the higher count to reflect current progress including unsaved changes
    const answeredCriteria = Math.max(savedAnswered, localAnswered);

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
      <div className="text-center py-8 space-y-4">
        <p className="text-gray-500">Evaluation not found</p>
        {evaluationError && (
          <div className="text-red-600 text-sm">
            <p className="font-semibold">Error Details:</p>
            <p>{String(evaluationError)}</p>
          </div>
        )}
        <div className="text-xs text-gray-400">
          <p>Evaluation ID: {evaluationId}</p>
          <p>Check browser console for more details</p>
        </div>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none p-6 space-y-6">
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
            {evaluation.overall_score !== null && evaluation.overall_score !== undefined && (
              <Badge variant="outline">
                Score: {Math.round(evaluation.overall_score * 10) / 10}%
              </Badge>
            )}
          </div>
          <p className="text-gray-600">{evaluation.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          {evaluation.status === "COMPLETED" && (
            <Button variant="outline" onClick={() => router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluation.id}/report`)}>
              <FileTextIcon className="h-4 w-4 mr-2" />
              View Report
            </Button>
          )}
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
              {responsesData?.results?.length || 0} of {evaluation.selected_criteria?.length || 0} criteria completed
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
                    Categories ({evaluation.selected_categories?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {evaluation.selected_categories?.map((categoryId, index) => {
                      const category = categoriesMap.get(categoryId);
                      return (
                        <Badge key={categoryId} variant="secondary">
                          {category?.name || `Category ${index + 1}`}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Criteria ({evaluation.selected_criteria?.length || 0})
                  </h4>
                  <p className="text-sm text-gray-600">
                    {evaluation.selected_criteria?.length || 0} evaluation criteria selected across {evaluation.selected_categories?.length || 0} categories
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evaluation Tab */}
        <TabsContent value="evaluation" className="space-y-6">
          {/* Check both field names for categories */}
          {(!evaluation?.selected_categories && !evaluation?.categories) ||
           ((evaluation?.selected_categories || evaluation?.categories)?.length === 0) ? (
            <div className="text-center py-8 text-gray-500">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-medium text-amber-800 mb-2">Backend API Issue: Evaluation Details Endpoint</h3>
                <p className="text-amber-700 mb-2">The categories and criteria were successfully saved during creation, but the evaluation details API is not returning them.</p>
                <p className="text-sm text-amber-600 mb-3">This is a backend issue where the evaluation details endpoint doesn't include the saved relationships.</p>

                <div className="bg-red-50 border border-red-200 rounded p-3 mb-3 text-sm">
                  <strong className="text-red-800">Issue Summary:</strong>
                  <ul className="text-red-700 mt-1 list-disc list-inside">
                    <li>✅ Creation saves categories/criteria (confirmed in previous logs)</li>
                    <li>❌ Details endpoint returns empty arrays: categories: {JSON.stringify(evaluation?.categories)}</li>
                    <li>🔧 Backend needs to include relationships in evaluation details response</li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-amber-100 rounded text-xs text-amber-800">
                  <strong>Technical Details:</strong><br/>
                  • Selected Categories: {JSON.stringify(evaluation?.selected_categories)}<br/>
                  • Categories: {JSON.stringify(evaluation?.categories)}<br/>
                  • Selected Criteria: {JSON.stringify(evaluation?.selected_criteria)}<br/>
                  • Criteria: {JSON.stringify(evaluation?.criteria)}<br/>
                  • Categories Map: {categoriesMap.size} items<br/>
                  • Criteria Map: {criteriaMap.size} items<br/>
                  • Available Fields: {evaluation ? Object.keys(evaluation).join(', ') : 'none'}
                </div>
              </div>
            </div>
          ) : null}

          {/* Use either selected_categories or categories field */}
          {(evaluation?.selected_categories || evaluation?.categories)?.map((categoryId, categoryIndex) => {
            const category = categoriesMap.get(categoryId);
            // Get all criteria for this category directly from the criteriaMap
            const allCriteriaForCategory = Array.from(criteriaMap.values()).filter(criterion => {
              // Check multiple possible field names for the category relationship
              const categoryIdToCheck = criterion.evaluation_category?.id || criterion.evaluation_category || criterion.categoryId || criterion.category_id || criterion.category;

              const matches = categoryIdToCheck === categoryId;

              if (matches) {
                console.log(`✅ Criterion ${criterion.id} matches category ${categoryId}`, {
                  criterion,
                  categoryIdToCheck,
                  lookingFor: categoryId
                });
              }

              return matches;
            });

            console.log(`🔍 Category ${categoryId} criteria:`, {
              categoryName: category?.name,
              allCriteriaForCategory,
              criteriaMapSize: criteriaMap.size,
              categoryId
            });

            return (
              <div key={categoryId} className="space-y-4">
                {/* Category Header - Following SSP Style */}
                <div className="mb-4">
                  <h4 className="font-semibold text-red-600 text-lg mb-1">
                    {category?.name || `Category ${categoryIndex + 1}`}
                  </h4>
                  <h6 className="font-light text-gray-500 text-sm">
                    Verify the following
                  </h6>
                </div>

                {/* Show message for categories without criteria */}
                {allCriteriaForCategory.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                    <strong className="text-blue-800">No evaluation criteria available</strong>
                    <div className="text-blue-700 mt-1">
                      This category currently has no defined evaluation criteria.<br/>
                      Contact your administrator to add criteria for this category.
                    </div>
                  </div>
                )}

                {/* Criteria Items - Following SSP Style */}
                {allCriteriaForCategory.map((criterion, criteriaIndex) => {
                  const criteriaId = criterion.id;
                  const response = responses[criteriaId] || {};

                  // Debug: Log first criterion to check response mapping
                  if (criteriaIndex === 0 && categoryIndex === 0) {
                    console.log("🔍 First Criterion Debug:", {
                      criteriaId,
                      criterionName: criterion?.name || criterion?.title,
                      hasResponse: !!responses[criteriaId],
                      response: responses[criteriaId],
                      allResponseKeys: Object.keys(responses).slice(0, 5),
                      totalResponses: Object.keys(responses).length
                    });
                  }

                  return (
                    <Card key={criteriaId} className="space-y-3 border-yellow-600">
                      {/* Criterion Title - Yellow like SSP */}
                      <h4 className="font-semibold text-yellow-600">
                        {criterion?.title || criterion?.name || `Criteria ${criteriaIndex + 1}`}
                      </h4>

                      {/* Question and Yes/No - Following SSP Layout */}
                      <div className="flex justify-between pb-3 gap-5">
                        <div className="flex-1">
                          <h2 className="text-gray-900 mb-2">
                            {criterion?.description || "Please evaluate this criterion"}
                          </h2>
                          {criterion?.weight && (
                            <Badge variant="secondary" className="text-xs">
                              Weight: {criterion.weight}
                            </Badge>
                          )}
                        </div>

                        {/* Simple Yes/No Radio - Exactly like SSP */}
                        <div className="flex-shrink-0">
                          <RadioGroup
                            value={response.compliance_status || ""}
                            onValueChange={(value) =>
                              handleResponseChange(criteriaId, "compliance_status", value)
                            }
                            className="flex gap-6"
                            disabled={isReadOnly}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id={`${criteriaId}-yes`} />
                              <Label htmlFor={`${criteriaId}-yes`} className="text-sm font-medium">
                                Yes
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id={`${criteriaId}-no`} />
                              <Label htmlFor={`${criteriaId}-no`} className="text-sm font-medium">
                                No
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      {/* Comment Input - Exactly like SSP */}
                      <Input
                        value={response.comments || response.text_response || ""}
                        onChange={(e) =>
                          handleResponseChange(criteriaId, "comments", e.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                        type="text"
                        placeholder="Comment..."
                        disabled={isReadOnly}
                      />

                      <hr />
                    </Card>
                  );
                })}
              </div>
            );
          })}

          {/* Save Progress Button */}
          {canEdit && (evaluation?.selected_categories || evaluation?.categories)?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-center">
                <Button
                  onClick={handleSaveProgress}
                  disabled={updateResponseMutation.isLoading}
                  className="px-8 py-3"
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {updateResponseMutation.isLoading ? "Saving..." : "Save Progress"}
                </Button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                Save your responses to continue later
              </p>
            </div>
          )}
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {evaluation.status === SupervisionEvaluationStatus.COMPLETED ? (
            <div className="space-y-6">
              {/* Evaluation Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {evaluation.overall_score !== null && evaluation.overall_score !== undefined
                          ? `${Math.round(evaluation.overall_score * 10) / 10}%`
                          : 'Not Calculated'}
                      </div>
                      <p className="text-sm text-gray-600">Overall Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {unifiedResponsesData?.results ?
                          Math.round((unifiedResponsesData.results.filter((r: any) =>
                            r.compliance_status !== null && r.compliance_status !== undefined ||
                            r.is_compliant !== null && r.is_compliant !== undefined ||
                            r.response_value !== null && r.response_value !== undefined
                          ).length /
                          (evaluation.selected_criteria?.length || unifiedResponsesData.results.length || 1)) * 100) :
                          Math.round(progress)}%
                      </div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-700">
                        {responsesData?.results?.length || evaluation.selected_criteria?.length || 0}
                      </div>
                      <p className="text-sm text-gray-600">Criteria Evaluated</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Responses */}
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Debug Info - Only in development */}
                  {process.env.NODE_ENV === 'development' && false && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                      <strong>Debug Info:</strong><br />
                      Responses Count: {unifiedResponsesData?.results?.length || 0}<br />
                      Source: {(responsesData?.results?.length || 0) > 0 ? 'Responses API' : 'Evaluation Items'}<br />
                      Loading: {isLoadingResponses ? 'Yes' : 'No'}<br />
                      Error: {responsesError ? 'Yes' : 'No'}
                    </div>
                  )}
                  <div className="space-y-6">
                    {isLoadingResponses && !(evaluation as any)?.evaluation_items ? (
                      <div className="text-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading evaluation responses...</p>
                      </div>
                    ) : unifiedResponsesData?.results && unifiedResponsesData.results.length > 0 ? (
                      // Group responses by category
                      Array.from(new Set(
                        unifiedResponsesData.results.map((response: any) => {
                          const criterion = Array.from(criteriaMap.values()).find(c => c.id === response.criteria_id);
                          return criterion?.categoryId || criterion?.evaluation_category?.id || criterion?.evaluation_category || criterion?.category_id || criterion?.category;
                        }).filter(Boolean)
                      )).map((categoryId: any) => {
                        const category = categoriesMap.get(categoryId);
                        const categoryResponses = unifiedResponsesData.results.filter((response: any) => {
                          const criterion = Array.from(criteriaMap.values()).find(c => c.id === response.criteria_id);
                          const criterionCategoryId = criterion?.categoryId || criterion?.evaluation_category?.id || criterion?.evaluation_category || criterion?.category_id || criterion?.category;
                          return criterionCategoryId === categoryId;
                        });

                        if (categoryResponses.length === 0) return null;

                        return (
                          <div key={categoryId} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <ClipboardList className="h-4 w-4 text-blue-600" />
                              {category?.name || 'Unknown Category'}
                            </h4>
                            <div className="space-y-3">
                              {categoryResponses.map((response: any) => {
                                const criterion = Array.from(criteriaMap.values()).find(c => c.id === response.criteria_id);

                                if (!criterion) {
                                  return (
                                    <div key={response.criteria_id} className="bg-gray-50 rounded p-3">
                                      <div className="flex items-start justify-between mb-2">
                                        <p className="font-medium text-sm text-gray-900 flex-1">
                                          Criterion ID: {response.criteria_id}
                                        </p>
                                        <Badge variant="outline" className="ml-2">
                                          Response Available
                                        </Badge>
                                      </div>
                                      {response.text_response && (
                                        <div className="mt-2 p-2 bg-white rounded border">
                                          <p className="text-xs text-gray-600 mb-1">Response:</p>
                                          <p className="text-sm text-gray-800">{response.text_response}</p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }

                                // Debug: Log first response to check data
                                if (categoryResponses.indexOf(response) === 0) {
                                  console.log("🔍 First Response in Category:", {
                                    categoryName: category?.name,
                                    response: response,
                                    compliance_status: response.compliance_status,
                                    is_compliant: response.is_compliant,
                                    observations: response.observations,
                                    text_response: response.text_response,
                                    comments: response.comments,
                                  });
                                }

                                // Determine compliance status from multiple possible fields
                                let complianceStatus = '';
                                if (
                                  response.compliance_status === 'YES' ||
                                  response.compliance_status === 'yes' ||
                                  response.is_compliant === true ||
                                  response.response_value === true
                                ) {
                                  complianceStatus = 'yes';
                                } else if (
                                  response.compliance_status === 'NO' ||
                                  response.compliance_status === 'no' ||
                                  response.is_compliant === false ||
                                  response.response_value === false
                                ) {
                                  complianceStatus = 'no';
                                }

                                // Get comments from observations field (primary) or fallback fields
                                const comments = response.observations || response.text_response || response.comments;

                                return (
                                  <div key={response.criteria_id} className="bg-gray-50 rounded p-3">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <p className="font-medium text-sm text-gray-900">
                                          {criterion.title || criterion.name || criterion.description || 'Evaluation Criterion'}
                                        </p>
                                        {criterion.description && criterion.description !== (criterion.title || criterion.name) && (
                                          <p className="text-xs text-gray-600 mt-1">
                                            {criterion.description}
                                          </p>
                                        )}
                                      </div>
                                      {complianceStatus && (
                                        <Badge
                                          variant={complianceStatus === 'yes' ? 'default' : 'destructive'}
                                          className="ml-2"
                                        >
                                          {complianceStatus === 'yes' ? 'Yes' : 'No'}
                                        </Badge>
                                      )}
                                    </div>
                                    {comments && (
                                      <div className="mt-2 p-2 bg-white rounded border">
                                        <p className="text-xs text-gray-600 mb-1">Comments:</p>
                                        <p className="text-sm text-gray-800">{comments}</p>
                                      </div>
                                    )}
                                    {response.rating_value && (
                                      <div className="mt-2">
                                        <Badge variant="outline" className="text-xs">
                                          Rating: {response.rating_value}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Responses Available</h3>
                        <p className="text-gray-600 mb-4">
                          {evaluation?.status === 'COMPLETED'
                            ? 'This completed evaluation appears to have no recorded responses. This may indicate a data synchronization issue.'
                            : 'This evaluation has not been completed yet. Responses will appear here once the evaluation is submitted.'
                          }
                        </p>
                        {evaluation?.status === 'COMPLETED' && (
                          <p className="text-xs text-orange-600">
                            If you expect to see responses here, please contact your system administrator or try refreshing the page.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Score Summary */}
              {evaluation.category_scores && (
                <Card>
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
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

              {/* Evaluation Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Evaluation Date</p>
                        <p className="text-sm text-gray-900">{formatDate(evaluation.evaluation_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Evaluator</p>
                        <p className="text-sm text-gray-900">{evaluation.evaluator_name || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Site Visit</p>
                        <p className="text-sm text-gray-900">{evaluation.site_visit_title || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                          {SupervisionEvaluationStatusLabels[evaluation.status]}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed Date</p>
                        <p className="text-sm text-gray-900">
                          {evaluation.completed_date ? formatDate(evaluation.completed_date) : formatDate(new Date().toISOString())}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Categories Evaluated</p>
                        <p className="text-sm text-gray-900">
                          {evaluation?.selected_categories?.length || 0} categories
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      {evaluation.action_items.map((item) => (
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
                <Button type="button" variant="outline" onClick={handleSaveProgress}>
                  Save Draft
                </Button>
                <Button
                  type="submit"
                  disabled={completeEvaluationMutation.isPending}
                >
                  <SendIcon className="h-4 w-4 mr-2" />
                  {completeEvaluationMutation.isPending ? "Completing..." : "Complete Evaluation"}
                </Button>
              </div>

              {progress < 100 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-2">
                    <div className="text-yellow-600 mt-1">⚠️</div>
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Incomplete Evaluation</p>
                      <p className="text-sm text-yellow-700">
                        You have completed {Math.round(progress)}% of the evaluation criteria. You can still complete the evaluation, but consider reviewing all criteria to ensure thorough assessment.
                      </p>
                    </div>
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