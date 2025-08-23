import FormButton from "@/components/FormButton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { FormEvent, useState } from "react";
import { usePatchProject } from "@/features/projects/controllers/projectController";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

const statusOptions = ["PENDING", "IN_PROGRESS", "CLOSED"].map((option) => ({
    label: option,
    value: option,
}));

export default function ChangeProjectStatusModal() {
    const { dailog } = useAppSelector((state) => state.ui);

    const id = dailog?.dialogProps?.id as string;
    const prevStatus = dailog?.dialogProps?.status as string;

    const [status, setStatus] = useState(prevStatus);

    const dispatch = useAppDispatch();

    const { patchProject, isLoading } = usePatchProject(id);

    const handleChangeStatus = (value: string) => {
        setStatus(value);
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await patchProject({ status: status });

            dispatch(closeDialog());
            toast.success("Updated Project Status");
        } catch (error: any) {
            toast.error(error?.message ?? "Something went wrong");
        }
    };

    return (
        <form onSubmit={onSubmit} className="w-full space-y-6">
            <Select
                defaultValue={status}
                value={status}
                onValueChange={handleChangeStatus}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
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
                <FormButton type="submit" loading={isLoading}>
                    Submit
                </FormButton>
            </div>
        </form>
    );
}