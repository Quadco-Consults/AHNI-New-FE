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
import { useGetNotifications, useMarkAllAsRead } from "@/features/notifications/controllers/notificationController";
import NotificationContent from "../NotificationContent";
import NotificationList from "../NotificationList";
import EmptyTodoIcon from "components/icons/EmptyTodoIcon";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";

export default function Notifications() {
    const [filters, setFilters] = useState({ module_type: "", status: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isLoading } = useGetNotifications({ page: 1, size: 100 });
    const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
    const [activeNotification, setActiveNotification] =
        useState<TNotification>();

    const handleSetActiveNotification = (notification: TNotification) => {
        setActiveNotification(notification);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    // Filter notifications based on search and filters
    const filteredNotifications = data?.results?.filter(notification => {
        const matchesSearch = searchTerm === "" || 
            notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesModule = filters.module_type === "" || 
            notification.module_type === filters.module_type;
            
        const matchesStatus = filters.status === "" ||
            (filters.status === "Pending" && (!notification.is_read || notification.status === "Pending")) ||
            (filters.status === "Read" && (notification.is_read || notification.status === "Read"));
            
        return matchesSearch && matchesModule && matchesStatus;
    }) || [];

    const hasUnreadNotifications = filteredNotifications.some(
        notification => !notification.is_read || notification.status === "Pending"
    );

    // Get unique module types for filter dropdown
    const moduleTypes = [...new Set(data?.results?.map(n => n.module_type) || [])];

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
                            placeholder="Search notifications..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ml-2 h-6 border-none w-[310px] bg-white focus:outline-none outline-none"
                        />
                    </span>
                    
                    <Select value={filters.module_type} onValueChange={(value) => setFilters({...filters, module_type: value})}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Modules" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Modules</SelectItem>
                            {moduleTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Status</SelectItem>
                            <SelectItem value="Pending">Unread</SelectItem>
                            <SelectItem value="Read">Read</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    {hasUnreadNotifications && (
                        <Button
                            onClick={handleMarkAllAsRead}
                            disabled={isMarkingAll}
                            className="py-6 font-bold"
                            type="button"
                            size="lg"
                            variant="outline"
                        >
                            {isMarkingAll ? "Marking all..." : "Mark all as read"}
                        </Button>
                    )}
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
            </div>

            <Card className="space-y-5 rounded-none">
                {isLoading ? (
                    <h1>Loading</h1>
                ) : filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-2.5">
                        <EmptyTodoIcon />
                        <h3 className="font-bold text-md">
                            {data?.results?.length === 0 
                                ? "You are all caught up. You do not have any notifications"
                                : "No notifications match your current filters"
                            }
                        </h3>
                        {data?.results?.length !== filteredNotifications.length && (
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setFilters({ module_type: "", status: "" });
                                    setSearchTerm("");
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex">
                        <NotificationList
                            notifications={filteredNotifications}
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
