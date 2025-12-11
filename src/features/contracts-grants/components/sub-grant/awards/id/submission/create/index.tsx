"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import ManualSubGrantStepWrapper from "./Layout";
import { Form } from "components/ui/form";
import FormInput from "components/atoms/FormInput";
import FormTextArea from "components/atoms/FormTextArea";
import FormSelect from "components/atoms/FormSelect";
import FormButton from "@/components/FormButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { CG_ROUTES } from "constants/RouterConstants";
import {
    SubGrantSubmissionSchema,
    TSubGrantSubmissionFormData,
} from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useGetAllPartners } from "@/features/modules/controllers/project/partnerController";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
    useCreateSubGrantManualSub,
    useGetSingleSubGrantManualSub,
    useModifySubGrantManualSub,
    useGetAllSubGrantSubmissions,
} from "@/features/contracts-grants/controllers/submissionController";
import { skipToken } from "@reduxjs/toolkit/query";

export default function CreateSubGrantSubDetails() {
    const [duplicateWarning, setDuplicateWarning] = useState<{
        type: 'partner' | 'organization' | 'email' | null;
        message: string;
        existingSubmission?: any;
    }>({ type: null, message: "", existingSubmission: null });

    const form = useForm<TSubGrantSubmissionFormData>({
        resolver: zodResolver(SubGrantSubmissionSchema),
        defaultValues: {
            partner: "",
            organisation_name: "",
            principal_one_name: "",
            principal_one_designaation: "",
            principal_two_name: "",
            principal_two_designation: "",
            address: "",
            phone_number: "",
            fax: "",
            email: "",
            web_address: "",
            duns_number: "",
            has_conflict_of_interest: "",
            organisation_type: undefined,
        },
    });

    const router = useRouter();

    const { id: subGrantId } = useParams();

    const searchParams = useSearchParams();

    const submissionId = searchParams?.get("partnerSubId");

    // Get sub_grant ID from query params if not in route params
    const subGrantIdFromQuery = searchParams?.get("subGrantId");
    const actualSubGrantId = (subGrantId as string) || subGrantIdFromQuery;

    const { data: partner } = useGetAllPartners({
        page: 1,
        size: 2000000,
    });

    // Get existing submissions for this sub-grant to check for duplicates
    const { data: existingSubmissions } = useGetAllSubGrantSubmissions({
        sub_grant: actualSubGrantId,
        size: 1000, // Get all submissions for this sub-grant
        enabled: !!actualSubGrantId,
    });

    const partnerOptions = useMemo(
        () =>
            partner?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [partner]
    );

    // Function to check for duplicate submissions
    const checkForDuplicates = (partnerId: string, organizationName: string, email: string) => {
        if (!existingSubmissions?.data?.results) return;

        const submissions = existingSubmissions.data.results;

        // Skip duplicate check if we're editing an existing submission
        if (submissionId) return;

        // Check for duplicate partner
        const duplicatePartner = submissions.find(sub =>
            sub.partner === partnerId || (typeof sub.partner === 'object' && sub.partner.id === partnerId)
        );

        if (duplicatePartner) {
            setDuplicateWarning({
                type: 'partner',
                message: `This partner has already submitted for this sub-grant. Submission ID: ${duplicatePartner.id}`,
                existingSubmission: duplicatePartner
            });
            return;
        }

        // Check for duplicate organization name
        const duplicateOrg = submissions.find(sub =>
            sub.organisation_name?.toLowerCase() === organizationName?.toLowerCase()
        );

        if (duplicateOrg && organizationName) {
            setDuplicateWarning({
                type: 'organization',
                message: `An organization with this name "${organizationName}" has already submitted. Submission ID: ${duplicateOrg.id}`,
                existingSubmission: duplicateOrg
            });
            return;
        }

        // Check for duplicate email
        const duplicateEmail = submissions.find(sub =>
            sub.email?.toLowerCase() === email?.toLowerCase()
        );

        if (duplicateEmail && email) {
            setDuplicateWarning({
                type: 'email',
                message: `This email "${email}" has already been used in another submission. Submission ID: ${duplicateEmail.id}`,
                existingSubmission: duplicateEmail
            });
            return;
        }

        // Clear warning if no duplicates found
        setDuplicateWarning({ type: null, message: "", existingSubmission: null });
    };

    const { createSubGrantSubmission, isLoading: isCreateLoading } =
        useCreateSubGrantManualSub();

    const { updateSubGrantSubmission, isLoading: isModifyLoading } =
        useModifySubGrantManualSub(submissionId || "");

    // Watch form fields for real-time duplicate checking
    const watchedPartner = form.watch("partner");
    const watchedOrgName = form.watch("organisation_name");
    const watchedEmail = form.watch("email");

    // Trigger duplicate check when relevant fields change
    useEffect(() => {
        if (watchedPartner || watchedOrgName || watchedEmail) {
            checkForDuplicates(watchedPartner, watchedOrgName, watchedEmail);
        }
    }, [watchedPartner, watchedOrgName, watchedEmail, existingSubmissions]);

    const onSubmit: SubmitHandler<TSubGrantSubmissionFormData> = async (
        data
    ) => {
        try {
            // Validate that we have a sub_grant ID
            if (!actualSubGrantId) {
                toast.error("Sub-grant ID is required. Please access this form from a sub-grant page.");
                return;
            }

            // Prevent submission if there are duplicates (unless editing existing)
            if (duplicateWarning.type && !submissionId) {
                toast.error(`Cannot submit: ${duplicateWarning.message}`);
                return;
            }

            if (actualSubGrantId && submissionId) {
                const responseData = await updateSubGrantSubmission({
                    ...data,
                    sub_grant: actualSubGrantId,
                });
                toast.success("Manual Submission Updated");
                const newSubmissionId = submissionId || responseData?.data?.id || "";
                router.push(`/dashboard/c-and-g/sub-grant/awards/${actualSubGrantId}/submission/create/upload?partnerSubId=${newSubmissionId}`);
            } else {
                const responseData = await createSubGrantSubmission({
                    ...data,
                    sub_grant: actualSubGrantId,
                });
                toast.success("Manual Submission Created");
                const newSubmissionId = submissionId || responseData?.data?.id || "";
                // Use the appropriate URL format based on where the ID came from
                if (subGrantId) {
                    router.push(`/dashboard/c-and-g/sub-grant/awards/${actualSubGrantId}/submission/create/upload?partnerSubId=${newSubmissionId}`);
                } else {
                    router.push(`/dashboard/c-and-g/sub-grant/awards/submission/create/upload?partnerSubId=${newSubmissionId}&subGrantId=${actualSubGrantId}`);
                }
            }
        } catch (error: any) {
            toast.error(error?.data?.message ?? error?.message ?? "Something went wrong");
        }
    };

    const { data } = useGetSingleSubGrantManualSub(
        submissionId || skipToken
    );

    useEffect(() => {
        if (data) {
            form.reset({ ...data.data, partner: data.data.partner.id } as any);
        }
    }, [data]);

    return (
        <ManualSubGrantStepWrapper>
            <div className="w-full flex flex-col text-[#1A0000] px-5 gap-y-[3rem]">
                <p className="text-xl font-bold">Manual Submission Form</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-8">
                            <FormSelect
                                label="Partner"
                                name="partner"
                                placeholder="Select Partner"
                                required
                                options={partnerOptions}
                            />
                            <FormInput
                                label="Legal Name of the Organization"
                                name="organisation_name"
                                placeholder="Enter Organization Name"
                                required
                            />
                            <h3 className="font-semibold w-full col-span-2">
                                1st Principal's Name & Title
                            </h3>
                            <FormInput
                                label="Name"
                                name="principal_one_name"
                                placeholder="Enter 1st Principal Name"
                                required
                            />
                            <FormInput
                                label="Designation"
                                name="principal_one_designaation"
                                placeholder="Enter 1st Principal Designation"
                                required
                            />

                            <h3 className="font-semibold w-full col-span-2">
                                2nd Principal's Name & Title
                            </h3>

                            <FormInput
                                label="Name"
                                name="principal_two_name"
                                placeholder="Enter 2nd Principal Name"
                                required
                            />
                            <FormInput
                                label="Designation"
                                name="principal_two_designation"
                                placeholder="Enter 2nd Principal Designation"
                                required
                            />

                            <FormTextArea
                                name="address"
                                label="Address"
                                placeholder="Enter Address"
                                required
                                className="col-span-2"
                            />
                            <FormInput
                                type="number"
                                label="Telephone"
                                name="phone_number"
                                placeholder="Enter Telephone"
                                required
                            />
                            <FormInput
                                label="Fax"
                                name="fax"
                                placeholder="Enter Fax"
                                required
                            />

                            <FormInput
                                type="email"
                                label="Email Address"
                                name="email"
                                placeholder="Enter Email"
                                required
                            />

                            <FormInput
                                label="Web Address"
                                name="web_address"
                                placeholder="Enter Web Address"
                                required
                            />
                            <FormInput
                                type="number"
                                label="DUNS Number (for USG awards only)"
                                name="duns_number"
                                placeholder="Enter DUNS Number"
                                required
                                className="col-span-2"
                            />

                            <FormSelect
                                label="Has Financial Conflict of Interest Policy as applicable to U.S. PHS agencies’ funding."
                                name="has_conflict_of_interest"
                                placeholder="Select Has Conflict of Interest"
                                required
                                options={[
                                    { label: "Yes", value: "true" },
                                    { label: "No", value: "false" },
                                ]}
                                className="col-span-2"
                            />

                            <FormSelect
                                label="Organization Type "
                                name="organisation_type"
                                options={[
                                    { label: "For Profit", value: "FOR_PROFIT" },
                                    { label: "Not for Profit or Nongovernmental", value: "NON_PROFIT" },
                                    { label: "Governmental", value: "GOVERNMENT" },
                                    { label: "University", value: "UNIVERSITY" },
                                    { label: "Other", value: "OTHER" },
                                ]}
                                placeholder="Select Organization Type"
                                required
                                className="col-span-2"
                            />
                        </div>

                        {/* Duplicate Warning Display */}
                        {duplicateWarning.type && (
                            <div className="mt-6 p-4 border border-red-300 bg-red-50 rounded-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-red-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">
                                            Duplicate Submission Detected
                                        </h3>
                                        <div className="mt-1 text-sm text-red-700">
                                            <p>{duplicateWarning.message}</p>
                                            {duplicateWarning.existingSubmission && (
                                                <p className="mt-1">
                                                    <strong>Existing submission details:</strong>
                                                    <br />
                                                    Organization: {duplicateWarning.existingSubmission.organisation_name}
                                                    <br />
                                                    Email: {duplicateWarning.existingSubmission.email}
                                                    <br />
                                                    Created: {new Date(duplicateWarning.existingSubmission.created_datetime).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-x-5 mt-8">
                            <FormButton
                                variant="outline"
                                type="button"
                                size="lg"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </FormButton>

                            <FormButton
                                type="submit"
                                size="lg"
                                loading={isCreateLoading || isModifyLoading}
                                disabled={duplicateWarning.type !== null && !submissionId}
                            >
                                {duplicateWarning.type && !submissionId ? "Cannot Submit - Duplicate Found" : "Next"}
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </div>
        </ManualSubGrantStepWrapper>
    );
}
