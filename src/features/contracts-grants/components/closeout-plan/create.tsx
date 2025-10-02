"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import FadedButton from "components/atoms/FadedButton";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import DeleteIcon from "components/icons/DeleteIcon";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { CG_ROUTES } from "constants/RouterConstants";
import {
  CloseOutPlanSchema,
  TCloseOutPlanFormData,
} from "@/features/contracts-grants/types/closeout-plan";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  useCreateCloseOutPlanMutation,
  useModifyCloseOutPlanMutation,
  useGetSingleCloseOutPlanQuery,
} from "@/features/contracts-grants/controllers/closeoutPlanController";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllProjectsQuery } from "@/features/projects/controllers/projectController";
import { toast } from "sonner";

export default function CreateCloseOutPlan() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const router = useRouter();

  const form = useForm<TCloseOutPlanFormData>({
    resolver: zodResolver(CloseOutPlanSchema),
    defaultValues: {
      project: "",
      department: "",
      location: "",
      tasks: [
        {
          key_task: "",
          activities: [
            {
              description: "",
              designation: "",
              remarks: "",
              start_date: "",
              end_date: "",
              status: "Pending",
            },
          ],
        },
      ],
    },
  });

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({
    name: "tasks",
    control: form.control,
  });

  const { data: project } = useGetAllProjectsQuery({
    page: 1,
    size: 2000000,
  });

  const projectOptions = useMemo(
    () =>
      project?.data.results.map(({ title, id }) => ({
        label: title,
        value: id,
      })) || [],
    [project?.data.results]
  );

  const { data: department } = useGetAllDepartments({
    page: 1,
    size: 2000000,
    search: "",
  });

  const departmentOptions = useMemo(
    () =>
      department?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })) || [],
    [department?.data.results]
  );

  const { data: location } = useGetAllLocations({
    page: 1,
    size: 2000000,
  });

  const locationOptions = useMemo(
    () =>
      location?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })) || [],
    [location?.data.results]
  );

  const { createCloseoutPlan: createCloseOutPlan, isLoading: isCreateLoading } =
    useCreateCloseOutPlanMutation();

  const { updateCloseoutPlan: modifyCloseOutPlan, isLoading: isModifyLoading } =
    useModifyCloseOutPlanMutation(id || "");

  const onSubmit: SubmitHandler<TCloseOutPlanFormData> = async (data) => {
    try {
      if (id) {
        await modifyCloseOutPlan(data);
        toast.success("Close Out Plan Updated");
      } else {
        await createCloseOutPlan(data);
        toast.success("Close Out Plan Created");
      }

      router.push(CG_ROUTES.CLOSE_OUT);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const { data: closeoutPlanData } = useGetSingleCloseOutPlanQuery(id ?? skipToken);

  useEffect(() => {
    if (closeoutPlanData?.data && id) {
      const { project: proj, department: dept, location: loc, tasks } = closeoutPlanData.data;

      // Transform tasks to match form structure
      const formTasks = tasks.map(task => ({
        key_task: task.key_task,
        activities: task.activities.map(activity => ({
          description: activity.description,
          designation: activity.designation,
          remarks: activity.remarks || "",
          start_date: activity.start_date,
          end_date: activity.end_date,
          status: activity.status || "Pending",
        }))
      }));

      form.reset({
        project: proj.id,
        department: dept.id,
        location: loc.id,
        tasks: formTasks,
      });
    }
  }, [closeoutPlanData, id, form]);

  return (
    <Card>
      <BackNavigation extraText='New Close Out Plan' />

      <CardContent>
        <Form {...form}>
          <form className='space-y-5' onSubmit={form.handleSubmit(onSubmit)}>
            <FormSelect
              label='Project'
              name='project'
              placeholder='Select Project'
              required
              options={projectOptions}
            />

            <FormSelect
              label='Department'
              name='department'
              placeholder='Select Department'
              required
              options={departmentOptions}
            />

            <FormSelect
              label='Location'
              name='location'
              placeholder='Select Location'
              required
              options={locationOptions}
            />

            <div className='space-y-5'>
              {taskFields.map((_, taskIndex) => (
                <TaskItem
                  key={taskFields[taskIndex].id}
                  taskIndex={taskIndex}
                  removeTask={removeTask}
                  control={form.control}
                  register={form.register}
                  canDelete={taskFields.length > 1}
                />
              ))}

              <FadedButton
                type='button'
                size='lg'
                className='text-primary'
                onClick={() => appendTask({
                  key_task: "",
                  activities: [{
                    description: "",
                    designation: "",
                    remarks: "",
                    start_date: "",
                    end_date: "",
                    status: "Pending",
                  }]
                })}
              >
                <AddSquareIcon /> Add Task
              </FadedButton>
            </div>

            <div className='flex justify-end items-center gap-x-5'>
              <FadedButton
                type='button'
                size='lg'
                className='text-primary'
                onClick={() => router.push(CG_ROUTES.CLOSE_OUT)}
              >
                Cancel
              </FadedButton>
              <FormButton
                loading={isCreateLoading || isModifyLoading}
                size='lg'
              >
                Submit
              </FormButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function TaskItem({
  taskIndex,
  removeTask,
  control,
  register,
  canDelete,
}: {
  taskIndex: number;
  removeTask: (index: number) => void;
  control: any;
  register: any;
  canDelete: boolean;
}) {
  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    control,
    name: `tasks.${taskIndex}.activities`,
  });

  return (
    <Card className='space-y-5'>
      <div className='flex justify-between items-start gap-4'>
        <div className='flex-1'>
          <FormTextArea
            label='Key Task'
            name={`tasks.${taskIndex}.key_task`}
            placeholder='Enter Key Task (e.g., FILES, DATA AND RECORDS, PROGRAM/TECHNICAL)'
            required
          />
        </div>
        {canDelete && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => removeTask(taskIndex)}
            className='text-red-600 hover:text-red-700 hover:bg-red-50 mt-6'
          >
            <DeleteIcon />
            Remove Task
          </Button>
        )}
      </div>

      {activityFields.map((activity, activityIndex) => (
        <div key={activity.id} className='space-y-3 p-4 border rounded-lg bg-gray-50'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>
              Activity {activityIndex + 1}
            </h3>
            {activityFields.length > 1 && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => removeActivity(activityIndex)}
                className='text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                <DeleteIcon />
              </Button>
            )}
          </div>
          <div className='space-y-5'>
            <FormTextArea
              label='Description'
              name={`tasks.${taskIndex}.activities.${activityIndex}.description`}
              placeholder='Enter Activity Description'
              required
            />
            <div className='grid grid-cols-2 gap-5'>
              <FormInput
                label='Designation / Responsible'
                name={`tasks.${taskIndex}.activities.${activityIndex}.designation`}
                placeholder='Enter Designation (e.g., STO, Program Manager)'
                required
              />

              <FormSelect
                label='Status'
                name={`tasks.${taskIndex}.activities.${activityIndex}.status`}
                placeholder='Select Status'
                options={[
                  { label: "Pending", value: "Pending" },
                  { label: "In Progress", value: "In Progress" },
                  { label: "Completed", value: "Completed" },
                  { label: "On Hold", value: "On Hold" },
                ]}
              />

              <FormInput
                type='date'
                label='Start Date'
                name={`tasks.${taskIndex}.activities.${activityIndex}.start_date`}
                required
              />

              <FormInput
                type='date'
                label='End Date'
                name={`tasks.${taskIndex}.activities.${activityIndex}.end_date`}
                required
              />

              <FormTextArea
                label='Remarks'
                name={`tasks.${taskIndex}.activities.${activityIndex}.remarks`}
                placeholder='Enter Remarks (optional)'
              />
            </div>
          </div>
        </div>
      ))}
      <FadedButton
        type='button'
        size='lg'
        className='text-primary'
        onClick={() =>
          appendActivity({
            description: "",
            designation: "",
            remarks: "",
            start_date: "",
            end_date: "",
            status: "Pending",
          })
        }
      >
        <AddSquareIcon /> Add Activity
      </FadedButton>
    </Card>
  );
}
