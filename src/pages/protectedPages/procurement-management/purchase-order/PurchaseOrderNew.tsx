import LongArrowLeft from "components/icons/LongArrowLeft";
import { Label } from "components/ui/label";
import { generatePath, Link, useNavigate } from "react-router-dom";
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
import { Form } from "components/ui/form";
import FormButton from "atoms/FormButton";
import LongArrowRight from "components/icons/LongArrowRight";
// import { toast } from "sonner";
import { RouteEnum } from "constants/RouterConstants";
import BreadcrumbCard from "components/shared/Breadcrumb";

const PurchaseOrderNew = () => {
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [vendorValue, setVendorValue] = useState("");
  const [requestValue, setRequestValue] = useState("");
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendorsQuery({});
  const { data: requests, isLoading: requestsIsLoading } =
    PurchaseRequestAPI.useGetPurchaseRequestsQuery({});
  const { data: requestsDetails } =
    PurchaseRequestAPI.useGetPurchaseRequestQuery(
      useMemo(
        () => ({
          path: { id: requestValue as string },
        }),
        [requestValue]
      )
    );
  console.log({ vendors, requests, requestsDetails, requestValue });

  const form = useForm<z.infer<typeof PurchaseOrderListSchema>>({
    resolver: zodResolver(PurchaseOrderListSchema),
    defaultValues: {},
  });

  const { setValue, control, handleSubmit } = form;

  const data = useMemo(() => {
    // @ts-ignore
    return requestsDetails?.data?.items.map((data) => ({
      item_id: data?.item?.id || "",
      fco: data?.fco || "",
      quantity: data?.quantity || 0,
      unit_cost: data?.unit_cost || 0,
      description: data?.item?.name || "",
      uom: data?.item?.uom === null ? "" : data?.item?.uom,
      total: data?.sub_total_amount || 0,
    }));
  }, [requestsDetails]);

  useEffect(() => {
    if (data) {
      setValue("items", data);
    }
    if (requestValue) {
      setValue("purchase_request", requestValue);
    }
  }, [data, setValue, requestValue]);

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
    console.log({ data });

    // const formData = {
    //   purchase_request: data?.purchase_request,
    //   vendor: data?.vendor,
    //   items: data?.items.map((item) => ({
    //     item_id: item?.item_id,
    //     quantity: item?.quantity,
    //     unit_cost: item?.unit_cost,
    //     fco: item?.fco,
    //   })),
    // };

    // try {
    //   navigate(RouteEnum.PURCHASE_ORDER);
    //   toast.success("Successfully created.");
    // } catch (error) {
    //   toast.error("Something went wrong");
    //   console.log(error);
    // }
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

      <p className=' text-[24px] font-semibold'>Purchase Order Form</p>

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
                        ? requests?.data?.results?.find(
                            (vendor) => vendor?.id === requestValue
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
                          console.log({ request: request?.ref_number });

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
                return (
                  <tr key={index} className='w-full'>
                    <td className='w-fit p-2 text-center '>
                      <span className='p-2 px-4 text-xs bg-black text-white rounded'>
                        {index + 1}.
                      </span>
                    </td>
                    <td className='w-fit p-2 text-center'>
                      <FormInput
                        placeholder='Enter Description'
                        name={`items.[${index}].description`}
                      />
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
                    <td className='w-fit p-2 text-center'>
                      <FormInput label='' name={`items.[${index}].fco`} />
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
            >
              <PlusCircle className='mr-2' />
              Add More
            </Button>
          </div>
          <div className='flex items-center justify-end'>
            <Link
              to={generatePath(RouteEnum.PURCHASE_ORDER_ID, {
                id: 1,
              })}
            >
              <FormButton
                loading={false}
                disabled={false}
                type='submit'
                className='flex items-center justify-center gap-2'
              >
                Submit
                <LongArrowRight />
              </FormButton>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PurchaseOrderNew;
