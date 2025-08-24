"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import FormTextArea from "components/atoms/FormTextArea";
import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";

export default function ContractRequestDetails() {
    const form = useForm();

    return (
        <section>
            <BackNavigation />

            <Card className="space-y-10">
                <div className="grid grid-cols-3 gap-10">
                    <DescriptionCard label="Request Title" description="N/A" />

                    <DescriptionCard label="Request Type" description="N/A" />

                    <DescriptionCard
                        label="Requesting Department"
                        description="N/A"
                    />

                    <DescriptionCard
                        label="No of Consultants"
                        description="N/A"
                    />

                    <DescriptionCard label="Location" description="N/A" />

                    <DescriptionCard label="FCO" description="N/A" />

                    <DescriptionCard
                        label="Technical Monitor"
                        description="N/A"
                    />

                    <DescriptionCard label="Email" description="N/A" />

                    <DescriptionCard label="Phone Number" description="N/A" />

                    <DescriptionCard label="Reviewer" description="N/A" />

                    <DescriptionCard label="Authorizer" description="N/A" />

                    <DescriptionCard label="Approver" description="N/A" />
                </div>

                <Form {...form}>
                    <form className="space-y-5">
                        <FormTextArea
                            label="Comment"
                            name="comment"
                            placeholder="Enter comment"
                            required
                        />

                        <div className="flex items-center gap-5">
                            <FormButton size="lg" className="bg-red-500">
                                Reject
                            </FormButton>

                            <FormButton size="lg" className="bg-green-500">
                                Approve
                            </FormButton>
                        </div>
                    </form>
                </Form>
            </Card>
        </section>
    );
}
