import ServiceLevelAgreementLayout from "./Layout";
import { Button } from "@/components/ui/button";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import FormButton from "@/components/FormButton";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import { useCreateAgreement, useUploadContractDocument } from "@/features/contracts-grants/controllers/agreementController";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CG_ROUTES } from "@/constants/RouterConstants";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export default function ServiceLevelAgreementUploads() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [tempDocuments, setTempDocuments] = useState([]);

    const { createAgreement, data: createData, isSuccess: createSuccess } = useCreateAgreement();

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

            // Build base payload
            const cleanedData: any = {
                service: agreementData.service,
                type: agreementData.type,
                start_date: agreementData.start_date,
                end_date: agreementData.end_date,
                contract_cost: agreementData.contract_cost,
                location: agreementData.location,
            };

            // Only include the entity field that matches the agreement type
            // sessionStorage has fields WITHOUT _id suffix (consultant, facilitator, etc.)
            if (agreementData.type === 'CONSULTANT' && agreementData.consultant) {
                cleanedData.consultant = agreementData.consultant;
            } else if (agreementData.type === 'FACILITATOR' && agreementData.facilitator) {
                cleanedData.facilitator = agreementData.facilitator;
            } else if (agreementData.type === 'ADHOC_STAFF' && agreementData.adhoc_staff) {
                cleanedData.adhoc_staff = agreementData.adhoc_staff;
            } else if (['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(agreementData.type) && agreementData.vendor) {
                cleanedData.vendor = agreementData.vendor;
            }

            console.log("Cleaned data being sent:", cleanedData);
            console.log("Entity field check:", {
                type: agreementData.type,
                consultant: agreementData.consultant || 'not set',
                facilitator: agreementData.facilitator || 'not set',
                adhoc_staff: agreementData.adhoc_staff || 'not set',
                vendor: agreementData.vendor || 'not set',
            });
            await createAgreement(cleanedData);

            // Wait a bit for the create mutation to complete
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the created agreement ID from the response
            const createdAgreementId = createData?.data?.id;

            if (!createdAgreementId) {
                console.error("Agreement ID not found in response:", createData);
                toast.error("Agreement created but ID not found. Please refresh and upload documents manually.");
                // Still redirect to let user see the agreement was created
                sessionStorage.removeItem('agreementFormData');
                sessionStorage.removeItem('tempAgreementDocuments');
                router.push(CG_ROUTES.AGREEMENT);
                return;
            }

            console.log("Agreement created with ID:", createdAgreementId);

            // Upload documents if any
            if (tempDocuments.length > 0) {
                toast.info(`Uploading ${tempDocuments.length} document(s)...`);

                for (const doc of tempDocuments) {
                    try {
                        const formData = new FormData();
                        formData.append('file', doc.file);
                        formData.append('title', doc.title || doc.file.name);
                        formData.append('document_type', doc.document_type || 'CONTRACT');
                        formData.append('is_active', 'true');  // Explicitly set is_active to true
                        if (doc.description) {
                            formData.append('description', doc.description);
                        }

                        // Upload document
                        await AxiosWithToken.post(
                            `/contract-grants/agreements/${createdAgreementId}/documents/`,
                            formData
                        );

                        console.log(`Document "${doc.title}" uploaded successfully`);
                    } catch (docError) {
                        console.error(`Failed to upload document "${doc.title}":`, docError);
                        toast.error(`Failed to upload document: ${doc.title}`);
                    }
                }

                toast.success(`Agreement created with ${tempDocuments.length} document(s)!`);
            } else {
                toast.success("Agreement created successfully!");
            }

            // Clean up session storage
            sessionStorage.removeItem('agreementFormData');
            sessionStorage.removeItem('tempAgreementDocuments');

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
                
                <div className="flex items-center justify-between gap-x-4">
                    <Button variant="outline" type="button" size="lg" onClick={() => router.back()}>
                        Back
                    </Button>

                    <div className="flex gap-x-4">
                        <Button
                            variant="outline"
                            type="button"
                            size="lg"
                            disabled={isLoading}
                            onClick={onSubmit}
                        >
                            Skip Documents
                        </Button>

                        <FormButton
                            type="button"
                            size="lg"
                            loading={isLoading}
                            onClick={onSubmit}
                        >
                            {tempDocuments.length > 0 ? `Create with ${tempDocuments.length} Document(s)` : 'Create Agreement'}
                        </FormButton>
                    </div>
                </div>
            </div>
        </ServiceLevelAgreementLayout>
    );
}
