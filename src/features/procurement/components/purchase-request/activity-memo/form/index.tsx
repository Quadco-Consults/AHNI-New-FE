"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import FormTextArea from "components/atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";

// import { Button } from "components/ui/button";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";

import { Separator } from "components/ui/separator";
import { RouteEnum } from "constants/RouterConstants";

import { SampleMemoSchema } from "@/features/procurement/types/procurement-validator";

// import { MinusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
// import { useGetAllConsumables } from "@/features/admin/controllers/inventory-management/consumableController";
import {
  useGetAllUsers,
  useGetUserProfile,
} from "@/features/auth/controllers/userController";
import { useGetAllBudgetLines } from "@/features/modules/controllers/finance/budgetLineController";
import { useGetAllCostCategories } from "@/features/modules/controllers/finance/costCategoryController";
import { useGetAllCostInputs } from "@/features/modules/controllers/finance/costInputController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetAllInterventionAreas } from "@/features/modules/controllers/program/interventionAreaController";

import { useGetAllFundingSources } from "@/features/modules/controllers/project/fundingSourceController";

import { activityActions } from "store/formData/activity-memo";
import { z } from "zod";
import ExpensesForm from "./ExpensesForm";
import { useGetAllActivityPlans } from "@/features/programs/controllers/activityPlanController";
import { useEffect } from "react";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";

