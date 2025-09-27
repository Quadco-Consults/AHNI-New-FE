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
  useGetLastOdometerReading,
} from "@/features/admin/controllers/fuelConsumptionController";
import { useGetAllUsers } from "@/features/auth/controllers/userController";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllFCONumbers } from "@/features/modules/controllers/finance/fcoNumberController";
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import { toast } from "sonner";
import { useGetAllItemsQuery } from "@/features/modules/controllers";
import { CATEGORY_IDS, PAGINATION_DEFAULTS } from "@/constants/categories";
import { standardizeApiResponse, standardizeErrorMessage } from "@/utils/fuelRequestHelpers";

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

  // Fetch vehicles with optimized pagination and category filter
  const { data: asset } = useGetAllItemsQuery({
    page: 1,
    size: PAGINATION_DEFAULTS.DROPDOWN_SIZE,
    category: CATEGORY_IDS.VEHICLE,
  });

  const assetOptions = useMemo(
    () =>
      standardizeApiResponse(asset)?.map(({ name, id }: any) => ({
        label: name || 'Unknown Asset',
        value: id,
      })) || [],
    [asset]
  );

  const { data: user } = useGetAllUsers({
    page: 1,
    size: PAGINATION_DEFAULTS.DROPDOWN_SIZE,
    search: ""
  });

  const userOptions = useMemo(
    () =>
      standardizeApiResponse(user)?.map(
        ({ first_name, last_name, employee_id, id }: any) => ({
          label: `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown User',
          value: employee_id || id, // Fallback to id if employee_id is not available
        })
      ) || [],
    [user]
  );

  const { data: location } = useGetAllLocations({
    page: 1,
    size: PAGINATION_DEFAULTS.DROPDOWN_SIZE,
    search: "",
  });

  const locationOptions = useMemo(
    () =>
      standardizeApiResponse(location)?.map(({ name, id }: any) => ({
        label: name || 'Unknown Location',
        value: id,
      })) || [],
    [location]
  );

  const { data: vendor } = useGetVendors({
    page: 1,
    size: PAGINATION_DEFAULTS.DROPDOWN_SIZE,
    approved_categories: CATEGORY_IDS.FUEL_SUPPLIERS,
  });

  const vendorOptions = useMemo(
    () =>
      standardizeApiResponse(vendor)?.map(({ company_name, id }: any) => ({
        label: company_name || 'Unknown Vendor',
        value: id,
      })) || [],
    [vendor]
  );

  const { data: fco } = useGetAllFCONumbers({
    page: 1,
    size: PAGINATION_DEFAULTS.DROPDOWN_SIZE,
    search: "",
  });

  const fcoOptions = useMemo(
    () =>
      standardizeApiResponse(fco)?.map(({ name, id }: any) => ({
        label: name || 'Unknown FCO',
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
      toast.error(standardizeErrorMessage(error));
    }
  };

  const { data: fuelConsumption } = useGetSingleFuelConsumption(id || "", !!id);

  const selectedAsset = form.watch("asset");
  const currentOdometer = form.watch("odometer");

  const { data: lastOdometerData } = useGetLastOdometerReading(
    selectedAsset || "",
    !!selectedAsset && !id
  );

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

  const calculateDistance = () => {
    if (lastOdometerData?.lastOdometer && currentOdometer) {
      const current = Number(currentOdometer);
      const previous = lastOdometerData.lastOdometer;
      return current > previous ? current - previous : 0;
    }
    return 0;
  };

  const distanceCovered = calculateDistance();

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

                <div className='space-y-2'>
                  <FormInput
                    label='Odometer Reading'
                    name='odometer'
                    type='number'
                    placeholder='Enter Odometer Reading'
                    required
                  />

                  {selectedAsset && !id && lastOdometerData && (
                    <div className='text-xs text-gray-600 bg-gray-50 p-2 rounded border'>
                      {lastOdometerData.hasPreviousRequest ? (
                        <div className='space-y-1'>
                          <div>
                            <span className='font-medium'>Previous reading:</span> {lastOdometerData.lastOdometer?.toLocaleString()} km
                          </div>
                          {lastOdometerData.lastFuelRequestDate && (
                            <div>
                              <span className='font-medium'>Last fuel date:</span> {new Date(lastOdometerData.lastFuelRequestDate).toLocaleDateString()}
                            </div>
                          )}
                          {distanceCovered > 0 && (
                            <div className='text-blue-600 font-medium'>
                              Distance covered: {distanceCovered.toLocaleString()} km
                            </div>
                          )}
                          {lastOdometerData.fuelEfficiency && (
                            <div className='text-green-600 text-xs'>
                              Previous efficiency: {lastOdometerData.fuelEfficiency.toFixed(1)} L/100km
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='text-amber-600'>
                          <span className='font-medium'>First fuel request</span> for this vehicle
                        </div>
                      )}
                    </div>
                  )}
                </div>

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

                <div className='space-y-2'>
                  <FormInput
                    label='Fuel Coupon'
                    name='fuel_coupon'
                    placeholder='Enter Fuel Coupon Number (e.g., FC-2024-001)'
                    required
                  />
                  <p className='text-xs text-gray-500'>
                    Enter the unique fuel coupon identifier provided by the vendor
                  </p>
                </div>
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
