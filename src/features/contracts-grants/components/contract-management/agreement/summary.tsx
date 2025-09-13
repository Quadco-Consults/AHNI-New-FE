"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ServiceLevelAgreementLayout from "./Layout";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import FormButton from "@/components/FormButton";
import BackNavigation from "components/atoms/BackNavigation";
import { CG_ROUTES } from "constants/RouterConstants";
import { toast } from "sonner";
import { useCreateAgreement } from "@/features/contracts-grants/controllers/agreementController";

export default function AgreementSummary() {
    const router = useRouter();
    const [agreementData, setAgreementData] = useState<any>(null);
    const { createAgreement, isLoading } = useCreateAgreement();

    useEffect(() => {
        // Get agreement data from session storage
        const data = sessionStorage.getItem('agreementFormData');
        if (data) {
            setAgreementData(JSON.parse(data));
        } else {
            toast.error("No agreement data found. Please fill the form first.");
            router.push(CG_ROUTES.AGREEMENT);
        }
    }, [router]);

    const handleEdit = () => {
        // Go back to create form to edit
        router.back();
    };

    const handleProceedToUploads = () => {
        // Navigate to uploads page
        router.push(CG_ROUTES.CREATE_AGREEMENT_UPLOADS);
    };

    const handleCreateAgreement = async () => {
        if (!agreementData) return;

        try {
            // Clean the data before sending
            const cleanedData = {
                service: agreementData.service,
                type: agreementData.type,
                start_date: agreementData.start_date,
                end_date: agreementData.end_date,
                contract_cost: agreementData.contract_cost,
                location: agreementData.location,
                // Include the appropriate entity field based on type
                ...(agreementData.consultant_id && { consultant_id: agreementData.consultant_id }),
                ...(agreementData.facilitator_id && { facilitator_id: agreementData.facilitator_id }),
                ...(agreementData.adhoc_staff_id && { adhoc_staff_id: agreementData.adhoc_staff_id }),
                ...(agreementData.vendor_id && { vendor_id: agreementData.vendor_id }),
            };

            await createAgreement(cleanedData);
            
            // Clean up session storage
            sessionStorage.removeItem('agreementFormData');
            
            toast.success("Agreement created successfully!");
            router.push(CG_ROUTES.AGREEMENT);
            
        } catch (error: any) {
            console.error("Agreement creation error:", error);
            toast.error(error?.message || "Failed to create agreement. Please try again.");
        }
    };

    if (!agreementData) {
        return (
            <ServiceLevelAgreementLayout>
                <div className="flex items-center justify-center h-64">
                    <p>Loading agreement details...</p>
                </div>
            </ServiceLevelAgreementLayout>
        );
    }

    const getEntityLabel = () => {
        const { type } = agreementData;
        if (type === "CONSULTANT") return "Consultant";
        if (type === "FACILITATOR") return "Facilitator";
        if (type === "ADHOC_STAFF") return "Adhoc Staff";
        return "Vendor";
    };

    const getEntityValue = () => {
        const { type } = agreementData;
        if (type === "CONSULTANT") return agreementData.consultant_id;
        if (type === "FACILITATOR") return agreementData.facilitator_id;
        if (type === "ADHOC_STAFF") return agreementData.adhoc_staff_id;
        return agreementData.vendor_id;
    };

    return (
        <ServiceLevelAgreementLayout>
            <div className="space-y-6">
                <BackNavigation extraText="Agreement Summary" />
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <h2 className="text-xl font-semibold">Agreement Summary</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Please review the agreement details below before proceeding.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Service</label>
                                        <p className="mt-1 text-sm text-gray-900">{agreementData.service}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Agreement Type</label>
                                        <p className="mt-1 text-sm text-gray-900">{agreementData.type}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">{getEntityLabel()}</label>
                                        <p className="mt-1 text-sm text-gray-900">{getEntityValue() || "Not selected"}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Start Date</label>
                                        <p className="mt-1 text-sm text-gray-900">{agreementData.start_date}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">End Date</label>
                                        <p className="mt-1 text-sm text-gray-900">{agreementData.end_date}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Contract Cost</label>
                                        <p className="mt-1 text-sm text-gray-900">₦{Number(agreementData.contract_cost).toLocaleString()}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Location</label>
                                        <p className="mt-1 text-sm text-gray-900">{agreementData.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                                    <div className="flex gap-3">
                                        <Button 
                                            variant="outline" 
                                            onClick={handleEdit}
                                            type="button"
                                        >
                                            Edit Details
                                        </Button>
                                        
                                        <Button 
                                            variant="outline" 
                                            onClick={handleProceedToUploads}
                                            type="button"
                                        >
                                            Add Documents
                                        </Button>
                                    </div>

                                    <FormButton 
                                        onClick={handleCreateAgreement}
                                        loading={isLoading}
                                        type="button"
                                        size="lg"
                                    >
                                        Create Agreement
                                    </FormButton>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ServiceLevelAgreementLayout>
    );
}