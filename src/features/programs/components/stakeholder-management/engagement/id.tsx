"use client";

import { skipToken } from "@reduxjs/toolkit/query/react";
import LongArrowLeft from "components/icons/LongArrowLeft";
import BreadcrumbCard from "components/Breadcrumb";
import Card from "components/Card";
import { LoadingSpinner } from "components/Loading";
import { Label } from "components/ui/label";
import { useRouter, useParams } from "next/navigation";
import { useGetSingleEngagementPlan } from "@/features/programs/controllers/engagementPlanController";

const breadcrumbs = [
    { name: "Programs", icon: true },
    { name: "Stakeholder Management", icon: true },
    { name: "Engagement Plan", icon: true },
    { name: "Details", icon: false },
];

const EngagementDetails = () => {
    const { id } = useParams();
    const { data: engagementPlan, isLoading } = useGetSingleEngagementPlan(
        id ?? skipToken
    );

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    return (
        <div className="space-y-6 min-h-screen">
            <BreadcrumbCard list={breadcrumbs} />
            <button
                onClick={goBack}
                className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
            >
                <LongArrowLeft />
            </button>

            <Card className="space-y-6">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <h4 className="font-semibold">Project Name</h4>
                        <p className="font-extralight">
                            {engagementPlan?.data.project.title}
                        </p>

                        <div className="grid grid-cols-2 gap-10">
                            <div>
                                <h4 className="font-semibold">
                                    Project Deliverables:
                                </h4>
                                <p>
                                    {engagementPlan?.data.project_deliverables}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold">
                                    Project Manager:
                                </h4>
                                <p>
                                    {engagementPlan?.data.project.project_managers
                                        .map(
                                            ({ first_name, last_name }) =>
                                                `${first_name} ${last_name}`
                                        )
                                        .join(", ")}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div>
                                <h4 className="font-semibold">Start Date:</h4>
                                <p>{engagementPlan?.data.start_date}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">End Date:</h4>
                                <p>{engagementPlan?.data.end_date}</p>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3 pt-5">
                            <Label className="font-semibold">
                                {engagementPlan?.data.stakeholders.length}{" "}
                                Stakeholders selected for this state
                            </Label>

                            <div className="space-y-3">
                                {engagementPlan?.data.stakeholders.map(
                                    (stakeholder) => (
                                        <div
                                            key={stakeholder.id}
                                            className="flex flex-col items-center gap-5 md:flex-row"
                                        >
                                            <div className="bg-[#EBE8E1] w-full space-y-4 rounded-lg p-3 md:w-1/3">
                                                <h4 className="font-semibold">
                                                    {
                                                        stakeholder.stakeholder
                                                            .name
                                                    }
                                                </h4>

                                                <div className="text-sm">
                                                    <h4 className="font-semibold">
                                                        Institution/Organization:
                                                    </h4>
                                                    <p>
                                                        {
                                                            stakeholder
                                                                .stakeholder
                                                                .organization
                                                        }
                                                    </p>
                                                </div>

                                                <div className="grid text-xs grid-cols-2 gap-3">
                                                    <div>
                                                        <h4 className="font-semibold">
                                                            Project Role:
                                                        </h4>
                                                        <p>
                                                            {
                                                                stakeholder
                                                                    .stakeholder
                                                                    .project_role
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">
                                                            Designation:
                                                        </h4>
                                                        <p>
                                                            {
                                                                stakeholder
                                                                    .stakeholder
                                                                    .designation
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid text-xs grid-cols-2 gap-3">
                                                    <div>
                                                        <h4 className="font-semibold">
                                                            Phone Number:
                                                        </h4>
                                                        <p>
                                                            {
                                                                stakeholder
                                                                    .stakeholder
                                                                    .phone_number
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">
                                                            E-mail:
                                                        </h4>
                                                        <p>
                                                            {
                                                                stakeholder
                                                                    .stakeholder
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 w-full md:w-2/3">
                                                <div>
                                                    <Label className="font-semibold">
                                                        Influence
                                                    </Label>
                                                    <p>
                                                        {stakeholder.influence}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className="font-semibold">
                                                        Information Type
                                                    </Label>
                                                    <p>
                                                        {
                                                            stakeholder.information_type
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className="font-semibold">
                                                        Decision Maker
                                                    </Label>
                                                    <p>
                                                        {
                                                            stakeholder.decision_maker
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className="font-semibold">
                                                        Frequency
                                                    </Label>
                                                    <p>
                                                        {stakeholder.frequency}
                                                    </p>
                                                </div>
                                                <div>
                                                    <Label className="font-semibold">
                                                        Type
                                                    </Label>
                                                    <p>{stakeholder.type}</p>
                                                </div>
                                                <div>
                                                    <Label className="font-semibold">
                                                        Commitment Level
                                                    </Label>
                                                    <p>
                                                        {
                                                            stakeholder.commitment_level
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default EngagementDetails;
