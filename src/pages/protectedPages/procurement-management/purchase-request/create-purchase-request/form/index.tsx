import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";
import { LoadingSpinner } from "components/shared/Loading";
import { Button } from "components/ui/button";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import { SelectContent, SelectItem } from "components/ui/select";
import { RouteEnum } from "constants/RouterConstants";
import { DepartmentsResultsData } from "definations/configs/departments";
import { ItemsResultsData } from "definations/configs/itmes";
import { PurchaseRequestSchema } from "definations/procurement-validator";
import useQuery from "hooks/useQuery";
import { MinusCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery } from "services/auth/user";
import DepartmentsAPI from "services/configs/departments";
import ItemsAPI from "services/configs/items";
import LocationAPi from "services/configs/locationApi";
import { useGetAllPositionsQuery } from "services/modules/config/position";
import { useGetAllFCONumbersQuery } from "services/modules/finance/fco-number";
import { useGetAllPartnersQuery } from "services/modules/project/partners";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import { toast } from "sonner";
import { z } from "zod";

const CreatePurchaseRequestForm = ({ expenses }) => {
  const query = useQuery();
  const request = query.get("request");
  const { data: departments, isLoading: departmentsIsLoading } =
    DepartmentsAPI.useGetDepartmentsQuery({});
  const { isLoading: partnersIsLoading } = useGetAllPartnersQuery({
    page: 1,
    size: 2000000,
  });
  const { data: items, isLoading: itemsIsLoading } = ItemsAPI.useGetItemsQuery(
    {}
  );
  const [createPurchaseRequestMutation, { isLoading }] =
    PurchaseRequestAPI.useCreatePurchaseRequestMutation();

  const fco = useGetAllFCONumbersQuery({
    page: 1,
    size: 2000000,
  });
  const { data: position, isFetching: positionLoading } =
    useGetAllPositionsQuery({
      page: 1,
      size: 20000,
    });

  const { data: users } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  const { data: locations } = LocationAPi.useGetLocationListQuery({
    params: { no_paginate: true },
  });

  console.log({ locations });

  // const form = useForm<z.infer<typeof PurchaseRequestSchema>>({
  const form = useForm({
    // const form = useForm({
    // resolver: zodResolver(PurchaseRequestSchema),
    defaultValues: {
      reviewed_by: "",
      authorised_by: "",
      approved_by: "",
      requested_by: "",
      requesting_department: "",
      deliver_to: "",
      ref_number: "",
      date_of_request: "",
      date_required: "",
      // total cost
      special_instruction: "ewecd",
      // request_id
      // status
      // reviewed_date
      // authorized_date
      // approved_date
      request_memo: request!,
      // location
      role_requested_by: "",
      role_reviewed_by: "",
      role_authorised_by: "",
      role_approved_by: "",
    },
  });

  const navigate = useNavigate();

  const { control, handleSubmit, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const usersOptions = users?.data.results.map(
    ({ first_name, last_name, id }) => ({
      label: `${first_name} ${last_name}`,
      value: id,
    })
  );

  const onSubmit = async (data: z.infer<typeof PurchaseRequestSchema>) => {
    const payload = {
      items: data.items,
      requested_by: data.requested_by,
      reviewed_by: data.reviewed_by,

      authorised_by: data.authorised_by,

      approved_by: data.approved_by,

      ref_number: data.ref_number,
      date_of_request: data.date_of_request,
      date_required: data.date_required,
      special_instruction: data.special_instruction,
      request_id: "string",
      status: "Pending",
      reviewed_date: null,
      authorised_date: null,
      approved_date: null,
      request_memo: data.request_memo,
      requesting_department: data.requesting_department,
      location: data.deliver_to,
      role_requested_by: data.role_requested_by,
      role_reviewed_by: data.role_reviewed_by,
      role_authorised_by: data.role_authorised_by,
      role_approved_by: data.role_approved_by,
    };

    try {
      // @ts-ignore
      await createPurchaseRequestMutation(payload).unwrap();
      navigate(RouteEnum.PURCHASE_REQUEST);
      toast.success("Successfully created.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const expensesData = useMemo(() => {
    //   // @ts-ignore
    return expenses?.map((exp) => ({
      quantity: exp?.quantity,
      unit_cost: exp?.unit_cost,
      amount: exp?.total_cost,
      item: exp?.item,
      fco_number: "",
    }));
  }, [expenses]);

  useEffect(() => {
    if (expensesData) {
      setValue("items", expensesData);
    }
  }, [expensesData, setValue]);

  const lon = form.getValues();
  console.log({ ln: lon });

  return (
    <div className='pt-5'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <div className='grid  gap-5'>
            <FormInput
              label='Ref'
              name='ref_number'
              type='text'
              placeholder=''
            />
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <FormInput
              label='Date of Request'
              name='date_of_request'
              type='date'
              placeholder='01/01/2024'
            />
            <FormInput
              label='Required Date'
              name='date_required'
              type='date'
              placeholder='01/01/2024'
            />
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <FormSelect
              label='Requesting Dept.'
              name='requesting_department'
              required
            >
              <SelectContent>
                {departmentsIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  // @ts-ignore
                  departments?.data?.results?.map(
                    (department: DepartmentsResultsData) => (
                      <SelectItem key={department?.id} value={department?.id}>
                        {department?.name}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </FormSelect>
            <FormSelect label='Deliver to' name='deliver_to' required>
              <SelectContent>
                {partnersIsLoading ? (
                  <LoadingSpinner />
                ) : (
                  locations?.data.results?.map((location) => (
                    <SelectItem key={location?.id} value={location?.id}>
                      {location?.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </FormSelect>
          </div>

          <div>
            <table className='w-full border'>
              <thead>
                <tr className='text-amber-500 whitespace-nowrap border-b-2 text-xs font-semibold'>
                  <th className='px-2 py-5'>S/N</th>
                  <th className='px-2 py-5'>Description of items/services</th>
                  {/* <th className='px-2 py-5'>NO of Persons/Unit</th> */}
                  {/* <th className="px-2 py-5">No of Days</th> */}
                  <th className='px-2 py-5'>FCO</th>
                  <th className='px-2 py-5'>Quantity</th>
                  <th className='px-2 py-5'>Unit Cost</th>
                  <th className='px-2 py-5'>Total</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  return (
                    <tr key={index} className='w-full'>
                      <td className='w-fit p-2 text-center '>
                        <span className='p-2 px-4 text-xs bg-black text-white rounded'>
                          {index + 1}.
                        </span>
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormSelect label='' name={`items.[${index}].item`}>
                          <SelectContent>
                            {itemsIsLoading ? (
                              <LoadingSpinner />
                            ) : (
                              // @ts-ignore
                              items?.data?.results?.map(
                                (item: ItemsResultsData) => (
                                  <SelectItem key={item?.id} value={item?.id}>
                                    {item?.name}
                                  </SelectItem>
                                )
                              )
                            )}
                          </SelectContent>
                        </FormSelect>
                      </td>

                      <td className='w-fit p-2 text-center'>
                        {/* <FormSelect
                          label=''
                          name={`items.[${index}].fco_number`}
                        >
                          <SelectContent>
                            {itemsIsLoading ? (
                              <LoadingSpinner />
                            ) : (
                              // @ts-ignore
                              fco?.data?.data?.results?.map((item) => {
                                return (
                                  <SelectItem key={item?.id} value={item?.id}>
                                    {item?.name}
                                  </SelectItem>
                                );
                              })
                            )}
                          </SelectContent>
                        </FormSelect> */}

                        <FormField
                          control={form.control}
                          name={`items.[${index}].fco_number`}
                          render={({ field }) => (
                            <FormItem className=' mt-2'>
                              <FormControl>
                                <MultiSelectFormField
                                  options={fco?.data?.data?.results || []}
                                  // defaultValue={field.value}
                                  onValueChange={field.onChange}
                                  placeholder='Select fcos'
                                  variant='inverted'
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* {errors.fconumber && (
                            <span className='text-sm text-red-500 font-medium'>
                              {errors.fconumber.message}
                            </span>
                          )} */}
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormInput
                          label=''
                          type='number'
                          name={`items.[${index}].quantity`}
                          className='w-24'
                        />
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormInput
                          label=''
                          type='number'
                          name={`items.[${index}].unit_cost`}
                          className='w-24'
                        />
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormInput label='' name={`items.[${index}].amount`} />
                      </td>
                      <td className='flex items-center justify-center py-5'>
                        <Button variant='ghost' size='icon'>
                          <MinusCircle
                            onClick={() => remove(index)}
                            className='cursor-pointer text-primary'
                          />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className='flex justify-end mt-2'>
              <Button
                type='button'
                className='text-primary bg-[#FFF2F2] flex gap-2 items-center justify-center'
                onClick={() =>
                  append({
                    item: "",
                    fco_number: "",
                    amount: 0,
                    // number_of_days: 0,
                    unit_cost: 0,
                  })
                }
              >
                <AddSquareIcon />
                Add
              </Button>
            </div>
          </div>

          {/* <div className='flex items-center justify-end'>
            <div className='text-primary border-primary flex items-center justify-start gap-2 rounded border-2 px-6 py-3 text-base font-semibold'>
              <span>Total:</span>
              <span>N0.00</span>
            </div>
          </div> */}

          <div className='my-2'>
            <h3 className='mb-4'>Requested By</h3>
            <div className='flex flex-col gap-6'>
              <div className='grid grid-cols-2 gap-5'>
                {usersOptions && (
                  <FormSelect
                    label='Name'
                    name='requested_by'
                    required
                    options={usersOptions}
                  />
                )}
                <FormSelect label='Role' name='role_requested_by' required>
                  <SelectContent>
                    {positionLoading ? (
                      <LoadingSpinner />
                    ) : (
                      position?.data.results?.map((p) => (
                        <SelectItem key={p?.id} value={p?.id}>
                          {p?.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </FormSelect>
              </div>
            </div>
          </div>
          <div className='my-2'>
            <h3 className='mb-4'>Reviewed By</h3>
            <div className='flex flex-col gap-6'>
              <div className='grid grid-cols-2 gap-5'>
                {usersOptions && (
                  <FormSelect
                    label='Name'
                    name='reviewed_by'
                    required
                    options={usersOptions}
                  />
                )}
                <FormSelect label='Role' name='role_reviewed_by' required>
                  <SelectContent>
                    {positionLoading ? (
                      <LoadingSpinner />
                    ) : (
                      position?.data.results?.map((p) => (
                        <SelectItem key={p?.id} value={p?.id}>
                          {p?.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </FormSelect>
              </div>
            </div>
          </div>
          <div className='my-2'>
            <h3 className='mb-4'>Approved By</h3>
            <div className='flex flex-col gap-6'>
              <div className='grid grid-cols-2 gap-5'>
                {usersOptions && (
                  <FormSelect
                    label='Name'
                    name='approved_by'
                    required
                    options={usersOptions}
                  />
                )}
                <FormSelect label='Role' name='role_approved_by' required>
                  <SelectContent>
                    {positionLoading ? (
                      <LoadingSpinner />
                    ) : (
                      position?.data.results?.map((p) => (
                        <SelectItem key={p?.id} value={p?.id}>
                          {p?.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </FormSelect>
              </div>
            </div>
          </div>
          <div className='my-2'>
            <h3 className='mb-4'>Authorized By</h3>
            <div className='flex flex-col gap-6'>
              <div className='grid grid-cols-2 gap-5'>
                {usersOptions && (
                  <FormSelect
                    label='Name'
                    name='authorised_by'
                    required
                    options={usersOptions}
                  />
                )}
                <FormSelect label='Role' name='role_authorised_by' required>
                  <SelectContent>
                    {positionLoading ? (
                      <LoadingSpinner />
                    ) : (
                      position?.data.results?.map((p) => (
                        <SelectItem key={p?.id} value={p?.id}>
                          {p?.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </FormSelect>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-end'>
            <FormButton
              loading={isLoading}
              disabled={isLoading}
              type='submit'
              className='flex items-center justify-center gap-2'
            >
              Submit
              <LongArrowRight />
            </FormButton>
            {/* <Link
              className='w-fit'
              to={generatePath(RouteEnum.PURCHASE_REQUEST_FORM)}
            > */}
            {/* <Button className='flex gap-2 py-6'>
              Submit
              <LongArrowRight />
            </Button> */}
            {/* </Link> */}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePurchaseRequestForm;
