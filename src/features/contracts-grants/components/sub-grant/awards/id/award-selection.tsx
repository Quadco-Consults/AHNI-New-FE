"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import FormInput from "components/FormInput";
import FormSelect from "components/FormSelect";
import { Badge } from "components/ui/badge";
import { Award, DollarSign, Users } from "lucide-react";
import { Checkbox } from "components/ui/checkbox";
import BackNavigation from "components/atoms/BackNavigation";
import { useGetSingleSubGrantSubmission } from "@/features/contracts-grants/controllers/submissionController";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { useCreateAward } from "@/features/contracts-grants/controllers/subGrantAwardController";
import { Loading } from "components/Loading";

const AwardSchema = z.object({
    award_amount_usd: z.string().min(1, "Please enter award amount in USD"),
    award_amount_local: z.string().min(1, "Please enter award amount in local currency"),
    award_start_date: z.string().min(1, "Please select start date"),
    award_end_date: z.string().min(1, "Please select end date"),
    award_notes: z.string().optional(),
});

type AwardFormData = z.infer<typeof AwardSchema>;

interface AwardSelectionProps {
    submissionId?: string;
}

export default function AwardSelection({ submissionId: propSubmissionId }: AwardSelectionProps) {
    const params = useParams();
    const router = useRouter();
    const submissionId = (propSubmissionId || params?.submissionId) as string;
    const subGrantId = params?.id as string;

    const { data: submissionData, isLoading: submissionLoading } = useGetSingleSubGrantSubmission(
        submissionId,
        !!submissionId
    );
    const { data: subGrantData, isLoading: subGrantLoading } = useGetSingleSubGrant(
        subGrantId,
        !!subGrantId
    );
    const { createAward, isLoading: isAwarding } = useCreateAward();

    const form = useForm<AwardFormData>({
        resolver: zodResolver(AwardSchema),
        defaultValues: {
            award_amount_usd: "",
            award_amount_local: "",
            award_start_date: "",
            award_end_date: "",
            award_notes: "",
        },
    });

    // Pre-fill with sub-grant amounts
    useEffect(() => {
        if (subGrantData?.data) {
            form.setValue("award_amount_usd", subGrantData.data.amount_usd || "");
            form.setValue("award_amount_local", subGrantData.data.amount_ngn || "");
        }
    }, [subGrantData, form]);

    const onSubmit = async (data: AwardFormData) => {
        try {
            await createAward({
                sub_grant: subGrantId,
                submission: submissionId,
                award_amount_usd: data.award_amount_usd,
                award_amount_ngn: data.award_amount_local,
                award_start_date: data.award_start_date,
                award_end_date: data.award_end_date,
                award_notes: data.award_notes,
            });

            toast.success("Sub-grant awarded successfully!");
            router.push(`/dashboard/c-and-g/sub-grant/awards/${subGrantId}`);
        } catch (error: any) {
            toast.error(error?.message || "Failed to award sub-grant");
        }
    };

    if (submissionLoading || subGrantLoading) {
        return <Loading />;
    }

    const submission = submissionData?.data;
    const subGrant = subGrantData?.data;

    return (
        <section className="space-y-6">
            <BackNavigation />

            <div className="flex items-center gap-3">
                <Award className="text-green-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Award Sub-Grant</h1>
                    <p className="text-gray-600">
                        Award this sub-grant to the selected beneficiary
                    </p>
                </div>
            </div>

            {/* Beneficiary Information */}
            <Card>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={20} />
                    Beneficiary Information
                </h2>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Organization Name</label>
                        <p className="text-base font-semibold text-gray-800 mt-1">
                            {submission?.organisation_name}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Organization Type</label>
                        <p className="text-base font-semibold text-gray-800 mt-1">
                            {submission?.organisation_type || "N/A"}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-base text-gray-800 mt-1">{submission?.email}</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-base text-gray-800 mt-1">{submission?.phone_number}</p>
                    </div>

                    <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-600">Address</label>
                        <p className="text-base text-gray-800 mt-1">{submission?.address}</p>
                    </div>

                    {submission?.assessment_score && (
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-600">Assessment Score</label>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-2xl font-bold text-gray-800">
                                    {submission.assessment_score}/100
                                </span>
                                <Badge className="bg-green-100 text-green-700">
                                    Qualified
                                </Badge>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Award Details Form */}
            <Card>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <DollarSign size={20} />
                    Award Details
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Sub-Grant Title:</strong> {subGrant?.title}
                            </p>
                            <p className="text-sm text-blue-800 mt-1">
                                <strong>Total Available:</strong> ${subGrant?.amount_usd} USD / ₦{subGrant?.amount_ngn} NGN
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormInput
                                label="Award Amount (USD)"
                                name="award_amount_usd"
                                type="number"
                                placeholder="Enter amount in USD"
                                required
                            />

                            <FormInput
                                label="Award Amount (Local Currency)"
                                name="award_amount_local"
                                type="number"
                                placeholder="Enter amount in NGN"
                                required
                            />

                            <FormInput
                                label="Award Start Date"
                                name="award_start_date"
                                type="date"
                                required
                            />

                            <FormInput
                                label="Award End Date"
                                name="award_end_date"
                                type="date"
                                required
                            />
                        </div>

                        <FormInput
                            label="Award Notes (Optional)"
                            name="award_notes"
                            placeholder="Additional notes or conditions for this award"
                            isTextArea
                            rows={4}
                        />

                        <div className="flex items-center justify-between pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={isAwarding}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Award size={16} className="mr-2" />
                                {isAwarding ? "Awarding..." : "Award Sub-Grant"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </section>
    );
}
