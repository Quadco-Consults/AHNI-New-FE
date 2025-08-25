"use client";

import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProjectLayout from "./ProjectLayout";
import { Button } from "components/ui/button";
import FormButton from "@/components/FormButton";
import { Label } from "components/ui/label";
import { openDialog } from "store/ui";
import { DialogType, mediumDailogScreen } from "constants/dailogs";
import { FormField, FormItem, Form, FormControl } from "components/ui/form";
import Card from "components/Card";
import FormInput from "components/atoms/FormInput";
import MultiSelectFormField from "components/ui/multiselect";
import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextArea from "components/atoms/FormTextArea";
import { toast } from "sonner";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import {
  addObjective,
  clearObjectives,
  removeObjective,
} from "store/formData/project-objective";
import { addPartner, clearPartners } from "store/formData/project-values";
import use from "hooks/use";
import {
  useAddProject,
  useGetSingleProject,
  useUpdateProject,
} from "@/features/projects/controllers/projectController";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { FaTimes } from "react-icons/fa";
import FormSelect from "components/atoms/FormSelect";
import { useGetAllBeneficiaries } from "@/features/modules/controllers/project/beneficiaryController";
import { useGetAllFundingSources } from "@/features/modules/controllers/project/fundingSourceController";
import { useGetAllPartners } from "@/features/modules/controllers/project/partnerController";
import {
  ProjectSchema,
  TProjectFormValues,
} from "@/features/projects/types/project";
import ConsortiumPartners from "./ConsortiumPartners";
import BreadcrumbCard, { TBreadcrumbList } from "components/Breadcrumb";
import LongArrowLeft from "components/icons/LongArrowLeft";
import { RouteEnum } from "constants/RouterConstants";
import DateInput from "components/DateInput";
import { formatDate } from "utils/date";
// import { nigerianStates } from "lib/index";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllInterventionAreas } from "@/features/modules/controllers/program/interventionAreaController";
import FormMultiSelect from "components/atoms/FormMultiSelect";
// import { useGetAllGrants } from "@/features/c&g/grant/grant";

const breadcrumbs: TBreadcrumbList[] = [
  { name: "Projects", icon: true },
  { name: "Create", icon: true },
  { name: "Summary", icon: false },
];

export default function ProjectSummaryPage() {
  const { data: beneficiary } = useGetAllBeneficiaries({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: fundingSource } = useGetAllFundingSources({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: user } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
  });

  const userOptions = user?.data?.results?.map((user) => ({
    name: user.first_name + " " + user.last_name,
    id: user.id,
  }));
  console.log({ userOptions });

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
      achievement_against_target: "",
      beneficiaries: [],
      currency: "USD",
      start_date: "",
      end_date: "",
      intervention_area: [],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (project) {
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
        achievement_against_target,
        beneficiaries,
        objectives,
        partners,
        currency,
        intervention_area,
        // eslint-disable-next-line no-unsafe-optional-chaining
      } = project?.data;

      const projectManagers = project_managers.map((manager) => manager.id);
      const locations = location.map((loc) => loc.id);

      const fundingSources = funding_sources.map((source) => source.id);

      const beneficiariesArr = beneficiaries.map((ben) => ben.id);
      const interventionAreaId = intervention_area?.id;

      reset({
        title,
        project_id,
        // @ts-ignore
        location: locations,
        intervention_area: interventionAreaId,
        goal,
        narrative: narrative || "",
        budget_performance,
        budget: String(budget),
        project_managers: projectManagers,
        funding_sources: fundingSources,
        expected_results,
        achievement_against_target,
        beneficiaries: beneficiariesArr,
        currency,
        start_date,
        end_date,
      });

      objectives?.map((obj) => {
        dispatch(addObjective(obj));
      });

      dispatch(addPartner(partners));
    }
  }, [project, partner, dispatch, reset]);

  const pathname = usePathname();

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
      location?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [location]
  );

  const interventionAreaOptions = useMemo(
    () =>
      interventionAreas?.data.results.map(({ code, id }) => ({
        label: code,
        value: id,
      })),
    [interventionAreas]
  );

  console.log({ formCheck: form.getValues() });

  const onSubmit: SubmitHandler<TProjectFormValues> = async ({
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
    intervention_area,
  }) => {
    const partnersId = consortiumPartners.map((partner) => partner.id);

    const formData = {
      title: title,
      project_id: project_id,
      goal: goal,
      narrative: narrative,
      budget_performance: budget_performance,
      start_date: formatDate(start_date),
      end_date: formatDate(end_date),
      project_managers: project_managers,
      partners: partnersId,
      funding_sources: funding_sources,
      objectives: objectives.objectives,
      expected_results: expected_results,
      achievement_against_target: achievement_against_target,
      beneficiaries: beneficiaries,
      budget: budget,
      currency: currency,
      location,
      intervention_area,
    };
    console.log({ formData });

    try {
      let id;

      if (projectId) {
        await updateProject(formData);
        toast.success("Project Updated Successfully.");
        id = projectId;
      } else {
        const res = await addProject(formData as any);

        id = res?.data?.id;
      }

      let path = pathname;

      path = path.substring(0, path.lastIndexOf("/"));

      path += `/create/uploads?id=${id}`;
      router.push(path);

      dispatch(clearObjectives());
      dispatch(clearPartners());
    } catch (error: any) {
      console.log({ error });
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
                    label='Project Location'
                    name='location'
                    placeholder='Select Location'
                    required
                    options={locationOptions}
                  />
                  <FormSelect
                    label='Intervention Area'
                    name='intervention_area'
                    placeholder='Select an Intervention Area'
                    required
                    options={interventionAreaOptions}
                  />
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
                    type='number'
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
                            options={fundingSource?.data.results || []}
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
                          <FaTimes color='red' size={16} />
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

                <FormInput
                  label='Achievement against target'
                  name='achievement_against_target'
                  placeholder='Enter Achievement Against Target'
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
