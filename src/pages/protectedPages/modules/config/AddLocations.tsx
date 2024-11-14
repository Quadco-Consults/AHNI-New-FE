import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import FormTextArea from "atoms/FormTextArea";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useAddLocationsMutation,
    useUpdateLocationsMutation,
    useStatesQuery,
} from "services/moduleConfig";
import { TLocations, locationsSchema } from "definations/module-config";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import { nigerianStates } from "lib/index";

const AddLocations = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const result = dialogProps?.data as unknown as TLocations;

    const { data } = useStatesQuery({
        no_paginate: false,
    });

    const stateOptions = nigerianStates?.map((state: string) => ({
        label: state,
        value: state,
    }));

    const form = useForm<TLocations>({
        resolver: zodResolver(locationsSchema),
        defaultValues: {
            name: result?.name ?? "",
            address: result?.address ?? "",
            city: result?.city ?? "",
            state: result?.state ?? "",
            email: result?.email ?? "",
            phone: result?.phone ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [locations, { isLoading }] = useAddLocationsMutation();
    const [updateLocations, { isLoading: updateLocationsLoading }] =
        useUpdateLocationsMutation();

    const onSubmit: SubmitHandler<TLocations> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? updateLocations({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await locations(data).unwrap();
            toast.success("Location Added Succesfully");
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
                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={isLoading || updateLocationsLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddLocations;
