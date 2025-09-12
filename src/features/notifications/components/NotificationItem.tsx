import VerticalDotsIcon from "components/icons/VerticalDotsIcon";
import { Button } from "components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { TNotification, NotificationPriority, NotificationCategory } from "@/features/notifications/controllers/notificationController";
import { useMarkNotificationAsRead, useMarkNotificationAsUnread, useDeleteNotification } from "@/features/notifications/controllers/notificationController";
import { useRouter } from "next/navigation";
import { Badge } from "components/ui/badge";
import { Icon } from "@iconify/react";

type PropsType = {
    notification: TNotification;
    active?: boolean;
    onSetActiveNotification: (notification: TNotification) => void;
};

export default function NotificationItem({
    notification,
    active,
    onSetActiveNotification,
}: PropsType) {
    const { 
        id, 
        title, 
        message, 
        status, 
        is_read, 
        module_type, 
        created_datetime,
        priority = 'medium',
        category = 'info',
        action_url,
        expires_at
    } = notification;
    const { mutate: markAsRead, isPending: isMarkingRead } = useMarkNotificationAsRead();
    const { mutate: markAsUnread, isPending: isMarkingUnread } = useMarkNotificationAsUnread();
    const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification();
    const router = useRouter();

    const isUnread = !is_read || status === "Pending";
    const isExpired = expires_at ? new Date(expires_at) < new Date() : false;

    // Priority colors and icons
    const getPriorityConfig = (priority: NotificationPriority) => {
        const configs = {
            urgent: { color: 'bg-red-500', icon: 'mdi:alert-circle', textColor: 'text-red-600' },
            high: { color: 'bg-orange-500', icon: 'mdi:alert', textColor: 'text-orange-600' },
            medium: { color: 'bg-blue-500', icon: 'mdi:information', textColor: 'text-blue-600' },
            low: { color: 'bg-gray-500', icon: 'mdi:minus-circle', textColor: 'text-gray-600' }
        };
        return configs[priority];
    };

    // Category colors and icons
    const getCategoryConfig = (category: NotificationCategory) => {
        const configs = {
            error: { color: 'bg-red-100 text-red-800 border-red-200', icon: 'mdi:alert-circle' },
            warning: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'mdi:alert' },
            success: { color: 'bg-green-100 text-green-800 border-green-200', icon: 'mdi:check-circle' },
            info: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'mdi:information' },
            system: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: 'mdi:cog' }
        };
        return configs[category];
    };

    const priorityConfig = getPriorityConfig(priority);
    const categoryConfig = getCategoryConfig(category);

    // Navigation mapping for different module types
    const getModuleRoute = (moduleType: string) => {
        const routes: { [key: string]: string } = {
            'Project': '/dashboard/projects',
            'ExpenseAuthorization': '/dashboard/admin/expense-authorization',
            'Agreement': '/dashboard/c-and-g/agreements',
            'User': '/account',
            'ProcurementPlan': '/dashboard/procurement/procurement-plan',
            'PurchaseOrder': '/dashboard/procurement/purchase-order',
            'VehicleRequest': '/dashboard/admin/fleet-management/vehicle-request',
            'FuelRequest': '/dashboard/admin/fleet-management/fuel-request',
            'PaymentRequest': '/dashboard/admin/payment-request',
            'AssetMaintenance': '/dashboard/admin/asset-maintenance',
            'TravelExpenseReport': '/dashboard/admin/travel-expenses-report',
            'ConsultancyReport': '/dashboard/c-and-g/consultancy-report',
            'ContractRequest': '/dashboard/c-and-g/contract-request'
        };
        
        return routes[moduleType] || '/dashboard';
    };

    const handleDeleteNotification = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteNotification(id);
    };

    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        markAsRead(id);
    };

    const handleMarkAsUnread = (e: React.MouseEvent) => {
        e.stopPropagation();
        markAsUnread(id);
    };

    return (
        <li
            className={`flex items-start gap-3 justify-between ${
                active ? "bg-[#FFF2F2]" : isUnread ? "bg-white" : "bg-gray-50"
            } border-gray-200 border-solid border-[1px] px-4 py-3 rounded-lg border-l-8 ${
                priority === 'urgent' ? "border-l-red-500" :
                priority === 'high' ? "border-l-orange-500" :
                priority === 'medium' ? "border-l-blue-500" : "border-l-gray-400"
            } cursor-pointer hover:bg-gray-50 transition-colors ${
                isDeleting ? "opacity-50 pointer-events-none" : ""
            } ${isExpired ? "opacity-75" : ""}`}
            onClick={() => {
                onSetActiveNotification(notification);
                // Mark as read when clicked and navigate to relevant module
                if (isUnread) {
                    markAsRead(id);
                }
                // Navigate to action URL or module page
                const route = action_url || getModuleRoute(module_type);
                router.push(route);
            }}
        >
            <div className="flex items-start gap-3 flex-1">
                <div className="flex flex-col items-center gap-1 mt-1">
                    {isUnread && (
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityConfig.color}`}></div>
                    )}
                    <Icon 
                        icon={categoryConfig.icon} 
                        className={`w-4 h-4 ${priorityConfig.textColor}`}
                    />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold line-clamp-2 ${
                            isUnread ? "text-black" : "text-gray-600"
                        } ${isExpired ? "line-through" : ""}`}>
                            {title}
                        </h3>
                        
                        <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
                            <Badge variant="outline" className={`text-xs ${categoryConfig.color}`}>
                                {category.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${priorityConfig.textColor}`}>
                                {priority.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                    
                    <p className={`${
                        isUnread ? "text-black font-medium" : "text-[#475367]"
                    } text-sm line-clamp-2 mb-2`}>
                        {message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{module_type} • {new Date(created_datetime).toLocaleDateString("en-US")}</span>
                        {expires_at && (
                            <span className={isExpired ? "text-red-500 font-medium" : ""}>
                                {isExpired ? "Expired" : `Expires ${new Date(expires_at).toLocaleDateString("en-US")}`}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="bg-transparent p-0 w-[24px] h-[24px]">
                        <VerticalDotsIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem 
                        onClick={handleDeleteNotification}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Notification"}
                    </DropdownMenuItem>
                    {isUnread ? (
                        <DropdownMenuItem 
                            onClick={handleMarkAsRead}
                            disabled={isMarkingRead}
                        >
                            {isMarkingRead ? "Marking..." : "Mark as read"}
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem 
                            onClick={handleMarkAsUnread}
                            disabled={isMarkingUnread}
                        >
                            {isMarkingUnread ? "Marking..." : "Mark as unread"}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    );
}