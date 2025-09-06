"use client";

import Card from "components/Card";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllVendorPrequalifications,
  useCreateVendorPrequalification,
} from "@/features/procurement/controllers/vendorPrequalificationController";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "components/ui/form";
import { z } from "zod";
import { VendorPrequalificationSchema } from "@/features/procurement/types/vendor-prequalification";
import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import { useGetAllPrequalificationCriteria } from "@/features/procurement/controllers/prequalificationCriteriaController";
import { RouteEnum } from "constants/RouterConstants";

type FormData = {
  score: boolean;
  criteria: string;
};

const StartPrequalification = () => {
  const [formData, setFormData] = useState<FormData[] | null>([]);

  const { id } = useParams();
  const router = useRouter();

  const { data: vendors, isLoading } = useGetAllVendorPrequalifications({
    page: 1,
    size: 20,
    vendor: id as string,
  });

  const { data: prequalificationCriteria } = useGetAllPrequalificationCriteria({
    page: 1,
    size: 20,
  });

  const { createVendorPrequalification, isLoading: loading } =
    useCreateVendorPrequalification();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    // Convert value to boolean if it's a string representation of a boolean
    const booleanValue = value === "true" ? true : false;

    setFormData((prevData: FormData[] | null) => {
      // Ensure prevData is an array, fallback to an empty array if null
      const dataArray = prevData ?? [];

      // Check if the criteria (id) already exists in the array
      const existingIndex = dataArray?.findIndex(
        (item) => item?.criteria === id
      );

      if (existingIndex !== -1) {
        // Update the score for the existing criteria
        const updatedData = [...dataArray];
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          score: booleanValue,
        };
        return updatedData;
      } else {
        // Add a new entry for the criteria
        return [...dataArray, { score: booleanValue, criteria: id }];
      }
    });
  };

  const form = useForm<z.infer<typeof VendorPrequalificationSchema>>({
    resolver: zodResolver(VendorPrequalificationSchema),
    defaultValues: {
      vendor: id,
      approved_categories: [],
    },
  });

  const onSubmit = async (
    data: z.infer<typeof VendorPrequalificationSchema>
  ) => {
    try {
      if (vendors) {
        const finalData = {
          vendor: data.vendor,
          financial_year: vendors?.financial_year_id,
          prequalifications: formData,
          approved_categories: data.approved_categories,
        };

        await createVendorPrequalification(finalData);
        toast.success("Successfully created.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    router.push(RouteEnum.VENDOR_MANAGEMENT);
  };

  return (
    <div className='space-y-5'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Procurement</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbItem>Prequalification</BreadcrumbItem>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Icon icon='iconoir:slash' />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Start Prequalification</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button
        onClick={() => router.back()}
        variant='outline'
        className='gap-2 text-primary border-primary'
      >
        <span>
          <ArrowLeft size={15} />
        </span>
        View Vendor info
      </Button>

      {isLoading && <LoadingSpinner />}

      {prequalificationCriteria?.data?.results?.map((criteria, index) => {
        return (
          <div
            key={index}
            className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'
          >
            <div className='p-5 '>
              <h4 className='font-bold text-lg'>{criteria.name}</h4>
            </div>

            <hr />

            <div className='p-5'>
              <div key={criteria.id} className='py-2'>
                <Card className='border-yellow-darker flex gap-2 justify-between'>
                  <h2 className='font-semibold text-base'>
                    {criteria.description}
                  </h2>
                  <div className='flex gap-5 justify-between'>
                    <div className='flex items-center space-x-2 justify-center'>
                      <input
                        type='radio'
                        id={criteria.id}
                        value='true'
                        className='accent-purple-500 top-auto'
                        name={criteria.name}
                        onChange={handleInputChange}
                      />
                      <label htmlFor='yes'>Pass</label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='radio'
                        id={criteria.id}
                        value='false'
                        name={criteria.name}
                        className='accent-primary top-auto'
                        onChange={handleInputChange}
                      />
                      <label htmlFor='no'>Fail</label>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      })}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='bg-white border shadow-sm rounded-2xl dark:bg-[hsl(15,13%,6%)]'>
            <div className='p-5 '>
              <h4 className='font-bold text-lg'>Selected Category</h4>
            </div>

            <hr />

            <div className='p-5'>
              <Card className='space-y-5 border-yellow-darker'>
                <FormField
                  control={form.control}
                  name='approved_categories'
                  render={() => (
                    <FormItem className='space-y-6'>
                      {vendors?.vendor.submitted_categories.map((category) => (
                        <FormField
                          key={category?.id}
                          control={form.control}
                          name='approved_categories'
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={category?.id}
                                className='flex gap-2 justify-between'
                              >
                                <div className='space-y-2'>
                                  <h2 className='font-semibold'>
                                    {category.code}
                                  </h2>
                                  <h6 className='font-light'>
                                    {category.description}
                                  </h6>
                                </div>
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
                                              (value) => value !== category?.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
              </Card>
            </div>
          </div>

          <div className='flex mt-10 justify-end'>
            <FormButton loading={loading} disabled={loading} type='submit'>
              Finish
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StartPrequalification;
