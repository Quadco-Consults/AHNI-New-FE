"use client";

import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import FormButton from "@/components/FormButton";
import FormInput from "components/atoms/FormInput";
import { Form } from "components/ui/form";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useUpdateConsultantManagement } from "@/features/contracts-grants/controllers/consultantManagementController";
import { useCreateExistingConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";

interface AcceptanceFormData {
    country: string;
    city: string;
    signature?: File;
    date: string;
}

export default function AcceptanceForm() {
    const form = useForm<AcceptanceFormData>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const params = useParams();
    const router = useRouter();
    const consultantId = params?.id as string;

    // Get the consultant management update function
    const { updateConsultantManagement, isLoading: isUpdateLoading } = useUpdateConsultantManagement(consultantId);

    // Get the existing applicant creation function
    const { createExistingConsultancyApplicant, isLoading: isCreateLoading } = useCreateExistingConsultancyApplicant();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            console.log("Selected file:", file.name);
        }
    };

    const onSubmit = async (data: AcceptanceFormData) => {
        console.log("Acceptance form submission:", data);
        console.log("Selected file:", selectedFile);

        if (!consultantId) {
            toast.error("No consultant ID found");
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 1: Update the consultant management status to ACCEPTED
            await updateConsultantManagement({
                status: "ACCEPTED",
                // Include the acceptance form data if needed
                acceptance_country: data.country,
                acceptance_city: data.city,
                acceptance_date: data.date,
                // Note: File upload would need separate handling
            } as any);

            console.log("Consultant management status updated to ACCEPTED");

            // Step 2: Create existing consultant applicant record for adhoc database
            await createExistingConsultancyApplicant({
                applicant: consultantId, // Use consultant ID as applicant reference
                consultancy: consultantId, // Link to the consultancy job
            });

            console.log("Existing consultant applicant record created");

            toast.success("Consultant acceptance form submitted successfully!");

            // Navigate back to the acceptance list
            router.back();

        } catch (error) {
            console.error("Acceptance form submission error:", error);

            // Provide more detailed error information
            if (error instanceof Error) {
                console.error("Error details:", error.message);
                toast.error(`Failed to submit acceptance form: ${error.message}`);
            } else {
                toast.error("Failed to submit acceptance form. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <div className="grid grid-cols-2 items-center gap-10">
                    <FormInput
                        label="Country"
                        name="country"
                        placeholder="Enter Country"
                        required
                    />

                    <FormInput
                        label="City"
                        name="city"
                        placeholder="Enter City"
                        required
                    />

                    <p className="col-span-3 font-semibold">
                        I am not a Nigerian and do not possess a TIN. Payment
                        for my services will not be subject to Nigerian taxation
                        as I am not and will not be, on this assignment, working
                        in Nigeria. I am a permanent resident of South Africa
                    </p>

                    <div className="flex flex-col gap-y-[1rem]">
                        <Label className="font-medium">Upload Signature</Label>

                        <div className="flex items-center w-full gap-x-[1rem]">
                            <label
                                className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                                htmlFor="file-resume"
                            >
                                <UploadFileSvg />
                                Select file
                            </label>
                            <input
                                type="file"
                                name="file-resume"
                                hidden
                                id="file-resume"
                                onChange={handleFileChange}
                            />
                            <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem] truncate text-ellipsis">
                                {selectedFile ? selectedFile.name : "No file selected"}
                            </p>
                        </div>
                    </div>

                    <FormInput type="date" label="Date" name="date" required />
                </div>

                <div className="space-y-3">
                    <h3
                        className="text-primary font-semibold
                    "
                    >
                        Download
                    </h3>

                    <p className="font-semibold">
                        Agreement Terms & Scope of Work
                    </p>
                </div>

                <Separator />

                <div className="space-y-3">
                    <h3
                        className="text-primary font-semibold
                    "
                    >
                        Safeguarding Policy
                    </h3>

                    <p className="font-semibold">
                        AHNi is dedicated to ensuring a secure environment for
                        all its employees, beneficiaries, and individuals
                        contracted by the organisation. This commitment extends
                        to implementing measures aimed at safeguarding
                        vulnerable individuals from sexual exploitation and
                        abuse (SEA), whether perpetrated by AHNi employees or
                        affiliated personnel. Adhering to child safeguarding
                        principles is fundamental to AHNi's approach. Our
                        safeguarding policies are applicable to and binding upon
                        all AHNi staff, board members, volunteers, as well as
                        partner staff (including subcontractors, consultants,
                        vendors, and sub-recipients), irrespective of the
                        funding mechanism, contract amount, or agreement terms.
                    </p>

                    <p className="font-medium text-primary">
                        <span className="font-bold">NOTE:</span> Consultancy
                        daily rates are personal to you and confidential, hence
                        should not be shared with any staff or third parties
                        without the express permission of the C&G Unit.
                    </p>
                </div>

                <FormButton type="submit" size="lg" disabled={isSubmitting || isUpdateLoading || isCreateLoading}>
                    {(isSubmitting || isUpdateLoading || isCreateLoading) ? "Submitting..." : "Submit"}
                </FormButton>
            </form>
        </Form>
    );
}
