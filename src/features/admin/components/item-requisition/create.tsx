"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import {
  ItemRequisitionSchema,
  TItemRequisitionFormValues,
} from "features/admin/types/inventory-management/item-requisition";
import { Minus } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useGetAllConsumablesQuery } from "@/features/admin/controllers/consumableController";
import {
  useCreateItemRequisitionMutation,
  useEditItemRequisitionMutation,
  useGetSingleItemRequisitionQuery,
} from "@/features/admin/controllers/itemRequisitionController";
import { useGetAllDepartmentsQuery } from "@/features/modules/controllers/config/departmentController";
import { useGetAllUsersQuery, useGetUserProfile } from "@/features/auth/controllers/userController";
import { toast } from "sonner";
import { useGetAllItemsQuery } from "@/features/modules/controllers/config/itemController";
import { useGetAllStores } from "@/features/admin/controllers/storeController";
import {
  getReviewerOptions,
  getAuthorizerOptions,
  getApproverOptions
} from "@/utils/approvalFilters";
import { filterAhniStaffOnly } from "@/utils/userFilters";

export default function CreateItemRequisition() {
  // Get current user's profile to detect their location
  const { data: currentUserProfile } = useGetUserProfile();

  const { data: items } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
    category: "fadb6228-23de-4b04-9eac-b75940cf622f",
  });

  const { data: user } = useGetAllUsersQuery({
    page: 1,
    size: 2000000,
  });

  const { data: department } = useGetAllDepartmentsQuery({
    page: 1,
    size: 2000000,
  });

  // Phase 5: Fetch stores for selection
  const { data: storesData } = useGetAllStores({
    page: 1,
    size: 1000,
    is_active: true,
  });

  // Filter for AHNI staff only (exclude vendors, consultants, external users)
  const ahniStaff = useMemo(
    () => filterAhniStaffOnly(user?.data.results || []),
    [user?.data.results]
  );

  const userOptions = useMemo(
    () =>
      ahniStaff.map(({ first_name, last_name, id }) => ({
        label: `${first_name} ${last_name}`,
        value: id,
      })),
    [ahniStaff]
  );

  // Filtered options for approval workflow - only users with appropriate permissions
  // Fallback to all AHNI staff if no specific approvers are configured
  const reviewerOptions = useMemo(() => {
    const options = getReviewerOptions(ahniStaff);
    console.log("Reviewer options from permissions:", options);

    // If no reviewers found with permissions, use all AHNI staff as fallback
    if (options.length === 0) {
      console.log("No reviewers with permissions found, using all AHNI staff as fallback");
      return userOptions;
    }
    return options;
  }, [ahniStaff, userOptions]);

  const authorizerOptions = useMemo(() => {
    const options = getAuthorizerOptions(ahniStaff);
    console.log("Authorizer options from permissions:", options);

    // If no authorizers found with permissions, use all AHNI staff as fallback
    if (options.length === 0) {
      console.log("No authorizers with permissions found, using all AHNI staff as fallback");
      return userOptions;
    }
    return options;
  }, [ahniStaff, userOptions]);

  const approverOptions = useMemo(() => {
    const options = getApproverOptions(ahniStaff);
    console.log("Approver options from permissions:", options);

    // If no approvers found with permissions, use all AHNI staff as fallback
    if (options.length === 0) {
      console.log("No approvers with permissions found, using all AHNI staff as fallback");
      return userOptions;
    }
    return options;
  }, [ahniStaff, userOptions]);

  const { createItemRequisition, isLoading: isCreateLoading } =
    useCreateItemRequisitionMutation();

  const consumableOptions = useMemo(
    () =>
      items?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [items]
  );

  const departmentOptions = useMemo(
    () =>
      department?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [department]
  );

  // Phase 5: Store options - filtered by user's location
  const storeOptions = useMemo(() => {
    if (!storesData?.data?.results) return [];

    const userLocation = currentUserProfile?.data?.location;

    // Filter stores based on user's location
    const filteredStores = storesData.data.results.filter((store: any) => {
      // Always include CENTRAL stores (available to everyone)
      if (store.store_type === "CENTRAL") {
        return true;
      }

      // For LOCATION stores, only show if it matches user's location
      if (store.store_type === "LOCATION" && userLocation) {
        // Check if store location matches user location (compare both ID and string)
        return store.location?.id === userLocation || store.location === userLocation;
      }

      return false;
    });

    return filteredStores.map((store: any) => ({
      label: `${store.name} (${store.code}) - ${store.store_type === "CENTRAL" ? "Central" : "Location"}`,
      value: String(store.id), // Ensure value is always a string
    }));
  }, [storesData, currentUserProfile]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: itemRequisition } = useGetSingleItemRequisitionQuery(
    id || "",
    !!id
  );

  const { editItemRequisition, isLoading: isEditLoading } =
    useEditItemRequisitionMutation(id || "");

  const router = useRouter();

  const form = useForm<TItemRequisitionFormValues>({
    resolver: zodResolver(ItemRequisitionSchema),
    defaultValues: {
      department: "",
      store: "", // Phase 5: Store selection
      reviewer: "",
      authorizer: "",
      approver: "",
      consummables: [{ consummable: "", quantity: "0" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "consummables",
  });

  const onSubmit: SubmitHandler<TItemRequisitionFormValues> = async ({
    consummables,
    ...rest
  }) => {
    try {
      const payload = {
        consummables,
        ...rest,
      };

      console.log({ payload, rest, consummables });

      if (id) {
        await editItemRequisition(payload);
        toast.success("Item Requisition Updated");
      } else {
        await createItemRequisition(payload);
        toast.success("Item Requisition Created");
      }

      router.push(AdminRoutes.ITEM_REQUISITION);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  // Auto-select store if only one is available for the user's location
  useEffect(() => {
    if (!id && storeOptions.length === 1) {
      const currentValue = form.getValues("store");

      if (!currentValue) {
        // Use setTimeout to ensure the form is fully rendered
        setTimeout(() => {
          form.setValue("store", storeOptions[0].value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
          toast.info(`Auto-selected: ${storeOptions[0].label}`);
        }, 100);
      }
    }
  }, [storeOptions, form, id]);

  useEffect(() => {
    if (itemRequisition) {
      console.log({ itemRequisition });

      form.reset({
        department: itemRequisition?.data.department.id,
        store: itemRequisition?.data.store || "", // Phase 5: Include store
        reviewer: itemRequisition?.data.reviewer || "",
        authorizer: itemRequisition?.data.authorizer || "",
        approver: itemRequisition?.data.approver || "",
        consummables: itemRequisition?.data.consummables.map(
          ({ quantity, consummable }) => ({
            consummable: consummable?.id,
            quantity: String(quantity),
          })
        ),
      });
    }
  }, [itemRequisition]);

  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-x-5'>
        <GoBack />
        <h4 className='text-xl font-bold'>Item Requisition</h4>
      </div>
      <Card>
        <FormProvider {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-3 items-center gap-5'
              >
                <FormSelect
                  label='Item Requested'
                  name={`consummables.${index}.consummable`}
                  placeholder='Select Item'
                  options={consumableOptions}
                  required
                />

                <FormInput
                  label='Quantity Requested'
                  name={`consummables.${index}.quantity`}
                  placeholder='Enter Quantity'
                  required
                />

                <Button
                  type='button'
                  variant='link'
                  onClick={() => {
                    remove(index);
                  }}
                >
                  <Minus />
                </Button>
              </div>
            ))}

            <Button
              type='button'
              onClick={() => {
                append({ consummable: "", quantity: "0" });
              }}
            >
              <AddSquareIcon />
              Add Item
            </Button>
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <FormSelect
                label='Department/Unit'
                name='department'
                placeholder='Select Department'
                options={departmentOptions}
                required
              />

              {/* Phase 5: Store Selection - Auto-filtered by user location */}
              <div className="space-y-1">
                <FormSelect
                  label='Store'
                  name='store'
                  placeholder={storeOptions.length === 0 ? 'No stores available at your location' : 'Select Store'}
                  options={storeOptions}
                  required
                />
                {currentUserProfile?.data?.location && (
                  <p className="text-xs text-gray-500">
                    Showing stores for your location ({storeOptions.length} available)
                  </p>
                )}
              </div>

              <FormSelect
                label='Reviewer'
                name='reviewer'
                required
                placeholder='Select Reviewer'
                options={reviewerOptions}
              />

              <FormSelect
                label='Authorizer'
                name='authorizer'
                required
                placeholder='Select Authorizer'
                options={authorizerOptions}
              />

              <FormSelect
                label='Approver'
                name='approver'
                required
                placeholder='Select Approver'
                options={approverOptions}
              />
            </div>
            <div className='flex justify-end'>
              <FormButton
                type='submit'
                loading={isCreateLoading || isEditLoading}
              >
                {id ? "Update Item Requisition" : "Create Item Requisition"}
              </FormButton>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
