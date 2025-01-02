import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { FormEvent, useState } from "react";
import { usePatchRiskManagementPlanMutation } from "services/programsApi/risk-plans";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

const statusOptions = ["OPEN", "CLOSED", "MITIGATED"].map((option) => ({
    label: option,
    value: option,
}));

export default function ChangeRiskStatusModal() {
    const { dailog } = useAppSelector((state) => state.ui);

    const id = dailog?.dialogProps?.id as string;
    const prevStatus = dailog?.dialogProps?.status as string;

    const [status, setStatus] = useState(prevStatus);

    const dispatch = useAppDispatch();

    const [patchRiskManagementPlan, { isLoading }] =
        usePatchRiskManagementPlanMutation();

    const handleChangeStatus = (value: string) => {
        setStatus(value);
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await patchRiskManagementPlan({
                id,
                body: { risk_status: status },
            }).unwrap();

            dispatch(closeDialog());
            toast.success("Updated Risk Status");
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <form onSubmit={onSubmit} className="w-full space-y-6">
            <h2 className="text-lg font-bold">Change Risk Status</h2>

            <Select
                defaultValue={status}
                value={status}
                onValueChange={handleChangeStatus}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select Risk Status" />
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
