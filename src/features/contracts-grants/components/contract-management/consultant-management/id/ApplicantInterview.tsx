"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import Card from "components/Card";
import createApplicantInterviewColumns from "@/features/contracts-grants/components/table-columns/contract-management/consultant-management/consultant-interview";
import DataTable from "components/Table/DataTable";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const guide = [
    { main: "Unacceptable", sub: "(Did not meet any requirements)" },
    { main: "Marginal", sub: "(Meets some requirements, but not others)" },
    { main: "Acceptable", sub: "(Meets most but not all reuirements)" },
    { main: "Excellent", sub: "(Meets all exceeds all requirements)" },
];

export default function ApplicantInterviewPage() {
    const router = useRouter();
    const params = useParams();
    // Handle URL parameters based on Next.js App Router structure:
    // /dashboard/programs/adhoc-management/[id]/applicant/[applicantId]/adhoc-interview/page.tsx
    const adhocId = params?.id as string;        // The consultancy/adhoc management ID
    const applicantId = params?.applicantId as string;  // The applicant ID
    
    const form = useForm({
        defaultValues: {
            // Initialize all scoring fields with empty values
            similar_work: "",
            project_management: "",
            recent_experience: "",
            comparable_projects: "",
            communication_skills: "",
            relevant_technical_skill: "",
            relevant_qualifications: "",
            academic_credentials: "",
            project_timelines: "",
            proven_toolset: "",
        }
    });

    const onSubmit = async (data: any) => {
        console.log('Interview scores submitted:', data);
        console.log('Current URL params:', params);
        console.log('Available param keys:', Object.keys(params || {}));
        console.log('Adhoc ID:', adhocId);
        console.log('Applicant ID:', applicantId);
        console.log('All param values:', Object.entries(params || {}));
        
        // Calculate total score
        const scores = Object.values(data).filter(val => val !== "").map(Number);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        
        console.log('Individual scores:', scores);
        console.log('Total score:', totalScore);
        
        if (scores.length === 0) {
            toast.error('Please fill in at least one score before submitting.');
            return;
        }
        
        // Update applicant status to INTERVIEWED
        try {
            if (applicantId) {
                const apiUrl = `/contract-grants/consultancy/applicants/${applicantId}/`;
                console.log('Making PATCH request to:', apiUrl);
                console.log('Request payload:', { status: "INTERVIEWED" });
                
                const response = await AxiosWithToken.patch(apiUrl, { status: "INTERVIEWED" });
                console.log('Status update response:', response);
                console.log('Applicant status updated to INTERVIEWED successfully');
            } else {
                console.error('No applicantId found in URL parameters');
                toast.error('Cannot update status: Missing applicant ID');
                return;
            }
        } catch (statusError: any) {
            console.error("Status update error:", statusError);
            console.error("Error details:", statusError.response?.data);
            toast.error("Interview submitted but failed to update status");
        }
        
        toast.success(`Interview completed successfully! Total score: ${totalScore}`);
        
        // Navigate back to the previous page after successful submission
        setTimeout(() => {
            router.back();
        }, 1500); // Give time for user to see the success message
        
        // TODO: Implement API call to submit interview scores to dedicated endpoint
        // This will need a new endpoint in the contractController for storing detailed scores
    };

    const columns = createApplicantInterviewColumns();

    return (
        <section>
            <BackNavigation />

            <Card className="space-y-5">
                <h1 className="text-[#DEA004] font-bold text-lg">
                    Consultant Evaluation Metric
                </h1>

                <p className="text-sm">
                    Kindly use this matrix to comparatively evaluate consulting
                    candidates. For each consultant, next to each criteria enter
                    a ranking ranging between 1 and 4, where:
                </p>

                <ul className="text-sm list-disc pl-[15px] space-y-5">
                    {guide.map(({ main, sub }) => (
                        <li key={main}>
                            <span className="text-red-500 font-semibold">
                                {main}&nbsp;
                            </span>
                            {sub}
                        </li>
                    ))}
                </ul>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DataTable
                            columns={columns}
                            data={[{} as any]}
                        />

                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <h3 className="font-bold">Total Score:</h3>&nbsp;
                                <p>{
                                    Object.values(form.watch()).filter(val => val !== "").reduce((sum, score) => {
                                        const numScore = Number(score);
                                        return !isNaN(numScore) ? sum + numScore : sum;
                                    }, 0)
                                }/{Object.keys(form.getValues()).length * 5}</p>
                            </div>
                            <div className="flex items-center justify-end gap-x-5">
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    type="button"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <FormButton size="lg" type="submit">
                                    Submit
                                </FormButton>
                            </div>
                        </div>
                    </form>
                </Form>
            </Card>
        </section>
    );
}
