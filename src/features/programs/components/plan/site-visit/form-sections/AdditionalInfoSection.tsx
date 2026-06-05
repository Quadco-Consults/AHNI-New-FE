"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileTextIcon, DollarSignIcon } from "lucide-react";

import { TSiteVisitApplicationFormValues } from "@/features/programs/types/site-visit";

interface AdditionalInfoSectionProps {
  projects: any[];
  isProjectsLoading?: boolean;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  projects,
  isProjectsLoading = false,
}) => {
  const { control, watch } = useFormContext<TSiteVisitApplicationFormValues>();
  const selectedProject = watch("project");
  const estimatedBudget = watch("estimated_budget");

  // Get project details
  const projectData = React.useMemo(() => {
    if (selectedProject && selectedProject !== "none") {
      return projects.find(project => project.id === selectedProject);
    }
    return null;
  }, [projects, selectedProject]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5 text-yellow-600" />
          Additional Information
        </CardTitle>
        <p className="text-sm text-gray-600">
          Optional details to provide context and additional requirements for your travel request.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project Association */}
        <FormField
          control={control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Project (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project if this visit is project-related" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isProjectsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading projects...
                    </SelectItem>
                  ) : (
                    [
                      <SelectItem key="none" value="none">
                        No Project Association
                      </SelectItem>,
                      ...projects.map((project: any) => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{project.title}</span>
                            <span className="text-xs text-gray-600">
                              {project.project_code || 'No Code'}
                              {project.status && ` • ${project.status}`}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ]
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project Details Display */}
        {projectData && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-2">Selected Project Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Title:</span>
                  <div className="font-medium">{projectData.title}</div>
                </div>
                <div>
                  <span className="text-gray-600">Code:</span>
                  <div className="font-medium">{projectData.project_code || 'N/A'}</div>
                </div>
                {projectData.status && (
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div>
                      <Badge variant="outline" className="text-xs">
                        {projectData.status}
                      </Badge>
                    </div>
                  </div>
                )}
                {projectData.description && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Description:</span>
                    <div className="font-medium text-sm mt-1">{projectData.description}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estimated Budget */}
        <FormField
          control={control}
          name="estimated_budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4 text-yellow-600" />
                Estimated Budget (Optional)
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    ₦
                  </span>
                  <Input
                    type="number"
                    placeholder="0"
                    className="pl-8"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
              {estimatedBudget > 0 && (
                <p className="text-sm text-gray-600">
                  Estimated budget: ₦{estimatedBudget.toLocaleString()}
                </p>
              )}
            </FormItem>
          )}
        />

        {/* Special Requirements */}
        <FormField
          control={control}
          name="special_requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requirements (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special arrangements, equipment, permits, or other requirements for this visit"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional Comments */}
        <FormField
          control={control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Comments (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any other information, context, or notes about this travel request"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Information Notes */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Additional Information Guidelines</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc ml-4">
            <li>
              <strong>Project Association:</strong> Link this visit to a specific project for tracking and reporting
            </li>
            <li>
              <strong>Estimated Budget:</strong> Provide your best estimate for comparison with calculated travel costs
            </li>
            <li>
              <strong>Special Requirements:</strong> Include any unique needs like equipment, permits, or special arrangements
            </li>
            <li>
              <strong>Comments:</strong> Share any context that might be helpful for reviewers and approvers
            </li>
          </ul>
        </div>

        {/* Budget Comparison */}
        {estimatedBudget > 0 && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Budget Note</h4>
            <p className="text-sm text-yellow-800">
              Your estimated budget of ₦{estimatedBudget.toLocaleString()} will be compared with the calculated
              travel fees. Significant differences may require additional explanation during the review process.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdditionalInfoSection;