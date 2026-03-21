"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectLayout from "./ProjectLayout";
import { Button } from "@/components/ui/button";
import FormButton from "@/components/FormButton";
import { Label } from "@/components/ui/label";
import { openDialog } from "@/store/ui";
import { DialogType, mediumDailogScreen } from "@/constants/dailogs";
import { FormField, FormItem, Form, FormControl } from "@/components/ui/form";
import Card from "@/components/Card";
import FormInput from "@/components/atoms/FormInput";
import MultiSelectFormField from "@/components/ui/multiselect";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextArea from "@/components/atoms/FormTextArea";
import { toast } from "sonner";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { filterAhniStaffOnly } from "@/utils/userFilters";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";
import {
  addObjective,
  clearObjectives,
  removeObjective,
} from "@/store/formData/project-objective";
import { addPartner, clearPartners } from "@/store/formData/project-values";
import use from "@/hooks/use";
import {
  useAddProject,
  useGetSingleProject,
  useUpdateProject,
} from "@/features/projects/controllers/projectController";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { X } from "lucide-react";
import FormSelect from "@/components/atoms/FormSelect";
import { useGetAllBeneficiaries } from "@/features/modules/controllers/project/beneficiaryController";
import { useGetAllFundingSources } from "@/features/modules/controllers/project/fundingSourceController";
import { useGetAllPartners } from "@/features/modules/controllers/project/partnerController";
import {
  ProjectSchema,
  TProjectFormValues,
  ProjectTargetDefinition,
} from "@/features/projects/types/project/index";
import ConsortiumPartners from "./ConsortiumPartners";
import TargetsToggleView from "./TargetsToggleView";
import BreadcrumbCard, { TBreadcrumbList } from "@/components/Breadcrumb";
import LongArrowLeft from "@/components/icons/LongArrowLeft";
import { RouteEnum } from "@/constants/RouterConstants";
import DateInput from "@/components/DateInput";
import { formatDate } from "@/utils/date";
// import { nigerianStates } from "@/lib/index";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllInterventionAreas } from "@/features/modules/controllers/program/interventionAreaController";
import FormMultiSelect from "@/components/atoms/FormMultiSelect";
// import { useGetAllGrants } from "@/features/c&g/grant/grant";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Projects", icon: true },
  { name: "Create", icon: true },
  { name: "Summary", icon: false },
];

