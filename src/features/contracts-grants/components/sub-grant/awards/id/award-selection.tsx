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
import { useMakeAward, useCreateCommittee } from "@/features/contracts-grants/controllers/subGrantWorkflowController";
import { Loading } from "components/Loading";

const AwardSchema = z.object({
    award_amount: z.string().min(1, "Please enter award amount"),
    award_currency: z.enum(["USD", "NGN"], { required_error: "Please select currency" }),
    award_date: z.string().min(1, "Please select award date"),
    notes: z.string().optional(),
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
    const { makeAward, isLoading: isAwarding } = useMakeAward(subGrantId);
    const { createCommittee, isLoading: isCreatingCommittee } = useCreateCommittee(subGrantId);

    const form = useForm<AwardFormData>({
        resolver: zodResolver(AwardSchema),
        defaultValues: {
            award_amount: "",
            award_currency: "USD",
            award_date: "",
            notes: "",
        },
    });

    // Pre-fill with sub-grant amount
    useEffect(() => {
        if (subGrantData?.data) {
            form.setValue("award_amount", subGrantData.data.amount_usd || "");
        }
    }, [subGrantData, form]);

    const onSubmit = async (data: AwardFormData) => {
        try {
            // Step 1: Create committee to transition to ASSESSMENT status
            // Use sub-grant administrator as chairperson
            const subGrant = subGrantData?.data;
            console.log("Sub-grant data:", subGrant);
            console.log("Administrator:", subGrant?.sub_grant_administrator);

            const adminId = typeof subGrant?.sub_grant_administrator === 'string'
                ? subGrant.sub_grant_administrator
                : subGrant?.sub_grant_administrator?.id;

            console.log("Extracted admin ID:", adminId);

            if (!adminId) {
                toast.error("Unable to determine sub-grant administrator");
                return;
            }

            // Step 1: Create committee to transition to ASSESSMENT status
            try {
                // Set assessment deadline to 7 days from now
                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 7);

                const committeePayload = {
                    committee_members: [adminId],  // Array of user UUIDs
                    chairperson: adminId,           // Chairperson UUID
                    assessment_deadline: deadline.toISOString().split('T')[0]  // YYYY-MM-DD format
                };
                console.log("Creating committee with payload:", JSON.stringify(committeePayload, null, 2));
                const result = await createCommittee(committeePayload);
                console.log("Committee creation result:", result);
                toast.success("Assessment committee created and sub-grant moved to assessment status");
            } catch (committeeError: any) {
                // Log the error
                console.error("Committee creation error:", committeeError);
                console.error("Error message:", committeeError?.message);

                // Check if error indicates committee already exists
                const errorMsg = committeeError?.message?.toLowerCase() || '';
                if (errorMsg.includes('already exists') || errorMsg.includes('already created')) {
                    console.log("Committee already exists, continuing...");
                    toast.info("Committee already exists");
                } else {
                    // For other errors, stop and show error
                    toast.error("Failed to create committee: " + committeeError?.message);
                    throw committeeError;
                }
            }

            // Step 2: Make award decision
            await makeAward({
                applicantId: submissionId,
                awardAmount: parseFloat(data.award_amount),
                awardCurrency: data.award_currency,
                awardDate: data.award_date,
                notes: data.notes,
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
                                label="Award Amount"
                                name="award_amount"
                                type="number"
                                placeholder="Enter award amount"
                                required
                            />

                            <FormSelect
                                label="Currency"
                                name="award_currency"
                                options={[
                                    { label: "USD", value: "USD" },
                                    { label: "NGN", value: "NGN" }
                                ]}
                                required
                            />

                            <FormInput
                                label="Award Date"
                                name="award_date"
                                type="date"
                                required
                            />
                        </div>

                        <FormInput
                            label="Notes (Optional)"
                            name="notes"
                            placeholder="Award decision notes or conditions"
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
                                disabled={isAwarding || isCreatingCommittee}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Award size={16} className="mr-2" />
                                {isCreatingCommittee ? "Creating Committee..." : isAwarding ? "Awarding..." : "Award Sub-Grant"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </section>
    );
}
