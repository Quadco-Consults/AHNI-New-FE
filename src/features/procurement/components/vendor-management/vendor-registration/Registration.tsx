"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import FormTextArea from "components/atoms/FormTextArea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "components/ui/dialog";
import { useEffect, useState } from "react";
import CategoryAPI from "@/features/modules/controllers/config/categoryController";
import logoPng from "assets/imgs/logo.png";
import { Input } from "components/ui/input";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "components/Loading";
import { CategoryResultsData } from "definations/configs/category";
import { Checkbox } from "components/ui/checkbox";
import { VendorsRegistrationSchema } from "@/features/procurement/types/procurement-validator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorsActions } from "store/formData/procurement-vendors";
import { useDispatch } from "react-redux";
import { SelectContent, SelectItem } from "components/ui/select";
import { Badge } from "components/ui/badge";
import useQuery from "hooks/useQuery";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
// import { skipToken } from "@reduxjs/toolkit/query";

const Registration = () => {
  const query = useQuery();
  const vendorId = query.get("id");

  // Use the hook correctly
  const {
    data: vendor,
    isLoading,
    error,
    // @ts-ignore
  } = VendorsAPI.useGetVendor(vendorId);

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

  const form = useForm<z.infer<typeof VendorsRegistrationSchema>>({
    resolver: zodResolver(VendorsRegistrationSchema),
    defaultValues: {
      company_name: "",
      type_of_business: "",
      year_or_incorperation: "",
      company_registration_number: "",
      website: "",
      email: "",
      phone_numbers: "",
      nature_of_business: "",
      company_address: "",
      tin: "",
      number_of_permanent_staff: "",
      company_chairman: "",
      bank_address: "",
      bank_name: "",
      submitted_categories: [],
      state: "",
    },
  });

  useEffect(() => {
    if (vendorId && vendor?.data && !isLoading) {
      form.reset({
        company_name: vendor?.data?.company_name || "",
        type_of_business: vendor?.data?.type_of_business || "",
        year_or_incorperation: vendor?.data?.year_or_incorperation || "",
        company_registration_number:
          vendor?.data?.company_registration_number || "",
        website: vendor?.data?.website || "",
        email: vendor?.data?.email || "",
        phone_numbers: vendor?.data?.phone_numbers || "",
        nature_of_business: vendor?.data?.nature_of_business || "",
        company_address: vendor?.data?.company_address || "",
        tin: vendor?.data?.tin || "",
        // number_of_permanent_staff: vendor?.data?.number_of_permanent_staff,
        number_of_permanent_staff:
          vendor?.data?.number_of_operational_work_shift || "",

        company_chairman: vendor?.data?.company_chairman || "",
        bank_address: vendor?.data?.bank_address || "",
        bank_name: vendor?.data?.bank_name || "",
        submitted_categories:
          vendor?.data?.submitted_categories_details?.map(
            (cat: any) => cat?.cat_id || cat
          ) || [],
        state: vendor?.data?.state || "",
      });
    }
  }, [vendorId, vendor, isLoading, form]);

  const dispatch = useDispatch();

  const router = useRouter();

  const pathname = usePathname();

  const { handleSubmit, watch } = form;

  const matchedCategories =
    categories?.filter((category: CategoryResultsData) =>
      watch("submitted_categories").includes(String(category?.id))
    ) || [];

  const onSubmit = (data: z.infer<typeof VendorsRegistrationSchema>) => {
    console.log({ fhgdf: "anm" });

    dispatch(
      vendorsActions.addVendors({
        ...data,
        approved_categories: vendor?.data.approved_categories_details, // Include approved_categories to trigger pending status
      })
    );

    let path = pathname;

    // Remove the last segment of the path
    path = path.substring(0, path.lastIndexOf("/"));

    // Append the new segment to the path
    path += `/the-company?id=${vendorId}`;
    router.push(path);
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
                    name='phone_numbers'
                    label='Phone Number'
                    required
                    type='number'
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
                  <FormInput
                    label="Company's Bankers Account Number"
                    name='bank_account_number'
                  />
                  <FormInput
                    label='Date Submitted'
                    name='date_submitted'
                    type='date'
                  />
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
                      <div className='text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm'>
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
                  className='bg-[#FFF2F2] text-primary dark:text-gray-500'
                >
                  Cancel
                </Button>
                {/* <Button className="bg-primary">
                  Proceed <ChevronRight size={14} />{" "}
                </Button> */}
                <FormButton type='submit' suffix={<ChevronRight size={14} />}>
                  Proceed
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
