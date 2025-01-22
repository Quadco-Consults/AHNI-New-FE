import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";
import { LoadingSpinner } from "components/shared/Loading";

import { Button } from "components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Separator } from "components/ui/separator";

import { SampleMemoSchema } from "definations/procurement-validator";
import { useAppSelector } from "hooks/useStore";
import { MinusCircle } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGetAllConsumablesQuery } from "services/admin/inventory-management/consumable";
import { useGetUserProfileQuery } from "services/auth/user";
import { useGetAllBudgetLinesQuery } from "services/modules/finance/budget-line";
import { useGetAllCostGroupingsQuery } from "services/modules/finance/cost-grouping";
import { useGetAllCostInputsQuery } from "services/modules/finance/cost-input";
import { useGetAllFCONumbersQuery } from "services/modules/finance/fco-number";
import { useGetAllBeneficiaryQuery } from "services/modules/project/beneficiaries";

import { useUseGetAllFundingSourceQuery } from "services/modules/project/funding-source";
import PurchaseRequestSampleAPI from "services/procurementApi/purchase-sample-request ";
import { toast } from "sonner";
import { z } from "zod";

const CreateActivityMemo = () => {
  const { data: fundingSource } = useUseGetAllFundingSourceQuery({
    page: 1,
    size: 2000000,
  });

  const { data: beneficiary, isLoading: isBeneficiaryLoading } =
    useGetAllBeneficiaryQuery({
      page: 1,
      size: 2000000,
    });

  const costInput = useGetAllCostInputsQuery({
    page: 1,
    size: 2000000,
  });

  const costGrouping = useGetAllCostGroupingsQuery({
    page: 1,
    size: 2000000,
  });

  const budgetLines = useGetAllBudgetLinesQuery({
    page: 1,
    size: 2000000,
  });

  const fco = useGetAllFCONumbersQuery({
    page: 1,
    size: 2000000,
  });

  // const consumables = useGetAllConsumablesQuery({
  //   page: 1,
  //   size: 2000000,
  // });
  const { data: profile } = useGetUserProfileQuery(null);

  const { user } = useAppSelector((state) => state.auth);

  const beneficiaryOptions = beneficiary?.data.results.map(({ name, id }) => ({
    label: name,
    value: id,
  }));
  console.log({
    beneficiaryOptions,
    profile: profile?.data.id,
    profileD: profile,
  });

  const [createPurchaseRequestMutation, { isLoading }] =
    PurchaseRequestSampleAPI.useCreatePurchaseRequestMutation();

  const form = useForm<z.infer<typeof SampleMemoSchema>>({
    resolver: zodResolver(SampleMemoSchema),
    defaultValues: {
      activity: "",
      location: "",
      requested_date: "",
      fconumber: [],
      module: "",
      intervention: "",
      budget_line: [],
      cost_grouping: [],
      cost_input: [],
      funding_source: [],
      comment: "",
      approved_by: "",
      reviewed_by: "",
      created_by: "333",
      // reviewed_date: "",
      // approved_date: "",
      // program_areas: [],
      expenses: [],
      // created_by: profile?.data.id,
    },
  });

  // const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    // watch,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (profile) {
      form.reset({
        created_by: profile?.data.id,
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
    console.log({ data });
    try {
      await createPurchaseRequestMutation(data).unwrap();
      // navigate(RouteEnum.PURCHASE_REQUEST);
      toast.success("Successfully created.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  const lon = form.getValues();
  console.log({ lon });

  return (
    <div className='pt-5'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <div className='grid gap-5'>
            <FormInput label='Activity' name='activity' type='text' required />
            <FormInput label='Location' name='location' type='text' required />
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
          <div className='grid grid-cols-2 gap-5'>
            <FormInput label='Module' name='module' required type='text' />{" "}
            <FormInput
              label='Intervention'
              name='intervention'
              required
              type='text'
            />{" "}
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
              <Label className='font-semibold'>Cost Grouping</Label>
              <FormField
                control={form.control}
                name='cost_grouping'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={costGrouping?.data?.data?.results || []}
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select Cost Groupings'
                        variant='inverted'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {errors.cost_grouping && (
                <span className='text-sm text-red-500 font-medium'>
                  {errors.cost_grouping.message}
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
          <div className='grid  gap-5'>
            {beneficiaryOptions && (
              <FormSelect
                label='To (approved_by)'
                name='approved_by'
                required
                options={beneficiaryOptions}
              />
            )}

            {beneficiaryOptions && (
              <FormSelect
                label='Through (reviewed_by)'
                name='reviewed_by'
                required
                options={beneficiaryOptions}
              />
            )}
          </div>
          <div className='grid gap-5'>
            <FormTextArea label='Comment' name='comment' type='text' />
          </div>
          <Separator className='my-4' />
          <span className='block space-y-2'>
            <h3 className='font-semibold text-xl text-black'>Expenses</h3>
          </span>

          <div>
            {fields.map((field, index) => (
              <>
                <div key={field.id} className='grid grid-cols-2 gap-5 mt-5'>
                  <FormInput
                    label='Expenses item'
                    name={`expenses.${index}.expenses_item`}
                    type='text'
                    required
                  />
                  <FormInput
                    label='Quantity'
                    name={`expenses.${index}.quantity`}
                    type='text'
                    required
                  />
                  <FormInput
                    label='# of Days'
                    name={`expenses.${index}.days`}
                    type='text'
                  />
                  <FormInput
                    label='# of Facility'
                    name={`expenses.${index}.facility`}
                    type='text'
                  />
                  <FormInput
                    label='# Frequency'
                    name={`expenses.${index}.frequency`}
                    type='text'
                  />
                  <FormInput
                    label='Unit Cost'
                    name={`expenses.${index}.unit_cost`}
                    type='text'
                  />
                </div>
                <div className='mt-5 flex-col flex gap-5'>
                  <FormInput
                    label='Total Cost'
                    name={`expenses.${index}.total_cost`}
                    type='text'
                    className='col-span-2'
                  />
                  <Button
                    type='button'
                    className='w-fit'
                    onClick={() => remove(index)}
                  >
                    <MinusCircle className='mr-2' />
                    Remove
                  </Button>
                </div>
              </>
            ))}
          </div>
          {/*  */}
          <div className='flex items-center justify-end gap-3'>
            <FormButton
              type='button'
              className='flex items-center justify-center gap-2'
              onClick={() =>
                append({
                  expenses_item: "",
                  quantity: "",
                  days: "",
                  facility: "",
                  frequency: "",
                  unit_cost: "",
                  total_cost: "",
                })
              }
            >
              <AddSquareIcon className='mr-2' />
              Add new expenses item row
            </FormButton>

            {/*  */}
            {/* <Link className='w-fit' to={generatePath(RouteEnum.SAMPLE_PREVIEW)}> */}
            <FormButton
              loading={isLoading}
              disabled={isLoading}
              type='submit'
              className='flex items-center justify-center gap-2'
            >
              <LongArrowRight />
              Next
            </FormButton>
            {/* </Link> */}
          </div>
          <FormButton
            loading={isLoading}
            disabled={isLoading}
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
