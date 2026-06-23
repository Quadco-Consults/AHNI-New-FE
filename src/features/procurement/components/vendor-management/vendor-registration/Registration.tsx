"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useForm } from "react-hook-form";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelectField";
import { ChevronRight, Search } from 'lucide-react';
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import FormButton from "@/components/FormButton";
import { Button } from "@/components/ui/button";
import FormTextArea from "@/components/FormTextArea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import CategoryAPI from "@/features/modules/controllers/config/categoryController";
import logoPng from "@/assets/imgs/logo.png";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "@/components/Loading";
import { CategoryResultsData } from "definitions/configs/category";
import { Checkbox } from "@/components/ui/checkbox";
import { VendorsRegistrationSchema } from "@/features/procurement/types/procurement-validator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorsActions } from "@/store/formData/procurement-vendors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import useQuery from "@/hooks/useQuery";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import EoiAPI from "@/features/procurement/controllers/eoiController";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
// import { skipToken } from "@reduxjs/toolkit/query";

const Registration = () => {
  const query = useQuery();
  const vendorId = query.get("id");
  const eoiId = query.get("eoi_id"); // Capture EOI ID from URL if vendor is registering from an EOI

  const queryClient = useQueryClient();

  // Fetch EOI data if registering through an EOI
  const { data: eoiData } = EoiAPI.useGetEoi(eoiId as string, !!eoiId);

  // Use the hook correctly
  const {
    data: vendor,
    isLoading,
    error,
    // @ts-ignore
  } = VendorsAPI.useGetVendor(vendorId);

  // Add the create and update vendor mutation hooks
  const { createVendor: createVendorMutation, isLoading: isCreatingVendor } = VendorsAPI.useCreateVendor();
  const { updateVendor: updateVendorMutation, isLoading: isUpdatingVendor } = VendorsAPI.useUpdateVendor(vendorId || "");

  const currentVendor = useSelector((state: RootState) => state.vendors.currentVendor);

  if (isLoading) {
    console.log("Loading...");
  }

  if (error) {
    console.error("Error fetching vendor:", error);
  }

  const [categorySearchParams, setCategorySearchParams] = useState("");

  const categoryQueryResult = CategoryAPI.useGetAllCategories({
    page: 1,
    size: 1000,
    search: categorySearchParams,
  });
  // @ts-ignore
  const categories = categoryQueryResult?.data?.data?.results;

  // Load saved form data from sessionStorage on mount
  const getSavedFormData = () => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('vendorRegistrationForm');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
    }
    return null;
  };

  const savedData = getSavedFormData();

  const form = useForm<z.infer<typeof VendorsRegistrationSchema>>({
    resolver: zodResolver(VendorsRegistrationSchema),
    defaultValues: savedData || {
      company_name: "",
      type_of_business: "",
      year_or_incorperation: "",
      company_registration_number: "",
      website: "",
      email: "",
      mobile_number_1: "",
      mobile_number_2: "",
      mobile_number_3: "",
      nature_of_business: "",
      company_address: "",
      tin: "",
      number_of_permanent_staff: "",
      company_chairman: "",
      bank_address: "",
      bank_name: "",
      account_name: "",
      account_number: "",
      submitted_categories: [],
      state: "",
    },
  });

  // Load vendor data if editing existing vendor
  useEffect(() => {
    if (vendorId && vendor?.data && !isLoading) {
      const vendorFormData = {
        company_name: vendor?.data?.company_name || "",
        type_of_business: vendor?.data?.type_of_business || "",
        year_or_incorperation: vendor?.data?.year_or_incorperation || "",
        company_registration_number:
          vendor?.data?.company_registration_number || "",
        website: vendor?.data?.website || "",
        email: vendor?.data?.email || "",
        mobile_number_1: vendor?.data?.mobile_number_1 || "",
        mobile_number_2: vendor?.data?.mobile_number_2 || "",
        mobile_number_3: vendor?.data?.mobile_number_3 || "",
        nature_of_business: vendor?.data?.nature_of_business || "",
        company_address: vendor?.data?.company_address || "",
        tin: vendor?.data?.tin || "",
        number_of_permanent_staff:
          vendor?.data?.number_of_operational_work_shift || "",
        company_chairman: vendor?.data?.company_chairman || "",
        bank_address: vendor?.data?.bank_address || "",
        bank_name: vendor?.data?.bank_name || "",
        account_name: vendor?.data?.account_name || "",
        account_number: vendor?.data?.account_number || "",
        submitted_categories:
          vendor?.data?.submitted_categories_details?.map(
            (cat: any) => cat?.cat_id || cat
          ) || [],
        state: vendor?.data?.state || "",
      };
      form.reset(vendorFormData);
      // Save to sessionStorage for persistence
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('vendorRegistrationForm', JSON.stringify(vendorFormData));
      }
    }
  }, [vendorId, vendor, isLoading, form]);

  // Load EOI categories if registering through an EOI
  useEffect(() => {
    if (eoiId && eoiData?.data && !vendorId) {
      // Only populate categories if this is a new vendor (not editing)
      const eoiCategories = eoiData.data.categories_details?.map((cat: any) => cat?.cat_id || cat?.id) || [];

      if (eoiCategories.length > 0) {
        console.log("Setting submitted_categories from EOI:", eoiCategories);
        form.setValue('submitted_categories', eoiCategories);
      }
    }
  }, [eoiId, eoiData, vendorId, form]);

  // Auto-save form data to sessionStorage on change
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('vendorRegistrationForm', JSON.stringify(value));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const dispatch = useDispatch();

  const router = useRouter();

  const pathname = usePathname();

  const { handleSubmit, watch } = form;

  const matchedCategories =
    categories?.filter((category: CategoryResultsData) =>
      watch("submitted_categories").includes(String(category?.id))
    ) || [];

  const onSubmit = async (data: z.infer<typeof VendorsRegistrationSchema>) => {
    console.log("Registration form submitted with data:", data);
    console.log("Vendor ID from query:", vendorId);
    console.log("Is this an update?", !!vendorId);

    try {
      // Transform approved_categories_details to just IDs if they exist
      let approvedCategoriesForApi = vendor?.data?.approved_categories_details;

      // If approved_categories_details is an array of objects with cat_id, extract just the IDs
      if (Array.isArray(approvedCategoriesForApi) && approvedCategoriesForApi.length > 0) {
        // Check if items have cat_id property (they're objects)
        if (approvedCategoriesForApi[0]?.cat_id) {
          approvedCategoriesForApi = approvedCategoriesForApi.map((cat: any) => cat.cat_id);
          console.log("Transformed approved_categories from objects to IDs:", approvedCategoriesForApi);
        }
      }

      const vendorData = {
        ...data,
        ...(eoiId && { eoi: eoiId }), // Include EOI ID if vendor is registering from an EOI
      };

      // Update current vendor data in Redux store for persistence
      dispatch(vendorsActions.updateCurrentVendor(vendorData));

      // Also add to vendors array for backwards compatibility
      dispatch(vendorsActions.addVendors(vendorData));

      let targetVendorId = vendorId;
      let isUpdate = !!vendorId;

      // If this is updating an existing vendor, use update API
      if (vendorId) {
        console.log("Updating existing vendor with ID:", vendorId);

        // For updates, don't include approved_categories
        // The backend will handle approved_categories separately through the approval workflow
        const updateData: any = { ...vendorData };

        // Explicitly remove approved_categories if it exists (shouldn't be in form data, but being safe)
        delete updateData.approved_categories;
        // Also remove approved_categories_details if it somehow got included
        delete updateData.approved_categories_details;

        console.log("Update data:", updateData);

        try {
          // Call the vendor update API
          const vendorResponse = await updateVendorMutation(updateData);
          console.log("Vendor update response:", vendorResponse);

          toast.success("Vendor updated successfully!");

          // Invalidate all vendor-related queries to refresh the data
          await queryClient.invalidateQueries({
            queryKey: ["vendors"],
            exact: false,
            refetchType: "active",
          });

          // Clear saved form data after successful update
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('vendorRegistrationForm');
          }

          // Redirect back to supplier database
          router.push('/dashboard/procurement/supplier-database');
          return; // Exit early after update
        } catch (updateError) {
          console.error("Error updating vendor:", updateError);
          toast.error(`Failed to update vendor: ${(updateError as any).message || 'Unknown error'}`);
          return;
        }
      }

      // If this is a new vendor registration (no existing vendorId), create the vendor now
      console.log("Creating new vendor with data:", vendorData);

      // For new vendors, include approved_categories if they exist (triggers pending status)
      const createData = {
        ...vendorData,
        ...(approvedCategoriesForApi && { approved_categories: approvedCategoriesForApi }),
      };

      console.log("Create data with approved_categories:", createData);

      try {
        // Call the vendor creation API and get the response
        const vendorResponse = await createVendorMutation(createData);
        console.log("Vendor creation response:", vendorResponse);

        // Get the created vendor ID - check multiple possible response structures
        targetVendorId = vendorResponse?.data?.id || vendorResponse?.id;

        if (!targetVendorId) {
          console.error("Failed to create vendor - no ID returned from response:", vendorResponse);
          toast.error("Failed to create vendor - no ID returned. Please try again.");
          return;
        }

        // Store the vendor data with ID in Redux
        dispatch(vendorsActions.updateCurrentVendor({
          ...vendorData,
          id: targetVendorId
        }));

        console.log("Vendor created successfully with ID:", targetVendorId);
        toast.success("Vendor created successfully!");
      } catch (createError) {
        console.error("Error creating vendor:", createError);
        toast.error(`Failed to create vendor: ${(createError as any).message || 'Unknown error'}`);
        return;
      }

      let path = pathname;

      // Remove the last segment of the path
      path = path.substring(0, path.lastIndexOf("/"));

      // Append the new segment to the path with both vendor ID and EOI ID (if present)
      path += `/the-company?id=${targetVendorId}${eoiId ? `&eoi_id=${eoiId}` : ''}`;

      // Clear saved form data after successful submission and navigation
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('vendorRegistrationForm');
      }

      router.push(path);
    } catch (error: any) {
      console.error("Error in vendor registration:", error);
      toast.error(`Registration failed: ${error.message || 'Unknown error'}`);
      // Don't navigate if there's an error - let the user fix the issue
    }
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    console.log(
      "Current submitted_categories value:",
      watch("submitted_categories")
    );
  };

  return (
    <VendorRegistationLayout>
      <div className='px-3 '>
        <h2 className='text-lg font-bold'>Vendor Registration</h2>
        <div className='mt-10'>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className='space-y-4'
            >
              <FormInput name='company_name' label='Company Name' required />
              <div className='grid grid-cols-2 gap-6'>
                <FormSelect
                  name='type_of_business'
                  label='Type of Business'
                  required
                >
                  <SelectContent>
                    {[
                      "Limited Liability",
                      "Public Limited Company",
                      "Registered Business Enterprise",
                    ].map((value: string, index: number) => (
                      <SelectItem key={index} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </FormSelect>
                <FormInput
                  name='year_or_incorperation'
                  label='Year of incorporation'
                  type='number'
                  required
                />
                <div className='grid grid-cols-2 col-span-3 gap-x-6 '>
                  <FormInput
                    name='company_registration_number'
                    label='Company Registration Number'
                    required
                  />
                  <FormInput
                    name='website'
                    label='Company Website Address'
                    required
                  />
                </div>
                <div className='grid grid-cols-2 col-span-3 gap-x-6 '>
                  <FormInput name='email' label='Company Email' required />
                  <FormInput
                    name='mobile_number_1'
                    label='Mobile Number 1'
                    required
                    type='tel'
                  />
                </div>
                <div className='grid grid-cols-2 col-span-3 gap-x-6 '>
                  <FormInput
                    name='mobile_number_2'
                    label='Mobile Number 2'
                    type='tel'
                  />
                  <FormInput
                    name='mobile_number_3'
                    label='Mobile Number 3'
                    type='tel'
                  />
                </div>
                <div className='grid grid-cols-2 col-span-3 gap-x-6 '>
                  <FormInput
                    label='Nature of Business'
                    name='nature_of_business'
                  />{" "}
                  <FormSelect name='state' label='State' required>
                    <SelectContent>
                      {statesOfNigeria.map(
                        (
                          { label, value }: { label: string; value: string },
                          index: number
                        ) => (
                          <SelectItem key={index} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </FormSelect>
                </div>
              </div>
              <div className='space-y-4'>
                <FormTextArea label='Company Address' name='company_address' />

                <FormInput
                  label='Company Chairman/Managing Director'
                  name='company_chairman'
                />
                {/* <FormInput label="Contact Telephone" name="contactTel" /> */}

                <div className='grid grid-cols-2 gap-4 '>
                  <FormInput label="Company's Bankers" name='bank_name' />
                  <FormInput
                    label="Company's Bankers Address"
                    name='bank_address'
                  />
                </div>
                <div className='grid grid-cols-2 gap-4 '>
                  <FormInput label="Account Name" name='account_name' required />
                  <FormInput label="Account Number" name='account_number' required />
                </div>
                <div className='grid grid-cols-2 gap-4 '>
                  <FormInput
                    label='Number of permanent staff'
                    name='number_of_permanent_staff'
                    type='number'
                  />
                  <FormInput
                    label="Company's Tax Identification Number (TIN)"
                    name='tin'
                  />
                </div>
              </div>
              <div className='flex items-center gap-2 flex-wrap'>
                <div className='flex items-center gap-2 flex-wrap'>
                  {matchedCategories?.map((category: CategoryResultsData) => (
                    <Badge
                      key={category?.id}
                      className='py-2 rounded-lg bg-[#EBE8E1] text-black'
                    >
                      {category?.name}
                    </Badge>
                  ))}
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger>
                      <div className='text-yellow-darker font-medium border shadow-sm py-2 px-5 rounded-lg text-sm'>
                        Click to select categories that applies
                      </div>
                    </DialogTrigger>
                    <DialogContent className='max-w-6xl max-h-[700px] overflow-auto'>
                      <DialogHeader className='mt-10 space-y-5 text-center'>
                        <img
                          src={logoPng}
                          alt='logo'
                          className='mx-auto'
                          width={150}
                        />
                        <DialogTitle className='text-2xl text-center'>
                          Select your Category
                        </DialogTitle>
                        <DialogDescription className='text-center'>
                          Select all categories that applies to you, you can
                          also check other tabs for more categories
                        </DialogDescription>
                      </DialogHeader>
                      <div className='flex justify-center'>
                        <div className='flex items-center w-1/2 px-4 py-2 border rounded-lg'>
                          <Input
                            placeholder='Search Category'
                            value={categorySearchParams}
                            onChange={(e) =>
                              setCategorySearchParams(e.target.value)
                            }
                            type='search'
                            className='h-6 border-none bg-none'
                          />
                          <Icon icon='iconamoon:search-light' fontSize={25} />
                        </div>
                      </div>

                      <div className='space-y-5 '>
                        {categoryQueryResult?.isLoading ? (
                          <LoadingSpinner />
                        ) : (
                          <div>
                            {/* Select All Checkbox */}
                            <div className='flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                              <Checkbox
                                id='select-all'
                                checked={
                                  categories?.length > 0 &&
                                  watch("submitted_categories")?.length === categories?.length
                                }
                                onCheckedChange={(checked) => {
                                  const allCategoryIds = categories?.map((cat: CategoryResultsData) => String(cat.id)) || [];
                                  form.setValue("submitted_categories", checked ? allCategoryIds : []);
                                }}
                              />
                              <label htmlFor='select-all' className='text-sm font-medium text-blue-800 cursor-pointer'>
                                Select All Categories ({categories?.length || 0})
                              </label>
                            </div>

                            <FormField
                              control={form.control}
                              name='submitted_categories'
                              render={() => (
                                <FormItem className='grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-4'>
                                {categories?.map(
                                  (category: CategoryResultsData) => (
                                    <FormField
                                      key={category?.id}
                                      control={form.control}
                                      name='submitted_categories'
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={category.id}
                                            className='space-y-3 bg-white rounded-lg text-xs p-5'
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(
                                                  String(category?.id)
                                                )}
                                                onCheckedChange={(checked) => {
                                                  const categoryId = String(
                                                    category?.id
                                                  );
                                                  const currentValue =
                                                    field.value || [];
                                                  return checked
                                                    ? field.onChange([
                                                        ...currentValue,
                                                        categoryId,
                                                      ])
                                                    : field.onChange(
                                                        currentValue.filter(
                                                          (value) =>
                                                            String(value) !==
                                                            categoryId
                                                        )
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <h6>{category?.code}</h6>
                                            <h2 className='text-sm font-medium'>
                                              {category.name}
                                            </h2>
                                            <h6>{category.description}</h6>
                                          </FormItem>
                                        );
                                      }}
                                    />
                                  )
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          </div>
                        )}

                        <div className='flex justify-end'>
                          <div className='flex gap-4 items-center'>
                            <h6 className='text-primary'>
                              {watch("submitted_categories")?.length} categories
                              Selected
                            </h6>
                            <DialogClose>
                              <div className='flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:opacity-60'>
                                Save & Continue
                              </div>
                            </DialogClose>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className='flex justify-between mt-16'>
                <Button
                  type='button'
                  onClick={() => router.back()}
                  className='bg-brand-light text-primary dark:text-gray-500'
                >
                  Cancel
                </Button>
                {/* <Button className="bg-primary">
                  Proceed <ChevronRight size={14} />{" "}
                </Button> */}
                <FormButton
                  type='submit'
                  suffix={<ChevronRight size={14} />}
                  loading={isCreatingVendor || isUpdatingVendor}
                  disabled={isCreatingVendor || isUpdatingVendor}
                >
                  {vendorId ? 'Update' : 'Proceed'}
                </FormButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </VendorRegistationLayout>
  );
};

export default Registration;

const statesOfNigeria = [
  { value: "Abia", label: "Abia" },
  { value: "Adamawa", label: "Adamawa" },
  { value: "Akwa Ibom", label: "Akwa Ibom" },
  { value: "Anambra", label: "Anambra" },
  { value: "Bauchi", label: "Bauchi" },
  { value: "Bayelsa", label: "Bayelsa" },
  { value: "Benue", label: "Benue" },
  { value: "Borno", label: "Borno" },
  { value: "Cross River", label: "Cross River" },
  { value: "Delta", label: "Delta" },
  { value: "Ebonyi", label: "Ebonyi" },
  { value: "Edo", label: "Edo" },
  { value: "Ekiti", label: "Ekiti" },
  { value: "Enugu", label: "Enugu" },
  { value: "Federal Capital Territory", label: "FCT (Abuja)" },
  { value: "Gombe", label: "Gombe" },
  { value: "Imo", label: "Imo" },
  { value: "Jigawa", label: "Jigawa" },
  { value: "Kaduna", label: "Kaduna" },
  { value: "Kano", label: "Kano" },
  { value: "Katsina", label: "Katsina" },
  { value: "Kebbi", label: "Kebbi" },
  { value: "Kogi", label: "Kogi" },
  { value: "Kwara", label: "Kwara" },
  { value: "Lagos", label: "Lagos" },
  { value: "Nasarawa", label: "Nasarawa" },
  { value: "Niger", label: "Niger" },
  { value: "Ogun", label: "Ogun" },
  { value: "Ondo", label: "Ondo" },
  { value: "Osun", label: "Osun" },
  { value: "Oyo", label: "Oyo" },
  { value: "Plateau", label: "Plateau" },
  { value: "Rivers", label: "Rivers" },
  { value: "Sokoto", label: "Sokoto" },
  { value: "Taraba", label: "Taraba" },
  { value: "Yobe", label: "Yobe" },
  { value: "Zamfara", label: "Zamfara" },
];
