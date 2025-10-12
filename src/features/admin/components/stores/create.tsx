"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BackNavigation from "@/components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/atoms/FormInput";
import FormSelect from "@/components/atoms/FormSelect";
import FormTextArea from "@/components/atoms/FormTextArea";
import Card from "@/components/Card";
import { Form } from "@/components/ui/form";
import { AdminRoutes } from "@/constants/RouterConstants";
import {
  StoreSchema,
  TStoreFormValues,
} from "@/features/admin/types/inventory-management/store";
import {
  useCreateStore,
  useUpdateStore,
  useGetSingleStore,
  useGetCentralStores,
} from "@/features/admin/controllers/storeController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function CreateStorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const form = useForm<TStoreFormValues>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
      code: "",
      location: "",
      store_type: "LOCATION",
      parent_store: null,
      store_keeper: "",
      description: "",
      is_active: true,
    },
  });

  const storeType = form.watch("store_type");

  // Fetch data
  const { data: storeData } = useGetSingleStore(id || "", !!id);
  const { data: locationsData } = useGetAllLocations({
    page: 1,
    size: 1000,
  });
  const { data: centralStoresData } = useGetCentralStores();
  const { data: usersData } = useGetAllUsers({
    page: 1,
    size: 1000,
  });

  // Create options
  const locationOptions = useMemo(
    () =>
      locationsData?.data?.results?.map((location: any) => ({
        label: location.name,
        value: location.id,
      })) || [],
    [locationsData]
  );

  const parentStoreOptions = useMemo(
    () =>
      centralStoresData?.data?.results?.map((store: any) => ({
        label: `${store.name} (${store.code})`,
        value: store.id,
      })) || [],
    [centralStoresData]
  );

  const storeKeeperOptions = useMemo(() => {
    if (!usersData?.data?.results) return [];

    // Filter for users who can be store keepers (AHNI_STAFF, ADMIN, STORE_KEEPER)
    const eligibleUsers = usersData.data.results.filter(
      (user: any) =>
        ["AHNI_STAFF", "ADMIN", "STORE_KEEPER"].includes(user.user_type) &&
        user.is_active
    );

    return eligibleUsers.map((user: any) => ({
      label: `${user.first_name} ${user.last_name} (${user.user_type})`,
      value: user.id,
    }));
  }, [usersData]);

  const storeTypeOptions = [
    { label: "Central Store", value: "CENTRAL" },
    { label: "Location Store", value: "LOCATION" },
  ];

  // Mutations
  const { createStore, isLoading: isCreating } = useCreateStore();
  const { updateStore, isLoading: isUpdating } = useUpdateStore(id || "");

  // Load store data for editing
  useEffect(() => {
    if (storeData?.data) {
      const store = storeData.data;
      form.reset({
        name: store.name,
        code: store.code,
        location: store.location?.id || "",
        store_type: store.store_type,
        parent_store: store.parent_store?.id || null,
        store_keeper: store.store_keeper?.id || "",
        description: store.description || "",
        is_active: store.is_active,
      });
    }
  }, [storeData, form]);

  const onSubmit = async (data: TStoreFormValues) => {
    try {
      if (id) {
        await updateStore(data);
        toast.success("Store updated successfully");
      } else {
        await createStore(data);
        toast.success("Store created successfully");
      }
      router.push(AdminRoutes.STORES);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <BackNavigation extraText={id ? "Edit Store" : "Create Store"} />
      <Card>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Store Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Store Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput
                  label="Store Name"
                  name="name"
                  placeholder="e.g., AHNI HQ Central Store"
                  required
                />

                <FormInput
                  label="Store Code"
                  name="code"
                  placeholder="e.g., HQ-MAIN"
                  required
                />

                <FormSelect
                  label="Store Type"
                  name="store_type"
                  placeholder="Select Store Type"
                  required
                  options={storeTypeOptions}
                />

                <FormSelect
                  label="Location"
                  name="location"
                  placeholder="Select Location"
                  required
                  options={locationOptions}
                />

                {storeType === "LOCATION" && (
                  <FormSelect
                    label="Parent Store (Central Store)"
                    name="parent_store"
                    placeholder="Select Parent Store"
                    options={parentStoreOptions}
                  />
                )}

                <FormSelect
                  label="Store Keeper"
                  name="store_keeper"
                  placeholder="Select Store Keeper"
                  required
                  options={storeKeeperOptions}
                />
              </div>

              <div className="grid grid-cols-1">
                <FormTextArea
                  label="Description"
                  name="description"
                  placeholder="Enter store description (optional)"
                  rows={3}
                />
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={form.watch("is_active")}
                  onCheckedChange={(checked) =>
                    form.setValue("is_active", checked as boolean)
                  }
                />
                <Label htmlFor="is_active" className="text-sm font-medium">
                  Active (Store is operational and can be used)
                </Label>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Store Type Information
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  <strong>Central Store:</strong> Main warehouse (usually at HQ)
                  that receives goods and distributes to location stores.
                </li>
                <li>
                  <strong>Location Store:</strong> Branch/office store that
                  receives inventory from central store and serves local staff.
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(AdminRoutes.STORES)}
              >
                Cancel
              </Button>
              <FormButton loading={isCreating || isUpdating}>
                {id ? "Update Store" : "Create Store"}
              </FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
