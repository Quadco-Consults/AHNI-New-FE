import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import {
    LotSchema,
    TLotData,
    TLotFormValues,
} from "definations/modules/procurement/lot";
import {
    useAddLotMutation,
    useUpdateLotMutation,
} from "services/modules/procurement/lot";

const AddLots = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TLotData;
    const form = useForm<TLotFormValues>({
        resolver: zodResolver(LotSchema),
        defaultValues: {
            name: data?.name ?? "",
            // @ts-ignore
            packet_number: data?.packet_number ?? "",
        },
    });

    const [lots, { isLoading }] = useAddLotMutation();
    const [updateLots, { isLoading: updateLotsLoading }] =
        useUpdateLotMutation();

    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<TLotFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateLots({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await lots(data).unwrap();
            toast.success("Lots Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };
    return (
        <CardContent>
            <Form {...form}>
                <form
                    action=""
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-y-7"
                >
                    <FormInput
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                        required
                    />

                    <FormInput
                        label="Packet Number"
                        name="packet_number"
                        placeholder="Enter Packet Number"
                        required
                    />
                    <div className="flex justify-start gap-4">
                        <FormButton loading={isLoading || updateLotsLoading}>
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddLots;
