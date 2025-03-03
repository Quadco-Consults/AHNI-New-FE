import { useMemo } from "react";
import RfqLayout from "./RfqLayout";
import { Form } from "components/ui/form";
import FormSelect from "atoms/FormSelectField";
import { SelectContent, SelectItem } from "components/ui/select";
import FormInput from "atoms/FormInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/button";
import FormButton from "atoms/FormButton";
import { LoadingSpinner } from "components/shared/Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import PurchaseRequestAPI from "services/procurementApi/purchase-request";
import {
  SolicitationQuotationSchema,
  TSolicitationQuotationFormData,
} from "definations/procurement-validator";
import FormTextArea from "atoms/FormTextArea";

const Quotation = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } =
    PurchaseRequestAPI.useGetPurchaseRequestsQuery({});

  const purchaseRequestOptions = useMemo(
    () =>
      purchaseRequest?.data.results.map(({ ref_number, id }) => ({
        label: ref_number,
        value: id,
      })),
    [purchaseRequest]
  );

  const form = useForm<TSolicitationQuotationFormData>({
    resolver: zodResolver(SolicitationQuotationSchema),
    defaultValues: {
      title: "",
      rfq_id: "",
      background: "",
      request_type: "",
      tender_type: "",
      purchase_request: "",
      procurement_type: "",
    },
  });

  const onSubmit: SubmitHandler<TSolicitationQuotationFormData> = (data) => {
    sessionStorage.setItem("rfqQuotationFormData", JSON.stringify(data));
    let path = pathname;

    // Remove the last segment of the path
    path = path.substring(0, path.lastIndexOf("/"));

    // Append the new segment to the path
    path += "/items";
    navigate(path);
  };

  console.log(form.formState.errors);

  return (
    <RfqLayout>
      <div className='p-5'>
        <h4 className='font-semibold text-lg'>
          Initiate New Request for Quotation
        </h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5 mt-10'
          >
            <div className='grid grid-cols-2 gap-5'>
              <FormInput name='title' label='RFQ Title' required />

              <FormInput name='rfq_id' label='RFQ ID' required />
            </div>

            <FormTextArea name='background' label='Background' required />

            <FormSelect name='tender_type' label='Tender Type'>
              <SelectContent>
                {[
                  "CLOSED SOURCE",
                  "OPENED SOURCE",
                  "LIMITED SOLICITATION",
                  "NATIONAL OPEN TENDER",
                ].map((value: string, index: number) => (
                  <SelectItem key={index} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </FormSelect>

            <div className='grid grid-cols-2 gap-6'>
              <FormSelect name='request_type' label='Request type'>
                <SelectContent>
                  {[
                    "REQUEST FOR QUOTATION",
                    "REQUEST FOR PROPOSAL",
                    "INVITATION TO TENDER",
                  ].map((value: string, index: number) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>

              <FormSelect name='purchase_request' label='Purchase Request'>
                <SelectContent>
                  {isPurchaseRequestLoading && <LoadingSpinner />}

                  {purchaseRequestOptions?.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </FormSelect>
            </div>

            <FormInput
              label='Procurement Type'
              name='procurement_type'
              required
            />
            <div className='flex justify-between mt-16'>
              <Button
                onClick={() => navigate(-1)}
                type='button'
                className='bg-[#FFF2F2] text-primary dark:text-gray-500'
              >
                Cancel
              </Button>
              <FormButton type='submit'>Next</FormButton>
            </div>
          </form>
        </Form>
      </div>
    </RfqLayout>
  );
};

export default Quotation;
