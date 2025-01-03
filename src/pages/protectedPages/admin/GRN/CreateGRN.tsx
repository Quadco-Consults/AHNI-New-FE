import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import VendorsAPI from "services/procurementApi/vendors";

const CreateGRN = () => {
    const { data: vendors } = VendorsAPI.useGetVendorListQuery({
        params: { no_paginate: true },
    });

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
                            <FormInput name="" label="PO Number" />
                            <FormInput name="" label="Invoice Number" />
                            <FormInput name="" label="Waybill Number" />
                            <FormTextArea name="" label="Remark" />
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
