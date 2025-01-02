import { LoadingSpinner } from "components/shared/Loading";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "components/ui/alert-dialog";

type PropsType = {
    open: boolean;
    title?: string;
    message?: string;
    loading?: boolean;
    onOk: () => void;
    onCancel: () => void;
};

export default function ConfirmationDialog({
    open,
    title,
    message,
    loading,
    onOk,
    onCancel,
}: PropsType) {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title ?? "  Are you absolutely sure?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {message ??
                            "This action cannot be undone. This will permanently delete this item and remove all associated data from our servers."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onOk}>
                        {loading ? "Please wait..." : "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
