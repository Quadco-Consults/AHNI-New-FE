import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { Button } from "components/ui/button";
import { useAppDispatch } from "hooks/useStore";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useCreateRoleMutation } from "services/users";
import { closeDialog } from "store/ui";
import { z } from "zod";

const FormSchema = z.object({
    role_name: z.string().min(1, "Please enter a role name"),
});

export default function AddNewRoleModal() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            role_name: "",
        },
    });

    const dispatch = useAppDispatch();

    const { handleSubmit } = form;

    const [createRole, { isLoading }] = useCreateRoleMutation();

    const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async ({
        role_name,
    }) => {
        try {
            const response = await createRole({ name: role_name }).unwrap();
            dispatch(closeDialog());
        } catch (error) {
            console.log(error);
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

                    <div className="flex justify-between gap-5 mt-16">
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
