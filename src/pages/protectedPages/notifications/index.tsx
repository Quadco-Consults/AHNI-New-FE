import Card from "components/shared/Card";
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
import { useGetNotificationsQuery } from "services/notification";
import NotificationContent from "components/features/NotificationContent";
import NotificationList from "components/features/NotificationList";
import EmptyTodoIcon from "components/icons/EmptyTodoIcon";

export default function Notifications() {
    const { data, isLoading } = useGetNotificationsQuery(null);

    const notifications = data?.results;

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
                ) : notifications?.length === 0 ? (
                    <div className="flex flex-col items-center gap-2.5">
                        <EmptyTodoIcon />
                        <h3 className="font-bold text-md">
                            You are all caught up. You do not have any
                            notifications
                        </h3>
                    </div>
                ) : (
                    <div className="flex">
                        <NotificationList notifications={notifications} />
                        <NotificationContent />
                    </div>
                )}
            </Card>
        </div>
    );
}
