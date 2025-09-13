"use client";

import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useEffect, useState } from "react";
import NewApplicantStaffForm from "./NewConsultancyStaffForm";
import CreateExistingApplicantStaff from "./CreateExistingConsultancyStaff";
import { useSearchParams } from "next/navigation";
import { useGetSingleConsultancyStaff } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { skipToken } from "@reduxjs/toolkit/query";
import { LoadingSpinner } from "components/Loading";

export default function CreateApplicantStaff() {
    const searchParams = useSearchParams();
    const consultancyStaffId = searchParams?.get("id");

    const [tabValue, setTabValue] = useState<string | null>(null);

    useEffect(() => {
        if (consultancyStaffId) {
            setTabValue("new");
            return;
        }

        setTabValue("existing");
    }, [consultancyStaffId]);

    const { data, isLoading } = useGetSingleConsultancyStaff(
        consultancyStaffId || skipToken
    );

    return (
        <section>
            <BackNavigation
                extraText={`${data ? "Edit" : "Create New"} Applicant`}
            />

            {tabValue && (
                <>
                    <Tabs
                        defaultValue="existing"
                        value={tabValue}
                        onValueChange={(value) => setTabValue(value)}
                    >
                        <TabsList>
                            <TabsTrigger
                                value="existing"
                                disabled={Boolean(consultancyStaffId)}
                            >
                                Select Existing
                            </TabsTrigger>

                            <TabsTrigger value="new">Add New</TabsTrigger>
                        </TabsList>

                        <TabsContent value="existing"></TabsContent>
                        <TabsContent value="new"></TabsContent>
                    </Tabs>

                    <Card>
                        {tabValue === "existing" ? (
                            <CreateExistingApplicantStaff />
                        ) : (
                            <NewApplicantStaffForm
                                consultancyStaffData={data?.data}
                            />
                        )}
                    </Card>
                </>
            )}
        </section>
    );
}
