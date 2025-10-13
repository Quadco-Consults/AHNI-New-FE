"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
    useGetSingleAgreement,
    useUploadContractDocument,
    useSubmitAgreement,
    useCreateContractModification,
    useGetAgreementDocuments,
} from "@/features/contracts-grants/controllers/agreementController";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Skeleton } from "components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "components/ui/dialog";
import { Label } from "components/ui/label";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { ArrowLeft, Upload, FileText, X, Plus, Download, Eye } from "lucide-react";
import { CG_ROUTES } from "constants/RouterConstants";
import { toast } from "sonner";
import { IContractDocument } from "@/features/contracts-grants/types/contract-management/agreement";

export default function AgreementView() {
    const params = useParams();
    const router = useRouter();
    const agreementId = params?.id as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [documentType, setDocumentType] = useState<'CONTRACT' | 'EXTENSION' | 'ADDENDUM' | 'AMENDMENT'>('CONTRACT');
    const [remarks, setRemarks] = useState("");
    const [isModificationModalOpen, setIsModificationModalOpen] = useState(false);
    const [modificationType, setModificationType] = useState<'EXTENSION' | 'ADDENDUM' | 'AMENDMENT'>('EXTENSION');
    const [modificationDescription, setModificationDescription] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [additionalCost, setAdditionalCost] = useState("");
    const [modificationFile, setModificationFile] = useState<File | null>(null);
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

    const { data, isLoading, isError, error, refetch } = useGetSingleAgreement(agreementId);
    const { data: documentsData, refetch: refetchDocuments } = useGetAgreementDocuments(agreementId);
    const { uploadDocument, isLoading: isUploading, isSuccess: uploadSuccess } = useUploadContractDocument(agreementId);
    const { submitAgreement, isLoading: isSubmitting, isSuccess: submitSuccess } = useSubmitAgreement(agreementId);
    const { createModification, isLoading: isCreatingModification, isSuccess: modificationSuccess } = useCreateContractModification(agreementId);

    const agreement = data?.data;
    const documents = documentsData?.data || [];

    useEffect(() => {
        if (uploadSuccess) {
            toast.success("Document uploaded successfully");
            setSelectedFiles([]);
            setRemarks("");
            refetchDocuments();
            refetch();
        }
    }, [uploadSuccess]);

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

    const resetModificationForm = () => {
        setModificationType('EXTENSION');
        setModificationDescription("");
        setNewEndDate("");
        setAdditionalCost("");
        setModificationFile(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadDocuments = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one document");
            return;
        }

        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('document_type', documentType);
            if (remarks) {
                formData.append('remarks', remarks);
            }
            await uploadDocument(formData);
        }
    };

    const handleSubmitForApproval = async () => {
        if (!documents || documents.length === 0) {
            toast.error("Please upload at least one contract document before submitting");
            return;
        }
        await submitAgreement();
    };

    const handleCreateModification = async () => {
        if (!modificationDescription) {
            toast.error("Please provide a description for the modification");
            return;
        }

        const formData = new FormData();
        formData.append('modification_type', modificationType);
        formData.append('description', modificationDescription);

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
            case 'CONTRACT': return 'bg-blue-100 text-blue-800';
            case 'EXTENSION': return 'bg-green-100 text-green-800';
            case 'ADDENDUM': return 'bg-yellow-100 text-yellow-800';
            case 'AMENDMENT': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const canEdit = agreement?.status === 'DRAFT' || !agreement?.status;
    const canSubmit = canEdit && (!documents || documents.length === 0 || agreement?.status === 'DRAFT');
    const isActive = agreement?.status === 'ACTIVE';

    if (isLoading) {
        return (
            <div className="space-y-6 p-6">
                <Skeleton className="h-8 w-64" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <div className="text-red-600">
                    Error loading agreement: {error?.message || "Unknown error"}
                </div>
                <Button
                    onClick={() => router.push(CG_ROUTES.AGREEMENT)}
                    className="mt-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Agreements
                </Button>
            </div>
        );
    }

    if (!agreement) {
        return (
            <div className="p-6">
                <div className="text-gray-600">Agreement not found</div>
                <Button
                    onClick={() => router.push(CG_ROUTES.AGREEMENT)}
                    className="mt-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Agreements
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(CG_ROUTES.AGREEMENT)}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Agreement Details</h1>
                        {agreement.contract_number && (
                            <p className="text-sm text-gray-500">Contract No: {agreement.contract_number}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    {isActive && (
                        <Button
                            onClick={() => setIsModificationModalOpen(true)}
                            variant="outline"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Modification
                        </Button>
                    )}
                    {canSubmit && documents && documents.length > 0 && (
                        <Button
                            onClick={() => setIsSubmitDialogOpen(true)}
                            disabled={isSubmitting}
                        >
                            Submit for Approval
                        </Button>
                    )}
                </div>
            </div>

            {/* Agreement Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Contract Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Agreement Type</p>
                            <p className="text-base mt-1">
                                {agreement.service_type_display || agreement.type || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <p className="text-base mt-1">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    agreement.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                    agreement.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                                    agreement.status === 'PENDING_APPROVAL' ? 'bg-yellow-100 text-yellow-800' :
                                    agreement.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                                    agreement.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {agreement.status_display || agreement.status || 'DRAFT'}
                                </span>
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Entity Name</p>
                            <p className="text-base mt-1">
                                {agreement.vendor_name ||
                                 agreement.consultant_name ||
                                 agreement.facilitator_name ||
                                 agreement.adhoc_staff_name ||
                                 '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Contact Person</p>
                            <p className="text-base mt-1">
                                {agreement.vendor_contact_person ||
                                 agreement.consultant_name ||
                                 agreement.facilitator_name ||
                                 agreement.adhoc_staff_name ||
                                 '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Contact Email</p>
                            <p className="text-base mt-1">
                                {agreement.vendor_contact_email ||
                                 agreement.consultant_email ||
                                 agreement.facilitator_email ||
                                 agreement.adhoc_staff_email ||
                                 '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Contact Phone</p>
                            <p className="text-base mt-1">
                                {agreement.vendor_contact_phone ||
                                 agreement.consultant_phone ||
                                 agreement.facilitator_phone ||
                                 agreement.adhoc_staff_phone ||
                                 '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p className="text-base mt-1">
                                {agreement.location_name || '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Contract Cost</p>
                            <p className="text-base mt-1">
                                {agreement.contract_cost ?
                                 `₦${Number(agreement.contract_cost).toLocaleString()}` :
                                 '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">Start Date</p>
                            <p className="text-base mt-1">
                                {agreement.start_date ? formatDate(agreement.start_date) : '-'}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-500">End Date</p>
                            <p className="text-base mt-1">
                                {agreement.end_date ? formatDate(agreement.end_date) : '-'}
                            </p>
                        </div>

                        {agreement.current_version && (
                            <div>
                                <p className="text-sm font-medium text-gray-500">Current Version</p>
                                <p className="text-base mt-1">Version {agreement.current_version}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Document Upload Section (only for DRAFT status) */}
            {canEdit && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Contract Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <Label>Document Type</Label>
                                <Select value={documentType} onValueChange={(value: any) => setDocumentType(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CONTRACT">Main Contract</SelectItem>
                                        <SelectItem value="ADDENDUM">Addendum</SelectItem>
                                        <SelectItem value="AMENDMENT">Amendment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Remarks (Optional)</Label>
                                <Textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Add any notes about this document..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    multiple
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full"
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Select Documents
                                </Button>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Selected Files:</Label>
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <p className="text-sm font-medium">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button
                                onClick={handleUploadDocuments}
                                disabled={selectedFiles.length === 0 || isUploading}
                                className="w-full"
                            >
                                {isUploading ? "Uploading..." : "Upload Documents"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Contract Documents List */}
            <Card>
                <CardHeader>
                    <CardTitle>Contract Documents</CardTitle>
                </CardHeader>
                <CardContent>
                    {documents && documents.length > 0 ? (
                        <div className="space-y-3">
                            {documents.map((doc: IContractDocument) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="p-2 bg-blue-50 rounded">
                                            <FileText className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{doc.document_name}</p>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDocumentTypeColor(doc.document_type)}`}>
                                                    {doc.document_type}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                <span>Version {doc.version}</span>
                                                <span>•</span>
                                                <span>{doc.contract_number}</span>
                                                <span>•</span>
                                                <span>{formatDate(doc.uploaded_at)}</span>
                                                {doc.file_size && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{formatFileSize(doc.file_size)}</span>
                                                    </>
                                                )}
                                            </div>
                                            {doc.remarks && (
                                                <p className="text-sm text-gray-600 mt-1">{doc.remarks}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(doc.document_url, '_blank')}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = doc.document_url;
                                                link.download = doc.document_name;
                                                link.click();
                                            }}
                                        >
                                            <Download className="h-4 w-4 mr-1" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>No contract documents uploaded yet</p>
                            {canEdit && (
                                <p className="text-sm mt-1">Upload documents above to get started</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Contract Modifications */}
            {agreement.modifications && agreement.modifications.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Contract Modifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {agreement.modifications.map((mod) => (
                                <div key={mod.id} className="p-4 border rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    mod.modification_type === 'EXTENSION' ? 'bg-green-100 text-green-800' :
                                                    mod.modification_type === 'ADDENDUM' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {mod.modification_type}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    mod.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    mod.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {mod.status}
                                                </span>
                                            </div>
                                            <p className="text-sm mb-2">{mod.description}</p>
                                            {mod.new_end_date && (
                                                <p className="text-sm text-gray-600">New End Date: {formatDate(mod.new_end_date)}</p>
                                            )}
                                            {mod.additional_cost && (
                                                <p className="text-sm text-gray-600">Additional Cost: ₦{Number(mod.additional_cost).toLocaleString()}</p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">Created: {formatDate(mod.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

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
                                    <SelectItem value="ADDENDUM">Addendum</SelectItem>
                                    <SelectItem value="AMENDMENT">Amendment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Description *</Label>
                            <Textarea
                                value={modificationDescription}
                                onChange={(e) => setModificationDescription(e.target.value)}
                                placeholder="Describe the modification..."
                                rows={4}
                            />
                        </div>

                        {modificationType === 'EXTENSION' && (
                            <div>
                                <Label>New End Date</Label>
                                <Input
                                    type="date"
                                    value={newEndDate}
                                    onChange={(e) => setNewEndDate(e.target.value)}
                                />
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
                        <Button onClick={handleCreateModification} disabled={isCreatingModification}>
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
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium">Documents to be submitted:</p>
                            <p className="text-sm text-gray-600 mt-1">{documents?.length || 0} document(s)</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitForApproval} disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit for Approval"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.push(CG_ROUTES.AGREEMENT)}
                >
                    Back to List
                </Button>
                {canEdit && (
                    <Button
                        onClick={() => router.push({
                            pathname: CG_ROUTES.CREATE_AGREEMENT_DETAILS,
                            search: `?id=${agreementId}`,
                        } as any)}
                    >
                        Edit Agreement
                    </Button>
                )}
            </div>
        </div>
    );
}
