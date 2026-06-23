"use client";

import {
    ClockTimingSvg,
    DataCalenderSvg,
    LocationSvg,
    PeoplePositionsSvg,
    PersonClusterSvg,
    SuiteCase,
} from "assets/svgs/CAndGSvgs";
import DeleteIcon from "@/components/icons/DeleteIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ISubGrantPaginatedData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useDeleteSubGrant } from "@/features/contracts-grants/controllers/subGrantController";
import { toast } from "sonner";
import { useGetAllLocations } from "@/features/modules/controllers/config/locationController";
import { useGetSingleDepartment } from "@/features/modules/controllers/config/departmentController";

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

    // Get all locations to map IDs to names
    const { data: allLocationsData } = useGetAllLocations({
        page: 1,
        size: 2000,
        enabled: true
    });

    // Get business unit name when business_unit is an ID
    const { data: departmentData } = useGetSingleDepartment(
        typeof business_unit === 'string' ? business_unit : '',
        !!business_unit && typeof business_unit === 'string'
    );

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

    // Map location IDs to location names
    const locationNames = useMemo(() => {
        if (!locations || locations.length === 0) return [];

        // If locations are already objects with name/city, use them
        if (typeof locations[0] === 'object' && (locations[0].name || locations[0].city)) {
            return locations.map(loc => loc.name || loc.city);
        }

        // If locations are IDs (strings), map them to names
        if (typeof locations[0] === 'string' && allLocationsData?.data?.results) {
            return locations
                .map(locId => {
                    const loc = allLocationsData.data.results.find((l: any) => l.id === locId);
                    return loc?.name || loc?.city;
                })
                .filter(Boolean);
        }

        return [];
    }, [locations, allLocationsData]);

    // Get business unit name - handle both string (ID) and object (expanded) cases
    const businessUnitName = useMemo(() => {
        if (!business_unit) return null;
        // If it's an object (expanded by API), use the name
        if (typeof business_unit === 'object' && business_unit.name) {
            return business_unit.name;
        }
        // If it's a string (ID), use the fetched department name
        if (typeof business_unit === 'string' && departmentData?.data?.name) {
            return departmentData.data.name;
        }
        // Fallback to the raw value but hide UUIDs
        if (typeof business_unit === 'string') {
            // Hide UUID-like strings (contains dashes and is long)
            if (business_unit.includes('-') && business_unit.length > 20) {
                return 'Business Unit';
            }
            return business_unit;
        }
        return null;
    }, [business_unit, departmentData]);

    return (
        <div className="w-[49.5%]">
            <Card className="flex flex-col gap-y-[.625rem] w-full min-h-[25rem] justify-between relative p-[2rem]">
                <div className="w-full space-y-[1.5rem]">
                    <div className="flex justify-between items-center">
                        <p
                            className={`bg-[#8C6400] text-[.625rem] py-1 px-[.625rem] w-fit rounded-full text-white text-sm`}
                        >
                            <span className="font-medium">Date Posted: </span>
                            {format(new Date(created_datetime), "MMM dd, yyyy")}
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
                            label={`Ends: ${format(new Date(end_date), "MMM dd, yyyy")}`}
                        />
                        {submission_end_date && (
                            <DetailsTag
                                icon={<DataCalenderSvg />}
                                label={`Submission: ${format(new Date(submission_end_date), "MMM dd, yyyy")}`}
                            />
                        )}
                        {businessUnitName && (
                            <DetailsTag
                                icon={<PersonClusterSvg />}
                                label={businessUnitName}
                            />
                        )}
                        {locationNames && locationNames.length > 0 && (
                            <DetailsTag
                                icon={<LocationSvg />}
                                label={locationNames.slice(0, 2).join(", ") + (locationNames.length > 2 ? `, +${locationNames.length - 2} more` : '')}
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
        <div className="flex items-center border border-gray-border text-sm p-1 px-[.625rem] gap-x-[.25rem] rounded-full">
            {icon}
            <p>{label}</p>
        </div>
    );
};
