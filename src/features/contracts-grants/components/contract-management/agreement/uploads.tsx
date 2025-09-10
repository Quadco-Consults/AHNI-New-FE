import ServiceLevelAgreementLayout from "./Layout";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import FormButton from "@/components/FormButton";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useCreateAgreement } from "@/features/contracts-grants/controllers/agreementController";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CG_ROUTES } from "constants/RouterConstants";

export default function ServiceLevelAgreementUploads() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [tempDocuments, setTempDocuments] = useState([]);

    const { createAgreement } = useCreateAgreement();

    // Load temp documents from session storage
    useEffect(() => {
        const tempDocs = JSON.parse(sessionStorage.getItem('tempAgreementDocuments') || '[]');
        setTempDocuments(tempDocs);
    }, []);

    const onSubmit = async () => {
        setIsLoading(true);
        
        try {
            // Get agreement form data from session storage
            const agreementData = JSON.parse(sessionStorage.getItem('agreementFormData') || '{}');
            
            if (!agreementData.service || !agreementData.type) {
                toast.error("Agreement data not found. Please go back and fill the form.");
                return;
            }

            // Create the agreement first
            console.log("Creating agreement with data:", agreementData);
            
            // Remove any fields that might cause issues
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
            
            console.log("Cleaned data being sent:", cleanedData);
            await createAgreement(cleanedData);

            // Clean up session storage
            sessionStorage.removeItem('agreementFormData');
            sessionStorage.removeItem('tempAgreementDocuments');
            
            toast.success("Agreement created successfully!");
            router.push(CG_ROUTES.AGREEMENT);
            
        } catch (error: any) {
            console.error("Agreement creation error:", error);
            toast.error(error?.message || "Failed to create agreement. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ServiceLevelAgreementLayout>
            <div className="space-y-3">
                <h1 className="text-xl font-bold">Document Uploads</h1>

                <Button
                    className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white"
                    type="button"
                    onClick={() => {
                        dispatch(
                            openDialog({
                                type: DialogType.DOCUMENT_UPLOADS,
                                dialogProps: {
                                    header: "Service Level Document Upload",
                                },
                            })
                        );
                    }}
                >
                    <AddSquareIcon />
                    Upload Document
                </Button>

                {/* Display uploaded documents */}
                <div className="relative w-full min-h-24">
                    {tempDocuments.length > 0 ? (
                        <div className="space-y-2">
                            <h3 className="font-semibold">Documents ready for upload:</h3>
                            {tempDocuments.map((doc: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                    <div>
                                        <p className="font-medium">{doc.title}</p>
                                        <p className="text-sm text-gray-600">{doc.description}</p>
                                        <p className="text-xs text-gray-500">{doc.file?.name}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const updatedDocs = tempDocuments.filter((_, i) => i !== index);
                                            setTempDocuments(updatedDocs);
                                            sessionStorage.setItem('tempAgreementDocuments', JSON.stringify(updatedDocs));
                                            toast.success("Document removed");
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            <p>No documents uploaded yet.</p>
                            <p className="text-sm">Click "Upload Document" to add files.</p>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center justify-end gap-x-4">
                    <Button variant="outline" type="button" size="lg" onClick={() => router.back()}>
                        Back
                    </Button>

                    <FormButton 
                        type="button"
                        size="lg" 
                        loading={isLoading}
                        onClick={onSubmit}
                    >
                        Finish
                    </FormButton>
                </div>
            </div>
        </ServiceLevelAgreementLayout>
    );
}
