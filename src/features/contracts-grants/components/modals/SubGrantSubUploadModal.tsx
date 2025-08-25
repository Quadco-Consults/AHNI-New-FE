"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import Upload from "@/components/Upload";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { Upload as UploadIcon } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useCreateSubGrantUpload } from "@/features/contracts-grants/controllers/submissionUploadController";
import { toast } from "sonner";
import { closeDialog } from "store/ui";
import { ShorthandPropertyAssignment } from "typescript";
import { z } from "zod";

const SubGrantSubUploadSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    document: z
        .any()
        .refine((files) => files?.length > 0, "Please select a file"),
});

export type TSubGrantSubUploadFormData = z.infer<
    typeof SubGrantSubUploadSchema
>;

export default function SubGrantSubUploadModal() {
    const form = useForm<TSubGrantSubUploadFormData>({
        resolver: zodResolver(SubGrantSubUploadSchema),
        defaultValues: { name: "" },
    });

    const dispatch = useAppDispatch();

    const { dialogProps } = useAppSelector((state) => state.ui.dailog);

    const submissionId = dialogProps?.partnerSubId as string;

    const { createSubGrantUpload, isLoading } =
        useCreateSubGrantUpload();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            form.setValue("document", e.target.files);
        }
    };

    const onSubmit: SubmitHandler<TSubGrantSubUploadFormData> = async ({
        name,
        document,
    }) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("document", document[0]);
        formData.append("sub_grant_submission", submissionId);

        try {
            await createSubGrantUpload(formData as any)();
            toast.success("Document Uploaded");
            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.data.message ?? "Something went wrong");
        }
    };

    return (
        <div className="w-full">
            <FormProvider {...form}>
                <form
                    className="space-y-3"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormInput
                        label="Name"
                        name="name"
                        placeholder="Enter Name"
                        required
                    />

                    <div>
                        <Upload className="w-full" onChange={handleChange}>
                            <Button variant="outline" className="w-full">
                                <UploadIcon size={16} />
                                Select File
                            </Button>
                        </Upload>
                        <span className="text-gray-500 text-sm font-semibold">
                            {form.watch("document")
                                ? form.watch("document")[0]?.name
                                : ""}
                        </span>
                        <span className="text-sm text-red-500">
                            {
                                form.formState?.errors?.document
                                    ?.message as string
                            }
                        </span>
                    </div>

                    <FormButton
                        type="submit"
                        className="w-full"
                        size="lg"
                        loading={isLoading}
                    >
                        Submit
                    </FormButton>
                </form>
            </FormProvider>
        </div>
    );
}