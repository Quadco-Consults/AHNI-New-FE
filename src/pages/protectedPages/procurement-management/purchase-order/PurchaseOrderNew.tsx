import LongArrowLeft from "components/icons/LongArrowLeft";
import { Label } from "components/ui/label";
import { useNavigate } from "react-router-dom";
import { Check, ChevronsUpDown, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import VendorsAPI from "services/procurementApi/vendors";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import { LoadingSpinner } from "components/shared/Loading";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PurchaseOrderListSchema } from "definations/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import FormButton from "atoms/FormButton";
import LongArrowRight from "components/icons/LongArrowRight";
// import { toast } from "sonner";

import BreadcrumbCard from "components/shared/Breadcrumb";
import DepartmentsAPI from "services/configs/departments";
import { toast } from "sonner";
import { useCreatePurchaseOrderMutation } from "services/procurementApi/purchase-order";
import { RouteEnum } from "constants/RouterConstants";
import { useGetAllFCONumbersQuery } from "services/modules/finance/fco-number";
import MultiSelectFormField from "components/ui/multiselect";
import FormSelect from "atoms/FormSelect";
import { useGetAllItemsQuery } from "services/modules/config/item";

const PurchaseOrderNew = () => {
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [opensPurchase, setOpensPurchase] = useState(false);
  const [vendorValue, setVendorValue] = useState("");
  const [requestValue, setRequestValue] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");

  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendorsQuery({
      // @ts-ignore
      params: { status: "Approved" },
    });
  const { data: requests, isLoading: requestsIsLoading } =
    PurchaseRequestAPI.useGetPurchaseRequestsQuery({});
  const { data: requestsDetails } =
    PurchaseRequestAPI.useGetPurchaseRequestQuery(
      useMemo(
        () => ({
          path: { id: purchaseValue as string },
        }),
        [purchaseValue]
      )
    );

  const fco = useGetAllFCONumbersQuery({
    page: 1,
    size: 2000000,
  });

  const { data: item } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
  });

  const itemOptions = useMemo(
    () =>
      item?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [item]
  );
  const { data: departments, isLoading: departmentsIsLoading } =
    DepartmentsAPI.useGetDepartmentsQuery({});

  const [createPurchcaseOrderMutation] = useCreatePurchaseOrderMutation();

  const form = useForm<z.infer<typeof PurchaseOrderListSchema>>({
    // resolver: zodResolver(PurchaseOrderListSchema),
    defaultValues: {},
  });

  const { setValue, control, handleSubmit } = form;

  const data = useMemo(() => {
    // @ts-ignore
    return requestsDetails?.data?.items.map((data) => ({
      item_id: data?.item || "",
      fco: data?.fco || "",
      quantity: data?.quantity || 0,
      unit_cost: data?.unit_cost || 0,
      description: data?.item?.name || "",
      uom: data?.item?.uom === null ? "" : data?.item?.uom,
      total: data?.sub_total_amount || 0,
      name: data?.item_detail?.name,
    }));
  }, [requestsDetails]);

  console.log({ requestsDetails });

  useEffect(() => {
    if (data) {
      setValue("items", data);
    }
    if (purchaseValue) {
      setValue("purchase_request", purchaseValue);
    }
  }, [data, setValue, purchaseValue]);

  useEffect(() => {
    if (vendorValue) {
      setValue("vendor", vendorValue);
    }
  }, [setValue, vendorValue]);

  const { fields, remove, append } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    setValue("items", fields);
  }, []);

  const onSubmit = async (data: z.infer<typeof PurchaseOrderListSchema>) => {
    const formData = {
      purchase_request: data?.purchase_request,
      vendor: vendorValue,
      purchase_order_items: data?.items.map((item) => {
        const total_price = Number(item?.unit_cost) * Number(item?.quantity);

        return {
          item: item?.item_id,
          quantity: item?.quantity,
          unit_price: item?.unit_cost,
          fco_number: item?.fco,
          total_price: total_price,
        };
      }),

      delivery_lead_time: data?.delivery_lead_time,
      payment_terms: data?.payment_terms,
    };
    const payload = {
      // agreed_by: "ce0d4ec5-a05f-4fb4-bb0b-78d67cb22cf5",
      // authorised_by: "f8a4ae24-8c82-4a96-84ef-00bc948f3408",
      // approved_by: "02030314-b162-4b4d-8af1-88eabdcc615d",
      // department: "5d2744bf-5c5d-453b-b1a2-6fafc399eeb9",
      purchase_order_items: [
        {
          description: "New product order",
          quantity: 100,
          uom: "pcs",
          unit_price: "50.00",
          total_price: "5000.00",
          purchase_order: "94a9570d-82e2-4a81-b165-8cff67d9c735",
          item: "5953ca74-944e-4941-87b8-f4f42ef3ae12",
          fco_number: "e061813c-72e1-457d-8a00-7d067c1098c1",
        },
      ],
      status_level: "PENDING",
      // purchase_date: "2025-02-07",
      // comment: "Urgent order",
      delivery_lead_time: "7 days",
      payment_terms: "30 days",
      // authorized_datetime: "2025-02-07T14:15:22Z",
      // approved_date: "2025-02-07",
      // agreed_date: "2025-02-07",
      vendor: vendorValue,
      purchase_request: data?.purchase_request,
      // cba: "ec04ec86-b5f8-4721-bfc5-faf7ce8265d3",
      // solicitation: "28ecbd6f-6594-47e0-a285-6307da68bc1c",
      // funding_source: "82253826-056a-4942-9e4b-fa5a3865d10e",
      // location: "15f20760-76a7-41ee-b509-705d3ffd8eb5",
      // authorized_by: "d2184caf-75ac-4d95-8e72-51af98a5023a",
    };
    console.log({ formData, payload, data, vendorValue });

    try {
      createPurchcaseOrderMutation(formData).unwrap();
      navigate(RouteEnum.PURCHASE_ORDER);
      toast.success("Successfully created.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Order", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <div className='space-y-5'>
      <BreadcrumbCard list={breadcrumbs} />

      <button
        onClick={goBack}
        className='flex aspect-square w-[3rem] items-center justify-center rounded-full bg-white drop-shadow-md'
      >
        <LongArrowLeft />
      </button>

      <p className='text-[24px] font-semibold'>Purchase Order Form</p>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div className='grid grid-cols-2 pt-5 gap-5'>
            <div>
              <Label className='font-semibold'>
                Vendor <span className='text-red-500'>*</span>
              </Label>
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className='w-full justify-between'
                    >
                      {vendorValue
                        ? vendors?.data?.results?.find(
                            (vendor) => vendor?.id === vendorValue
                          )?.company_name
                        : "Select vendor..."}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0'>
                    <Command>
                      <CommandInput placeholder='Search vendor...' />
                      <CommandEmpty>No Vendor found.</CommandEmpty>
                      <CommandGroup>
                        {vendorsIsLoading && <LoadingSpinner />}
                        {vendors?.data?.results?.map((vendor) => (
                          <CommandItem
                            key={vendor?.id}
                            value={vendor?.id}
                            onSelect={(currentValue) => {
                              setVendorValue(currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                vendorValue === vendor?.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {vendor?.company_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label className='font-semibold'>
                Purchase Request
                <span className='text-red-500'>*</span>
              </Label>
              <div>
                <Popover open={opensPurchase} onOpenChange={setOpensPurchase}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={opensPurchase}
                      className='w-full justify-between'
                    >
                      {purchaseValue
                        ? requests?.data?.results?.find(
                            (vendor) => vendor?.id === purchaseValue
                          )?.ref_number
                        : "Select vendor..."}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0'>
                    <Command>
                      <CommandInput placeholder='Search vendor...' />
                      <CommandEmpty>No Vendor found.</CommandEmpty>
                      <CommandGroup>
                        {requestsIsLoading && <LoadingSpinner />}
                        {requests?.data?.results?.map((request) => {
                          return (
                            <CommandItem
                              key={request?.id}
                              value={request?.id}
                              onSelect={(currentValue) => {
                                setPurchaseValue(currentValue);
                                setOpensPurchase(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  purchaseValue === request?.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {request?.ref_number}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div>
              <Label className='font-semibold'>
                Requesting Unit/Dept
                <span className='text-red-500'>*</span>
              </Label>
              <div>
                <Popover open={opens} onOpenChange={setOpens}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={opens}
                      className='w-full justify-between'
                    >
                      {requestValue
                        ? departments?.data?.results?.find(
                            (vendor) => vendor?.id === requestValue
                          )?.name
                        : "Select vendor..."}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-full p-0'>
                    <Command>
                      <CommandInput placeholder='Search vendor...' />
                      <CommandEmpty>No Vendor found.</CommandEmpty>
                      <CommandGroup>
                        {departmentsIsLoading && <LoadingSpinner />}
                        {departments?.data?.results?.map((request) => {
                          return (
                            <CommandItem
                              key={request?.id}
                              value={request?.id}
                              onSelect={(currentValue) => {
                                setRequestValue(currentValue);
                                setOpens(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  requestValue === request?.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {request?.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-2 pt-5 gap-5'>
            <FormInput name='payment_terms' label='Payment Terms' />
            <FormInput name='delivery_lead_time' label='Delivery' />
          </div>

          <div className='mt-10'>
            <div>
              <p className='font-semibold'>Items Quotation</p>
              <p className='text-xs font-light '>
                Please provide your quotation for the following Items
              </p>
            </div>
          </div>
          <table className='w-full border mt-10'>
            <thead>
              <tr className='text-amber-500 whitespace-nowrap border-b-2 text-xs font-semibold'>
                <th className='px-2 py-5'>S/N</th>
                <th className='px-2 py-5'>
                  DESCRIPTION OF GOODS, WORKS OR SERVICES
                </th>
                <th className='px-2 py-5'>Qty</th>
                <th className='px-2 py-5'>UOM</th>
                <th className='px-2 py-5'>FCO/BL</th>
                <th className='px-2 py-5'> Unit price</th>
                <th className='px-2 py-5'>Total</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                console.log({ data });

                return (
                  <tr key={index} className='w-full'>
                    <td className='w-fit p-2 text-center '>
                      <span className='p-2 px-4 text-xs bg-black text-white rounded'>
                        {index + 1}.
                      </span>
                    </td>
                    <td className='w-fit p-2 text-center'>
                      {/* <FormInput
                        placeholder='Enter Description'
                        name={`items.[${index}].description`}
                      /> */}
                      {!data || data?.length < index + 1 ? (
                        <FormSelect
                          name={`items.${index}.description`}
                          options={itemOptions}
                          value={form.watch(`items.${index}.description`)}
                          disabled={true}
                        />
                      ) : (
                        <FormInput name={`items.${index}.name`} disabled />
                      )}
                    </td>
                    <td className='w-fit p-2 text-center'>
                      <FormInput
                        label=''
                        name={`items.[${index}].quantity`}
                        type='number'
                        className='w-24'
                      />
                    </td>
                    <td className='w-fit p-2 text-center'>
                      <FormInput
                        label=''
                        name={`items.[${index}].uom`}
                        className='w-24'
                      />
                    </td>
                    <td className='w-fit p-2 text-center '>
                      {/* <FormInput label='' name={`items.[${index}].f */}
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
                                placeholder='Select'
                                variant='inverted'
                              />
                            </FormControl>
                          </FormItem>
                        )}
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
                      <FormInput label='' name={`items.[${index}].total`} />
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
          {/* Add More Button */}
          <div className='flex justify-end mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                append({
                  description: "",
                  fco: "",
                  item_id: "",
                  quantity: "",
                  total: "",
                  unit_cost: "",
                  uom: "",
                })
              }
              className='bg-alternate border border-primary text-primary'
            >
              <PlusCircle className='mr-1' />
              Add More
            </Button>
          </div>
          <div className='flex items-center justify-end'>
            {/* <Link to={generatePath(RouteEnum.PURCHASE_ORDER)}> */}
            <FormButton
              loading={false}
              disabled={false}
              type='submit'
              className='flex items-center justify-center gap-2'
            >
              Submit
              <LongArrowRight />
            </FormButton>
            {/* </Link> */}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PurchaseOrderNew;
