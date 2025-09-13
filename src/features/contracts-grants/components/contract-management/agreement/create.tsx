"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import BackNavigation from "components/atoms/BackNavigation";
import FormSelect from "components/atoms/FormSelect";
import { Card, CardContent } from "components/ui/card";
import FormButton from "@/components/FormButton";
import {
    AgreementSchema,
    TAgreementFormData,
} from "@/features/contracts-grants/types/contract-management/agreement";
import { toast } from "sonner";
import { Button } from "components/ui/button";
import {
    useCreateAgreement,
    useGetSingleAgreement,
    useModifyAgreement,
} from "@/features/contracts-grants/controllers/agreementController";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"; 
import { CG_ROUTES } from "constants/RouterConstants";
import { useEffect, useMemo, useState } from "react";
import ServiceLevelAgreementLayout from "./Layout";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const agreementTypeOptions = [
    { label: "Consultant", value: "CONSULTANT", category: "Staff Contracts" },
    { label: "Facilitator", value: "FACILITATOR", category: "Staff Contracts" },
    { label: "Adhoc Staff", value: "ADHOC_STAFF", category: "Staff Contracts" },
    { label: "SLA", value: "SLA", category: "Service Agreements" },
    { label: "Security", value: "SECURITY", category: "Service Agreements" },
    { label: "Insurance", value: "INSURANCE", category: "Service Agreements" },
    { label: "Lease", value: "LEASE", category: "Service Agreements" },
    { label: "HMO", value: "HMO", category: "Service Agreements" },
    { label: "Ticketing", value: "TICKETING", category: "Service Agreements" },
];

