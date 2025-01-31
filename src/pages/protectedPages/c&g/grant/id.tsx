import BackNavigation from "atoms/BackNavigation";
import React, { useState } from "react";
import GrantDetailsCard from "./_components/GrantDetailsCard";
import ExpenditureHistory from "./_components/ExpenditureHistory";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "components/shared/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useGetSingleGrantQuery } from "services/c&g/grant";
import { skipToken } from "@reduxjs/toolkit/query";

const GrantDetails: React.FC = () => {
    const [tabValue, setTabValue] = useState("details");

    const { id } = useParams();

    const { data, isLoading } = useGetSingleGrantQuery(id ?? skipToken);

    const dispatch = useAppDispatch();

    console.log(tabValue);

    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between">
                <BackNavigation />

                {(tabValue === "expenditure-history" ||
                    tabValue === "obligations") && (
                    <Button
                        className="flex gap-2 py-6"
                        type="button"
                        onClick={() => {
                            dispatch(
                                openDialog({
                                    type:
                                        tabValue === "expenditure-history"
                                            ? DialogType.ExpenditureModal
                                            : DialogType.ActivityUpload,
                                    dialogProps: {
                                        header:
                                            tabValue === "expenditure-history"
                                                ? "Add Expenditure"
                                                : "Add Obligation",
                                        width: "max-w-lg",
                                        grantId: id,
                                    },
                                })
                            );
                        }}
                    >
                        <AddSquareIcon />
                        {tabValue === "expenditure-history"
                            ? "Add Expenditure"
                            : "Add Obligation"}
                    </Button>
                )}
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <Tabs
                    defaultValue={tabValue}
                    value={tabValue}
                    onValueChange={(value) => setTabValue(value)}
                    className="space-y-5"
                >
                    <TabsList className="ml-10">
                        <TabsTrigger value="details">Details</TabsTrigger>

                        <TabsTrigger value="expenditure-history">
                            Expenditure History
                        </TabsTrigger>

                        <TabsTrigger value="obligations">
                            Obligations
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                        {data && <GrantDetailsCard {...data?.data} />}
                    </TabsContent>

                    <TabsContent value="expenditure-history">
                        {data && <ExpenditureHistory {...data?.data} />}
                    </TabsContent>
                </Tabs>
            )}
        </section>
    );
};

export default GrantDetails;
