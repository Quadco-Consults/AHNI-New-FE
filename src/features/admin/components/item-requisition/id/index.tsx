"use client";

import FormButton from "@/components/FormButton";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import GoBack from "components/GoBack";
import { LoadingSpinner } from "components/Loading";
import { Separator } from "components/ui/separator";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useGetSingleItemRequisition } from "@/features/admin/controllers/itemRequisitionController";

export default function ItemRequisitionDetailPage() {
  const { id } = useParams();

  const { data: itemRequisition, isLoading } = useGetSingleItemRequisition(
    id || "", { enabled: !!id }
  );

  const requestorName = itemRequisition?.data.created_by.first_name
    ? `${itemRequisition?.data.created_by.first_name} ${itemRequisition?.data.created_by.last_name}`
    : itemRequisition?.data.created_by.email;

  console.log({ itemRequisition });

  const itemsRequested = itemRequisition?.data.consummables
    .map((con) => con?.consummable?.name)
    .join(", ");

  const quantityRequested = itemRequisition?.data.consummables
    .map((item) => item.quantity)
    .reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

  const form = useForm();
  //   return;
  return (
    <div className='space-y-6'>
      <GoBack />
      <Card className='space-y-6'>
        <h4 className='font-semibold text-lg'>Item Requisition Detail</h4>
        <Separator />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          itemRequisition?.data && (
            <div className='grid grid-cols-2 gap-8 mt-6'>
              <DescriptionCard
                label='Requestor Name'
                description={requestorName}
              />

              <DescriptionCard
                label='Department/Unit'
                description={itemRequisition?.data.department.name}
              />

              <DescriptionCard
                label='Date Requested'
                description={format(
                  itemRequisition?.data.created_datetime,
                  "yyyy-dd-MM"
                )}
              />

              <DescriptionCard
                label='Date Treated'
                description={format(
                  itemRequisition?.data.treatment_datetime ?? new Date(),
                  "yyyy-dd-MM"
                )}
              />

              <DescriptionCard
                label='Item Requested'
                description={itemsRequested}
              />
              <DescriptionCard
                label='Quantity Requested'
                description={quantityRequested}
              />
              <DescriptionCard
                label='Status'
                description={itemRequisition?.data.status}
              />

              <DescriptionCard label='Approved by' description='N/A' />
            </div>
          )
        )}

        <FormProvider {...form}>
          <form className='space-y-5'>
            <FormTextArea
              label='Comment'
              name='comment'
              placeholder='Enter Comment'
              required
            />

            <FormButton size='lg' type='submit' className='bg-green-500'>
              Approve
            </FormButton>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
