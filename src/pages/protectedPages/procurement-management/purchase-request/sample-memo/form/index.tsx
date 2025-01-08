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
import { PurchaseRequestSchema } from "definations/procurement-validator";
import { MinusCircle } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { generatePath, Link, useNavigate } from "react-router-dom";
import DepartmentsAPI from "services/configs/departments";
import ItemsAPI from "services/configs/items";
import { useGetAllPartnersQuery } from "services/modules/project/partners";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import { toast } from "sonner";
import { z } from "zod";

const CreatePurchaseRequestForm = () => {
  const { data: departments, isLoading: departmentsIsLoading } =
    DepartmentsAPI.useGetDepartmentsQuery({});
  const { data: partner, isLoading: partnersIsLoading } =
    useGetAllPartnersQuery({ page: 1, size: 2000000 });
  const { data: items, isLoading: itemsIsLoading } = ItemsAPI.useGetItemsQuery(
    {}
  );
  const [createPurchaseRequestMutation, { isLoading }] =
    PurchaseRequestAPI.useCreatePurchaseRequestMutation();

  const form = useForm<z.infer<typeof PurchaseRequestSchema>>({
    resolver: zodResolver(PurchaseRequestSchema),
    defaultValues: {
      items: [
        {
          item_id: "",
          category: "",
          fco: "",
          units: 0,
          number_of_days: 0,
          unit_cost: 0,
        },
      ],
      request_date: "",
      required_date: "",
      requesting_department: "",
      deliver_to: "",
    },
  });

  const navigate = useNavigate();

  const { control, handleSubmit, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: z.infer<typeof PurchaseRequestSchema>) => {
    try {
      await createPurchaseRequestMutation(data).unwrap();
      navigate(RouteEnum.PURCHASE_REQUEST);
      toast.success("Successfully created.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

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
            <FormInput label='FCO' name='fco' type='text' />
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <FormInput
              label='Module'
              name='module'
              type='text'
              placeholder='Program Management'
            />
            <FormInput
              label='Inventory'
              name='inventory'
              type='text'
              placeholder='Grant Management'
            />
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
            <FormInput
              label='Cost Input'
              name='cost_input'
              type='text'
              placeholder='Program Management'
            />
            <FormInput
              label='Funding Source'
              name='funding_source'
              type='text'
              placeholder='Global Fund'
            />
          </div>
          <div className='grid gap-5'>
            <FormInput label='Comment' name='comment' type='text' />
          </div>
          <Separator className='my-4' />
          <span className='block space-y-2'>
            <h3 className='font-semibold text-xl text-black'>Expenses</h3>
          </span>
          <div className='grid grid-cols-2 gap-5'>
            <FormInput label='Expenses item' name='expenses_item' type='text' />
            <FormInput label='Quantity' name='quantity' type='text' />
          </div>{" "}
          <div className='grid grid-cols-2 gap-5'>
            <FormInput
              label='# of Days'
              name='days'
              type='text'
              placeholder=''
            />
            <FormInput
              label='# of Facility'
              name='facility'
              type='text'
              placeholder=''
            />
          </div>{" "}
          <div className='grid grid-cols-2 gap-5'>
            <FormInput
              label='# Frequency'
              name='frequency'
              type='text'
              placeholder=''
            />
            <FormInput
              label='Unit Cost'
              name='unit_cost'
              type='text'
              placeholder=''
            />
          </div>
          <div className='grid gap-5'>
            <FormInput
              label='Total Cost'
              name='total cost'
              type='text'
              placeholder=''
            />
          </div>
          <div className='flex items-center justify-end gap-3'>
            <FormButton
              loading={isLoading}
              disabled={isLoading}
              type='submit'
              className='flex items-center justify-center gap-2'
            >
              Add new expenses item row
            </FormButton>
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

export default CreatePurchaseRequestForm;
