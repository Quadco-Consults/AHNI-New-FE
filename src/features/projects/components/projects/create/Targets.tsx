"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProjectLayout from "./ProjectLayout";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import FormButton from "@/components/FormButton";
import { toast } from "sonner";
import LongArrowLeft from "@/components/icons/LongArrowLeft";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import { RouteEnum } from "@/constants/RouterConstants";
import TargetsToggleView from "./TargetsToggleView";
import { ProjectTargetDefinition } from "@/features/projects/types/project";
import {
  useGetSingleProject,
  useUpdateProject,
} from "@/features/projects/controllers/projectController";
import { Loading } from "@/components/Loading";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Projects", icon: true },
  { name: "Create", icon: true },
  { name: "Performance Targets", icon: false },
];

export default function ProjectTargetsPage() {
  const [projectTargets, setProjectTargets] = useState<ProjectTargetDefinition[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const { data: project, isLoading } = useGetSingleProject(projectId || "", !!projectId);
  const { updateProject, isLoading: isUpdateLoading } = useUpdateProject(projectId || "");

  // Load existing targets when project data is available
  useEffect(() => {
    if (project?.data?.targets && project.data.targets.length > 0) {
      console.log("📊 Loading existing targets:", project.data.targets);

      // Map API response fields to frontend schema
      const mappedTargets = project.data.targets.map((target: any) => ({
        id: target.id,
        indicator_code: target.indicator_code,
        indicator_name: target.indicator_name,
        tracking_mode: target.tracking_mode,
        fiscal_year: target.fiscal_year,
        annual_target: target.target_value ? parseFloat(target.target_value) : undefined,
        q1_target: target.q1_target ? parseFloat(target.q1_target) : undefined,
        q2_target: target.q2_target ? parseFloat(target.q2_target) : undefined,
        q3_target: target.q3_target ? parseFloat(target.q3_target) : undefined,
        q4_target: target.q4_target ? parseFloat(target.q4_target) : undefined,
        target_notes: target.comments,
      }));

      setProjectTargets(mappedTargets);
      console.log("✅ Targets loaded successfully:", mappedTargets.length);
    }
  }, [project]);

  const handleSaveAndContinue = async () => {
    if (!projectId) {
      toast.error("Project ID is required");
      return;
    }

    // Validate that at least one complete target is defined
    const completeTargets = projectTargets.filter(
      t => t.indicator_code && t.annual_target && t.annual_target > 0
    );

    if (completeTargets.length === 0) {
      toast.error("Please define at least one complete target before continuing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out incomplete targets (without indicator_code)
      const validTargets = projectTargets.filter(
        target => target.indicator_code && target.indicator_code !== ''
      );

      console.log("💾 Saving targets:", validTargets);

      // Update project with targets
      await updateProject({
        targets: validTargets
      });

      toast.success(`${validTargets.length} target(s) saved successfully`);

      // Navigate to uploads page
      const uploadsPath = `/dashboard/projects/create/uploads?id=${projectId}`;
      router.push(uploadsPath);
    } catch (error: any) {
      console.error("❌ Error saving targets:", error);
      toast.error("Failed to save targets. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (!projectId) {
      toast.error("Project ID is required");
      return;
    }

    // Navigate to uploads page without saving targets
    const uploadsPath = `/dashboard/projects/create/uploads?id=${projectId}`;
    router.push(uploadsPath);
  };

  const handleBack = () => {
    if (!projectId) {
      router.push(RouteEnum.PROJECT_CREATE);
      return;
    }

    // Go back to summary with project ID
    const summaryPath = `/dashboard/projects/create/summary?id=${projectId}`;
    router.push(summaryPath);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!projectId || !project) {
    return (
      <div className='space-y-5'>
        <div className='flex items-center gap-5'>
          <Link
            href={RouteEnum.PROJECTS}
            className='w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center'
          >
            <LongArrowLeft />
          </Link>
          <BreadcrumbCard list={breadcrumbs} />
        </div>
        <Card className="p-12 text-center">
          <p className="text-red-500 font-semibold">Project not found</p>
          <p className="text-sm text-gray-600 mt-2">
            Please start by creating a project in Step 1
          </p>
          <Button
            type="button"
            className="mt-4"
            onClick={() => router.push(RouteEnum.PROJECT_CREATE)}
          >
            Go to Step 1
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-5'>
      <div className='flex items-center gap-5'>
        <Link
          href={RouteEnum.PROJECTS}
          className='w-[3rem] h-[3rem] rounded-full drop-shadow-md bg-white flex items-center justify-center'
        >
          <LongArrowLeft />
        </Link>
        <BreadcrumbCard list={breadcrumbs} />
      </div>

      <ProjectLayout>
        <div className='space-y-6'>
          <Card className='space-y-6 py-5'>
            {/* Step Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>Define Performance Targets</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Set measurable targets for <span className="font-semibold">{project.data.title}</span>
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2 ml-14">
                <div className="flex-1 h-2 bg-green-200 rounded-full">
                  <div className="h-2 bg-green-600 rounded-full" style={{ width: '66%' }}></div>
                </div>
                <span className="text-xs text-gray-500 font-medium">Step 2 of 3</span>
              </div>
            </div>

            {/* Targets Section */}
            <TargetsToggleView
              key={`targets-${projectId}-${projectTargets.length}`}
              isEditable={true}
              onTargetsChange={setProjectTargets}
              initialTargets={projectTargets}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Back to Step 1
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                >
                  Skip for Now
                </Button>

                <FormButton
                  type="button"
                  onClick={handleSaveAndContinue}
                  isLoading={isSubmitting || isUpdateLoading}
                  label="Save & Continue to Uploads"
                  loadingText="Saving Targets..."
                />
              </div>
            </div>
          </Card>
        </div>
      </ProjectLayout>
    </div>
  );
}
