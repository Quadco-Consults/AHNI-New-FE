"use client";

import {
    ClockTimingSvg,
    DataCalenderSvg,
    LocationSvg,
    PeoplePositionsSvg,
    PersonClusterSvg,
    SuiteCase,
} from "assets/svgs/CAndGSvgs";
import DeleteIcon from "components/icons/DeleteIcon";
import PencilIcon from "components/icons/PencilIcon";
import ConfirmationDialog from "components/ConfirmationDialog";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { CardTitle } from "components/ui/card";
import { CG_ROUTES, ProgramRoutes } from "constants/RouterConstants";
import { format, isValid } from "date-fns";
import { IConsultantPaginatedData } from "definations/c&g/contract-management/consultancy-management/consultancy-management";
import useJobAdvertType from "hooks/useJobAdvertType";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDeleteConsultantManagement } from "src/features/contracts-grants/controllers/consultantManagementController";
import { toast } from "sonner";

export default function ConsultantCard({
    id,
    title,
    consultants_number,
    duration,
    end_date,
    locations,
    evaluation_comments,
    created_datetime,
    status,
    grade_level,
    supervisor,
}: IConsultantPaginatedData) {
    const advertType = useJobAdvertType();

    const advertEditPath =
        advertType === "adhoc"
            ? ProgramRoutes.CREATE_ADHOC_DETAILS
            : advertType === "facilitator"
            ? CG_ROUTES.CREATE_FACILITATOR_ADVERT_DETAILS
            : CG_ROUTES.CREATE_CONSULTANCY_DETAILS;

    const advertDetailsPath =
        advertType === "adhoc"
            ? ProgramRoutes.ADHOC_DETAILS
            : advertType === "facilitator"
            ? CG_ROUTES.FACILITATOR_ADVERT_DETAILS
            : CG_ROUTES.CONSULTANCY_DETAILS;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { deleteConsultantManagement, isLoading: isDeleteLoading } =
        useDeleteConsultantManagement(id);

    const handleDelete = async () => {
        try {
            await deleteConsultantManagement();
            toast.success("Consultant Deleted");
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error(error?.message ?? "Something went wrong");
        }
    };

    return (
        <div className="w-[49.5%]">
            <Card className="flex flex-col gap-y-[.625rem] w-full min-h-[25rem] justify-between relative p-[2rem]">
                <div className="w-full space-y-[1.5rem]">
                    <div className="flex justify-between items-center">
                        <p
                            className={`bg-[#8C6400] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-white text-sm`}
                        >
                            <span className="font-medium">Date Posted: </span>
                            {created_datetime && isValid(new Date(created_datetime))
                                ? format(new Date(created_datetime), "MMM dd, yyyy")
                                : "Date not available"
                            }
                        </p>
                        <p
                            className={`bg-[#26B94133] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-[#26B941]`}
                        >
                            {status || 'Unknown Status'}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <CardTitle
                            className="text-black text-[1.25rem]"
                            title="Card"
                        >
                            {title || 'Untitled Consultant'}
                        </CardTitle>

                        <div className="flex items-center">
                            <Link
                                href={{
                                    pathname: advertEditPath,
                                    search: `?id=${id}`,
                                }}
                            >
                                <Button variant="ghost">
                                    <PencilIcon />
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <DeleteIcon />
                            </Button>
                        </div>
                    </div>
                    <div className="w-full flex flex-wrap items-center justify-start gap-x-[.625rem] gap-y-[1rem]">
                        <DetailsTag
                            icon={<PeoplePositionsSvg />}
                            label={`${consultants_number || 0} people`}
                        />
                        <DetailsTag
                            icon={<ClockTimingSvg />}
                            label={`${duration || 0} months with possibility of extension`}
                        />
                        <DetailsTag
                            icon={<DataCalenderSvg />}
                            label={end_date && isValid(new Date(end_date)) ? format(new Date(end_date), "MMM dd, yyyy") : "Date not available"}
                        />
                        <DetailsTag
                            icon={<LocationSvg />}
                            label={locations && Array.isArray(locations) && locations.length > 0
                                ? locations.join(", ")
                                : "No location specified"
                            }
                        />
                        <DetailsTag icon={<SuiteCase />} label={grade_level || "Grade Level TBD"} />

                        <DetailsTag
                            icon={<PersonClusterSvg />}
                            label={supervisor || "Supervisor TBD"}
                        />
                    </div>
                </div>
                <div className="relative">
                    <p className="text-sm">{evaluation_comments}</p>
                    <div className="w-full flex flex-col items-center justify-center absolute bottom-0 left-0 py-[.75rem] bg-gradient-to-b from-white/50 via-white/60 to-white/90">
                        <div className="bg-white w-fit">
                            <Link href={advertDetailsPath.replace(':id', id)}>
                                <Button className="bg-white text-primary z-[99] border border-[#00000012]">
                                    View Details & Applications
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Card>

            <ConfirmationDialog
                open={isModalOpen}
                title="Are you sure you want to delete this consultant?"
                onCancel={() => setIsModalOpen(false)}
                onOk={handleDelete}
                loading={isDeleteLoading}
            />
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
