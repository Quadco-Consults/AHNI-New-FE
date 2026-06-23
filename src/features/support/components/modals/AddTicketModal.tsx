"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import FormButton from "@/components/FormButton";
import { closeDialog } from "@/store/ui";
import { z } from "zod";
import FormSelect from "@/components/FormSelect";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/useStore";
import FormInput from "@/components/FormInput";
import FormTextArea from "@/components/FormTextArea";
import FormRadio from "@/components/FormRadio";
import { SupportSchema } from "@/features/support/types/support/support";
import { useCreateTicket } from "@/features/support/controllers/supportController";
import { useGetUserProfile, useGetCurrentUser } from "@/features/auth/controllers/userController";
import { useEffect } from "react";
 

export type TFormValues = z.infer<typeof SupportSchema>;

const AddTicketModal = () => {
    const dispatch = useAppDispatch();
    const { data: userProfile, isLoading: isUserLoading } = useGetUserProfile();
    const { data: currentUser, isLoading: isCurrentUserLoading } = useGetCurrentUser();

    // Use either profile or current user data
    const userData = userProfile?.data || currentUser?.data;

    // Debug logging
    console.log("🔍 User Profile Data:", userProfile);
    console.log("🔍 Profile Loading:", isUserLoading);
    console.log("🔍 Current User Data:", currentUser);
    console.log("🔍 Current User Loading:", isCurrentUserLoading);
    console.log("🔍 Using userData:", userData);
    console.log("🔍 Department structure:", userData?.department);

    // Log authentication state from localStorage
    console.log("🔍 Local Storage Token:", localStorage.getItem('token')?.substring(0, 20) + '...');
    console.log("🔍 Local Storage User:", JSON.parse(localStorage.getItem('user') || '{}'));

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
            sender: "",
        },
    });

    // Auto-populate user details when user data is available
    useEffect(() => {
        if (userData) {
            form.setValue("email", userData.email || "");

            // Set sender name from user data
            const senderName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
            if (senderName) {
                form.setValue("sender", senderName);
            }

            // Set phone number (mobile_number in profile)
            if (userData.mobile_number) {
                form.setValue("phone_number", userData.mobile_number);
            }

            // Set department if available - handle object structure
            if (userData.department) {
                // Department is an object with name and id properties
                const deptName = typeof userData.department === 'object' && userData.department.name
                    ? userData.department.name
                    : (typeof userData.department === 'string' ? userData.department : "");

                if (deptName) {
                    form.setValue("department", deptName);
                }
            }

            console.log("Form values after setting:", form.getValues());
        }
    }, [userData, form]);

    const { handleSubmit } = form;

    const onSubmit: SubmitHandler<TFormValues> = async ({
        subject,
        department,
        issue_description,
        email,
        priority,
        phone_number,
        sender,
    }) => {
        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("department", department);
        formData.append("issue_description", issue_description);
        formData.append("email", email);
        formData.append("priority", priority);
        formData.append("phone_number", phone_number || "");
        formData.append("sender", sender || email?.split("@")[0] || "Unknown User");

        try {
            await createTicket(formData as any);
            // Success toast is handled by useApiManager, just close the dialog
            dispatch(closeDialog());
        } catch (error: any) {
            // Error toast is handled by useApiManager's onError callback
            console.error("Ticket creation error:", error);
        }
    };

    return (
        <div className="w-full">
            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    {/* Debug information */}
                    <div className="p-3 bg-gray-50 rounded-md border border-gray-200 text-xs">
                        <p className="font-medium text-gray-700 mb-1">Debug Info:</p>
                        <p>Profile Loading: {isUserLoading ? '⏳' : '✅'}</p>
                        <p>Current User Loading: {isCurrentUserLoading ? '⏳' : '✅'}</p>
                        <p>Has User Data: {userData ? '✅' : '❌'}</p>
                        <p>Has Auth Token: {typeof localStorage !== 'undefined' && localStorage.getItem('token') ? '✅' : '❌'}</p>
                        {userData && <p>Email: {userData.email}</p>}
                        {userData && <p>Department: {typeof userData.department === 'object' ? userData.department?.name : userData.department}</p>}
                    </div>

                    {userData && (
                        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                            <p className="text-sm text-blue-700">
                                <span className="font-medium">Note:</span> Your contact details (email, department, phone) are automatically populated from your profile.
                                <br />
                                <span className="text-xs">User: {userData.first_name} {userData.last_name} ({userData.email})</span>
                            </p>
                        </div>
                    )}

                    {!userData && (isUserLoading || isCurrentUserLoading) && (
                        <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                            <p className="text-sm text-yellow-700">
                                <span className="font-medium">Loading user data...</span> Please wait while we fetch your profile information.
                            </p>
                        </div>
                    )}

                    {!userData && !isUserLoading && !isCurrentUserLoading && (
                        <div className="p-3 bg-red-50 rounded-md border border-red-200">
                            <p className="text-sm text-red-700">
                                <span className="font-medium">Unable to load user data.</span> Please ensure you're logged in and try again.
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
                        placeholder={userData?.department?.name ? "Auto-populated from profile" : "Enter Department"}
                        readOnly={!!(userData?.department?.name)}
                        className={userData?.department?.name ? "bg-gray-50 cursor-not-allowed" : ""}
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
                        placeholder={userData?.email ? "Auto-populated from profile" : "Enter Email"}
                        readOnly={!!userData?.email}
                        className={userData?.email ? "bg-gray-50 cursor-not-allowed" : ""}
                    />
                    <FormInput
                        label="Phone Number (Optional)"
                        name="phone_number" 
                        placeholder={userData?.mobile_number ? "Auto-populated from profile" : "Enter phone number"}
                        readOnly={!!(userData?.mobile_number)}
                        className={userData?.mobile_number ? "bg-gray-50 cursor-not-allowed" : ""}
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
                            className="bg-brand-light text-primary dark:text-gray-500"
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