"use client";
import { useRouter } from "next/navigation";
import FormButton from "@/components/FormButton";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { Label } from "components/ui/label";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { Button } from "components/ui/button";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/Card";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import DeleteIcon from "components/icons/DeleteIcon";
import FormTextArea from "components/atoms/FormTextArea";
import FormSelect from "components/atoms/FormSelectField";
import BreadcrumbCard from "components/Breadcrumb";
import {
  EngagementPlanSchema,
  TEngagementPlanFormValues,
} from "features/programs/types/engagement-plan";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  addStakeholders,
  removeStakeholder,
} from "store/formData/stakeholders";
import { useGetAllStakeholderRegister } from "@/features/programs/controllers/stakeholderController";
import {
  useCreateEngagementPlan,
  useGetSingleEngagementPlan,
  useUpdateEngagementPlan,
} from "@/features/programs/controllers/engagementPlanController";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useGetAllProjects } from "@/features/projects/controllers/projectController";
import { RouteEnum } from "constants/RouterConstants";

const breadcrumbs = [
  { name: "Programs", icon: true },
  { name: "Stakeholder Management", icon: true },
  { name: "Engagement Plan", icon: true },
  { name: "Create", icon: false },
];

const influenceOptions = ["LOW", "MEDIUM", "HIGH"].map((option) => ({
  label: option,
  value: option,
}));

const commitmentLevelOptions = [
  "UNAWARE",
  "AGAINST",
  "NEUTRAL",
  "PHONE_SUPPORT ",
  "LEADING",
].map((option) => ({
  label: option,
  value: option,
}));

