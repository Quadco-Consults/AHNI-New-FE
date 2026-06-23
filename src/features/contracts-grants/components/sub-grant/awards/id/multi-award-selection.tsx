"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, DollarSign, Users, AlertCircle } from "lucide-react";
import BackNavigation from "@/components/BackNavigation";
import { useGetAllSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { useCreateMultiAward } from "@/features/contracts-grants/controllers/subGrantAwardController";
import { Loading } from "@/components/Loading";

interface BeneficiaryAllocation {
    submissionId: string;
    organisationName: string;
    amountUsd: string;
    amountLocal: string;
    percentage: string;
}

export default function MultiAwardSelection() {
    const params = useParams();
    const router = useRouter();
    const subGrantId = params?.id as string;

    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<Set<string>>(new Set());
    const [allocations, setAllocations] = useState<Map<string, BeneficiaryAllocation>>(new Map());
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const { createMultiAward, isLoading: isAwarding } = useCreateMultiAward();

    const { data: submissionsData, isLoading: submissionsLoading } = useGetAllSubGrantManualSub(
        subGrantId
            ? {
                  sub_grant: subGrantId as string,
                  page: 1,
                  size: 100,
              }
            : skipToken
    );

    const { data: subGrantData, isLoading: subGrantLoading } = useGetSingleSubGrant(
        subGrantId,
        !!subGrantId
    );

    const assessedSubmissions = (submissionsData?.data.results || [])
        .filter((submission: any) =>
            (submission.status === "SHORTLISTED" || submission.is_shortlisted) &&
            submission.has_assessment
        )
        .sort((a: any, b: any) => (b.assessment_score || 0) - (a.assessment_score || 0));

    const totalBudgetUsd = parseFloat(subGrantData?.data?.amount_usd || "0");
    const totalBudgetLocal = parseFloat(subGrantData?.data?.amount_ngn || "0");

    const calculateTotals = () => {
        let totalAllocatedUsd = 0;
        let totalAllocatedLocal = 0;

        allocations.forEach((allocation) => {
            totalAllocatedUsd += parseFloat(allocation.amountUsd || "0");
            totalAllocatedLocal += parseFloat(allocation.amountLocal || "0");
        });

        return {
            allocatedUsd: totalAllocatedUsd,
            allocatedLocal: totalAllocatedLocal,
            remainingUsd: totalBudgetUsd - totalAllocatedUsd,
            remainingLocal: totalBudgetLocal - totalAllocatedLocal,
        };
    };

    const totals = calculateTotals();

    const toggleBeneficiary = (submission: any) => {
        const newSelected = new Set(selectedBeneficiaries);
        const newAllocations = new Map(allocations);

        if (newSelected.has(submission.id)) {
            newSelected.delete(submission.id);
            newAllocations.delete(submission.id);
        } else {
            newSelected.add(submission.id);
            // Initialize with equal split
            const equalSplitUsd = (totalBudgetUsd / (newSelected.size)).toFixed(2);
            const equalSplitLocal = (totalBudgetLocal / (newSelected.size)).toFixed(2);

            newAllocations.set(submission.id, {
                submissionId: submission.id,
                organisationName: submission.organisation_name,
                amountUsd: equalSplitUsd,
                amountLocal: equalSplitLocal,
                percentage: ((parseFloat(equalSplitUsd) / totalBudgetUsd) * 100).toFixed(2),
            });

            // Recalculate other allocations
            newSelected.forEach((id) => {
                if (id !== submission.id) {
                    const equalSplitUsd = (totalBudgetUsd / newSelected.size).toFixed(2);
                    const equalSplitLocal = (totalBudgetLocal / newSelected.size).toFixed(2);
                    const existing = newAllocations.get(id);
                    if (existing) {
                        newAllocations.set(id, {
                            ...existing,
                            amountUsd: equalSplitUsd,
                            amountLocal: equalSplitLocal,
                            percentage: ((parseFloat(equalSplitUsd) / totalBudgetUsd) * 100).toFixed(2),
                        });
                    }
                }
            });
        }

        setSelectedBeneficiaries(newSelected);
        setAllocations(newAllocations);
    };

    const updateAllocation = (submissionId: string, field: "amountUsd" | "amountLocal" | "percentage", value: string) => {
        const newAllocations = new Map(allocations);
        const allocation = newAllocations.get(submissionId);

        if (!allocation) return;

        if (field === "amountUsd") {
            allocation.amountUsd = value;
            allocation.percentage = ((parseFloat(value) / totalBudgetUsd) * 100).toFixed(2);
            // Calculate local currency based on ratio
            allocation.amountLocal = ((parseFloat(value) / totalBudgetUsd) * totalBudgetLocal).toFixed(2);
        } else if (field === "percentage") {
            allocation.percentage = value;
            allocation.amountUsd = ((parseFloat(value) / 100) * totalBudgetUsd).toFixed(2);
            allocation.amountLocal = ((parseFloat(value) / 100) * totalBudgetLocal).toFixed(2);
        }

        newAllocations.set(submissionId, allocation);
        setAllocations(newAllocations);
    };

    const handleAwardMultiple = async () => {
        if (selectedBeneficiaries.size === 0) {
            toast.error("Please select at least one beneficiary");
            return;
        }

        if (totals.remainingUsd < -0.01 || totals.remainingLocal < -0.01) {
            toast.error("Total allocation exceeds available budget");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Please select start and end dates");
            return;
        }

        try {
            const awards = Array.from(allocations.values()).map((allocation) => ({
                submission: allocation.submissionId,
                award_amount_usd: allocation.amountUsd,
                award_amount_ngn: allocation.amountLocal,
                percentage: parseFloat(allocation.percentage),
            }));

            await createMultiAward({
                sub_grant: subGrantId,
                awards,
                award_start_date: startDate,
                award_end_date: endDate,
            });

            toast.success(`Sub-grant awarded to ${selectedBeneficiaries.size} beneficiaries!`);
            router.push(`/dashboard/c-and-g/sub-grant/awards/${subGrantId}`);
        } catch (error: any) {
            toast.error(error?.message || "Failed to award sub-grant");
        }
    };

    if (submissionsLoading || subGrantLoading) {
        return <Loading />;
    }

    const isOverBudget = totals.remainingUsd < -0.01 || totals.remainingLocal < -0.01;

    return (
        <section className="space-y-6">
            <BackNavigation />

            <div className="flex items-center gap-3">
                <Users className="text-green-600" size={32} />
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Multi-Beneficiary Award</h1>
                    <p className="text-gray-600">
                        Select and allocate awards to multiple beneficiaries
                    </p>
                </div>
            </div>

            {/* Budget Overview */}
            <Card className="bg-blue-50 border-blue-200">
                <div className="grid grid-cols-4 gap-6">
                    <div>
                        <Label className="text-sm text-blue-800">Total Budget (USD)</Label>
                        <p className="text-2xl font-bold text-blue-900">
                            ${totalBudgetUsd.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <Label className="text-sm text-blue-800">Allocated (USD)</Label>
                        <p className="text-2xl font-bold text-blue-900">
                            ${totals.allocatedUsd.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <Label className="text-sm text-blue-800">Remaining (USD)</Label>
                        <p className={`text-2xl font-bold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                            ${totals.remainingUsd.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <Label className="text-sm text-blue-800">Selected Beneficiaries</Label>
                        <p className="text-2xl font-bold text-blue-900">
                            {selectedBeneficiaries.size}
                        </p>
                    </div>
                </div>

                {isOverBudget && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2">
                        <AlertCircle className="text-red-600" size={20} />
                        <p className="text-sm text-red-800 font-medium">
                            Warning: Total allocation exceeds available budget!
                        </p>
                    </div>
                )}
            </Card>

            {/* Beneficiary Selection */}
            <Card>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Select Beneficiaries & Allocate Funds
                </h2>

                <div className="space-y-4">
                    {assessedSubmissions.map((submission: any, index: number) => {
                        const isSelected = selectedBeneficiaries.has(submission.id);
                        const allocation = allocations.get(submission.id);

                        return (
                            <Card
                                key={submission.id}
                                className={`p-4 ${
                                    isSelected
                                        ? "border-2 border-green-500 bg-green-50"
                                        : "border border-gray-200"
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggleBeneficiary(submission)}
                                        className="mt-1"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-gray-600">Rank #{index + 1}</Badge>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {submission.organisation_name}
                                                </h3>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-700">
                                                Score: {submission.assessment_score || 0}/100
                                            </Badge>
                                        </div>

                                        {isSelected && allocation && (
                                            <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                                <div>
                                                    <Label className="text-sm">Amount (USD)</Label>
                                                    <Input
                                                        type="number"
                                                        value={allocation.amountUsd}
                                                        onChange={(e) =>
                                                            updateAllocation(
                                                                submission.id,
                                                                "amountUsd",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm">Amount (Local)</Label>
                                                    <Input
                                                        type="number"
                                                        value={allocation.amountLocal}
                                                        disabled
                                                        className="mt-1 bg-gray-100"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm">Percentage (%)</Label>
                                                    <Input
                                                        type="number"
                                                        value={allocation.percentage}
                                                        onChange={(e) =>
                                                            updateAllocation(
                                                                submission.id,
                                                                "percentage",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </Card>

            {/* Award Period */}
            <Card>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Award Period</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <Label>Start Date</Label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label>End Date</Label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>

                <Button
                    size="lg"
                    onClick={handleAwardMultiple}
                    disabled={isAwarding || selectedBeneficiaries.size === 0 || isOverBudget || !startDate || !endDate}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <Award size={16} className="mr-2" />
                    {isAwarding
                        ? "Awarding..."
                        : `Award to ${selectedBeneficiaries.size} Beneficiaries`}
                </Button>
            </div>
        </section>
    );
}
