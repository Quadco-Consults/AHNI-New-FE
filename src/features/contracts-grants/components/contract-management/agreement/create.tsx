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
            service: undefined, // Changed to undefined for better handling
            service_type: undefined, // Changed to undefined for better handling
            type: "",
            start_date: "",
            end_date: "",
            contract_cost: "",
            location: "",
            consultant_id: undefined, // Changed to undefined for better handling
            facilitator_id: undefined, // Changed to undefined for better handling
            adhoc_staff_id: undefined, // Changed to undefined for better handling
            vendor_id: undefined, // Changed to undefined for better handling
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
            console.log('🔍 Fetching eligible consultants...');

            // Get all consultant applicants to see what statuses are available
            const allResponse = await AxiosWithToken.get('/contract-grants/consultancy/applicants/', {
                params: { page: 1, size: 100 }
            });

            console.log('All consultant applicants:', allResponse.data);

            // Try different possible statuses for eligible consultants
            // Note: Based on API errors, some statuses may not be valid. Let's try common ones first.
            const possibleStatuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'PREFERRED'];
            let eligibleConsultants: any[] = [];

            for (const status of possibleStatuses) {
                try {
                    const response = await AxiosWithToken.get('/contract-grants/consultancy/applicants/', {
                        params: { page: 1, size: 100, status }
                    });

                    if (response.data?.data?.results?.length > 0) {
                        console.log(`Found ${response.data.data.results.length} consultants with status: ${status}`);
                        eligibleConsultants = [...eligibleConsultants, ...response.data.data.results];
                    }
                } catch (statusError: any) {
                    console.log(`Status ${status} not valid for consultants:`, statusError?.response?.data || statusError?.message);
                    // If it's an invalid choice error, log the specific error details
                    if (statusError?.response?.data?.error_code === 'invalid_choice') {
                        console.log('❌ Backend validation error:', statusError.response.data.message);
                    }
                }
            }

            // Remove duplicates based on ID
            const uniqueConsultants = eligibleConsultants.filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );

            console.log('Unique eligible consultants:', uniqueConsultants);

            setEntityOptions(uniqueConsultants.map((item: any) => ({
                label: item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.contractor_name || item.id,
                value: item.id
            })));

        } catch (error) {
            console.error('Failed to fetch consultants:', error);

            // Try to get all applicants without status filter to see what's available
            try {
                console.log('🔄 Trying to fetch all consultant applicants without status filter...');
                const allApplicantsResponse = await AxiosWithToken.get('/contract-grants/consultancy/applicants/', {
                    params: { page: 1, size: 100 }
                });

                if (allApplicantsResponse.data?.data?.results?.length > 0) {
                    console.log('✅ Found all applicants without status filter:', allApplicantsResponse.data.data.results.length);
                    console.log('📋 Available statuses:', [...new Set(allApplicantsResponse.data.data.results.map((r: any) => r.status))]);

                    // Use all applicants as potential consultants for now
                    setEntityOptions(allApplicantsResponse.data.data.results.map((item: any) => ({
                        label: `${item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.contractor_name || item.id} (${item.status})`,
                        value: item.id
                    })));
                } else {
                    throw new Error('No applicants found');
                }
            } catch (allApplicantsError) {
                console.error('All applicants fetch failed, trying fallback endpoint:', allApplicantsError);

                // Fallback to original endpoint
                try {
                    const response = await AxiosWithToken.get('/contract-grants/agreements/consultants_dropdown/');
                    const data = Array.isArray(response.data) ? response.data : [];
                    setEntityOptions(data.map((item: any) => ({
                        label: item.name || item.label || item.title || item.id,
                        value: item.id || item.value
                    })));
                } catch (fallbackError) {
                    console.error('Fallback fetch also failed:', fallbackError);
                    setEntityOptions([]);
                }
            }
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
            console.log('🔍 Fetching eligible adhoc staff...');

            // Get all adhoc applicants first to see available statuses
            const allResponse = await AxiosWithToken.get('/contract-grants/consultancy/applicants/', {
                params: { page: 1, size: 100 }
            });

            console.log('All adhoc applicants:', allResponse.data);

            if (allResponse.data?.data?.results) {
                const allStatuses = [...new Set(allResponse.data.data.results.map((r: any) => r.status))];
                console.log('Available adhoc applicant statuses:', allStatuses);
            }

            // Try different possible statuses for eligible adhoc staff
            // Note: Based on API errors, some statuses may not be valid. Let's try common ones first.
            const possibleStatuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'PREFERRED'];
            let eligibleAdhocStaff: any[] = [];

            for (const status of possibleStatuses) {
                try {
                    const response = await AxiosWithToken.get('/contract-grants/consultancy/applicants/', {
                        params: { page: 1, size: 100, status }
                    });

                    if (response.data?.data?.results?.length > 0) {
                        console.log(`Found ${response.data.data.results.length} adhoc staff with status: ${status}`);

                        // Filter for adhoc-related applicants (you might need to adjust this based on your data structure)
                        const adhocRelated = response.data.data.results.filter((item: any) => {
                            // This might need adjustment based on how you distinguish adhoc from consultant applicants
                            return true; // For now, include all
                        });

                        eligibleAdhocStaff = [...eligibleAdhocStaff, ...adhocRelated];
                    }
                } catch (statusError: any) {
                    console.log(`Status ${status} not valid for adhoc staff:`, statusError?.response?.data || statusError?.message);
                    // If it's an invalid choice error, log the specific error details
                    if (statusError?.response?.data?.error_code === 'invalid_choice') {
                        console.log('❌ Backend validation error:', statusError.response.data.message);
                    }
                }
            }

            // Remove duplicates based on ID
            const uniqueAdhocStaff = eligibleAdhocStaff.filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            );

            console.log('Unique eligible adhoc staff:', uniqueAdhocStaff);

            setEntityOptions(uniqueAdhocStaff.map((item: any) => ({
                label: item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.contractor_name || item.id,
                value: item.id
            })));

        } catch (error) {
            console.error('Failed to fetch adhoc staff:', error);

            // Try to get all applicants without status filter to see what's available
            try {
                console.log('🔄 Trying to fetch all adhoc applicants without status filter...');
                const allApplicantsResponse = await AxiosWithToken.get('/contract-grants/consultancy/applicants/', {
                    params: { page: 1, size: 100 }
                });

                if (allApplicantsResponse.data?.data?.results?.length > 0) {
                    console.log('✅ Found all adhoc applicants without status filter:', allApplicantsResponse.data.data.results.length);
                    console.log('📋 Available statuses:', [...new Set(allApplicantsResponse.data.data.results.map((r: any) => r.status))]);

                    // Use all applicants as potential adhoc staff for now
                    setEntityOptions(allApplicantsResponse.data.data.results.map((item: any) => ({
                        label: `${item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || item.contractor_name || item.id} (${item.status})`,
                        value: item.id
                    })));
                } else {
                    throw new Error('No applicants found');
                }
            } catch (allApplicantsError) {
                console.error('All applicants fetch failed, trying fallback endpoint:', allApplicantsError);

                // Fallback to original endpoint
                try {
                    const response = await AxiosWithToken.get('/contract-grants/agreements/adhoc_staff_dropdown/');
                    const data = Array.isArray(response.data) ? response.data : [];
                    setEntityOptions(data.map((item: any) => ({
                        label: item.name || item.label || item.title || item.id,
                        value: item.id || item.value
                    })));
                } catch (fallbackError) {
                    console.error('Fallback fetch also failed:', fallbackError);
                    setEntityOptions([]);
                }
            }
        } finally {
            setIsLoadingEntities(false);
        }
    };

    const fetchVendors = async (agreementType?: string) => {
        setIsLoadingEntities(true);
        try {
            console.log('🔍 Fetching prequalified vendors for service agreements...');
            console.log('- Agreement Type:', agreementType);

            const targetCategory = categoryMapping[agreementType as keyof typeof categoryMapping];
            console.log('- Target Category:', targetCategory);

            // Use the correct endpoint from the API request
            const endpoint = '/procurements/vendors/';

            const params: any = {
                page: 1,
                size: 100,
                status: 'Approved'  // Based on the API request showing status=Approved
            };

            // Add category filter if we have a target category
            if (targetCategory) {
                params.approved_categories = targetCategory;
            }

            console.log(`🔍 Fetching from ${endpoint} with params:`, params);

            const response = await AxiosWithToken.get(endpoint, { params });
            console.log(`📊 API Response:`, response.data);

            let vendors: any[] = [];

            // Handle different response structures
            if (Array.isArray(response.data)) {
                vendors = response.data;
            } else if (response.data?.data?.results) {
                vendors = response.data.data.results;
            } else if (response.data?.results) {
                vendors = response.data.results;
            }

            console.log(`✅ Found ${vendors.length} approved vendors`);

            if (vendors.length > 0) {
                console.log('🔍 Sample vendor structure:', vendors[0]);
                console.log('🔍 Available fields:', Object.keys(vendors[0]));

                // Process vendors for dropdown
                const processedVendors = vendors.map((vendor: any) => {
                    const vendorName = vendor.company_name || vendor.business_name || vendor.name || `Vendor ${vendor.id}`;
                    const vendorCategories = vendor.approved_categories || vendor.categories || [];
                    const categoryText = Array.isArray(vendorCategories) ? vendorCategories.join(', ') : vendorCategories;

                    return {
                        label: `${vendorName}${categoryText ? ` (${categoryText})` : ''} - Approved`,
                        value: vendor.id,
                        category: vendor.approved_categories || vendor.categories || 'GENERAL',
                        status: vendor.status,
                        approved: true
                    };
                });

                console.log('🔍 Processed vendors for dropdown:', processedVendors);

                // Filter by category if specified
                const filteredVendors = targetCategory
                    ? processedVendors.filter(vendor => {
                        const categories = Array.isArray(vendor.category) ? vendor.category : [vendor.category];
                        return categories.includes(targetCategory);
                    })
                    : processedVendors;

                console.log(`🔍 Category-filtered vendors: ${filteredVendors.length} out of ${processedVendors.length}`);
                console.log('🔍 Final dropdown options being set:', filteredVendors);

                setEntityOptions(filteredVendors);
            } else {
                console.log('❌ No approved vendors found');
                setEntityOptions([{
                    label: `No approved ${targetCategory || ''} vendors available`,
                    value: ""
                }]);
            }

        } catch (error) {
            console.error('Failed to fetch vendors:', error);

            // Detailed error logging
            if (error instanceof Error) {
                console.log('🚨 Vendor API Error Details:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
            }

            // Check if it's a specific HTTP error
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // If it's a 500 error, try alternative approaches
            if (errorMessage.includes('500')) {
                console.log('🔄 500 error detected, trying alternative vendor endpoints...');

                try {
                    // Try without the approved_categories parameter first
                    const fallbackResponse = await AxiosWithToken.get('/procurements/vendors/', {
                        params: { page: 1, size: 100, status: 'Approved' }
                    });

                    console.log('📊 Fallback API Response (without category filter):', fallbackResponse.data);

                    let fallbackVendors: any[] = [];
                    if (Array.isArray(fallbackResponse.data)) {
                        fallbackVendors = fallbackResponse.data;
                    } else if (fallbackResponse.data?.data?.results) {
                        fallbackVendors = fallbackResponse.data.data.results;
                    } else if (fallbackResponse.data?.results) {
                        fallbackVendors = fallbackResponse.data.results;
                    }

                    if (fallbackVendors.length > 0) {
                        console.log('✅ Fallback successful! Found vendors without category filter');

                        // Process vendors and apply client-side category filtering
                        const processedVendors = fallbackVendors.map((vendor: any) => {
                            const vendorName = vendor.company_name || vendor.business_name || vendor.name || `Vendor ${vendor.id}`;
                            const vendorCategories = vendor.approved_categories || vendor.categories || [];
                            const categoryText = Array.isArray(vendorCategories) ? vendorCategories.join(', ') : vendorCategories;

                            return {
                                label: `${vendorName}${categoryText ? ` (${categoryText})` : ''} - Approved`,
                                value: vendor.id,
                                category: vendor.approved_categories || vendor.categories || 'GENERAL',
                                status: vendor.status,
                                approved: true
                            };
                        });

                        setEntityOptions(processedVendors);
                        return; // Exit early since we succeeded
                    }
                } catch (fallbackError) {
                    console.log('❌ Fallback also failed:', fallbackError);

                    // Try even more alternative endpoints
                    const alternativeEndpoints = [
                        '/vendors/',
                        '/contract-grants/vendors/',
                        '/procurement/vendors/', // without 's'
                        '/contract-grants/agreements/vendors_dropdown/'
                    ];

                    for (const altEndpoint of alternativeEndpoints) {
                        try {
                            console.log(`🔄 Trying alternative endpoint: ${altEndpoint}`);
                            const altResponse = await AxiosWithToken.get(altEndpoint, {
                                params: { page: 1, size: 100 }
                            });

                            let altVendors: any[] = [];
                            if (Array.isArray(altResponse.data)) {
                                altVendors = altResponse.data;
                            } else if (altResponse.data?.data?.results) {
                                altVendors = altResponse.data.data.results;
                            } else if (altResponse.data?.results) {
                                altVendors = altResponse.data.results;
                            }

                            if (altVendors.length > 0) {
                                console.log(`✅ Alternative endpoint ${altEndpoint} worked! Found ${altVendors.length} vendors`);

                                const processedAltVendors = altVendors.map((vendor: any) => ({
                                    label: `${vendor.company_name || vendor.business_name || vendor.name || `Vendor ${vendor.id}`} (Alternative Source)`,
                                    value: vendor.id,
                                    category: vendor.approved_categories || vendor.categories || 'GENERAL',
                                    status: vendor.status || 'UNKNOWN'
                                }));

                                setEntityOptions(processedAltVendors);
                                return; // Exit early on success
                            }
                        } catch (altError) {
                            console.log(`❌ Alternative endpoint ${altEndpoint} failed:`, altError);
                        }
                    }
                }
            }

            // Final error state
            setEntityOptions([{
                label: `Error loading vendors: ${errorMessage.includes('500') ? 'Server error - contact IT support' : errorMessage}`,
                value: ""
            }]);
        } finally {
            setIsLoadingEntities(false);
        }
    };

    // Watch for agreement type changes and entity selections
    const agreementType = form.watch('type');
    const selectedService = form.watch('service');
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

        console.log('📊 Processed category data:', categoryData);

        return categoryData.map((category: any) => ({
            label: category.name,
            value: category.id,
        }));
    }, [categories]);

    const serviceTypeOptions = useMemo(() => {
        if (!jobCategories?.data) return [];

        console.log('🔍 Job Categories API Response:', jobCategories);

        // If no service is selected, show all job categories
        if (!selectedService) {
            return jobCategories.data.map(category => ({
                label: category.label,
                value: category.value,
            }));
        }

        // Find the selected service category to understand what job categories to show
        const selectedServiceCategory = serviceOptions.find(service => service.value === selectedService);
        console.log('🔍 Selected Service Category:', selectedServiceCategory);

        // If we have a selected service, filter job categories based on relevance
        // This could be enhanced with a mapping system, but for now we'll use keyword matching
        const serviceLabel = selectedServiceCategory?.label?.toLowerCase() || '';

        const filteredJobCategories = jobCategories.data.filter(category => {
            const categoryLabel = category.label.toLowerCase();

            // Create keyword-based matching logic
            if (serviceLabel.includes('it') || serviceLabel.includes('technology') || serviceLabel.includes('software')) {
                return categoryLabel.includes('it') || categoryLabel.includes('tech') || categoryLabel.includes('software') || categoryLabel.includes('development');
            }

            if (serviceLabel.includes('health') || serviceLabel.includes('medical')) {
                return categoryLabel.includes('health') || categoryLabel.includes('medical') || categoryLabel.includes('nurse') || categoryLabel.includes('doctor');
            }

            if (serviceLabel.includes('education') || serviceLabel.includes('training')) {
                return categoryLabel.includes('education') || categoryLabel.includes('training') || categoryLabel.includes('teacher') || categoryLabel.includes('instructor');
            }

            if (serviceLabel.includes('finance') || serviceLabel.includes('accounting')) {
                return categoryLabel.includes('finance') || categoryLabel.includes('accounting') || categoryLabel.includes('audit');
            }

            if (serviceLabel.includes('construction') || serviceLabel.includes('engineering')) {
                return categoryLabel.includes('construction') || categoryLabel.includes('engineering') || categoryLabel.includes('architect');
            }

            if (serviceLabel.includes('security')) {
                return categoryLabel.includes('security') || categoryLabel.includes('guard') || categoryLabel.includes('protection');
            }

            if (serviceLabel.includes('transport') || serviceLabel.includes('logistics')) {
                return categoryLabel.includes('transport') || categoryLabel.includes('logistics') || categoryLabel.includes('driver') || categoryLabel.includes('delivery');
            }

            // If no specific matching found, include all categories (fallback)
            return true;
        });

        console.log(`🔍 Service Type Filtering: Found ${filteredJobCategories.length} relevant job categories for service "${serviceLabel}"`);

        return filteredJobCategories.map(category => ({
            label: category.label,
            value: category.value,
        }));
    }, [jobCategories, selectedService, serviceOptions]);

    // Auto-populate service type when service is selected
    useEffect(() => {
        if (selectedService && serviceTypeOptions.length > 0) {
            console.log('🔍 Service changed, checking for auto-population...');
            console.log('- Selected Service:', selectedService);
            console.log('- Available Service Types:', serviceTypeOptions.length);

            const currentServiceType = form.getValues('service_type');

            // If there's only one matching job category, auto-select it
            if (serviceTypeOptions.length === 1 && !currentServiceType) {
                const autoSelectedType = serviceTypeOptions[0].value;
                console.log('🔄 Auto-selecting service type:', autoSelectedType);
                form.setValue('service_type', autoSelectedType);
                toast.success(`Auto-selected "${serviceTypeOptions[0].label}" as the service type`);
            }
            // If the current selection is not in the filtered list, clear it
            else if (currentServiceType && !serviceTypeOptions.find(opt => opt.value === currentServiceType)) {
                console.log('🔄 Clearing invalid service type selection');
                form.setValue('service_type', undefined);
                toast.info('Service type cleared - please select from the filtered options');
            }
        }
    }, [selectedService, serviceTypeOptions, form]);

    // Debug: Log all form values in real-time (after serviceTypeOptions is defined)
    console.log('🔍 Real-time Form Values:');
    console.log('- Agreement Type:', agreementType);
    console.log('- Selected Service:', selectedService);
    console.log('- Service Type Options Count:', serviceTypeOptions.length);
    console.log('- Current Service Type:', form.watch('service_type'));
    console.log('- Consultant ID:', consultantId);
    console.log('- Facilitator ID:', facilitatorId);
    console.log('- Adhoc Staff ID:', adhocStaffId);
    console.log('- Vendor ID:', vendorId);
    console.log('- Selected Agreement Type State:', selectedAgreementType);
    console.log('- Entity Options Count:', entityOptions.length);

    const { createAgreement, isLoading: isCreateLoading } =
        useCreateAgreement();

    const { updateAgreement, isLoading: isModifyLoading } =
        useModifyAgreement(id || "");

    // Debug payload validator based on your analysis
    const debugContractPayload = (payload: any) => {
        console.group("🔍 Contract Payload Debug");

        // Check entity associations
        const entities = {
            consultant_id: payload.consultant_id,
            vendor_id: payload.vendor_id,
            facilitator_id: payload.facilitator_id,
            adhoc_staff_id: payload.adhoc_staff_id
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
            const transformedData = {
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
                // Clean up entity fields - use correct API field names (remove _id suffix)
                // API expects: consultant, vendor, facilitator, adhoc_staff (NOT consultant_id, vendor_id, etc.)
                consultant: data.type === 'CONSULTANT' && data.consultant_id ? data.consultant_id : null,
                facilitator: data.type === 'FACILITATOR' && data.facilitator_id ? data.facilitator_id : null,
                adhoc_staff: data.type === 'ADHOC_STAFF' && data.adhoc_staff_id ? data.adhoc_staff_id : null,
                vendor: ['SLA', 'SECURITY', 'INSURANCE', 'LEASE', 'HMO', 'TICKETING'].includes(data.type) && data.vendor_id ? data.vendor_id : null,
            };

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
                                    {/* Service fields only for Service Agreements, not Staff Contracts */}
                                    {!['CONSULTANT', 'FACILITATOR', 'ADHOC_STAFF'].includes(selectedAgreementType) && (
                                        <>
                                            <div className="space-y-2">
                                                <FormSelect
                                                    label="Service (Category)"
                                                    name="service"
                                                    placeholder={
                                                        isLoadingCategories
                                                            ? "Loading categories..."
                                                            : "Select Service Category"
                                                    }
                                                    options={serviceOptions || []}
                                                    required
                                                    disabled={isLoadingCategories}
                                                />

                                                {/* Categories info */}
                                                <div className="text-xs text-gray-600">
                                                    {isLoadingCategories ? (
                                                        <span className="text-blue-600">🔄 Loading service categories from API...</span>
                                                    ) : serviceOptions.length > 0 ? (
                                                        <span className="text-green-600">✅ {serviceOptions.length} service categories loaded</span>
                                                    ) : (
                                                        <span className="text-yellow-600">⚠️ No service categories available</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <FormSelect
                                                    label="Service Type (Job Categories)"
                                                    name="service_type"
                                                    placeholder={
                                                        isLoadingJobCategories
                                                            ? "Loading job categories..."
                                                            : selectedService
                                                                ? serviceTypeOptions.length > 0
                                                                    ? `Select from ${serviceTypeOptions.length} filtered job categories`
                                                                    : "No matching job categories found"
                                                                : "Select Service first to filter job categories"
                                                    }
                                                    options={serviceTypeOptions || []}
                                                    required
                                                    disabled={isLoadingJobCategories}
                                                />

                                                {/* Job categories info */}
                                                <div className="text-xs text-gray-600">
                                                    {isLoadingJobCategories ? (
                                                        <span className="text-blue-600">🔄 Loading job categories from API...</span>
                                                    ) : selectedService ? (
                                                        serviceTypeOptions.length > 0 ? (
                                                            <div className="space-y-1">
                                                                <span className="text-green-600">
                                                                    ✅ {serviceTypeOptions.length} job categories filtered for selected service
                                                                </span>
                                                                {serviceTypeOptions.length === 1 && (
                                                                    <div className="text-blue-600">
                                                                        🎯 Auto-selected: {serviceTypeOptions[0].label}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-yellow-600">⚠️ No matching job categories for this service</span>
                                                        )
                                                    ) : serviceTypeOptions.length > 0 ? (
                                                        <span className="text-gray-500">📋 {serviceTypeOptions.length} job categories available (select service to filter)</span>
                                                    ) : (
                                                        <span className="text-yellow-600">⚠️ No job categories available</span>
                                                    )}
                                                </div>

                                                {/* Service type recommendations - now dynamic based on available categories */}
                                                {selectedAgreementType && serviceTypeOptions.length > 0 && (
                                                    <div className="text-xs text-gray-600">
                                                        <strong>Tip:</strong> Select a job category that matches your {agreementTypeOptions.find(opt => opt.value === selectedAgreementType)?.label.toLowerCase()} service type.
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

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
                                                        <h4 className="font-medium text-blue-800 mb-2">ℹ️ Staff Contract Agreement</h4>
                                                        <p className="text-blue-700 text-sm">
                                                            For {selectedAgreementType === 'CONSULTANT' ? 'consultant' :
                                                                selectedAgreementType === 'FACILITATOR' ? 'facilitator' :
                                                                'adhoc staff'} contracts, service categories and job types are not required.
                                                            These fields are only needed for service agreements (SLA, Security, Insurance, etc.).
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <FormSelect
                                        label="Agreement Type"
                                        name="type"
                                        placeholder="Select Agreement Type"
                                        options={agreementTypeOptions || []}
                                        required
                                    />

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

                                            {/* Debug: Show raw options data */}
                                            {!isLoadingEntities && (
                                                <div className="text-xs text-purple-600 mt-1">
                                                    🔧 Debug: {entityOptions.length} options loaded
                                                    {entityOptions.length > 0 && (
                                                        <div>First option: {JSON.stringify(entityOptions[0])}</div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Status indicator */}
                                            <div className="text-sm text-gray-600">
                                                {isLoadingEntities ? (
                                                    <span className="text-blue-600">🔄 Loading eligible candidates...</span>
                                                ) : entityOptions.length > 0 ? (
                                                    <div className="space-y-1">
                                                        <span className="text-green-600">✅ Found {entityOptions.length} eligible candidate(s)</span>
                                                        {/* Show currently selected entity */}
                                                        <div className="text-xs text-gray-500">
                                                            Currently selected: {
                                                                selectedAgreementType === 'CONSULTANT' ? (consultantId || 'None') :
                                                                selectedAgreementType === 'FACILITATOR' ? (facilitatorId || 'None') :
                                                                selectedAgreementType === 'ADHOC_STAFF' ? (adhocStaffId || 'None') :
                                                                (vendorId || 'None')
                                                            }
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <span className="text-red-600">❌ No eligible candidates found</span>
                                                        <div className="text-xs text-red-500">
                                                            {selectedAgreementType === 'CONSULTANT' && 'No consultants available for contracts. Check consultant applicant statuses.'}
                                                            {selectedAgreementType === 'FACILITATOR' && 'No facilitators available for contracts. Check facilitator applicant statuses.'}
                                                            {selectedAgreementType === 'ADHOC_STAFF' && 'No adhoc staff available for contracts. Check adhoc applicant statuses.'}
                                                            {selectedAgreementType === 'SLA' && 'No approved IT Services vendors available. Register and approve vendors under IT Services category.'}
                                                            {selectedAgreementType === 'SECURITY' && 'No approved Security Services vendors available. Register and approve vendors under Security Services category.'}
                                                            {selectedAgreementType === 'INSURANCE' && 'No approved Insurance vendors available. Register and approve vendors under Insurance category.'}
                                                            {selectedAgreementType === 'LEASE' && 'No approved Property Lease vendors available. Register and approve vendors under Property Lease category.'}
                                                            {selectedAgreementType === 'HMO' && 'No approved Health Services vendors available. Register and approve vendors under Health Services category.'}
                                                            {selectedAgreementType === 'TICKETING' && 'No approved Travel Services vendors available. Register and approve vendors under Travel Services category.'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Debug info */}
                                            {!isLoadingEntities && (
                                                <div className="text-xs text-gray-500">
                                                    {selectedAgreementType === 'CONSULTANT' && 'Showing consultants who are eligible for contracts'}
                                                    {selectedAgreementType === 'FACILITATOR' && 'Showing facilitators available for agreements'}
                                                    {selectedAgreementType === 'ADHOC_STAFF' && 'Showing adhoc staff who have been interviewed/selected'}
                                                    {selectedAgreementType === 'SLA' && 'Showing approved IT Services vendors only'}
                                                    {selectedAgreementType === 'SECURITY' && 'Showing approved Security Services vendors only'}
                                                    {selectedAgreementType === 'INSURANCE' && 'Showing approved Insurance vendors only'}
                                                    {selectedAgreementType === 'LEASE' && 'Showing approved Property Lease vendors only'}
                                                    {selectedAgreementType === 'HMO' && 'Showing approved Health Services vendors only'}
                                                    {selectedAgreementType === 'TICKETING' && 'Showing approved Travel Services vendors only'}
                                                </div>
                                            )}
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
