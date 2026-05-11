"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/atoms/FormInput";
import BackNavigation from "@/components/atoms/BackNavigation";
import FormSelect from "@/components/atoms/FormSelect";
import { Card, CardContent } from "@/components/ui/card";
import FormButton from "@/components/FormButton";
import {
    AgreementSchema,
    TAgreementFormData,
} from "@/features/contracts-grants/types/contract-management/agreement";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    useCreateAgreement,
    useGetSingleAgreement,
    useUpdateAgreement,
    useUploadContractDocument,
} from "@/features/contracts-grants/controllers/agreementController";
import { useRouter, useSearchParams } from "next/navigation";
import { CG_ROUTES } from "@/constants/RouterConstants";
import { useEffect, useState, useMemo } from "react";
import ServiceLevelAgreementLayout from "./Layout";
import { Upload, X, FileText } from "lucide-react";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllJobCategories } from "@/features/modules/controllers/config/jobCategoryController";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import { useGetVendors } from "@/features/procurement/controllers/vendorController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const agreementTypeOptions = [
    { label: "Consultant", value: "CONSULTANT" },
    { label: "Facilitator", value: "FACILITATOR" },
    { label: "Adhoc Staff", value: "ADHOC_STAFF" },
    { label: "SLA", value: "SLA" },
    { label: "Security", value: "SECURITY" },
    { label: "Insurance", value: "INSURANCE" },
    { label: "Lease", value: "LEASE" },
    { label: "HMO", value: "HMO" },
    { label: "Ticketing", value: "TICKETING" },
];

interface DocumentFile {
    file: File;
    title: string;
    description: string;
}

