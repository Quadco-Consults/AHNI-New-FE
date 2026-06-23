"use client";

import BackNavigation from "@/components/BackNavigation";
import AddSquareIcon from "@/components/icons/AddSquareIcon";
import { Button } from "@/components/ui/button";
import SubGrantExpenditureHistory from "./_components/SubGrantExpenditureHistory";
import SubGrantObligationHistory from "./_components/SubGrantObligationHistory";
import SubGrantModificationHistory from "./_components/SubGrantModificationHistory";
import SubGrantDisbursementHistory from "./_components/SubGrantDisbursementHistory";
import AwardDetailsTab from "./_components/AwardDetailsTab";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dialogs";
import { useAppDispatch } from "@/hooks/useStore";
import { useGetSingleSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { useGetAllSubGrantObligations } from "@/features/contracts-grants/controllers/subGrantObligationController";

const SubGrantAwardDetails = () => {
    const [tabValue, setTabValue] = useState("details");

    const params = useParams();
    const subGrantId = params?.id as string;
    const dispatch = useAppDispatch();

    // Fetch subgrant data to get amount_usd for balance calculation
    const { data } = useGetSingleSubGrant(subGrantId, !!subGrantId);
    const subGrant = data?.data;

    // Fetch obligations to calculate total obligation amount
    const { data: obligationsData } = useGetAllSubGrantObligations({
        subGrantId: subGrantId || "",
        page: 1,
        size: 1000, // Get all obligations for calculation
        enabled: !!subGrantId,
    });

    // Calculate total obligation amount
    const totalObligationAmount = useMemo(() => {
        const obligations = obligationsData?.data?.results || [];
        return obligations.reduce((sum: number, obligation: any) => {
            return sum + Number(obligation.amount || 0);
        }, 0);
    }, [obligationsData?.data?.results]);

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
                                                ? DialogType.ADD_OBLIGATION_MODAL
                                                : tabValue === "disbursements"
                                                ? DialogType.ADD_DISBURSEMENT_MODAL
                                                : DialogType.MODIFY_GRANT,
                                        dialogProps: {
                                            header:
                                                tabValue === "expenditure"
                                                    ? "Add Expenditure"
                                                    : tabValue === "obligation"
                                                    ? "Add Obligation"
                                                    : tabValue === "disbursements"
                                                    ? "Add Disbursement"
                                                    : "Add Modification",
                                            width: "max-w-lg",
                                            subGrantId: subGrantId,
                                            isSubGrant: tabValue === "disbursements" ? true : undefined,
                                            data: {
                                                id: subGrantId,
                                                title: subGrant?.project?.title || "N/A",
                                                subGrantName: subGrant?.title || "N/A",
                                            },
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
                                : tabValue === "disbursements"
                                ? "Add Disbursement"
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
                    <TabsTrigger value="details">Award Details</TabsTrigger>

                    <TabsTrigger value="obligation">Obligations</TabsTrigger>

                    <TabsTrigger value="expenditure">Expenditure History</TabsTrigger>

                    <TabsTrigger value="disbursements">Disbursements</TabsTrigger>

                    <TabsTrigger value="modifications">Modifications</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <AwardDetailsTab subGrantId={subGrantId} />
                </TabsContent>

                <TabsContent value="obligation">
                    <SubGrantObligationHistory
                        subGrantId={subGrantId}
                        awardAmountUsd={subGrant?.amount_usd}
                    />
                </TabsContent>

                <TabsContent value="expenditure">
                    <SubGrantExpenditureHistory
                        subGrantId={subGrantId}
                        total_obligation_amount={totalObligationAmount}
                        projectName={subGrant?.project?.title}
                    />
                </TabsContent>

                <TabsContent value="disbursements">
                    <SubGrantDisbursementHistory subGrantId={subGrantId} />
                </TabsContent>

                <TabsContent value="modifications">
                    <SubGrantModificationHistory subGrantId={subGrantId} />
                </TabsContent>
            </Tabs>
        </section>
    );
};

export default SubGrantAwardDetails;
