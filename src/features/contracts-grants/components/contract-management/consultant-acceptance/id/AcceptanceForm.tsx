"use client";

import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import { Form } from "components/ui/form";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { Checkbox } from "components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useUpdateConsultancyApplicant, useGetSingleConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { FileText, Download, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";
import { Button } from "components/ui/button";
import Card from "components/Card";

interface AcceptanceFormData {
    country: string;
    city: string;
    full_name_confirmation: string;
    date: string;
}

export default function AcceptanceForm() {
    const form = useForm<AcceptanceFormData>({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptSafeguarding, setAcceptSafeguarding] = useState(false);
    const [acceptConfidentiality, setAcceptConfidentiality] = useState(false);
    const [ipAddress, setIpAddress] = useState<string>('');

    const params = useParams();
    const router = useRouter();
    const applicantId = params?.id as string;

    // Get applicant data to show contract details
    const { data: applicantData } = useGetSingleConsultancyApplicant(applicantId);
    const applicant = applicantData?.data;

    // Get the applicant update function
    const { updateConsultancyApplicant, isLoading: isUpdateLoading } = useUpdateConsultancyApplicant(applicantId);

    // Get user's IP address for audit trail (optional but recommended)
    useState(() => {
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setIpAddress(data.ip))
            .catch(() => setIpAddress('Unknown'));
    });

    const handleRejectContract = async () => {
        if (!applicantId) {
            toast.error("No applicant ID found");
            return;
        }

        const confirmReject = window.confirm(
            "Are you sure you want to reject this contract? This action cannot be undone."
        );

        if (!confirmReject) return;

        setIsSubmitting(true);

        try {
            // Update the applicant status to rejected
            await updateConsultancyApplicant({
                status: "REJECTED",
                offer_accepted: false,
                offer_acceptance_date: new Date().toISOString(),
            } as any);

            console.log("Contract rejected successfully");

            toast.success("Contract rejected successfully");

            // Navigate back to the acceptance list
            router.push("/dashboard/programs/adhoc/adhoc-acceptance");

        } catch (error) {
            console.error("Contract rejection error:", error);

            if (error instanceof Error) {
                toast.error(`Failed to reject contract: ${error.message}`);
            } else {
                toast.error("Failed to reject contract. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = async (data: AcceptanceFormData) => {
        console.log("Acceptance form submission:", data);

        if (!applicantId) {
            toast.error("No applicant ID found");
            return;
        }

        // Validate required checkboxes
        if (!acceptTerms) {
            toast.error("Please accept the Agreement Terms & Scope of Work");
            return;
        }

        if (!acceptSafeguarding) {
            toast.error("Please accept the Safeguarding Policy");
            return;
        }

        if (!acceptConfidentiality) {
            toast.error("Please accept the Confidentiality Agreement");
            return;
        }

        // Validate name confirmation
        if (!data.full_name_confirmation || data.full_name_confirmation.trim() === '') {
            toast.error("Please type your full name to confirm acceptance");
            return;
        }

        // Verify name matches (case-insensitive, trimmed)
        const confirmedName = data.full_name_confirmation.trim().toLowerCase();
        const applicantName = applicant?.name?.trim().toLowerCase();

        if (confirmedName !== applicantName) {
            toast.error("The name you entered does not match your profile. Please type your full name exactly as shown.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create form data for applicant update with audit trail
            const updateData = {
                // Update status to indicate contract acceptance
                status: "CONTRACT_ISSUED", // Keep as CONTRACT_ISSUED but mark as accepted
                // Store acceptance details
                acceptance_country: data.country,
                acceptance_city: data.city,
                acceptance_date: data.date,
                offer_accepted: true,
                offer_acceptance_date: new Date().toISOString(),
                // Digital signature alternatives for audit trail
                acceptance_confirmed_name: data.full_name_confirmation,
                acceptance_ip_address: ipAddress,
                acceptance_timestamp: new Date().toISOString(),
            };

            console.log("Updating applicant with data:", updateData);

            // Update the applicant status and acceptance details
            await updateConsultancyApplicant(updateData as any);

            console.log("Applicant status updated - Contract accepted");

            toast.success("Contract accepted successfully! You will now appear in the AHNi Adhoc Staff Database.");

            // Navigate to the adhoc database page
            setTimeout(() => {
                router.push("/dashboard/programs/adhoc-database");
            }, 2000);

        } catch (error) {
            console.error("Contract acceptance error:", error);

            // Provide more detailed error information
            if (error instanceof Error) {
                console.error("Error details:", error.message);
                toast.error(`Failed to accept contract: ${error.message}`);
            } else {
                toast.error("Failed to accept contract. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Contract Information Header */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500 text-white p-3 rounded-lg">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Contract Acceptance</h2>
                            <p className="text-gray-600 mt-1">Review and accept your adhoc staff contract</p>
                        </div>
                    </div>

                    {applicant && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
                            <div>
                                <p className="text-sm text-gray-600">Staff Name</p>
                                <p className="font-semibold text-gray-900">{applicant.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Position</p>
                                <p className="font-semibold text-gray-900">{applicant.position_under_contract || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Contract Period</p>
                                <p className="font-semibold text-gray-900">
                                    {applicant.start_duration_date} to {applicant.end_duration_date}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold text-gray-900">{applicant.email}</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Contract Document Viewing Section */}
            <Card>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-[#DEA004]" />
                                Contract Document
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">Download and review your contract</p>
                        </div>
                        <Button className="flex items-center gap-2" variant="outline">
                            <Download className="h-4 w-4" />
                            Download Contract
                        </Button>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700">
                            <strong>Agreement Terms & Scope of Work:</strong> Please review all terms, conditions, and scope of work outlined in your contract document before accepting.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Acceptance Form */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Location Information */}
                    <Card>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Location Information</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <FormInput
                                label="Country"
                                name="country"
                                placeholder="Enter Country"
                                required
                            />
                            <FormInput
                                label="City"
                                name="city"
                                placeholder="Enter City"
                                required
                            />
                        </div>
                    </Card>

                    {/* Digital Acceptance Confirmation */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-green-500 text-white p-2 rounded-lg mt-1">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">Digital Acceptance Confirmation</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Type your full name exactly as it appears above to electronically accept this contract
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white border-2 border-green-200 rounded-lg p-4 space-y-3">
                                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                    <p className="text-sm text-blue-800">
                                        <strong>Your Name on Record:</strong> <span className="font-bold text-blue-900">{applicant?.name || 'Loading...'}</span>
                                    </p>
                                </div>

                                <FormInput
                                    label="Type Your Full Name to Confirm Acceptance"
                                    name="full_name_confirmation"
                                    placeholder="Enter your full name exactly as shown above"
                                    required
                                    className="text-lg font-medium"
                                />

                                <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded">
                                    <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <p>
                                        <strong>Legal Notice:</strong> By typing your name, you are providing a legally binding electronic signature
                                        confirming your acceptance of this contract. This action will be recorded with a timestamp and IP address for audit purposes.
                                    </p>
                                </div>
                            </div>

                            <FormInput type="date" label="Acceptance Date" name="date" required />

                            {ipAddress && (
                                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                    Acceptance will be logged from IP: {ipAddress} at {new Date().toLocaleString()}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Safeguarding Policy */}
                    <Card className="bg-amber-50 border-2 border-amber-200">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                AHNi Safeguarding Policy
                            </h3>

                            <div className="bg-white border border-amber-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed space-y-3">
                                <p>
                                    AHNi is dedicated to ensuring a secure environment for all its employees, beneficiaries, and individuals
                                    contracted by the organisation. This commitment extends to implementing measures aimed at safeguarding
                                    vulnerable individuals from sexual exploitation and abuse (SEA), whether perpetrated by AHNi employees or
                                    affiliated personnel.
                                </p>
                                <p>
                                    Adhering to child safeguarding principles is fundamental to AHNi's approach. Our safeguarding policies are
                                    applicable to and binding upon all AHNi staff, board members, volunteers, as well as partner staff
                                    (including subcontractors, consultants, vendors, and sub-recipients), irrespective of the funding mechanism,
                                    contract amount, or agreement terms.
                                </p>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-200">
                                <Checkbox
                                    id="accept-safeguarding"
                                    checked={acceptSafeguarding}
                                    onCheckedChange={(checked) => setAcceptSafeguarding(checked as boolean)}
                                    className="mt-1"
                                />
                                <label
                                    htmlFor="accept-safeguarding"
                                    className="text-sm font-medium text-gray-900 cursor-pointer leading-relaxed"
                                >
                                    I have read and agree to comply with the AHNi Safeguarding Policy
                                </label>
                            </div>
                        </div>
                    </Card>

                    {/* Confidentiality Agreement */}
                    <Card className="bg-red-50 border-2 border-red-200">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-600" />
                                Confidentiality Agreement
                            </h3>

                            <div className="bg-white border border-red-200 rounded-lg p-4">
                                <p className="text-sm font-semibold text-red-800">
                                    <strong>NOTE:</strong> Consultancy daily rates are personal to you and confidential, hence should not be
                                    shared with any staff or third parties without the express permission of the C&G Unit.
                                </p>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
                                <Checkbox
                                    id="accept-confidentiality"
                                    checked={acceptConfidentiality}
                                    onCheckedChange={(checked) => setAcceptConfidentiality(checked as boolean)}
                                    className="mt-1"
                                />
                                <label
                                    htmlFor="accept-confidentiality"
                                    className="text-sm font-medium text-gray-900 cursor-pointer leading-relaxed"
                                >
                                    I agree to maintain confidentiality regarding my consultancy rates and contract details
                                </label>
                            </div>
                        </div>
                    </Card>

                    {/* Agreement Terms Acceptance */}
                    <Card className="bg-green-50 border-2 border-green-200">
                        <div className="flex items-start gap-3 p-4">
                            <Checkbox
                                id="accept-terms"
                                checked={acceptTerms}
                                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                                className="mt-1"
                            />
                            <label
                                htmlFor="accept-terms"
                                className="text-sm font-medium text-gray-900 cursor-pointer leading-relaxed"
                            >
                                I have reviewed the contract document, understand all terms and conditions, and agree to the Agreement Terms & Scope of Work
                            </label>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                        <FormButton
                            type="submit"
                            size="lg"
                            disabled={isSubmitting || isUpdateLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-6"
                        >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            {(isSubmitting || isUpdateLoading) ? "Processing..." : "Accept Contract & Join AHNi Team"}
                        </FormButton>

                        <FormButton
                            type="button"
                            size="lg"
                            variant="outline"
                            disabled={isSubmitting || isUpdateLoading}
                            className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 text-lg py-6"
                            onClick={handleRejectContract}
                        >
                            <XCircle className="h-5 w-5 mr-2" />
                            {(isSubmitting || isUpdateLoading) ? "Processing..." : "Reject Contract"}
                        </FormButton>
                    </div>

                    {/* Helper Text */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>What happens next?</strong> Once you accept this contract, your details will be added to the AHNi Adhoc Staff Database.
                            You can then complete any additional information required for payroll and administrative purposes.
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    );
}