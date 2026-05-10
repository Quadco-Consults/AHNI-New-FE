"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
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
    useModifyAgreement,
} from "@/features/contracts-grants/controllers/agreementController";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"; 
import { CG_ROUTES } from "@/constants/RouterConstants";
import { useEffect, useMemo, useState } from "react";
import ServiceLevelAgreementLayout from "./Layout";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetAllJobCategories } from "@/features/modules/controllers/config/jobCategoryController";
import { useGetAllCategories } from "@/features/modules/controllers/config/categoryController";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useGetAllConsultancyApplicants } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

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

// Note: Service types are now fetched from job categories API

// Map agreement types to vendor categories
const categoryMapping = {
    'SLA': 'IT_SERVICES',
    'SECURITY': 'SECURITY_SERVICES',
    'INSURANCE': 'INSURANCE',
    'LEASE': 'PROPERTY_LEASE',
    'HMO': 'HEALTH_SERVICES',
    'TICKETING': 'TRAVEL_SERVICES'
};

export default function CreateAgreement() {
    const form = useForm<TAgreementFormData>({
        resolver: zodResolver(AgreementSchema),
        defaultValues: {
            service_type: undefined, // Job Category - First selection
            service: undefined, // Service Category - Second selection (parent category)
            subcategory: undefined, // Subcategory - Third selection (child category, optional)
            type: "", // Agreement Type - Fourth selection
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

    // State for conditional dropdowns
    const [selectedAgreementType, setSelectedAgreementType] = useState("");
    const [entityOptions, setEntityOptions] = useState<Array<{label: string, value: string}>>([]);
    const [isLoadingEntities, setIsLoadingEntities] = useState(false);

    // Functions to fetch entity options based on agreement type
    const fetchConsultants = async () => {
        setIsLoadingEntities(true);
        try {
            console.log('🔍 Fetching consultants from dropdown endpoint...');

            // ✅ Use dropdown endpoint instead of applicants
            const response = await AxiosWithToken.get('/contract-grants/agreements/consultants_dropdown/');

            console.log('📊 Consultants API Response:', response.data);

            // ✅ Response is direct array
            const consultants = Array.isArray(response.data) ? response.data : [];

            console.log(`✅ Found ${consultants.length} consultants from dropdown`);

            // Backend returns: { value, label, title, grade_level, commencement_date, end_date }
            setEntityOptions(consultants.map((item: any) => ({
                label: item.label,      // Already formatted
                value: item.value,
                title: item.title,
                grade_level: item.grade_level,
                commencement_date: item.commencement_date,
                end_date: item.end_date
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
            console.log('🔍 Fetching facilitators from dropdown endpoint...');

            const response = await AxiosWithToken.get('/contract-grants/agreements/facilitators_dropdown/');

            console.log('📊 Facilitators API Response:', response.data);

            const facilitators = Array.isArray(response.data) ? response.data : [];

            console.log(`✅ Found ${facilitators.length} facilitators from dropdown`);

            setEntityOptions(facilitators.map((item: any) => ({
                label: item.label,
                value: item.value,
                title: item.title,
                grade_level: item.grade_level,
                commencement_date: item.commencement_date,
                end_date: item.end_date
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
            console.log('🔍 Fetching adhoc staff from dropdown endpoint...');

            // ✅ Use correct dropdown endpoint
            const response = await AxiosWithToken.get('/contract-grants/agreements/adhoc_staff_dropdown/');

            console.log('📊 Adhoc Staff API Response:', response.data);

            // ✅ Response is direct array, not paginated
            const adhocStaff = Array.isArray(response.data) ? response.data : [];

            console.log(`✅ Found ${adhocStaff.length} adhoc staff from dropdown`);

            // ✅ Backend already formats data correctly with value/label
            setEntityOptions(adhocStaff.map((item: any) => ({
                label: item.label,      // Already formatted: "Surname, Names - Designation"
                value: item.value,      // Already a string UUID
                name: item.name,
                designation: item.designation,
                assignment_location: item.assignment_location,
                status: item.status
            })));
        } catch (error) {
            console.error('Failed to fetch adhoc staff:', error);
            setEntityOptions([]);
        } finally {
            setIsLoadingEntities(false);
        }
    };

    const fetchVendors = async (agreementType?: string) => {
        setIsLoadingEntities(true);
        try {
            console.log('🔍 Fetching vendors from procurement vendors endpoint...');
            console.log('- Agreement Type:', agreementType);

            // Fetch vendors from procurement endpoint with approved status
            const response = await AxiosWithToken.get('/procurements/vendors/', {
                params: {
                    page: 1,
                    size: 1000,
                    status: 'Approved' // Only fetch approved vendors (note: capital A, rest lowercase)
                }
            });

            console.log('📊 Vendors API Response:', response.data);

            // Handle paginated response
            const vendors = response.data?.data?.results || response.data?.results || [];

            console.log(`✅ Found ${vendors.length} approved vendors`);

            if (vendors.length > 0) {
                // Show ALL approved vendors (no category filtering)
                // Most vendors do multiple things, so let user select from all options
                console.log(`📊 Showing all ${vendors.length} approved vendors`);

                setEntityOptions(vendors.map((vendor: any) => ({
                    label: `${vendor.company_name}${vendor.area_of_specialization ? ` - ${vendor.area_of_specialization}` : ''}`,
                    value: vendor.id,
                    company_name: vendor.company_name,
                    email: vendor.email,
                    phone_number: vendor.phone_number,
                    approved_categories: vendor.approved_categories || []
                })));
            } else {
                console.log('❌ No approved vendors found in system');
                setEntityOptions([{
                    label: 'No approved vendors available. Please register and approve vendors first.',
                    value: ""
                }]);
            }

        } catch (error: any) {
            console.error('❌ Failed to fetch vendors:', error);
            console.error('Error details:', {
                message: error?.message,
                response: error?.response?.data,
                status: error?.response?.status
            });

            const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
            const statusCode = error?.response?.status;

            setEntityOptions([{
                label: `Error loading vendors (${statusCode || 'Network Error'}): ${errorMessage}`,
                value: ""
            }]);
        } finally {
            setIsLoadingEntities(false);
        }
    };

    // Watch for cascade changes
    const selectedJobCategory = form.watch('service_type'); // Job Category - First
    const selectedService = form.watch('service'); // Service Category - Second (parent category)
    const selectedSubcategory = form.watch('subcategory'); // Subcategory - Third (child category)
    const agreementType = form.watch('type'); // Agreement Type - Fourth
    const consultantId = form.watch('consultant_id');
    const facilitatorId = form.watch('facilitator_id');
    const adhocStaffId = form.watch('adhoc_staff_id');
    const vendorId = form.watch('vendor_id');


    useEffect(() => {
        if (agreementType) {
            console.log('Agreement type changed to:', agreementType);
            setSelectedAgreementType(agreementType);
            
            // Clear previous entity selections (but log what we're clearing)
            console.log('🔍 Clearing previous selections...');
            console.log('- Before clearing - Consultant ID:', form.getValues('consultant_id'));
            console.log('- Before clearing - Facilitator ID:', form.getValues('facilitator_id'));
            console.log('- Before clearing - Adhoc Staff ID:', form.getValues('adhoc_staff_id'));
            console.log('- Before clearing - Vendor ID:', form.getValues('vendor_id'));

            // Clear entity selections - use undefined for proper validation
            form.setValue('consultant_id', undefined);
            form.setValue('facilitator_id', undefined);
            form.setValue('adhoc_staff_id', undefined);
            form.setValue('vendor_id', undefined);

            // Clear service fields if switching to staff contracts
            const staffContractTypes = ['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'];
            if (staffContractTypes.includes(agreementType)) {
                console.log('🔄 Switching to staff contract - clearing service fields');
                form.setValue('service', undefined);
                form.setValue('service_type', undefined);
            }

            console.log('✅ Previous selections cleared');

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
                    fetchVendors(agreementType);
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

    const { data: jobCategories, isLoading: isLoadingJobCategories } = useGetAllJobCategories({
        enabled: true,
    });

    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategories({
        page: 1,
        size: 1000,
        enabled: true,
    });

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

        console.log('🔍 Categories API Response:', categories);

        // Handle different possible response structures
        let categoryData = [];

        if (Array.isArray(categories.data)) {
            categoryData = categories.data;
        } else if (categories.data?.results && Array.isArray(categories.data.results)) {
            categoryData = categories.data.results;
        } else if (categories.data?.data && Array.isArray(categories.data.data)) {
            categoryData = categories.data.data;
        } else {
            console.log('⚠️ Unexpected categories data structure:', categories.data);
            return [];
        }

        console.log('📊 Processed category data (total):', categoryData.length);

        // CASCADE FILTER: Filter categories by job_category field AND parent = null (only parent categories)
        if (!selectedJobCategory) {
            // Show only parent categories (no parent)
            const parentCategories = categoryData.filter((category: any) => !category.parent);
            console.log('📊 Showing all parent categories:', parentCategories.length);
            return parentCategories.map((category: any) => ({
                label: category.name,
                value: category.id,
                job_category: category.job_category,
            }));
        }

        // Filter by job_category field matching selected job category AND parent = null
        const filteredCategories = categoryData.filter((category: any) => {
            const hasNoParent = !category.parent;
            const matchesJobCategory = category.job_category === selectedJobCategory;

            console.log(`- Category "${category.name}": job_category=${category.job_category}, parent=${category.parent}, match=${matchesJobCategory && hasNoParent}`);

            return hasNoParent && matchesJobCategory;
        });

        console.log(`📊 Filtered ${filteredCategories.length} parent categories for job category ID: ${selectedJobCategory}`);

        return filteredCategories.map((category: any) => ({
            label: category.name,
            value: category.id,
            job_category: category.job_category,
        }));
    }, [categories, selectedJobCategory]);

    const serviceTypeOptions = useMemo(() => {
        if (!jobCategories?.data) return [];

        console.log('🔍 Job Categories API Response (First Dropdown):', jobCategories);

        // Show all job categories - this is the FIRST selection in cascade
        return jobCategories.data.map(category => ({
            label: category.label,
            value: category.value,
        }));
    }, [jobCategories]);

    // Subcategory options - filter by parent category
    const subcategoryOptions = useMemo(() => {
        if (!categories?.data || !selectedService) return [];

        console.log('🔍 Filtering subcategories for parent category:', selectedService);

        // Handle different possible response structures
        let categoryData = [];

        if (Array.isArray(categories.data)) {
            categoryData = categories.data;
        } else if (categories.data?.results && Array.isArray(categories.data.results)) {
            categoryData = categories.data.results;
        } else if (categories.data?.data && Array.isArray(categories.data.data)) {
            categoryData = categories.data.data;
        }

        // Filter categories where parent = selectedService
        const subcategories = categoryData.filter((category: any) => {
            // Check if parent matches (handle both string ID and object)
            const parentId = typeof category.parent === 'string'
                ? category.parent
                : category.parent?.id;

            const matches = parentId === selectedService;

            if (matches) {
                console.log(`  - Found subcategory: ${category.name} (parent: ${parentId})`);
            }

            return matches;
        });

        console.log(`📊 Found ${subcategories.length} subcategories for parent category`);

        return subcategories.map((category: any) => ({
            label: category.name,
            value: category.id,
            parent: category.parent,
        }));
    }, [categories, selectedService]);

    // CASCADE EFFECT 1: When job category changes, reset downstream selections
    useEffect(() => {
        if (selectedJobCategory) {
            console.log('🔄 Job Category changed to:', selectedJobCategory);
            const currentService = form.getValues('service');

            // If current service is not in the new filtered list, clear it
            if (currentService && !serviceOptions.find(opt => opt.value === currentService)) {
                console.log('🔄 Clearing service category and downstream fields');
                form.setValue('service', undefined);
                form.setValue('subcategory', undefined);
                form.setValue('type', '');
                toast.info('Service category cleared - please reselect based on job category');
            }
        }
    }, [selectedJobCategory, serviceOptions, form]);

    // CASCADE EFFECT 2: When service category changes, reset subcategory and agreement type
    useEffect(() => {
        if (selectedService) {
            console.log('🔄 Service Category changed to:', selectedService);
            const currentSubcategory = form.getValues('subcategory');

            // If current subcategory is not in the new filtered list, clear it
            if (currentSubcategory && !subcategoryOptions.find(opt => opt.value === currentSubcategory)) {
                console.log('🔄 Clearing subcategory and agreement type');
                form.setValue('subcategory', undefined);
                form.setValue('type', '');

                if (subcategoryOptions.length > 0) {
                    toast.info('Please select a subcategory');
                }
            }
        }
    }, [selectedService, subcategoryOptions, form]);

    // CASCADE EFFECT 3: Filter agreement types based on service/subcategory
    const filteredAgreementTypeOptions = useMemo(() => {
        // Use subcategory if available, otherwise use service category
        const categoryToUse = selectedSubcategory || selectedService;

        if (!categoryToUse) {
            // If nothing selected, show all agreement types
            return agreementTypeOptions;
        }

        // Find the selected category
        let categoryName = '';
        if (selectedSubcategory) {
            const subcatData = subcategoryOptions.find(opt => opt.value === selectedSubcategory);
            categoryName = subcatData?.label?.toLowerCase() || '';
            console.log('🔍 Filtering agreement types for subcategory:', categoryName);
        } else {
            const serviceData = serviceOptions.find(opt => opt.value === selectedService);
            categoryName = serviceData?.label?.toLowerCase() || '';
            console.log('🔍 Filtering agreement types for service category:', categoryName);
        }

        // Filter agreement types based on category name
        const filtered = agreementTypeOptions.filter(agreementType => {
            const category = agreementType.category;

            // Map categories to agreement type categories
            if (categoryName.includes('staff') || categoryName.includes('personnel') || categoryName.includes('human resource')) {
                return category === 'Staff Contracts';
            }

            if (categoryName.includes('it') || categoryName.includes('tech') || categoryName.includes('software')) {
                return agreementType.value === 'SLA';
            }

            if (categoryName.includes('security')) {
                return agreementType.value === 'SECURITY';
            }

            if (categoryName.includes('insurance')) {
                return agreementType.value === 'INSURANCE';
            }

            if (categoryName.includes('lease') || categoryName.includes('property') || categoryName.includes('rent')) {
                return agreementType.value === 'LEASE';
            }

            if (categoryName.includes('health') || categoryName.includes('medical') || categoryName.includes('hmo')) {
                return agreementType.value === 'HMO';
            }

            if (categoryName.includes('travel') || categoryName.includes('ticket')) {
                return agreementType.value === 'TICKETING';
            }

            // Default: show service agreements for non-staff services
            return category === 'Service Agreements';
        });

        console.log(`📊 Filtered ${filtered.length} agreement types for category "${categoryName}"`);
        return filtered;
    }, [selectedService, selectedSubcategory, serviceOptions, subcategoryOptions]);

    // Debug: Log all form values in real-time
    console.log('🔍 Real-time Form Values:');
    console.log('- Job Category (service_type):', selectedJobCategory);
    console.log('- Service Category (service):', selectedService);
    console.log('- Subcategory:', selectedSubcategory);
    console.log('- Agreement Type:', agreementType);
    console.log('- Consultant ID:', consultantId);
    console.log('- Facilitator ID:', facilitatorId);
    console.log('- Adhoc Staff ID:', adhocStaffId);
    console.log('- Vendor ID:', vendorId);
    console.log('- Service Options Count:', serviceOptions.length);
    console.log('- Subcategory Options Count:', subcategoryOptions.length);
    console.log('- Entity Options Count:', entityOptions.length);

    const { createAgreement, isLoading: isCreateLoading } =
        useCreateAgreement();

    const { updateAgreement, isLoading: isModifyLoading } =
        useModifyAgreement(id || "");

    // Debug payload validator based on your analysis
    const debugContractPayload = (payload: any) => {
        console.group("🔍 Contract Payload Debug");

        // Check entity associations (API uses field names without _id suffix)
        const entities = {
            consultant: payload.consultant,
            vendor: payload.vendor,
            facilitator: payload.facilitator,
            adhoc_staff: payload.adhoc_staff
        };

        console.log("📋 Entity Association Check:");
        Object.entries(entities).forEach(([key, value]) => {
            const hasValue = value && value !== '' && value !== null && value !== undefined;
            console.log(`- ${key}: ${hasValue ? `✅ ${value}` : '❌ Not set'}`);
        });

        // Count how many entities are set
        const setEntities = Object.entries(entities).filter(([_, value]) =>
            value && value !== '' && value !== null && value !== undefined
        );

        console.log(`\n🎯 Entity Count: ${setEntities.length}/1 required`);

        if (setEntities.length === 0) {
            console.error("❌ CRITICAL: No entity association found!");
            console.log("💡 Fix: Ensure exactly ONE entity field is set based on agreement type");
        } else if (setEntities.length > 1) {
            console.warn("⚠️ WARNING: Multiple entities set - only one should be active");
            setEntities.forEach(([key, value]) => console.log(`  - ${key}: ${value}`));
        } else {
            console.log("✅ VALID: Exactly one entity association found");
            console.log(`  - Active entity: ${setEntities[0][0]} = ${setEntities[0][1]}`);
        }

        // Agreement type validation
        console.log(`\n📝 Agreement Details:`);
        console.log(`- Type: ${payload.type}`);
        console.log(`- Service: ${payload.service}`);
        console.log(`- Status: ${payload.status || 'DRAFT (default)'}`);
        console.log(`- Start Date: ${payload.start_date}`);
        console.log(`- End Date: ${payload.end_date}`);

        console.groupEnd();
        return setEntities.length === 1;
    };

    const onSubmit: SubmitHandler<TAgreementFormData> = async (data) => {
        try {
            // Clean up data based on agreement type
            const staffContractTypes = ['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'];
            const isStaffContract = staffContractTypes.includes(data.type);

            // Transform data to match backend API requirements
            const transformedData: any = {
                // Include core fields (excluding entity _id fields)
                type: data.type,
                start_date: data.start_date,
                end_date: data.end_date,
                contract_cost: data.contract_cost,
                location: data.location,
                // Backend requires 'service' field - provide meaningful defaults for staff contracts
                service: isStaffContract
                    ? `${data.type.charAt(0) + data.type.slice(1).toLowerCase()} Services`  // e.g., "Consultant Services"
                    : data.service || "Service Agreement",
            };

            // Clean up entity fields - use correct API field names (remove _id suffix)
            // API expects: consultant, vendor, facilitator, adhoc_staff (NOT consultant_id, vendor_id, etc.)
            // Only include the entity field that matches the agreement type
            if (data.type === 'CONSULTANT' && data.consultant_id) {
                transformedData.consultant = data.consultant_id;
            } else if (data.type === 'FACILITATOR' && data.facilitator_id) {
                transformedData.facilitator = data.facilitator_id;
            } else if (data.type === 'ADHOC_STAFF' && data.adhoc_staff_id) {
                transformedData.adhoc_staff = data.adhoc_staff_id;
            } else if (['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(data.type) && data.vendor_id) {
                transformedData.vendor = data.vendor_id;
            }

            console.log('🔍 Agreement Form Submission Data:');
            console.log('- Is Staff Contract:', isStaffContract);
            console.log('- Original Service:', data.service);
            console.log('- Transformed Service:', transformedData.service);
            console.log('- Location:', transformedData.location);
            console.log('- Agreement Type:', transformedData.type);
            console.log('- Full API Payload:', transformedData);

            // Debug payload validation based on your analysis
            const isPayloadValid = debugContractPayload(transformedData);
            if (!isPayloadValid) {
                toast.error('Entity association validation failed - check console for details');
                return;
            }

            // Enhanced validation for entity selection
            const { type } = transformedData;
            let entitySelected = false;
            let selectedEntityId = '';
            let selectedEntityType = '';

            console.log('🔍 Entity Validation Debug:');
            console.log('- Agreement Type:', type);
            console.log('- Consultant Field:', transformedData.consultant);
            console.log('- Facilitator Field:', transformedData.facilitator);
            console.log('- Adhoc Staff Field:', transformedData.adhoc_staff);
            console.log('- Vendor Field:', transformedData.vendor);
            console.log('- Original Form Data:', {
                consultant_id: data.consultant_id,
                facilitator_id: data.facilitator_id,
                adhoc_staff_id: data.adhoc_staff_id,
                vendor_id: data.vendor_id
            });
            console.log('- Available Entity Options:', entityOptions.length);
            console.log('- Entity Options Details:', entityOptions);

            if (type === "CONSULTANT") {
                entitySelected = !!transformedData.consultant;
                selectedEntityId = transformedData.consultant || '';
                selectedEntityType = 'Consultant';
            } else if (type === "FACILITATOR") {
                entitySelected = !!transformedData.facilitator;
                selectedEntityId = transformedData.facilitator || '';
                selectedEntityType = 'Facilitator';
            } else if (type === "ADHOC_STAFF") {
                entitySelected = !!transformedData.adhoc_staff;
                selectedEntityId = transformedData.adhoc_staff || '';
                selectedEntityType = 'Adhoc Staff';
            } else if (["SLA", "SECURITY", "INSURANCE", "LEASE", "HMO", "TICKETING"].includes(type)) {
                entitySelected = !!transformedData.vendor;
                selectedEntityId = transformedData.vendor || '';
                selectedEntityType = 'Vendor';
            }

            console.log('- Entity Selected:', entitySelected);
            console.log('- Selected Entity ID:', selectedEntityId);
            console.log('- Selected Entity Type:', selectedEntityType);

            if (!entitySelected) {
                if (entityOptions.length === 0) {
                    toast.error(`No ${selectedEntityType.toLowerCase()}s available. Please ensure there are eligible candidates for this agreement type.`);
                } else {
                    toast.error(`Please select a ${selectedEntityType} for this agreement type.`);
                }
                return;
            }

            if (id) {
                await updateAgreement(transformedData);
                toast.success("Agreement Updated");
                router.push(CG_ROUTES.AGREEMENT);
            } else {
                // Store transformed agreement data in session storage for the summary step
                sessionStorage.setItem('agreementFormData', JSON.stringify(transformedData));
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

                {/* Workflow Information Banner */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-medium text-green-800 mb-2">✅ Enhanced Agreement Workflow</h4>
                            <p className="text-green-700 text-sm mb-2">
                                The agreement creation process has been enhanced with automatic entity management:
                            </p>
                            <div className="text-green-700 text-xs space-y-1">
                                <p>• <strong>Automatic Entity Creation:</strong> Staff records are automatically created when applications are hired</p>
                                <p>• <strong>Direct Agreement Creation:</strong> Use "Create Agreement" buttons on hired applications for seamless workflow</p>
                                <p>• <strong>Manual Creation:</strong> This page is still available for creating agreements with existing entities</p>
                                <p>• <strong>Validation Fixed:</strong> All agreements now properly satisfy entity association requirements</p>
                                <p>• <strong>Status Handling:</strong> New agreements default to 'DRAFT' status automatically - no status input required</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Card>
                    <CardContent className="p-5">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-2 gap-8">
                                    {/* CASCADE STEP 1: Job Category (First Selection) */}
                                    <div className="space-y-2">
                                        <FormSelect
                                            label="1️⃣ Job Category"
                                            name="service_type"
                                            placeholder={
                                                isLoadingJobCategories
                                                    ? "Loading job categories..."
                                                    : "Select Job Category"
                                            }
                                            options={serviceTypeOptions || []}
                                            required
                                            disabled={isLoadingJobCategories}
                                        />

                                        {/* Job categories info */}
                                        <div className="text-xs text-gray-600">
                                            {isLoadingJobCategories ? (
                                                <span className="text-blue-600">🔄 Loading...</span>
                                            ) : serviceTypeOptions.length > 0 ? (
                                                <span className="text-green-600">✅ {serviceTypeOptions.length} available</span>
                                            ) : (
                                                <span className="text-yellow-600">⚠️ None available</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* CASCADE STEP 2: Service Category (Second - Parent Category) */}
                                    <div className="space-y-2">
                                        <FormSelect
                                            label="2️⃣ Service Category"
                                            name="service"
                                            placeholder={
                                                isLoadingCategories
                                                    ? "Loading..."
                                                    : selectedJobCategory
                                                        ? serviceOptions.length > 0
                                                            ? `Select from ${serviceOptions.length} categories`
                                                            : "No categories for this job category"
                                                        : "Select Job Category first"
                                            }
                                            options={serviceOptions || []}
                                            required
                                            disabled={isLoadingCategories || !selectedJobCategory}
                                        />

                                        <div className="text-xs text-gray-600">
                                            {isLoadingCategories ? (
                                                <span className="text-blue-600">🔄 Loading...</span>
                                            ) : selectedJobCategory ? (
                                                serviceOptions.length > 0 ? (
                                                    <span className="text-green-600">✅ {serviceOptions.length} filtered by job category</span>
                                                ) : (
                                                    <span className="text-yellow-600">⚠️ No matches found</span>
                                                )
                                            ) : (
                                                <span className="text-gray-500">📋 Waiting for job category</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* CASCADE STEP 3: Subcategory (Third - Optional) */}
                                    {selectedService && subcategoryOptions.length > 0 && (
                                        <div className="space-y-2">
                                            <FormSelect
                                                label="3️⃣ Subcategory (Optional)"
                                                name="subcategory"
                                                placeholder={`Select from ${subcategoryOptions.length} subcategories`}
                                                options={subcategoryOptions || []}
                                                disabled={isLoadingCategories}
                                            />

                                            <div className="text-xs text-gray-600">
                                                <span className="text-green-600">✅ {subcategoryOptions.length} subcategories available</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* CASCADE STEP 4: Agreement Type (Fourth) */}
                                    <div className="space-y-2">
                                        <FormSelect
                                            label={subcategoryOptions.length > 0 ? "4️⃣ Agreement Type" : "3️⃣ Agreement Type"}
                                            name="type"
                                            placeholder={
                                                selectedService
                                                    ? filteredAgreementTypeOptions.length > 0
                                                        ? `Select from ${filteredAgreementTypeOptions.length} types`
                                                        : "No matching agreement types"
                                                    : "Select Service Category first"
                                            }
                                            options={filteredAgreementTypeOptions || []}
                                            required
                                            disabled={!selectedService}
                                        />

                                        <div className="text-xs text-gray-600">
                                            {selectedService ? (
                                                filteredAgreementTypeOptions.length > 0 ? (
                                                    <span className="text-green-600">
                                                        ✅ {filteredAgreementTypeOptions.length} filtered by {selectedSubcategory ? 'subcategory' : 'category'}
                                                    </span>
                                                ) : (
                                                    <span className="text-yellow-600">⚠️ No matches</span>
                                                )
                                            ) : (
                                                <span className="text-gray-500">📋 Waiting for category selection</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Information banner for staff contracts */}
                                    {['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'].includes(selectedAgreementType) && (
                                        <div className="col-span-2">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-blue-800 mb-2">✅ Cascading Selection Complete</h4>
                                                        <p className="text-blue-700 text-sm">
                                                            You've selected a {selectedAgreementType === 'CONSULTANT' ? 'consultant' :
                                                                selectedAgreementType === 'FACILITATOR' ? 'facilitator' :
                                                                'adhoc staff'} contract based on your job category and service category selections.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Conditional Entity Dropdown */}
                                    {selectedAgreementType && (
                                        <div className="space-y-2">
                                            <FormSelect
                                                label={
                                                    selectedAgreementType === 'CONSULTANT' ? 'Select Consultant' :
                                                    selectedAgreementType === 'FACILITATOR' ? 'Select Facilitator' :
                                                    selectedAgreementType === 'ADHOC_STAFF' ? 'Select Adhoc Staff' :
                                                    'Select Vendor'
                                                }
                                                name={
                                                    selectedAgreementType === 'CONSULTANT' ? 'consultant_id' :
                                                    selectedAgreementType === 'FACILITATOR' ? 'facilitator_id' :
                                                    selectedAgreementType === 'ADHOC_STAFF' ? 'adhoc_staff_id' :
                                                    'vendor_id'
                                                }
                                                placeholder={
                                                    isLoadingEntities ?
                                                        `Loading ${selectedAgreementType === 'CONSULTANT' ? 'consultants' :
                                                                   selectedAgreementType === 'FACILITATOR' ? 'facilitators' :
                                                                   selectedAgreementType === 'ADHOC_STAFF' ? 'adhoc staff' :
                                                                   'vendors'}...` :
                                                        `Select ${selectedAgreementType === 'CONSULTANT' ? 'Consultant' :
                                                                  selectedAgreementType === 'FACILITATOR' ? 'Facilitator' :
                                                                  selectedAgreementType === 'ADHOC_STAFF' ? 'Adhoc Staff' :
                                                                  'Vendor'}`
                                                }
                                                options={entityOptions || []}
                                                required
                                                disabled={isLoadingEntities}
                                            />

                                            {/* Status indicator - simple count like other fields */}
                                            <div className="text-xs text-gray-600">
                                                {isLoadingEntities ? (
                                                    <span className="text-blue-600">🔄 Loading...</span>
                                                ) : entityOptions.length > 0 ? (
                                                    <span className="text-green-600">✅ {entityOptions.length} available</span>
                                                ) : (
                                                    <span className="text-yellow-600">⚠️ None available</span>
                                                )}
                                            </div>
                                        </div>
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

                                {/* SLA-Specific Fields (only show when type='SLA') */}
                                {agreementType === 'SLA' && (
                                    <div className="space-y-6">
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Service Level Agreement (SLA) Specifications
                                            </h3>
                                            <p className="text-sm text-purple-700 mb-4">
                                                Define the performance commitments, KPIs, and penalties for this SLA.
                                            </p>

                                            <div className="grid grid-cols-2 gap-6">
                                                {/* Service Level Commitments */}
                                                <div className="col-span-2">
                                                    <h4 className="font-medium text-purple-800 mb-3">Service Level Commitments</h4>
                                                </div>

                                                <FormInput
                                                    label="Response Time SLA"
                                                    name="response_time"
                                                    placeholder='e.g., "4 hours for critical issues"'
                                                />

                                                <FormInput
                                                    label="Resolution Time SLA"
                                                    name="resolution_time"
                                                    placeholder='e.g., "24 hours for critical issues"'
                                                />

                                                <FormInput
                                                    type="number"
                                                    label="Uptime SLA (%)"
                                                    name="uptime_percentage"
                                                    placeholder="e.g., 99.9"
                                                    step="0.01"
                                                />

                                                <FormInput
                                                    label="Service Hours"
                                                    name="service_hours"
                                                    placeholder='e.g., "24/7" or "Mon-Fri 9am-5pm"'
                                                />

                                                {/* Financial Terms */}
                                                <div className="col-span-2">
                                                    <h4 className="font-medium text-purple-800 mb-3 mt-4">Financial Terms</h4>
                                                </div>

                                                <FormInput
                                                    type="number"
                                                    label="Monthly Cost"
                                                    name="monthly_cost"
                                                    placeholder="Enter monthly service cost"
                                                />

                                                <FormSelect
                                                    label="Payment Frequency"
                                                    name="payment_frequency"
                                                    placeholder="Select payment frequency"
                                                    options={[
                                                        { label: 'Monthly', value: 'MONTHLY' },
                                                        { label: 'Quarterly', value: 'QUARTERLY' },
                                                        { label: 'Annually', value: 'ANNUALLY' },
                                                        { label: 'Milestone-based', value: 'MILESTONE' },
                                                        { label: 'On Demand', value: 'ON_DEMAND' },
                                                    ]}
                                                />

                                                {/* Performance & Penalties */}
                                                <div className="col-span-2">
                                                    <h4 className="font-medium text-purple-800 mb-3 mt-4">Performance & Penalties</h4>
                                                </div>

                                                <div className="col-span-2">
                                                    <FormInput
                                                        label="Key Deliverables"
                                                        name="key_deliverables"
                                                        placeholder="Describe key deliverables (optional)"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Enter deliverables or leave blank to add later
                                                    </p>
                                                </div>

                                                <div className="col-span-2">
                                                    <FormInput
                                                        label="Performance KPIs"
                                                        name="performance_kpis"
                                                        placeholder="Describe performance KPIs (optional)"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Enter KPIs or leave blank to add later
                                                    </p>
                                                </div>

                                                <div className="col-span-2">
                                                    <FormInput
                                                        label="Penalty Terms"
                                                        name="penalty_terms"
                                                        placeholder="Describe penalties for SLA breaches (optional)"
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <FormInput
                                                        label="Escalation Matrix"
                                                        name="escalation_matrix"
                                                        placeholder="Describe escalation contacts (optional)"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Enter contact hierarchy for issue escalation
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                                <p className="text-xs text-yellow-800">
                                                    <strong>Note:</strong> SLA-specific fields are optional during creation.
                                                    You can fill them in later by editing the agreement.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Entity Availability Warning */}
                                {selectedAgreementType && !isLoadingEntities && entityOptions.length === 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-blue-800 mb-2">ℹ️ Workflow Information</h4>
                                                <p className="text-blue-700 text-sm mb-2">
                                                    No {selectedAgreementType === 'CONSULTANT' ? 'consultants' :
                                                        selectedAgreementType === 'FACILITATOR' ? 'facilitators' :
                                                        selectedAgreementType === 'ADHOC_STAFF' ? 'adhoc staff' :
                                                        'vendors'} are currently available for agreements.
                                                </p>
                                                <p className="text-blue-700 text-sm mb-2">
                                                    <strong>New Workflow Process:</strong>
                                                </p>
                                                <div className="text-blue-700 text-xs space-y-1">
                                                    {selectedAgreementType === 'ADHOC_STAFF' && (
                                                        <>
                                                            <p>1. Candidates apply for adhoc positions</p>
                                                            <p>2. Applications progress: APPLIED → SHORTLISTED → INTERVIEWED → ACCEPTED → PREFERRED → CONTRACT_ISSUED → CONTRACT_ACCEPTED → HIRED</p>
                                                            <p>3. When hired, staff records are automatically created</p>
                                                            <p>4. Use the new "Create Agreement" button on hired applications</p>
                                                            <p>5. Or create agreements here for already hired staff</p>
                                                        </>
                                                    )}
                                                    {selectedAgreementType === 'CONSULTANT' && (
                                                        <>
                                                            <p>1. Follow the consultant application workflow</p>
                                                            <p>2. Ensure consultants reach HIRED status</p>
                                                            <p>3. Consultant entities will be automatically created</p>
                                                        </>
                                                    )}
                                                    {['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(selectedAgreementType) && (
                                                        <div>
                                                            <p>Register and approve vendors in the appropriate category through the vendor management system:</p>
                                                            <div className="mt-1 space-y-1">
                                                                {selectedAgreementType === 'SLA' && <p>• Register vendors under "IT Services" category and complete approval process</p>}
                                                                {selectedAgreementType === 'SECURITY' && <p>• Register vendors under "Security Services" category and complete approval process</p>}
                                                                {selectedAgreementType === 'INSURANCE' && <p>• Register vendors under "Insurance" category and complete approval process</p>}
                                                                {selectedAgreementType === 'LEASE' && <p>• Register vendors under "Property Lease" category and complete approval process</p>}
                                                                {selectedAgreementType === 'HMO' && <p>• Register vendors under "Health Services" category and complete approval process</p>}
                                                                {selectedAgreementType === 'TICKETING' && <p>• Register vendors under "Travel Services" category and complete approval process</p>}
                                                                <p>• Only approved vendors will appear in the agreement creation dropdown</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Form Summary Section */}
                                {(form.watch('location') || (!['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'].includes(selectedAgreementType) && (form.watch('service') || form.watch('service_type')))) && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-medium text-blue-800 mb-3">📋 Agreement Summary</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            {/* Only show service fields for service agreements */}
                                            {!['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'].includes(selectedAgreementType) && (
                                                <>
                                                    <div>
                                                        <label className="font-medium text-blue-700">Service:</label>
                                                        <p className="text-blue-600">
                                                            {serviceOptions.find((opt: {label: string, value: string}) => opt.value === form.watch('service'))?.label || 'Not selected'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label className="font-medium text-blue-700">Service Type (Job Category):</label>
                                                        <p className="text-blue-600">
                                                            {serviceTypeOptions.find(opt => opt.value === form.watch('service_type'))?.label || 'Not selected'}
                                                        </p>
                                                    </div>
                                                </>
                                            )}

                                            {/* Agreement Type for staff contracts */}
                                            {['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'].includes(selectedAgreementType) && (
                                                <div>
                                                    <label className="font-medium text-blue-700">Agreement Type:</label>
                                                    <p className="text-blue-600">
                                                        {agreementTypeOptions.find(opt => opt.value === selectedAgreementType)?.label || 'Not selected'} Contract
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <label className="font-medium text-blue-700">Location:</label>
                                                <p className="text-blue-600">
                                                    {locationOptions.find(opt => opt.value === form.watch('location'))?.label || 'Not selected'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-5">
                                    {/* Debug button to check current form values */}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const currentValues = form.getValues();
                                            console.log('🔍 Current Form Values (Debug):', currentValues);
                                            alert('Check console for current form values');
                                        }}
                                    >
                                        Debug Form Values
                                    </Button>

                                    {/* Network connectivity test button */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            console.log('🔍 Running Network Diagnostics...');

                                            // Check localStorage token
                                            const token = localStorage.getItem('token');
                                            console.log('- Token in localStorage:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');

                                            // Test API connectivity
                                            try {
                                                const response = await AxiosWithToken.get('/auth/me/');
                                                console.log('✅ API Test - Auth Check:', response.status);
                                                toast.success('Network connectivity: OK');
                                            } catch (error: any) {
                                                console.log('❌ API Test - Auth Check Failed:', error);
                                                if (error?.response?.status === 401) {
                                                    toast.error('Authentication required - please login');
                                                } else if (error?.message?.includes('Network Error')) {
                                                    toast.error('Network connectivity issue');
                                                } else {
                                                    toast.error(`API Error: ${error?.message || 'Unknown error'}`);
                                                }
                                            }

                                            // Test specific API endpoints used by the form
                                            try {
                                                console.log('🔍 Testing Agreement API endpoints...');
                                                const endpoints = [
                                                    '/modules/locations/',
                                                    '/modules/job-categories/',
                                                    '/modules/categories/'
                                                ];

                                                for (const endpoint of endpoints) {
                                                    try {
                                                        await AxiosWithToken.get(`${endpoint}?page=1&size=1`);
                                                        console.log(`✅ Endpoint ${endpoint}: OK`);
                                                    } catch (endpointError: any) {
                                                        console.log(`❌ Endpoint ${endpoint}: ${endpointError?.response?.status || endpointError?.message}`);
                                                    }
                                                }

                                                // Discover available applicant statuses
                                                try {
                                                    console.log('🔍 Discovering available applicant statuses...');
                                                    const applicantsResponse = await AxiosWithToken.get('/contract-grants/consultancy/applicants/?page=1&size=100');
                                                    if (applicantsResponse.data?.data?.results) {
                                                        const allStatuses = [...new Set(applicantsResponse.data.data.results.map((r: any) => r.status))];
                                                        console.log('✅ Available applicant statuses:', allStatuses);
                                                        toast.success(`Found ${allStatuses.length} valid status types: ${allStatuses.join(', ')}`);
                                                    }
                                                } catch (statusError: any) {
                                                    console.log('❌ Could not discover applicant statuses:', statusError?.response?.data || statusError?.message);
                                                }
                                            } catch (error) {
                                                console.log('❌ Endpoint testing failed:', error);
                                            }
                                        }}
                                    >
                                        Test Network
                                    </Button>

                                    {/* Quick Adhoc Contract Creator */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className="bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-700"
                                        onClick={async () => {
                                            try {
                                                console.log('🚀 Creating Quick Adhoc Contract...');
                                                toast.info('Creating quick adhoc contract with default values...');

                                                // Get current date for contract dates
                                                const today = new Date();
                                                const startDate = today.toISOString().split('T')[0];
                                                const endDate = new Date(today.setMonth(today.getMonth() + 6)).toISOString().split('T')[0];

                                                // Get available adhoc staff
                                                let adhocStaffId = null;
                                                try {
                                                    const staffResponse = await AxiosWithToken.get('/contract-grants/consultancy/applicants/', {
                                                        params: { page: 1, size: 5, status: 'HIRED' }
                                                    });

                                                    if (staffResponse.data?.data?.results?.length > 0) {
                                                        adhocStaffId = staffResponse.data.data.results[0].id;
                                                        console.log('✅ Found adhoc staff:', adhocStaffId);
                                                    }
                                                } catch (staffError) {
                                                    console.log('❌ Could not find hired adhoc staff, will create mock contract');
                                                }

                                                // Create test contract payload based on your analysis
                                                const quickContractPayload = {
                                                    service: "Adhoc Staff Services",
                                                    type: "ADHOC_STAFF",
                                                    start_date: startDate,
                                                    end_date: endDate,
                                                    contract_cost: "150000",
                                                    location: locationOptions[0]?.value || "test-location",
                                                    // Critical: Set ONLY the relevant entity field
                                                    consultant_id: undefined,
                                                    vendor_id: undefined,
                                                    facilitator_id: undefined,
                                                    adhoc_staff_id: adhocStaffId || "test-adhoc-staff-123"
                                                };

                                                console.log('🔍 Quick Contract Payload:', quickContractPayload);

                                                // Validate the payload
                                                const isValid = debugContractPayload(quickContractPayload);
                                                if (!isValid) {
                                                    toast.error('Quick contract validation failed - check console');
                                                    return;
                                                }

                                                // Try to create the contract
                                                const response = await AxiosWithToken.post('/contract-grants/agreements/', quickContractPayload);
                                                console.log('✅ Quick Contract Created:', response.data);
                                                toast.success(`Quick adhoc contract created successfully! ID: ${response.data?.id || 'N/A'}`);

                                            } catch (error: any) {
                                                console.error('❌ Quick Contract Error:', error);
                                                const errorMsg = error?.response?.data?.message || error?.message || 'Unknown error';
                                                toast.error(`Quick contract failed: ${errorMsg}`);
                                            }
                                        }}
                                    >
                                        🚀 Quick Adhoc Contract
                                    </Button>

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
                                        disabled={
                                            selectedAgreementType !== '' &&
                                            !isLoadingEntities &&
                                            entityOptions.length === 0
                                        }
                                    >
                                        {selectedAgreementType && !isLoadingEntities && entityOptions.length === 0
                                            ? 'No Candidates Available'
                                            : 'Next'
                                        }
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
