import FormButton from "@/components/FormButton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useUpdateActivityPlanStatus } from "@/features/programs/controllers/activityPlanController";
import { closeDialog } from "@/store/ui";

const statusOptions = [
    "DONE",
    "STARTED_BUT_NOT_FINISHED",
    "ONGOING",
    "NO_LONGER_APPLICABLE",
    "NOT_DONE",
].map((option) => ({
    label: option.replace(/_/g, " "),
    value: option,
}));

export default function ActivityPlanStatusModal() {
    const { dialog } = useAppSelector((state) => state.ui);
    const dispatch = useAppDispatch();

    const id = dialog?.dialogProps?.id as string;
    const prevStatus = dialog?.dialogProps?.status as string;

    const [status, setStatus] = useState(prevStatus);
    const { updateStatus, isLoading } = useUpdateActivityPlanStatus(id);

    const handleChangeStatus = (value: string) => {
        setStatus(value);
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!status) {
            toast.error("Please select a status");
            return;
        }

        try {
            await updateStatus(status);
            toast.success("Activity plan status updated successfully");
            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
        }
    };

    return (
        <form onSubmit={onSubmit} className="w-full space-y-6">
            <h2 className="text-lg font-bold">Change Activity Plan Status</h2>

            <Select
                value={status}
                defaultValue={status}
                onValueChange={handleChangeStatus}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Activity Plan Status" />
                </SelectTrigger>

                <SelectContent>
                    {statusOptions?.map((status) => (
                        <SelectItem key={status.label} value={status.value}>
                            {status.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="flex justify-end">
                <FormButton type="submit" loading={isLoading} disabled={isLoading}>
                    {isLoading ? "Updating..." : "Submit"}
                </FormButton>
            </div>
        </form>
    );
}