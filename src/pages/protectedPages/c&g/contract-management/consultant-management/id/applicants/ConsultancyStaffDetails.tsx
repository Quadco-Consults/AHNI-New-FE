import BackNavigation from "atoms/BackNavigation";

import { useGetSingleConsultancyStaffQuery } from "services/c&g/contract-management/consultancy-management/consultancy-applicants";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router-dom";
import { Button } from "components/ui/button";
import PersonIcon from "components/icons/Person";
import SingleConsultancyStaffDetails from "./SingleConsultancyStaffDetails";
import { LoadingSpinner } from "components/shared/Loading";
import Card from "components/shared/Card";

export default function ConsultancyStaffDetails() {
    const { applicantId } = useParams();

    const { data: consultancyStaff, isLoading } =
        useGetSingleConsultancyStaffQuery(
            applicantId ? applicantId : skipToken
        );

    return (
        <section className="">
            <div className="flex items-center justify-between">
                <BackNavigation />
                <Button className="flex gap-x-[.5rem] items-center">
                    <PersonIcon />
                    <span>Shortlist Consultant</span>
                </Button>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                consultancyStaff && (
                    <Card>
                        <SingleConsultancyStaffDetails
                            {...consultancyStaff?.data}
                        />
                    </Card>
                )
            )}
        </section>
    );
}