export default function ProjectSummaryPage() {
  // State for managing project targets
  const [projectTargets, setProjectTargets] = useState<ProjectTargetDefinition[]>([]);
  // State for tracking loaded data to force component re-render
  const [loadedLocations, setLoadedLocations] = useState<string[]>([]);
  const [loadedInterventionAreas, setLoadedInterventionAreas] = useState<string[]>([]);

  const { data: beneficiary } = useGetAllBeneficiaries({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: fundingSource, isLoading: isFundingSourceLoading } = useGetAllFundingSources({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: user, isLoading: isUserLoading } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
  });

  // Get employee data like in site visit creator
  const { data: employeeData } = useGetEmployeeOnboardings({
    page: 1,
    size: 2000000,
    search: "",
  });

  // Combine and filter AHNI users and employees like site visit creator
  const userOptions = useMemo(() => {
    const allUsers = user?.data?.results || [];
    const allEmployees = employeeData?.data?.results || [];

    // Filter only AHNI staff from users
    const ahniUsers = filterAhniStaffOnly(allUsers);

    // Map both users and employees to consistent format
    const usersList = ahniUsers.map((userItem) => ({
      name: `${userItem.first_name} ${userItem.last_name}`,
      id: userItem.id,
      type: 'user'
    }));

    const employeesList = allEmployees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      id: employee.id,
      type: 'employee'
    }));

    // Combine both lists
    return [...usersList, ...employeesList];
  }, [user?.data?.results, employeeData?.data?.results]);

  const { data: partner } = useGetAllPartners({
    page: 1,
    size: 2000000,
    search: "",
  });

  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const { data: project } = useGetSingleProject(projectId, !!projectId);

  const {
    addProject,
    isLoading,
    data: projectData,
    isSuccess,
  } = useAddProject();

  const { updateProject, isLoading: isUpdateLoading } =
    useUpdateProject(projectId);

  const router = useRouter();

  const objectives = useAppSelector((state) => state.objectives);

  const dispatch = useAppDispatch();

  const form = useForm<TProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: "",
      project_id: "",
      location: [],
      goal: "",
      narrative: "",
      budget: "",
      funding_sources: [],
      project_managers: [],
      expected_results: "",
      budget_performance: "",
      beneficiaries: [],
      currency: "USD",
      start_date: "",
      end_date: "",
      intervention_areas: [],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (project && !isFundingSourceLoading && !isUserLoading) {
      const {
        title,
        project_id,
        location,
        goal,
        narrative,
        budget_performance,
        start_date,
        end_date,
        budget,
        project_managers,
        funding_sources,
        expected_results,
        beneficiaries,
        objectives,
        partners,
        currency,
        intervention_areas,
        targets,
        // eslint-disable-next-line no-unsafe-optional-chaining
      } = project?.data;

      console.log("📊 Loading project data for editing:", {
        projectId: project?.data?.id,
        hasPartners: !!partners,
        partnersCount: partners?.length || 0,
        hasProjectManagers: !!project_managers,
        projectManagersCount: project_managers?.length || 0,
        hasFundingSources: !!funding_sources,
        fundingSourcesCount: funding_sources?.length || 0,
        hasLocation: !!location,
        locationCount: location?.length || 0,
        hasInterventionAreas: !!intervention_areas,
        interventionAreasCount: intervention_areas?.length || 0,
        hasTargets: !!targets,
        targetsCount: targets?.length || 0,
        rawLocation: location,
        rawInterventionAreas: intervention_areas,
        rawTargets: targets,
      });

      const projectManagers = project_managers.map((manager: any) => manager.id);
      const locations = location.map((loc: any) => loc.id);

      const fundingSources = funding_sources.map((source: any) => source.id);

      const beneficiariesArr = beneficiaries.map((ben: any) => ben.id);
      const interventionAreaIds = intervention_areas?.map((area: any) => area.id) || [];

      // Store location and intervention area IDs in state to use in dynamic keys
      setLoadedLocations(locations);
      setLoadedInterventionAreas(interventionAreaIds);

      console.log("🔄 Mapped IDs:", {
        projectManagers,
        fundingSources,
        beneficiariesArr,
        locations,
        interventionAreaIds,
      });

      console.log("📋 Available options:", {
        userOptionsCount: userOptions?.length || 0,
        fundingSourceOptionsCount: fundingSource?.data?.results?.length || 0,
        beneficiaryOptionsCount: beneficiary?.data?.results?.length || 0,
      });

      reset({
        title,
        project_id,
        // @ts-ignore
        location: locations,
        intervention_areas: interventionAreaIds,
        goal,
        narrative: narrative || "",
        budget_performance,
        budget: budget ? String(budget) : "0",
        project_managers: projectManagers,
        funding_sources: fundingSources,
        expected_results,
        beneficiaries: beneficiariesArr,
        currency,
        start_date,
        end_date,
      });

      console.log("✅ Form reset with values:", {
        project_managers: projectManagers,
        funding_sources: fundingSources,
        location: locations,
        intervention_areas: interventionAreaIds,
      });

      // Clear existing objectives before adding new ones to avoid duplicates
      dispatch(clearObjectives());
      objectives?.map((obj: any) => {
        dispatch(addObjective(obj));
      });

      // Load partners into Redux state - CRITICAL for edit functionality
      console.log("👥 Loading partners into Redux:", partners);
      if (partners && partners.length > 0) {
        dispatch(addPartner(partners));
        console.log("✅ Partners loaded successfully:", partners.length);
      } else {
        console.warn("⚠️ No partners found in project data!");
      }

      // Load existing targets if available and map API fields to our schema
      if (targets && targets.length > 0) {
        console.log("🎯 Loading existing targets from API:", targets);

        // Map API response fields to our frontend schema
        const mappedTargets = targets.map((target: any) => ({
          id: target.id,
          indicator_code: target.indicator_code,
          indicator_name: target.indicator_name,
          tracking_mode: target.tracking_mode,
          fiscal_year: target.fiscal_year,
          annual_target: target.target_value ? parseFloat(target.target_value) : undefined, // API uses 'target_value'
          q1_target: target.q1_target ? parseFloat(target.q1_target) : undefined,
          q2_target: target.q2_target ? parseFloat(target.q2_target) : undefined,
          q3_target: target.q3_target ? parseFloat(target.q3_target) : undefined,
          q4_target: target.q4_target ? parseFloat(target.q4_target) : undefined,
          target_notes: target.comments, // API uses 'comments'
        }));

        console.log("✅ Mapped targets for frontend:", mappedTargets);
        setProjectTargets(mappedTargets);
        console.log("✅ Targets loaded successfully:", mappedTargets.length);
      } else {
        console.warn("⚠️ No targets found in project data!");
      }
    }
  }, [project, partner, dispatch, reset, setProjectTargets, isFundingSourceLoading, isUserLoading]);

  const { consortiumPartners } = useAppSelector(
    (state) => state.consortiumPartner
  );

  // const stateOptions = useMemo(
  //     () =>
  //         nigerianStates.map((state) => ({
  //             label: state,
  //             value: state,
  //         })),
  //     [nigerianStates]
  // );

  const { data: location } = useGetAllLocations({
    page: 1,
    size: 2000000,
    search: "",
  });
  const { data: interventionAreas } = useGetAllInterventionAreas({
    page: 1,
    size: 2000000,
    search: "",
  });

  const locationOptions = useMemo(
    () =>
      location?.data?.results?.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [location]
  );

  const interventionAreaOptions = useMemo(
    () =>
      interventionAreas?.data?.results?.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [interventionAreas]
  );

  // Debug form values and validation state
  console.log("📋 Current form values:", form.getValues());
  console.log("❌ Form errors:", form.formState.errors);
  console.log("✅ Form is valid:", form.formState.isValid);

  const onSubmit: SubmitHandler<TProjectFormValues> = async (data) => {
    console.log("🔥 FORM SUBMITTED! Data received:", data);

    const {
      title,
      project_id,
      goal,
      narrative,
      budget_performance,
      project_managers,
      funding_sources,
      expected_results,
      achievement_against_target,
      beneficiaries,
      budget,
      currency,
      start_date,
      end_date,
      location,
      intervention_areas,
    } = data;

    // Get partners from Redux state
    const partnersId = consortiumPartners.map((partner) => partner.id);

    // IMPORTANT FIX: If updating and partners array is empty, use existing project partners
    // This prevents sending an empty partners array which causes backend validation error
    let finalPartners = partnersId;
    if (projectId && partnersId.length === 0 && project?.data?.partners) {
      console.log("⚠️ Partners array is empty but project has partners. Using existing partners.");
      finalPartners = project.data.partners.map((partner) => partner.id);
    }

    // Validate that we have partners before submission
    if (finalPartners.length === 0) {
      toast.error("Please select at least one consortium partner before saving.");
      return;
    }

    const formData = {
      title: title,
      project_id: project_id,
      goal: goal,
      narrative: narrative,
      budget_performance: budget_performance,
      start_date: formatDate(start_date),
      end_date: formatDate(end_date),
      project_managers: project_managers,
      partners: finalPartners,
      funding_sources: funding_sources,
      objectives: objectives.objectives,
      expected_results: expected_results,
      achievement_against_target: achievement_against_target,
      beneficiaries: beneficiaries,
      budget: budget || "0",
      currency: currency,
      location,
      intervention_areas,
      // Add the new targets data - filter out incomplete targets without indicator_code
      targets: (() => {
        // First, filter out incomplete targets
        const validTargets = projectTargets.filter(target => target.indicator_code && target.indicator_code !== '');

        // Group by tracking mode
        const simpleTargets = validTargets.filter(t => t.tracking_mode === 'SIMPLE');
        const quarterlyTargets = validTargets.filter(t => t.tracking_mode === 'QUARTERLY');

        // If we have targets from BOTH modes, only send one mode (prefer QUARTERLY as it's more detailed)
        if (simpleTargets.length > 0 && quarterlyTargets.length > 0) {
          console.log("⚠️ MIXED MODES DETECTED: Found both SIMPLE and QUARTERLY targets. Sending only QUARTERLY targets.");
          return quarterlyTargets;
        }

        // Otherwise, return all valid targets
        return validTargets;
      })(),
    };

    console.log("🚀 FORM SUBMISSION - Complete Data Being Sent to Backend:");
    console.log("📍 Location:", location, "| Type:", typeof location, "| Is Array:", Array.isArray(location), "| Length:", location?.length);
    console.log("🎨 Intervention Areas:", intervention_areas, "| Type:", typeof intervention_areas, "| Is Array:", Array.isArray(intervention_areas), "| Length:", intervention_areas?.length);
    console.log("🎯 Targets (before filter):", projectTargets, "| Length:", projectTargets?.length);
    console.log("🎯 Targets (after filter):", formData.targets, "| Length:", formData.targets?.length);
    console.log("👥 Partners:", finalPartners, "| Length:", finalPartners?.length);
    console.log("💰 Budget:", budget, "| Currency:", currency);
    console.log("📦 Full Form Data:", formData);

    try {
      let id;

      if (projectId) {
        console.log("📝 Updating existing project:", projectId);
        const updateResponse = await updateProject(formData);
        console.log("✅ UPDATE RESPONSE:", updateResponse);
        if (updateResponse?.data) {
          console.log("📍 Response Location:", updateResponse.data.location);
          console.log("🎨 Response Intervention Areas:", updateResponse.data.intervention_areas);
          console.log("🎯 Response Targets:", updateResponse.data.targets);
        }
        toast.success("Project Updated Successfully.");
        id = projectId;
      } else {
        console.log("✨ Creating new project...");
        const res = await addProject(formData as any);
        console.log("✅ CREATE RESPONSE:", res);
        if (res?.data) {
          console.log("📍 Response Location:", res.data.location);
          console.log("🎨 Response Intervention Areas:", res.data.intervention_areas);
          console.log("🎯 Response Targets:", res.data.targets);
        }
        toast.success("Project Created Successfully.");
        id = res?.data?.id;
        console.log("🆔 Extracted project ID:", id);
      }

      // Navigate to uploads page
      // Construct path correctly whether we're at /create or /create/summary
      const uploadsPath = `/dashboard/projects/create/uploads?id=${id}`;
      console.log("🔄 Navigating to:", uploadsPath);
      router.push(uploadsPath);

      // Only clear state when creating a new project, not when updating
      if (!projectId) {
        dispatch(clearObjectives());
        dispatch(clearPartners());
      }
    } catch (error: any) {
      console.error("❌ PROJECT CREATION ERROR:", error);
      console.log("📄 Error details:", error);
      toast.error("Failed to save project. Please try again.");
    }
  };

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
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className='space-y-10 py-5'>
                <h4 className='text-lg font-semibold'>Project Summary</h4>

                <div className='grid grid-cols-2 gap-10'>
                  <FormInput
                    label='Project Title'
                    name='title'
                    placeholder='Enter Title'
                    required
                  />

                  <FormInput
                    label='Project ID'
                    name='project_id'
                    placeholder='Enter ID'
                    required
                  />

                  {/* <FormSelect
                                        label="Grant"
                                        name="grant"
                                        placeholder="Select Grant"
                                        required
                                        options={grantOptions}
                                    /> */}

                  <FormMultiSelect
                    key={`location-${projectId || 'new'}-${loadedLocations.join(',') || 'empty'}`}
                    label='Project Location'
                    name='location'
                    placeholder='Select Location'
                    required
                    options={locationOptions}
                  />
                  <FormMultiSelect
                    key={`intervention-${projectId || 'new'}-${loadedInterventionAreas.join(',') || 'empty'}`}
                    label='Intervention Areas'
                    name='intervention_areas'
                    placeholder='Select Intervention Areas'
                    options={interventionAreaOptions}
                  />
                </div>

                {/* Performance Targets Section - MOVED TO TOP */}
                <TargetsToggleView
                  key={`targets-${projectId || 'new'}-${projectTargets.length}`}
                  isEditable={true}
                  onTargetsChange={setProjectTargets}
                  initialTargets={projectTargets}
                />

                {/* Visual separator after Step 1 */}
                <div className="border-t-2 border-blue-100 pt-6 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-lg font-semibold text-gray-800">Project Details & Planning</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Now that you've defined your targets, provide the project details and planning information.
                  </p>
                </div>

                <FormTextArea
                  name='goal'
                  label='Goal of the project'
                  placeholder='Enter Goal'
                  required
                />

                <FormTextArea
                  name='narrative'
                  label='Narrative'
                  placeholder='Enter Narrative'
                  required
                />

                {projectId && (
                  <FormInput
                    name='budget_performance'
                    label='Budget Performance'
                    placeholder='Enter Budget Performance'
                    required
                  />
                )}

                <FormSelect
                  label='Currency'
                  name='currency'
                  required
                  placeholder='Select Currency'
                  options={[
                    { label: "NGN", value: "NGN" },
                    { label: "USD", value: "USD" },
                  ]}
                />

                <div className='grid grid-cols-2 gap-5'>
                  <DateInput label='Start Date' name='start_date' />

                  <DateInput label='End Date' name='end_date' />
                </div>

                <div className='grid gap-3 grid-cols-1 md:grid-cols-2'>
                  <FormInput
                    type='text'
                    label='Budget (Total Estimated Amount)'
                    name='budget'
                    placeholder='Enter Budget'
                    required
                  />

                  <div>
                    <Label className='font-semibold'>Project Managers</Label>

                    <FormField
                      control={form.control}
                      name='project_managers'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <MultiSelectFormField
                              key={`project-managers-${projectId || 'new'}-${field.value?.join(',')}`}
                              options={userOptions || []}
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                              placeholder='Select options'
                              variant='inverted'
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {errors.project_managers && (
                      <span className='text-sm text-red-500 font-medium'>
                        {errors.project_managers.message}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <Label className='font-semibold'>Funding Sources</Label>
                  <FormField
                    control={form.control}
                    name='funding_sources'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            key={`funding-sources-${projectId || 'new'}-${field.value?.join(',')}`}
                            options={fundingSource?.data?.results || []}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder='Select Funding Sources'
                            variant='inverted'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {errors.funding_sources && (
                    <span className='text-sm text-red-500 font-medium'>
                      {errors.funding_sources.message}
                    </span>
                  )}
                </div>

                <hr />

                <div className=' mt-10 space-y-3'>
                  <Label className='font-semibold text-red-600'>
                    Objectives
                  </Label>
                  <div className='flex flex-wrap gap-3'>
                    {objectives.objectives.map((objective, index) => (
                      <div
                        key={index}
                        className='border px-7 py-4 space-y-3 rounded-lg relative '
                      >
                        <p className='text-sm font-semibold'>
                          {objective?.objective}
                        </p>

                        {objective?.sub_objectives && (
                          <ul className='space-y-2'>
                            {objective?.sub_objectives.map(
                              (obj: any, i: number) => (
                                <li
                                  key={i}
                                  className='text-sm text-gray-500 list-disc pl-5'
                                >
                                  {obj}
                                </li>
                              )
                            )}
                          </ul>
                        )}

                        <Button
                          variant='ghost'
                          type='button'
                          className='absolute p-0 -right-2 -top-4 w-fit h-fit'
                          title='Delete Objective'
                          onClick={() =>
                            dispatch(removeObjective(objective.objective))
                          }
                        >
                          <X color='red' size={16} />
                        </Button>
                      </div>
                    ))}

                    <div>
                      <Button
                        variant='ghost'
                        type='button'
                        className='text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm'
                        onClick={() =>
                          dispatch(
                            openDialog({
                              type: DialogType.ProjectObjectiveModal,
                              dialogProps: {
                                ...mediumDailogScreen,
                              },
                            })
                          )
                        }
                      >
                        Click to add objectives
                      </Button>
                    </div>
                  </div>

                  {objectives.objectives.length === 0 && (
                    <span className='text-sm text-red-500 font-medium'>
                      Please select objectives
                    </span>
                  )}
                </div>

                <FormInput
                  label='Expected results'
                  name='expected_results'
                  placeholder='Enter Expected Results'
                  required
                />

                <div className='space-y-1'>
                  <Label className='font-semibold'>Target population</Label>
                  <FormField
                    control={form.control}
                    name='beneficiaries'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultiSelectFormField
                            key={`beneficiaries-${projectId || 'new'}-${field.value?.join(',')}`}
                            options={beneficiary?.data?.results || []}
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            placeholder='Select Target Population'
                            variant='inverted'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {errors.beneficiaries && (
                    <span className='text-sm text-red-500 font-medium'>
                      {errors.beneficiaries.message}
                    </span>
                  )}
                </div>

                <ConsortiumPartners />
              </Card>

              <div className='flex justify-end gap-5 mt-16'>
                <Button
                  onClick={() => router.back()}
                  type='button'
                  className='bg-[#FFF2F2] text-primary dark:text-gray-500'
                  size='lg'
                >
                  Cancel
                </Button>
                <FormButton
                  loading={isLoading || isUpdateLoading}
                  disabled={isLoading}
                  type='submit'
                  size='lg'
                  onClick={async (e) => {
                    console.log("🔘 Next button clicked!");
                    console.log("🔍 Form valid?", form.formState.isValid);
                    console.log("🔍 Form errors:", form.formState.errors);

                    // Force form submission regardless of validation status
                    e.preventDefault();
                    const formData = form.getValues();
                    console.log("🚀 Forcing submission with data:", formData);
                    await onSubmit(formData);
                  }}
                >
                  Next
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </ProjectLayout>
    </div>
  );
}
