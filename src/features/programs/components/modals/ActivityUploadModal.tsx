"use client";

import { Button } from "components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { toast } from "sonner";
import FormButton from "@/components/FormButton";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";
import FormSelect from "components/atoms/FormSelect";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadActivityPlanMutation } from "@/features/programs/controllers/activityPlanController";
import { useGetAllProjectsQuery } from "@/features/projects/controllers/projectController";

const FormSchema = z.object({
    project: z.string().min(1, "This field is required"),
});

type TFormValues = z.infer<typeof FormSchema>;

const ActivityUploadModal = () => {
    const [file, setFile] = useState<File>();

    const { data: project } = useGetAllProjectsQuery({
        page: 1,
        size: 2000000,
    });

    const projectOptions = project?.data.results.map((project) => ({
        label: project.title,
        value: project.id,
    }));

    const form = useForm<TFormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            project: "",
        },
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const { handleSubmit } = form;

    const dispatch = useAppDispatch();

    const { uploadActivityPlan, isLoading } = useUploadActivityPlanMutation();

    const onSubmit: SubmitHandler<TFormValues> = async ({ project }) => {
        if (!file) {
            toast.error("Please choose a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("project", project);
        formData.append("file", file as Blob);

        try {
            await uploadActivityPlan(formData as any);

            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
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
                        <FormSelect
                            name="project"
                            label="Project"
                            placeholder="Select Project"
                            options={projectOptions}
                        />
                    </div>

                    <div className="w-full relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
                        <UploadFile size={20} />
                        <div>
                            <Input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                className="bg-inherit border-none cursor-pointer "
                            />
                        </div>
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
};

export default ActivityUploadModal;