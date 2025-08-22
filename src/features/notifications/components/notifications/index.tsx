import Card from "components/Card";
import { Button } from "components/ui/button";
import SearchIcon from "components/icons/SearchIcon";
import FilterIcon from "components/icons/FilterIcon";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import ArrowDownIcon from "components/icons/ArrowDownIcon";
import { TNotification } from "@/features/notifications/types/notification";
import { useGetNotifications } from "@/features/notifications/controllers/notificationController";
import NotificationContent from "../NotificationContent";
import NotificationList from "../NotificationList";
import EmptyTodoIcon from "components/icons/EmptyTodoIcon";
import { useState } from "react";

export default function Notifications() {
    const { data, isLoading } = useGetNotifications({ page: 1, size: 100 });
    const [activeNotification, setActiveNotification] =
        useState<TNotification>();

    const handleSetActiveNotification = (notification: TNotification) => {
        setActiveNotification(notification);
    };

    return (
        <div className="space-y-5">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Global Hub</BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Icon icon="iconoir:slash" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Notifications</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex items-center px-2 py-2 border rounded-lg bg-white">
                        <SearchIcon />
                        <input
                            placeholder="Search"
                            type="text"
                            className="ml-2 h-6 border-none w-[310px] bg-white focus:outline-none outline-none"
                        />
                    </span>
                    <Button className="shadow-sm" variant="ghost">
                        <FilterIcon />
                    </Button>
                </div>

                <Button
                    className="flex gap-2 py-6 font-bold"
                    type="button"
                    size="lg"
                    variant="default"
                >
                    Actions
                    <ArrowDownIcon />
                </Button>
            </div>

            <Card className="space-y-5 rounded-none">
                {isLoading ? (
                    <h1>Loading</h1>
                ) : data?.results?.length === 0 ? (
                    <div className="flex flex-col items-center gap-2.5">
                        <EmptyTodoIcon />
                        <h3 className="font-bold text-md">
                            You are all caught up. You do not have any
                            notifications
                        </h3>
                    </div>
                ) : (
                    <div className="flex">
                        <NotificationList
                            notifications={data?.results}
                            onSetActiveNotification={
                                handleSetActiveNotification
                            }
                            activeNotification={activeNotification}
                        />

                        {activeNotification ? (
                            <NotificationContent active={activeNotification} />
                        ) : (
                            <div className="flex flex-col items-center justify-center w-[65%]">
                                <EmptyTodoIcon />
                                <h3 className="text-md font-bold mt-2">
                                    Kindly choose a notification to view its
                                    details.
                                </h3>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}
