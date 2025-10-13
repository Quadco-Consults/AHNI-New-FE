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
import { CheckCircle2, Building2, Users, FileText, Calendar, DollarSign, MapPin, Upload, X } from "lucide-react";
import { Badge } from "components/ui/badge";

const agreementTypeOptions = [
    { label: "Consultant", value: "CONSULTANT", category: "Staff Contracts" },
    { label: "Facilitator", value: "FACILITATOR", category: "Staff Contracts" },
    { label: "Adhoc Staff", value: "ADHOC_STAFF", category: "Staff Contracts" },
    { label: "Service Level Agreement (SLA)", value: "SLA", category: "Service Agreements" },
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
    const [createdAgreementId, setCreatedAgreementId] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [documentType, setDocumentType] = useState<'CONTRACT' | 'ADDENDUM' | 'AMENDMENT'>('CONTRACT');
    const [documentDescription, setDocumentDescription] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);

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
    const { createAgreement, isLoading: isCreateLoading, isSuccess, error: apiError, data: createData } = useCreateAgreement();

    // Handle API success - move to upload step instead of redirecting
    useEffect(() => {
        console.log('🎯 Create Agreement Effect Triggered');
        console.log('  - isSuccess:', isSuccess);
        console.log('  - createData:', createData);
        console.log('  - createData?.id:', createData?.id);
        console.log('  - currentStep:', currentStep);

        if (isSuccess && createData?.id) {
            console.log('✅ Conditions met! Moving to Step 4 with ID:', createData.id);
            toast.success("Agreement created successfully! Now add documents.");
            setCreatedAgreementId(createData.id);
            setCurrentStep(4); // Move to document upload step
            console.log('✅ setCurrentStep(4) called');
        } else {
            console.log('❌ Conditions not met for Step 4 transition');
            if (!isSuccess) console.log('  - isSuccess is false or undefined');
            if (!createData?.id) console.log('  - Agreement ID not found in response');
        }
    }, [isSuccess, createData]);

    // Handle API errors
    useEffect(() => {
        if (apiError) {
            console.error('API Error:', apiError);
            toast.error(apiError.message || "Failed to create agreement");
        }
    }, [apiError]);

    // Watch form values
    const agreementType = form.watch('type');
    const selectedServiceType = form.watch('service_type');

    // Dropdown options
    const locationOptions = useMemo(
        () =>
            location?.data?.results?.map(({ name, id }) => ({
                label: name,
                value: id,
            })) || [],
        [location]
    );

    // Service Type Options - Define FIRST (used by filteredServiceOptions)
    const serviceTypeOptions = useMemo(() => {
        if (!jobCategories?.data) return [];

        const options = jobCategories.data.map(category => ({
            label: category.label,
            value: category.value,
        }));

        console.log('🏷️  Available Service Types (Job Categories):', options);

        return options;
    }, [jobCategories]);

    // Service Options (all categories and subcategories)
    const serviceOptions = useMemo(() => {
        if (!categories) {
            console.log('⚠️ Categories hook returned no data');
            return [];
        }

        console.log('📦 Full categories response:', categories);

        // Try different possible response structures
        let categoryData: any[] = [];

        if (categories.results) {
            categoryData = categories.results;
        } else if (categories.data?.results) {
            categoryData = categories.data.results;
        } else if (Array.isArray(categories.data)) {
            categoryData = categories.data;
        } else if (Array.isArray(categories)) {
            categoryData = categories;
        }

        console.log('📦 Extracted Categories Data:', categoryData.slice(0, 3)); // Show first 3 categories

        // Include ALL categories (both parent categories and subcategories)
        // Subcategories are the ones with a parent field
        const mappedOptions = categoryData.map((category) => ({
            label: category.name,
            value: category.id,
            job_category: category.job_category, // Job category ID for filtering
            parent: category.parent, // Parent category for hierarchy
            isSubcategory: !!category.parent, // Flag to identify subcategories
        }));

        console.log('📊 Mapped Service Options (first 5):', mappedOptions.slice(0, 5));
        console.log(`📊 Total: ${mappedOptions.length} (${mappedOptions.filter(o => o.isSubcategory).length} subcategories, ${mappedOptions.filter(o => !o.isSubcategory).length} parent categories)`);

        return mappedOptions;
    }, [categories]);

    // Filter service categories based on selected service type (job category)
    const filteredServiceOptions = useMemo(() => {
        if (!selectedServiceType) {
            console.log('⚠️  No service type selected yet');
            return []; // Show nothing if no service type selected
        }

        console.log('═══════════════════════════════════════════════════════════');
        console.log('🔍 FILTERING SERVICE CATEGORIES');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('Selected Service Type ID:', selectedServiceType);
        console.log('Total Categories to filter:', serviceOptions.length);
        console.log('');

        // Show the selected service type label
        const selectedJobCategory = serviceTypeOptions.find((jc: any) => jc.value === selectedServiceType);
        if (selectedJobCategory) {
            console.log('📌 Selected Service Type:', selectedJobCategory.label, `(ID: ${selectedServiceType})`);
        }
        console.log('');

        // Debug: Show first 5 categories with their job_category values
        console.log('📋 Sample Categories (first 5):');
        serviceOptions.slice(0, 5).forEach((opt: any, index: number) => {
            console.log(`  ${index + 1}. ${opt.label}`);
            console.log(`     - Category ID: ${opt.value}`);
            console.log(`     - Job Category ID: ${opt.job_category || 'NOT SET'}`);
            console.log(`     - Matches: ${opt.job_category === selectedServiceType ? '✅ YES' : '❌ NO'}`);
        });
        console.log('');

        // Filter categories that match the selected job category
        const filtered = serviceOptions.filter((option: any) => {
            // Match by job_category field
            const matches = option.job_category === selectedServiceType;
            return matches;
        });

        console.log('📊 FILTERING RESULTS:');
        console.log(`  Total Matches: ${filtered.length} categories`);
        if (filtered.length > 0) {
            console.log('  Matched Categories:');
            filtered.forEach((cat: any, index: number) => {
                console.log(`    ${index + 1}. ${cat.label} (job_category: ${cat.job_category})`);
            });
        } else {
            console.log('  ⚠️  No categories found with job_category =', selectedServiceType);
            console.log('');
            console.log('  💡 Debugging Tips:');
            console.log('     1. Check if categories have job_category field set in the database');
            console.log('     2. Verify job_category IDs match exactly (case-sensitive)');
            console.log('     3. Check if categories are properly linked to job categories');
        }
        console.log('═══════════════════════════════════════════════════════════');
        console.log('');

        return filtered;
    }, [serviceOptions, selectedServiceType, serviceTypeOptions]);

    // Fetch entities based on agreement type
    const fetchEntities = async (type: string) => {
        setIsLoadingEntities(true);
        try {
            let endpoint = '';
            let fallbackEndpoint = '';
            let params: any = {};

            switch(type) {
                case 'CONSULTANT':
                    // Use the agreement dropdown endpoint for consultants
                    endpoint = '/contract-grants/agreements/consultants_dropdown/';
                    fallbackEndpoint = '/contract-grants/consultancy/applicants/';
                    params = { page: 1, size: 1000, status: 'HIRED' };
                    break;
                case 'FACILITATOR':
                    // Use the agreement dropdown endpoint for facilitators
                    endpoint = '/contract-grants/agreements/facilitators_dropdown/';
                    fallbackEndpoint = '/contract-grants/facilitators/applicants/';
                    params = { page: 1, size: 1000, status: 'HIRED' };
                    break;
                case 'ADHOC_STAFF':
                    // Use the agreement dropdown endpoint for adhoc staff
                    endpoint = '/contract-grants/agreements/adhoc_staff_dropdown/';
                    fallbackEndpoint = '/programs/adhoc/applicants/';
                    params = { page: 1, size: 1000, status: 'HIRED' };
                    break;
                case 'SLA':
                    // Use the vendors endpoint directly (covers all service types)
                    endpoint = '/procurements/vendors/';
                    fallbackEndpoint = '';
                    params = { page: 1, size: 1000, status: 'Approved', approved_categories: '' };
                    break;
                default:
                    setEntityOptions([]);
                    return;
            }

            console.log(`📥 Fetching entities from: ${endpoint}`, params);
            const response = await AxiosWithToken.get(endpoint, { params });

            console.log('📦 Raw API Response:', response);
            console.log('📦 Response Data:', response.data);
            console.log('📦 Response Data Type:', typeof response.data);
            console.log('📦 Is Array?:', Array.isArray(response.data));

            // Agreement dropdown endpoints can return different structures
            let entities: any[] = [];

            // Try different response structures
            if (Array.isArray(response.data)) {
                console.log('✅ Response is direct array');
                entities = response.data;
            } else if (response.data?.data?.results) {
                console.log('✅ Response has data.results structure');
                entities = response.data.data.results;
            } else if (response.data?.results) {
                console.log('✅ Response has results structure');
                entities = response.data.results;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                console.log('✅ Response has data array structure');
                entities = response.data.data;
            } else {
                console.log('⚠️ Unknown response structure, trying to parse:', Object.keys(response.data || {}));
            }

            console.log(`✅ Loaded ${entities.length} entities for ${type}:`, entities);

            // If dropdown endpoint returned empty data, try fallback endpoint
            if (entities.length === 0 && fallbackEndpoint) {
                console.log(`⚠️ Dropdown endpoint returned no data, trying fallback: ${fallbackEndpoint}`);
                try {
                    const fallbackResponse = await AxiosWithToken.get(fallbackEndpoint, { params });
                    console.log('📦 Fallback Response Data:', fallbackResponse.data);

                    // Parse fallback response
                    if (Array.isArray(fallbackResponse.data)) {
                        entities = fallbackResponse.data;
                    } else if (fallbackResponse.data?.data?.results) {
                        entities = fallbackResponse.data.data.results;
                    } else if (fallbackResponse.data?.results) {
                        entities = fallbackResponse.data.results;
                    } else if (fallbackResponse.data?.data && Array.isArray(fallbackResponse.data.data)) {
                        entities = fallbackResponse.data.data;
                    }

                    console.log(`✅ Fallback loaded ${entities.length} entities:`, entities.slice(0, 2));
                } catch (fallbackError) {
                    console.error('❌ Fallback endpoint also failed:', fallbackError);
                }
            }

            // Debug: Show first entity structure
            if (entities.length > 0) {
                console.log('🔍 First Entity Structure:', {
                    fullEntity: entities[0],
                    hasValue: 'value' in entities[0],
                    hasLabel: 'label' in entities[0],
                    hasId: 'id' in entities[0],
                    hasName: 'name' in entities[0],
                    hasFullName: 'full_name' in entities[0],
                    hasFirstName: 'first_name' in entities[0],
                    hasUserId: 'user_id' in entities[0],
                    hasUser: 'user' in entities[0],
                    allKeys: Object.keys(entities[0]),
                });

                // Log the actual ID value and its type
                const idValue = entities[0].value || entities[0].id || entities[0].user_id || entities[0].user?.id;
                console.log('🔑 ID Value:', idValue, 'Type:', typeof idValue);
            } else {
                console.log('⚠️ No entities found in response');
                console.log('📋 Full response data:', JSON.stringify(response.data, null, 2));
            }

            // Format entities for dropdown
            // The agreement dropdown endpoints should return data with value/label
            // But we need to handle different formats
            const formattedEntities = entities.map((entity, index) => {
                // For adhoc staff from /programs/adhoc/applicants/, the entity has a 'user' object
                // We need to extract the user's ID, not the applicant ID
                let actualId = entity.value || entity.id;
                let displayLabel = entity.label || entity.name || entity.full_name || entity.company_name;

                // Special handling for adhoc staff from fallback endpoint
                if (type === 'ADHOC_STAFF' && entity.user) {
                    actualId = entity.user.id || entity.id;
                    displayLabel = entity.user.full_name || entity.user.name ||
                                  `${entity.user.first_name || ''} ${entity.user.last_name || ''}`.trim();
                }
                // Special handling for consultants from fallback endpoint
                else if (type === 'CONSULTANT' && entity.user) {
                    actualId = entity.user.id || entity.id;
                    displayLabel = entity.user.full_name || entity.user.name ||
                                  `${entity.user.first_name || ''} ${entity.user.last_name || ''}`.trim();
                }
                // Special handling for facilitators from fallback endpoint
                else if (type === 'FACILITATOR' && entity.user) {
                    actualId = entity.user.id || entity.id;
                    displayLabel = entity.user.full_name || entity.user.name ||
                                  `${entity.user.first_name || ''} ${entity.user.last_name || ''}`.trim();
                }
                // Vendors - SLA covers all vendor service types
                else if (type === 'SLA') {
                    actualId = entity.value || entity.id;
                    displayLabel = entity.label || entity.company_name || entity.name;
                }
                // Generic fallback for name construction
                else if (!displayLabel && entity.first_name && entity.last_name) {
                    displayLabel = `${entity.first_name} ${entity.last_name}`;
                }

                const label = displayLabel || 'Unknown';

                console.log(`🔧 Entity ${index + 1} formatted:`, {
                    originalId: entity.id,
                    userId: entity.user?.id,
                    extractedValue: actualId,
                    extractedLabel: label,
                });

                return {
                    ...entity,
                    label,
                    value: actualId,
                };
            });

            console.log('🎯 Formatted Entities:', formattedEntities.slice(0, 3)); // Show first 3

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
            if (type === 'SLA') {
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

    // Handle service type change - clear service category when service type changes
    useEffect(() => {
        // Clear the service category when service type changes
        form.setValue('service', undefined);
    }, [selectedServiceType]);

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
        // ONLY include the relevant entity field - don't send empty/undefined fields
        if (data.type === 'CONSULTANT' && data.consultant_id) {
            console.log('🔍 Raw consultant_id before conversion:', data.consultant_id, 'Type:', typeof data.consultant_id);
            transformedData.consultant = String(data.consultant_id);
            console.log('🔍 Converted consultant:', transformedData.consultant, 'Type:', typeof transformedData.consultant);
        } else if (data.type === 'FACILITATOR' && data.facilitator_id) {
            console.log('🔍 Raw facilitator_id before conversion:', data.facilitator_id, 'Type:', typeof data.facilitator_id);
            transformedData.facilitator = String(data.facilitator_id);
            console.log('🔍 Converted facilitator:', transformedData.facilitator, 'Type:', typeof transformedData.facilitator);
        } else if (data.type === 'ADHOC_STAFF' && data.adhoc_staff_id) {
            console.log('🔍 Raw adhoc_staff_id before conversion:', data.adhoc_staff_id, 'Type:', typeof data.adhoc_staff_id);
            transformedData.adhoc_staff = String(data.adhoc_staff_id);
            console.log('🔍 Converted adhoc_staff:', transformedData.adhoc_staff, 'Type:', typeof transformedData.adhoc_staff);
        } else if (data.type === 'SLA' && data.vendor_id) {
            console.log('🔍 Raw vendor_id before conversion:', data.vendor_id, 'Type:', typeof data.vendor_id);
            transformedData.vendor = String(data.vendor_id);
            console.log('🔍 Converted vendor:', transformedData.vendor, 'Type:', typeof transformedData.vendor);
        }

        // NOTE: We deliberately DON'T send the other entity fields
        // This keeps the payload clean - backend now handles empty strings gracefully anyway

        // Validation
        const hasEntity = transformedData.consultant || transformedData.facilitator ||
                        transformedData.adhoc_staff || transformedData.vendor;

        if (!hasEntity) {
            toast.error('Please select a person/vendor for this agreement');
            return;
        }

        // ========================================
        // 🎯 COMPREHENSIVE PAYLOAD DEBUG SECTION
        // ========================================
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📤 SUBMITTING AGREEMENT TO API');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('');

        // Determine agreement category
        const agreementCategory = data.type === 'CONSULTANT' ? '👔 CONSULTANT AGREEMENT' :
                                 data.type === 'FACILITATOR' ? '🎓 FACILITATOR AGREEMENT' :
                                 data.type === 'ADHOC_STAFF' ? '👷 ADHOC STAFF AGREEMENT' :
                                 '🏢 VENDOR/SERVICE AGREEMENT';

        console.log('📋 Agreement Category:', agreementCategory);
        console.log('📋 Agreement Type:', data.type);
        console.log('');
        console.log('📦 COMPLETE JSON PAYLOAD (Copy this for backend):');
        console.log('─────────────────────────────────────────────────────────');
        console.log(JSON.stringify(transformedData, null, 2));
        console.log('─────────────────────────────────────────────────────────');
        console.log('');
        console.log('🔍 FIELD-BY-FIELD BREAKDOWN:');
        console.log('');
        console.log('  📌 Core Fields:');
        console.log('    • type:', transformedData.type);
        console.log('    • service:', transformedData.service);
        console.log('    • start_date:', transformedData.start_date);
        console.log('    • end_date:', transformedData.end_date);
        console.log('    • contract_cost:', transformedData.contract_cost, `(${typeof transformedData.contract_cost})`);
        console.log('    • location:', transformedData.location);
        console.log('');
        console.log('  👤 User Fields:');
        console.log('    • created_by:', transformedData.created_by, `(${typeof transformedData.created_by})`);
        console.log('    • updated_by:', transformedData.updated_by, `(${typeof transformedData.updated_by})`);
        console.log('');
        console.log('  👥 Entity Assignment (Only ONE should be set):');
        console.log('    • consultant:', transformedData.consultant || '❌ not set', transformedData.consultant ? `(${typeof transformedData.consultant})` : '');
        console.log('    • facilitator:', transformedData.facilitator || '❌ not set', transformedData.facilitator ? `(${typeof transformedData.facilitator})` : '');
        console.log('    • adhoc_staff:', transformedData.adhoc_staff || '❌ not set', transformedData.adhoc_staff ? `(${typeof transformedData.adhoc_staff})` : '');
        console.log('    • vendor:', transformedData.vendor || '❌ not set', transformedData.vendor ? `(${typeof transformedData.vendor})` : '');
        console.log('');
        console.log('  ✅ Selected Entity:');
        if (transformedData.consultant) {
            console.log('    → CONSULTANT ID:', transformedData.consultant);
            console.log('    → Selected from dropdown:', entityOptions.find(e => e.value === data.consultant_id)?.label || 'N/A');
        } else if (transformedData.facilitator) {
            console.log('    → FACILITATOR ID:', transformedData.facilitator);
            console.log('    → Selected from dropdown:', entityOptions.find(e => e.value === data.facilitator_id)?.label || 'N/A');
        } else if (transformedData.adhoc_staff) {
            console.log('    → ADHOC STAFF ID:', transformedData.adhoc_staff);
            console.log('    → Selected from dropdown:', entityOptions.find(e => e.value === data.adhoc_staff_id)?.label || 'N/A');
        } else if (transformedData.vendor) {
            console.log('    → VENDOR ID:', transformedData.vendor);
            console.log('    → Selected from dropdown:', entityOptions.find(e => e.value === data.vendor_id)?.label || 'N/A');
        }
        console.log('');
        console.log('  📝 Original Form Field Values (before transformation):');
        console.log('    • consultant_id:', data.consultant_id || 'undefined');
        console.log('    • facilitator_id:', data.facilitator_id || 'undefined');
        console.log('    • adhoc_staff_id:', data.adhoc_staff_id || 'undefined');
        console.log('    • vendor_id:', data.vendor_id || 'undefined');
        console.log('');
        console.log('  🌐 API Details:');
        console.log('    • Endpoint: POST /contract-grants/agreements/');
        console.log('    • Method: POST');
        console.log('    • Content-Type: application/json');
        console.log('');
        console.log('═══════════════════════════════════════════════════════════');

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

    // Document upload handlers
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadDocuments = async () => {
        if (!createdAgreementId) {
            toast.error("Agreement ID not found");
            return;
        }

        if (selectedFiles.length === 0) {
            toast.error("Please select at least one document");
            return;
        }

        setIsUploading(true);
        let successCount = 0;
        let failCount = 0;

        for (const file of selectedFiles) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('title', file.name);
                formData.append('document_type', documentType);
                if (documentDescription) {
                    formData.append('description', documentDescription);
                }

                const response = await AxiosWithToken.post(
                    `/contract-grants/agreements/${createdAgreementId}/documents/`,
                    formData
                );

                console.log(`Document "${file.name}" uploaded successfully:`, response.data);

                // Add to uploaded documents list
                if (response.data?.data) {
                    setUploadedDocuments(prev => [...prev, response.data.data]);
                }

                successCount++;
            } catch (error) {
                console.error(`Failed to upload document "${file.name}":`, error);
                failCount++;
            }
        }

        setIsUploading(false);
        setSelectedFiles([]);
        setDocumentDescription("");

        if (successCount > 0) {
            toast.success(`${successCount} document(s) uploaded successfully!`);
        }
        if (failCount > 0) {
            toast.error(`Failed to upload ${failCount} document(s)`);
        }
    };

    const handleFinish = () => {
        if (uploadedDocuments.length === 0) {
            // Ask for confirmation if no documents uploaded
            if (confirm("No documents uploaded. Are you sure you want to finish without documents?")) {
                router.push(CG_ROUTES.AGREEMENT);
            }
        } else {
            toast.success(`Agreement created with ${uploadedDocuments.length} document(s)!`);
            router.push(CG_ROUTES.AGREEMENT);
        }
    };

    const steps = ["Agreement Type", "Details", "Review", "Upload Documents"];

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
                                                                    {selectedAgreementType === 'SLA' &&
                                                                        'To create vendor service agreements, you need to have approved vendors in the system. Go to Vendor Management and approve vendors first.'}
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
                                                    {/* Service Type FIRST */}
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

                                                    {/* Service Category SECOND - Filtered based on Service Type */}
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Building2 className="w-5 h-5 text-indigo-600" />
                                                            <h3 className="text-base font-semibold">Service Category {serviceOptions.length === 0 && '(Optional - No categories configured)'}</h3>
                                                        </div>
                                                        <FormSelect
                                                            label="Service Category"
                                                            name="service"
                                                            placeholder={
                                                                serviceOptions.length === 0
                                                                    ? "No categories configured in system"
                                                                    : !selectedServiceType
                                                                    ? "Select Service Type first"
                                                                    : filteredServiceOptions.length === 0
                                                                    ? `No categories for ${selectedServiceType}`
                                                                    : "Select Service Category"
                                                            }
                                                            options={filteredServiceOptions || []}
                                                            required={serviceOptions.length > 0}
                                                            disabled={!selectedServiceType || serviceOptions.length === 0}
                                                        />
                                                        {selectedServiceType && filteredServiceOptions.length > 0 && (
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                Showing {filteredServiceOptions.length} categories for {selectedServiceType}
                                                            </p>
                                                        )}
                                                        {serviceOptions.length === 0 && (
                                                            <p className="text-xs text-orange-600 mt-1">
                                                                ⚠️ No service categories configured. Please add categories in the admin panel or proceed without selecting a category.
                                                            </p>
                                                        )}
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
                                                    // Allow SLA without service category if no categories exist
                                                    if (!isStaffContract && !values.service && serviceOptions.length > 0) {
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

                                {/* Step 4: Upload Documents */}
                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        {/* Success Message */}
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                <div>
                                                    <h3 className="text-lg font-semibold text-green-900">Agreement Created Successfully!</h3>
                                                    <p className="text-sm text-green-700 mt-1">
                                                        Agreement ID: <span className="font-mono">{createdAgreementId}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <Upload className="w-5 h-5 text-indigo-600" />
                                            <h3 className="text-lg font-semibold">Upload Contract Documents</h3>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-4">
                                            Upload contract documents, addendums, or amendments. You can also skip this step and add documents later.
                                        </p>

                                        {/* Document Type Selector */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Document Type</label>
                                            <select
                                                value={documentType}
                                                onChange={(e) => setDocumentType(e.target.value as any)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                            >
                                                <option value="CONTRACT">Contract</option>
                                                <option value="ADDENDUM">Addendum</option>
                                                <option value="AMENDMENT">Amendment</option>
                                            </select>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                                            <textarea
                                                value={documentDescription}
                                                onChange={(e) => setDocumentDescription(e.target.value)}
                                                placeholder="Enter document description..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                                rows={3}
                                            />
                                        </div>

                                        {/* File Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Select Files</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileSelect}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                        </div>

                                        {/* Selected Files List */}
                                        {selectedFiles.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Selected Files ({selectedFiles.length})</label>
                                                <div className="space-y-2">
                                                    {selectedFiles.map((file, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="w-4 h-4 text-gray-600" />
                                                                <span className="text-sm font-medium">{file.name}</span>
                                                                <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(2)} KB)</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveFile(index)}
                                                                className="p-1 hover:bg-red-50 rounded"
                                                            >
                                                                <X className="w-4 h-4 text-red-600" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={handleUploadDocuments}
                                                    disabled={isUploading}
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} Document(s)`}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Uploaded Documents List */}
                                        {uploadedDocuments.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-green-700">Successfully Uploaded ({uploadedDocuments.length})</label>
                                                <div className="space-y-2">
                                                    {uploadedDocuments.map((doc, index) => (
                                                        <div key={index} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                            <span className="text-sm font-medium text-green-900">{doc.title || doc.document_name || 'Document'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation Buttons */}
                                        <div className="flex justify-between pt-6 border-t">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to go back? This will discard the created agreement.")) {
                                                        setCurrentStep(3);
                                                        setCreatedAgreementId(null);
                                                    }
                                                }}
                                                disabled={isUploading}
                                            >
                                                Back
                                            </Button>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        router.push(CG_ROUTES.AGREEMENT);
                                                    }}
                                                    disabled={isUploading}
                                                >
                                                    Skip & Finish
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleFinish}
                                                    disabled={isUploading}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    Finish & View Agreements
                                                </Button>
                                            </div>
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
