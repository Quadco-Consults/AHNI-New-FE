import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";
import { LoadingSpinner } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import { Separator } from "components/ui/separator";
import { RouteEnum } from "constants/RouterConstants";
import { DepartmentsResultsData } from "definations/configs/departments";
import { ItemsResultsData } from "definations/configs/itmes";
import { SampleMemoSchema } from "definations/procurement-validator";
import { MinusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { generatePath, Link, useNavigate } from "react-router-dom";
import DepartmentsAPI from "services/configs/departments";
import ItemsAPI from "services/configs/items";
import { useGetAllPartnersQuery } from "services/modules/project/partners";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import { toast } from "sonner";
import { z } from "zod";

const CreateActivityMemo = () => {
  const { data: departments, isLoading: departmentsIsLoading } =
    DepartmentsAPI.useGetDepartmentsQuery({});
  const { data: partner, isLoading: partnersIsLoading } =
    useGetAllPartnersQuery({ page: 1, size: 2000000 });
  const { data: items, isLoading: itemsIsLoading } = ItemsAPI.useGetItemsQuery(
    {}
  );
  const [createPurchaseRequestMutation, { isLoading }] =
    PurchaseRequestAPI.useCreatePurchaseRequestMutation();

  const form = useForm<z.infer<typeof SampleMemoSchema>>({
    resolver: zodResolver(SampleMemoSchema),
    defaultValues: {
      activity: "",
      location: "",
      requested_date: "",
      fconumber: [],
      module: [],
      inventory: [],
      budget_line: [],
      cost_grouping: [],
      cost_input: [],
      funding_source: [],
      comment: "",
      // reviewed_date: "",
      // approved_date: "",
      // program_areas: [],
      expenses: [],
    },
  });

  const navigate = useNavigate();

  const { control, handleSubmit, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  const onSubmit = async (data: z.infer<typeof SampleMemoSchema>) => {
    try {
      await createPurchaseRequestMutation(data).unwrap();
      navigate(RouteEnum.PURCHASE_REQUEST);
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
            <FormSelect label='FCO' name='fco' required>
              <SelectContent>
                {departmentsIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  departments?.results?.map(
                    (department: DepartmentsResultsData) => (
                      <SelectItem key={department?.id} value={department?.id}>
                        {department?.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>{" "}
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <FormSelect label='Module' name='module' required>
              <SelectContent>
                {departmentsIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  departments?.results?.map(
                    (department: DepartmentsResultsData) => (
                      <SelectItem key={department?.id} value={department?.id}>
                        {department?.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>
            <FormSelect label='Inventory' name='inventory' required>
              <SelectContent>
                {departmentsIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  departments?.results?.map(
                    (department: DepartmentsResultsData) => (
                      <SelectItem key={department?.id} value={department?.id}>
                        {department?.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>
          </div>
          <div className='grid gap-5'>
            <FormSelect label=' Budget Line' name='budget_line' required>
              <SelectContent>
                {departmentsIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  departments?.results?.map(
                    (department: DepartmentsResultsData) => (
                      <SelectItem key={department?.id} value={department?.id}>
                        {department?.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>
            <FormSelect label='Cost Grouping' name='cost_grouping' required>
              <SelectContent>
                {partnersIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  partner?.data.results?.map((partner) => (
                    <SelectItem key={partner?.id} value={partner?.id}>
                      {partner?.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </FormSelect>
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <FormSelect label='Cost Input' name='cost_input' required>
              <SelectContent>
                {departmentsIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  departments?.results?.map(
                    (department: DepartmentsResultsData) => (
                      <SelectItem key={department?.id} value={department?.id}>
                        {department?.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>{" "}
            <FormSelect label='Funding Source' name='funding_source' required>
              <SelectContent>
                {departmentsIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  departments?.results?.map(
                    (department: DepartmentsResultsData) => (
                      <SelectItem key={department?.id} value={department?.id}>
                        {department?.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>
          </div>
          <div className='grid  grid-cols-2 gap-5'>
            <FormSelect label=' Through' name='through' required>
              <SelectContent>
                {departmentsIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  departments?.results?.map(
                    (department: DepartmentsResultsData) => (
                      <SelectItem key={department?.id} value={department?.id}>
                        {department?.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>
            <FormSelect label='To' name='to' required>
              <SelectContent>
                {partnersIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  partner?.data.results?.map((partner) => (
                    <SelectItem key={partner?.id} value={partner?.id}>
                      {partner?.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </FormSelect>
          </div>
          <div className='grid gap-5'>
            <FormInput label='Comment' name='comment' type='text' />
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
            <Link className='w-fit' to={generatePath(RouteEnum.SAMPLE_PREVIEW)}>
              <FormButton
                loading={isLoading}
                disabled={isLoading}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                <LongArrowRight />
                Next
              </FormButton>
            </Link>
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
