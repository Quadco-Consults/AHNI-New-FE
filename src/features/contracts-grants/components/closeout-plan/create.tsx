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
import { useGetAllPositions } from "@/features/modules/controllers/config/positionController";
import { useGetAllActivityHeadings } from "@/features/contracts-grants/controllers/activityHeadingController";
import { toast } from "sonner";

export default function CreateCloseOutPlan() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const router = useRouter();

  const form = useForm<TCloseOutPlanFormData>({
    resolver: zodResolver(CloseOutPlanSchema),
    defaultValues: {
      project: "",
      department: "PRE-CLOSEOUT & CLOSE-OUT ACTIVITIES",
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

  const { data: positions } = useGetAllPositions({
    page: 1,
    size: 2000000,
    search: "",
    enabled: true,
  });

  // Debug: Log positions data
  useEffect(() => {
    console.log('Positions API Response:', positions);
    console.log('Positions data structure:', (positions as any)?.data);
    console.log('Positions results:', (positions as any)?.data?.results);
    console.log('Positions results (alt):', (positions as any)?.results);
  }, [positions]);

  const positionOptions = useMemo(
    () => {
      // Try multiple possible data structures
      const results = (positions as any)?.data?.results ||
                     (positions as any)?.results ||
                     (positions as any)?.data ||
                     [];

      console.log('Position options being created from:', results);

      const options = results.map((position: any) => ({
        label: position.title || position.name,
        value: position.title || position.name,
      }));

      console.log('Position options:', options);

      return options;
    },
    [positions]
  );

  // Fetch activity headings from API
  const { data: activityHeadings } = useGetAllActivityHeadings({
    page: 1,
    size: 1000, // Get all headings
  });

  const activityHeadingOptions = useMemo(
    () =>
      activityHeadings?.data?.results?.map((heading) => ({
        label: heading.name,
        value: heading.name,
      })) || [],
    [activityHeadings?.data?.results]
  );

  const { createCloseoutPlan: createCloseOutPlan, isLoading: isCreateLoading } =
    useCreateCloseOutPlanMutation();

  const { updateCloseoutPlan: modifyCloseOutPlan, isLoading: isModifyLoading } =
    useModifyCloseOutPlanMutation(id || "");

  const onSubmit: SubmitHandler<TCloseOutPlanFormData> = async (data) => {
    try {
      // Validation: Check for required fields
      if (!data.project) {
        toast.error("Please select a project");
        return;
      }
      if (!data.location) {
        toast.error("Please select a location");
        return;
      }

      // Validate that at least one activity has a description
      const hasValidActivity = data.tasks.some(task =>
        task.activities.some(activity => activity.description?.trim())
      );

      if (!hasValidActivity) {
        toast.error("Please add at least one activity with a description");
        return;
      }

      // Transform nested structure to flat structure for backend
      // Backend expects tasks array with activity fields directly, not nested activities
      const transformedData = {
        project: data.project,
        department: data.department,
        location: data.location,
        key_task: data.tasks[0]?.key_task || null, // Use first task's key_task
        tasks: data.tasks.flatMap(task =>
          task.activities
            .filter(activity => activity.description?.trim()) // Only include activities with descriptions
            .map(activity => ({
              description: activity.description,
              designation: activity.designation,
              remarks: activity.remarks,
              status: activity.status,
              start_date: activity.start_date,
              end_date: activity.end_date,
            }))
        )
      };

      console.log('Submitting close out plan data:', transformedData);

      if (id) {
        await modifyCloseOutPlan(transformedData as any);
        toast.success("Close Out Plan updated successfully!");
      } else {
        await createCloseOutPlan(transformedData as any);
        toast.success("Close Out Plan created successfully!");
      }

      router.push(CG_ROUTES.CLOSE_OUT);
    } catch (error: any) {
      console.error('Close out plan submission error:', error);
      const errorMessage = error?.data?.message || error?.message || "Failed to save close out plan";
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const { data: closeoutPlanData } = useGetSingleCloseOutPlanQuery(id ?? skipToken);

  useEffect(() => {
    if (closeoutPlanData?.data && id) {
      const { project: proj, department: dept, location: loc, tasks, key_task } = closeoutPlanData.data;

      // Transform flat backend structure to nested form structure
      // Backend returns tasks array with activity fields directly
      // Form expects tasks with nested activities arrays
      const formTasks = [{
        key_task: key_task || "",
        activities: tasks.map((task: any) => ({
          description: task.description || "",
          designation: task.designation || "",
          remarks: task.remarks || "",
          start_date: task.start_date || "",
          end_date: task.end_date || "",
          status: task.status || "Pending",
        }))
      }];

      form.reset({
        project: proj.id,
        department: typeof dept === 'string' ? dept : dept.id, // Handle both string and object
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

            <FormInput
              label='Main Plan Title'
              name='department'
              value='PRE-CLOSEOUT & CLOSE-OUT ACTIVITIES'
              disabled
              className='bg-gray-100'
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
                  positionOptions={positionOptions}
                  activityHeadingOptions={activityHeadingOptions}
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

            <div className='flex justify-between items-center pt-6 border-t border-gray-200'>
              <div className='text-sm text-gray-600'>
                {id ? (
                  <p>📝 Updating existing close out plan</p>
                ) : (
                  <p>📋 Creating new close out plan • Ensure all required fields are completed</p>
                )}
              </div>
              <div className='flex items-center gap-x-4'>
                <FadedButton
                  type='button'
                  size='lg'
                  className='text-gray-600 hover:text-gray-800'
                  onClick={() => router.push(CG_ROUTES.CLOSE_OUT)}
                  disabled={isCreateLoading || isModifyLoading}
                >
                  Cancel
                </FadedButton>
                <FormButton
                  loading={isCreateLoading || isModifyLoading}
                  size='lg'
                  className={`min-w-[120px] ${
                    isCreateLoading || isModifyLoading
                      ? 'bg-blue-400'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isCreateLoading || isModifyLoading
                    ? (id ? 'Updating...' : 'Creating...')
                    : (id ? 'Update Plan' : 'Create Plan')
                  }
                </FormButton>
              </div>
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
  positionOptions,
  activityHeadingOptions,
}: {
  taskIndex: number;
  removeTask: (index: number) => void;
  control: any;
  register: any;
  canDelete: boolean;
  positionOptions: { label: string; value: string }[];
  activityHeadingOptions: { label: string; value: string }[];
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
          <FormSelect
            label='Section Heading (Optional)'
            name={`tasks.${taskIndex}.key_task`}
            placeholder='Select section heading or leave blank'
            options={activityHeadingOptions}
          />
          <div className='text-xs text-gray-600 mt-1 p-2 bg-blue-50 rounded border border-blue-200'>
            <p className='font-medium text-blue-800 mb-1'>💡 Section Heading Guide:</p>
            <ul className='list-disc list-inside space-y-1 text-blue-700'>
              <li>Use section headings to group related activities (e.g., "Files & Records", "Financial Reports")</li>
              <li>Activities under the same heading will be grouped together in reports</li>
              <li>Leave blank if activities don't need grouping</li>
              <li>Manage custom headings in <a href="/dashboard/c-and-g/close-out-plan/activity-headings" className="text-primary hover:underline font-medium" target="_blank">Activity Headings</a></li>
            </ul>
          </div>
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
              label='Description *'
              name={`tasks.${taskIndex}.activities.${activityIndex}.description`}
              placeholder='Enter detailed activity description (e.g., "Review and archive project files", "Submit final financial report")'
              required
              rows={3}
            />
            <div className='text-xs text-gray-600 -mt-2 p-2 bg-yellow-50 rounded border border-yellow-200'>
              <p className='font-medium text-yellow-800 mb-1'>📝 Activity Description Tips:</p>
              <ul className='list-disc list-inside space-y-1 text-yellow-700'>
                <li><strong>Be specific:</strong> "Submit final financial report to donor" instead of "Financial report"</li>
                <li><strong>Include action:</strong> Start with verbs like "Review", "Submit", "Archive", "Prepare"</li>
                <li><strong>For section headers:</strong> Use titles like "FILES, DATA AND RECORDS" and leave dates/designation empty</li>
              </ul>
            </div>
            <div className='grid grid-cols-2 gap-5'>
              <FormSelect
                label='Designation / Responsible'
                name={`tasks.${taskIndex}.activities.${activityIndex}.designation`}
                placeholder={
                  positionOptions.length > 0
                    ? 'Select responsible position/role (optional for section headers)'
                    : 'Loading positions...'
                }
                options={positionOptions}
                disabled={positionOptions.length === 0}
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
                label='Start Date (Optional)'
                name={`tasks.${taskIndex}.activities.${activityIndex}.start_date`}
                placeholder='Select planned start date'
              />

              <FormInput
                type='date'
                label='End Date (Optional)'
                name={`tasks.${taskIndex}.activities.${activityIndex}.end_date`}
                placeholder='Select target completion date'
              />

              <div className='col-span-2'>
                <FormTextArea
                  label='Remarks (Optional)'
                  name={`tasks.${taskIndex}.activities.${activityIndex}.remarks`}
                  placeholder='Add any additional notes, comments, or special instructions for this activity'
                  rows={2}
                />
              </div>
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