export default function CreateAgreement() {
    const form = useForm<TAgreementFormData>({
        resolver: zodResolver(AgreementSchema),
        defaultValues: {
            service: "",
            type: "",
            start_date: "",
            end_date: "",
            contract_cost: "",
            location: "",
            consultant_id: "",
            facilitator_id: "",
            adhoc_staff_id: "",
            vendor_id: "",
        },
    });

    // State for conditional dropdowns
    const [selectedAgreementType, setSelectedAgreementType] = useState("");
    const [entityOptions, setEntityOptions] = useState<Array<{label: string, value: string}>>([]);
    const [isLoadingEntities, setIsLoadingEntities] = useState(false);

    // Functions to fetch entity options based on agreement type
    const fetchConsultants = async () => {
        setIsLoadingEntities(true);
        try {
            const response = await AxiosWithToken.get('/contract-grants/agreements/consultants_dropdown/');
            // Ensure the response is an array and properly formatted
            const data = Array.isArray(response.data) ? response.data : [];
            setEntityOptions(data.map((item: any) => ({
                label: item.name || item.label || item.title || item.id,
                value: item.id || item.value
            })));
        } catch (error) {
            console.error('Failed to fetch consultants:', error);
            setEntityOptions([]);
        } finally {
            setIsLoadingEntities(false);
        }
    };

    const fetchFacilitators = async () => {
        setIsLoadingEntities(true);
        try {
            const response = await AxiosWithToken.get('/contract-grants/agreements/facilitators_dropdown/');
            // Ensure the response is an array and properly formatted
            const data = Array.isArray(response.data) ? response.data : [];
            setEntityOptions(data.map((item: any) => ({
                label: item.name || item.label || item.title || item.id,
                value: item.id || item.value
            })));
        } catch (error) {
            console.error('Failed to fetch facilitators:', error);
            setEntityOptions([]);
        } finally {
            setIsLoadingEntities(false);
        }
    };

    const fetchAdhocStaff = async () => {
        setIsLoadingEntities(true);
        try {
            const response = await AxiosWithToken.get('/contract-grants/agreements/adhoc_staff_dropdown/');
            // Ensure the response is an array and properly formatted
            const data = Array.isArray(response.data) ? response.data : [];
            setEntityOptions(data.map((item: any) => ({
                label: item.name || item.label || item.title || item.id,
                value: item.id || item.value
            })));
        } catch (error) {
            console.error('Failed to fetch adhoc staff:', error);
            setEntityOptions([]);
        } finally {
            setIsLoadingEntities(false);
        }
    };

    const fetchVendors = async () => {
        setIsLoadingEntities(true);
        try {
            const response = await AxiosWithToken.get('/contract-grants/agreements/vendors_dropdown/');
            // Ensure the response is an array and properly formatted
            const data = Array.isArray(response.data) ? response.data : [];
            setEntityOptions(data.map((item: any) => ({
                label: item.name || item.label || item.title || item.company_name || item.id,
                value: item.id || item.value
            })));
        } catch (error) {
            console.error('Failed to fetch vendors:', error);
            setEntityOptions([]);
        } finally {
            setIsLoadingEntities(false);
        }
    };

    // Watch for agreement type changes
    const agreementType = form.watch('type');

    useEffect(() => {
        if (agreementType) {
            console.log('Agreement type changed to:', agreementType);
            setSelectedAgreementType(agreementType);
            
            // Clear previous entity selections
            form.setValue('consultant_id', '');
            form.setValue('facilitator_id', '');
            form.setValue('adhoc_staff_id', '');
            form.setValue('vendor_id', '');

            // Load appropriate dropdown based on type
            switch(agreementType) {
                case 'CONSULTANT':
                    fetchConsultants();
                    break;
                case 'FACILITATOR':
                    fetchFacilitators();
                    break;
                case 'ADHOC_STAFF':
                    fetchAdhocStaff();
                    break;
                case 'SLA':
                case 'SECURITY':
                case 'INSURANCE':
                case 'LEASE':
                case 'HMO':
                case 'TICKETING':
                    fetchVendors();
                    break;
                default:
                    setEntityOptions([]);
                    break;
            }
        }
    }, [agreementType]);

    const searchParams = useSearchParams();
    const id = searchParams?.get("id") || null;

    const router = useRouter();

    const { data: location } = useGetAllLocations({
        page: 1,
        size: 2000000,
    });

    const locationOptions = useMemo(
        () =>
            location?.data?.results?.map(({ name, id }) => ({
                label: name,
                value: id,
            })) || [],
        [location]
    );

    const { createAgreement, isLoading: isCreateLoading } =
        useCreateAgreement();

    const { updateAgreement, isLoading: isModifyLoading } =
        useModifyAgreement(id || "");

    const onSubmit: SubmitHandler<TAgreementFormData> = async (data) => {
        try {
            // Validate that the appropriate entity is selected based on agreement type
            const { type } = data;
            let entitySelected = false;
            
            if (type === "CONSULTANT" && data.consultant_id) entitySelected = true;
            if (type === "FACILITATOR" && data.facilitator_id) entitySelected = true;
            if (type === "ADHOC_STAFF" && data.adhoc_staff_id) entitySelected = true;
            if (["SLA", "SECURITY", "INSURANCE", "LEASE", "HMO", "TICKETING"].includes(type) && data.vendor_id) entitySelected = true;
            
            if (!entitySelected) {
                const entityType = type === "CONSULTANT" ? "Consultant" : 
                                 type === "FACILITATOR" ? "Facilitator" : 
                                 type === "ADHOC_STAFF" ? "Adhoc Staff" : "Vendor";
                toast.error(`Please select a ${entityType} for this agreement type.`);
                return;
            }

            if (id) {
                await updateAgreement(data);
                toast.success("Agreement Updated");
                router.push(CG_ROUTES.AGREEMENT);
            } else {
                // Store agreement data in session storage for the summary step
                sessionStorage.setItem('agreementFormData', JSON.stringify(data));
                toast.success("Agreement details saved. Please review the summary.");
                router.push(CG_ROUTES.CREATE_AGREEMENT_DETAILS);
            }
        } catch (error: any) {
            toast.error(error?.message ?? "Something went wrong");
        }
    };

    const { data } = useGetSingleAgreement(id || "", !!id);

    useEffect(() => {
        if (data) {
            form.reset(data.data);
            // Set the selected agreement type when editing
            setSelectedAgreementType(data.data.type);
        }
    }, [data]);

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
                                    <FormInput
                                        label="Service"
                                        name="service"
                                        placeholder="Enter Service Description"
                                        required
                                    />

                                    <FormSelect
                                        label="Agreement Type"
                                        name="type"
                                        placeholder="Select Agreement Type"
                                        options={agreementTypeOptions || []}
                                        required
                                    />

                                    {/* Conditional Entity Dropdown */}
                                    {selectedAgreementType && (
                                        <FormSelect
                                            label={
                                                selectedAgreementType === 'CONSULTANT' ? 'Consultant' :
                                                selectedAgreementType === 'FACILITATOR' ? 'Facilitator' :
                                                selectedAgreementType === 'ADHOC_STAFF' ? 'Adhoc Staff' :
                                                'Vendor'
                                            }
                                            name={
                                                selectedAgreementType === 'CONSULTANT' ? 'consultant_id' :
                                                selectedAgreementType === 'FACILITATOR' ? 'facilitator_id' :
                                                selectedAgreementType === 'ADHOC_STAFF' ? 'adhoc_staff_id' :
                                                'vendor_id'
                                            }
                                            placeholder={`Select ${
                                                selectedAgreementType === 'CONSULTANT' ? 'Consultant' :
                                                selectedAgreementType === 'FACILITATOR' ? 'Facilitator' :
                                                selectedAgreementType === 'ADHOC_STAFF' ? 'Adhoc Staff' :
                                                'Vendor'
                                            }`}
                                            options={entityOptions || []}
                                            required
                                            disabled={isLoadingEntities}
                                        />
                                    )}

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
                                        options={locationOptions || []}
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
