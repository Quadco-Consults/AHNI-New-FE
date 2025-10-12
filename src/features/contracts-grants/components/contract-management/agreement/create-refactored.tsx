"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import BackNavigation from "components/atoms/BackNavigation";
import FormSelect from "components/atoms/FormSelect";
import { Card, CardContent, CardHeader } from "components/ui/card";
import FormButton from "@/components/FormButton";
import {
    AgreementSchema,
    TAgreementFormData,
} from "@/features/contracts-grants/types/contract-management/agreement";
import { toast } from "sonner";
import { Button } from "components/ui/button";
import {
    useCreateAgreement,
} from "@/features/contracts-grants/controllers/agreementController";
import { useRouter } from "next/navigation";
import { CG_ROUTES } from "constants/RouterConstants";
import { useEffect, useMemo, useState } from "react";
import ServiceLevelAgreementLayout from "./Layout";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllJobCategories } from "@/features/modules/controllers/config/jobCategoryController";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { CheckCircle2, Building2, Users, FileText, Calendar, DollarSign, MapPin } from "lucide-react";
import { Badge } from "components/ui/badge";

const agreementTypeOptions = [
    { label: "Consultant", value: "CONSULTANT", category: "Staff Contracts" },
    { label: "Facilitator", value: "FACILITATOR", category: "Staff Contracts" },
    { label: "Adhoc Staff", value: "ADHOC_STAFF", category: "Staff Contracts" },
    { label: "IT Services (SLA)", value: "SLA", category: "Service Agreements" },
    { label: "Security Services", value: "SECURITY", category: "Service Agreements" },
    { label: "Insurance", value: "INSURANCE", category: "Service Agreements" },
    { label: "Property Lease", value: "LEASE", category: "Service Agreements" },
    { label: "Health Services (HMO)", value: "HMO", category: "Service Agreements" },
    { label: "Travel & Ticketing", value: "TICKETING", category: "Service Agreements" },
];

// Group options by category for better UX
const groupedAgreementTypes = agreementTypeOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
        acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
}, {} as Record<string, typeof agreementTypeOptions>);

// Step indicator component
interface StepIndicatorProps {
    currentStep: number;
    steps: string[];
}

