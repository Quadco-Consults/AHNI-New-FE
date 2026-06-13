"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/atoms/FormInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FormTextArea from "@/components/atoms/FormTextArea";
import { Upload, X, FileText, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useQuery } from "@tanstack/react-query";
import {
    ConsultancyReportSchema,
    TConsultancyReportFormData,
} from "@/features/contracts-grants/types/contract-management/consultancy-report";
import FormButton from "@/components/FormButton";
import FormCombobox from "@/components/atoms/FormCombobox";
import { ConsultantAuthUtils } from "@/features/consultant-portal/controllers/consultantAuthController";
import { ArrowLeft } from "lucide-react";
import ConsultantAxiosWithToken from "@/constants/api_management/ConsultantHttpHelper";

export default function CreateConsultantReportPage() {
    // Get today's date in YYYY-MM-DD format for report_date default
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const form = useForm<TConsultancyReportFormData>({
        resolver: zodResolver(ConsultancyReportSchema),
        defaultValues: {
            project: "",
            supervisor: "",
            consultant: "",
            report_date: getTodayDate(), // Auto-populate with today's date
            consultancy_start_date: "",
            consultancy_end_date: "",
            consultancy_duration: "",
            purpose: "",
            executive_summary: "",
            achievements: "",
            challenges_recommendations: "",
        },
    });

    const router = useRouter();
    const [documents, setDocuments] = useState<File[]>([]);
    const { coords, loading: locationLoading, error: locationError, getCurrentLocation } = useGeolocation();

    // Get consultant data
    const consultantData = ConsultantAuthUtils.getConsultantData();
    const consultantEmail = consultantData.email;

    // Fetch projects using consultant HTTP client
    const { data: project } = useQuery({
        queryKey: ['consultant-projects'],
        queryFn: async () => {
            const response = await ConsultantAxiosWithToken.get('projects/projects/', {
                params: { page: 1, size: 2000000 }
            });
            return response.data;
        },
    });

    const projectOptions = useMemo(
        () =>
            project?.data?.results?.map((proj: any) => ({
                label: proj.title,
                value: proj.id,
            })) || [],
        [project]
    );

    // Fetch users/supervisors using consultant HTTP client
    const { data: user } = useQuery({
        queryKey: ['consultant-users'],
        queryFn: async () => {
            const response = await ConsultantAxiosWithToken.get('users/users/', {
                params: { page: 1, size: 2000000 }
            });
            return response.data;
        },
    });

    const userOptions = useMemo(
        () =>
            user?.data?.results?.map((u: any) => ({
                label: `${u.first_name} ${u.last_name}`,
                value: u.id,
            })) || [],
        [user]
    );

    // Fetch consultants to find the current logged-in consultant's management ID
    const { data: consultantDataAPI } = useQuery({
        queryKey: ['consultant-applicants-for-report'],
        queryFn: async () => {
            const response = await ConsultantAxiosWithToken.get('contract-grants/consultancy/applicants/', {
                params: { page: 1, size: 2000000 }
            });
            return response.data;
        },
    });

    const { currentConsultantManagementId, currentApplicant } = useMemo(() => {
        const allApplicants = consultantDataAPI?.data?.results || [];

        // Find the applicant matching the logged-in consultant's email
        const applicant = allApplicants.find(
            (applicant: any) => applicant.email.toLowerCase() === consultantEmail.toLowerCase()
        );

        if (applicant) {
            // Get the consultant management ID
            const managementId = Array.isArray(applicant.consultants)
                ? applicant.consultants[0]
                : applicant.consultants || applicant.consultancy;

            console.log('✅ Found consultant data:', {
                email: consultantEmail,
                applicantName: applicant.name,
                managementId,
                project: applicant.project,
            });

            return {
                currentConsultantManagementId: managementId,
                currentApplicant: applicant
            };
        }

        console.warn('⚠️ Could not find consultant data for:', consultantEmail);
        return {
            currentConsultantManagementId: null,
            currentApplicant: null
        };
    }, [consultantDataAPI, consultantEmail]);

    // Fetch consultant management details to get supervisor and project
    const { data: consultantManagementData } = useQuery({
        queryKey: ['consultant-management-details', currentConsultantManagementId],
        queryFn: async () => {
            if (!currentConsultantManagementId) return null;
            const response = await ConsultantAxiosWithToken.get(
                `contract-grants/consultants/${currentConsultantManagementId}/`
            );
            return response.data;
        },
        enabled: !!currentConsultantManagementId,
    });

    const consultantManagement = consultantManagementData?.data;

    // Auto-fill consultant field when management ID is found
    useEffect(() => {
        if (currentConsultantManagementId) {
            form.setValue("consultant", currentConsultantManagementId);
        }
    }, [currentConsultantManagementId, form]);

    // Auto-fill supervisor when consultant management data loads
    useEffect(() => {
        if (consultantManagement?.supervisor) {
            console.log('✅ Auto-filling supervisor:', consultantManagement.supervisor);
            form.setValue("supervisor", consultantManagement.supervisor);
        }
    }, [consultantManagement, form]);

    // Auto-fill project and consultancy dates when consultant applicant data loads
    useEffect(() => {
        if (currentApplicant) {
            if (currentApplicant.project) {
                console.log('✅ Auto-filling project:', currentApplicant.project);
                form.setValue("project", currentApplicant.project);
            }

            // Auto-fill consultancy start date if available
            if (currentApplicant.start_duration_date) {
                console.log('✅ Auto-filling start date:', currentApplicant.start_duration_date);
                form.setValue("consultancy_start_date", currentApplicant.start_duration_date);
            }

            // Auto-fill consultancy end date if available
            if (currentApplicant.end_duration_date) {
                console.log('✅ Auto-filling end date:', currentApplicant.end_duration_date);
                form.setValue("consultancy_end_date", currentApplicant.end_duration_date);
            }
        }
    }, [currentApplicant, form]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit: SubmitHandler<TConsultancyReportFormData> = async (
        data
    ) => {
        setIsSubmitting(true);
        try {
            if (!currentConsultantManagementId) {
                toast.error('Unable to identify your consultant record. Please contact support.');
                setIsSubmitting(false);
                return;
            }

            // Capture geolocation before submitting
            toast.loading("Capturing your location...", { id: "location-capture" });
            let locationCoords;
            try {
                locationCoords = await getCurrentLocation();
                toast.success("Location captured successfully", { id: "location-capture" });
            } catch (locationErr: any) {
                toast.error(locationErr.message || "Failed to get location. Report will be submitted without location verification.", { id: "location-capture" });
                // Continue with submission even if location fails
            }

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('consultant', currentConsultantManagementId);
            formData.append('project', data.project);
            formData.append('supervisor', data.supervisor);
            formData.append('report_date', data.report_date);
            formData.append('consultancy_start_date', data.consultancy_start_date);
            formData.append('consultancy_end_date', data.consultancy_end_date);
            formData.append('consultancy_duration', data.consultancy_duration);
            formData.append('purpose', data.purpose);
            formData.append('executive_summary', data.executive_summary);
            formData.append('achievements', data.achievements);
            formData.append('challenges_recommendations', data.challenges_recommendations);

            // Add geolocation coordinates if available
            if (locationCoords) {
                formData.append('submission_latitude', locationCoords.latitude.toString());
                formData.append('submission_longitude', locationCoords.longitude.toString());
                console.log('📍 Location captured:', locationCoords);
            }

            // Add first document if uploaded (backend expects single file for now)
            if (documents.length > 0) {
                formData.append('document', documents[0]);
            }

            console.log('📤 Submitting consultant report with document and location');

            // Use ConsultantAxiosWithToken to send FormData with consultant authentication
            await ConsultantAxiosWithToken.post("contract-grants/consultant-portal/reports/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Report submitted successfully");
            router.push('/consultant-portal/reports');
        } catch (error: any) {
            console.error('❌ Report submission error:', error);
            const errorMessage = error?.response?.data?.message ?? error?.message ?? "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) return;

        const validFiles: File[] = [];

        for (const file of files) {
            // Validate file size (max 10MB each)
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 10MB limit`);
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            setDocuments([...documents, ...validFiles]);
            toast.success(`${validFiles.length} file(s) added`);
        }

        // Reset input
        event.target.value = '';
    };

    const removeDocument = (index: number) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    // Watch start and end dates to auto-calculate duration
    const startDate = form.watch("consultancy_start_date");
    const endDate = form.watch("consultancy_end_date");

    useEffect(() => {
        // Calculate duration when both dates are available
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Calculate the difference in milliseconds
            const diffTime = end.getTime() - start.getTime();

            // Convert to days (add 1 to include both start and end dates)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // Only set if the duration is valid (positive number)
            if (diffDays > 0) {
                form.setValue("consultancy_duration", String(diffDays));
            } else {
                form.setValue("consultancy_duration", "0");
            }
        }
    }, [startDate, endDate, form]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Submit Consultancy Report</h1>
                    <p className="text-gray-600 mt-1">Provide details about your consultancy activities</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Report Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                <FormCombobox
                                    label="Project"
                                    name="project"
                                    placeholder="Select Project"
                                    searchPlaceholder="Search projects..."
                                    emptyMessage="No project found."
                                    required
                                    options={projectOptions}
                                    helperText="Auto-populated from your assignment"
                                />

                                <FormCombobox
                                    label="Supervisor"
                                    name="supervisor"
                                    placeholder="Select Supervisor"
                                    searchPlaceholder="Search supervisors..."
                                    emptyMessage="No supervisor found."
                                    required
                                    options={userOptions}
                                    helperText="Auto-populated from your assignment"
                                />

                                <FormInput
                                    type="date"
                                    label="Report Date"
                                    name="report_date"
                                    required
                                    helperText="Defaults to today's date"
                                />
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-bold text-lg mb-4">Consultancy Period</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    <FormInput
                                        type="date"
                                        label="Start Date"
                                        name="consultancy_start_date"
                                        required
                                        helperText="Auto-populated from your contract"
                                    />

                                    <FormInput
                                        type="date"
                                        label="End Date"
                                        name="consultancy_end_date"
                                        required
                                        helperText="Auto-populated from your contract"
                                    />

                                    <FormInput
                                        label="Duration (Days)"
                                        name="consultancy_duration"
                                        placeholder="Auto-calculated"
                                        required
                                        disabled
                                        className="bg-gray-50"
                                        helperText="Automatically calculated"
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-bold text-lg mb-4">Supporting Document</h3>

                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                                        <div className="text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4">
                                                <label
                                                    htmlFor="document-upload"
                                                    className="cursor-pointer text-sm font-medium text-green-600 hover:text-green-700"
                                                >
                                                    Click to upload {documents.length > 0 && `(${documents.length} selected)`}
                                                    <input
                                                        id="document-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        onChange={handleFileChange}
                                                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                                                        multiple
                                                    />
                                                </label>
                                                <span className="text-sm text-gray-500"> or drag and drop</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                PDF, DOC, DOCX, XLS, XLSX up to 10MB each • Multiple files supported
                                            </p>
                                        </div>

                                        {/* Selected Files List */}
                                        {documents.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                                                {documents.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-8 w-8 text-green-600" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeDocument(index)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6 space-y-6">
                                <h3 className="font-bold text-lg">Report Content</h3>

                                <FormTextArea
                                    label="Purpose"
                                    name="purpose"
                                    placeholder="Describe the purpose of this consultancy"
                                    required
                                    rows={3}
                                />

                                <FormTextArea
                                    label="Executive Summary"
                                    name="executive_summary"
                                    placeholder="Provide an executive summary of the consultancy"
                                    required
                                    rows={4}
                                />

                                <FormTextArea
                                    label="Activities, Accomplishments, & Deliverables"
                                    name="achievements"
                                    placeholder="Detail your activities, accomplishments, and deliverables"
                                    required
                                    rows={6}
                                />

                                <FormTextArea
                                    label="Challenges and Recommendations"
                                    name="challenges_recommendations"
                                    placeholder="Describe any challenges faced and your recommendations"
                                    required
                                    rows={5}
                                />
                            </div>

                            {/* Location Status */}
                            {coords && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900">Location Verified</p>
                                            <p className="text-sm text-green-700">
                                                Your location will be recorded with this submission for verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {locationError && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                                        <div>
                                            <p className="font-medium text-yellow-900">Location Not Available</p>
                                            <p className="text-sm text-yellow-700">
                                                {locationError}. Your report will still be submitted but may require additional verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <FormButton
                                    type="submit"
                                    size="lg"
                                    loading={isSubmitting}
                                    disabled={!currentConsultantManagementId || isSubmitting}
                                >
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Submit Report
                                </FormButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
