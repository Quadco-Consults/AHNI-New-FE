import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import FormInput from "atoms/FormInput";
import BackNavigation from "atoms/BackNavigation";
import FormSelect from "atoms/FormSelect";
import { Card, CardContent } from "components/ui/card";
import FormButton from "atoms/FormButton";
import {
    AgreementSchema,
    TAgreementFormData,
} from "definations/c&g/contract-management/agreement";
import { toast } from "sonner";
import { Button } from "components/ui/button";
import {
    useCreateAgreementMutation,
    useGetSingleAgreementQuery,
    useModifyAgreementMutation,
} from "services/c&g/contract-management/agreement";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CG_ROUTES } from "constants/RouterConstants";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect } from "react";

const agreementTypeOptions = [
    { label: "LEASE", value: "LEASE" },
    { label: "SLA", value: "SLA" },
    { label: "HMO", value: "HMO" },
    { label: "SECURITY", value: "SECURITY" },
    { label: "INSURANCE", value: "INSURANCE" },
    { label: "TICKETING", value: "TICKETING" },
];

export default function CreateAgreement() {
    const form = useForm<TAgreementFormData>({
        resolver: zodResolver(AgreementSchema),
        defaultValues: {
            provider: "",
            service: "",
            type: "",
            start_date: "",
            end_date: "",
        },
    });

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const navigate = useNavigate();

    const [createAgreement, { isLoading: isCreateLoading }] =
        useCreateAgreementMutation();

    const [modifyAgreement, { isLoading: isModifyLoading }] =
        useModifyAgreementMutation();

    const onSubmit: SubmitHandler<TAgreementFormData> = async (data) => {
        try {
            if (id) {
                await modifyAgreement({ id, body: data }).unwrap();
                toast.success("Agreement Updated");
            } else {
                await createAgreement(data).unwrap();
                toast.success("Agreement Created");
            }

            navigate(CG_ROUTES.AGREEMENT);
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    const { data } = useGetSingleAgreementQuery(id ?? skipToken);

    useEffect(() => {
        if (data) {
            form.reset(data.data);
        }
    }, []);

    return (
        <div className="space-y-6">
            <BackNavigation extraText="New Agreement" />
            <Card>
                <CardContent className="p-5">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-2 gap-8">
                                <FormInput
                                    label="Provider"
                                    name="provider"
                                    placeholder="Enter Provider"
                                    required
                                />

                                <FormInput
                                    name="service"
                                    label="Service"
                                    placeholder="Enter Service"
                                    required
                                />

                                <FormSelect
                                    label="Type"
                                    name="type"
                                    placeholder="Select Type"
                                    options={agreementTypeOptions}
                                    required
                                />

                                <FormInput
                                    type="date"
                                    label="Start Date"
                                    name="start_date"
                                    required
                                />
                                <FormInput
                                    type="date"
                                    label="End Date"
                                    name="end_date"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                >
                                    Cancel
                                </Button>
                                <FormButton
                                    type="submit"
                                    size="lg"
                                    loading={isCreateLoading || isModifyLoading}
                                >
                                    Submit
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
