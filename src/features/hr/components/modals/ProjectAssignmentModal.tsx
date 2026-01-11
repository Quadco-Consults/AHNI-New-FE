"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { closeDialog } from "@/store/ui";
import { useGetJobAdvertisements } from "@/features/hr/controllers/jobAdvertisementController";
import { Building2, Plus, X } from "lucide-react";

interface ProjectAssignmentModalProps {
  employee: {
    id: string;
    legal_firstname: string;
    legal_lastname: string;
    current_projects?: string[];
  };
  onClose?: () => void;
  onAssign?: (employeeId: string, projectData: any) => void;
}

export default function ProjectAssignmentModal({
  employee,
  onClose,
  onAssign
}: ProjectAssignmentModalProps) {
  const [assignmentType, setAssignmentType] = useState<"replace" | "add">("add");
  const [currentProjects, setCurrentProjects] = useState<string[]>(
    employee.current_projects || ["Project Alpha", "Project Beta"] // Mock current projects
  );

  const dispatch = useAppDispatch();

  const form = useForm({
    defaultValues: {
      new_project: "",
      replace_project: "",
    }
  });

  const { data: advertisements, isLoading: projectsLoading } = useGetJobAdvertisements({
    page: 1,
    size: 100,
  });

  // Extract projects from job advertisements only
  const advertizedProjects = (advertisements?.data?.results || [])
    .filter((ad: any) => ad.project && ad.project.title) // Only ads with valid projects
    .map((ad: any) => ({
      value: ad.project.id || ad.id,
      label: ad.project.title || ad.title,
      advertisement_id: ad.id,
      advertisement_title: ad.title,
    }));

  // Remove duplicates by project ID
  const projectOptions = advertizedProjects.filter((project, index, self) =>
    index === self.findIndex((p) => p.value === project.value)
  );

  const handleSubmit = async (data: any) => {
    if (!data.new_project) {
      toast.error("Please select a project to assign");
      return;
    }

    const selectedProject = projectOptions.find(
      (p: any) => p.value === data.new_project
    );

    if (!selectedProject) {
      toast.error("Selected advertised project not found");
      return;
    }

    try {
      const assignmentData = {
        employee_id: employee.id,
        project_id: data.new_project,
        project_title: selectedProject.label,
        advertisement_id: selectedProject.advertisement_id,
        advertisement_title: selectedProject.advertisement_title,
        assignment_type: assignmentType,
        replace_project_id: assignmentType === "replace" ? data.replace_project : null,
        current_projects: currentProjects,
      };

      // Simulate API call - replace with actual API when backend is ready
      console.log("Project assignment data:", assignmentData);

      // Update local state for demo
      if (assignmentType === "add") {
        setCurrentProjects([...currentProjects, selectedProject.label]);
        toast.success(`${selectedProject.label} (from advertisement) added to ${employee.legal_firstname}'s projects`);
      } else {
        const replacedProjectIndex = currentProjects.findIndex(p => p === data.replace_project);
        if (replacedProjectIndex !== -1) {
          const updatedProjects = [...currentProjects];
          updatedProjects[replacedProjectIndex] = selectedProject.label;
          setCurrentProjects(updatedProjects);
          toast.success(`Project replaced with ${selectedProject.label} (from advertisement) for ${employee.legal_firstname}`);
        }
      }

      // Call the onAssign callback if provided
      onAssign?.(employee.id, assignmentData);

      // Close modal after successful assignment
      setTimeout(() => {
        onClose?.() || dispatch(closeDialog());
      }, 1500);

    } catch (error) {
      console.error("Project assignment error:", error);
      toast.error("Failed to assign project. Please try again.");
    }
  };

  const removeProject = (projectToRemove: string) => {
    setCurrentProjects(currentProjects.filter(p => p !== projectToRemove));
    toast.success("Project removed");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Assign Advertised Project to Employee
        </h3>
        <p className="text-sm text-gray-600">
          Assign projects from job advertisements to {employee.legal_firstname} {employee.legal_lastname}
        </p>
      </div>

      {/* Current Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {currentProjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentProjects.map((project, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {project}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeProject(project)}
                  />
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No current projects assigned</p>
          )}
        </CardContent>
      </Card>

      {/* Assignment Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assignment Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="add"
                checked={assignmentType === "add"}
                onChange={(e) => setAssignmentType(e.target.value as "add")}
              />
              <span>Add New Project</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="replace"
                checked={assignmentType === "replace"}
                onChange={(e) => setAssignmentType(e.target.value as "replace")}
                disabled={currentProjects.length === 0}
              />
              <span>Replace Existing Project</span>
            </label>
          </div>

          {assignmentType === "add" && (
            <p className="text-xs text-blue-600">
              The advertised project will be added to the employee's current assignments
            </p>
          )}

          {assignmentType === "replace" && (
            <p className="text-xs text-orange-600">
              Select which current project to replace with the advertised project
            </p>
          )}
        </CardContent>
      </Card>

      {/* Project Assignment Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

          {/* Replace Project Selection (only if replacing) */}
          {assignmentType === "replace" && currentProjects.length > 0 && (
            <FormSelect
              label="Project to Replace"
              name="replace_project"
              placeholder="Select project to replace"
              required
              options={currentProjects.map(project => ({
                value: project,
                label: project,
              }))}
            />
          )}

          {/* New Project Selection */}
          <FormSelect
            label="Advertised Project"
            name="new_project"
            placeholder={projectsLoading ? "Loading advertised projects..." : "Select advertised project to assign"}
            required
            options={projectOptions}
            disabled={projectsLoading}
          />

          {projectOptions.length === 0 && !projectsLoading && (
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ No advertised projects found. Projects are only available from job advertisements.
              </p>
            </div>
          )}

          {projectOptions.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Showing {projectOptions.length} project(s) from job advertisements
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose || (() => dispatch(closeDialog()))}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={projectsLoading}>
              <Plus className="w-4 h-4 mr-2" />
              {assignmentType === "add" ? "Add Project" : "Replace Project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}