"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { closeDialog, dialogSelector } from "@/store/ui";
import {
    DocumentTypeSchema,
    TDocumentTypeData,
    TDocumentTypeFormValues,
} from "@/features/projects/types/project/document-types";
import {
    useAddDocumentType,
    useUpdateDocumentType,
} from "@/features/modules/controllers/project/documentTypeController";
import FormTextArea from "@/components/FormTextArea";

const AddDocumentTypes = () => {
    const { dialogProps } = useAppSelector(dialogSelector);

    const data = dialogProps?.data as unknown as TDocumentTypeData;

    const form = useForm<TDocumentTypeFormValues>({
        resolver: zodResolver(DocumentTypeSchema),
        defaultValues: {
            name: data?.name ?? "",
            description: data?.description ?? "",
        },
    });

    const dispatch = useAppDispatch();
    const [addDocumentType, { isLoading }] = useAddDocumentType();
    const [updateDocumentType, { isLoading: updateDocumentLoading }] =
        useUpdateDocumentType();

    const onSubmit: SubmitHandler<TDocumentTypeFormValues> = async (data) => {
        try {
            dialogProps?.type === "update"
                ? await updateDocumentType({
                      //@ts-ignore
                      id: String(dialogProps?.data?.id),
                      body: data,
                  })
                : await addDocumentType(data);
            toast.success("Document Type Added Succesfully");
            dispatch(closeDialog());
            form.reset();
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Something went wrong");
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

                    <FormTextArea
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