export default function CreateAgreementSimple() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const agreementId = searchParams?.get("id");
    const isEditMode = !!agreementId;

    const [documents, setDocuments] = useState<DocumentFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<TAgreementFormData>({
        resolver: zodResolver(AgreementSchema),
        defaultValues: {
            type: "",
            start_date: "",
            end_date: "",
            location: "",
        },
    });

    const { createAgreement, isLoading: isCreating } = useCreateAgreement();
    const { updateAgreement, isLoading: isUpdating } = useUpdateAgreement(agreementId || "");
    const { data: agreementData, isLoading: isLoadingAgreement } = useGetSingleAgreement(
        agreementId || "",
        isEditMode
    );

    // Fetch locations for dropdown
    const { data: location } = useGetAllLocations({
        page: 1,
        size: 2000000,
    });

    // Fetch vendors for dropdown
    const { data: vendorsData, isLoading: isLoadingVendors } = useGetVendors({
        page: 1,
        size: 1000,
        status: 'Approved',
        enabled: true,
    });

    // Create vendor options
    const vendors = useMemo(() => {
        console.log('🔍 Vendors Data:', vendorsData);
        console.log('🔍 Vendors Results:', vendorsData?.data?.results);

        const vendorList = vendorsData?.data?.results?.map((vendor: any) => ({
            label: vendor.company_name || vendor.name,
            value: vendor.id,
        })) || [];

        console.log('🔍 Vendor Options:', vendorList);
        return vendorList;
    }, [vendorsData]);

    // Fetch job categories for SLA service types
    const { data: jobCategories } = useGetAllJobCategories({
        enabled: true,
    });

    // Fetch categories (services)
    const { data: categories } = useGetAllCategories({
        page: 1,
        size: 1000,
        enabled: true,
    });

    // State for selected job category
    const [selectedJobCategory, setSelectedJobCategory] = useState<string>("");

    // State for entity options (consultants, facilitators, adhoc staff)
    const [entityOptions, setEntityOptions] = useState<Array<{label: string, value: string}>>([]);
    const [isLoadingEntities, setIsLoadingEntities] = useState(false);

    // Watch for agreement type and service type changes
    const agreementType = form.watch("type");
    const serviceType = form.watch("service_type");
    const isServiceAgreement = ["SLA", "SECURITY", "INSURANCE", "LEASE", "HMO", "TICKETING"].includes(agreementType);

    // Fetch entity options when agreement type changes
    useEffect(() => {
        const fetchEntities = async () => {
            if (!agreementType) {
                setEntityOptions([]);
                return;
            }

            setIsLoadingEntities(true);
            try {
                let endpoint = '';
                let response;

                if (agreementType === 'CONSULTANT') {
                    // Fetch from consultant dropdown endpoint
                    response = await AxiosWithToken.get('/contract-grants/agreements/consultants_dropdown/');
                    console.log('🔍 Consultant Response:', response.data);
                    // Handle both direct array and wrapped response formats
                    const rawData = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.results || []);
                    const consultantList = rawData.map((item: any) => ({
                        label: item.label || item.name,
                        value: item.value || item.id,
                    }));
                    setEntityOptions(consultantList);
                } else if (agreementType === 'FACILITATOR') {
                    // Fetch from facilitator dropdown endpoint
                    response = await AxiosWithToken.get('/contract-grants/agreements/facilitators_dropdown/');
                    console.log('🔍 Facilitator Response:', response.data);
                    const rawData = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.results || []);
                    const facilitatorList = rawData.map((item: any) => ({
                        label: item.label || item.name,
                        value: item.value || item.id,
                    }));
                    setEntityOptions(facilitatorList);
                } else if (agreementType === 'ADHOC_STAFF') {
                    // Fetch from adhoc dropdown endpoint
                    response = await AxiosWithToken.get('/contract-grants/agreements/adhoc_staff_dropdown/');
                    console.log('🔍 Adhoc Staff Response:', response.data);
                    const rawData = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.results || []);
                    const adhocList = rawData.map((item: any) => ({
                        label: item.label || item.name,
                        value: item.value || item.id,
                    }));
                    setEntityOptions(adhocList);
                } else {
                    // For service agreements, no entity options needed (they use vendors)
                    setEntityOptions([]);
                }
            } catch (error) {
                console.error('Error fetching entities:', error);
                setEntityOptions([]);
            } finally {
                setIsLoadingEntities(false);
            }
        };

        fetchEntities();
    }, [agreementType]);

    // Create location options
    const locationOptions = useMemo(
        () =>
            location?.data?.results?.map(({ name, id }) => ({
                label: name,
                value: id,
            })) || [],
        [location]
    );

    // Create job category options for SLA types
    const serviceTypeOptions = useMemo(() => {
        if (!jobCategories?.data) return [];
        return jobCategories.data.map(category => ({
            label: category.label,
            value: category.value,
        }));
    }, [jobCategories]);

    // Create service options based on selected job category
    const serviceOptions = useMemo(() => {
        if (!categories?.data) return [];

        let categoryData = [];
        if (Array.isArray(categories.data)) {
            categoryData = categories.data;
        } else if (categories.data?.results && Array.isArray(categories.data.results)) {
            categoryData = categories.data.results;
        } else if (categories.data?.data && Array.isArray(categories.data.data)) {
            categoryData = categories.data.data;
        }

        // Filter by selected job category and only show parent categories
        if (!selectedJobCategory) {
            const parentCategories = categoryData.filter((category: any) => !category.parent);
            return parentCategories.map((category: any) => ({
                label: category.name,
                value: category.id,
                job_category: category.job_category,
            }));
        }

        const filteredCategories = categoryData.filter((category: any) => {
            const hasNoParent = !category.parent;
            const matchesJobCategory = category.job_category === selectedJobCategory;
            return hasNoParent && matchesJobCategory;
        });

        return filteredCategories.map((category: any) => ({
            label: category.name,
            value: category.id,
            job_category: category.job_category,
        }));
    }, [categories, selectedJobCategory]);

    // Update selected job category when service_type changes
    useEffect(() => {
        if (serviceType) {
            setSelectedJobCategory(serviceType);
        }
    }, [serviceType]);

    // Load agreement data for edit mode
    useEffect(() => {
        if (isEditMode && agreementData?.data) {
            const agreement = agreementData.data;

            console.log("📥 Loading agreement for edit:", agreement);

            // Map backend data to form fields
            form.reset({
                type: agreement.type,
                start_date: agreement.start_date,
                end_date: agreement.end_date,
                location: agreement.location || "",
                consultant_id: agreement.consultant?.toString(),
                facilitator_id: agreement.facilitator?.toString(),
                adhoc_staff_id: agreement.adhoc_staff?.toString(),
                vendor_id: agreement.vendor?.toString(),
                service_type: agreement.service_type,
                service: agreement.service,
            });

            // Set selected job category for service filtering
            if (agreement.service_type) {
                setSelectedJobCategory(agreement.service_type);
            }

            console.log("✅ Form populated with agreement data");
        }
    }, [agreementData, isEditMode, form]);


    const handleAddDocument = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".pdf,.doc,.docx";
        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setDocuments([
                    ...documents,
                    {
                        file,
                        title: file.name,
                        description: "",
                    },
                ]);
            }
        };
        fileInput.click();
    };

    const handleRemoveDocument = (index: number) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: TAgreementFormData) => {
        try {
            setIsSubmitting(true);

            // Transform data for backend API
            const transformedData: any = {
                type: data.type,
                start_date: data.start_date,
                end_date: data.end_date,
                location: data.location,
                status: 'ACTIVE', // Set as ACTIVE immediately, no DRAFT
            };

            // Only include service fields for service agreements (SLA, SECURITY, etc.)
            const isServiceAgreement = ['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(data.type);
            if (isServiceAgreement) {
                if (data.service_type) {
                    transformedData.service_type = data.service_type;
                }
                if (data.service) {
                    transformedData.service = data.service;
                }
            }

            // Add entity fields based on agreement type (backend expects field names without _id suffix)
            if (data.type === 'CONSULTANT' && data.consultant_id) {
                transformedData.consultant = data.consultant_id;
            } else if (data.type === 'FACILITATOR' && data.facilitator_id) {
                transformedData.facilitator = data.facilitator_id;
            } else if (data.type === 'ADHOC_STAFF' && data.adhoc_staff_id) {
                transformedData.adhoc_staff = data.adhoc_staff_id;
            } else if (['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(data.type) && data.vendor_id) {
                transformedData.vendor = data.vendor_id;
            }

            console.log('📤 Submitting agreement data:', transformedData);
            console.log('📤 Original form data:', data);

            if (isEditMode) {
                // Update existing agreement
                await updateAgreement(transformedData);
                toast.success("Agreement updated successfully!");
                router.push(CG_ROUTES.AGREEMENT);
            } else {
                // Create new agreement
                const response = await createAgreement(transformedData);
                console.log('✅ Agreement created:', response);

                // Upload documents if any
                if (documents.length > 0 && response?.data?.id) {
                    console.log(`📄 Uploading ${documents.length} documents...`);

                    for (const doc of documents) {
                        try {
                            const formData = new FormData();
                            formData.append("file", doc.file);
                            formData.append("title", doc.title || doc.file.name);
                            formData.append("description", doc.description || "Agreement document");
                            formData.append("document_type", "CONTRACT");
                            formData.append("is_active", "true");  // Explicitly set is_active to true
                            // Don't send agreement field - the endpoint handles it automatically

                            // Upload using Axios directly since we have the agreement ID
                            const uploadResponse = await AxiosWithToken.post(
                                `/contract-grants/agreements/${response.data.id}/documents/`,
                                formData,
                                {
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                }
                            );
                            console.log('✅ Document uploaded:', uploadResponse.data);
                        } catch (uploadError) {
                            console.error('❌ Error uploading document:', uploadError);
                            // Continue with other documents even if one fails
                        }
                    }
                }

                toast.success("Agreement created successfully!");
                router.push(CG_ROUTES.AGREEMENT);
            }
        } catch (error: any) {
            console.error("Error saving agreement:", error);
            toast.error(error?.message || "Failed to save agreement");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingAgreement) {
        return (
            <ServiceLevelAgreementLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading agreement...</p>
                    </div>
                </div>
            </ServiceLevelAgreementLayout>
        );
    }

    return (
        <ServiceLevelAgreementLayout>
            <div className="space-y-6">
                <BackNavigation extraText={isEditMode ? "Edit Agreement" : "Create Agreement"} />

                {/* Warning for editing approved agreements */}
                {isEditMode && agreementData?.data?.status && agreementData.data.status !== "DRAFT" && (
                    <Card className="border-amber-400 bg-amber-50">
                        <CardContent className="p-4">
                            <p className="text-amber-800 font-medium">
                                ⚠️ Editing {agreementData.data.status_display || agreementData.data.status} Agreement
                            </p>
                            <p className="text-amber-700 text-sm mt-1">
                                Changes will be saved immediately. Please review carefully.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-6">
                            {isEditMode ? "Edit" : "Create"} Service Level Agreement / Contract
                        </h2>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Agreement Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormSelect
                                        label="Agreement Type"
                                        name="type"
                                        options={agreementTypeOptions}
                                        placeholder="Select agreement type"
                                        required
                                    />
                                </div>

                                {/* SLA Service Type Selection */}
                                {agreementType === "SLA" && (
                                    <Card className="border-blue-200 bg-blue-50">
                                        <CardContent className="p-6 space-y-4">
                                            <h3 className="font-semibold text-blue-900">
                                                SLA Service Details
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormSelect
                                                    label="Service Category"
                                                    name="service_type"
                                                    options={serviceTypeOptions}
                                                    placeholder="Select service category"
                                                    required
                                                />
                                                {selectedJobCategory && (
                                                    <FormSelect
                                                        label="Service"
                                                        name="service"
                                                        options={serviceOptions}
                                                        placeholder={serviceOptions.length > 0 ? "Select service" : "No services available"}
                                                        disabled={serviceOptions.length === 0}
                                                        required
                                                    />
                                                )}
                                            </div>
                                            {selectedJobCategory && serviceOptions.length === 0 && (
                                                <p className="text-sm text-amber-600">
                                                    No services available for this category. Please select a different category or contact admin to add services.
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Basic Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        label="Start Date"
                                        name="start_date"
                                        type="date"
                                        required
                                    />
                                    <FormInput
                                        label="End Date"
                                        name="end_date"
                                        type="date"
                                        required
                                    />
                                    <FormSelect
                                        label="Location"
                                        name="location"
                                        options={locationOptions}
                                        placeholder="Select location"
                                        required
                                    />
                                </div>

                                {/* Entity Selection based on type */}
                                {agreementType === "CONSULTANT" && (
                                    <div className="space-y-2">
                                        <FormSelect
                                            label="Consultant"
                                            name="consultant_id"
                                            options={entityOptions}
                                            placeholder={isLoadingEntities ? "Loading consultants..." : "Select consultant"}
                                            disabled={isLoadingEntities}
                                            required
                                        />
                                        <div className="text-xs text-gray-600">
                                            {isLoadingEntities ? (
                                                <span className="text-blue-600">🔄 Loading consultants...</span>
                                            ) : entityOptions.length > 0 ? (
                                                <span className="text-green-600">✅ {entityOptions.length} consultants available</span>
                                            ) : (
                                                <span className="text-yellow-600">⚠️ No consultants available</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {agreementType === "FACILITATOR" && (
                                    <div className="space-y-2">
                                        <FormSelect
                                            label="Facilitator"
                                            name="facilitator_id"
                                            options={entityOptions}
                                            placeholder={isLoadingEntities ? "Loading facilitators..." : "Select facilitator"}
                                            disabled={isLoadingEntities}
                                            required
                                        />
                                        <div className="text-xs text-gray-600">
                                            {isLoadingEntities ? (
                                                <span className="text-blue-600">🔄 Loading facilitators...</span>
                                            ) : entityOptions.length > 0 ? (
                                                <span className="text-green-600">✅ {entityOptions.length} facilitators available</span>
                                            ) : (
                                                <span className="text-yellow-600">⚠️ No facilitators available</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {agreementType === "ADHOC_STAFF" && (
                                    <div className="space-y-2">
                                        <FormSelect
                                            label="Adhoc Staff"
                                            name="adhoc_staff_id"
                                            options={entityOptions}
                                            placeholder={isLoadingEntities ? "Loading adhoc staff..." : "Select adhoc staff"}
                                            disabled={isLoadingEntities}
                                            required
                                        />
                                        <div className="text-xs text-gray-600">
                                            {isLoadingEntities ? (
                                                <span className="text-blue-600">🔄 Loading adhoc staff...</span>
                                            ) : entityOptions.length > 0 ? (
                                                <span className="text-green-600">✅ {entityOptions.length} adhoc staff available</span>
                                            ) : (
                                                <span className="text-yellow-600">⚠️ No adhoc staff available</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {isServiceAgreement && (
                                    <div className="space-y-2">
                                        <FormSelect
                                            label="Vendor"
                                            name="vendor_id"
                                            options={vendors}
                                            placeholder={isLoadingVendors ? "Loading vendors..." : "Select vendor"}
                                            disabled={isLoadingVendors}
                                            required
                                        />
                                        <div className="text-xs text-gray-600">
                                            {isLoadingVendors ? (
                                                <span className="text-blue-600">🔄 Loading vendors...</span>
                                            ) : vendors.length > 0 ? (
                                                <span className="text-green-600">✅ {vendors.length} vendors available</span>
                                            ) : (
                                                <span className="text-yellow-600">⚠️ No vendors available</span>
                                            )}
                                        </div>
                                    </div>
                                )}


                                {/* Document Upload Section - Only for new agreements */}
                                {!isEditMode && (
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold">Contract Documents</h3>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleAddDocument}
                                                >
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Add Document
                                                </Button>
                                            </div>

                                            {documents.length === 0 ? (
                                                <p className="text-sm text-gray-500 text-center py-4">
                                                    No documents added yet. You can add them later.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {documents.map((doc, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <FileText className="w-5 h-5 text-gray-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        {doc.title}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {(doc.file.size / 1024).toFixed(1)} KB
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveDocument(index)}
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <FormButton
                                        type="submit"
                                        loading={isSubmitting || isCreating || isUpdating}
                                    >
                                        {isEditMode ? "Update Agreement" : "Create Agreement"}
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
