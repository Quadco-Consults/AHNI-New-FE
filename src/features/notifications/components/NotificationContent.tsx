import { format } from "date-fns";
import { useAppSelector } from "hooks/useStore";
import { TNotification } from "@/features/notifications/types/notification";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { useRouter } from "next/navigation";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

type PropsType = {
    active: TNotification;
};

export default function NotificationContent({ active }: PropsType) {
    const { message, title, created_datetime, module_type, priority, category, action_url, metadata } = active;

    const { data: profile } = useGetUserProfile();
    const router = useRouter();

    const { user } = useAppSelector((state) => state.auth);

    const isVendorReminder = module_type === "VendorEvaluation";

    const handleTakeAction = () => {
        if (action_url) {
            router.push(action_url);
        }
    };

    return (
        <div className="w-[65%] space-y-4 pt-16 px-8">
            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Subject</h3>
                <p className="font-medium">{title}</p>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Module</h3>
                <Badge variant="outline">{module_type}</Badge>
            </div>

            {priority && (
                <div className="flex items-center justify-between">
                    <h3 className="text-[#344054] text-[12px]">Priority</h3>
                    <Badge
                        className={
                            priority === "urgent" ? "bg-red-100 text-red-800" :
                            priority === "high" ? "bg-orange-100 text-orange-800" :
                            priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-blue-100 text-blue-800"
                        }
                    >
                        {priority.toUpperCase()}
                    </Badge>
                </div>
            )}

            {category && (
                <div className="flex items-center justify-between">
                    <h3 className="text-[#344054] text-[12px]">Category</h3>
                    <Badge
                        className={
                            category === "error" ? "bg-red-100 text-red-800" :
                            category === "warning" ? "bg-orange-100 text-orange-800" :
                            category === "success" ? "bg-green-100 text-green-800" :
                            "bg-blue-100 text-blue-800"
                        }
                    >
                        {category.toUpperCase()}
                    </Badge>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Sender</h3>
                <p className="font-medium">{isVendorReminder ? "System" : "Admin"}</p>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Email</h3>
                <p className="font-medium">{profile?.data.email}</p>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Date Created</h3>
                <p className="font-medium">
                    {format(created_datetime, "MMM dd, yyyy")}
                </p>
            </div>

            {/* Vendor Reminder Specific Details */}
            {isVendorReminder && metadata && (
                <div className="border-t pt-4 space-y-2">
                    <h3 className="text-[#344054] text-sm font-semibold mb-2">Vendor Details</h3>

                    <div className="flex items-center justify-between">
                        <h3 className="text-[#344054] text-[12px]">Vendor Name</h3>
                        <p className="font-medium">{metadata.vendor_name}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <h3 className="text-[#344054] text-[12px]">Purchase Orders</h3>
                        <p className="font-medium">{metadata.po_count} PO(s)</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <h3 className="text-[#344054] text-[12px]">Days Since Last PO</h3>
                        <p className="font-medium">{metadata.days_since_last_po} days ago</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <h3 className="text-[#344054] text-[12px]">Status</h3>
                        <div className="flex items-center gap-2">
                            {metadata.reminder_type === "OVERDUE" ? (
                                <>
                                    <AlertCircle className="text-red-500" size={16} />
                                    <span className="text-red-600 font-semibold">Overdue</span>
                                </>
                            ) : (
                                <>
                                    <Clock className="text-orange-500" size={16} />
                                    <span className="text-orange-600 font-semibold">Due Soon</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4">
                <h3 className="text-[#344054] text-[12px]">Message</h3>
                <p className="text-[#344054] text-sm mt-2">{message}</p>
            </div>

            {action_url && (
                <div className="mt-6 pt-4 border-t">
                    <Button onClick={handleTakeAction} className="w-full">
                        {isVendorReminder ? "Complete Vendor Evaluation" : "Take Action"}
                    </Button>
                </div>
            )}
        </div>
    );
}