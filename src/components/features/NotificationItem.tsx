import VerticalDotsIcon from "components/icons/VerticalDotsIcon";
import { Button } from "components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "components/ui/dropdown-menu";

type PropsType = {
    active?: boolean;
};

export default function NotificationItem({ active }: PropsType) {
    const handleDeleteNotification = () => {
        console.log("Notification deleted");
    };

    const handleChangeStatus = () => {
        console.log("Marked as read");
    };

    return (
        <li
            className={`flex items-center gap-4 justify-between ${
                active ? "bg-[#FFF2F2]" : "bg-white"
            } border-gray-200 border-solid border-[1px] px-4 py-2 rounded-lg border-l-8 border-l-[#CB1A14]`}
        >
            <div>
                <h3 className="font-semibold line-clamp-1">
                    Issues with Health Insurance
                </h3>
                <span className="text-[#475367] text-[12px] line-clamp-1">
                    The alert & notifications component
                </span>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="bg-transparent p-0 w-[24px] h-[24px]">
                        <VerticalDotsIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleDeleteNotification}>
                        Delete Notification
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleChangeStatus}>
                        Mark as read
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </li>
    );
}
