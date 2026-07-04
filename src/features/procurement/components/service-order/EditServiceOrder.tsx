"use client";

import GoBack from "@/components/GoBack";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import {
  useGetPurchaseRequests,
  useGetPurchaseRequest,
} from "@/features/procurement/controllers/purchaseRequestController";
import { LoadingSpinner } from "@/components/Loading";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PurchaseOrderListSchema } from "@/features/procurement/types/procurement-validator";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import FormButton from "@/components/FormButton";
import LongArrowRight from "@/components/icons/LongArrowRight";
import BreadcrumbCard from "@/components/Breadcrumb";
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
import {
  useUpdateServiceOrder,
  useGetSingleServiceOrder
} from "@/features/procurement/controllers/serviceOrderController";
import { RouteEnum } from "@/constants/RouterConstants";
import MultiSelectFormField from "@/components/ui/multiselect";
import FormSelect from "@/components/FormSelect";
import { useGetAllItems } from "@/features/modules/controllers/config/itemController";
import { useGetAllFCONumbersQuery } from "@/features/modules/controllers";
import { toast } from "sonner";

const EditServiceOrder = () => {
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [opensPurchase, setOpensPurchase] = useState(false);
  const [vendorValue, setVendorValue] = useState("");
  const [requestValue, setRequestValue] = useState("");
  const [purchaseValue, setPurchaseValue] = useState("");

  // Approval workflow popover states
  const [openReviewer, setOpenReviewer] = useState(false);
  const [openAuthorizer, setOpenAuthorizer] = useState(false);
  const [openApprover, setOpenApprover] = useState(false);

  const params = useParams();
  const router = useRouter();
  const serviceOrderId = params.id as string;

  // Fetch existing service order data
  const { data: existingSO, isLoading: loadingSO } = useGetSingleServiceOrder(serviceOrderId);

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
      })) || [],
    [item]
  );

  const { data: departments, isLoading: departmentsIsLoading } =
    useGetAllDepartments({ page: 1, size: 2000000, search: "" });

  const { data: users, isLoading: usersIsLoading } = useGetAllUsers({
    page: 1,
    size: 2000000,
  });

  const {
    updateServiceOrder: updateServiceOrderMutation,
    isLoading: updatingOrder,
  } = useUpdateServiceOrder(serviceOrderId);

  const form = useForm<z.infer<typeof PurchaseOrderListSchema>>({
    resolver: zodResolver(PurchaseOrderListSchema),
    defaultValues: {
      vendor: "",
      purchase_request: "",
      payment_terms: "",
      delivery_lead_time: "",
      items: [],
      reviewed_by: "",
      authorized_by: "",
      approved_by: ""
    },
  });

  const { setValue, control, handleSubmit, reset } = form;

  // Populate form with existing data
  useEffect(() => {
    if (existingSO?.data) {
      const soData = existingSO.data;
      reset({
        vendor: soData.vendor || "",
        purchase_request: soData.purchase_request || "",
        payment_terms: soData.payment_terms || "",
        delivery_lead_time: soData.delivery_lead_time || "",
        reviewed_by: soData.reviewed_by || "",
        authorized_by: soData.authorized_by || "",
        approved_by: soData.approved_by || "",
        items: soData.service_order_items?.map((item: any) => ({
          item_id: item.item || "",
          fco: item.fco_number || "",
          quantity: item.quantity || 0,
          unit_cost: item.unit_price || 0,
          description: item.description || "",
          uom: item.uom || "",
          total: item.total_price || 0,
          name: item.description || "",
          fco_number: item.fco_number ? [item.fco_number] : [],
        })) || []
      });

      setVendorValue(soData.vendor || "");
      setPurchaseValue(soData.purchase_request || "");
    }
  }, [existingSO, reset]);

  const { fields, remove, append } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: z.infer<typeof PurchaseOrderListSchema>) => {
    const formData = {
      purchase_request: data?.purchase_request,
      vendor: vendorValue,
      items: data?.items.map((item) => {
        const total_price = Number(item?.unit_cost) * Number(item?.quantity);

        return {
          item: item?.description,
          quantity: item?.quantity,
          unit_price: item?.unit_cost,
          fco_number: item?.fco_number?.[0] || "",
          total_price: total_price,
        };
      }),
      delivery_lead_time: data?.delivery_lead_time,
      payment_terms: data?.payment_terms,
      reviewed_by: data?.reviewed_by || null,
      authorized_by: data?.authorized_by || null,
      approved_by: data?.approved_by || null,
    };

    try {
      await updateServiceOrderMutation(formData);
      toast.success("Service Order updated successfully");
      router.push(`/dashboard/procurement/service-orders/${serviceOrderId}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update Service Order");
    }
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Service Order", icon: true },
    { name: "Edit", icon: false },
  ];

  if (loadingSO) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-5">
      <BreadcrumbCard list={breadcrumbs} />

      <GoBack />

      <p className="text-[24px] font-semibold">Edit Service Order</p>

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
                            (request) => request?.id === purchaseValue
                          )?.ref_number
                        : "Select purchase request..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search request..." />
                      <CommandEmpty>No Request found.</CommandEmpty>
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
                  <tr key={field.id} className="w-full">
                    <td className="w-fit p-2 text-center ">
                      <span className="p-2 px-4 text-xs bg-black text-white rounded">
                        {index + 1}.
                      </span>
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput name={`items.${index}.description`} />
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        name={`items.${index}.quantity`}
                        type="number"
                        className="w-24"
                      />
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput
                        label=""
                        name={`items.${index}.uom`}
                        className="w-24"
                      />
                    </td>
                    <td className="w-fit p-2 text-center ">
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
                        name={`items.${index}.unit_cost`}
                        className="w-24"
                      />
                    </td>
                    <td className="w-fit p-2 text-center">
                      <FormInput label="" name={`items.${index}.total`} />
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
                  name: "",
                  fco_number: [],
                })
              }
              className="bg-alternate border border-primary text-primary"
            >
              <PlusCircle className="mr-1" />
              Add More
            </Button>
          </div>

          {/* Approval Workflow Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Approval Workflow (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pre-assign specific users to each approval role. Leave empty to use dynamic assignment during approval process.
            </p>
            <div className="grid grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="reviewed_by"
                render={({ field }) => (
                  <FormItem>
                    <Label>Reviewer</Label>
                    <Popover open={openReviewer} onOpenChange={setOpenReviewer}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openReviewer}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? (() => {
                                  const user = ((users as any)?.data?.results || (users as any)?.results)?.find(
                                    (user: any) => user.id === field.value
                                  );
                                  return user
                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || "Unknown User"
                                    : "Unknown User";
                                })()
                              : "Select Reviewer"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {usersIsLoading && <LoadingSpinner />}
                            {!usersIsLoading && !((users as any)?.data?.results || (users as any)?.results) && (
                              <div className="p-2 text-sm text-gray-500">No users available</div>
                            )}
                            {!usersIsLoading &&
                              ((users as any)?.data?.results || (users as any)?.results)
                                ?.filter((user: any) =>
                                  user &&
                                  user.id &&
                                  (user.first_name || user.last_name) &&
                                  user.user_type === "AHNI_STAFF"
                                )
                                ?.map((user: any) => {
                                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                                return (
                                  <CommandItem
                                    value={fullName}
                                    key={user.id}
                                    onSelect={() => {
                                      field.onChange(user.id);
                                      setOpenReviewer(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        user.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {fullName || "Unknown User"}
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorized_by"
                render={({ field }) => (
                  <FormItem>
                    <Label>Director of Finance (Authorizer)</Label>
                    <Popover open={openAuthorizer} onOpenChange={setOpenAuthorizer}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openAuthorizer}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? (() => {
                                  const user = ((users as any)?.data?.results || (users as any)?.results)?.find(
                                    (user: any) => user.id === field.value
                                  );
                                  return user
                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || "Unknown User"
                                    : "Unknown User";
                                })()
                              : "Select Director of Finance"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {usersIsLoading && <LoadingSpinner />}
                            {!usersIsLoading && !((users as any)?.data?.results || (users as any)?.results) && (
                              <div className="p-2 text-sm text-gray-500">No users available</div>
                            )}
                            {!usersIsLoading &&
                              ((users as any)?.data?.results || (users as any)?.results)
                                ?.filter((user: any) =>
                                  user &&
                                  user.id &&
                                  (user.first_name || user.last_name) &&
                                  user.user_type === "AHNI_STAFF"
                                )
                                ?.map((user: any) => {
                                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                                return (
                                  <CommandItem
                                    value={fullName}
                                    key={user.id}
                                    onSelect={() => {
                                      field.onChange(user.id);
                                      setOpenAuthorizer(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        user.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {fullName || "Unknown User"}
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="approved_by"
                render={({ field }) => (
                  <FormItem>
                    <Label>Director of Operations (Approver)</Label>
                    <Popover open={openApprover} onOpenChange={setOpenApprover}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openApprover}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? (() => {
                                  const user = ((users as any)?.data?.results || (users as any)?.results)?.find(
                                    (user: any) => user.id === field.value
                                  );
                                  return user
                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || "Unknown User"
                                    : "Unknown User";
                                })()
                              : "Select Director of Operations"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search users..." />
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {usersIsLoading && <LoadingSpinner />}
                            {!usersIsLoading && !((users as any)?.data?.results || (users as any)?.results) && (
                              <div className="p-2 text-sm text-gray-500">No users available</div>
                            )}
                            {!usersIsLoading &&
                              ((users as any)?.data?.results || (users as any)?.results)
                                ?.filter((user: any) =>
                                  user &&
                                  user.id &&
                                  (user.first_name || user.last_name) &&
                                  user.user_type === "AHNI_STAFF"
                                )
                                ?.map((user: any) => {
                                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                                return (
                                  <CommandItem
                                    value={fullName}
                                    key={user.id}
                                    onSelect={() => {
                                      field.onChange(user.id);
                                      setOpenApprover(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        user.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {fullName || "Unknown User"}
                                  </CommandItem>
                                );
                              })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end mt-6">
            <FormButton
              loading={updatingOrder}
              disabled={updatingOrder}
              type="submit"
              className="flex items-center justify-center gap-2"
            >
              Update Service Order
              <LongArrowRight />
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditServiceOrder;
