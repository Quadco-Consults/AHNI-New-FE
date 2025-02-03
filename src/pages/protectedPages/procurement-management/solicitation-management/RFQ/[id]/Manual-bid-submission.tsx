/* eslint-disable react/prop-types */
import { Button } from "components/ui/button";
// import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { SelectContent, SelectItem } from "components/ui/select";
import { Form } from "components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import VendorsAPI from "services/procurementApi/vendors";
import FormSelect from "atoms/FormSelectField";
import { LoadingSpinner } from "components/shared/Loading";
import { VendorsResultsData } from "definations/procurement-types/vendors";
import FormInput from "atoms/FormInput";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { SolicitationSubmissionSchema } from "definations/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { useCreateSolicitationSubmissionMutation } from "services/procurementApi/vendor-bid-submissions";
import { useGetSingleSolicitationQuery } from "services/procurementApi/solicitation";
import { useGetAllSolicitationEvaluationCriteriaQuery } from "services/modules/procurement/solicitation-evaluation-criteria";

const ManualBidSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

<<<<<<< HEAD
    const { data: vendors, isLoading: vendorsIsLoading } =
        VendorsAPI.useGetVendorListQuery({
            params: { no_paginate: true },
        });

    // @ts-ignore
    const { data: items, isLoading } = SolicitationAPI.useGetSolicitationQuery({
        path: { id: id as string },
    });

    const [
        createSolicitationBidMutation,
        { isLoading: solicitationBidIsLoading },
        // @ts-ignore
    ] = SolicitationAPI.useCreateSolicitationBidMutation();
=======
  const { data: vendors, isLoading: vendorsIsLoading } =
    VendorsAPI.useGetVendorListQuery({
      params: { no_paginate: true },
    });

  const [createSolicitationSubmission, { isLoading: isCreateLoading }] =
    useCreateSolicitationSubmissionMutation();
>>>>>>> 70ec8705b5c229311fae28085fd091e77570fa56

  const { data: singleSolicitation } = useGetSingleSolicitationQuery(
    id as string
  );

  const { data: solicitationCriteria } =
    useGetAllSolicitationEvaluationCriteriaQuery({
      page: 1,
      size: 2000000,
    });

  //   const [
  //     createSolicitationBidMutation,
  //     { isLoading: solicitationBidIsLoading },
  //   ] = SolicitationAPI.useCreateSolicitationBidMutation();

  const form = useForm<z.infer<typeof SolicitationSubmissionSchema>>({
    resolver: zodResolver(SolicitationSubmissionSchema),
    defaultValues: {
      solicitation_id: id,
      vendor_id: "",
      items: [],
    },
  });

  const { control, handleSubmit, setValue, watch } = form;

<<<<<<< HEAD
    const data = useMemo(() => {
        // @ts-ignore
        return items?.items?.map((data) => ({
            solicitation_item: data?.id,
            quantity: data?.quantity || 0,
            unit_price: "",
        }));
    }, [items]);

    const dataVal = useMemo(() => {
        // @ts-ignore
        return items?.criteria?.map((data) => ({
            response: "",
            solicitation_criteria: data?.solicitation_criteria,
        }));
    }, [items]);
=======
  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const { fields: responseField } = useFieldArray({
    control,
    name: "responses",
  });
>>>>>>> 70ec8705b5c229311fae28085fd091e77570fa56

  const data = useMemo(() => {
    return singleSolicitation?.data.items.map((data) => ({
      solicitation_item: data?.id,
      quantity: data?.quantity || 0,
      unit_price: "",
    }));
  }, [singleSolicitation]);

  const dataVal = useMemo(() => {
    return solicitationCriteria?.data.results?.map((data) => ({
      response: "",
      solicitation_criteria: data?.id,
    }));
  }, [solicitationCriteria]);

  useEffect(() => {
    if (data) {
      setValue("items", data);
    }
  }, [data, setValue, singleSolicitation]);

  useEffect(() => {
    if (dataVal) {
      setValue("responses", dataVal);
    }
  }, [dataVal, setValue]);

  const itemsWatchData = watch("items");

  const onSubmit = async (
    data: z.infer<typeof SolicitationSubmissionSchema>
  ) => {
    try {
      // @ts-ignore
      await createSolicitationSubmission(data).unwrap();

      toast.success("Successfully created.");
      //   navigate(RouteEnum.RFQ);
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className='space-y-10'>
      <Button
        onClick={() => navigate(-1)}
        variant='outline'
        className='gap-2 text-primary border-primary'
      >
        <ArrowLeft size={15} />
      </Button>

      <div>
        <h4 className='text-lg font-bold'>Manual Bid Submission Form</h4>
        <h6>{singleSolicitation?.data?.title}</h6>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-10'>
          <FormSelect name='vendor_id' label='Vendor' required>
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
                  <th className='px-2 py-5'>S/N</th>
                  <th className='px-2 py-5'>Items Description</th>
                  <th className='px-2 py-5'>Qty</th>
                  <th className='px-2 py-5'> Unit price</th>
                  <th className='px-2 py-5'>Total</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  return (
                    <tr key={index} className='w-full'>
                      <td className='w-fit p-2 text-center '>
                        <span className='p-2 px-4 text-xs bg-black text-white rounded'>
                          {index + 1}.
                        </span>
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <div className='space-y-2'>
                          <h2 className='font-semibold'>
                            {singleSolicitation?.data.items[index]?.item?.name}
                          </h2>
                          <h6>
                            {
                              singleSolicitation?.data.items[index]?.item
                                ?.description
                            }
                          </h6>
                        </div>
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormInput
                          label=''
                          name={`items.[${index}].quantity`}
                          type='number'
                          className='w-24'
                        />
                      </td>
                      <td className='w-fit p-2 text-center'>
                        <FormInput
                          label=''
                          type='number'
                          name={`items.[${index}].unit_price`}
                          className='w-24'
                        />
                      </td>
                      <td className='w-fit p-2 text-center'>
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
              <div className='flex items-center justify-center w-1/6 gap-20 px-5 py-3 border rounded-lg border-primary text-primary ml-auto mt-6'>
                <h4>Total:</h4>
                <h4>₦0.00</h4>
              </div>
            </div>
          </div>

          {/* <div className='grid grid-cols-3 gap-5'>
            {solicitationCriteria?.data.results?.map((s, index) => {
              const formatToSnakeCase = (str) => {
                return str
                  ?.toLowerCase() // Convert to lowercase
                  ?.replace(/[^a-z0-9\s]/g, "") // Remove special characters
                  ?.replace(/\s+/g, "_"); // Replace spaces with underscores
              };

              const formattedString = formatToSnakeCase(s.name);

              return (
                <div className='' key={index}>
                  <FormInput
                    label={s?.name}
                    name={formattedString}
                    type='text'
                  />
                </div>
              );
            })}
          </div> */}

          <div className='grid grid-cols-3 gap-5'>
            {responseField.map((field, index) => {
              return (
                <tr key={index} className='w-full'>
                  <FormInput
                    label={solicitationCriteria?.data.results[index]?.name}
                    name={`responses.[${index}].response`}
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
