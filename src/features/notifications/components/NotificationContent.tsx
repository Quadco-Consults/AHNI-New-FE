import { format } from "date-fns";
import { useAppSelector } from "hooks/useStore";
import { TNotification } from "@/features/notifications/types/notification";
import { useGetUserProfile } from "@/features/auth/controllers/userController";

type PropsType = {
    active: TNotification;
};

export default function NotificationContent({ active }: PropsType) {
    const { message, title, created_datetime } = active;

    const { data: profile } = useGetUserProfile();

    const { user } = useAppSelector((state) => state.auth);

    return (
        <div className="w-[65%] space-y-2 pt-16 px-8">
            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Subject</h3>
                <p className="font-medium">{title}</p>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-[#344054] text-[12px]">Sender</h3>
                <p className="font-medium">Admin</p>
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
            <div className="mt-4">
                <h3 className="text-[#344054] text-[12px]">Message</h3>
                <p className="text-[#344054] text-[10px] mt-2">{message}</p>
            </div>
        </div>
    );
}