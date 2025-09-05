"use client";

import { Form } from "components/ui/form";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "components/atoms/FormInput";
import { Separator } from "components/ui/separator";
import { ArrowLeft, ArrowRight, MinusCircle, PlusCircle } from "lucide-react";
import { Label } from "components/ui/label";
import FormButton from "@/components/FormButton";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { VendorsQuestionnaireSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { vendorsActions } from "store/formData/procurement-vendors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/index";
import QuestionairAPI from "@/features/procurement/controllers/questionnaireController";
import React, { useState, useEffect } from "react";
import useQuery from "hooks/useQuery";
import { LoadingSpinner } from "components/Loading";
import { QuestionairData } from "definations/procurement-types/questionairs";
import { Input } from "components/ui/input";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import { toast } from "sonner";
import { Button } from "components/ui/button";

type FormData = {
  [key: string]: string;
};

const Questionier = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [showSubmit, setShowSubmit] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const query = useQuery();
  const vendorId = query.get("id");

  const { data: vendor, isLoading: vendorLoading } =
    VendorsAPI.useGetVendor(vendorId);

  const {
    createVendor: createVendorMutation,
    isLoading: createVendorMutationLoading,
  } = VendorsAPI.useCreateVendor();

  const {
    updateVendor: updateVendorMutation,
    isLoading: updateVendorMutationLoading,
  } = VendorsAPI.useUpdateVendor(vendorId || "");

  const vendorsData = useSelector((state: RootState) => state.vendors.vendors);
  const mergedObject = vendorsData.reduce((acc: any, obj: any) => {
    return { ...acc, ...obj };
  }, {});

  const { data, isLoading } = QuestionairAPI.useGetQuestionairs({
    params: { no_paginate: true },
  });

  const result = data?.data?.results?.map((questionair: QuestionairData) => ({
    questionaire: questionair.id,
    response: formData[questionair.id] || "",
  }));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const form = useForm<z.infer<typeof VendorsQuestionnaireSchema>>({
    resolver: zodResolver(VendorsQuestionnaireSchema),
    defaultValues: {
      key_clients: [{ name: "", address: "", phone_number: "" }],
    },
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "key_clients",
  });

  useEffect(() => {
    if (vendorId && vendor?.data && !vendorLoading) {
      // Auto-populate key clients form
      form.reset({
        key_clients: vendor?.data?.key_client || [
          { name: "", address: "", phone_number: "" },
        ],
      });

      // Auto-populate questionnaire responses
      if (vendor?.data?.questionairs) {
        const questionnaireResponses: FormData = {};
        vendor.data.questionairs.forEach((q: any) => {
          if (q.questionaire && q.response) {
            questionnaireResponses[q.questionaire] = q.response;
          }
        });
        setFormData(questionnaireResponses);
      }
    }
  }, [vendorId, vendor, vendorLoading, form]);

  const onSubmit = (data: z.infer<typeof VendorsQuestionnaireSchema>) => {
    const values = {
      questionairs: result,
      key_clients: data.key_clients,
    };

    dispatch(vendorsActions.addVendors(values));

    setShowSubmit(true);
  };

  const submitHandler = async () => {
    const finalData = {
      associated_entities: mergedObject?.associated_entities,
      bank_address: mergedObject?.bank_address,
      bank_name: mergedObject?.bank_name,
      branches: mergedObject?.branches,
      brief_of_quality_control: mergedObject?.brief_of_quality_control,
      brief_of_sampling: mergedObject?.brief_of_sampling,
      company_address: mergedObject?.company_address,
      company_chairman: mergedObject?.company_chairman,
      company_name: mergedObject?.company_name,
      company_registration_number: mergedObject?.company_registration_number,
      email: mergedObject?.email,
      installed_capacity: mergedObject?.installed_capacity,
      key_staff: mergedObject?.key_staff,
      lagest_capacity_and_utilization:
        mergedObject?.lagest_capacity_and_utilization,
      nature_of_business: mergedObject?.nature_of_business,
      number_of_operational_work_shift: Number(
        mergedObject?.number_of_operational_work_shift
      ),
      number_of_permanent_staff: Number(
        mergedObject?.number_of_permanent_staff
      ),
      phone_numbers: mergedObject?.phone_numbers,
      production_equipments: mergedObject?.production_equipments,
      key_client: mergedObject?.key_clients,
      questionnaires: mergedObject?.questionairs,
      share_holders: mergedObject?.share_holders,
      submitted_categories: mergedObject?.submitted_categories,
      approved_categories: mergedObject?.submitted_categories, // Include approved_categories to trigger pending status
      tin: mergedObject?.tin,
      type_of_business: mergedObject?.type_of_business,
      website: mergedObject?.website,
      year_or_incorperation: mergedObject?.year_or_incorperation,
      state: mergedObject?.state,
    };

    try {
      let res: any;

      if (vendorId) {
        // Update existing vendor
        res = await updateVendorMutation(finalData);
        toast.success("Successfully updated.");
      } else {
        // Create new vendor
        res = await createVendorMutation(finalData);
        toast.success("Successfully created.");
        if (typeof window !== "undefined") {
          localStorage.setItem("vendorID", res?.data?.id);
        }
      }

      const currentPath = window.location.pathname;
      const path = currentPath.substring(0, currentPath.lastIndexOf("/"));
      router.push(`${path}/attestation?id=${vendorId || res?.data?.id}`);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <VendorRegistationLayout>
      <div>
        <h2 className='text-lg font-bold'>Questionnaire</h2>
        <div className='mt-8'>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                data?.data?.results.map(
                  (questionier: QuestionairData, index: number) => (
                    <div key={questionier.id} className='flex gap-4'>
                      <h6>{index + 1}</h6>
                      <div className='w-full'>
                        <h2>{questionier.name}</h2>
                        <Input
                          className='w-full'
                          id={questionier.id}
                          value={formData[questionier.id] || ""}
                          type='text'
                          name={questionier.id}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )
                )
              )}

              <div className='space-y-8 '>
                <Separator />
                <div>
                  <Label className='text-red-500'>
                    . Name and address of key client who we can contact for
                    references (if any)
                  </Label>
                  <div>
                    {fields.map((field, index) => {
                      const label = String.fromCharCode(
                        "a".charCodeAt(0) + index
                      );
                      return (
                        <div
                          className='flex items-center justify-between gap-x-3 '
                          key={index}
                        >
                          <div className='relative w-[97%] grid grid-cols-3 pl-8 mt-4 gap-x-4 '>
                            <p className='absolute top-0 left-0 font-semibold '>
                              ({label})
                            </p>
                            <FormInput
                              label='Name of Vendor '
                              name={`key_clients.[${index}].name`}
                              defaultValue={field.name}
                              required
                            />
                            <FormInput
                              label='Address of Vendor '
                              name={`key_clients.[${index}].address`}
                              defaultValue={field.address}
                              required
                            />
                            <FormInput
                              label='Active Mobile Number'
                              name={`key_clients.[${index}].phone_number`}
                              defaultValue={field.phone_number}
                              required
                            />
                          </div>
                          <div className='flex items-center h-full '>
                            <MinusCircle
                              onClick={() => remove(index)}
                              className='cursor-pointer text-primary'
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className='flex justify-end mt-2'>
                      <PlusCircle
                        onClick={() =>
                          append({
                            name: "",
                            address: "",
                            phone_number: "",
                          })
                        }
                        className='cursor-pointer text-primary'
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-between pt-10'>
                <FormButton
                  onClick={() => router.back()}
                  preffix={<ArrowLeft size={14} />}
                  type='button'
                  className='bg-[#FFF2F2] text-primary dark:text-gray-500'
                >
                  Back
                </FormButton>
                <Button type='submit' disabled={showSubmit}>
                  Submit
                </Button>
                {showSubmit && (
                  <FormButton
                    type='button'
                    onClick={submitHandler}
                    loading={
                      createVendorMutationLoading || updateVendorMutationLoading
                    }
                    disabled={
                      createVendorMutationLoading || updateVendorMutationLoading
                    }
                    suffix={<ArrowRight size={14} />}
                  >
                    {vendorId ? "Update & Proceed" : "Proceed"}
                  </FormButton>
                )}{" "}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </VendorRegistationLayout>
  );
};

export default Questionier;