const CreateEngagement = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  // Fetch all stakeholders from API
  const { data: stakeholderData, isLoading: isStakeholderLoading } =
    useGetAllStakeholderRegister({ page: 1, size: 100 });
  const allStakeholders = Array.isArray(stakeholderData?.results)
    ? stakeholderData.results
    : [];
  const dispatch = useAppDispatch();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const form = useForm<TEngagementPlanFormValues>({
    resolver: zodResolver(EngagementPlanSchema),
    defaultValues: {
      project: "",
      project_deliverables: "",
      start_date: "",
      end_date: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stakeholders",
  });

  const { data: project } = useGetAllProjects({
    page: 1,
    size: 2000000,
  });

  const projectOptions = project?.data.results.map((project) => ({
    label: project.title,
    value: project.id,
  }));

  const { selectedStakeholders } = useAppSelector((state) => state.stakeholder);

  // Optionally, use allStakeholders for selection modal or list
  // Example: pass allStakeholders to your stakeholder selection modal/component

  const { createEngagementPlan, isLoading: isCreateLoading } =
    useCreateEngagementPlan();

  const { updateEngagementPlan, isLoading: isUpdateLoading } =
    useUpdateEngagementPlan(id);

  const { data: engagementPlan } = useGetSingleEngagementPlan(id as string);

  useEffect(() => {
    const newStakeholders = selectedStakeholders.filter(
      (stakeholder) =>
        !fields.find((field) => stakeholder.id === field.stakeholder)
    );

    newStakeholders.forEach((stakeholder) => {
      append({
        influence: "LOW",
        information_type: "",
        decision_maker: "",
        frequency: "",
        type: "",
        commitment_level: "UNAWARE",
        stakeholder: stakeholder.id,
      });
    });
  }, [selectedStakeholders]);

  useEffect(() => {
    if (engagementPlan) {
      const {
        project: { id },
        project_deliverables,
        start_date,
        end_date,
        stakeholders,
      } = engagementPlan.data;

      reset({
        project: id,
        project_deliverables,
        start_date,
        end_date,
        stakeholders: stakeholders.map(
          ({
            influence,
            information_type,
            decision_maker,
            frequency,
            type,
            commitment_level,
            stakeholder,
          }) => ({
            influence,
            information_type,
            decision_maker,
            frequency,
            type,
            commitment_level,
            stakeholder: stakeholder.id,
          })
        ),
      });

      dispatch(
        addStakeholders(stakeholders.map(({ stakeholder }) => stakeholder))
      );
    }
  }, [engagementPlan]);

  const onSubmit: SubmitHandler<TEngagementPlanFormValues> = async (data) => {
    try {
      if (id) {
        await updateEngagementPlan(data);
        toast.success("Engagement Plan Updated");
      } else {
        await createEngagementPlan(data);
        toast.success("Engagement Plan Created");
      }
      // router.push(RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN);
      goBack();
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div className='space-y-6 min-h-screen'>
      <BreadcrumbCard list={breadcrumbs} />
      <button
        onClick={goBack}
        className='w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center'
      >
        <LongArrowLeft />
      </button>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className='space-y-5 p-10'>
            <FormSelect
              name='project'
              label='Project Name'
              placeholder='Select Project'
              required
              options={projectOptions}
            />

            <FormTextArea
              name='project_deliverables'
              label='Project Deliverables'
              placeholder='Enter Project Deliverables'
              required
            />

            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <FormInput type='date' name='start_date' label='Start Date' />

              <FormInput type='date' name='end_date' label='End Date' />
            </div>

            <div className='flex flex-col space-y-3'>
              <Label className='font-semibold'>
                {selectedStakeholders?.length} Stakeholders selected
              </Label>

              <div className='space-y-3'>
                {fields.map((field, index) => {
                  const stakeholder = selectedStakeholders.find(
                    (stakeholder) => stakeholder.id === field.stakeholder
                  );

                  return (
                    <div
                      key={field.id}
                      className='flex flex-col items-center gap-5 md:flex-row'
                    >
                      <div className='bg-[#EBE8E1] space-y-4 rounded-lg p-3 flex-1'>
                        <h4 className='font-semibold'>{stakeholder?.name}</h4>

                        <div className='text-sm'>
                          <h4 className='font-semibold'>
                            Institution/Organization:
                          </h4>
                          <p>{stakeholder?.organization}</p>
                        </div>

                        <div className='grid text-xs grid-cols-2 gap-3'>
                          <div>
                            <h4 className='font-semibold'>Project Role:</h4>
                            <p>{stakeholder?.project_role}</p>
                          </div>
                          <div>
                            <h4 className='font-semibold'>Designation:</h4>
                            <p>{stakeholder?.designation}</p>
                          </div>
                        </div>

                        <div className='grid text-xs grid-cols-2 gap-3'>
                          <div>
                            <h4 className='font-semibold'>Phone Number:</h4>
                            <p>{stakeholder?.phone_number}</p>
                          </div>
                          <div>
                            <h4 className='font-semibold'>E-mail:</h4>
                            <p>{stakeholder?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className=' flex-[2] grid grid-cols-1 gap-3 md:grid-cols-3'>
                        <FormSelect
                          name={`stakeholders.${index}.influence`}
                          label='Influence'
                          placeholder='Medium'
                          required
                          options={influenceOptions}
                        />
                        <FormInput
                          name={`stakeholders.${index}.information_type`}
                          label='Information Type'
                        />
                        <FormInput
                          name={`stakeholders.${index}.decision_maker`}
                          label='Decision Maker'
                        />
                        <FormInput
                          name={`stakeholders.${index}.frequency`}
                          label='Frequency'
                        />
                        <FormInput
                          name={`stakeholders.${index}.type`}
                          label='Type'
                        />

                        <FormSelect
                          label='Commitment Level'
                          name={`stakeholders.${index}.commitment_level`}
                          placeholder='Select Commitment Level'
                          options={commitmentLevelOptions}
                        />
                        <div>
                          <Button
                            type='button'
                            className='flex gap-2 mt-3 py-6 bg-[#FFF2F2] text-red-500'
                            onClick={() => {
                              dispatch(removeStakeholder(field.stakeholder));

                              remove(index);
                            }}
                          >
                            <DeleteIcon />
                            Remove Stakeholder
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='mt-5 flex flex-col items-start'>
              <Button
                type='button'
                variant='outline'
                className='text-[#DEA004]'
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.StakeholderModal,
                      dialogProps: {
                        width: "max-w-7xl",
                        height: "max-h-[800px]",
                      },
                    })
                  );
                }}
              >
                Click to add stakeholders
              </Button>

              {errors["stakeholders"]?.message && (
                <span className='text-red-500 font-medium text-sm'>
                  {errors["stakeholders"]?.message}
                </span>
              )}
            </div>
          </Card>

          <div className='flex justify-end gap-5 pt-10'>
            <FormButton
              onClick={goBack}
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              size='lg'
            >
              Cancel
            </FormButton>

            <FormButton type='submit' loading={isCreateLoading} size='lg'>
              Submit
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateEngagement;
