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
import { TNotification, NotificationFilters } from "@/features/notifications/controllers/notificationController";
import { useGetNotifications, useMarkAllAsRead } from "@/features/notifications/controllers/notificationController";
import NotificationContent from "../NotificationContent";
import NotificationList from "../NotificationList";
import NotificationListInfinite from "../NotificationListInfinite";
import NotificationPreferences from "../NotificationPreferences";
import { NotificationListSkeleton, NotificationContentSkeleton } from "../NotificationSkeleton";
import EmptyTodoIcon from "components/icons/EmptyTodoIcon";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

export default function Notifications() {
    const [filters, setFilters] = useState({ 
        module_type: "all_modules", 
        status: "all_status",
        priority: "all_priority",
        category: "all_category"
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("notifications");
    const [useInfiniteScroll, setUseInfiniteScroll] = useState(true);
    
    const notificationParams: NotificationFilters = {
        page: 1,
        size: useInfiniteScroll ? 20 : 100,
        search: searchTerm || undefined,
        module_type: filters.module_type === "all_modules" ? undefined : filters.module_type,
        status: filters.status === "all_status" ? undefined : filters.status as "Pending" | "Read",
        priority: filters.priority === "all_priority" ? undefined : filters.priority as any,
        category: filters.category === "all_category" ? undefined : filters.category as any,
    };
    
    const { data, isLoading } = useGetNotifications(useInfiniteScroll ? undefined : notificationParams);
    const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
    const [activeNotification, setActiveNotification] = useState<TNotification>();

    const handleSetActiveNotification = (notification: TNotification) => {
        setActiveNotification(notification);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    // Since filtering is now handled in the API call, we can use the results directly
    const filteredNotifications = data?.results || [];

    const hasUnreadNotifications = filteredNotifications.some(
        notification => !notification.is_read || notification.status === "Pending"
    );

    // Get unique values for filter dropdowns (these should ideally come from the API)
    const moduleTypes = [...new Set(data?.results?.map(n => n.module_type) || [])];
    const priorities = ["low", "medium", "high", "urgent"];
    const categories = ["info", "success", "warning", "error", "system"];

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

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="notifications" className="space-y-5">
                    {/* Filters and Actions */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="flex items-center px-2 py-2 border rounded-lg bg-white">
                                <SearchIcon />
                                <input
                                    placeholder="Search notifications..."
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="ml-2 h-6 border-none w-[250px] bg-white focus:outline-none outline-none"
                                />
                            </span>
                            
                            <Select value={filters.module_type} onValueChange={(value) => setFilters({...filters, module_type: value})}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="All Modules" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_modules">All Modules</SelectItem>
                                    {moduleTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_status">All Status</SelectItem>
                                    <SelectItem value="Pending">Unread</SelectItem>
                                    <SelectItem value="Read">Read</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_priority">All Priority</SelectItem>
                                    {priorities.map(priority => (
                                        <SelectItem key={priority} value={priority}>
                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_category">All Category</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setUseInfiniteScroll(!useInfiniteScroll)}
                                className="flex items-center gap-2"
                            >
                                <Icon icon={useInfiniteScroll ? "mdi:view-list" : "mdi:infinity"} />
                                {useInfiniteScroll ? "Standard View" : "Infinite Scroll"}
                            </Button>
                            
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

                    {/* Notification Content */}
                    <Card className="space-y-5 rounded-none">
                        {useInfiniteScroll ? (
                            <div className="flex">
                                <NotificationListInfinite
                                    onSetActiveNotification={handleSetActiveNotification}
                                    activeNotification={activeNotification}
                                    filters={notificationParams}
                                />
                                {activeNotification ? (
                                    <NotificationContent active={activeNotification} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-[65%]">
                                        <EmptyTodoIcon />
                                        <h3 className="text-md font-bold mt-2">
                                            Kindly choose a notification to view its details.
                                        </h3>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {isLoading ? (
                                    <div className="flex">
                                        <NotificationListSkeleton />
                                        <NotificationContentSkeleton />
                                    </div>
                                ) : filteredNotifications.length === 0 ? (
                                    <div className="flex flex-col items-center gap-2.5 py-16">
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
                                                    setFilters({ 
                                                        module_type: "all_modules", 
                                                        status: "all_status",
                                                        priority: "all_priority",
                                                        category: "all_category"
                                                    });
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
                                            onSetActiveNotification={handleSetActiveNotification}
                                            activeNotification={activeNotification}
                                        />

                                        {activeNotification ? (
                                            <NotificationContent active={activeNotification} />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-[65%]">
                                                <EmptyTodoIcon />
                                                <h3 className="text-md font-bold mt-2">
                                                    Kindly choose a notification to view its details.
                                                </h3>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </Card>
                </TabsContent>

                <TabsContent value="preferences">
                    <NotificationPreferences />
                </TabsContent>
            </Tabs>
        </div>
    );
}
