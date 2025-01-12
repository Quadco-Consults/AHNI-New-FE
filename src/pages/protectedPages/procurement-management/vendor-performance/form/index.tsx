// import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
// import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";
import GoBack from "components/shared/GoBack";
import { LoadingSpinner } from "components/shared/Loading";
// import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { SelectContent, SelectItem } from "components/ui/select";
import { Separator } from "components/ui/separator";
import { RouteEnum } from "constants/RouterConstants";
import { DepartmentsResultsData } from "definations/configs/departments";
// import { ItemsResultsData } from "definations/configs/itmes";
// import { SampleMemoSchema } from "definations/procurement-validator";
// import { MinusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DepartmentsAPI from "services/configs/departments";
// import ItemsAPI from "services/configs/items";

// import PurchaseRequestAPI from "services/procurementApi/purchase-request";
// import { toast } from "sonner";
// import { z } from "zod";

const CreateActivityMemo = () => {
  const { data: departments, isLoading: departmentsIsLoading } =
    DepartmentsAPI.useGetDepartmentsQuery({});
  //   const { data: items, isLoading: itemsIsLoading } = ItemsAPI.useGetItemsQuery(
  //     {}
  //   );
  // const [createPurchaseRequestMutation, { isLoading }] =
  //   PurchaseRequestAPI.useCreatePurchaseRequestMutation();

  //   const form = useForm<z.infer<typeof SampleMemoSchema>>({
  //       resolver: zodResolver(SampleMemoSchema),
  const form = useForm<any>({
    // resolver: zodResolver(),
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

  const { handleSubmit } = form;

  //   const { fields, append, remove } = useFieldArray({
  //     control,
  //     name: "expenses",
  //   });

  //   const onSubmit = async (data: z.infer<typeof SampleMemoSchema>) => {
  const onSubmit = async (data: any) => {
    console.log({ data });
    navigate(RouteEnum.VENDOR_PERFORMANCE_EVALUATION_ID);

    // try {
    //   await createPurchaseRequestMutation(data).unwrap();
    //   toast.success("Successfully created.");
    // } catch (error) {
    //   toast.error("Something went wrong");
    //   console.log(error);
    // }
  };
  const lon = form.getValues();

  console.log({ lon });

  return (
    <div className=''>
      <GoBack />

      <div className='pt-20'>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6'
          >
            <div className='grid gap-5'>
              <FormInput
                label='Vendor Name'
                name='vendor_name'
                type='text'
                required
              />
            </div>
            <div className='grid grid-cols-2 gap-5'>
              <FormInput
                label='Vendor Service'
                name='vendor_service'
                type='text'
              />
              <FormInput
                label='Location of Service'
                name='location_of_service'
                type='text'
              />
            </div>

            <div className='grid gap-5'>
              <FormInput
                label='Date'
                name='date'
                type='date'
                placeholder='01/01/2024'
              />
              <FormInput
                label='Reviewed Period'
                name='reviewed_period'
                type='text'
              />
            </div>

            <span className='block space-y-2'>
              <h3 className='font-semibold text-xl text-black'>EVALUATION</h3>
            </span>
            <Separator className='my-4' />
            <div className='grid grid-cols-2 gap-5'>
              <FormSelect
                label='Delivery leadtime'
                name='delivery_leadtime'
                required
              >
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
              <FormSelect
                label='Competitive Pricing'
                name='competitive_pricing'
                required
              >
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

            <div className='grid grid-cols-2 gap-5'>
              <FormSelect
                label='Post-delivery after sales report'
                name='post_delivery_after_sales_report'
                required
              >
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
              <FormSelect
                label='Professionalism'
                name='professionalism'
                required
              >
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
            <div className='grid grid-cols-2 gap-5'>
              <FormSelect
                label='Post-delivery after sales report'
                name='post_delivery_after_sales_report'
                required
              >
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
              <FormSelect
                label='Professionalism'
                name='professionalism'
                required
              >
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
    </div>
  );
};

export default CreateActivityMemo;
