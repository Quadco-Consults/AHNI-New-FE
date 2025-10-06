"use client";

import BackNavigation from "components/atoms/BackNavigation";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import SubGrantExpenditureHistory from "./_components/SubGrantExpenditureHistory";
import SubGrantObligationHistory from "./_components/SubGrantObligationHistory";
import SubGrantModificationHistory from "./_components/SubGrantModificationHistory";
import AwardDetailsTab from "./_components/AwardDetailsTab";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useState } from "react";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";

const SubGrantAwardDetails = () => {
    const [tabValue, setTabValue] = useState("details");

    const params = useParams();
    const subGrantId = params?.id as string;
    const dispatch = useAppDispatch();

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
                    <TabsTrigger value="details">Award Details</TabsTrigger>

                    <TabsTrigger value="obligation">Obligations</TabsTrigger>

                    <TabsTrigger value="expenditure">Expenditure History</TabsTrigger>

                    <TabsTrigger value="modifications">Modifications</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <AwardDetailsTab subGrantId={subGrantId} />
                </TabsContent>

                <TabsContent value="obligation">
                    <SubGrantObligationHistory subGrantId={subGrantId} />
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

export default SubGrantAwardDetails;
