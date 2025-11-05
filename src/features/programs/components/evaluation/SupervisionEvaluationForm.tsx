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
import { CalendarIcon, FileTextIcon, LocationIcon, UserIcon } from "lucide-react";
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
    status: "COMPLETED",
  });
  const { data: categoriesData } = useGetEvaluationCategories();
  const { data: templatesData } = useGetEvaluationTemplates();

  // Load criteria when categories are selected
  useEffect(() => {
    const loadCriteriaForCategories = async () => {
      if (selectedCategories.length === 0) return;

      const newCriteriaByCategory: Record<string, any[]> = {};

      for (const categoryId of selectedCategories) {
        try {
          // This would need to be implemented as a direct API call since we need it synchronously
          // For now, we'll use a placeholder structure
          newCriteriaByCategory[categoryId] = [];
        } catch (error) {
          console.error(`Failed to load criteria for category ${categoryId}:`, error);
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
      if (isSelected) {
        // Remove category and its criteria
        setSelectedCriteria(prevCriteria =>
          prevCriteria.filter(c => c.category_id !== categoryId)
        );
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
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
      if (isSelected) {
        return prev.filter(c => c.id !== criteria.id);
      } else {
        return [...prev, {
          ...criteria,
          category_name: categoryName,
        }];
      }
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

      const result = await createEvaluationMutation.mutateAsync(payload);

      toast.success("Supervision evaluation created successfully");

      if (onSuccess) {
        onSuccess(result.data.id);
      } else {
        router.push(`/dashboard/programs/plan/supervision-evaluation/${result.data.id}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create evaluation");
    }
  };

  const selectedSiteVisit = siteVisitsData?.results?.find(sv => sv.id === form.watch("site_visit_id"));

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
                {siteVisitsData?.results?.map((siteVisit) => (
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
                    <LocationIcon className="h-4 w-4 text-gray-500" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {categoriesData?.map((category) => (
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
              {form.formState.errors.selected_categories && (
                <p className="text-red-500 text-sm mt-2">
                  {form.formState.errors.selected_categories.message}
                </p>
              )}
            </div>

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