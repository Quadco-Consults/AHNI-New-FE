"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { Card, CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { AdminRoutes } from "constants/RouterConstants";
import {
  FuelRequestSchema,
  TFuelRequestFormValues,
} from "features/admin/types/fleet-management/fuel-request";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreateFuelConsumption,
  useGetSingleFuelConsumption,
  useEditFuelConsumption,
} from "@/features/admin/controllers/fuelConsumptionController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import { toast } from "sonner";
import { useGetAllItemsQuery } from "@/features/modules/controllers";

export default function CreateFuelConsumption() {
  const form = useForm<TFuelRequestFormValues>({
    resolver: zodResolver(FuelRequestSchema),
    defaultValues: {
      asset: "",
      assigned_driver: "",
      location: "",
      vendor: "",
      odometer: "",
      date: "",
      price_per_litre: "",
      quantity: "",
      amount: "",
      fco: "",
      fuel_coupon: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  // Fetch vehicles with category filter for "vehicle"
  const { data: asset } = useGetAllItemsQuery({
    page: 1,
    size: 2000000,
    category: "b0983944-f926-4141-8e28-093960d75246",
  });

  const assetOptions = useMemo(
    () =>
      asset?.data?.results?.map(({ name, id }: any) => ({
        label: name,
        value: id,
      })) || [],
    [asset]
  );

  const { data: user } = useGetAllUsers({ page: 1, size: 2000000, search: "" });

  const userOptions = useMemo(
    () =>
      user?.data?.results?.map(
        ({ first_name, last_name, employee_id }: any) => ({
          label: `${first_name} ${last_name}`,
          value: employee_id,
        })
      ) || [],
    [user]
  );
  console.log({ user });

  const { data: location } = useGetAllLocations({
    page: 1,
    size: 2000000,
    search: "",
  });

  const locationOptions = useMemo(
    () =>
      location?.data?.results?.map(({ name, id }: any) => ({
        label: name,
        value: id,
      })) || [],
    [location]
  );

  const { data: vendor } = useGetVendors({
    page: 1,
    size: 2000000,
    approved_categories: "e74bab4f-3059-430c-ae5d-143af5463275",
  });

  const vendorOptions = useMemo(
    () =>
      vendor?.data?.results?.map(({ company_name, id }: any) => ({
        label: company_name,
        value: id,
      })) || [],
    [vendor]
  );

  const { data: fco } = useGetAllFCONumbers({
    page: 1,
    size: 2000000,
    search: "",
  });

  const fcoOptions = useMemo(
    () =>
      fco?.data?.results?.map(({ name, id }: any) => ({
        label: name,
        value: id,
      })) || [],
    [fco]
  );

  const { createFuelConsumption, isLoading: isCreateLoading } =
    useCreateFuelConsumption();

  const { editFuelConsumption, isLoading: isModifyLoading } =
    useEditFuelConsumption(id || "");

  const onSubmit: SubmitHandler<TFuelRequestFormValues> = async (data) => {
    try {
      if (id) {
        await editFuelConsumption(data);
        toast.success("Fuel consumption updated successfully");
      } else {
        await createFuelConsumption(data);
        toast.success("Fuel consumption created successfully");
      }
      router.push(AdminRoutes.INDEX_FUEL_CONSUMPTION);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Something went wrong");
    }
  };

  const { data: fuelConsumption } = useGetSingleFuelConsumption(id || "", !!id);

  useEffect(() => {
    if (fuelConsumption) {
      const {
        asset,
        assigned_driver,
        location,
        vendor,
        odometer,
        date,
        price_per_litre,
        quantity,
        amount,
        fco,
      } = fuelConsumption.data;

      form.reset({
        asset: asset.id,
        assigned_driver: assigned_driver.id,
        location: location.id,
        vendor: vendor.id,
        odometer: String(odometer),
        date,
        price_per_litre,
        quantity: String(quantity),
        amount,
        fco: fco.id,
        fuel_coupon: fuelConsumption.data.fuel_coupon || "",
      });
    }
  }, [fuelConsumption]);

  const price = form.watch("price_per_litre");
  const quantity = form.watch("quantity");

  useEffect(() => {
    if (price && quantity) {
      form.setValue("amount", String(Number(price) * Number(quantity)));
    }
  }, [price, quantity, form]);

  return (
    <div>
      <BackNavigation
        extraText={id ? "Edit Fuel Consumption" : "Create Fuel Consumption"}
      />
      <Card>
        <CardContent className='p-5'>
          <Form {...form}>
            <form
              className='flex flex-col gap-y-6'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormSelect
                  label='Asset'
                  name='asset'
                  placeholder='Select Asset'
                  required
                  options={assetOptions}
                />

                <FormSelect
                  label='Assigned Driver'
                  name='assigned_driver'
                  placeholder='Select Assigned Driver'
                  required
                  options={userOptions}
                />

                <FormSelect
                  label='Location'
                  name='location'
                  placeholder='Select Location'
                  required
                  options={locationOptions}
                />

                <FormSelect
                  label='Vendor'
                  name='vendor'
                  placeholder='Select Vendor'
                  required
                  options={vendorOptions}
                />

                <FormInput
                  label='Odometer Reading'
                  name='odometer'
                  type='number'
                  placeholder='Enter Odometer Reading'
                  required
                />

                <FormInput label='Date' name='date' type='date' required />

                <FormInput
                  label='Price Per Liter'
                  name='price_per_litre'
                  type='number'
                  placeholder='Enter Price Per Litre'
                  required
                />

                <FormInput
                  label='Quantity'
                  name='quantity'
                  type='number'
                  placeholder='Enter Quantity'
                  required
                />

                <FormInput
                  label='Amount (₦)'
                  name='amount'
                  type='number'
                  placeholder='Enter Amount'
                  required
                />

                <FormSelect
                  label='FCO'
                  name='fco'
                  placeholder='Select FCO'
                  required
                  options={fcoOptions}
                />

                <FormInput
                  label='Fuel Coupon'
                  name='fuel_coupon'
                  placeholder='Enter Fuel Coupon Number'
                  required
                />
              </div>

              <div className='flex justify-end'>
                <FormButton loading={isCreateLoading || isModifyLoading}>
                  Submit
                </FormButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
