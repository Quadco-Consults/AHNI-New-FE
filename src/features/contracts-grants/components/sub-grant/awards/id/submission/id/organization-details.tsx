"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import Card from "components/Card";
import { LoadingSpinner } from "components/Loading";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useGetSingleSubGrantManualSub } from "@/features/contracts-grants/controllers/submissionController";

export default function PartnerSubmissionDetails() {
    const { subGrantId, partnerSubId: submissionId } = useParams();

    const { data, isLoading } = useGetSingleSubGrantManualSub(
        submissionId ?? skipToken
    );

    const partnerSubmissionDetails = useMemo(() => {
        return [
            {
                label: "1st Principal's Name & Title",
                subData: [
                    {
                        label: "Name:",
                        value: data?.data.principal_one_name ?? "N/A",
                    },
                    {
                        label: "Designation",
                        value: data?.data.principal_one_designaation ?? "N/A",
                    },
                ],
            },
            {
                label: "2nd Principal's Name & Title",
                subData: [
                    {
                        label: "Name:",
                        value: data?.data.principal_two_name ?? "N/A",
                    },
                    {
                        label: "Designation:",
                        value: data?.data?.principal_two_designation ?? "N/A",
                    },
                ],
            },
            { label: "Address", value: data?.data.address ?? "N/A" },
            { label: "Telephone", value: data?.data.phone_number ?? "N/A" },
            { label: "Fax", value: data?.data?.fax ?? "N/A" },
            { label: "Web Address", value: data?.data.web_address ?? "N/A" },
            {
                label: "DUNS Number (for USG awards only)",
                value: data?.data?.duns_number ?? "N/A",
            },
            {
                label: "Has Financial Conflict of Interest Policy as applicable to U.S. PHS agencies’ funding.",
                value:
                    data?.data?.has_conflict_of_interest === true
                        ? "Yes"
                        : "No",
            },
            {
                label: "Organization Type",
                value: data?.data?.organisation_type ?? "N/A",
            },
        ];
    }, [data]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Card className="flex flex-col gap-y-[1.25rem] p-8">
            <p className="text-lg font-semibold">
                {data?.data.organisation_name}
            </p>
            <div className="flex flex-wrap justify-between gap-y-[1.25rem]">
                {partnerSubmissionDetails.map((item, index) => {
                    return item.subData ? (
                        <div
                            className="w-[45%] flex flex-col gap-y-[1.25rem]"
                            key={index}
                        >
                            <p className="font-semibold">{item.label}</p>
                            <div className="w-full space-y-[10px]">
                                {item.subData.map((subData, subIndex) => {
                                    return (
                                        <div
                                            className={`${"w-full"} flex gap-x-[1.25rem]`}
                                            key={subIndex}
                                        >
                                            <p className="text-sm">
                                                {subData.label}
                                            </p>
                                            <p className="text-sm">
                                                {subData.value}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`${"md:w-[45%] w-full"} flex flex-col gap-y-[1.25rem]`}
                            key={index}
                        >
                            <p className="font-semibold">{item.label}</p>
                            <p className="text-sm">{item.value}</p>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
