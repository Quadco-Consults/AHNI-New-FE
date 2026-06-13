"use client";

import BackNavigation from "@/components/atoms/BackNavigation";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { Button } from "@/components/ui/button";
import SubGrantExpenditureHistory from "./SubGrantExpenditureHistory";
import SubGrantObligationHistory from "./SubGrantObligationHistory";
import SubGrantModificationHistory from "./SubGrantModificationHistory";
import AwardDetailsTab from "./AwardDetailsTab";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "@/components/Loading";
import { useState } from "react";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import { useAppDispatch } from "@/hooks/useStore";

/**
 * Award Management Component
 *
 * This component manages the AWARDED phase of a SubGrant.
 * It uses the SubGrant ID (not a separate award ID) to manage:
 * - Award Details
 * - Obligations
 * - Expenditures
 * - Modifications
 *
 * Note: All API calls use subGrantId because the backend relationships
 * are built on SubGrant, not SubGrantAward.
 */
const SubGrantManagement = () => {
    const [tabValue, setTabValue] = useState("award-details");

    const params = useParams();
    const subGrantId = params?.id as string;
    const dispatch = useAppDispatch();

    const { data, isLoading } = useGetSingleSubGrant(subGrantId ?? skipToken);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    // Check if this subgrant is actually awarded
    const subgrant = data?.data;
    const isAwarded = subgrant?.status === "AWARDED" || subgrant?.status === "ACTIVE";

    if (!isAwarded) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <p className="text-lg">This subgrant has not been awarded yet.</p>
                <p className="text-sm text-gray-500">
                    Current status: {subgrant?.status || "Unknown"}
                </p>
            </div>
        );
    }

    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between">
                <BackNavigation />

                {(tabValue === "expenditure" ||
                    tabValue === "obligation" ||
                    tabValue === "modifications") &&
                    subGrantId && (
                        <Button
                            className="flex gap-2 py-6"
                            type="button"
                            onClick={() => {
                                dispatch(
                                    openDialog({
                                        type:
                                            tabValue === "expenditure"
                                                ? DialogType.ExpenditureModal
                                                : tabValue === "obligation"
                                                ? DialogType.ADD_SUBGRANT_OBLIGATION_MODAL
                                                : DialogType.MODIFY_GRANT,
                                        dialogProps: {
                                            header:
                                                tabValue === "expenditure"
                                                    ? "Add Expenditure"
                                                    : tabValue === "obligation"
                                                    ? "Add Obligation"
                                                    : "Add Modification",
                                            width: "max-w-lg",
                                            // Pass SubGrant ID, not award ID
                                            subGrantId: subGrantId,
                                            data: { id: subGrantId },
                                        },
                                    })
                                );
                            }}
                        >
                            <AddSquareIcon />
                            {tabValue === "expenditure"
                                ? "Add Expenditure"
                                : tabValue === "obligation"
                                ? "Add Obligation"
                                : "Add Modification"}
                        </Button>
                    )}
            </div>

            <Tabs
                defaultValue={tabValue}
                value={tabValue}
                onValueChange={(value) => setTabValue(value)}
                className="space-y-5"
            >
                <TabsList className="ml-10">
                    <TabsTrigger value="award-details">Award Details</TabsTrigger>
                    <TabsTrigger value="obligation">Obligations</TabsTrigger>
                    <TabsTrigger value="expenditure">Expenditure History</TabsTrigger>
                    <TabsTrigger value="modifications">Modifications</TabsTrigger>
                </TabsList>

                <TabsContent value="award-details">
                    <AwardDetailsTab subGrantId={subGrantId} subgrant={subgrant} />
                </TabsContent>

                <TabsContent value="obligation">
                    <SubGrantObligationHistory subGrantId={subGrantId} awardAmountUsd={subgrant?.amount_usd} />
                </TabsContent>

                <TabsContent value="expenditure">
                    <SubGrantExpenditureHistory subGrantId={subGrantId} />
                </TabsContent>

                <TabsContent value="modifications">
                    <SubGrantModificationHistory subGrantId={subGrantId} />
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default SubGrantManagement;
