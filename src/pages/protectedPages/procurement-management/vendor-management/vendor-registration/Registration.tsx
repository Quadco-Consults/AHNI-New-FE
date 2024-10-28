import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useForm } from "react-hook-form";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelectField";
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import FormTextArea from "atoms/FormTextArea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogClose,
} from "components/ui/dialog";
import { useMemo, useState } from "react";
import CategoryAPI from "services/configs/category";
import logoPng from "assets/imgs/logo.png";
import { Input } from "components/ui/input";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "components/shared/Loading";
import { CategoryResultsData } from "definations/configs/category";
import { Checkbox } from "components/ui/checkbox";
import { VendorsRegistrationSchema } from "definations/procurement-validator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorsActions } from "store/formData/procurement-vendors";
import { useDispatch } from "react-redux";
import { SelectContent, SelectItem } from "components/ui/select";
import { Badge } from "components/ui/badge";

const Registration = () => {
  const [categorySearchParams, setCategorySearchParams] = useState("");

  const categoryQueryResult = CategoryAPI.useGetCategoriesQuery(
    useMemo(
      () => ({ params: { no_paginate: true, search: categorySearchParams } }),
      [categorySearchParams]
    )
  );
  const categories = categoryQueryResult?.data;

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
    },
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { handleSubmit, watch } = form;

  const matchedCategories =
    categories?.filter((category: CategoryResultsData) =>
      watch("submitted_categories").includes(category?.id)
    ) || [];

  const onSubmit = (data: z.infer<typeof VendorsRegistrationSchema>) => {
    dispatch(vendorsActions.addVendors({ ...data }));

    let path = pathname;

    // Remove the last segment of the path
    path = path.substring(0, path.lastIndexOf("/"));

    // Append the new segment to the path
    path += "/the-company";
    navigate(path);
  };
  return (
    <VendorRegistationLayout>
      <div className="px-3 ">
        <h2 className="text-lg font-bold">Vendor Registration</h2>
        <div className="mt-10">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput name="company_name" label="Company Name" required />
              <div className="grid grid-cols-2 gap-6">
                <FormSelect
                  name="type_of_business"
                  label="Type of Business"
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
                  name="year_or_incorperation"
                  label="Year of incorporation"
                  type="number"
                  required
                />
                <div className="grid grid-cols-2 col-span-3 gap-x-6 ">
                  <FormInput
                    name="company_registration_number"
                    label="Company Registration Number"
                    required
                  />
                  <FormInput
                    name="website"
                    label="Company Website Address"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 col-span-3 gap-x-6 ">
                  <FormInput name="email" label="Company Email" required />
                  <FormInput
                    name="phone_numbers"
                    label="Phone Number"
                    required
                    type="number"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <FormInput
                  label="Nature of Business"
                  name="nature_of_business"
                />
                <FormTextArea label="Company Address" name="company_address" />

                <FormInput
                  label="Company Chairman/Managing Director"
                  name="company_chairman"
                />
                {/* <FormInput label="Contact Telephone" name="contactTel" /> */}

                <div className="grid grid-cols-2 gap-4 ">
                  <FormInput label="Company's Bankers" name="bank_name" />
                  <FormInput
                    label="Company's Bankers Address"
                    name="bank_address"
                  />
                  <FormInput
                    label="Company's Bankers Account Number"
                    name="bank_account_number"
                  />
                  <FormInput
                    label="Date Submitted"
                    name="date_submitted"
                    type="date"
                  />
                  <FormInput
                    label="Number of permanent staff"
                    name="number_of_permanent_staff"
                    type="number"
                  />
                  <FormInput
                    label="Company's Tax Identification Number (TIN)"
                    name="tin"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {matchedCategories?.map((category: CategoryResultsData) => (
                    <Badge
                      key={category?.id}
                      className="py-2 rounded-lg bg-[#EBE8E1] text-black"
                    >
                      {category?.name}
                    </Badge>
                  ))}
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger>
                      <div className="text-[#DEA004] font-medium border shadow-sm py-2 px-5 rounded-lg text-sm">
                        Click to select categories that applies
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[700px] overflow-auto">
                      <DialogHeader className="mt-10 space-y-5 text-center">
                        <img
                          src={logoPng}
                          alt="logo"
                          className="mx-auto"
                          width={150}
                        />
                        <DialogTitle className="text-2xl text-center">
                          Select your Category
                        </DialogTitle>
                        <DialogDescription className="text-center">
                          Select all categories that applies to you, you can
                          also check other tabs for more categories
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <div className="flex items-center w-1/2 px-4 py-2 border rounded-lg">
                          <Input
                            placeholder="Search Category"
                            value={categorySearchParams}
                            onChange={(e) =>
                              setCategorySearchParams(e.target.value)
                            }
                            type="search"
                            className="h-6 border-none bg-none"
                          />
                          <Icon icon="iconamoon:search-light" fontSize={25} />
                        </div>
                      </div>

                      <div className="space-y-5 ">
                        {categoryQueryResult?.isLoading ? (
                          <LoadingSpinner />
                        ) : (
                          <FormField
                            control={form.control}
                            name="submitted_categories"
                            render={() => (
                              <FormItem className="grid grid-cols-2 gap-5 bg-gray-100 mt-10 p-5 rounded-lg shadow-inner md:grid-cols-4">
                                {categories?.map(
                                  (category: CategoryResultsData) => (
                                    <FormField
                                      key={category?.id}
                                      control={form.control}
                                      name="submitted_categories"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={category.id}
                                            className="space-y-3 bg-white rounded-lg text-xs p-5"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(
                                                  category?.id
                                                )}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([
                                                        ...field.value,
                                                        category?.id,
                                                      ])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) =>
                                                            value !==
                                                            category?.id
                                                        )
                                                      );
                                                }}
                                              />
                                            </FormControl>
                                            <h6>{category?.code}</h6>
                                            <h2 className="text-sm font-medium">
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

                        <div className="flex justify-end">
                          <div className="flex gap-4 items-center">
                            <h6 className="text-primary">
                              {watch("submitted_categories")?.length} categories
                              Selected
                            </h6>
                            <DialogClose>
                              <div className="flex items-center bg-primary text-primary-foreground rounded-md text-sm font-medium h-11 px-4 py-3 hover:opacity-60">
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
              <div className="flex justify-between mt-16">
                <Button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                >
                  Cancel
                </Button>
                {/* <Button className="bg-primary">
                  Proceed <ChevronRight size={14} />{" "}
                </Button> */}
                <FormButton suffix={<ChevronRight size={14} type="submit" />}>
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
