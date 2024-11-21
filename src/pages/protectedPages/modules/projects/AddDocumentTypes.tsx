import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import Card from "components/shared/Card";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    useAddDocumentTypesMutation,
    useUpdateDocumentTypesMutation,
} from "services/moduleProjects";
import {
    TDocumentTypes,
    documentTypesSchema,
} from "definations/module-projects";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";

const AddDocumentTypes = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TDocumentTypes;

    const form = useForm<TDocumentTypes>({
        resolver: zodResolver(documentTypesSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [documentTypes, { isLoading }] = useAddDocumentTypesMutation();
    const [updateDocumentTypes, { isLoading: updateDocumentLoading }] =
        useUpdateDocumentTypesMutation();

    const onSubmit: SubmitHandler<TDocumentTypes> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateDocumentTypes({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  }).unwrap()
                : await documentTypes(data).unwrap();
            toast.success("Document Type Added Succesfully");
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
                    <div className="grid grid-cols-1 gap-y-7">
                        <FormInput
                            label="Description"
                            name="description"
                            placeholder="Enter description"
                            required
                        />
                    </div>
                    <div className="flex justify-start gap-4">
                        <FormButton
                            loading={isLoading || updateDocumentLoading}
                        >
                            Save
                        </FormButton>
                    </div>
                </form>
            </Form>
        </CardContent>
    );
};

export default AddDocumentTypes;
