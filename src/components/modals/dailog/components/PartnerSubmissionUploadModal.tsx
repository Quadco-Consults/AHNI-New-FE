import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import Upload from "components/shared/Upload";
import { Button } from "components/ui/button";
import { useAppSelector } from "hooks/useStore";
import { Upload as UploadIcon } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useUploadPartnerSubmissionDocumentMutation } from "services/c&g/subgrant/manual-submission";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    document: z
        .any()
        .refine((files) => files?.length > 0, "Please select a file"),
});

type TFormData = z.infer<typeof FormSchema>;

export default function PartnerSubmissionUploadModal() {
    const form = useForm<TFormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: { name: "" },
    });

    const { dialogProps } = useAppSelector((state) => state.ui.dailog);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            form.setValue("document", e.target.files);
        }
    };

    const [uploadPartnerSubmissionDocument, { isLoading: isUploadLoading }] =
        useUploadPartnerSubmissionDocumentMutation();

    const onSubmit: SubmitHandler<TFormData> = async ({ name, document }) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("document", document[0]);

        try {
            await uploadPartnerSubmissionDocument({
                subGrantId: dialogProps?.subGrantId as string,
                submissionId: dialogProps?.partnerSubId as string,
                body: formData as any,
            });
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

                    <Button type="submit" className="w-full">
                        Submit
                    </Button>
                </form>
            </FormProvider>
        </div>
    );
}
