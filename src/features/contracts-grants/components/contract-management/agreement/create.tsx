import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import BackNavigation from "components/atoms/BackNavigation";
import FormSelect from "components/atoms/FormSelect";
import { Card, CardContent } from "components/ui/card";
import FormButton from "components/atoms/FormButton";
import {
    AgreementSchema,
    TAgreementFormData,
} from "definations/c&g/contract-management/agreement";
import { toast } from "sonner";
import { Button } from "components/ui/button";
import {
    useCreateAgreement,
    useGetSingleAgreement,
    useModifyAgreement,
} from "@/features/contracts-grants/controllers/agreementController";
import { useNavigate, useSearchParams } 
import { CG_ROUTES } from "constants/RouterConstants";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo } from "react";
import ServiceLevelAgreementLayout from "./Layout";
import VendorsAPI from "@/features/procurement/controllers/vendorsController";
import { useGetAllLocations } from "@/features/modules/controllers/config/location";

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
            type: "",
            start_date: "",
            end_date: "",
        },
    });

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const router = useRouter();

    const { data: vendor } = VendorsAPI.useGetVendors({
        page: 1,
        size: 2000000,
    });

    const vendorOptions = useMemo(
        () =>
            vendor?.data.results.map(({ company_name, id }) => ({
                label: company_name,
                value: id,
            })),
        [vendor]
    );

    const { data: location } = useGetAllLocations({
        page: 1,
        size: 2000000,
    });

    const locationOptions = useMemo(
        () =>
            location?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [location]
    );

    const { createAgreement, isLoading: isCreateLoading } =
        useCreateAgreement();

    const { modifyAgreement, isLoading: isModifyLoading } =
        useModifyAgreement();

    const onSubmit: SubmitHandler<TAgreementFormData> = async (data) => {
        // try {
        //     if (id) {
        //         await modifyAgreement({ id, body: data })();
        //         toast.success("Agreement Updated");
        //     } else {
        //         await createAgreement(data)();
        //         toast.success("Agreement Created");
        //     }

        //     router.push(CG_ROUTES.AGREEMENT);
        // } catch (error: any) {
        //     toast.error(error.data.message ?? "Something went wrong");
        // }

        router.push(CG_ROUTES.CREATE_AGREEMENT_UPLOADS);
    };

    const { data } = useGetSingleAgreement(id ?? skipToken);

    useEffect(() => {
        if (data) {
            form.reset(data.data);
        }
    }, []);

    return (
        <ServiceLevelAgreementLayout>
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
                                    <FormSelect
                                        label="Provider"
                                        name="provider"
                                        placeholder="Select Provider"
                                        required
                                        options={vendorOptions}
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

                                    <FormInput
                                        type="number"
                                        label="Contract Cost"
                                        name="contract_cost"
                                        placeholder="Enter Contract Cost"
                                        required
                                    />

                                    <FormSelect
                                        label="Location"
                                        name="location"
                                        placeholder="Select Location"
                                        required
                                        options={locationOptions}
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
                                        loading={
                                            isCreateLoading || isModifyLoading
                                        }
                                    >
                                        Next
                                    </FormButton>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </ServiceLevelAgreementLayout>
    );
}