function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                                        isCompleted
                                            ? 'bg-green-600 text-white'
                                            : isActive
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNumber}
                                </div>
                                <span className={`mt-2 text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-gray-600'}`}>
                                    {step}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-1 flex-1 mx-2 rounded ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function CreateAgreementRefactored() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedAgreementType, setSelectedAgreementType] = useState("");
    const [entityOptions, setEntityOptions] = useState<Array<{label: string, value: string, [key: string]: any}>>([]);
    const [isLoadingEntities, setIsLoadingEntities] = useState(false);

    const form = useForm<TAgreementFormData>({
        resolver: zodResolver(AgreementSchema),
        defaultValues: {
            service: undefined,
            service_type: undefined,
            type: "",
            start_date: "",
            end_date: "",
            contract_cost: "",
            location: "",
            consultant_id: undefined,
            facilitator_id: undefined,
            adhoc_staff_id: undefined,
            vendor_id: undefined,
        },
    });

    const router = useRouter();

    // API hooks
    const { data: location } = useGetAllLocations({ page: 1, size: 2000000 });
    const { data: jobCategories } = useGetAllJobCategories({ enabled: true });
    const { data: categories } = useGetAllCategories({ page: 1, size: 1000, enabled: true });
    const { createAgreement, isLoading: isCreateLoading, isSuccess, error: apiError } = useCreateAgreement();

    // Handle API success
    useEffect(() => {
        if (isSuccess) {
            toast.success("Agreement created successfully!");
            router.push(CG_ROUTES.AGREEMENT);
        }
    }, [isSuccess, router]);

    // Handle API errors
    useEffect(() => {
        if (apiError) {
            console.error('API Error:', apiError);
            toast.error(apiError.message || "Failed to create agreement");
        }
    }, [apiError]);

    // Watch form values
    const agreementType = form.watch('type');
    const selectedService = form.watch('service');

    // Dropdown options
    const locationOptions = useMemo(
        () =>
            location?.data?.results?.map(({ name, id }) => ({
                label: name,
                value: id,
            })) || [],
        [location]
    );

    const serviceOptions = useMemo(() => {
        if (!categories?.data) return [];
        let categoryData = [];

        if (Array.isArray(categories.data)) {
            categoryData = categories.data;
        } else if (categories.data?.results) {
            categoryData = categories.data.results;
        }

        return categoryData.map((category: any) => ({
            label: category.name,
            value: category.id,
        }));
    }, [categories]);

    const serviceTypeOptions = useMemo(() => {
        if (!jobCategories?.data) return [];

        return jobCategories.data.map(category => ({
            label: category.label,
            value: category.value,
        }));
    }, [jobCategories]);

    // Fetch entities based on agreement type
    const fetchEntities = async (type: string) => {
        setIsLoadingEntities(true);
        try {
            let endpoint = '';
            let params: any = {};

            switch(type) {
                case 'CONSULTANT':
                    // Use the correct endpoint for consultants
                    endpoint = '/contract-grants/consultancy/applicants/';
                    params = { page: 1, size: 1000, status: 'HIRED' };
                    break;
                case 'FACILITATOR':
                    // Use the correct endpoint for facilitators
                    endpoint = '/contract-grants/facilitator/applicants/';
                    params = { page: 1, size: 1000, status: 'HIRED' };
                    break;
                case 'ADHOC_STAFF':
                    // Use the correct endpoint for adhoc staff
                    endpoint = '/programs/adhoc/applicants/';
                    params = { page: 1, size: 1000, status: 'HIRED' };
                    break;
                case 'SLA':
                case 'SECURITY':
                case 'INSURANCE':
                case 'LEASE':
                case 'HMO':
                case 'TICKETING':
                    // Use the correct endpoint for vendors
                    endpoint = '/procurements/vendors/';
                    params = { page: 1, size: 1000, status: 'Approved' };
                    break;
                default:
                    setEntityOptions([]);
                    return;
            }

            console.log(`📥 Fetching entities from: ${endpoint}`, params);
            const response = await AxiosWithToken.get(endpoint, { params });

            console.log('📦 Raw API Response:', response);
            console.log('📦 Response Data:', response.data);

            // Handle different response structures
            let entities: any[] = [];

            // All entity types return paginated data
            if (response.data?.data?.results) {
                entities = response.data.data.results;
            } else if (response.data?.results) {
                entities = response.data.results;
            } else if (Array.isArray(response.data)) {
                entities = response.data;
            }

            console.log(`✅ Loaded ${entities.length} entities for ${type}:`, entities);

            // Debug: Show first entity structure for adhoc staff
            if (type === 'ADHOC_STAFF' && entities.length > 0) {
                console.log('🔍 First Adhoc Staff Entity Structure:', {
                    fullEntity: entities[0],
                    id: entities[0].id,
                    applicant_id: entities[0].applicant_id,
                    user_id: entities[0].user_id,
                    allKeys: Object.keys(entities[0]),
                });
            }

            // Format entities for dropdown
            const formattedEntities = entities.map(entity => {
                // For staff types (consultants, facilitators, adhoc staff)
                const isStaffType = ['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'].includes(type);

                if (isStaffType) {
                    const fullName = entity.full_name ||
                                   `${entity.first_name || ''} ${entity.last_name || ''}`.trim() ||
                                   entity.name ||
                                   'Unknown';

                    // Get designation/position/title
                    const designation = entity.designation ||
                                      entity.position ||
                                      entity.title ||
                                      entity.grade_level ||
                                      '';

                    const label = designation ? `${fullName} - ${designation}` : fullName;

                    return {
                        ...entity,
                        label: label,
                        value: entity.id,
                    };
                }

                // For vendor types
                const companyName = entity.company_name || entity.name || 'Unknown Vendor';
                const vendorType = entity.type_of_business || entity.nature_of_business || '';
                const label = vendorType ? `${companyName} - ${vendorType}` : companyName;

                return {
                    ...entity,
                    label: label,
                    value: entity.id,
                };
            });

            setEntityOptions(formattedEntities);
        } catch (error: any) {
            console.error('❌ Failed to fetch entities:', error);
            console.error('Error details:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });

            setEntityOptions([]);

            // Extract error message
            let errorMsg = 'Failed to load candidates';

            if (error?.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    errorMsg = errorData;
                } else if (errorData.message) {
                    errorMsg = errorData.message;
                } else if (errorData.detail) {
                    errorMsg = errorData.detail;
                } else if (errorData.error) {
                    errorMsg = errorData.error;
                }
            } else if (error?.message) {
                errorMsg = error.message;
            }

            // For vendor endpoint errors, provide more helpful message
            if (['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(type)) {
                errorMsg = 'Vendor loading endpoint not available. Please contact system administrator.';
            }

            toast.error(errorMsg);
        } finally {
            setIsLoadingEntities(false);
        }
    };

    // Handle agreement type change
    useEffect(() => {
        if (agreementType) {
            setSelectedAgreementType(agreementType);

            // Clear entity selections
            form.setValue('consultant_id', undefined);
            form.setValue('facilitator_id', undefined);
            form.setValue('adhoc_staff_id', undefined);
            form.setValue('vendor_id', undefined);

            // Clear service fields for staff contracts
            const staffContractTypes = ['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'];
            if (staffContractTypes.includes(agreementType)) {
                form.setValue('service', undefined);
                form.setValue('service_type', undefined);
            }

            fetchEntities(agreementType);
        }
    }, [agreementType]);

    // Helper to get current user ID
    const getCurrentUserId = () => {
        try {
            if (typeof window !== 'undefined') {
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

    // Form submission
    const onSubmit: SubmitHandler<TAgreementFormData> = async (data) => {
        const staffContractTypes = ['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'];
        const isStaffContract = staffContractTypes.includes(data.type);

        // Get current user ID
        const currentUserId = getCurrentUserId();
        if (!currentUserId) {
            toast.error('User session not found. Please log in again.');
            return;
        }

        // Build the API payload
        const transformedData: any = {
            type: data.type,
            start_date: data.start_date,
            end_date: data.end_date,
            contract_cost: data.contract_cost,
            location: data.location,
            service: isStaffContract
                ? `${data.type.charAt(0) + data.type.slice(1).toLowerCase()} Services`
                : data.service || "Service Agreement",
            created_by: currentUserId,
            updated_by: currentUserId,
        };

        // Add entity field based on type (API expects field without _id suffix)
        // Ensure we're sending only the ID string, not the full object
        if (data.type === 'CONSULTANT' && data.consultant_id) {
            transformedData.consultant = String(data.consultant_id);
            console.log('🔍 Consultant ID type:', typeof data.consultant_id, 'Value:', data.consultant_id);
        } else if (data.type === 'FACILITATOR' && data.facilitator_id) {
            transformedData.facilitator = String(data.facilitator_id);
            console.log('🔍 Facilitator ID type:', typeof data.facilitator_id, 'Value:', data.facilitator_id);
        } else if (data.type === 'ADHOC_STAFF' && data.adhoc_staff_id) {
            transformedData.adhoc_staff = String(data.adhoc_staff_id);
            console.log('🔍 Adhoc Staff ID type:', typeof data.adhoc_staff_id, 'Value:', data.adhoc_staff_id);
        } else if (['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(data.type) && data.vendor_id) {
            transformedData.vendor = String(data.vendor_id);
            console.log('🔍 Vendor ID type:', typeof data.vendor_id, 'Value:', data.vendor_id);
        }

        // Validation
        const hasEntity = transformedData.consultant || transformedData.facilitator ||
                        transformedData.adhoc_staff || transformedData.vendor;

        if (!hasEntity) {
            toast.error('Please select a person/vendor for this agreement');
            return;
        }

        console.log('📤 Submitting Agreement to API:', transformedData);
        console.log('📤 Data types:', {
            consultant: transformedData.consultant ? typeof transformedData.consultant : 'not set',
            facilitator: transformedData.facilitator ? typeof transformedData.facilitator : 'not set',
            adhoc_staff: transformedData.adhoc_staff ? typeof transformedData.adhoc_staff : 'not set',
            vendor: transformedData.vendor ? typeof transformedData.vendor : 'not set',
        });

        // Call the API (success/error handled by useEffect hooks)
        await createAgreement(transformedData);
    };

    // Determine entity field name and label
    const getEntityField = () => {
        const map: Record<string, { field: string; label: string; pluralLabel: string }> = {
            'CONSULTANT': { field: 'consultant_id', label: 'Consultant', pluralLabel: 'consultants' },
            'FACILITATOR': { field: 'facilitator_id', label: 'Facilitator', pluralLabel: 'facilitators' },
            'ADHOC_STAFF': { field: 'adhoc_staff_id', label: 'Adhoc Staff', pluralLabel: 'adhoc staff' },
        };

        if (map[selectedAgreementType]) {
            return map[selectedAgreementType];
        }

        return { field: 'vendor_id', label: 'Vendor', pluralLabel: 'vendors' };
    };

    const isStaffContract = ['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'].includes(selectedAgreementType);
    const entityInfo = getEntityField();

    const steps = ["Agreement Type", "Details", "Review"];

    return (
        <ServiceLevelAgreementLayout>
            <div className="space-y-6">
                <BackNavigation extraText="Create New Agreement" />

                <StepIndicator currentStep={currentStep} steps={steps} />

                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-bold">Create Service Level Agreement / Contract</h2>
                        <p className="text-sm text-gray-600">
                            Fill in the details below to create a new agreement for facilitators, consultants, adhoc staff, or vendors.
                        </p>
                    </CardHeader>

                    <CardContent className="p-6 relative">
                        {/* Loading Overlay */}
                        {isCreateLoading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                    <p className="text-lg font-semibold text-gray-900">Creating Agreement...</p>
                                    <p className="text-sm text-gray-600 mt-1">Please wait</p>
                                </div>
                            </div>
                        )}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Step 1: Agreement Type Selection */}
                                {currentStep === 1 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <FileText className="w-5 h-5 text-indigo-600" />
                                            <h3 className="text-lg font-semibold">Select Agreement Type</h3>
                                        </div>

                                        {/* Grouped Agreement Type Selection */}
                                        <div className="space-y-6">
                                            {Object.entries(groupedAgreementTypes).map(([category, options]) => (
                                                <div key={category} className="space-y-3">
                                                    <h4 className="text-sm font-medium text-gray-700 border-b pb-2">{category}</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {options.map((option) => {
                                                            const isSelected = form.watch('type') === option.value;
                                                            return (
                                                                <button
                                                                    key={option.value}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        form.setValue('type', option.value);
                                                                        setSelectedAgreementType(option.value);
                                                                    }}
                                                                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                                                                        isSelected
                                                                            ? 'border-indigo-600 bg-indigo-50'
                                                                            : 'border-gray-200 hover:border-gray-300'
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-medium">{option.label}</span>
                                                                        {isSelected && (
                                                                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {form.formState.errors.type && (
                                            <p className="text-sm text-red-600">{form.formState.errors.type.message}</p>
                                        )}

                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    if (!form.watch('type')) {
                                                        toast.error('Please select an agreement type');
                                                        return;
                                                    }
                                                    setCurrentStep(2);
                                                }}
                                                size="lg"
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Next: Enter Details
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Details */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        {/* Selected Agreement Type Badge */}
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-indigo-700 font-medium">Agreement Type</p>
                                                    <p className="text-lg font-semibold text-indigo-900">
                                                        {agreementTypeOptions.find(opt => opt.value === selectedAgreementType)?.label}
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentStep(1)}
                                                >
                                                    Change
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Entity Selection */}
                                            <div className="lg:col-span-2">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Users className="w-5 h-5 text-indigo-600" />
                                                    <h3 className="text-lg font-semibold">Select {entityInfo.label}</h3>
                                                </div>

                                                <FormSelect
                                                    label={entityInfo.label}
                                                    name={entityInfo.field}
                                                    placeholder={
                                                        isLoadingEntities
                                                            ? `Loading ${entityInfo.pluralLabel}...`
                                                            : entityOptions.length === 0
                                                            ? `No ${entityInfo.pluralLabel} available`
                                                            : `Select ${entityInfo.label}`
                                                    }
                                                    options={entityOptions || []}
                                                    required
                                                    disabled={isLoadingEntities || entityOptions.length === 0}
                                                />

                                                {/* Loading State */}
                                                {isLoadingEntities && (
                                                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                        <p className="text-sm text-blue-800">
                                                            Loading {entityInfo.pluralLabel}...
                                                        </p>
                                                    </div>
                                                )}

                                                {/* No Entities Available */}
                                                {!isLoadingEntities && entityOptions.length === 0 && (
                                                    <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <div className="flex items-start gap-2">
                                                            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                            </svg>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-yellow-800">
                                                                    No {entityInfo.pluralLabel} available
                                                                </p>
                                                                <p className="text-xs text-yellow-700 mt-2 mb-3">
                                                                    {selectedAgreementType === 'CONSULTANT' &&
                                                                        'To create consultant agreements, you need to have hired consultants in the system. Go to Consultancy Applications and hire candidates first.'}
                                                                    {selectedAgreementType === 'FACILITATOR' &&
                                                                        'To create facilitator agreements, you need to have hired facilitators in the system. Go to Facilitator Applications and hire candidates first.'}
                                                                    {selectedAgreementType === 'ADHOC_STAFF' &&
                                                                        'To create adhoc staff agreements, you need to have hired adhoc staff in the system. Go to Adhoc Applications and hire candidates first.'}
                                                                    {['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(selectedAgreementType) &&
                                                                        'To create vendor agreements, you need to have approved vendors in the system. Go to Vendor Management and approve vendors first.'}
                                                                </p>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            console.log('🔄 Retrying entity fetch...');
                                                                            fetchEntities(selectedAgreementType);
                                                                        }}
                                                                    >
                                                                        Retry Loading
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setCurrentStep(1)}
                                                                    >
                                                                        Choose Different Type
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Success State */}
                                                {!isLoadingEntities && entityOptions.length > 0 && (
                                                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                                        <p className="text-sm text-green-700 flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Found {entityOptions.length} available {entityInfo.pluralLabel}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Service fields for Service Agreements only */}
                                            {!isStaffContract && (
                                                <>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Building2 className="w-5 h-5 text-indigo-600" />
                                                            <h3 className="text-base font-semibold">Service Category</h3>
                                                        </div>
                                                        <FormSelect
                                                            label="Service Category"
                                                            name="service"
                                                            placeholder="Select Service Category"
                                                            options={serviceOptions || []}
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Building2 className="w-5 h-5 text-indigo-600" />
                                                            <h3 className="text-base font-semibold">Service Type</h3>
                                                        </div>
                                                        <FormSelect
                                                            label="Service Type (Job Category)"
                                                            name="service_type"
                                                            placeholder="Select Service Type"
                                                            options={serviceTypeOptions || []}
                                                            required
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {/* Contract Dates */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                                    <h3 className="text-base font-semibold">Start Date</h3>
                                                </div>
                                                <FormInput
                                                    type="date"
                                                    label="Start Date"
                                                    name="start_date"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Calendar className="w-5 h-5 text-indigo-600" />
                                                    <h3 className="text-base font-semibold">End Date</h3>
                                                </div>
                                                <FormInput
                                                    type="date"
                                                    label="End Date"
                                                    name="end_date"
                                                    required
                                                />
                                            </div>

                                            {/* Contract Cost */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <DollarSign className="w-5 h-5 text-indigo-600" />
                                                    <h3 className="text-base font-semibold">Contract Cost</h3>
                                                </div>
                                                <FormInput
                                                    type="number"
                                                    label="Contract Cost (₦)"
                                                    name="contract_cost"
                                                    placeholder="Enter Contract Cost"
                                                    required
                                                />
                                            </div>

                                            {/* Location */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <MapPin className="w-5 h-5 text-indigo-600" />
                                                    <h3 className="text-base font-semibold">Location</h3>
                                                </div>
                                                <FormSelect
                                                    label="Location"
                                                    name="location"
                                                    placeholder="Select Location"
                                                    required
                                                    options={locationOptions || []}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between pt-6 border-t">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setCurrentStep(1)}
                                                disabled={isLoadingEntities}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    // Check if entities are still loading
                                                    if (isLoadingEntities) {
                                                        toast.info(`Please wait while ${entityInfo.pluralLabel} are loading`);
                                                        return;
                                                    }

                                                    // Check if entities are available
                                                    if (entityOptions.length === 0) {
                                                        toast.error(`No ${entityInfo.pluralLabel} available. Cannot proceed.`);
                                                        return;
                                                    }

                                                    // Basic validation before moving to review
                                                    const values = form.getValues();
                                                    const entityField = entityInfo.field as keyof TAgreementFormData;

                                                    if (!values[entityField]) {
                                                        toast.error(`Please select a ${entityInfo.label}`);
                                                        return;
                                                    }
                                                    if (!isStaffContract && !values.service) {
                                                        toast.error('Please select a service category');
                                                        return;
                                                    }
                                                    if (!values.start_date || !values.end_date) {
                                                        toast.error('Please select start and end dates');
                                                        return;
                                                    }
                                                    if (!values.contract_cost) {
                                                        toast.error('Please enter contract cost');
                                                        return;
                                                    }
                                                    if (!values.location) {
                                                        toast.error('Please select a location');
                                                        return;
                                                    }
                                                    setCurrentStep(3);
                                                }}
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                                disabled={isLoadingEntities || entityOptions.length === 0}
                                            >
                                                {isLoadingEntities ? 'Loading...' : 'Next: Review'}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review & Submit */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                            <h3 className="text-lg font-semibold">Review Agreement Details</h3>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">Agreement Type</label>
                                                    <p className="mt-1 text-base text-gray-900">
                                                        {agreementTypeOptions.find(opt => opt.value === form.watch('type'))?.label}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">{entityInfo.label}</label>
                                                    <p className="mt-1 text-base text-gray-900">
                                                        {entityOptions.find(opt => opt.value === form.watch(entityInfo.field as any))?.label || 'N/A'}
                                                    </p>
                                                </div>

                                                {!isStaffContract && (
                                                    <>
                                                        <div>
                                                            <label className="text-sm font-medium text-gray-700">Service Category</label>
                                                            <p className="mt-1 text-base text-gray-900">
                                                                {serviceOptions.find((opt: any) => opt.value === form.watch('service'))?.label || 'N/A'}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-medium text-gray-700">Service Type</label>
                                                            <p className="mt-1 text-base text-gray-900">
                                                                {serviceTypeOptions.find((opt: any) => opt.value === form.watch('service_type'))?.label || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </>
                                                )}

                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                                                    <p className="mt-1 text-base text-gray-900">{form.watch('start_date')}</p>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">End Date</label>
                                                    <p className="mt-1 text-base text-gray-900">{form.watch('end_date')}</p>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">Contract Cost</label>
                                                    <p className="mt-1 text-base text-gray-900">
                                                        ₦{Number(form.watch('contract_cost')).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">Location</label>
                                                    <p className="mt-1 text-base text-gray-900">
                                                        {locationOptions.find(opt => opt.value === form.watch('location'))?.label || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between pt-6 border-t">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setCurrentStep(2)}
                                                disabled={isCreateLoading}
                                            >
                                                Back to Edit
                                            </Button>
                                            <FormButton
                                                type="submit"
                                                size="lg"
                                                loading={isCreateLoading}
                                                disabled={entityOptions.length === 0 || isCreateLoading}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                {isCreateLoading ? 'Creating Agreement...' : 'Create Agreement'}
                                            </FormButton>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </ServiceLevelAgreementLayout>
    );
}
