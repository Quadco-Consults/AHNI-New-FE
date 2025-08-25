"use client";

import { Button } from "components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { Label } from "components/ui/label";
import FormButton from "@/components/FormButton";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";
import FormSelect from "components/atoms/FormSelectField";
import { FormProvider, useForm } from "react-hook-form";

export default function ActivityTrackerModal() {
    const [file, setFile] = useState<File | null>(null);
    const dispatch = useAppDispatch();

    const form = useForm();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = () => {};

    return (
        <div className="w-full">
            <FormProvider {...form}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <FormSelect
                            label="Name of Activity"
                            name="activity_name"
                            required
                            placeholder="Select Project"
                        />
                    </div>

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

                    <div className="flex justify-between gap-5 mt-16">
                        <Button
                            onClick={() => dispatch(closeDialog())}
                            type="button"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                        >
                            Cancel
                        </Button>
                        <FormButton
                            // loading={isLoading}
                            type="submit"
                            // disabled={isLoading}
                        >
                            Done
                        </FormButton>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}