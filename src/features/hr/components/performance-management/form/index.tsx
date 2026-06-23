"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelectField";
import GoBack from "@/components/GoBack";
import { Form } from "@/components/ui/form";
import { SelectContent } from "@/components/ui/select";
import { HrRoutes } from "@/constants/RouterConstants";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useCreatePerformanceAssesment } from "@/features/hr/controllers/hrPerformanceAssessmentController";
import { useGetEmployeeGoals } from "@/features/hr/controllers/goalsController";
import { toast } from "sonner";
import { EvaluatorType } from "@/features/hr/types/performance-assesment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Validation schema
const PerformanceAssessmentSchema = z.object({
  employee: z.string().min(1, "Employee is required"),
  description: z.string().min(1, "Description is required"),
  cycle_name: z.string().min(1, "Cycle is required"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  evaluators: z.array(
    z.object({
      evaluator: z.string().min(1, "Evaluator is required"),
      evaluator_type: z.enum(['self', 'supervisor', 'peer']),
    })
  ).min(1, "At least one evaluator is required"),
});

type PerformanceAssessmentFormData = z.infer<typeof PerformanceAssessmentSchema>;

const NewPerformance = () => {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  const form = useForm<PerformanceAssessmentFormData>({
    resolver: zodResolver(PerformanceAssessmentSchema),
    defaultValues: {
      employee: "",
      description: "",
      cycle_name: "",
      start_date: "",
      end_date: "",
      evaluators: [],
    },
  });

  const { control, handleSubmit, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "evaluators",
  });

  // Watch employee field for selection
  const watchedEmployee = watch("employee") as any;

  useEffect(() => {
    if (watchedEmployee) {
      setSelectedEmployee(watchedEmployee);
    }
  }, [watchedEmployee]);

  const appraisalTypeOptions = useMemo(
    () =>
      [
        "Annual performance review",
        "Introductory probation review",
        "Promotion probation review"
      ].map((title) => ({
        label: title,
        value: title,
      })),
    []
  );

  // Map appraisal type to cycle period
  const getCyclePeriod = (appraisalType: string): string => {
    const cyclePeriodMap: Record<string, string> = {
      'Annual performance review': '12 months',
      'Introductory probation review': '3 months',
      'Promotion probation review': '3 months',
    };
    return cyclePeriodMap[appraisalType] || '';
  };

  // Watch cycle_name to auto-populate cycle period
  const watchedCycleName = watch("cycle_name");
  const [cyclePeriod, setCyclePeriod] = useState<string>("");

  useEffect(() => {
    if (watchedCycleName) {
      const period = getCyclePeriod(watchedCycleName);
      setCyclePeriod(period);
    }
  }, [watchedCycleName]);

  const evaluatorTypeOptions = useMemo<{ label: string; value: EvaluatorType }[]>(
    () => [
      { label: "Self Evaluation", value: "self" },
      { label: "Supervisor", value: "supervisor" },
      { label: "Peer", value: "peer" },
    ],
    []
  );

  const { data: users } = useGetAllUsers({
    page: 1,
    size: 10000,
    search: "",
  });

  // Fetch employee goals to display
  const { data: employeeGoals, isLoading: isLoadingGoals } = useGetEmployeeGoals(
    selectedEmployee,
    !!selectedEmployee
  );

  const { createPerformanceAssesment, isLoading: isCreating } = useCreatePerformanceAssesment();

  const userOptions = useMemo(
    () => {
      // Handle paginated response: data.results or direct results
      const userList = users?.data?.results || users?.results || [];
      return userList.map(({ first_name, last_name, id }: any) => ({
        label: `${first_name || ''} ${last_name || ''}`.trim() || 'Unnamed User',
        value: id,
      }));
    },
    [users]
  );

  // Handle goals - could be paginated or direct array
  const goals = useMemo(() => {
    if (!employeeGoals?.data) return [];
    // If paginated: data.results
    if (employeeGoals.data.results) return employeeGoals.data.results;
    // If direct array
    if (Array.isArray(employeeGoals.data)) return employeeGoals.data;
    // Fallback
    return [];
  }, [employeeGoals]);

  const onSubmit = async (data: PerformanceAssessmentFormData) => {
    if (goals.length === 0) {
      toast.error("Please set your goals before creating a performance assessment");
      return;
    }

    try {
      const payload = {
        description: data.description,
        cycle_name: data.cycle_name,
        start_date: data.start_date,
        end_date: data.end_date,
        employee: data.employee,
        status: 'draft' as const,
        evaluators: data.evaluators.map(ev => ({
          evaluator: ev.evaluator,
          evaluator_type: ev.evaluator_type,
          status: 'pending' as const,
        })),
        created_by: data.employee,
      };

      const response = await createPerformanceAssesment(payload);
      toast.success("Performance assessment created successfully");
      router.push(HrRoutes.PERFORMANCE_MANAGEMENT);
    } catch (e) {
      console.error("Error creating assessment:", e);
      toast.error("Failed to create assessment");
    }
  };

  return (
    <div className=''>
      <GoBack />

      <div className='pt-10'>
        <h3 className='text-[18px] pb-10'>
          Initiate New Performance Assessment
        </h3>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            {/* Employee Selection - FIRST */}
            <div className=''>
              <h3 className='text-yellow-darker'>Employee Selection</h3>
            </div>

            <FormSelect
              label='Select Employee'
              name='employee'
              placeholder='Select employee to evaluate'
              required
              options={userOptions}
            >
              <SelectContent></SelectContent>
            </FormSelect>

            {/* Employee Goals Section - Shows AFTER employee is selected */}
            {selectedEmployee && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-yellow-darker'>Employee Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingGoals ? (
                    <p className='text-gray-500'>Loading employee goals...</p>
                  ) : goals.length === 0 ? (
                    <div className='text-center py-4'>
                      <p className='text-red-600 mb-2'>This employee hasn&apos;t set any goals yet!</p>
                      <p className='text-sm text-gray-600'>
                        The employee must set goals before a performance assessment can be created.
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {goals.map((goal) => {
                        const totalWeight = goal.total_weight || goal.narratives?.reduce((sum, n) => sum + parseFloat(n.weight?.toString() || '0'), 0);

                        return (
                          <div key={goal.id} className='p-3 border rounded-lg'>
                            <div className='flex justify-between items-start mb-2'>
                              <div className='flex-1'>
                                <p className='font-medium'>{goal.title}</p>
                                {goal.description && (
                                  <p className='text-sm text-gray-600 mt-1'>{goal.description}</p>
                                )}
                              </div>
                              <Badge variant='outline'>{totalWeight ? parseFloat(totalWeight.toString()).toFixed(0) : 0}%</Badge>
                            </div>

                            {/* Narratives/Tasks */}
                            {goal.narratives && goal.narratives.length > 0 && (
                              <div className='mt-2 pl-2 border-l-2 border-gray-200'>
                                <p className='text-xs font-medium text-gray-500 mb-1'>Tasks:</p>
                                <ul className='space-y-1'>
                                  {goal.narratives.map((narrative, idx) => (
                                    <li key={idx} className='text-xs flex items-start gap-2'>
                                      <span className='text-gray-400'>•</span>
                                      <span className='flex-1'>{narrative.description}</span>
                                      <Badge variant='secondary' className='text-xs h-4'>
                                        {parseFloat(narrative.weight?.toString() || '0').toFixed(0)}%
                                      </Badge>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Appraisal Information */}
            <div className=''>
              <h3 className='text-yellow-darker'>Appraisal Information</h3>
            </div>

            <div className='grid gap-5 grid-cols-2'>
              <FormInput
                label='Description'
                name='description'
                type='text'
                required
                placeholder='e.g., Q1 2025 Performance Review'
              />

              <FormSelect
                label='Appraisal Type'
                name='cycle_name'
                placeholder='Select appraisal type'
                required
                options={appraisalTypeOptions}
              />
            </div>

            {/* Display Cycle Period (Auto-populated) */}
            {cyclePeriod && (
              <div className='grid gap-5 grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm font-medium'>
                    Cycle Period <span className='text-gray-500'>(Auto-populated)</span>
                  </label>
                  <div className='h-10 px-3 py-2 bg-gray-100 border rounded-md flex items-center text-gray-700'>
                    {cyclePeriod}
                  </div>
                </div>
              </div>
            )}

            <div className='grid gap-5 grid-cols-2'>
              <FormInput
                label='Start Date'
                name='start_date'
                type='date'
              />

              <FormInput
                label='End Date'
                name='end_date'
                type='date'
              />
            </div>

            {/* Evaluators Section */}
            <div className=''>
              <h3 className='text-yellow-darker'>Select Evaluators</h3>
              <p className='text-sm text-gray-600 mt-1'>
                Choose who will evaluate your performance. You can select yourself, supervisors, and peers.
              </p>
            </div>

            <div className='grid gap-5'>
              {fields.map((field, index) => (
                <div key={field.id} className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg'>
                  <FormSelect
                    label='Evaluator'
                    name={`evaluators.${index}.evaluator`}
                    required
                    options={userOptions}
                    placeholder="Select person"
                  >
                    <SelectContent></SelectContent>
                  </FormSelect>

                  <FormSelect
                    label='Evaluator Type'
                    name={`evaluators.${index}.evaluator_type`}
                    required
                    options={evaluatorTypeOptions}
                    placeholder="Select type"
                  >
                    <SelectContent></SelectContent>
                  </FormSelect>

                  <div className='col-span-full flex justify-end'>
                    <FormButton
                      type='button'
                      className='text-red-500 bg-transparent'
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <MinusCircle />
                      Remove Evaluator
                    </FormButton>
                  </div>
                </div>
              ))}

              <FormButton
                type='button'
                className='text-primary bg-alternate flex items-center gap-2'
                onClick={() => append({ evaluator: "", evaluator_type: "peer" })}
              >
                <PlusCircle size={16} />
                Add Evaluator
              </FormButton>
            </div>

            <div className='flex justify-end gap-2'>
              <FormButton
                type='button'
                className='flex items-center justify-center gap-2 text-primary bg-alternate'
                onClick={() => router.push(HrRoutes.PERFORMANCE_MANAGEMENT)}
                disabled={isCreating}
              >
                Cancel
              </FormButton>
              <FormButton
                type='submit'
                className='flex items-center justify-center gap-2'
                disabled={isCreating || goals.length === 0}
              >
                {isCreating ? "Creating..." : "Create Assessment"}
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewPerformance;
