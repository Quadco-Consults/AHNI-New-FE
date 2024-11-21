import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useAddCategoriesMutation,
    useUpdateCategoriesMutation,
} from "services/moduleConfig";
import { TCategories } from "definations/module-config";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import { toast } from "sonner";
import { FCONumberSchema, TFCONumber } from "definations/module-finance";
import {
    useAddFCONumberMutation,
    useUpdateFCONumberMutation,
} from "services/moduleFinance";

const AddFcoNumber = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TFCONumber;

    const form = useForm<TFCONumber>({
        resolver: zodResolver(FCONumberSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
            code: data?.code ?? "",
        },
    });

    const [addFCONumber, { isLoading }] = useAddFCONumberMutation();
    const [updateFCONumber, { isLoading: isUpdateLoading }] =
        useUpdateFCONumberMutation();

    const dispatch = useAppDispatch();
    const onSubmit: SubmitHandler<TFCONumber> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateFCONumber({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await addFCONumber(data).unwrap();
            toast.success("Category Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };
    return (
        <CardContent>
            <Form {...form}>
                <form
                    action=""
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-y-10"
                >
                    <div className="grid grid-cols-1 gap-y-7">
                        <FormInput
                            label="Name"
                            name="name"
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-x-1">
                        <FormInput
                            label="Description"
                            name="description"
                            placeholder="Enter description"
                            required
                        />
                        <FormInput
                            label="Code"
                            name="code"
                            required
                            placeholder="Enter code"
                        />
                    </div>
                    <div className="flex justify-start gap-4">
                        <FormButton loading={isLoading || isUpdateLoading}>
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddFcoNumber;
