"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
    useGetSingleAgreement,
    useSubmitAgreement,
    useCreateContractModification,
    useGetAgreementDocuments,
    useUploadContractDocument,
    useApproveAgreement,
    useRejectAgreement,
} from "@/features/contracts-grants/controllers/agreementController";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Plus, Download, Eye, RefreshCw, CheckCircle, AlertCircle, Building2, Calendar, DollarSign, MapPin, User, Phone, Mail, ThumbsUp, ThumbsDown, Clock, Circle, Activity, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { CG_ROUTES } from "@/constants/RouterConstants";
import { toast } from "sonner";
import { IContractDocument } from "@/features/contracts-grants/types/contract-management/agreement";
import { usePermissions } from "@/hooks/usePermissions";

export default function AgreementView() {
    const params = useParams();
    const router = useRouter();
    const agreementId = params?.id as string;
    const { isAdmin } = usePermissions();

    const [isModificationModalOpen, setIsModificationModalOpen] = useState(false);
    const [modificationType, setModificationType] = useState<'EXTENSION' | 'ADDENDUM' | 'AMENDMENT'>('EXTENSION');
    const [modificationDescription, setModificationDescription] = useState("");
    const [modificationReason, setModificationReason] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [additionalCost, setAdditionalCost] = useState("");
    const [modificationFile, setModificationFile] = useState<File | null>(null);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadDocumentType, setUploadDocumentType] = useState<'CONTRACT' | 'EXTENSION' | 'ADDENDUM' | 'AMENDMENT'>('CONTRACT');
    const [uploadRemarks, setUploadRemarks] = useState("");
    const [uploadTitle, setUploadTitle] = useState("");

    // Approval/Rejection state
    const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [currentApprovalAction, setCurrentApprovalAction] = useState<'review' | 'authorize' | 'approve' | null>(null);

    const { data, isLoading, isError, error, refetch } = useGetSingleAgreement(agreementId);
    const { data: documentsData, isLoading: documentsLoading, isError: documentsError, error: documentsErrorMessage, refetch: refetchDocuments } = useGetAgreementDocuments(agreementId, !!agreementId);
    const { submitAgreement, isLoading: isSubmitting, isSuccess: submitSuccess } = useSubmitAgreement(agreementId);
    const { createModification, isLoading: isCreatingModification, isSuccess: modificationSuccess } = useCreateContractModification(agreementId);
    const { uploadDocument, isLoading: isUploadingDocument, isSuccess: uploadSuccess } = useUploadContractDocument(agreementId);

    // Approval/Rejection hooks
    const { approveAgreement, isLoading: isApproving, isSuccess: approvalSuccess } = useApproveAgreement(agreementId);
    const { rejectAgreement, isLoading: isRejecting, isSuccess: rejectionSuccess } = useRejectAgreement(agreementId);

    const agreement = data?.data;

    // Get documents from multiple sources with fallback handling
    let documents: any[] = [];
    let documentsSource = 'none';

    // Try multiple data extraction methods
    // Priority 1: Check embedded agreement documents first (only if not empty)
    if (agreement?.agreement_documents && Array.isArray(agreement.agreement_documents) && agreement.agreement_documents.length > 0) {
        documents = agreement.agreement_documents;
        documentsSource = 'agreement_documents';
        console.log('✅ Using embedded agreement documents:', documents.length, 'documents');
    }
    // Priority 2: Check documents API response
    else if (documentsData?.data) {
        // Cast to any to handle various API response structures
        const apiData = documentsData.data as any;

        if (Array.isArray(apiData)) {
            documents = apiData;
            documentsSource = 'documents_api_direct';
        } else if (Array.isArray(apiData?.data)) {
            documents = apiData.data;
            documentsSource = 'documents_api_nested';
        } else if (Array.isArray(apiData?.results)) {
            documents = apiData.results;
            documentsSource = 'documents_api_paginated';
        } else if (Array.isArray(apiData?.documents)) {
            // Handle {status: 'success', data: {documents: [...]}} structure
            documents = apiData.documents;
            documentsSource = 'documents_api_documents_field';
            console.log('✅ Using API documents field:', documents.length, 'documents');
        } else if (apiData && typeof apiData === 'object') {
            // Try to find any array property in the data object
            try {
                const dataKeys = Object.keys(apiData);
                console.log('🔍 Searching API data keys for arrays:', dataKeys);

                for (const key of dataKeys) {
                    const value = apiData[key];
                    if (Array.isArray(value)) {
                        documents = value;
                        documentsSource = `documents_api_${key}_field`;
                        console.log(`✅ Found documents in API response[${key}]:`, value.length, 'documents');
                        break;
                    }
                }

                if (documents.length === 0) {
                    console.log('❌ No arrays found in API response data:', apiData);
                }
            } catch (error) {
                console.error('Error parsing documents data:', error);
                documents = [];
                documentsSource = 'error_fallback';
            }
        }
    }

    // Debug documents source
    console.log('📄 Documents Source Debug:', {
        agreementId,
        agreementDocuments: agreement?.agreement_documents,
        agreementDocumentsLength: agreement?.agreement_documents?.length || 0,
        documentsApiData: documentsData?.data,
        documentsApiDataType: typeof documentsData?.data,
        documentsApiDataKeys: documentsData?.data ? Object.keys(documentsData.data) : [],
        documentsApiFullResponse: documentsData,
        documentsLoading,
        documentsError,
        documentsErrorMessage: documentsErrorMessage?.message,
        finalDocuments: documents,
        finalDocumentsLength: documents?.length || 0,
        usingSource: documentsSource,
        // Debug each possible extraction path
        extractionPaths: {
            'documentsData.data exists': !!documentsData?.data,
            'documentsData.data type': typeof documentsData?.data,
            'documentsData.data is array': Array.isArray(documentsData?.data),
            'Has nested data': !!(documentsData?.data as any)?.data,
            'Has results': !!(documentsData?.data as any)?.results,
            'Has documents field': !!(documentsData?.data as any)?.documents,
        }
    });

    // Additional debugging for API response structure
    if (documentsData?.data && typeof documentsData.data === 'object') {
        console.log('🔍 DETAILED API RESPONSE STRUCTURE:', {
            fullResponse: documentsData,
            dataObject: documentsData.data,
            dataKeys: Object.keys(documentsData.data),
            dataValues: Object.entries(documentsData.data).map(([key, value]) => ({
                key,
                type: typeof value,
                isArray: Array.isArray(value),
                length: Array.isArray(value) ? value.length : 'N/A',
                sample: Array.isArray(value) && value.length > 0 ? value[0] : value
            }))
        });
    }

    // Debug logging
    useEffect(() => {
        console.log('📋 Agreement View Debug:', {
            agreementId,
            agreementLoaded: !!agreement,
            agreementStatus: agreement?.status,
            agreementType: agreement?.type,
            agreementData: agreement,
            documentsLoading,
            documentsError,
            documentsErrorMessage: documentsErrorMessage?.message,
            documentsData,
            documentsCount: documents?.length || 0,
            documents,
            // Check entity fields
            entityFields: {
                vendor_name: agreement?.vendor_name,
                consultant_name: agreement?.consultant_name,
                facilitator_name: agreement?.facilitator_name,
                adhoc_staff_name: agreement?.adhoc_staff_name,
                contract_cost: agreement?.contract_cost,
            }
        });

        // Force refetch documents if not loaded
        if (agreementId && !documentsLoading && !documentsData && refetchDocuments) {
            console.log('🔄 Force refetching documents for agreement:', agreementId);
            refetchDocuments();
        }

        // Manual test of documents API if refetch doesn't work
        if (agreementId && !documentsLoading && (!documentsData || documents.length === 0)) {
            console.log('🔍 Manual Documents API Test for agreement:', agreementId);
            // Import AxiosWithToken and test the endpoint manually
            import('@/constants/api_management/MyHttpHelperWithToken').then(({ default: AxiosWithToken }) => {
                AxiosWithToken.get(`/contract-grants/agreements/${agreementId}/documents/`, {
                    params: { include_inactive: true }
                })
                .then(response => {
                    console.log('🎯 Manual Documents API Success:', response.data);
                    console.log('🎯 Manual API Response Structure:', {
                        hasData: !!response.data?.data,
                        dataType: typeof response.data?.data,
                        dataIsArray: Array.isArray(response.data?.data),
                        dataLength: Array.isArray(response.data?.data) ? response.data.data.length : 'N/A',
                        fullResponse: response.data
                    });
                })
                .catch(error => {
                    console.error('❌ Manual Documents API Error:', error.response?.data || error.message);
                });
            });
        }
    }, [agreementId, agreement, documentsLoading, documentsError, documentsErrorMessage, documentsData, documents]);

    useEffect(() => {
        if (submitSuccess) {
            toast.success("Agreement submitted for approval");
            setIsSubmitDialogOpen(false);
            refetch();
        }
    }, [submitSuccess]);

    useEffect(() => {
        if (modificationSuccess) {
            toast.success("Contract modification created successfully");
            setIsModificationModalOpen(false);
            resetModificationForm();
            refetchDocuments();
            refetch();
        }
    }, [modificationSuccess]);

    useEffect(() => {
        if (uploadSuccess) {
            toast.success("Document uploaded successfully");
            setIsUploadDialogOpen(false);
            resetUploadForm();
            refetchDocuments();
        }
    }, [uploadSuccess]);

    useEffect(() => {
        if (approvalSuccess) {
            toast.success("Agreement approved successfully!");
            setIsApprovalDialogOpen(false);
            refetch();
        }
    }, [approvalSuccess]);


    useEffect(() => {
        if (rejectionSuccess) {
            toast.success("Agreement rejected successfully");
            setIsRejectionDialogOpen(false);
            setRejectionReason("");
            refetch();
        }
    }, [rejectionSuccess]);

    const resetModificationForm = () => {
        setModificationType('EXTENSION');
        setModificationDescription("");
        setModificationReason("");
        setNewEndDate("");
        setAdditionalCost("");
        setModificationFile(null);
    };

    const resetUploadForm = () => {
        setUploadFile(null);
        setUploadDocumentType('CONTRACT');
        setUploadRemarks("");
        setUploadTitle("");
    };

    const handleSubmitForApproval = async () => {
        if (!documents || documents.length === 0) {
            toast.error("Please upload at least one contract document before submitting");
            return;
        }
        await submitAgreement();
    };

    const handleApproveAgreement = async () => {
        try {
            await approveAgreement();
        } catch (error: any) {
            toast.error(error?.message || "Failed to approve agreement");
        }
    };


    const handleRejectAgreement = async () => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        try {
            await rejectAgreement(rejectionReason);
        } catch (error: any) {
            toast.error(error?.message || "Failed to reject agreement");
        }
    };

    const handleUploadDocument = async () => {
        if (!uploadFile) {
            toast.error("Please select a file to upload");
            return;
        }

        if (!uploadTitle.trim()) {
            toast.error("Please enter a document title");
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadFile);  // Backend expects 'file' not 'document'
        formData.append('document_type', uploadDocumentType);
        formData.append('title', uploadTitle);
        formData.append('agreement', agreementId);  // Explicitly link to agreement
        formData.append('is_active', 'true');  // Try setting is_active to true

        if (uploadRemarks) {
            formData.append('remarks', uploadRemarks);
        }

        console.log('📤 Upload FormData:', {
            file: uploadFile.name,
            document_type: uploadDocumentType,
            title: uploadTitle,
            agreement: agreementId,
            is_active: 'true',
            remarks: uploadRemarks
        });

        try {
            await uploadDocument(formData);
        } catch (error: any) {
            toast.error(error?.message || "Failed to upload document");
        }
    };

    const handleCreateModification = async () => {
        if (!modificationDescription) {
            toast.error("Please provide a description for the modification");
            return;
        }

        if (!modificationReason) {
            toast.error("Please provide a reason for the modification");
            return;
        }

        // Validate new end date for extensions
        if (modificationType === 'EXTENSION' && !newEndDate) {
            toast.error("Please provide a new end date for the extension");
            return;
        }

        const formData = new FormData();
        formData.append('modification_type', modificationType);
        formData.append('description', modificationDescription);
        formData.append('reason', modificationReason);

        if (modificationType === 'EXTENSION' && newEndDate) {
            formData.append('new_end_date', newEndDate);
        }

        if (additionalCost) {
            formData.append('additional_cost', additionalCost);
        }

        if (modificationFile) {
            formData.append('document', modificationFile);
        }

        await createModification(formData);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(2)} KB`;
        return `${(kb / 1024).toFixed(2)} MB`;
    };

    const getDocumentTypeColor = (type: string) => {
        switch (type) {
            case 'CONTRACT': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'EXTENSION': return 'bg-green-100 text-green-800 border-green-200';
            case 'ADDENDUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'AMENDMENT': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
            case 'EXPIRED': return 'bg-red-100 text-red-800 border-red-200';
            case 'PENDING_APPROVAL': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'SUBMITTED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Multi-level Approval Logic
    // Note: Since backend approval_stage is undefined, we'll simulate the workflow
    // The backend likely handles multi-level approval internally via approve_agreement endpoint
    const getApprovalStage = () => {
        const status = agreement?.status;
        const approvalStage = agreement?.approval_stage;
        const approvalStatus = agreement?.approval_status;

        console.log('🔍 Approval Stage Debug:', {
            status,
            approvalStage,
            approvalStatus,
            hasReviewerId: !!agreement?.reviewer_id,
            hasAuthorizerId: !!agreement?.authorizer_id,
            hasApproverId: !!agreement?.approver_id,
        });

        if (status === 'DRAFT') return 'draft';
        if (status === 'SUBMITTED') {
            // Since backend doesn't provide approval_stage, we'll default to first stage
            // The backend will handle the actual workflow logic when approve_agreement is called
            return 'pending_review';
        }
        if (status === 'ACTIVE') return 'approved';
        if (status === 'REJECTED') return 'rejected';

        return 'unknown';
    };

    const approvalStage = getApprovalStage();

    // Allow editing for all agreements except TERMINATED
    // Admin users have view-only access - they cannot edit, modify, or upload documents
    const canEdit = agreement?.status !== 'TERMINATED' && !isAdmin;
    const canSubmit = agreement?.status === 'DRAFT' && documents && documents.length > 0 && !isAdmin;
    const isActive = agreement?.status === 'ACTIVE' && !isAdmin;
    const isSubmitted = agreement?.status === 'SUBMITTED';
    const isDraft = agreement?.status === 'DRAFT' || !agreement?.status;

    // Determine available actions based on approval stage
    const canReject = isSubmitted;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Skeleton className="h-12 w-96" />
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-64" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                            <div>
                                <h3 className="font-semibold text-red-900">Error Loading Agreement</h3>
                                <p className="text-sm text-red-700 mt-1">{error?.message || "Unknown error occurred"}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => router.push(CG_ROUTES.AGREEMENT)}
                            className="mt-4"
                            variant="outline"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Agreements
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!agreement) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                            <div>
                                <h3 className="font-semibold text-yellow-900">Agreement Not Found</h3>
                                <p className="text-sm text-yellow-700 mt-1">The requested agreement could not be found.</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => router.push(CG_ROUTES.AGREEMENT)}
                            className="mt-4"
                            variant="outline"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Agreements
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header with Status */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(CG_ROUTES.AGREEMENT)}
                                className="mt-1"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">Agreement Details</h1>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(agreement.status || 'DRAFT')}`}>
                                        {agreement.status_display || agreement.status || 'DRAFT'}
                                    </span>
                                </div>
                                {agreement.contract_number && (
                                    <p className="text-sm text-gray-600">Contract No: <span className="font-mono font-medium">{agreement.contract_number}</span></p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">
                                    {agreement.service_type_display || agreement.type || '-'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isActive && (
                                <Button
                                    onClick={() => setIsModificationModalOpen(true)}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Modification
                                </Button>
                            )}
                            {canSubmit && (
                                <Button
                                    onClick={() => setIsSubmitDialogOpen(true)}
                                    disabled={isSubmitting}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                    size="sm"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Submit for Approval
                                </Button>
                            )}
                            {/* Simplified Approval Actions - Backend handles multi-level workflow internally */}
                            {isSubmitted && (
                                <>
                                    <Button
                                        onClick={() => setIsApprovalDialogOpen(true)}
                                        disabled={isApproving}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        size="sm"
                                    >
                                        <ThumbsUp className="mr-2 h-4 w-4" />
                                        {isApproving ? 'Processing...' : 'Approve Agreement'}
                                    </Button>
                                    <Button
                                        onClick={() => setIsRejectionDialogOpen(true)}
                                        disabled={isRejecting}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <ThumbsDown className="mr-2 h-4 w-4" />
                                        {isRejecting ? 'Rejecting...' : 'Reject Agreement'}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Approval Workflow Status */}
                {isSubmitted && (
                    <Card className="border-gray-200 shadow-sm mb-6">
                        <CardHeader className="border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                                <CardTitle className="text-lg">Approval Workflow Progress</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                {/* Stage 1: Review */}
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                        approvalStage === 'pending_review'
                                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                                            : approvalStage === 'pending_authorization' || approvalStage === 'pending_approval' || agreement?.status === 'ACTIVE'
                                            ? 'bg-green-100 border-green-500 text-green-700'
                                            : 'bg-gray-100 border-gray-300 text-gray-500'
                                    }`}>
                                        {approvalStage === 'pending_review' ? (
                                            <Clock className="h-5 w-5" />
                                        ) : (approvalStage === 'pending_authorization' || approvalStage === 'pending_approval' || agreement?.status === 'ACTIVE') ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            <Circle className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className="text-sm font-medium text-gray-900">Review</p>
                                        <p className="text-xs text-gray-500">First Stage</p>
                                        {approvalStage === 'pending_review' && (
                                            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Connection Line 1 */}
                                <div className={`h-px flex-1 mx-4 ${
                                    approvalStage === 'pending_authorization' || approvalStage === 'pending_approval' || agreement?.status === 'ACTIVE'
                                        ? 'bg-green-500' : 'bg-gray-300'
                                }`}></div>

                                {/* Stage 2: Authorization */}
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                        approvalStage === 'pending_authorization'
                                            ? 'bg-orange-100 border-orange-500 text-orange-700'
                                            : approvalStage === 'pending_approval' || agreement?.status === 'ACTIVE'
                                            ? 'bg-green-100 border-green-500 text-green-700'
                                            : 'bg-gray-100 border-gray-300 text-gray-500'
                                    }`}>
                                        {approvalStage === 'pending_authorization' ? (
                                            <Clock className="h-5 w-5" />
                                        ) : (approvalStage === 'pending_approval' || agreement?.status === 'ACTIVE') ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            <Circle className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className="text-sm font-medium text-gray-900">Authorization</p>
                                        <p className="text-xs text-gray-500">Second Stage</p>
                                        {approvalStage === 'pending_authorization' && (
                                            <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Connection Line 2 */}
                                <div className={`h-px flex-1 mx-4 ${
                                    approvalStage === 'pending_approval' || agreement?.status === 'ACTIVE'
                                        ? 'bg-green-500' : 'bg-gray-300'
                                }`}></div>

                                {/* Stage 3: Final Approval */}
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                        approvalStage === 'pending_approval'
                                            ? 'bg-green-100 border-green-500 text-green-700'
                                            : agreement?.status === 'ACTIVE'
                                            ? 'bg-green-100 border-green-500 text-green-700'
                                            : 'bg-gray-100 border-gray-300 text-gray-500'
                                    }`}>
                                        {approvalStage === 'pending_approval' ? (
                                            <Clock className="h-5 w-5" />
                                        ) : agreement?.status === 'ACTIVE' ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            <Circle className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className="text-sm font-medium text-gray-900">Final Approval</p>
                                        <p className="text-xs text-gray-500">Final Stage</p>
                                        {approvalStage === 'pending_approval' && (
                                            <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Current
                                            </span>
                                        )}
                                        {agreement?.status === 'ACTIVE' && (
                                            <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Current Action Indicator */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Current Status: <span className="text-blue-600">
                                                {approvalStage === 'pending_review' && 'Pending Approval'}
                                                {approvalStage === 'pending_authorization' && 'Pending Authorization'}
                                                {approvalStage === 'pending_approval' && 'Pending Final Approval'}
                                                {agreement?.status === 'ACTIVE' && 'Approved & Active'}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {approvalStage === 'pending_review' && 'Agreement is awaiting approval from authorized personnel'}
                                            {approvalStage === 'pending_authorization' && 'Waiting for authorizer to authorize the agreement'}
                                            {approvalStage === 'pending_approval' && 'Waiting for final approver to approve the agreement'}
                                            {agreement?.status === 'ACTIVE' && 'Agreement has been fully approved and is now active'}
                                        </p>
                                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                                            <p className="text-xs text-blue-700">
                                                <strong>Note:</strong> The approval workflow is managed by the backend system.
                                                Use the "Approve Agreement" button to progress through the approval stages.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Agreement ID</p>
                                        <p className="text-sm font-mono font-medium text-gray-900">{agreement.id}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Agreement Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Entity Information */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-indigo-600" />
                                    <CardTitle className="text-lg">Entity Information</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <User className="h-4 w-4" />
                                            Entity Name
                                        </div>
                                        <p className="text-base font-medium text-gray-900">
                                            {agreement.entity_name ||
                                             agreement.vendor_name ||
                                             agreement.vendor_contact_person ||
                                             agreement.consultant_contact_name ||
                                             agreement.consultant_name ||
                                             agreement.facilitator_contact_name ||
                                             agreement.facilitator_name ||
                                             agreement.adhoc_staff_contact_name ||
                                             agreement.adhoc_staff_name ||
                                             '-'}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <User className="h-4 w-4" />
                                            Contact Person
                                        </div>
                                        <p className="text-base font-medium text-gray-900">
                                            {agreement.contact_person ||
                                             agreement.vendor_contact_person ||
                                             agreement.consultant_contact_name ||
                                             agreement.consultant_name ||
                                             agreement.facilitator_contact_name ||
                                             agreement.facilitator_name ||
                                             agreement.adhoc_staff_contact_name ||
                                             agreement.adhoc_staff_name ||
                                             '-'}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Mail className="h-4 w-4" />
                                            Email Address
                                        </div>
                                        <p className="text-base text-gray-900">
                                            {agreement.contact_person_email ||
                                             agreement.vendor_contact_email ||
                                             agreement.consultant_contact_email ||
                                             agreement.consultant_email ||
                                             agreement.facilitator_contact_email ||
                                             agreement.facilitator_email ||
                                             agreement.adhoc_staff_contact_email ||
                                             agreement.adhoc_staff_email ||
                                             '-'}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Phone className="h-4 w-4" />
                                            Phone Number
                                        </div>
                                        <p className="text-base text-gray-900">
                                            {agreement.contact_person_phone ||
                                             agreement.vendor_contact_phone ||
                                             agreement.consultant_contact_phone ||
                                             agreement.consultant_phone ||
                                             agreement.facilitator_contact_phone ||
                                             agreement.facilitator_phone ||
                                             agreement.adhoc_staff_contact_phone ||
                                             agreement.adhoc_staff_phone ||
                                             '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contract Details */}
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                    <CardTitle className="text-lg">Contract Details</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            Start Date
                                        </div>
                                        <p className="text-base font-medium text-gray-900">
                                            {agreement.start_date ? formatDate(agreement.start_date) : '-'}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            End Date
                                        </div>
                                        <p className="text-base font-medium text-gray-900">
                                            {agreement.end_date ? formatDate(agreement.end_date) : '-'}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <DollarSign className="h-4 w-4" />
                                            Contract Cost
                                        </div>
                                        {agreement.contract_cost ? (
                                            <p className="text-base font-bold text-indigo-600">
                                                ₦{Number(agreement.contract_cost).toLocaleString()}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">Not specified</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            Location
                                        </div>
                                        <p className="text-base font-medium text-gray-900">
                                            {agreement.location_name || '-'}
                                        </p>
                                    </div>

                                    {agreement.current_version && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                                <FileText className="h-4 w-4" />
                                                Version
                                            </div>
                                            <p className="text-base font-medium text-gray-900">Version {agreement.current_version}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* SLA-Specific Section (only show when type='SLA') - Hidden as per user request */}
                        {false && agreement.type === 'SLA' && (
                            <Card className="border-purple-200 shadow-sm">
                                <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">SLA Performance Metrics</CardTitle>
                                            <p className="text-xs text-gray-600 mt-0.5">Service Level Agreement specifications</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        {/* Service Level Commitments */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-purple-900 mb-3">Service Level Commitments</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {agreement.response_time && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Response Time
                                                        </div>
                                                        <p className="text-sm text-gray-900">{agreement.response_time}</p>
                                                    </div>
                                                )}
                                                {agreement.resolution_time && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Resolution Time
                                                        </div>
                                                        <p className="text-sm text-gray-900">{agreement.resolution_time}</p>
                                                    </div>
                                                )}
                                                {agreement.uptime_percentage && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                            <Activity className="h-3.5 w-3.5" />
                                                            Uptime SLA
                                                        </div>
                                                        <p className="text-sm text-gray-900">{agreement.uptime_percentage}%</p>
                                                    </div>
                                                )}
                                                {agreement.service_hours && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            Service Hours
                                                        </div>
                                                        <p className="text-sm text-gray-900">{agreement.service_hours}</p>
                                                    </div>
                                                )}
                                            </div>
                                            {!agreement.response_time && !agreement.resolution_time && !agreement.uptime_percentage && !agreement.service_hours && (
                                                <p className="text-sm text-gray-500 italic">No service level commitments defined</p>
                                            )}
                                        </div>

                                        {/* Financial Terms */}
                                        {(agreement.monthly_cost || agreement.payment_frequency) && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-purple-900 mb-3">Financial Terms</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {agreement.monthly_cost && (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                                <DollarSign className="h-3.5 w-3.5" />
                                                                Monthly Cost
                                                            </div>
                                                            <p className="text-sm text-gray-900">${agreement.monthly_cost.toLocaleString()}</p>
                                                        </div>
                                                    )}
                                                    {agreement.payment_frequency && (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                Payment Frequency
                                                            </div>
                                                            <p className="text-sm text-gray-900 capitalize">{agreement.payment_frequency.toLowerCase().replace('_', ' ')}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Performance & Penalties */}
                                        {(agreement.key_deliverables || agreement.performance_kpis || agreement.penalty_terms) && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-purple-900 mb-3">Performance & Deliverables</h3>
                                                <div className="space-y-3">
                                                    {agreement.key_deliverables && (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                                <CheckCircle className="h-3.5 w-3.5" />
                                                                Key Deliverables
                                                            </div>
                                                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{typeof agreement.key_deliverables === 'string' ? agreement.key_deliverables : JSON.stringify(agreement.key_deliverables, null, 2)}</p>
                                                        </div>
                                                    )}
                                                    {agreement.performance_kpis && (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                                <TrendingUp className="h-3.5 w-3.5" />
                                                                Performance KPIs
                                                            </div>
                                                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{typeof agreement.performance_kpis === 'string' ? agreement.performance_kpis : JSON.stringify(agreement.performance_kpis, null, 2)}</p>
                                                        </div>
                                                    )}
                                                    {agreement.penalty_terms && (
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                                <AlertTriangle className="h-3.5 w-3.5" />
                                                                Penalty Terms
                                                            </div>
                                                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{agreement.penalty_terms}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Escalation Matrix */}
                                        {agreement.escalation_matrix && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-purple-900 mb-3">Escalation Matrix</h3>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                                        <Users className="h-3.5 w-3.5" />
                                                        Contact Hierarchy
                                                    </div>
                                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{typeof agreement.escalation_matrix === 'string' ? agreement.escalation_matrix : JSON.stringify(agreement.escalation_matrix, null, 2)}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* No SLA data message */}
                                        {!agreement.response_time && !agreement.resolution_time && !agreement.uptime_percentage &&
                                         !agreement.service_hours && !agreement.monthly_cost && !agreement.payment_frequency &&
                                         !agreement.key_deliverables && !agreement.performance_kpis && !agreement.penalty_terms &&
                                         !agreement.escalation_matrix && (
                                            <div className="text-center py-8">
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                                                    <AlertCircle className="h-6 w-6 text-purple-600" />
                                                </div>
                                                <p className="text-sm text-gray-600">No SLA specifications defined yet</p>
                                                <p className="text-xs text-gray-500 mt-1">Edit this agreement to add SLA performance metrics</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    </div>

                    {/* Right Column - Documents */}
                    <div className="lg:col-span-1">
                        {/* Contract Documents */}
                        <div className="sticky top-6">
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                <FileText className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">Contract Documents</CardTitle>
                                                <p className="text-xs text-gray-600 mt-0.5">{documents.length} {documents.length === 1 ? 'document' : 'documents'} uploaded</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {documentsLoading ? (
                                        <div className="p-8">
                                            <div className="flex items-center justify-center py-8">
                                                <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
                                                <span className="ml-3 text-sm text-gray-600">Loading documents...</span>
                                            </div>
                                        </div>
                                    ) : documentsError ? (
                                        <div className="p-8">
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-red-900">Error Loading Documents</p>
                                                        <p className="text-xs text-red-700 mt-1">{documentsErrorMessage?.message || "Failed to load documents"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : documents && documents.length > 0 ? (
                                        <div className="divide-y divide-gray-100 max-h-[calc(100vh-16rem)] overflow-y-auto">
                                            {documents.map((doc: IContractDocument) => (
                                                <div key={doc.id} className="group p-4 hover:bg-indigo-50/50 transition-all">
                                                    <div className="space-y-3">
                                                        {/* Document Header */}
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors border border-blue-100">
                                                                <FileText className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-sm text-gray-900 truncate mb-1.5">
                                                                    {doc.title || doc.file_name}
                                                                </h4>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getDocumentTypeColor(doc.document_type)}`}>
                                                                        {doc.document_type}
                                                                    </span>
                                                                    {doc.version && (
                                                                        <span className="text-xs text-gray-500">
                                                                            v{doc.version}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Document Metadata */}
                                                        <div className="pl-12 space-y-1.5 text-xs text-gray-600">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                                <span>{formatDate(doc.created_datetime)}</span>
                                                            </div>
                                                            {doc.file_size && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <FileText className="h-3 w-3 text-gray-400" />
                                                                    <span>{formatFileSize(doc.file_size)}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Remarks */}
                                                        {doc.remarks && (
                                                            <div className="pl-12">
                                                                <p className="text-xs text-gray-600 bg-gray-50 rounded p-2 border border-gray-100">
                                                                    {doc.remarks}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Action Buttons */}
                                                        <div className="pl-12 flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => window.open(doc.file_url || doc.file, '_blank')}
                                                                className="flex-1 text-xs h-8 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                                                            >
                                                                <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const link = document.createElement('a');
                                                                    link.href = doc.file_url || doc.file;
                                                                    link.download = doc.title || doc.file_name;
                                                                    link.click();
                                                                }}
                                                                className="flex-1 text-xs h-8 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700"
                                                            >
                                                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                                                Download
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8">
                                            <div className="text-center py-8">
                                                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-gray-200">
                                                    <FileText className="h-10 w-10 text-gray-300" />
                                                </div>
                                                <h4 className="text-sm font-semibold text-gray-900 mb-1">No Documents Available</h4>
                                                <p className="text-xs text-gray-500">
                                                    Documents uploaded during agreement creation will appear here
                                                </p>
                                            </div>
                                            {canEdit && documents.length === 0 && (
                                                <div className="mt-4">
                                                    <Button
                                                        onClick={() => setIsUploadDialogOpen(true)}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                                                        size="sm"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Upload First Document
                                                    </Button>
                                                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <div className="flex items-start gap-2">
                                                            <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                            <p className="text-xs text-blue-700">
                                                                You need to upload at least one contract document before submitting for approval
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Contract History Table - Original Contract + Modifications */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <FileText className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Contract History</CardTitle>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    Original contract and all modifications
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Version
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Start Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            End Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Contract Cost
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Document
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Date Created
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {/* Original Contract Row */}
                                    <tr className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                                                    Original
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-xs font-medium">
                                                {agreement.service_type_display || agreement.type || 'CONTRACT'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900">
                                            {agreement.start_date ? formatDate(agreement.start_date) : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                                            {agreement.end_date ? formatDate(agreement.end_date) : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-semibold text-indigo-600">
                                            {agreement.contract_cost ? `₦${Number(agreement.contract_cost).toLocaleString()}` : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            Initial contract agreement
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(agreement.status || 'DRAFT')}`}>
                                                {agreement.status_display || agreement.status || 'DRAFT'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {documents && documents.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {documents
                                                        .filter(doc => doc.document_type === 'CONTRACT')
                                                        .map(doc => (
                                                            <a
                                                                key={doc.id}
                                                                href={doc.file_url || doc.file}
                                                                download
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium transition-colors"
                                                            >
                                                                <Download className="h-3.5 w-3.5" />
                                                                {doc.file_name || 'Download'}
                                                            </a>
                                                        ))}
                                                    {documents.filter(doc => doc.document_type === 'CONTRACT').length === 0 && (
                                                        <span className="text-xs text-gray-400 italic">No document</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No document</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {agreement.created_datetime ? formatDate(agreement.created_datetime) : '-'}
                                        </td>
                                    </tr>

                                    {/* Modification Rows */}
                                    {agreement.modifications && agreement.modifications.length > 0 && (
                                        agreement.modifications.map((mod, index) => (
                                            <tr key={mod.id} className="hover:bg-green-50/30 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                            V{index + 2}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                        mod.modification_type === 'EXTENSION' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        mod.modification_type === 'ADDENDUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                        'bg-purple-100 text-purple-800 border-purple-200'
                                                    }`}>
                                                        {mod.modification_type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900">
                                                    {agreement.start_date ? formatDate(agreement.start_date) : '-'}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                                                    {mod.new_end_date ? formatDate(mod.new_end_date) : '-'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-semibold text-indigo-600">
                                                            {agreement.contract_cost ? `₦${Number(agreement.contract_cost).toLocaleString()}` : '-'}
                                                        </p>
                                                        {mod.additional_cost && (
                                                            <p className="text-xs text-green-700 font-medium">
                                                                +₦{Number(mod.additional_cost).toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                                                    <p className="line-clamp-2">{mod.description || '-'}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                        mod.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        mod.status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' :
                                                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                    }`}>
                                                        {mod.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        {/* Show modification's attached document */}
                                                        {mod.document && (
                                                            <a
                                                                href={mod.document.file_url || mod.document.file}
                                                                download
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium transition-colors"
                                                            >
                                                                <Download className="h-3.5 w-3.5" />
                                                                {mod.document.file_name || 'Download'}
                                                            </a>
                                                        )}

                                                        {/* Show all documents matching this modification type */}
                                                        {documents && documents
                                                            .filter(doc => doc.document_type === mod.modification_type)
                                                            .map(doc => (
                                                                <a
                                                                    key={doc.id}
                                                                    href={doc.file_url || doc.file}
                                                                    download
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium transition-colors"
                                                                >
                                                                    <Download className="h-3.5 w-3.5" />
                                                                    {doc.file_name || 'Download'}
                                                                </a>
                                                            ))
                                                        }

                                                        {/* Show "No document" if nothing exists */}
                                                        {!mod.document && (!documents || documents.filter(doc => doc.document_type === mod.modification_type).length === 0) && (
                                                            <span className="text-xs text-gray-400 italic">No document</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-500">
                                                    {formatDate(mod.created_at)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Footer */}
                        {agreement.modifications && agreement.modifications.length > 0 && (
                            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                        <span className="text-gray-600">
                                            Total Versions: <span className="font-semibold text-gray-900">{agreement.modifications.length + 1}</span>
                                        </span>
                                        <span className="text-gray-400">|</span>
                                        <span className="text-gray-600">
                                            Modifications: <span className="font-semibold text-gray-900">{agreement.modifications.length}</span>
                                        </span>
                                    </div>
                                    {agreement.current_version && (
                                        <span className="text-gray-600">
                                            Current Version: <span className="font-semibold text-indigo-600">V{agreement.current_version}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <Button
                        variant="outline"
                        onClick={() => router.push(CG_ROUTES.AGREEMENT)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to List
                    </Button>
                    {canEdit && (
                        <div className="flex flex-col items-end gap-1">
                            <Button
                                onClick={() => router.push(`${CG_ROUTES.CREATE_AGREEMENT}?id=${agreementId}`)}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                Edit Agreement
                            </Button>
                            {!isDraft && agreement?.status && (
                                <p className="text-xs text-amber-600 font-medium">
                                    Editing {agreement.status_display || agreement.status} agreement
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modification Modal */}
            <Dialog open={isModificationModalOpen} onOpenChange={setIsModificationModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Contract Modification</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Modification Type</Label>
                            <Select value={modificationType} onValueChange={(value: any) => setModificationType(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EXTENSION">Contract Extension</SelectItem>
                                    {/* ADDENDUM and AMENDMENT disabled until backend support is added */}
                                    {/* <SelectItem value="ADDENDUM">Addendum</SelectItem> */}
                                    {/* <SelectItem value="AMENDMENT">Amendment</SelectItem> */}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 mt-1">
                                Currently only Contract Extension is supported
                            </p>
                        </div>

                        <div>
                            <Label>Reason *</Label>
                            <Textarea
                                value={modificationReason}
                                onChange={(e) => setModificationReason(e.target.value)}
                                placeholder="Provide the reason for this modification..."
                                rows={3}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Explain why this modification is necessary
                            </p>
                        </div>

                        <div>
                            <Label>Description *</Label>
                            <Textarea
                                value={modificationDescription}
                                onChange={(e) => setModificationDescription(e.target.value)}
                                placeholder="Describe the modification details..."
                                rows={3}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Provide detailed information about what is being modified
                            </p>
                        </div>

                        {modificationType === 'EXTENSION' && (
                            <div>
                                <Label>New End Date *</Label>
                                <Input
                                    type="date"
                                    value={newEndDate}
                                    onChange={(e) => setNewEndDate(e.target.value)}
                                    min={agreement?.end_date || undefined}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Current end date: {agreement?.end_date ? formatDate(agreement.end_date) : 'N/A'}
                                </p>
                            </div>
                        )}

                        <div>
                            <Label>Additional Cost (if any)</Label>
                            <Input
                                type="number"
                                value={additionalCost}
                                onChange={(e) => setAdditionalCost(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <Label>Attach Document (Optional)</Label>
                            <Input
                                type="file"
                                onChange={(e) => setModificationFile(e.target.files?.[0] || null)}
                                accept=".pdf,.doc,.docx"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModificationModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateModification} disabled={isCreatingModification} className="bg-indigo-600 hover:bg-indigo-700">
                            {isCreatingModification ? "Creating..." : "Create Modification"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Submit Confirmation Dialog */}
            <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Agreement for Approval</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-gray-600">
                            Are you sure you want to submit this agreement for approval?
                            Once submitted, you won't be able to make changes until it's approved or rejected.
                        </p>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm font-medium text-blue-900">Documents to be submitted:</p>
                            <p className="text-sm text-blue-700 mt-1">{documents?.length || 0} document(s)</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitForApproval} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                            {isSubmitting ? "Submitting..." : "Submit for Approval"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upload Document Dialog */}
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Upload Contract Document</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Document Type *</Label>
                            <Select value={uploadDocumentType} onValueChange={(value: any) => setUploadDocumentType(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CONTRACT">Original Contract</SelectItem>
                                    <SelectItem value="EXTENSION">Extension Document</SelectItem>
                                    <SelectItem value="ADDENDUM">Addendum</SelectItem>
                                    <SelectItem value="AMENDMENT">Amendment</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 mt-1">
                                Select the type of document you are uploading
                            </p>
                        </div>

                        <div>
                            <Label>Document Title *</Label>
                            <Input
                                type="text"
                                value={uploadTitle}
                                onChange={(e) => setUploadTitle(e.target.value)}
                                placeholder="Enter a title for this document"
                                className="mt-1"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Provide a descriptive title for the document
                            </p>
                        </div>

                        <div>
                            <Label>Select File *</Label>
                            <Input
                                type="file"
                                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                accept=".pdf,.doc,.docx"
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Accepted formats: PDF, DOC, DOCX
                            </p>
                            {uploadFile && (
                                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                    Selected: {uploadFile.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label>Remarks (Optional)</Label>
                            <Textarea
                                value={uploadRemarks}
                                onChange={(e) => setUploadRemarks(e.target.value)}
                                placeholder="Add any notes or remarks about this document..."
                                rows={3}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUploadDocument}
                            disabled={isUploadingDocument || !uploadFile}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isUploadingDocument ? "Uploading..." : "Upload Document"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approval Confirmation Dialog */}
            <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ThumbsUp className="h-5 w-5 text-green-600" />
                            Approve Agreement
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-gray-600">
                            Are you sure you want to approve this agreement? Once approved, the agreement will become active and will be in effect immediately.
                        </p>
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm font-medium text-green-800">This action will:</p>
                            <ul className="text-xs text-green-700 mt-1 list-disc list-inside">
                                <li>Change status from "Submitted" to "Active"</li>
                                <li>Make the agreement effective immediately</li>
                                <li>Enable contract tracking and monitoring</li>
                            </ul>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApproveAgreement}
                            disabled={isApproving}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isApproving ? "Approving..." : "Approve Agreement"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rejection Dialog */}
            <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ThumbsDown className="h-5 w-5 text-red-600" />
                            Reject Agreement
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <p className="text-sm text-gray-600">
                            Please provide a reason for rejecting this agreement. This information will be shared with the submitter.
                        </p>

                        <div>
                            <Label>Rejection Reason *</Label>
                            <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Please explain why this agreement is being rejected..."
                                rows={4}
                                className="mt-1"
                                required
                            />
                        </div>

                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm font-medium text-red-800">This action will:</p>
                            <ul className="text-xs text-red-700 mt-1 list-disc list-inside">
                                <li>Change status from "Submitted" to "Rejected"</li>
                                <li>Return the agreement to the submitter for revision</li>
                                <li>Require resubmission after addressing feedback</li>
                            </ul>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsRejectionDialogOpen(false);
                            setRejectionReason("");
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRejectAgreement}
                            disabled={isRejecting || !rejectionReason.trim()}
                            variant="destructive"
                        >
                            {isRejecting ? "Rejecting..." : "Reject Agreement"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
