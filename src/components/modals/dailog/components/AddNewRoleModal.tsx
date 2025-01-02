import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Button } from "components/ui/button";
import { RoleSchema, TRoleFormValue } from "definations/auth/permission";
import { useAppDispatch } from "hooks/useStore";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useCreateRoleMutation } from "services/auth/role";
import { toast } from "sonner";
import { closeDialog } from "store/ui";

export default function CreateRole() {
    const form = useForm<TRoleFormValue>({
        resolver: zodResolver(RoleSchema),
        defaultValues: {
            role_name: "",
        },
    });

    const dispatch = useAppDispatch();

    const { handleSubmit } = form;

    const [createRole, { isLoading }] = useCreateRoleMutation();

    const onSubmit: SubmitHandler<TRoleFormValue> = async ({ role_name }) => {
        try {
            await createRole({ name: role_name }).unwrap();
            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="w-full">
            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    <div className="space-y-2">
                        <FormInput
                            label="Role Name"
                            name="role_name"
                            required
                            placeholder="Enter role name"
                        />
                    </div>

                    <div className="flex justify-between gap-5">
                        <Button
                            onClick={() => dispatch(closeDialog())}
                            type="button"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                        >
                            Cancel
                        </Button>
                        <FormButton
                            loading={isLoading}
                            type="submit"
                            disabled={isLoading}
                        >
                            Done
                        </FormButton>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
