import FormButton from "@/components/FormButton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import { useAppSelector } from "hooks/useStore";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const statusOptions = [
    "DONE",
    "STARTED BUT NOT FINISHED",
    "ONGOING",
    "NO LONGER APPLICABLE",
    "NOT DONE",
].map((option) => ({
    label: option,
    value: option,
}));

export default function ActivityPlanStatusModal() {
    const { dailog } = useAppSelector((state) => state.ui);

    const id = dailog?.dialogProps?.id as string;
    const prevStatus = dailog?.dialogProps?.status as string;

    const [status, setStatus] = useState(prevStatus);

    const handleChangeStatus = (value: string) => {
        setStatus(value);
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log("Submitting");
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
                <FormButton type="submit" loading={false}>
                    Submit
                </FormButton>
            </div>
        </form>
    );
}