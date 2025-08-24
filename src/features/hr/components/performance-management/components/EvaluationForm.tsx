"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Separator } from "components/ui/separator";
import { Textarea } from "components/ui/textarea";
import Card from "components/Card";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useRouter } from "next/navigation";
import { HrRoutes } from "constants/RouterConstants";

const performanceCategories = [
  {
    category: "Performance Indicators (Weight: 100.0)",
    competencies: [
      {
        id: 1,
        competency: "Job Knowledge",
        weight: "",
        rating: "",
        comments: "",
      },
      {
        id: 2,
        competency: "Interpersonal Skills/Teamwork",
        weight: "",
        rating: "",
        comments: "",
      },
      {
        id: 3,
        competency: "Accountability",
        weight: "",
        rating: "",
        comments: "",
      },
      { id: 4, competency: "Leadership", weight: "", rating: "", comments: "" },
    ],
  },
  {
    category:
      "Key Results and Critical Activities for Remainder of Year (Weight: 0.0)",
    goals: [{ id: 5, goal: "Probation", weight: "", rating: "", comments: "" }],
  },
  {
    category: "Introductory Period Result (Weight: 0.0)",
    competencies: [
      {
        id: 6,
        competency: "Job Knowledge",
        weight: "",
        rating: "",
        comments: "",
      },
      {
        id: 7,
        competency: "Interpersonal Skills/Teamwork",
        weight: "",
        rating: "",
        comments: "",
      },
      {
        id: 8,
        competency: "Accountability",
        weight: "",
        rating: "",
        comments: "",
      },
      { id: 9, competency: "Leadership", weight: "", rating: "", comments: "" },
    ],
  },
];

