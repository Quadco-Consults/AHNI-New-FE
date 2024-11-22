import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "components/ui/select";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import {
    ProjectDocumentSchema,
    TProjectDocument,
} from "definations/project-validator";
import React, { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import projectDocumentTypesAPi from "services/projectsApi/project-document-types";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { z } from "zod";
import { LoadingSpinner } from "components/shared/Loading";
import { ProjectDocumentTypesResultsData } from "definations/project-types/project-document-types";
import projectDocumentAPi from "services/projectsApi/project-document";
import { toast } from "sonner";
import FormButton from "atoms/FormButton";
import { useDocumentTypesQuery } from "services/moduleProjects";
import FormInput from "atoms/FormInput";
import { closeDialog } from "store/ui";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "hooks/useStore";

const ProjectUploadModal = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const dispatch = useAppDispatch();

    const [projectDocumentMutation, { isLoading }] =
        projectDocumentAPi.useCreateProjectDocumentMutation();

    const { data, isLoading: isFetchLoading } = useDocumentTypesQuery({
        no_paginate: false,
    });
    const form = useForm<z.infer<typeof ProjectDocumentSchema>>({
        defaultValues: {
            project: localStorage.getItem("projectID") as string,
            title: "",
        },
    });

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TProjectDocument> = async (data) => {
        if (!file) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", data.title);
        formData.append("project", data?.project);

        try {
            // @ts-ignore
            await projectDocumentMutation(formData).unwrap();
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

                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Document type" />
                        </SelectTrigger>

                        <SelectContent>
                            {isFetchLoading ? (
                                <LoadingSpinner />
                            ) : (
                                data?.data?.results?.map(
                                    (doc: ProjectDocumentTypesResultsData) => (
                                        <SelectItem
                                            key={doc?.id}
                                            value={doc.name}
                                        >
                                            {doc.name}
                                        </SelectItem>
                                    )
                                )
                            )}
                        </SelectContent>
                    </Select>

                    <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
                        <UploadFile size={20} />
                        <div>
                            <Input
                                type="file"
                                onChange={handleFileChange}
                                className="bg-inherit border-none cursor-pointer "
                            />
                        </div>
                    </div>

                    <div className="flex justify-between gap-5 mt-10">
                        <Button
                            type="button"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
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
