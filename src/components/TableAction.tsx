import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "components/ui/alert-dialog";
import MoreIcon from "assets/MoreIcon";
import Link from "next/link";

interface TableActionProps<T> {
    row?: T;
    route?: string;
    action?: () => void;
    desc?: string;
    update?: boolean;
    updateAction?: () => void;
    removeView?: boolean;
}

const TableAction = <T extends { id: string | number }>({
    row,
    route,
    action,
    desc,
    update,
    updateAction,
    removeView,
}: TableActionProps<T>) => {
    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger>
                    <MoreIcon />
                </PopoverTrigger>
                <PopoverContent className="w-32 px-2 text-sm space-y-1">
                    {!removeView && (
                        <Link href={`${route}?to=${row ? row.id : ""}`}>
                            <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white">
                                View
                            </div>
                        </Link>
                    )}

                    {update && (
                        <div
                            onClick={() => updateAction && updateAction()}
                            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white"
                        >
                            Edit
                        </div>
                    )}

                    <AlertDialog>
                        <AlertDialogTrigger className="flex items-center w-full gap-2 p-2 cursor-pointer hover:bg-primary hover:text-white">
                            Delete
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    {desc ||
                                        "This action cannot be undone. This will permanently delete this item and remove all associated data from our servers."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={action}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default TableAction;
