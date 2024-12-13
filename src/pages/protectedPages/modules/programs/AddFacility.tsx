import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import FormSelect from "atoms/FormSelect";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { nigerianStates } from "lib/index";
import {
    FacilitySchema,
    TFacilityData,
    TFacilityFormValues,
} from "definations/modules/program/facility";
import {
    useAddFacilityMutation,
    useUpdateFacilityMutation,
} from "services/modules/program/facility";

const AddFacility = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const result = dialogProps?.data as unknown as TFacilityData;

    const stateOptions = nigerianStates?.map((state: string) => ({
        label: state,
        value: state,
    }));

    const form = useForm<TFacilityFormValues>({
        resolver: zodResolver(FacilitySchema),
        defaultValues: {
            name: result?.name ?? "",
            phone: result?.phone ?? "",
            postion: result?.postion ?? "",
            contact_person: result?.contact_person ?? "",
            email: result?.email ?? "",
            state: result?.state ?? "",
            lga: result?.lga ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [facilities, { isLoading }] = useAddFacilityMutation();
    const [updateFacilities, { isLoading: updateFacilityLoading }] =
        useUpdateFacilityMutation();

    const onSubmit: SubmitHandler<TFacilityFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateFacilities({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await facilities(data).unwrap();
            toast.success("Facility Added Succesfully");
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
                    action=""
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="bg-white rounded-[2rem] flex flex-col gap-y-10"
                >
                    <div className="grid grid-cols-1">
                        <FormInput
                            label="Facility Name"
                            name="name"
                            required
                            placeholder="Enter Facility Name"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-x-7">
                        <FormInput
                            label="Phone Number"
                            name="phone"
                            required
                            placeholder="Enter Phone Number"
                        />
                        <FormInput
                            label="Email"
                            name="email"
                            required
                            placeholder="Enter Email"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-x-7">
                        <FormInput
                            label="Contact Person"
                            name="contact_person"
                            placeholder="Enter Contact Person"
                            required
                        />
                        <FormInput
                            label="Position"
                            name="postion"
                            required
                            placeholder="Enter Position"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-x-7">
                        <FormSelect
                            label="State"
                            name="state"
                            required
                            options={stateOptions}
                            placeholder="Select State"
                        />
                        <FormInput
                            label="LGA"
                            name="lga"
                            required
                            placeholder="Enter LGA"
                        />
                    </div>

                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={isLoading || updateFacilityLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddFacility;