const PerformanceEvaluationForm = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const dispatch = useAppDispatch();

  const onSubmit = (data: any) => {
    console.log({ data });
    dispatch(
      openDialog({
        type: DialogType.HrSuccessModal,
        dialogProps: {
          label:
            "You have submitted the Performance Assessment, It will now be reviewed and approved accordingly",
        },
      })
    );
    router.push(HrRoutes.PERFORMANCE_MANAGEMENT);
  };

  const renderFields = (categoryData: any) => {
    const isGoalsTable =
      categoryData.category ===
      "Key Results and Critical Activities for Remainder of Year (Weight: 0.0)";

    const isIntroductoryPeriod =
      categoryData.category === "Introductory Period Result (Weight: 0.0)";

    return (
      <div key={categoryData.category} className='mb-8'>
        <h2 className='text-lg font-semibold mb-4 text-yellow-darker'>
          {categoryData.category}
        </h2>
        <div className='flex flex-col gap-4'>
          {/* Handling Goals Data */}
          {isGoalsTable
            ? categoryData.goals.map((goal: any) => (
                <Card key={goal.id} className='flex flex-col gap-4'>
                  {/* Goal Input Fields */}
                  <div className='flex gap-4 text-sm font-semibold text-gray-600'>
                    <div className='flex-1'>Goal</div>
                    <div className='flex-1'>Weight</div>
                    <div className='flex-1'>Rating</div>
                  </div>
                  <Separator />
                  <div className='flex gap-4'>
                    <div className='flex-1'>
                      <Controller
                        name={`goals.${goal.id}.goal`}
                        control={control}
                        defaultValue={goal.goal}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className='w-full'
                            placeholder='Enter goal'
                          />
                        )}
                      />
                    </div>
                    <div className='flex-1'>
                      <Controller
                        name={`goals.${goal.id}.weight`}
                        control={control}
                        defaultValue={goal.weight}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className='w-full'
                            placeholder='Enter weight'
                          />
                        )}
                      />
                    </div>
                    <div className='flex-1'>
                      <Controller
                        name={`goals.${goal.id}.rating`}
                        control={control}
                        defaultValue={goal.rating}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className='w-full'
                            placeholder='Enter rating'
                          />
                        )}
                      />
                    </div>
                  </div>
                  {/* Comment Section */}
                  <div>
                    <label
                      htmlFor={`comments-goal-${goal.id}`}
                      className='text-sm'
                    >
                      Comment
                    </label>
                    <Controller
                      name={`goals.${goal.id}.comments`}
                      control={control}
                      defaultValue=''
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id={`comments-goal-${goal.id}`}
                          placeholder='Add comments'
                        />
                      )}
                    />
                  </div>
                </Card>
              ))
            : isIntroductoryPeriod
            ? // Handling Introductory Period Competencies
              categoryData.competencies.map((competency: any) => (
                <Card key={competency.id} className='flex flex-col gap-4'>
                  {/* Competency Input Fields */}
                  <div className='flex gap-4 text-sm font-semibold text-gray-600'>
                    <div className='flex-1'>Evaluation Category</div>

                    <div className='flex-1'>Competency</div>
                    <div className='flex-1'>Weight</div>
                    <div className='flex-1'>Rating</div>
                  </div>
                  <Separator />
                  <div className='flex gap-4'>
                    <div className='flex-1'>Performance Indicator</div>
                    <div className='flex-1'>{competency.competency}</div>
                    <div className='flex-1'>
                      <Controller
                        name={`introductory.${competency.id}.weight`}
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <Input
                            {...field}
                            className='w-full'
                            placeholder='Enter weight'
                          />
                        )}
                      />
                    </div>
                    <div className='flex-1'>
                      <Controller
                        name={`introductory.${competency.id}.rating`}
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <Input
                            {...field}
                            className='w-full'
                            placeholder='Enter rating'
                          />
                        )}
                      />
                    </div>
                  </div>
                  {/* Comment Section */}
                  <div>
                    <label
                      htmlFor={`comments-${competency.id}`}
                      className='text-sm'
                    >
                      Comment
                    </label>
                    <Controller
                      name={`introductory.${competency.id}.comments`}
                      control={control}
                      defaultValue=''
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id={`comments-${competency.id}`}
                          placeholder='Add comments'
                        />
                      )}
                    />
                  </div>
                </Card>
              ))
            : // Handling other categories (e.g., Performance Indicators)
              categoryData.competencies.map((competency: any) => (
                <Card key={competency.id} className='flex flex-col gap-4'>
                  {/* Competency Input Fields */}
                  <div className='flex gap-4 text-sm font-semibold text-gray-600'>
                    <div className='flex-1'>Evaluation Category</div>
                    <div className='flex-1'>Competency</div>
                    <div className='flex-1'>Weight</div>
                    <div className='flex-1'>Rating</div>
                  </div>
                  <Separator />
                  <div className='flex gap-4'>
                    <div className='flex-1'>Performance Indicator</div>

                    <div className='flex-1'>{competency.competency}</div>
                    <div className='flex-1'>
                      <Controller
                        name={`performance.${competency.id}.weight`}
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <Input
                            {...field}
                            className='w-full'
                            placeholder='Enter weight'
                          />
                        )}
                      />
                    </div>
                    <div className='flex-1'>
                      <Controller
                        name={`performance.${competency.id}.rating`}
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <Input
                            {...field}
                            className='w-full'
                            placeholder='Enter rating'
                          />
                        )}
                      />
                    </div>
                  </div>
                  {/* Comment Section */}
                  <div>
                    <label
                      htmlFor={`comments-${competency.id}`}
                      className='text-sm'
                    >
                      Comment
                    </label>
                    <Controller
                      name={`performance.${competency.id}.comments`}
                      control={control}
                      defaultValue=''
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          id={`comments-${competency.id}`}
                          placeholder='Add comments'
                        />
                      )}
                    />
                  </div>
                </Card>
              ))}
        </div>
      </div>
    );
  };

  return (
    <div className='form-container px-4 py-6'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {performanceCategories.map((category) => renderFields(category))}

        <Separator className='my-8' />

        <Button
          type='submit'
          className='w-full'
          aria-label='Submit Evaluation Form'
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PerformanceEvaluationForm;
