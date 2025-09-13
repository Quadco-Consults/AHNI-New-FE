"use client";

import LongArrowLeft from "components/icons/LongArrowLeft";
import { Label } from "components/ui/label";
import { useRouter } from "next/navigation";
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
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import {
  useGetPurchaseRequests,
  useGetPurchaseRequest,
} from "@/features/procurement/controllers/purchaseRequestController";
import { LoadingSpinner } from "components/Loading";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PurchaseOrderListSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "components/atoms/FormInput";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import FormButton from "@/components/FormButton";
import LongArrowRight from "components/icons/LongArrowRight";
import BreadcrumbCard from "components/Breadcrumb";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
// import { toast } from "sonner";
import { useCreatePurchaseOrder } from "@/features/procurement/controllers/purchaseOrderController";
import { RouteEnum } from "constants/RouterConstants";
// import { useGetAllGrades } from "@/features/modules/controllers/config/gradeController";
import MultiSelectFormField from "components/ui/multiselect";
import FormSelect from "components/atoms/FormSelect";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useGetAllFCONumbersQuery } from "@/features/modules/controllers";

const PurchaseOrderNew = () => {
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [opensPurchase, setOpensPurchase] = useState(false);
  const [vendorValue, setVendorValue] = useState("");
  const [requestValue, setRequestValue] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");

  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  const { data: vendors, isLoading: vendorsIsLoading } = useGetVendors({
    page: 1,
    size: 2000000,
  });
  const { data: requests, isLoading: requestsIsLoading } =
    useGetPurchaseRequests({ page: 1, size: 2000000 });
  const { data: requestsDetails } = useGetPurchaseRequest(
    purchaseValue as string,
    !!purchaseValue
  );

  // const fco = useGetAllGrades({
  //   page: 1,
  //   size: 2000000,
  // });

  const fco = useGetAllFCONumbersQuery({
    page: 1,
    size: 2000000,
  });

  const { data: item } = useGetAllItems({
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
    useGetAllDepartments({ page: 1, size: 2000000, search: "" });

  const {
    createPurchaseOrder: createPurchcaseOrderMutation,
    isLoading: creatingOrder,
  } = useCreatePurchaseOrder();

  const form = useForm<z.infer<typeof PurchaseOrderListSchema>>({
    resolver: zodResolver(PurchaseOrderListSchema),
    defaultValues: {
      vendor: "",
      purchase_request: "",
      payment_terms: "",
      delivery_lead_time: "",
      items: []
    },
  });

  const { setValue, control, handleSubmit } = form;

  const data = useMemo(() => {
    const items = requestsDetails?.data?.items || requestsDetails?.items;
    if (!items) return [];

    return items.map((data: any) => ({
      item_id: data?.item || "",
      fco: data?.fco || "",
      quantity: data?.quantity || 0,
      unit_cost: data?.unit_cost || 0,
      description: data?.item?.name || data?.name || "",
      uom: data?.item?.uom === null ? "" : data?.item?.uom || data?.uom || "",
      total: data?.sub_total_amount || data?.total || 0,
      name: data?.item_detail?.name || data?.item?.name || data?.name || "",
    }));
  }, [requestsDetails]);

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
          // item: item?.description,
          item: item?.description,
          quantity: item?.quantity,
          unit_price: item?.unit_cost,
          fco_number: item?.fco_number?.[0] || "",
          total_price: total_price,
        };
      }),

      delivery_lead_time: data?.delivery_lead_time,
      payment_terms: data?.payment_terms,
    };

    try {
      const res = await createPurchcaseOrderMutation(formData);

      if (res?.status === "success") {
        router.push(RouteEnum.PURCHASE_ORDER);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Purchase Order", icon: true },
    { name: "Create", icon: false },
  ];

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />

      <button
        onClick={goBack}
        className="flex aspect-square w-[3rem] items-center justify-center rounded-full bg-white drop-shadow-md"
      >
        <LongArrowLeft />
      </button>

      <p className="text-[24px] font-semibold">Purchase Order Form</p>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 pt-5 gap-5">
            <div>
              <Label className="font-semibold">
                Vendor <span className="text-red-500">*</span>
              </Label>
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {vendorValue
                        ? vendors?.data?.results?.find(
                            (vendor) => vendor?.id === vendorValue
                          )?.company_name
                        : "Select vendor..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vendor..." />
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
              <Label className="font-semibold">
                Purchase Request
                <span className="text-red-500">*</span>
              </Label>
              <div>
                <Popover open={opensPurchase} onOpenChange={setOpensPurchase}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={opensPurchase}
                      className="w-full justify-between"
                    >
                      {purchaseValue
                        ? requests?.data?.results?.find(
                            (vendor) => vendor?.id === purchaseValue
                          )?.ref_number
                        : "Select vendor..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vendor..." />
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
              <Label className="font-semibold">
                Requesting Unit/Dept
                <span className="text-red-500">*</span>
              </Label>
              <div>
                <Popover open={opens} onOpenChange={setOpens}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={opens}
                      className="w-full justify-between"
                    >
                      {requestValue
                        ? departments?.data?.results?.find(
                            (vendor) => vendor?.id === requestValue
                          )?.name
                        : "Select vendor..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vendor..." />
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
          <div className="grid grid-cols-2 pt-5 gap-5">
            <FormInput name="payment_terms" label="Payment Terms" />
            <FormInput name="delivery_lead_time" label="Delivery" />
          </div>

          <div className="mt-10">
            <div>
              <p className="font-semibold">Items Quotation</p>
              <p className="text-xs font-light ">
                Please provide your quotation for the following Items
              </p>
            </div>
          </div>
          <table className="w-full border mt-10">
            <thead>
              <tr className="text-amber-500 whitespace-nowrap border-b-2 text-xs font-semibold">
                <th className="px-2 py-5">S/N</th>
                <th className="px-2 py-5">
                  DESCRIPTION OF GOODS, WORKS OR SERVICES
                </th>
                <th className="px-2 py-5">Qty</th>
                <th className="px-2 py-5">UOM</th>
                <th className="px-2 py-5">FCO/BL</th>
                <th className="px-2 py-5"> Unit price</th>
                <th className="px-2 py-5">Total</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                return (
                  <tr key={index} className="w-full">
                    <td className="w-fit p-2 text-center ">
                      <span className="p-2 px-4 text-xs bg-black text-white rounded">
                        {index + 1}.
                      </span>
                    </td>
                    <td className="w-fit p-2 text-center">
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
                        <FormInput name={`items.${index}.name`} />
                      )}
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        name={`items.[${index}].quantity`}
                        type="number"
                        className="w-24"
                      />
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        name={`items.[${index}].uom`}
                        className="w-24"
                      />
                    </td>
                    <td className="w-fit p-2 text-center ">
                      {/* <FormInput label='' name={`items.[${index}].f */}
                      <FormField
                        control={form.control}
                        name={`items.${index}.fco_number`}
                        render={({ field }) => (
                          <FormItem className=" mt-2">
                            <FormControl>
                              <MultiSelectFormField
                                options={(fco?.data?.results || []).map((item: any) => ({
                                  id: item.id,
                                  name: item.number || item.name || item.id
                                }))}
                                onValueChange={field.onChange}
                                placeholder="Select"
                                variant="inverted"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        type="number"
                        name={`items.[${index}].unit_cost`}
                        className="w-24"
                      />
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput label="" name={`items.[${index}].total`} />
                    </td>
                    <td className="flex items-center justify-center py-5">
                      <Button variant="ghost" size="icon">
                        <MinusCircle
                          onClick={() => remove(index)}
                          className="cursor-pointer text-primary"
                        />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Add More Button */}
          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
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
              className="bg-alternate border border-primary text-primary"
            >
              <PlusCircle className="mr-1" />
              Add More
            </Button>
          </div>
          <div className="flex items-center justify-end">
            {/* <Link href={generatePath(RouteEnum.PURCHASE_ORDER)}> */}
            <FormButton
              loading={creatingOrder}
              disabled={creatingOrder}
              type="submit"
              className="flex items-center justify-center gap-2"
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
