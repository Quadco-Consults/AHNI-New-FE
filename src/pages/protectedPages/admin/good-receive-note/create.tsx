import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import GoBack from "components/shared/GoBack";
import { Form } from "components/ui/form";
import { AdminRoutes } from "constants/RouterConstants";
import {
    GoodReceiveNoteSchema,
    TGoodReceiveNoteFormValues,
} from "definations/admin/inventory-management/good-receive-note";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    useCreateGoodReceiveNoteMutation,
    useGetSingleGoodReceiveNoteQuery,
    useModifyGoodReceiveNoteMutation,
} from "services/admin/inventory-management/good-receive-note";
import { useGetAllPurchaseOrdersQuery } from "services/procurementApi/purchase-order";
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

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    console.log({ id });

    const { data: purchaseOrder } = useGetAllPurchaseOrdersQuery({
        page: 1,
        size: 2000000,
    });

    const purchaseOrderOptions = useMemo(
        () =>
            purchaseOrder?.data.results.map(
                ({ purchase_order_number, id }) => ({
                    label: purchase_order_number,
                    value: id,
                })
            ),
        [purchaseOrder]
    );

    const [createGoodReceiveNote, { isLoading: isCreateLoading }] =
        useCreateGoodReceiveNoteMutation();

    const [modifyGoodReceiveNote, { isLoading: isModifyLoading }] =
        useModifyGoodReceiveNoteMutation();

    const onSubmit: SubmitHandler<TGoodReceiveNoteFormValues> = async (
        data
    ) => {
        try {
            if (id) {
                await modifyGoodReceiveNote({ id, body: data }).unwrap();
                toast.success("Good Received Note Updated");
            } else {
                await createGoodReceiveNote(data).unwrap();
                toast.success("Good Received Note Created");
            }

            navigate(AdminRoutes.GRN);

            toast.success("Good Received Note Created");
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const { data: goodNote } = useGetSingleGoodReceiveNoteQuery(
        id ?? skipToken
    );

    useEffect(() => {
        if (goodNote) {
            form.reset({
                purchase_order: goodNote.data.purchase_order.id,
                invoice_number: goodNote.data.invoice_number,
                waybill_number: goodNote.data.waybill_number,
                remark: goodNote.data.remark,
            });
        }
    }, [goodNote, purchaseOrder]);

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
                            options={purchaseOrderOptions}
                        />

                        <FormInput
                            label="Invoice Number"
                            name="invoice_number"
                            type="number"
                            placeholder="Enter Invoice Number"
                            required
                        />

                        <FormInput
                            label="Waybill Number"
                            name="waybill_number"
                            type="number"
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
                            <FormButton
                                size="lg"
                                loading={isCreateLoading || isModifyLoading}
                            >
                                Submit
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
