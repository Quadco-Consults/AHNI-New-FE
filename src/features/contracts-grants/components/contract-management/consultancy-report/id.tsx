"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import BackNavigation from "components/atoms/BackNavigation";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { useParams } from "next/navigation";
import { useGetSingleConsultancyReport } from "@/features/contracts-grants/controllers/consultancyReportController";

export default function ConsultancyReportDetails() {
    const { id } = useParams();

    const { data, isLoading } = useGetSingleConsultancyReport(
        id ?? skipToken
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <section>
            <div className="flex items-center justify-between">
                <BackNavigation />

                <Button>Approve Report</Button>
            </div>

            <Card className="space-y-6">
                <h1 className="text-lg font-bold">Consultancy Report</h1>

                <DescriptionCard
                    label="Consultant"
                    description={data?.data.consultant.title}
                />

                <DescriptionCard label="Report Duration" description={"N/A"} />

                <DescriptionCard
                    label="Consultancy Period"
                    description={`${data?.data.consultancy_start_date} - ${data?.data.consultancy_end_date}`}
                />

                <DescriptionCard
                    label="Supervisor"
                    description={`${data?.data.supervisor.first_name} - ${data?.data.supervisor.last_name}`}
                />

                <DescriptionCard label="Report Duration" description="N/A" />

                <DescriptionCard
                    label="Purpose"
                    description={data?.data.purpose}
                />

                <DescriptionCard
                    label="Executive Summary"
                    description={data?.data.executive_summary}
                />

                <DescriptionCard
                    label="Activities, Accomplishments, & Deliverables"
                    description={data?.data.achievements}
                />

                <DescriptionCard
                    label="Challenges and Recommendations"
                    description={data?.data.challenges_recommendations}
                />
            </Card>
        </section>
    );
}
