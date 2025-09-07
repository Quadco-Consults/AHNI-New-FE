import VerticalDotsIcon from "components/icons/VerticalDotsIcon";
import { Button } from "components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { TNotification } from "@/features/notifications/types/notification";
import { useMarkNotificationAsRead, useMarkNotificationAsUnread, useDeleteNotification } from "@/features/notifications/controllers/notificationController";
import { useRouter } from "next/navigation";

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
    const { id, title, message, status, is_read, module_type, created_datetime } = notification;
    const { mutate: markAsRead, isPending: isMarkingRead } = useMarkNotificationAsRead();
    const { mutate: markAsUnread, isPending: isMarkingUnread } = useMarkNotificationAsUnread();
    const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification();
    const router = useRouter();

    const isUnread = !is_read || status === "Pending";

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
            className={`flex items-center gap-4 justify-between ${
                active ? "bg-[#FFF2F2]" : isUnread ? "bg-white" : "bg-gray-50"
            } border-gray-200 border-solid border-[1px] px-4 py-2 rounded-lg border-l-8 ${
                isUnread ? "border-l-[#CB1A14]" : "border-l-gray-400"
            } cursor-pointer hover:bg-gray-50 ${
                isDeleting ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={() => {
                onSetActiveNotification(notification);
                // Mark as read when clicked and navigate to relevant module
                if (isUnread) {
                    markAsRead(id);
                }
                // Navigate to the relevant module page
                const route = getModuleRoute(module_type);
                router.push(route);
            }}
        >
            <div className="flex items-start gap-2">
                {isUnread && (
                    <div className="w-2 h-2 bg-[#CB1A14] rounded-full mt-1 flex-shrink-0"></div>
                )}
                <div>
                    <h3 className={`font-semibold line-clamp-1 ${
                        isUnread ? "text-black" : "text-gray-600"
                    }`}>
                        {title}
                    </h3>
                    <span
                        className={`${
                            isUnread ? "text-black font-medium" : "text-[#475367]"
                        } text-[12px] line-clamp-1`}
                    >
                        {message}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                        {module_type} • {new Date(created_datetime).toLocaleDateString()}
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