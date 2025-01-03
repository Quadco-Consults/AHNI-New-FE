import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Form } from "components/ui/form";
import {
    GoodReceiveNoteSchema,
    TGoodReceiveNoteFormValues,
} from "definations/admin/inventory-management/good-receive-note";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateGoodReceiveNoteMutation } from "services/admin/inventory-management/good-receive-note";
import { toast } from "sonner";

export default function CreateGoodReceiveNote() {
    const form = useForm<TGoodReceiveNoteFormValues>({
        resolver: zodResolver(GoodReceiveNoteSchema),
        defaultValues: {
            purchase_order: "",
            invoice_number: "",
            waybill_number: "",
            remark: "",
        },
    });

    const [createGoodReceiveNote, { isLoading: isCreateLoading }] =
        useCreateGoodReceiveNoteMutation();

    const onSubmit: SubmitHandler<TGoodReceiveNoteFormValues> = async (
        data
    ) => {
        try {
            await createGoodReceiveNote(data).unwrap();
            toast.success("Goods Received Note Created");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-x-5">
                <GoBack />
                <h4 className="text-xl font-bold">Goods Receive Note</h4>
            </div>
            <Card>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormSelect
                            label="Purchase Order"
                            name="purchase_order"
                            placeholder="Select Purchase Order"
                            required
                            options={[]}
                        />

                        <FormInput
                            label="Invoice Number"
                            name="invoice_number"
                            placeholder="Enter Invoice Number"
                            required
                        />

                        <FormInput
                            label="Waybill Number"
                            name="waybill_number"
                            placeholder="Enter Waybill Number"
                            required
                        />

                        <FormTextArea
                            label="Remark"
                            name="remark"
                            placeholder="Enter Remark"
                            required
                        />
                        <div className="flex justify-end">
                            <FormButton loading={isCreateLoading}>
                                Submit
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
