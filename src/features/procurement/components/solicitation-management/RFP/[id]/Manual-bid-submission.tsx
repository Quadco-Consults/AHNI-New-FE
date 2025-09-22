"use client";

/* eslint-disable react/prop-types */

import { useNavigate, useParams } from "react-router-dom"; 
import { SelectContent, SelectItem } from "components/ui/select";
import { Form } from "components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import FormSelect from "components/atoms/FormSelectField";
import { LoadingSpinner } from "components/Loading";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import FormInput from "components/atoms/FormInput";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { SolicitationSubmissionSchema } from "definations/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useCreateSolicitationSubmission } from "@/features/procurement/controllers/vendor-bid-submissionsController";
import { useGetSingleSolicitation } from "@/features/procurement/controllers/solicitationController";
import { useGetAllSolicitationEvaluationCriteria } from "@/features/modules/controllers/procurement/solicitation-evaluation-criteriaController";

import GoBack from "components/GoBack";

const ManualBidSubmission = () => {
  const { id } = useParams();
  const solicitationId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();

  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendorList({
      params: { status: "Approved" },
    });

  const { createSolicitationSubmission, isLoading: isCreateLoading } =
    useCreateSolicitationSubmission();

  const { data: singleSolicitation } = useGetSingleSolicitation(
    solicitationId as string
  );

  const { data: solicitationCriteria } =
    useGetAllSolicitationEvaluationCriteria({
      page: 1,
      size: 2000000,
    });

  //   const [
  //     createSolicitationBidMutation,
  //     { isLoading: solicitationBidIsLoading },
  //   ] = SolicitationAPI.useCreateSolicitationBid();

  const form = useForm<z.infer<typeof SolicitationSubmissionSchema>>({
    resolver: zodResolver(SolicitationSubmissionSchema),
    defaultValues: {
      solicitation: id,
      vendor: "",
      bid_items: [],
    },
  });

  const { control, handleSubmit, setValue, watch } = form;

  const { fields } = useFieldArray({
    control,
    name: "bid_items",
  });

  const { fields: responseField } = useFieldArray({
    control,
    name: "evaluations",
  });

  // const data = [];
  const data = useMemo(() => {
    return singleSolicitation?.data?.solicitation_items?.map((data) => ({
      solicitation_item: data?.id,
      quantity: data?.quantity || 0,
      name: data?.item_detail?.name,
      unit_price: "",
    }));
  }, [singleSolicitation]);

  const dataVal = useMemo(() => {
    return solicitationCriteria?.data?.results?.map((data) => ({
      response: "",
      evaluation_criteria: data?.id,
    }));
  }, [solicitationCriteria]);

  useEffect(() => {
    if (data) {
      setValue("bid_items", data);
    }
  }, [data, setValue, singleSolicitation]);

  useEffect(() => {
    if (dataVal) {
      setValue("evaluations", dataVal);
    }
  }, [dataVal, setValue]);

  const itemsWatchData = watch("bid_items");

  const onSubmit = async (
    data: z.infer<typeof SolicitationSubmissionSchema>
  ) => {
    try {
      // @ts-ignore
      await createSolicitationSubmission(data)();

      toast.success("Successfully created.");
      router.back();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className='space-y-10'>
      <GoBack />
      <div>
        <h4 className='text-lg font-bold'>Manual Bid Submission Form</h4>
        <h6>{singleSolicitation?.data?.title}</h6>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
          <FormSelect name='vendor' label='Vendor' required>
            <SelectContent>
              {vendorsIsLoading && <LoadingSpinner />}
              {/* @ts-ignore */}
              {vendors?.data?.results?.map((vendor: VendorsResultsData) => (
                <SelectItem key={vendor?.id} value={String(vendor?.id)}>
                  {vendor?.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </FormSelect>

          <div className='space-y-1'>
            <h4 className='text-base font-bold'>Items Quotation</h4>
            <h6>Please provide your quotation for the following Items</h6>
          </div>

          <div>
            <table className='w-full border mt-10'>
              <thead>
                <tr className='text-amber-500 whitespace-nowrap border-b-2 text-sm font-semibold'>
                  <th className='px-2 py-5 w-[50px]'>S/N</th>
                  <th className='px-2 py-5 w-[300px]'>Items Description</th>
                  <th className='px-2 py-5 w-[150px]'>Qty</th>
                  <th className='px-2 py-5 w-[150px]'> Unit price</th>
                  <th className='px-2 py-5 w-[150px]'>Total</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  console.log({
                    field,
                    quantity: Number(itemsWatchData[index]?.quantity),
                    unit: Number(itemsWatchData[index]?.unit_price),
                    itemsWatchData,
                  });

                  return (
                    <tr key={index} className='w-full'>
                      <td className='w-[50px] p-2 text-center '>
                        <span className='p-2 px-4 text-xs bg-black text-white rounded'>
                          {index + 1}.
                        </span>
                      </td>
                      <td className=' p-2 text-center w-[400px]'>
                        <div className='space-y-2'>
                          <h2 className='font-semibold'>
                            {/* {singleSolicitation?.data.items[index]?.item?.name} */}
                            {/* @ts-ignore */}
                            {field?.name}
                          </h2>
                          {/* @ts-ignore */}
                          <h6>{field?.description} </h6>
                        </div>
                      </td>
                      <td className='w-[100px] flex items-center p-2 text-center mx-auto'>
                        <FormInput
                          label=''
                          name={`bid_items.[${index}].quantity`}
                          type='number'
                          className='w-full'
                        />
                      </td>
                      <td className='w-[100px] p-2 text-center mx-auto'>
                        <FormInput
                          label=''
                          type='number'
                          name={`bid_items.[${index}].unit_price`}
                          className='w-full'
                        />
                      </td>

                      <td className='w-[100px] p-2 text-center'>
                        <h6>
                          ₦
                          {Number(
                            Number(itemsWatchData[index]?.quantity) *
                              Number(itemsWatchData[index]?.unit_price)
                          ).toLocaleString()}
                        </h6>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className=''>
              {/* Calculate total */}
              <div className='flex items-center justify-center w-fit gap-20 px-5 py-3 border rounded-lg border-primary text-primary ml-auto mt-6'>
                <h4>Total:</h4>
                <span>
                  ₦
                  {itemsWatchData
                    .reduce((acc, item) => {
                      const quantity = Number(item?.quantity) || 0;
                      const unitPrice = Number(item?.unit_price) || 0;
                      return acc + quantity * unitPrice;
                    }, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-5'>
            {responseField.map((field, index) => {
              return (
                <tr key={index} className='w-full'>
                  <FormInput
                    label={solicitationCriteria?.data.results[index]?.name}
                    name={`evaluations.[${index}].response`}
                    className='w-full'
                  />
                </tr>
              );
            })}
          </div>

          <div className='flex justify-end'>
            <FormButton
              loading={isCreateLoading}
              disabled={isCreateLoading}
              type='submit'
            >
              Submit
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ManualBidSubmission;
