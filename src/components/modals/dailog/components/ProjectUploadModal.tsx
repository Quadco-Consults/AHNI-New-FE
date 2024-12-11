import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import {
    ProjectDocumentSchema,
    TProjectDocument,
} from "definations/project-validator";
import React, { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { useDocumentTypesQuery } from "services/moduleProjects";
import FormInput from "atoms/FormInput";
import { closeDialog } from "store/ui";
import { useAppDispatch } from "hooks/useStore";
import { useCreateProjectDocumentMutation } from "services/projectsApi/project-document";
import useQuery from "hooks/useQuery";
import FormSelect from "atoms/FormSelect";
import { zodResolver } from "@hookform/resolvers/zod";

const ProjectUploadModal = () => {
    const [file, setFile] = useState<File | null>(null);

    const dispatch = useAppDispatch();

    const [projectDocumentMutation, { isLoading }] =
        useCreateProjectDocumentMutation();

    const { data: documentTypes, isLoading: isFetchLoading } =
        useDocumentTypesQuery({
            no_paginate: false,
        });

    const documentTypeOptions = documentTypes?.data.results.map((doc) => ({
        label: doc.name,
        value: doc.id,
    }));

    const form = useForm<z.infer<typeof ProjectDocumentSchema>>({
        resolver: zodResolver(ProjectDocumentSchema),
        defaultValues: {
            title: "",
            document_type: "",
            file: "",
        },
    });

    const query = useQuery();

    const { handleSubmit, setValue } = form;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setValue("file", event.target.files[0].name);
        }
    };

    const onSubmit: SubmitHandler<TProjectDocument> = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("file", file as Blob);
        formData.append("document_type", data.document_type);
        formData.append("project", query.get("id") as string);

        try {
            await projectDocumentMutation(formData as any).unwrap();
            toast.success("Document upload successfully.");
            dispatch(closeDialog());
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }

        setFile(null);
    };

    return (
        <div className="w-full">
            <Form {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    <FormInput
                        name="title"
                        label="Document Title"
                        placeholder="Enter document title"
                        required
                    />

                    <FormSelect
                        label="Document Type"
                        name="document_type"
                        placeholder="Select document type"
                        required
                        options={documentTypeOptions}
                    />

                    <div>
                        <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
                            <UploadFile size={20} />
                            <Input
                                type="file"
                                onChange={handleFileChange}
                                className="bg-inherit border-none cursor-pointer "
                            />
                        </div>

                        <FormInput type="hidden" name="file" />
                    </div>

                    <div className="flex justify-between gap-5 mt-10">
                        <Button
                            type="button"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                            onClick={() => dispatch(closeDialog())}
                        >
                            Cancel
                        </Button>
                        <FormButton
                            loading={isLoading}
                            disabled={isLoading}
                            type="submit"
                        >
                            Done
                        </FormButton>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ProjectUploadModal;
