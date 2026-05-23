"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import ManualSubGrantStepWrapper from "./Layout";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/atoms/FormInput";
import FormTextArea from "@/components/atoms/FormTextArea";
import FormSelect from "@/components/atoms/FormSelect";
import FormButton from "@/components/FormButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { CG_ROUTES } from "@/constants/RouterConstants";
import {
    SubGrantSubmissionSchema,
    TSubGrantSubmissionFormData,
} from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useGetAllPartners } from "@/features/modules/controllers/project/partnerController";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
    useCreateSubGrantManualSub,
    useGetSingleSubGrantManualSub,
    useModifySubGrantManualSub,
} from "@/features/contracts-grants/controllers/submissionController";
import { skipToken } from "@reduxjs/toolkit/query";

export default function CreateSubGrantSubDetails() {
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

    const { data: partner } = useGetAllPartners({
        page: 1,
        size: 2000000,
    });

    const partnerOptions = useMemo(
        () =>
            partner?.data.results.map(({ name, id }) => ({
                label: name,
                value: id,
            })),
        [partner]
    );

    const { createSubGrantSubmission, isLoading: isCreateLoading } =
        useCreateSubGrantManualSub();

    const { updateSubGrantSubmission, isLoading: isModifyLoading } =
        useModifySubGrantManualSub(submissionId || "");

    const onSubmit: SubmitHandler<TSubGrantSubmissionFormData> = async (
        data
    ) => {
        try {
            if (subGrantId && submissionId) {
                const responseData = await updateSubGrantSubmission({
                    ...data,
                    sub_grant: subGrantId ?? "",
                });
                toast.success("Manual Submission Updated");
                const newSubmissionId = submissionId || responseData?.data?.id || "";
                router.push(`/dashboard/c-and-g/sub-grant/awards/${subGrantId}/submission/create/upload?partnerSubId=${newSubmissionId}`);
            } else {
                const responseData = await createSubGrantSubmission({
                    ...data,
                    sub_grant: subGrantId ?? "",
                });
                toast.success("Manual Submission Created");
                const newSubmissionId = submissionId || responseData?.data?.id || "";
                router.push(`/dashboard/c-and-g/sub-grant/awards/${subGrantId}/submission/create/upload?partnerSubId=${newSubmissionId}`);
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
                                MD/CEO Name & Title
                            </h3>
                            <FormInput
                                label="Name"
                                name="principal_one_name"
                                placeholder="Enter MD/CEO Name"
                                required
                            />
                            <FormInput
                                label="Designation"
                                name="principal_one_designaation"
                                placeholder="Enter MD/CEO Designation"
                                required
                            />

                            <h3 className="font-semibold w-full col-span-2">
                                Director Name & Title
                            </h3>

                            <FormInput
                                label="Name"
                                name="principal_two_name"
                                placeholder="Enter Director Name"
                                required
                            />
                            <FormInput
                                label="Designation"
                                name="principal_two_designation"
                                placeholder="Enter Director Designation"
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
                            >
                                Next
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </div>
        </ManualSubGrantStepWrapper>
    );
}
