import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Form } from "components/ui/form";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import VendorsAPI from "services/procurementApi/vendors";

const CreateGRN = () => {
  const { data: vendors } = VendorsAPI.useGetVendorListQuery({
    params: { no_paginate: true },
  });

  const vendorData = useMemo(() => {
    return vendors?.map((item) => ({
      label: item.company_name,
      value: item.id,
    }));
  }, [vendors]);

  const form = useForm();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-x-5">
        <GoBack />
        <h4 className="text-xl font-bold">Good Receive Note</h4>
      </div>
      <Card>
        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormSelect name="vendor" label="Vendor" options={vendorData} />
              <FormInput name="" label="PO Number" />
              <FormInput name="" label="Quantity Ordered" />
              <FormInput name="" label="Quantity Received" />
              <FormInput name="" label="Invoice Number" />
              <FormInput name="" label="Waybill Number" />
              <FormTextArea name="" label="Remark" />
              <FormTextArea name="" label="Description" />
              <FormInput name="" label="Procurement Officer" />
              <FormInput name="" label="Requestor" />
              <FormInput name="" label="Inventory Officer" />
              <FormInput name="" label="Goods received by (store)" />
            </div>
            <div className="flex justify-end">
              <FormButton>Submit</FormButton>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateGRN;
