"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "@/components/atoms/BackNavigation";
import FadedButton from "@/components/atoms/FadedButton";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormTextArea from "@/components/atoms/FormTextArea";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CG_ROUTES } from "@/constants/RouterConstants";
import {
  CloseOutPlanSchema,
  TCloseOutPlanFormData,
} from "@/features/contracts-grants/types/closeout-plan";
import { useEffect, useMemo, useState } from "react";
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
import { fileToBase64 } from "@/utils/fileToBase64";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import { X } from "lucide-react";

export default function CreateCloseOutPlan() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const router = useRouter();

  // State to track uploaded files for each activity
  // Structure: { taskIndex: { activityIndex: File[] } }
  const [activityFiles, setActivityFiles] = useState<Record<number, Record<number, File[]>>>({});

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
              documents: [],
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
      // Convert all uploaded files to base64
      let taskActivityIndex = 0;
      const tasksWithDocuments = await Promise.all(
        data.tasks.flatMap(async (task, taskIndex) => {
          return Promise.all(
            task.activities.map(async (activity, activityIndex) => {
              const files = activityFiles[taskIndex]?.[activityIndex] || [];

              // Convert files to base64
              const documents = await Promise.all(
                files.map(async (file) => ({
                  name: file.name,
                  document: await fileToBase64(file),
                }))
              );

              return {
                description: activity.description,
                designation: activity.designation,
                remarks: activity.remarks,
                status: activity.status,
                start_date: activity.start_date,
                end_date: activity.end_date,
                documents: documents.length > 0 ? documents : undefined,
              };
            })
          );
        })
      );

      // Flatten the nested arrays
      const flatTasks = tasksWithDocuments.flat();

      // Transform nested structure to flat structure for backend
      const transformedData = {
        project: data.project,
        department: data.department,
        location: data.location,
        key_task: data.tasks[0]?.key_task || null,
        tasks: flatTasks,
      };

      if (id) {
        await modifyCloseOutPlan(transformedData as any);
        toast.success("Close Out Plan Updated");
      } else {
        await createCloseOutPlan(transformedData as any);
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
          documents: [],
        }))
      }];

      form.reset({
        project: typeof proj === 'string' ? proj : proj.id,
        department: typeof dept === 'string' ? dept : dept.id,
        location: typeof loc === 'string' ? loc : loc.id,
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
                  activityFiles={activityFiles}
                  setActivityFiles={setActivityFiles}
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
                    documents: [],
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
  positionOptions,
  activityHeadingOptions,
  activityFiles,
  setActivityFiles,
}: {
  taskIndex: number;
  removeTask: (index: number) => void;
  control: any;
  register: any;
  canDelete: boolean;
  positionOptions: { label: string; value: string }[];
  activityHeadingOptions: { label: string; value: string }[];
  activityFiles: Record<number, Record<number, File[]>>;
  setActivityFiles: React.Dispatch<React.SetStateAction<Record<number, Record<number, File[]>>>>;
}) {
  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    control,
    name: `tasks.${taskIndex}.activities`,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, activityIndex: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const maxSizeInMB = 30;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      // Validate each file
      const validFiles: File[] = [];
      for (const file of selectedFiles) {
        if (file.size > maxSizeInBytes) {
          const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
          toast.error(
            `File "${file.name}" is too large! Maximum size is ${maxSizeInMB}MB. File size is ${fileSizeMB}MB.`,
            { duration: 6000 }
          );
        } else {
          validFiles.push(file);
        }
      }

      if (validFiles.length > 0) {
        setActivityFiles(prev => ({
          ...prev,
          [taskIndex]: {
            ...prev[taskIndex],
            [activityIndex]: [...(prev[taskIndex]?.[activityIndex] || []), ...validFiles],
          },
        }));
        toast.success(`${validFiles.length} file(s) selected successfully`);
      }

      // Reset input
      e.target.value = '';
    }
  };

  const removeFile = (activityIndex: number, fileIndex: number) => {
    setActivityFiles(prev => {
      const currentFiles = prev[taskIndex]?.[activityIndex] || [];
      const newFiles = currentFiles.filter((_, idx) => idx !== fileIndex);
      return {
        ...prev,
        [taskIndex]: {
          ...prev[taskIndex],
          [activityIndex]: newFiles,
        },
      };
    });
  };

  return (
    <Card className='space-y-5'>
      <div className='flex justify-between items-start gap-4'>
        <div className='flex-1'>
          <FormSelect
            label='Section Heading (Optional)'
            name={`tasks.${taskIndex}.key_task`}
            placeholder='Select section heading'
            options={activityHeadingOptions}
          />
          <p className='text-xs text-gray-500 mt-1'>
            Select a section heading to group activities, or leave blank if not needed.
            Manage headings in <a href="/dashboard/c-and-g/close-out-plan/activity-headings" className="text-primary hover:underline" target="_blank">Activity Headings</a>.
          </p>
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
              placeholder='Enter Activity Description (or Section Heading like "FILES, DATA AND RECORDS")'
              required
            />
            <p className='text-xs text-gray-500 -mt-3'>
              💡 Tip: To create a section header, just fill in the description and leave dates/designation empty
            </p>
            <div className='grid grid-cols-2 gap-5'>
              <FormSelect
                label='Designation / Responsible'
                name={`tasks.${taskIndex}.activities.${activityIndex}.designation`}
                placeholder='Select Position/Designation - Optional for headers'
                options={positionOptions}
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
              />

              <FormInput
                type='date'
                label='End Date'
                name={`tasks.${taskIndex}.activities.${activityIndex}.end_date`}
              />

              <FormTextArea
                label='Remarks'
                name={`tasks.${taskIndex}.activities.${activityIndex}.remarks`}
                placeholder='Enter Remarks (optional)'
              />
            </div>

            {/* Document Upload Section */}
            <div className='mt-4'>
              <Label className='font-semibold'>Upload Supporting Documents (Optional)</Label>
              <p className='text-xs text-gray-500 mb-2'>Maximum file size: 30MB per file. You can upload multiple files.</p>

              <div className='flex items-center gap-4'>
                <label
                  className='cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem] hover:bg-gray-50'
                  htmlFor={`file-activity-${taskIndex}-${activityIndex}`}
                >
                  <UploadFileSvg />
                  Select Files
                </label>
                <input
                  type='file'
                  multiple
                  name={`file-activity-${taskIndex}-${activityIndex}`}
                  hidden
                  id={`file-activity-${taskIndex}-${activityIndex}`}
                  onChange={(e) => handleFileChange(e, activityIndex)}
                />
              </div>

              {/* Display selected files */}
              {activityFiles[taskIndex]?.[activityIndex]?.length > 0 && (
                <div className='mt-3 space-y-2'>
                  <p className='text-sm font-medium text-gray-700'>
                    Selected Files ({activityFiles[taskIndex][activityIndex].length}):
                  </p>
                  <div className='space-y-2'>
                    {activityFiles[taskIndex][activityIndex].map((file, fileIndex) => (
                      <div
                        key={fileIndex}
                        className='flex items-center justify-between p-2 border rounded-lg bg-gray-50'
                      >
                        <span className='text-sm truncate flex-1'>{file.name}</span>
                        <span className='text-xs text-gray-500 mx-2'>
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeFile(activityIndex, fileIndex)}
                          className='text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0'
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            documents: [],
          })
        }
      >
        <AddSquareIcon /> Add Activity
      </FadedButton>
    </Card>
  );
}
