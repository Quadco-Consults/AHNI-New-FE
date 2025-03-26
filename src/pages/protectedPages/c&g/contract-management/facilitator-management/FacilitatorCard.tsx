import {
    ClockTimingSvg,
    DataCalenderSvg,
    LocationSvg,
    PeoplePositionsSvg,
    PersonClusterSvg,
    SuiteCase,
} from "assets/svgs/CAndGSvgs";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { CardTitle } from "components/ui/card";
import { CG_ROUTES } from "constants/RouterConstants";
import { format } from "date-fns";
import { IConsultantPaginatedData } from "definations/c&g/contract-management/consultancy-management/consultancy-management";
import { IFacilitatorPaginatedData } from "definations/c&g/contract-management/facilitator-management";
import React from "react";
import { generatePath, Link } from "react-router-dom";

export default function FacilitatorCard({
    id,
    title,
    facilitaor_number,
    duration,
    end_date,
    locations,
    evaluation_comments,
    created_datetime,
    status,
}: IFacilitatorPaginatedData) {
    return (
        <div className="w-[49.5%]">
            <Card className="flex flex-col gap-y-[.625rem] w-full min-h-[25rem] justify-between relative p-[2rem]">
                <div className="w-full space-y-[1.5rem]">
                    <div className="flex justify-between items-center">
                        <p
                            className={`bg-[#8C6400] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-white text-sm`}
                        >
                            <span className="font-medium">Date Posted: </span>
                            {format(created_datetime, "MMM dd, yyy")}
                        </p>
                        <p
                            className={`bg-[#26B94133] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-[#26B941]`}
                        >
                            {status}
                        </p>
                    </div>
                    <CardTitle
                        className="text-black text-[1.25rem]"
                        title="Card"
                    >
                        {title}
                    </CardTitle>
                    <div className="w-full flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem]">
                        <DetailsTag
                            icon={<PeoplePositionsSvg />}
                            label={`${facilitaor_number} people`}
                        />
                        <DetailsTag
                            icon={<ClockTimingSvg />}
                            label={`${duration} months with possibility of extension`}
                        />
                        <DetailsTag
                            icon={<DataCalenderSvg />}
                            label={format(end_date, "MMM dd, yyy")}
                        />
                        <DetailsTag
                            icon={<LocationSvg />}
                            label={locations.join(", ")}
                        />
                        <DetailsTag icon={<SuiteCase />} label="Internal" />

                        <DetailsTag
                            icon={<PersonClusterSvg />}
                            label="Cluster Leads"
                        />
                    </div>
                </div>
                <div className="relative">
                    <p className="text-sm">{evaluation_comments}</p>
                    <div className="w-full flex flex-col items-center justify-center absolute bottom-0 left-0 py-[.75rem] bg-gradient-to-b from-white/50 via-white/60 to-white/90">
                        <div className="bg-white w-fit">
                            <Link
                                to={generatePath(
                                    CG_ROUTES.FACILITATOR_DETAILS,
                                    { id }
                                )}
                            >
                                <Button className="bg-white text-primary z-[99] border border-[#00000012]">
                                    Tap to View
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export const DetailsTag = ({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string | number;
}) => {
    return (
        <div className="flex items-center border border-[#C7CBD5] text-sm p-1 px-[.625rem] gap-x-[.25rem] rounded-full">
            {icon}
            <p>{label}</p>
        </div>
    );
};
