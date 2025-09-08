"use client";

import { useEffect, useMemo } from "react";
import RfqLayout from "./RfqLayout";
import FormInput from "components/atoms/FormInput";
import FormSelect from "components/atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Form } from "components/ui/form";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import FormButton from "@/components/FormButton";
import { useRouter, useSearchParams } from "next/navigation";
import { RouteEnum } from "constants/RouterConstants";
import { z } from "zod";
import { MinusCircle } from "lucide-react";
import { Label } from "components/ui/label";
import { LoadingSpinner } from "components/Loading";
// import PurchaseRequestAPI from "@/features/procurementApi/purchase-requestController";
import { toast } from "sonner";
import {
  useGetAllItems,
  useGetAllLots,
  useGetAllSolicitationEvaluationCriteria,
} from "@/features/modules/controllers";
import {
  useCreateSolicitation,
  useGetPurchaseRequest,
} from "@/features/procurement/controllers";

const ItemSchema = z.object({
  solicitation_evaluations: z.array(
    z.object({
      criteria: z.string().min(1, "Please select a category"),
    })
  ),
  solicitation_items: z.array(
    z.object({
      item: z.string().min(1, "Please select an item"),
      lot: z.string().optional(),
      quantity: z.string().min(1, "Please enter quantity"),
    })
  ),
});

