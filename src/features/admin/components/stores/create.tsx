"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import BackNavigation from "components/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import FormTextArea from "@/components/FormTextArea";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
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
import { useGetAllDepartments } from "@/features/modules/controllers/config/departmentController";
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
      location: undefined as any,
      store_type: "LOCATION",
      parent_store: undefined as any,
      store_keeper: undefined as any,
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
  const { data: departmentsData } = useGetAllDepartments({
    page: 1,
    size: 1000,
  });
  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsers({
    page: 1,
    size: 1000,
  });

  // Debug: Log when users data actually loads
  useEffect(() => {
    if (usersData) {
      console.log("✅ Users data loaded:", usersData);
    }
  }, [usersData]);

  // Create options
  const locationOptions = useMemo(
    () =>
      locationsData?.data?.results
        ?.filter((location: any) => location.id && location.id.trim() !== "")
        .map((location: any) => ({
          label: location.name,
          value: location.id,
        })) || [],
    [locationsData]
  );

  const parentStoreOptions = useMemo(
    () =>
      centralStoresData?.data?.results
        ?.filter((store: any) => store.id && store.id.trim() !== "")
        .map((store: any) => ({
          label: `${store.name} (${store.code})`,
          value: store.id,
        })) || [],
    [centralStoresData]
  );

  const storeKeeperOptions = useMemo(() => {
    // Access the correct nested data structure
    const users = usersData?.data?.results;

    if (!users) {
      console.log("No users data available");
      return [];
    }

    console.log("Total users:", users.length);
    console.log("Departments data:", departmentsData?.data?.results);

    // Find Admin department ID
    const adminDepartment = departmentsData?.data?.results?.find(
      (dept: any) => dept.name?.toLowerCase()?.includes("admin")
    );

    console.log("Admin department found:", adminDepartment);

    // Filter for users who are in Admin department and can be store keepers
    const eligibleUsers = users.filter((user: any) => {
      // Check if user has valid ID
      if (!user.id || user.id.trim() === "") return false;

      // Check if user is active
      if (!user.is_active) return false;

      // Check if user has appropriate user type
      const hasValidUserType = ["AHNI_STAFF", "ADMIN", "STORE_KEEPER"].includes(user.user_type);

      // For now, show all active users with valid user types
      // If Admin department exists, prefer users from Admin department
      if (adminDepartment) {
        const userDeptId = typeof user.department === "string"
          ? user.department
          : user.department?.id;

        const isAdminDept = userDeptId === adminDepartment.id;

        // Log user details for debugging
        if (hasValidUserType) {
          console.log(`User: ${user.first_name} ${user.last_name}, Dept ID: ${userDeptId}, Admin Dept: ${isAdminDept}, User Type: ${user.user_type}`);
        }

        return isAdminDept && hasValidUserType;
      }

      // If no Admin department found, show all users with valid user types
      console.log(`Showing user without dept filter: ${user.first_name} ${user.last_name}`);
      return hasValidUserType;
    });

    console.log("Eligible users count:", eligibleUsers.length);

    const options = eligibleUsers
      .filter((user: any) => user.id && user.id.trim() !== "") // Extra safety check
      .map((user: any) => ({
        label: `${user.first_name} ${user.last_name} (${user.position?.name || user.user_type})`,
        value: user.id,
      }));

    console.log("Store keeper options:", options);
    return options;
  }, [usersData, departmentsData]);

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
        location: store.location?.id || undefined,
        store_type: store.store_type,
        parent_store: store.parent_store?.id || null,
        store_keeper: store.store_keeper?.id || undefined,
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
                  placeholder={isLoadingUsers ? "Loading users..." : storeKeeperOptions.length === 0 ? "No eligible users found" : "Select Store Keeper"}
                  required
                  options={storeKeeperOptions}
                  disabled={isLoadingUsers}
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
