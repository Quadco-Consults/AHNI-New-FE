import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useAddPartnersMutation,
    useStatesQuery,
    useUpdatePartnersMutation,
} from "services/moduleProjects";
import { TPartners, parternersSchema } from "definations/module-projects";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { nigerianStates } from "lib/index";

const AddPartners = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const result = dialogProps?.data as unknown as TPartners;
    console.log(result);

    const { data } = useStatesQuery({
        no_paginate: false,
    });

    const stateOptions = nigerianStates?.map((state: string) => ({
        label: state,
        value: state,
    }));

    const form = useForm<TPartners>({
        resolver: zodResolver(parternersSchema),
        defaultValues: {
            name: result?.name ?? "",
            address: result?.address ?? "",
            city: result?.city ?? "",
            state: result?.state ?? "",
            phone: result?.phone ?? "",
            email: result?.email ?? "",
            website: result?.website ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [partners, { isLoading }] = useAddPartnersMutation();
    const [updatePartners, { isLoading: updatePartnersLoading }] =
        useUpdatePartnersMutation();

    const onSubmit: SubmitHandler<TPartners> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? updatePartners({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await partners(data).unwrap();
            toast.success("Partner Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <CardContent className="w-100% flex flex-col gap-y-10 p-0">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-white rounded-[2rem] flex flex-col gap-y-10 pb-[2rem]"
                >
                    <div className="grid grid-cols-1">
                        <FormInput label="Name" name="name" required />
                    </div>
                    <div className="grid grid-cols-1">
                        <FormTextArea name="address" label="Address" required />
                    </div>
                    <div className="grid grid-cols-2 gap-x-7">
                        <FormInput label="City" name="city" />
                        <FormSelect
                            label="State"
                            name="state"
                            required
                            options={stateOptions}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-x-7">
                        <FormInput label="phone" name="phone" type="number" />
                        <FormInput label="Email" name="email" type="email" />
                    </div>
                    <div className="grid grid-cols-1">
                        <FormInput label="Website" name="website" />
                    </div>
                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={isLoading || updatePartnersLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddPartners;