const Items = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eoiType = searchParams.get('type');
  // const formData = JSON.parse(localStorage.getItem("rfqQuotation") as any);

  const form = useForm<z.infer<typeof ItemSchema>>({
    defaultValues: {},
  });

  const { setValue, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "solicitation_items",
  });

  const {
    fields: criteriaFields,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({
    control: form.control,
    name: "solicitation_evaluations",
  });

  const { data: item } = useGetAllItems({
    page: 1,
    size: 2000000,
    category__job_category: "SERVICE",
  });

  const itemOptions = useMemo(
    () =>
      item?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [item]
  );

  const { data: lot, isLoading: isLotLoading } = useGetAllLots({
    page: 1,
    size: 2000000,
  });

  const lotOptions = useMemo(
    () =>
      lot?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [lot]
  );

  const { data: solicitationCriteria } =
    useGetAllSolicitationEvaluationCriteria({
      page: 1,
      size: 2000000,
    });

  const solicitationCriteriaOptions = useMemo(
    () =>
      solicitationCriteria?.data.results.map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    [solicitationCriteria]
  );

  const { createSolicitation, isLoading: isCreateLoading } =
    useCreateSolicitation();

  const quotationData = JSON.parse(
    sessionStorage.getItem("rfqQuotationFormData") || "{}"
  );

  const { data } = useGetPurchaseRequest(
    quotationData?.purchase_request as string
  );
  console.log({ data, quotationData });

  const itemsData = useMemo(() => {
    // @ts-ignore
    return data?.data?.items.map((item: any) => ({
      item: item?.item || "",
      fco: item?.fco || "",
      quantity: item?.quantity || 0,
      unit_cost: item?.unit_cost || 0,
      description: item?.item?.name || "",
      uom: item?.item?.uom === null ? "" : item?.item?.uom,
      total: item?.sub_total_amount || 0,
      name: item?.item_detail?.name,
    }));
  }, [data]);

  useEffect(() => {
    if (itemsData?.length > 0) {
      setValue("solicitation_items", itemsData);
    }
  }, [itemsData, setValue]);

  const onSubmit: SubmitHandler<z.infer<typeof ItemSchema>> = async (data) => {
    const payload = { ...quotationData, ...data };

    try {
      const response = await createSolicitation(payload);
      sessionStorage.removeItem("rfqQuotationFormData");

      // router.push(RouteEnum.RFQ_CREATE_CBA);
      // router.push(
      //   generatePath(RouteEnum.RFQ_CREATE_CBA, {
      //     id: response?.data?.id,
      //   })
      // );

      console.log(response);

      if (response?.status === "success") {
        sessionStorage.removeItem("rfqQuotationFormData");
        console.log({ I_AM_HERE: "djhjsk" });
        
        // Skip CBA creation for EOI-linked RFQs (OPEN_TENDER type)
        console.log("EOI Type check:", { eoiType, isOpenTender: eoiType === "OPEN_TENDER" });
        
        if (eoiType === "OPEN_TENDER") {
          console.log("Skipping CBA creation for OPEN_TENDER EOI");
          toast.success("RFQ created successfully! CBA will be created after vendor submissions.");
          router.push("/dashboard/procurement/solicitation-management/rfq");
        } else {
          console.log("Proceeding with regular CBA creation");
          // Regular RFQ flow - proceed to CBA creation
          router.push(
            RouteEnum.RFQ_CREATE_CBA.replace(":id", (response?.data as any)?.id as string)
          );
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
    }
  };

  return (
    <RfqLayout>
      <Form {...form}>
        <form className='space-y-8 p-5' onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-5'>
            <h6 className='text-yellow-600'>Items</h6>

            {fields?.map((field, index) => (
              <div key={index} className='flex items-center gap-5 w-full'>
                <div className='grid grid-cols-1 gap-4 w-full md:grid-cols-3'>
                  {!itemsData || itemsData?.length < index + 1 ? (
                    <FormSelect
                      name={`solicitation_items.${index}.item`}
                      label='Item'
                      required
                      options={itemOptions}
                      value={form.watch(`solicitation_items.${index}.item`)}
                      // disabled={true}
                    />
                  ) : (
                    <FormInput
                      name={`solicitation_items.${index}.name`}
                      label='Item'
                      required
                      disabled
                    />
                  )}

                  <FormInput
                    name={`solicitation_items.${index}.quantity`}
                    label='Quantity'
                    required
                  />

                  <FormSelect
                    name={`solicitation_items.${index}.lot`}
                    label='Lot'
                  >
                    <SelectContent>
                      {isLotLoading && <LoadingSpinner />}
                      {lotOptions?.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FormSelect>
                </div>

                <div className='flex items-center h-full '>
                  <MinusCircle
                    onClick={() => remove(index)}
                    className='cursor-pointer text-primary'
                  />
                </div>
              </div>
            ))}
            <div className='flex justify-end'>
              <Button
                type='button'
                className='text-primary bg-[#FFF2F2] mt-2 flex gap-2 items-center justify-center'
                onClick={() =>
                  append({
                    quantity: "",
                    item: "",
                    lot: "",
                  })
                }
              >
                <AddSquareIcon />
                Add
              </Button>
            </div>
          </div>

          <div className='space-y-5'>
            <Label className='text-yellow-600'>Evaluation Criteria</Label>

            {criteriaFields.map((field, index) => (
              <div key={index} className='flex items-center gap-5 w-full'>
                <div className='grid grid-cols-1 gap-4 w-full md:grid-cols-3'>
                  <FormSelect
                    label='Category'
                    name={`solicitation_evaluations.${index}.criteria`}
                    required
                    options={solicitationCriteriaOptions}
                  />
                </div>

                <div className='flex items-center h-full '>
                  <MinusCircle
                    onClick={() => removeCriteria(index)}
                    className='cursor-pointer text-primary'
                  />
                </div>
              </div>
            ))}

            <div className='flex justify-end'>
              <Button
                type='button'
                className='text-primary bg-[#FFF2F2] mt-2 flex gap-2 items-center justify-center'
                onClick={() =>
                  appendCriteria({
                    criteria: "",
                  })
                }
              >
                <AddSquareIcon />
                Add
              </Button>
            </div>
          </div>

          <div className='flex justify-between mt-16'>
            <Button
              onClick={() => router.back()}
              type='button'
              className='bg-[#FFF2F2] text-primary dark:text-gray-500'
            >
              Cancel
            </Button>
            {/* <Link href={{ pathname: RouteEnum.RFQ_CREATE_CBA }}> */}
            <FormButton
              loading={isCreateLoading}
              disabled={isCreateLoading}
              type='submit'
            >
              Save Changes
            </FormButton>
            {/* </Link> */}
          </div>
        </form>
      </Form>
    </RfqLayout>
  );
};

export default Items;
