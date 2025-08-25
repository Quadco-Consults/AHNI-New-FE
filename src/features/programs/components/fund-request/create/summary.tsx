"use client";

import { useRouter, usePathname } from "next/navigation";
import FormButton from "@/components/FormButton";
import { Button } from "components/ui/button";
import FundRequstLayout from "./Layout";
import React, { useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import {
  FundRequestActivitySchema,
  TFundRequestActivityFormValues,
} from "features/programs/types/program-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelect";
import { useGetAllCostCategoriesManager } from "@/features/modules/controllers/finance/costCategoryController";

const FundSummary: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<TFundRequestActivityFormValues>({
    resolver: zodResolver(FundRequestActivitySchema),
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  const { data: costCategory } = useGetAllCostCategoriesManager({
    page: 1,
    size: 2000000,
  });

  const costCategoryOptions = costCategory?.data?.results?.map(
    ({ name, id }: any) => ({
      label: name,
      value: id,
    })
  );

  const { handleSubmit } = form;

  const onSubmit: SubmitHandler<TFundRequestActivityFormValues> = async ({
    activities,
  }) => {
    const programFundRequest = JSON.parse(
      typeof window !== 'undefined' ? localStorage.getItem("programFundRequest") || "{}" : "{}"
    );

    const payload = {
      ...programFundRequest,
      activities,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem("programFundRequest", JSON.stringify(payload));
    }

    let path = pathname || "";

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/preview";

    router.push(path);
  };

  return (
    <FundRequstLayout>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Table className='border rounded-xl'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[300px]'>
                  Description of Activity
                </TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>

                <TableHead>Frequency</TableHead>
                <TableHead>Cost Category</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <FormInput
                      id='activity_description'
                      name={`activities.${index}.activity_description`}
                      placeholder=''
                    />
                  </TableCell>
                  <TableCell>
                    <FormInput
                      id='quantity'
                      name={`activities.${index}.quantity`}
                      placeholder=''
                    />
                  </TableCell>

                  <TableCell>
                    <FormInput
                      id='unit_cost'
                      name={`activities.${index}.unit_cost`}
                      placeholder=''
                    />
                  </TableCell>

                  <TableCell>
                    <FormInput
                      id='frequency'
                      name={`activities.${index}.frequency`}
                      placeholder=''
                    />
                  </TableCell>
                  <TableCell>
                    <FormSelect
                      id='category'
                      name={`activities.${index}.category`}
                      placeholder='Select Cost Category'
                      options={costCategoryOptions}
                    />
                  </TableCell>
                  <TableCell>
                    <FormInput
                      id='comment'
                      name={`activities.${index}.comment`}
                      placeholder=''
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button
            type='button'
            variant='outline'
            className='text-[#DEA004] w-[250px] mt-5'
            onClick={() =>
              append({
                activity_description: "",
                quantity: "",
                unit_cost: "",
                frequency: "",
                comment: "",
                category: "",
              })
            }
          >
            {fields.length > 0 ? "Click to add another" : "Add summary"}
          </Button>

          <div className='flex justify-end gap-5 pt-24'>
            <FormButton
              onClick={() => router.back()}
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
            >
              Back
            </FormButton>

            <FormButton type='submit'>Next</FormButton>
          </div>
        </form>
      </Form>
    </FundRequstLayout>
  );
};

export default FundSummary;
