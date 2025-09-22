"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import AddSquareIcon from "components/icons/AddSquareIcon";
import LongArrowRight from "components/icons/LongArrowRight";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Upload as UploadFile } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import { SelectContent, SelectItem } from "components/ui/select";
import { RouteEnum } from "constants/RouterConstants";
import { DepartmentsResultsData } from "definations/configs/departments";
import { ItemsResultsData } from "definations/configs/itmes";
import { PurchaseRequestSchema } from "@/features/procurement/types/procurement-validator";
import { useQuery } from "@tanstack/react-query";
import { MinusCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetDepartmentPaginate } from "@/features/modules/controllers/config/departmentController";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useGetLocationList } from "@/features/modules/controllers/config/locationController";
import { useGetPositionPaginate } from "@/features/modules/controllers/config/positionController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetAllPartners } from "@/features/projects/controllers/projectController";
import { useCreatePurchaseRequest } from "@/features/procurement/controllers/purchaseRequestController";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "store/index";

const CreatePurchaseRequestForm = ({ expenses }) => {
  const searchParams = useSearchParams();
  const request = searchParams.get("request");
  console.log("Purchase request form - request parameter:", request);

  // Get activity memo data from Redux store
  const activityMemoData = useSelector((state: RootState) => state.activity.activity);
  console.log("Activity memo data from Redux:", activityMemoData);

  // Get the memo ID from Redux if not in URL
  const memoIdFromRedux = activityMemoData.length > 0 ? activityMemoData[activityMemoData.length - 1]?.createdMemoId : null;
  const finalMemoId = request || memoIdFromRedux;
  console.log("Final memo ID to use:", finalMemoId);
  const { data: departments, isLoading: departmentsIsLoading } =
    useGetDepartmentPaginate({
      page: 1,
      size: 2000000,
    });
  const { isLoading: partnersIsLoading } = useGetAllPartners({
    page: 1,
    size: 2000000,
  });
  const { data: items, isLoading: itemsIsLoading } = useGetAllItems({
    page: 1,
    size: 2000000,
  });
  const { createPurchaseRequest, isLoading } = useCreatePurchaseRequest();

  const { data: fco } = useGetAllFCONumbers({
    page: 1,
    size: 2000000,
  });
  const { data: position, isFetching: positionLoading } =
    useGetPositionPaginate({
      page: 1,
      size: 20000,
    });

  const { data: users } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  const { data: locations } = useGetLocationList({
    no_paginate: true,
  });

  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof PurchaseRequestSchema>>({
    resolver: zodResolver(PurchaseRequestSchema),
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
      request_memo: finalMemoId && finalMemoId !== "null" ? finalMemoId : "",
      items: [],
      // location
      role_requested_by: "",
      role_reviewed_by: "",
      role_authorised_by: "",
      role_approved_by: "",
      file: "",
    },
  });

  const router = useRouter();

  const { control, handleSubmit, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const usersOptions = (users as any)?.data?.results?.map(
    ({ first_name, last_name, id, position }: any) => ({
      label: `${first_name || ''} ${last_name || ''}`.trim() || 'Unnamed User',
      value: id,
      position: position || '', // Include position data for auto-population
    })
  ) || [];

  // Create a lookup map for quick access to user positions
  const userPositionLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    (users as any)?.data?.results?.forEach((user: any) => {
      lookup[user.id] = user.position || '';
    });
    console.log("User position lookup created:", lookup);
    return lookup;
  }, [users]);

  // Helper functions to auto-populate roles when users are selected
  const handleUserSelection = (userId: string, roleFieldName: string) => {
    const userPosition = userPositionLookup[userId];
    if (userPosition) {
      // The userPosition is the position ID that should match with the position dropdown
      setValue(roleFieldName as any, userPosition);
      console.log(`Auto-populated ${roleFieldName} with position:`, userPosition);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setValue("file", event.target.files[0].name);
    }
  };

  const onSubmit = async (data: z.infer<typeof PurchaseRequestSchema>) => {
    try {
      console.log("Submitting purchase request:", data);

      // Validate that we have items
      if (!data.items || data.items.length === 0) {
        if (finalMemoId) {
          toast.error("No items found from activity memo. Please ensure the activity memo contains expense items.");
        } else {
          toast.error("Please add at least one item to the purchase request");
        }
        return;
      }

      // Validate that we have a memo reference
      if (!data.request_memo || data.request_memo === "null" || data.request_memo.trim() === "") {
        toast.error("Missing activity memo reference. Please create an activity memo first.");
        return;
      }

      const payload = {
        items: data.items.map((item: any) => ({
          ...item,
          // Ensure numeric fields are properly formatted
          quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
          unit_cost: typeof item.unit_cost === 'string' ? parseFloat(item.unit_cost) : item.unit_cost,
          amount: typeof item.amount === 'string' ? parseFloat(item.amount) : item.amount,
        })),
        requested_by: data.requested_by,
        reviewed_by: data.reviewed_by,
        authorised_by: data.authorised_by,
        approved_by: data.approved_by,
        ref_number: data.ref_number,
        date_of_request: data.date_of_request,
        date_required: data.date_required,
        special_instruction: data.special_instruction,
        request_id: `PR-${Date.now()}`, // Generate a unique request ID
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

      console.log("Formatted payload for API:", payload);

      await createPurchaseRequest(payload);

      toast.success("Purchase request created successfully!");
      router.push(RouteEnum.PURCHASE_REQUEST);
    } catch (error: any) {
      console.error("Failed to create purchase request:", error);

      // Provide more specific error messages
      if (error?.response?.status === 400) {
        toast.error("Invalid data provided. Please check all fields and try again.");
      } else if (error?.response?.status === 404) {
        toast.error("Activity memo not found. Please ensure the memo exists.");
      } else if (error?.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error?.message || "Failed to create purchase request. Please try again.");
      }
    }
  };

  const expensesData = useMemo(() => {
    // If expenses prop is provided (editing existing request), use it
    if (expenses && expenses.length > 0) {
      console.log("Using expenses from props:", expenses);
      return expenses.map((exp: any) => ({
        quantity: exp?.quantity,
        unit_cost: exp?.unit_cost,
        amount: exp?.total_cost,
        item: exp?.item,
        fco_number: [],
      }));
    }

    // If creating new request from activity memo, use Redux data
    if (finalMemoId && activityMemoData && activityMemoData.length > 0) {
      // Find the latest activity memo data (most recently added)
      const latestActivityMemo = activityMemoData[activityMemoData.length - 1];
      console.log("Using activity memo data from Redux:", latestActivityMemo);

      if (latestActivityMemo?.expenses && latestActivityMemo.expenses.length > 0) {
        return latestActivityMemo.expenses.map((exp: any) => ({
          quantity: exp?.quantity || 1,
          unit_cost: exp?.unit_cost || 0,
          amount: exp?.total_cost || 0,
          item: exp?.item || "",
          fco_number: latestActivityMemo?.fconumber || [],
        }));
      }
    }

    console.log("No expenses data found, returning empty array");
    return [];
  }, [expenses, request, activityMemoData]);

  useEffect(() => {
    if (expensesData && expensesData.length > 0) {
      console.log("Populating form with expenses data:", expensesData);
      setValue("items", expensesData);

      // Show user feedback about data source
      if (finalMemoId) {
        toast.success(`Loaded ${expensesData.length} items from activity memo`);
      }
    } else if (finalMemoId) {
      console.warn("No expenses data found for memo ID:", finalMemoId);
      toast.warning("No items found from activity memo. You may need to add items manually.");
    }
  }, [expensesData, setValue, finalMemoId]);

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
                  (departments as any)?.data?.results?.map(
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
                  (locations as any)?.data?.results?.map((location: any) => (
                    <SelectItem key={location?.id} value={location?.id}>
                      {location?.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </FormSelect>
          </div>
          <div>
            <label htmlFor=''>Specification/ Instructions</label>
            <div className='w-full px-4 relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center'>
              <UploadFile size={20} />
              <Input
                type='file'
                onChange={handleFileChange}
                className='bg-inherit border-none cursor-pointer '
              />
            </div>

            <FormInput type='hidden' name='file' />
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
                              (items as any)?.data?.results?.map(
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
                                  options={(fco as any)?.data?.data?.results || []}
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
                    fco_number: [],
                    amount: 0,
                    // number_of_days: 0,
                    unit_cost: 0,
                    quantity: 1,
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
                    onValueChange={(value) => handleUserSelection(value, 'role_requested_by')}
                  />
                )}
                <FormSelect label='Role' name='role_requested_by' required>
                  <SelectContent>
                    {positionLoading ? (
                      <LoadingSpinner />
                    ) : (
                      (position as any)?.data?.results?.map((p: any) => (
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
                    onValueChange={(value) => handleUserSelection(value, 'role_reviewed_by')}
                  />
                )}
                <FormSelect label='Role' name='role_reviewed_by' required>
                  <SelectContent>
                    {positionLoading ? (
                      <LoadingSpinner />
                    ) : (
                      (position as any)?.data?.results?.map((p: any) => (
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
                    onValueChange={(value) => handleUserSelection(value, 'role_approved_by')}
                  />
                )}
                <FormSelect label='Role' name='role_approved_by' required>
                  <SelectContent>
                    {positionLoading ? (
                      <LoadingSpinner />
                    ) : (
                      (position as any)?.data?.results?.map((p: any) => (
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
                    onValueChange={(value) => handleUserSelection(value, 'role_authorised_by')}
                  />
                )}
                <FormSelect label='Role' name='role_authorised_by' required>
                  <SelectContent>
                    {positionLoading ? (
                      <LoadingSpinner />
                    ) : (
                      (position as any)?.data?.results?.map((p: any) => (
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
              href={generatePath(RouteEnum.PURCHASE_REQUEST_FORM)}
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
