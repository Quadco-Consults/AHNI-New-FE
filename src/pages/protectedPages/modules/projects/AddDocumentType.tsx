import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import { CardContent } from "components/ui/card";
import { Form } from "components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { closeDialog, dailogSelector } from "store/ui";
import {
    DocumentTypeSchema,
    TDocumentTypeData,
    TDocumentTypeFormValues,
} from "definations/modules/project/document-types";
import {
    useAddDocumentTypeMutation,
    useUpdateDocumentTypeMutation,
} from "services/modules/project/document-types";

const AddDocumentTypes = () => {
    const { dialogProps } = useAppSelector(dailogSelector);

    const data = dialogProps?.data as unknown as TDocumentTypeData;

    const form = useForm<TDocumentTypeFormValues>({
        resolver: zodResolver(DocumentTypeSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [documentTypes, { isLoading }] = useAddDocumentTypeMutation();
    const [updateDocumentTypes, { isLoading: updateDocumentLoading }] =
        useUpdateDocumentTypeMutation();

    const onSubmit: SubmitHandler<TDocumentTypeFormValues> = async (data) => {
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
                    className="flex flex-col gap-y-7"
                >
                    <FormInput
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                        required
                    />

                    <FormInput
                        label="Description"
                        name="description"
                        placeholder="Enter Description"
                        required
                    />

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
