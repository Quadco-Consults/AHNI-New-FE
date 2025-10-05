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
import { format } from "date-fns";
import { ISubGrantPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import React, { useState } from "react";
import Link from "next/link";
import { useDeleteSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { toast } from "sonner";

export default function SubgrantAdvertCard({
    id,
    title,
    created_datetime,
    end_date,
    start_date,
    award_type,
    business_unit,
    amount_usd,
    amount_ngn,
    tender_type,
    status,
    submission_end_date,
    locations,
}: ISubGrantPaginatedData) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { deleteSubGrant, isLoading: isDeleteLoading } =
        useDeleteSubGrant(id);

    const handleDelete = async () => {
        try {
            await deleteSubGrant();
            toast.success("Sub Grant Deleted");
            setIsModalOpen(false);
        } catch (error: any) {
            toast.error(error?.data?.message ?? error?.message ?? "Something went wrong");
        }
    };

    // Calculate duration in months
    const calculateDuration = () => {
        if (!start_date || !end_date) return null;
        const start = new Date(start_date);
        const end = new Date(end_date);
        const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
        return months;
    };

    const duration = calculateDuration();

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
                        {status && (
                            <p
                                className={`bg-[#26B94133] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-[#26B941]`}
                            >
                                {status}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <CardTitle
                            className="text-black text-[1.25rem]"
                            title="Card"
                        >
                            {title}
                        </CardTitle>

                        <div className="flex items-center">
                            <Link href={`/dashboard/c-and-g/sub-grant/create-sub-grant?editId=${id}`}>
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
                        {award_type && (
                            <DetailsTag
                                icon={<SuiteCase />}
                                label={award_type}
                            />
                        )}
                        {duration && (
                            <DetailsTag
                                icon={<ClockTimingSvg />}
                                label={`${duration} month${duration > 1 ? 's' : ''}`}
                            />
                        )}
                        <DetailsTag
                            icon={<DataCalenderSvg />}
                            label={`Ends: ${format(end_date, "MMM dd, yyy")}`}
                        />
                        {submission_end_date && (
                            <DetailsTag
                                icon={<DataCalenderSvg />}
                                label={`Submission: ${format(submission_end_date, "MMM dd, yyy")}`}
                            />
                        )}
                        {business_unit && (
                            <DetailsTag
                                icon={<PersonClusterSvg />}
                                label={business_unit}
                            />
                        )}
                        {locations && locations.length > 0 && (
                            <DetailsTag
                                icon={<LocationSvg />}
                                label={`${locations.length} Location${locations.length > 1 ? 's' : ''}: ${locations.map(loc => loc.name || loc.city).slice(0, 2).join(", ")}${locations.length > 2 ? `, +${locations.length - 2} more` : ''}`}
                            />
                        )}
                        {tender_type && (
                            <DetailsTag
                                icon={<SuiteCase />}
                                label={tender_type}
                            />
                        )}
                        {amount_usd && (
                            <DetailsTag
                                icon={<PeoplePositionsSvg />}
                                label={`$${parseFloat(amount_usd).toLocaleString()}`}
                            />
                        )}
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <Link href={`/dashboard/c-and-g/sub-grant/awards/${id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                            Tap to view
                        </Button>
                    </Link>
                </div>
            </Card>

            <ConfirmationDialog
                open={isModalOpen}
                title="Are you sure you want to delete this sub grant?"
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
