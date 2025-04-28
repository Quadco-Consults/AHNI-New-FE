import { Button } from "components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import FormButton from "atoms/FormButton";
import { closeDialog } from "store/ui";
import { z } from "zod";
import FormSelect from "atoms/FormSelect";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "hooks/useStore";
import { toast } from "sonner";
import { useUploadWorkPlanMutation } from "services/programsApi/work-plan";
import { useGetAllFinancialYearsQuery } from "services/modules/config/financial-year";
import { useGetAllProjectsQuery } from "services/project";
import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import FormRadio from "atoms/FormRadio";
import { SupportSchema } from "definations/support/support";
import { useCreateTicketMutation } from "services/support";
 

export type TFormValues = z.infer<typeof SupportSchema>;

const AddTicketModal = () => {
    const dispatch = useAppDispatch();

     

    const [createTicket, { isLoading: isCreatingLoading }] =
    useCreateTicketMutation();

     

    const form = useForm<TFormValues>({
        resolver: zodResolver(SupportSchema),
        defaultValues: {
            priority: "HIGH",
        },
    });

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TFormValues> = async ({
        subject,
        department,
        issue_description,
        email,
        priority, 
        phone_number,
    }) => {
         

        try {
            const formData = new FormData();
            formData.append("subject", subject);  
            formData.append("department", department); 
            formData.append("issue_description", issue_description); 
            formData.append("email", email); 
            formData.append("priority", priority);  
            formData.append("phone_number", phone_number); 

            await createTicket(formData as any).unwrap();

            toast.success("Work Plan Uploaded");

            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <div className="w-full">
            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    <FormInput
                        label="Subject"
                        name="subject"
                        required 
                        placeholder="Enter Subject" 
                    />
                    <FormInput
                        label="Department"
                        name="department"
                        required 
                        placeholder="Enter Department" 
                    />
                    <FormTextArea
                        label="Describe Issue"
                        name="issue_description"
                        required 
                        rows={12}
                        placeholder="Write" 
                    />

                    <FormInput
                        label="Email"
                        name="email"
                        required 
                        placeholder="Enter Email" 
                    />
                    <FormInput
                        label="Phone Number (Optional)"
                        name="phone_number" 
                        placeholder="Enter phone number" 
                    />
                    <FormRadio
                        label='Priority'
                        name='priority'
                        options={[
                            { label: "High", value: "HIGH" },
                            { label: "Medium", value: "MEDIUM", },
                            { label: "Low", value: "LOW", },
                        ]}
                        />
                   

                    <div className="flex justify-between gap-5 mt-16">
                        <Button
                            onClick={() => dispatch(closeDialog())}
                            type="button"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                        >
                            Cancel
                        </Button>
                        <FormButton
                            loading={isCreatingLoading}
                            type="submit"
                            disabled={isCreatingLoading}
                        >
                            Done
                        </FormButton>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default AddTicketModal;
