"use client";

import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";

import GoBack from "components/GoBack";

import { Form } from "components/ui/form";
import { SelectContent } from "components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";

import { HrRoutes } from "constants/RouterConstants";

import { MinusCircle, Star } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetEmployeeOnboardings } from "@/features/hr/controllers/employeeOnboardingController";
import { useCreatePerformanceAssesment } from "@/features/hr/controllers/hrPerformanceAssessmentController";
import { goalsStorage, StoredGoal } from "@/features/hr/utils/goalsStorage";
import { toast } from "sonner";

// import ItemsAPI from "@/features/modules/controllers/config/itemsController";

// import PurchaseRequestAPI from "@/features/procurementApi/purchase-requestController";
// import { toast } from "sonner";
// import { z } from "zod";

const NewPerformance = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [employeeGoals, setEmployeeGoals] = useState<StoredGoal[]>([]);
  const [goalRatings, setGoalRatings] = useState<Record<string, number>>({});

  const form = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {},
  });

  const { control, handleSubmit, watch } = form;
  const watchedEmployee = watch("employee");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "evaluators", // The name of the array in the form data
  });
  const router = useRouter();

  const cycleOptions = useMemo(
    () =>
      ["365 Appraisal Cycle", "Probationary Cycle"].map((title) => ({
        label: title,
        value: title,
      })),
    []
  );

  const { data: user } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: employees, isLoading: isLoadingEmployees } = useGetEmployeeOnboardings({
    page: 1,
    size: 2000000,
  });

  const { createPerformanceAssesment } = useCreatePerformanceAssesment();

  const userOptions = useMemo(
    () =>
      user?.data.results.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [user]
  );

  const employeeOptions = useMemo(
    () => {
      if (!employees?.data?.results) {
        console.log("No employee data available:", employees);
        return [];
      }
      return employees.data.results.map(
        ({ legal_firstname, legal_lastname, id }) => ({
          label: `${legal_firstname} ${legal_lastname}`,
          value: id,
        })
      );
    },
    [employees]
  );

  console.log({ employees, user, employeeOptions });

  // Load employee goals when employee is selected
  useEffect(() => {
    if (watchedEmployee && watchedEmployee !== selectedEmployee) {
      setSelectedEmployee(watchedEmployee);
      const goals = goalsStorage.getEmployeeGoals(watchedEmployee);
      setEmployeeGoals(goals);
      setGoalRatings({}); // Reset ratings when employee changes
      console.log("Loading goals for employee:", watchedEmployee, "Goals found:", goals);
    }
  }, [watchedEmployee, selectedEmployee]);

  // Handle individual goal rating
  const handleGoalRating = (goalId: string, rating: number) => {
    setGoalRatings(prev => ({
      ...prev,
      [goalId]: rating
    }));
  };

  // Calculate overall weighted rating
  const calculateOverallRating = () => {
    if (employeeGoals.length === 0) return 0;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    employeeGoals.forEach(goal => {
      const rating = goalRatings[goal.id] || 0;
      const weight = parseFloat(goal.weight) || 0;
      totalWeightedScore += rating * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : 0;
  };

  const overallRating = calculateOverallRating();

  const onSubmit = async (data: any) => {
    console.log({ data });

    // Validate that all goals have been rated if there are goals
    if (employeeGoals.length > 0) {
      const unratedGoals = employeeGoals.filter(goal => !goalRatings[goal.id]);
      if (unratedGoals.length > 0) {
        toast.error("Please rate all employee goals before submitting the assessment");
        return;
      }
    }

    // Prepare performance data with goal ratings
    const performanceData = {
      ...data,
      goal_ratings: goalRatings,
      overall_rating: overallRating,
      goals_evaluated: employeeGoals.map(goal => ({
        goal_id: goal.id,
        goal_text: goal.goal,
        competency: goal.competency,
        weight: goal.weight,
        rating: goalRatings[goal.id] || 0
      })),
      has_goals: employeeGoals.length > 0
    };

    console.log("Submitting performance assessment with goals:", performanceData);

    try {
      await createPerformanceAssesment(performanceData);
      toast.success("Performance assessment created successfully");
      router.push(HrRoutes.PERFORMANCE_MANAGEMENT);
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className=''>
      <GoBack />

      <div className='pt-10'>
        <h3 className='text-[18px] pb-10'>
          Initiate New Performance Asessment
        </h3>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className=''>
              <h3 className='text-yellow-darker'>Appraisal Information</h3>
            </div>

            <div className='grid gap-5 grid-cols-2'>
              <FormInput
                label='Description'
                name='description'
                type='text'
                required
              />

              <FormSelect
                label='Cycle Name'
                name='cycle_name'
                placeholder='Select Cycle'
                required
                options={cycleOptions}
              />
            </div>
            <div className=''>
              <h3 className='text-yellow-darker'>Employee Information</h3>
            </div>

            <div className='grid gap-5'>
              <FormSelect
                label='Select Employee'
                name='employee'
                required
                placeholder={isLoadingEmployees ? "Loading employees..." : "Select Employee"}
                options={employeeOptions}
              />
            </div>
            <div className=''>
              <h3 className='text-yellow-darker'>Evaluators</h3>
            </div>

            <div className='grid gap-5'>
              {fields.map((field, index) => (
                <div key={field.id} className='flex gap-4 items-center'>
                  {/* AHNI STAFF for evaluators */}
                  <FormSelect
                    label={`Select Evaluator ${index + 1}`}
                    name={`evaluators.${index}.evaluator`}
                    required
                    options={userOptions}
                  >
                    <SelectContent></SelectContent>
                  </FormSelect>
                  <FormButton
                    type='button'
                    className='text-red-500 bg-transparent'
                    onClick={() => remove(index)}
                  >
                    <MinusCircle />
                  </FormButton>
                </div>
              ))}{" "}
              <FormButton
                type='button'
                className='text-primary bg-alternate'
                onClick={
                  () => append({ evaluator: "" }) // Add a new empty evaluator
                }
              >
                Add Evaluator
              </FormButton>
            </div>

            {/* Goals Section - Only show if employee is selected and has goals */}
            {selectedEmployee && employeeGoals.length > 0 && (
              <>
                <div className='mt-8'>
                  <h3 className='text-yellow-darker'>Employee Goals Assessment</h3>
                  <p className='text-sm text-gray-600 mt-1'>
                    Rate each goal on a scale of 1-5 based on the employee's performance
                  </p>
                </div>

                <div className='space-y-4'>
                  {employeeGoals.map((goal, index) => (
                    <Card key={goal.id} className='p-4'>
                      <CardHeader className='pb-2'>
                        <div className='flex justify-between items-start'>
                          <CardTitle className='text-lg font-medium'>
                            Goal {index + 1}: {goal.goal}
                          </CardTitle>
                          <div className='flex gap-2'>
                            <Badge variant='secondary'>
                              {goal.competency}
                            </Badge>
                            <Badge variant='outline'>
                              Weight: {goal.weight}%
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className='pt-2'>
                        <div className='space-y-3'>
                          <div>
                            <p className='text-sm text-gray-700 mb-3'>
                              Rate this goal (1 = Poor, 2 = Below Average, 3 = Average, 4 = Good, 5 = Excellent):
                            </p>

                            <div className='flex gap-2'>
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Button
                                  key={rating}
                                  type='button'
                                  variant={goalRatings[goal.id] === rating ? 'default' : 'outline'}
                                  size='sm'
                                  className={`flex items-center gap-1 ${
                                    goalRatings[goal.id] === rating
                                      ? 'bg-blue-600 text-white'
                                      : 'hover:bg-blue-50'
                                  }`}
                                  onClick={() => handleGoalRating(goal.id, rating)}
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      goalRatings[goal.id] === rating
                                        ? 'fill-white'
                                        : 'fill-transparent'
                                    }`}
                                  />
                                  {rating}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {goalRatings[goal.id] && (
                            <div className='bg-green-50 p-2 rounded text-sm'>
                              <span className='text-green-800 font-medium'>
                                Current Rating: {goalRatings[goal.id]}/5
                              </span>
                              <span className='text-green-700 ml-2'>
                                (Weighted Score: {((goalRatings[goal.id] * parseFloat(goal.weight)) / 100).toFixed(1)})
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Overall Rating Summary */}
                  {Object.keys(goalRatings).length > 0 && (
                    <Card className='bg-blue-50 border-blue-200'>
                      <CardHeader>
                        <CardTitle className='text-blue-900'>Overall Assessment Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <p className='text-sm text-blue-700'>Goals Rated:</p>
                            <p className='text-lg font-semibold text-blue-900'>
                              {Object.keys(goalRatings).length} / {employeeGoals.length}
                            </p>
                          </div>
                          <div>
                            <p className='text-sm text-blue-700'>Weighted Overall Rating:</p>
                            <p className='text-lg font-semibold text-blue-900'>
                              {overallRating}/5.00
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            )}

            {/* No Goals Message */}
            {selectedEmployee && employeeGoals.length === 0 && (
              <Card className='bg-yellow-50 border-yellow-200'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-2'>
                    <div className='text-yellow-600'>⚠️</div>
                    <div>
                      <p className='text-yellow-800 font-medium'>No Goals Found</p>
                      <p className='text-yellow-700 text-sm'>
                        This employee doesn't have any goals created yet.
                        You can still proceed with the performance assessment,
                        but consider creating goals for this employee first.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className='flex justify-end gap-2'>
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='button'
                className='flex items-center justify-center gap-2 text-primary bg-alternate'
                onClick={() => router.push(HrRoutes.PERFORMANCE_MANAGEMENT)}
              >
                Cancel
              </FormButton>
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                Create
              </FormButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewPerformance;
