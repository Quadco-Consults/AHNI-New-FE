"use client";

import { Button } from "components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import FormButton from "@/components/FormButton";
import { closeDialog } from "store/ui";
import { z } from "zod";
import FormSelect from "components/atoms/FormSelect";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "hooks/useStore";
import { toast } from "sonner";
import FormInput from "components/atoms/FormInput";
import FormTextArea from "components/atoms/FormTextArea";
import FormRadio from "components/atoms/FormRadio";
import { SupportSchema } from "features/support/types/support/support";
import { useCreateTicket } from "@/features/support/controllers/supportController";
import { useGetUserProfile } from "@/features/auth/controllers/userController";
import { useEffect } from "react";
 

export type TFormValues = z.infer<typeof SupportSchema>;

const AddTicketModal = () => {
    const dispatch = useAppDispatch();
    const { data: userProfile, isLoading: isUserLoading } = useGetUserProfile();
    
    // Debug logging
    console.log("User Profile Data:", userProfile);

    const { createTicket, isLoading: isCreatingLoading } =
    useCreateTicket();

     

    const form = useForm<TFormValues>({
        resolver: zodResolver(SupportSchema),
        defaultValues: {
            priority: "HIGH",
            email: "",
            subject: "",
            department: "",
            issue_description: "",
            phone_number: "",
        },
    });

    // Auto-populate user details when profile data is available
    useEffect(() => {
        if (userProfile?.data) {
            const user = userProfile.data;
            form.setValue("email", user.email || "");
            
            // Set phone number (mobile_number in profile)
            if (user.mobile_number) {
                form.setValue("phone_number", user.mobile_number);
            }
            
            // Set department if available
            if (user.department) {
                form.setValue("department", user.department);
            }
        }
    }, [userProfile, form]);

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
            formData.append("phone_number", phone_number || "");
            
            // Add sender information from user profile
            if (userProfile?.data) {
                const user = userProfile.data;
                const senderName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "Unknown User";
                formData.append("sender", senderName);
            } 

            await createTicket(formData as any)();

            toast.success("Support ticket created successfully");

            dispatch(closeDialog());
        } catch (error: any) {
            toast.error(error.response?.data?.message ?? error.message ?? "Something went wrong");
        }
    };

    return (
        <div className="w-full">
            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    {userProfile?.data && (
                        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                            <p className="text-sm text-blue-700">
                                <span className="font-medium">Note:</span> Your contact details (email, department, phone) are automatically populated from your profile.
                            </p>
                        </div>
                    )}
                    
                    <FormInput
                        label="Subject"
                        name="subject"
                        required 
                        placeholder="Enter Subject" 
                    />
                    <FormInput
                        label="Department*"
                        name="department"
                        required 
                        placeholder={userProfile?.data?.department ? "Auto-populated from profile" : "Enter Department"}
                        readOnly={!!(userProfile?.data?.department)}
                        className={userProfile?.data?.department ? "bg-gray-50 cursor-not-allowed" : ""}
                    />
                    <FormTextArea
                        label="Describe Issue"
                        name="issue_description"
                        required 
                        rows={12}
                        placeholder="Write" 
                    />

                    <FormInput
                        label="Email*"
                        name="email"
                        required 
                        placeholder={userProfile?.data?.email ? "Auto-populated from profile" : "Enter Email"}
                        readOnly={!!userProfile?.data?.email}
                        className={userProfile?.data?.email ? "bg-gray-50 cursor-not-allowed" : ""}
                    />
                    <FormInput
                        label="Phone Number (Optional)"
                        name="phone_number" 
                        placeholder={userProfile?.data?.mobile_number ? "Auto-populated from profile" : "Enter phone number"}
                        readOnly={!!(userProfile?.data?.mobile_number)}
                        className={userProfile?.data?.mobile_number ? "bg-gray-50 cursor-not-allowed" : ""}
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