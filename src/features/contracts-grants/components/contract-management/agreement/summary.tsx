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

// Helper to get current user ID
const getCurrentUserId = () => {
    try {
        if (typeof window !== 'undefined') {
            // The correct key is 'user' based on the debug logs
            const userData = localStorage.getItem('user');

            if (userData) {
                const user = JSON.parse(userData);
                return user?.id || null;
            }
        }
    } catch (error) {
        console.error('Error getting current user:', error);
    }
    return null;
};

export default function AgreementSummary() {
    const router = useRouter();
    const [agreementData, setAgreementData] = useState<any>(null);
    const { createAgreement, isLoading } = useCreateAgreement();

    useEffect(() => {
        // Get agreement data from session storage
        const data = sessionStorage.getItem('agreementFormData');
        if (data) {
            const parsedData = JSON.parse(data);
            console.log('📦 Session Storage Data:', parsedData);
            console.log('🔍 Entity Fields Check:', {
                type: parsedData.type,
                consultant: parsedData.consultant,
                facilitator: parsedData.facilitator,
                adhoc_staff: parsedData.adhoc_staff,
                vendor: parsedData.vendor,
            });
            setAgreementData(parsedData);
        } else {
            toast.error("No agreement data found. Please fill the form first.");
            router.push(CG_ROUTES.AGREEMENT);
        }
    }, [router]);

    const handleEdit = () => {
        // Go back to create form to edit
        router.back();
    };

    const handleCreateAgreement = async () => {
        if (!agreementData) return;

        try {
            // Get current user ID at the time of submission
            const currentUserId = getCurrentUserId();
            console.log('👤 Current User ID:', currentUserId);

            if (!currentUserId) {
                toast.error('User session not found. Please log in again.');
                return;
            }

            // Build base payload with required fields
            const cleanedData: any = {
                service: agreementData.service,
                type: agreementData.type,
                start_date: agreementData.start_date,
                end_date: agreementData.end_date,
                contract_cost: agreementData.contract_cost,
                location: agreementData.location,
                created_by: currentUserId,
                updated_by: currentUserId,
            };

            // Only include the entity field that matches the agreement type
            // Don't send null values for other entity fields
            if (agreementData.type === 'CONSULTANT' && agreementData.consultant) {
                cleanedData.consultant = agreementData.consultant;
            } else if (agreementData.type === 'FACILITATOR' && agreementData.facilitator) {
                cleanedData.facilitator = agreementData.facilitator;
            } else if (agreementData.type === 'ADHOC_STAFF' && agreementData.adhoc_staff) {
                cleanedData.adhoc_staff = agreementData.adhoc_staff;
            } else if (['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(agreementData.type) && agreementData.vendor) {
                cleanedData.vendor = agreementData.vendor;
            }

            console.log('📤 Sending Agreement Data to API:', cleanedData);
            console.log('📋 Entity fields included:', {
                consultant: cleanedData.consultant || 'not included',
                facilitator: cleanedData.facilitator || 'not included',
                adhoc_staff: cleanedData.adhoc_staff || 'not included',
                vendor: cleanedData.vendor || 'not included',
            });

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
        // agreementData from sessionStorage has fields without _id suffix
        if (type === "CONSULTANT") return agreementData.consultant;
        if (type === "FACILITATOR") return agreementData.facilitator;
        if (type === "ADHOC_STAFF") return agreementData.adhoc_staff;
        return agreementData.vendor;
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
                                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={handleEdit}
                                        type="button"
                                        size="lg"
                                    >
                                        Edit Details
                                    </Button>

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