const CreateActivityMemo = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: fundingSource } = useGetAllFundingSources({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: activites } = useGetAllActivityPlans({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: costInput } = useGetAllCostInputs({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: costCategories } = useGetAllCostCategories({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: budgetLines } = useGetAllBudgetLines({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: fco } = useGetAllFCONumbers({
    page: 1,
    size: 2000000,
    search: "",
  });

  const { data: interventions } = useGetAllInterventionAreas({
    page: 1,
    size: 20000,
    search: "",
  });

  const { data: profile } = useGetUserProfile();

  const usersOptions = users?.data.results.map(
    ({ first_name, last_name, id }) => ({
      name: `${first_name} ${last_name}`,
      id,
    })
  );

  const usersOptionsFn = users?.data.results.map(
    ({ first_name, last_name, id }) => ({
      label: `${first_name} ${last_name}`,
      value: id,
    })
  );

  const activitiesOptions = activites?.data.results.map(
    ({ activity_code, activity_description, id }) => ({
      label: `Activity code: ${activity_code},  Activity description: ${activity_description}`,
      value: id,
    })
  );

  const interventionsOptions = interventions?.data.results.map(
    ({ code, id }) => ({
      id,
      name: code,
    })
  );

  const form = useForm<z.infer<typeof SampleMemoSchema>>({
    resolver: zodResolver(SampleMemoSchema),
    defaultValues: {
      activity: "",
      subject: "",
      requested_date: "",
      fconumber: [],
      intervention_areas: [],
      budget_line: [],
      cost_categories: [],
      cost_input: [],
      funding_source: [],
      comment: "",
      copy: [],
      approved_by: "",
      // reviewed_by: "",
      created_by: "",
      // authorized_by: "",
      through: [],
      expenses: [],
      // created_by: profile?.data.id,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  useEffect(() => {
    if (profile) {
      form.reset({
        created_by: profile?.data.id,
        // @ts-ignore
        approved_date: "11/11/11",
      });

      // maintenance_type
    }
  }, [profile]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  const onSubmit = async (data: z.infer<typeof SampleMemoSchema>) => {
    const selectedActivity = activites?.data?.results.find(
      (activity) => activity.id === data?.activity
    );
    const selectedCostCategory = costCategories?.data?.data?.results.find(
      (costCategory) => costCategory.id === data?.cost_categories[0]
    );

    dispatch(
      activityActions.addActivity({
        ...data,
        selectedActivity: selectedActivity,
        selectedCostCategory: selectedCostCategory,
      })
    );

    router.push(RouteEnum.SAMPLE_PREVIEW);
  };

  return (
    <div className='pt-5'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <div className='grid grid-cols-2 gap-5'>
            <div>
              <Label className='font-semibold'>Through</Label>
              <FormField
                control={form.control}
                name='through'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={usersOptions || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Please Select'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.copy && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.copy.message}
                </span>
              )}
            </div>{" "}
            <div>
              <Label className='font-semibold'>CC</Label>
              <FormField
                control={form.control}
                name='copy'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={usersOptions || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Please Select'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.copy && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.copy.message}
                </span>
              )}
            </div>{" "}
          </div>

          <div className='grid grid-cols-2 gap-5'>
            {usersOptionsFn && (
              <FormSelect
                label='To'
                name='approved_by'
                required
                options={usersOptionsFn}
              />
            )}
          </div>
          <div className='grid gap-5'>
            {activitiesOptions && (
              <FormSelect
                label='Activity'
                name='activity'
                required
                options={activitiesOptions}
              />
            )}
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <FormInput
              label='Requested Date'
              name='requested_date'
              type='date'
              placeholder='01/01/2024'
            />
            <div>
              <Label className='font-semibold'>FCO</Label>
              <FormField
                control={form.control}
                name='fconumber'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={fco?.data?.data?.results || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select fcos'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.fconumber && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.fconumber.message}
                </span>
              )}
            </div>{" "}
          </div>
          <div className='grid gap-5'>
            <div>
              <Label className='font-semibold'>Intervention Areas</Label>
              <FormField
                control={form.control}
                name='intervention_areas'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={interventionsOptions || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select Intervention Areas'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.fconumber && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.fconumber.message}
                </span>
              )}
            </div>{" "}
          </div>
          <div className='grid gap-5'>
            <div>
              <Label className='font-semibold'>Budget Line</Label>
              <FormField
                control={form.control}
                name='budget_line'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={budgetLines?.data?.data?.results || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select Budget Lines'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.budget_line && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.budget_line.message}
                </span>
              )}
            </div>{" "}
            <div>
              <Label className='font-semibold'>Cost Categories</Label>
              <FormField
                control={form.control}
                name='cost_categories'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={costCategories?.data?.data?.results || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select Cost Categories'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.cost_categories && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.cost_categories.message}
                </span>
              )}
            </div>{" "}
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <div>
              <Label className='font-semibold'>Cost Input</Label>
              <FormField
                control={form.control}
                name='cost_input'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={costInput?.data?.data?.results || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select Cost Inputs'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.cost_input && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.cost_input.message}
                </span>
              )}
            </div>{" "}
            <div>
              <Label className='font-semibold'>Funding Sources</Label>
              <FormField
                control={form.control}
                name='funding_source'
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

              {errors.funding_source && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.funding_source.message}
                </span>
              )}
            </div>
          </div>

          <div className='grid gap-5'>
            <FormInput label='Subject' name='subject' type='text' />
          </div>
          <div className='grid gap-5'>
            <FormTextArea label='Memo content' name='comment' type='text' />
          </div>
          <Separator className='my-4' />
          <span className='block space-y-2'>
            <h3 className='font-semibold text-xl text-black'>Expenses</h3>
          </span>
          <ExpensesForm
            fields={fields}
            remove={remove}
            watch={watch}
            setValue={setValue}
          />
          {/*  */}
          <div className='flex justify-between items-center'>
            <Button
              onClick={() =>
                dispatch(
                  openDialog({
                    type: DialogType.AddItems,
                    dialogProps: {
                      header: "Add Item",
                    },
                  })
                )
              }
              variant='outline'
              className='gap-x-2 shadow-[0px_3px_8px_rgba(0,0,0,0.07)] bg-[#FFFFFF] text-[#DEA004] border-[1px] border-[#C7CBD5]'
              size='sm'
            >
              Click to add New
            </Button>
            <div className='flex items-center justify-end gap-3'>
              <FormButton
                type='button'
                className='flex items-center justify-center gap-2'
                onClick={() =>
                  append({
                    item: "",
                    quantity: "",
                    num_of_days: "",
                    unit_cost: "",
                    total_cost: 0,
                  })
                }
              >
                <AddSquareIcon />
                Add new expenses item row
              </FormButton>

              {/*  */}
              {/* <Link className='w-fit' href={generatePath(RouteEnum.SAMPLE_PREVIEW)}> */}
              <FormButton
                // loading={isLoading}
                // disabled={isLoading}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                <LongArrowRight />
                Next
              </FormButton>
              {/* </Link> */}
            </div>
          </div>
          <FormButton
            // loading={isLoading}
            // disabled={isLoading}
            type='submit'
            className='flex items-center justify-center gap-2'
          >
            <LongArrowRight />
            Save
          </FormButton>
        </form>
      </Form>
    </div>
  );
};

export default CreateActivityMemo;
