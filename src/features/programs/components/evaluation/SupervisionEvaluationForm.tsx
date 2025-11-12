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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, FileTextIcon, MapPinIcon, UserIcon } from "lucide-react";
import {
  CreateSupervisionEvaluationSchema,
  CreateSupervisionEvaluationFormData,
  IEvaluationTemplate,
} from "../../types/supervision-evaluation";
import {
  useCreateSupervisionEvaluation,
  useGetEvaluationTemplates,
} from "../../controllers/supervisionEvaluationController";
import {
  useGetEvaluationCategories,
  useGetEvaluationCategoryCriteria,
} from "../../controllers/evaluationCategoriesController";
import { useGetAllSiteVisits } from "../../controllers/siteVisitController";
import { formatDate } from "@/utils/date";

interface SupervisionEvaluationFormProps {
  siteVisitId?: string;
  plannedVisitId?: string;
  onSuccess?: (evaluationId: string) => void;
  onCancel?: () => void;
}

interface SelectedCriteria {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  category_name: string;
}

export default function SupervisionEvaluationForm({
  siteVisitId,
  plannedVisitId,
  onSuccess,
  onCancel,
}: SupervisionEvaluationFormProps) {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<SelectedCriteria[]>([]);
  const [criteriaByCategory, setCriteriaByCategory] = useState<Record<string, any[]>>({});

  // Form setup
  const form = useForm<CreateSupervisionEvaluationFormData>({
    resolver: zodResolver(CreateSupervisionEvaluationSchema),
    defaultValues: {
      site_visit_id: siteVisitId || "",
      planned_visit_id: plannedVisitId || "",
      title: "",
      description: "",
      evaluation_date: formatDate(new Date().toISOString()),
      selected_categories: [],
      selected_criteria: [],
    },
  });

  // API hooks
  const createEvaluationMutation = useCreateSupervisionEvaluation();
  const { data: siteVisitsData } = useGetAllSiteVisits({
    page: 1,
    page_size: 100,
    // Remove status filter to show all site visits, then filter on frontend
    // status: "COMPLETED", // This status doesn't exist - use frontend filtering instead
  });
  const { data: categoriesData, error: categoriesError, isLoading: isLoadingCategories } = useGetEvaluationCategories();
  const { data: templatesData } = useGetEvaluationTemplates();

  // Filter site visits to show only supervision visits that are approved/authorized
  const filteredSiteVisits = React.useMemo(() => {
    const results = (siteVisitsData as any)?.data?.results || siteVisitsData?.results || [];

    if (!Array.isArray(results)) return [];

    // Define supervision visit types
    const supervisionTypes = [
      "Supportive Supervision",
      "Integrated Supportive Supervision",
      "Emergency Supportive Supervision",
    ];

    // Define approved statuses
    const approvedStatuses = [
      "Authorized",
      "EA Generated",
    ];

    return results.filter((siteVisit: any) => {
      const hasApprovedStatus = approvedStatuses.includes(siteVisit.status_display);
      const isSupervisionType = supervisionTypes.includes(siteVisit.visit_type_display);
      return hasApprovedStatus && isSupervisionType;
    });
  }, [siteVisitsData]);

  // Debug site visits and categories loading
  useEffect(() => {
    console.log("🔍 Site visits raw data:", siteVisitsData);
    console.log("🔍 Filtered site visits:", filteredSiteVisits);
    if (filteredSiteVisits.length === 0 && siteVisitsData) {
      console.log("⚠️ No filtered site visits found. Check filtering logic.");

      // Log available data to help debug
      const results = (siteVisitsData as any)?.data?.results || siteVisitsData?.results || [];
      if (Array.isArray(results) && results.length > 0) {
        console.log("📊 Available site visit statuses:", results.map(sv => sv.status_display).filter(Boolean));
        console.log("📊 Available site visit types:", results.map(sv => sv.visit_type_display).filter(Boolean));
        console.log("📊 Sample site visit:", results[0]);
      }
    }
  }, [siteVisitsData, filteredSiteVisits]);

  // Debug categories loading
  useEffect(() => {
    console.log("🔍 Categories loading state:", {
      isLoading: isLoadingCategories,
      hasData: !!categoriesData,
      hasError: !!categoriesError,
      dataType: typeof categoriesData,
      dataLength: Array.isArray(categoriesData) ? categoriesData.length : 'not array',
      rawData: categoriesData,
      error: categoriesError
    });

    // If we have data but it's not an array, check the structure
    if (categoriesData && !Array.isArray(categoriesData)) {
      console.log("📊 Categories data structure exploration:", {
        keys: Object.keys(categoriesData),
        hasResults: 'results' in categoriesData,
        hasData: 'data' in categoriesData,
        actualData: categoriesData
      });
    }
  }, [categoriesData, categoriesError, isLoadingCategories]);

  // Load criteria when categories are selected using direct API calls with correct auth
  useEffect(() => {
    const loadCriteriaForCategories = async () => {
      if (selectedCategories.length === 0) {
        setCriteriaByCategory({});
        return;
      }

      console.log("🔄 Loading criteria for categories:", selectedCategories);
      const newCriteriaByCategory: Record<string, any[]> = {};

      for (const categoryId of selectedCategories) {
        try {
          // Use the correct token name that AxiosWithToken uses
          const token = localStorage.getItem("token");

          if (!token) {
            console.error(`❌ No auth token found for category ${categoryId}`);
            newCriteriaByCategory[categoryId] = [];
            continue;
          }

          // Make direct API call to get criteria for this category using correct endpoint and auth
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/supervision-evaluation-criteria/?page=1&size=20&search=&evaluation_category=${categoryId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const responseData = await response.json();
            console.log(`📊 Direct API criteria response for category ${categoryId}:`, responseData);
            console.log(`🌐 Criteria API URL called:`, response.url);
            console.log(`📡 Criteria API status:`, response.status, response.statusText);

            // Handle different possible response structures
            let criteriaData = [];
            if (responseData?.data?.results) {
              criteriaData = responseData.data.results;
            } else if (responseData?.results) {
              criteriaData = responseData.results;
            } else if (Array.isArray(responseData)) {
              criteriaData = responseData;
            } else if (responseData?.data && Array.isArray(responseData.data)) {
              criteriaData = responseData.data;
            } else {
              console.warn(`Unexpected direct API criteria response structure for category ${categoryId}:`, responseData);
              criteriaData = responseData || [];
            }

            newCriteriaByCategory[categoryId] = criteriaData;
            console.log(`✅ Loaded ${criteriaData?.length || 0} criteria for category ${categoryId}`);
          } else {
            console.log(`⚠️ No criteria found for category ${categoryId} (${response.status})`);
            console.log(`🌐 Failed Criteria API URL:`, response.url);
            console.log(`📡 Failed Criteria API status:`, response.status, response.statusText);
            const errorText = await response.text();
            console.log(`📝 Error response body:`, errorText);
            newCriteriaByCategory[categoryId] = [];
          }
        } catch (error) {
          console.error(`❌ Failed to load criteria for category ${categoryId}:`, error);
          newCriteriaByCategory[categoryId] = [];
        }
      }

      setCriteriaByCategory(newCriteriaByCategory);
    };

    loadCriteriaForCategories();
  }, [selectedCategories]);

  // Handle category selection
  const handleCategoryToggle = (categoryId: string, categoryName: string) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(categoryId);
      const newCategories = isSelected
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];

      // Update the form field as well
      form.setValue("selected_categories", newCategories);

      if (isSelected) {
        // Remove category and its criteria
        setSelectedCriteria(prevCriteria => {
          const newCriteria = prevCriteria.filter(c => c.category_id !== categoryId);
          // Update form criteria field
          form.setValue("selected_criteria", newCriteria.map(c => c.id));
          return newCriteria;
        });
      }

      return newCategories;
    });
  };

  // Handle criteria selection
  const handleCriteriaToggle = (criteria: {
    id: string;
    name: string;
    description?: string;
    category_id: string;
  }, categoryName: string) => {
    setSelectedCriteria(prev => {
      const isSelected = prev.some(c => c.id === criteria.id);
      const newCriteria = isSelected
        ? prev.filter(c => c.id !== criteria.id)
        : [...prev, {
            ...criteria,
            category_name: categoryName,
          }];

      // Update the form field as well
      form.setValue("selected_criteria", newCriteria.map(c => c.id));

      return newCriteria;
    });
  };

  // Apply evaluation template
  const applyTemplate = (template: IEvaluationTemplate) => {
    const categoryIds = template.categories.map(c => c.id);
    const criteriaList: SelectedCriteria[] = [];

    template.categories.forEach(category => {
      category.criteria.forEach(criteria => {
        criteriaList.push({
          id: criteria.id,
          name: criteria.name,
          description: criteria.description,
          category_id: category.id,
          category_name: category.name,
        });
      });
    });

    setSelectedCategories(categoryIds);
    setSelectedCriteria(criteriaList);
    form.setValue("title", template.name);
    form.setValue("description", template.description || "");
  };

  // Form submission
  const onSubmit = async (data: CreateSupervisionEvaluationFormData) => {
    try {
      const payload = {
        ...data,
        selected_categories: selectedCategories,
        selected_criteria: selectedCriteria.map(c => c.id),
      };

      console.log("🚀 Creating evaluation with payload:", payload);
      console.log("🔍 Form data:", data);
      console.log("🔍 Selected categories:", selectedCategories);
      console.log("🔍 Selected criteria:", selectedCriteria);

      const result = await createEvaluationMutation.mutateAsync(payload);

      console.log("✅ Evaluation created successfully:", result);
      console.log("📊 Full response structure:", JSON.stringify(result, null, 2));
      console.log("🔍 Checking ID paths:", {
        'result.data.id': result.data?.id,
        'result.id': result.id,
        'result.data': result.data,
        'full_result': result
      });

      toast.success("Supervision evaluation created successfully");

      // Enhanced ID extraction with multiple fallback paths
      const evaluationId = result.data?.id ||
                          result.id ||
                          result.data?.evaluation?.id ||
                          result.data?.evaluation_id ||
                          result.data?.uuid ||
                          result.uuid ||
                          null;

      console.log("🔍 Extracted evaluation ID:", evaluationId);

      if (evaluationId) {
        if (onSuccess) {
          onSuccess(evaluationId);
        } else {
          router.push(`/dashboard/programs/plan/supervision-evaluation/${evaluationId}`);
        }
      } else {
        console.warn("⚠️ Backend didn't return evaluation ID - attempting to fetch the created evaluation");

        try {
          // Attempt to find the evaluation that was just created for this site visit
          const { useGetEvaluationsBySiteVisit } = await import('@/features/programs/controllers/supervisionEvaluationController');

          console.log("🔍 Attempting to fetch evaluations for site visit:", payload.site_visit_id);

          // Since we can't use hooks here, we'll make a direct API call
          const token = localStorage.getItem('token');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/supervision-evaluations/by-site-visit/${payload.site_visit_id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const evaluationsData = await response.json();
            console.log("📊 Evaluations for site visit:", evaluationsData);

            // Look for the most recently created evaluation
            const evaluations = evaluationsData?.data?.results || evaluationsData?.results || [];
            const latestEvaluation = evaluations[evaluations.length - 1]; // Most recent

            if (latestEvaluation?.id) {
              console.log("✅ Found newly created evaluation ID:", latestEvaluation.id);

              if (onSuccess) {
                onSuccess(latestEvaluation.id);
              } else {
                router.push(`/dashboard/programs/plan/supervision-evaluation/${latestEvaluation.id}`);
              }
              return; // Exit early if we found the ID
            }
          }
        } catch (fetchError) {
          console.warn("⚠️ Failed to fetch created evaluation:", fetchError);
        }

        // If all attempts fail, fall back to site visit navigation
        console.warn("⚠️ Using site visit fallback navigation");

        if (onSuccess) {
          // Pass a placeholder ID that the parent can handle
          onSuccess(`site-visit-${payload.site_visit_id}`);
        } else {
          // Navigate back to the main list
          router.push('/dashboard/programs/plan/supervision-evaluation');
        }

        toast.success("Evaluation created successfully! Please look for the updated site with 'View Evaluation' button.");

        // Trigger evaluations refresh if available
        setTimeout(() => {
          if ((window as any).refreshEvaluationsList) {
            console.log("🔄 Triggering evaluations refresh from form...");
            (window as any).refreshEvaluationsList();
          }
        }, 500);
      }
    } catch (error: any) {
      console.error("❌ Evaluation creation failed:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      toast.error(error.message || "Failed to create evaluation");
    }
  };

  const selectedSiteVisit = filteredSiteVisits?.find(sv => sv.id === form.watch("site_visit_id"));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Supervision Evaluation</h1>
          <p className="text-gray-600 mt-1">
            Create a new evaluation for a completed supervision visit
          </p>
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Site Visit Selection */}
            <div>
              <Label htmlFor="site_visit_id">Site Visit *</Label>
              <select
                id="site_visit_id"
                {...form.register("site_visit_id")}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={!!siteVisitId}
              >
                <option value="">Select a completed site visit</option>
                {filteredSiteVisits?.map((siteVisit) => (
                  <option key={siteVisit.id} value={siteVisit.id}>
                    {siteVisit.title} - {siteVisit.location_name} ({formatDate(siteVisit.actual_end_date || siteVisit.start_date)})
                  </option>
                ))}
              </select>
              {form.formState.errors.site_visit_id && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.site_visit_id.message}
                </p>
              )}
            </div>

            {/* Site Visit Details Display */}
            {selectedSiteVisit && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Site Visit Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-gray-500" />
                    <span>{selectedSiteVisit.location_name}</span>
                    {selectedSiteVisit.facility_name && (
                      <span className="text-gray-500">• {selectedSiteVisit.facility_name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    <span>{selectedSiteVisit.team_lead_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>
                      {formatDate(selectedSiteVisit.actual_start_date || selectedSiteVisit.start_date)} - {" "}
                      {formatDate(selectedSiteVisit.actual_end_date || selectedSiteVisit.end_date)}
                    </span>
                  </div>
                  <div>
                    <Badge variant="secondary">{selectedSiteVisit.visit_type_display}</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Title and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Evaluation Title *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Enter evaluation title"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="evaluation_date">Evaluation Date *</Label>
                <Input
                  id="evaluation_date"
                  type="date"
                  {...form.register("evaluation_date")}
                />
                {form.formState.errors.evaluation_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.evaluation_date.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Enter evaluation description (optional)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Templates */}
        {templatesData?.results && templatesData.results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
              <p className="text-sm text-gray-600">
                Apply a pre-configured evaluation template to quickly set up categories and criteria
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {templatesData.results.map((template) => (
                  <Button
                    key={template.id}
                    type="button"
                    variant="outline"
                    className="p-4 h-auto text-left justify-start"
                    onClick={() => applyTemplate(template)}
                  >
                    <div>
                      <div className="font-medium">{template.name}</div>
                      {template.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {template.description}
                        </div>
                      )}
                      <div className="text-xs text-blue-600 mt-2">
                        {template.categories.length} categories, {" "}
                        {template.categories.reduce((acc, cat) => acc + cat.criteria.length, 0)} criteria
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories and Criteria Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Categories & Criteria</CardTitle>
            <p className="text-sm text-gray-600">
              Select the evaluation categories and specific criteria for this evaluation
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Available Categories</h4>

              {isLoadingCategories ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading categories...</p>
                </div>
              ) : categoriesError ? (
                <div className="text-center py-4 text-red-500">
                  <p className="text-sm">Failed to load categories: {categoriesError.message}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : !categoriesData || categoriesData.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No evaluation categories available</p>
                  <p className="text-xs mt-1">Please contact your administrator to set up evaluation categories</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categoriesData.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() => handleCategoryToggle(category.id, category.name)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm font-medium">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {form.formState.errors.selected_categories && (
                <p className="text-red-500 text-sm mt-2">
                  {form.formState.errors.selected_categories.message}
                </p>
              )}
            </div>

            {/* Criteria Selection for Selected Categories */}
            {selectedCategories.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Select Evaluation Criteria</h4>
                  <div className="space-y-6">
                    {selectedCategories.map((categoryId) => {
                      const category = categoriesData?.find(c => c.id === categoryId);
                      const categoryCriteria = criteriaByCategory[categoryId] || [];

                      return (
                        <div key={categoryId} className="border rounded-lg p-4">
                          <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                            <Badge variant="secondary">{category?.name}</Badge>
                            <span className="text-sm text-gray-500">
                              ({categoryCriteria.length} criteria available)
                            </span>
                          </h5>

                          {categoryCriteria.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {categoryCriteria.map((criteria: any) => (
                                <div key={criteria.id} className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50">
                                  <Checkbox
                                    id={`criteria-${criteria.id}`}
                                    checked={selectedCriteria.some(c => c.id === criteria.id)}
                                    onCheckedChange={() => handleCriteriaToggle(
                                      {
                                        id: criteria.id,
                                        name: criteria.name,
                                        description: criteria.description,
                                        category_id: categoryId,
                                      },
                                      category?.name || 'Unknown Category'
                                    )}
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={`criteria-${criteria.id}`} className="text-sm font-medium cursor-pointer">
                                      {criteria.name}
                                    </Label>
                                    {criteria.description && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {criteria.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              <p className="text-sm">Loading criteria...</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Selected Categories Summary */}
            {selectedCategories.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Selected Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((categoryId) => {
                      const category = categoriesData?.find(c => c.id === categoryId);
                      return (
                        <Badge key={categoryId} variant="secondary">
                          {category?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Selected Criteria Summary */}
            {selectedCriteria.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Selected Criteria ({selectedCriteria.length})
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(
                      selectedCriteria.reduce((acc, criteria) => {
                        if (!acc[criteria.category_name]) {
                          acc[criteria.category_name] = [];
                        }
                        acc[criteria.category_name].push(criteria);
                        return acc;
                      }, {} as Record<string, SelectedCriteria[]>)
                    ).map(([categoryName, criteria]) => (
                      <div key={categoryName}>
                        <h5 className="font-medium text-gray-700 mb-2">{categoryName}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                          {criteria.map((c) => (
                            <div key={c.id} className="text-sm text-gray-600">
                              • {c.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedCriteria.length === 0 && selectedCategories.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No criteria selected yet.</p>
                <p className="text-sm">
                  Please select specific criteria from your chosen categories to continue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createEvaluationMutation.isPending}
            disabled={selectedCriteria.length === 0}
          >
            Create Evaluation
          </Button>
        </div>
      </form>
    </div>
  );
}