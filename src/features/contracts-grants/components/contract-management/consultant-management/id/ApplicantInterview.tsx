"use client";

import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import Card from "components/Card";
import FormSelect from "components/atoms/FormSelect";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useGetSingleConsultancyApplicant } from "@/features/contracts-grants/controllers/consultancyApplicantsController";
import { LoadingSpinner } from "components/Loading";

const guide = [
    { main: "Unacceptable", sub: "(Did not meet any requirements)" },
    { main: "Marginal", sub: "(Meets some requirements, but not others)" },
    { main: "Acceptable", sub: "(Meets most but not all reuirements)" },
    { main: "Excellent", sub: "(Meets all exceeds all requirements)" },
];

const scoreOptions = ["1", "2", "3", "4", "5"].map((value) => ({
    label: value,
    value,
}));

const evaluationCriteria = [
    { name: "relevant_experience", label: "Has done similar work previously (nature of task)" },
    { name: "project_management", label: "Understands project management and the potential task(s)" },
    { name: "recent_experience", label: "Experience is recent (2-3 years)" },
    { name: "comparable_projects", label: "Worked with projects comparable to the AHNi (budget and complexity)" },
    { name: "communication_skills", label: "Excellent Communication Skills" },
    { name: "technical_skill", label: "Relevant Technical Skill" },
    { name: "relevant_qualification", label: "Qualifications are relevant to the consultancy" },
    { name: "academic_credentials", label: "Strong academic credentials" },
    { name: "timeline_management", label: "Demonstrated ability to manage the project/consultancy timelines" },
    { name: "toolset_framework", label: "Proven toolset and framework" },
];

export default function ApplicantInterviewPage() {
    const router = useRouter();
    const params = useParams();
    // Handle URL parameters based on Next.js App Router structure:
    // /dashboard/programs/adhoc-management/[id]/applicant/[applicantId]/adhoc-interview/page.tsx
    const adhocId = params?.id as string;        // The consultancy/adhoc management ID
    const applicantId = params?.applicantId as string;  // The applicant ID

    // Fetch applicant data
    const { data: applicantData, isLoading } = useGetSingleConsultancyApplicant(applicantId);
    const applicantName = applicantData?.data?.name || "Applicant";

    const form = useForm({
        defaultValues: {
            // Interview type - required field
            interview_type: "NON_COMMITTEE",
            // Initialize all scoring fields with empty values - matching backend field names
            relevant_experience: "",
            project_management: "",
            recent_experience: "",
            comparable_projects: "",
            communication_skills: "",
            technical_skill: "",
            relevant_qualification: "",
            academic_credentials: "",
            timeline_management: "",
            toolset_framework: "",
        }
    });

    const onSubmit = async (data: any) => {
        console.log('Interview scores submitted:', data);

        // Calculate total score - exclude interview_type from calculation
        const { interview_type, ...scoreData } = data;
        const scores = Object.values(scoreData).filter(val => val !== "").map(Number);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);

        console.log('Individual scores:', scores);
        console.log('Total score:', totalScore);

        if (scores.length === 0) {
            toast.error('Please fill in at least one score before submitting.');
            return;
        }

        if (scores.length < 10) {
            toast.error('Please fill in all evaluation criteria before submitting.');
            return;
        }

        try {
            // Step 1: Create interview record with scores
            // Note: applicant is automatically assigned from the URL by the backend
            const interviewPayload = {
                ...data, // This contains all the scores with correct field names
            };

            console.log('Creating interview with payload:', interviewPayload);
            const interviewResponse = await AxiosWithToken.post(
                `/contract-grants/consultancy/applicants/${applicantId}/interviews/`,
                interviewPayload
            );
            console.log('Interview created successfully:', interviewResponse.data);

            // Step 2: Update applicant status to INTERVIEWED
            console.log('Updating applicant status to INTERVIEWED');
            const statusResponse = await AxiosWithToken.patch(
                `/contract-grants/consultancy/applicants/${applicantId}/`,
                { status: "INTERVIEWED" }
            );
            console.log('Status updated successfully:', statusResponse.data);

            toast.success(`Interview completed successfully! Total score: ${totalScore}/50`);

            // Navigate back to the previous page after successful submission
            setTimeout(() => {
                router.back();
            }, 1500);

        } catch (error: any) {
            console.error("Interview submission error:", error);
            console.error("Error response:", error.response?.data);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || error.response?.data?.detail
                || error.message
                || "Failed to submit interview. Please try again.";

            toast.error(`Failed to submit interview: ${errorMessage}`);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <section>
            <BackNavigation />

            <Card className="space-y-5">
                <div>
                    <h1 className="text-[#DEA004] font-bold text-lg">
                        Consultant Evaluation Metric
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Interviewing: <span className="font-semibold text-gray-900">{applicantName}</span>
                    </p>
                </div>

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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-lg text-[#DEA004] font-bold mb-4">
                                Relevant Experience Requirements
                            </h2>
                            <div className="space-y-4">
                                {evaluationCriteria.map((criteria) => (
                                    <div key={criteria.name} className="bg-white p-4 rounded border border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <label className="text-sm font-medium text-gray-700">
                                                {criteria.label}
                                            </label>
                                            <FormSelect
                                                name={criteria.name}
                                                placeholder="Select Score"
                                                options={scoreOptions}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                            <div className="flex items-center">
                                <h3 className="font-bold">Total Score:</h3>&nbsp;
                                <p>{
                                    (() => {
                                        const { interview_type, ...scoreFields } = form.watch();
                                        return Object.values(scoreFields).filter(val => val !== "").reduce((sum, score) => {
                                            const numScore = Number(score);
                                            return !isNaN(numScore) ? sum + numScore : sum;
                                        }, 0);
                                    })()
                                }/50</p>
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
