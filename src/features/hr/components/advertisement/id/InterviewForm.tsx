"use client";

import FormButton from "@/components/FormButton";
import Card from "components/Card";
import GoBack from "components/GoBack";
import { Loading } from "components/Loading";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { Textarea } from "components/ui/textarea";
import { formatDate } from "date-fns";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useCreateInterview, useGetInterviews, useUpdateInterview } from "@/features/hr/controllers/hrInterviewController";
import { useGetJobApplication, useUpdateJobApplicationToInterviewed } from "@/features/hr/controllers/hrJobApplicationsController";
import { toast } from "sonner";

const InterviewForm = () => {
  const params = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetJobApplication(params?.appID as string);

  // Get interviews for this advertisement
  const { data: interviewsData, isLoading: interviewsLoading } = useGetInterviews({
    id: params?.id as string, // Use advertisement ID
    size: 1000,
  });

  // Find the interview for this specific application
  // Since we can't match by application ID directly, let's match by applicant email
  const currentApplicationData = data?.data;
  const interview = (interviewsData as any)?.data?.results?.find(
    (interview: any) => {
      // First try direct ID matching approaches
      if (typeof interview.application === 'string') {
        return interview.application === params?.appID;
      }
      if (typeof interview.application === 'object' && interview.application?.id) {
        return interview.application.id === params?.appID;
      }

      // Fallback: Match by applicant email (should be unique)
      if (typeof interview.application === 'object' && currentApplicationData) {
        return interview.application.applicant_email === currentApplicationData.applicant_email;
      }

      return false;
    }
  );

  // Debug logging
  console.log("InterviewForm Debug:", {
    advertisementId: params?.id,
    applicationId: params?.appID,
    applicationData: data?.data,
    allInterviews: (interviewsData as any)?.data?.results,
    foundInterview: interview,
  });

  // More detailed debugging to understand the data structure
  const interviews = (interviewsData as any)?.data?.results || [];
  console.log("Detailed Interview Debug:");
  console.log("Target application ID:", params?.appID);
  interviews.forEach((int: any, index: number) => {
    console.log(`Interview ${index}:`, {
      id: int.id,
      application: int.application,
      applicationType: typeof int.application,
      applicationId: int.application?.id || int.application,
      applicationObject: int.application,
      application_id: int.application_id, // Check alternative field name
      job_application: int.job_application, // Check alternative field name
      matchesTarget: int.application === params?.appID || int.application?.id === params?.appID,
      allFields: Object.keys(int), // Show all available fields
      fullInterview: int
    });
  });

  const { updateInterview, isLoading: updateLoading } = useUpdateInterview(interview?.id || "");
  const { updateJobApplicationToInterviewed, isLoading: patchLoading } = useUpdateJobApplicationToInterviewed(params?.appID as string);

  // Debug the application ID
  console.log("🎯 InterviewForm Application ID:", params?.appID);
  console.log("📋 Current application data:", data?.data);

  const form = useForm();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = async (formData: any) => {
    const payload = {
      // candidate_name: data?.data?.applicant_name,
      // position_applied: data?.data?.position_applied,
      // date_of_interview: data?.data?.created_datetime.split("T")[0],
      appearance_rating: formData["rating-0"],
      appearance_comments: formData["comments-0"],
      oral_communication_rating: formData["rating-1"],
      oral_communication_comments: formData["comments-1"],
      teamwork_rating: formData["rating-2"],
      teamwork_comments: formData["comments-2"],
      work_ethics_rating: formData["rating-3"],
      work_ethics_comments: formData["comments-3"],
      analytical_rating: formData["rating-4"],
      analytical_comments: formData["comments-4"],
      knowledge_rating: formData["rating-5"],
      knowledge_comments: formData["comments-5"],
      experience_rating: formData["rating-6"],
      experience_comments: formData["comments-6"],
      is_preferred: formData.preference,
      // preferred_candidate: formData.preference,
      recommendation: formData.recommendations,
      application: params?.appID as string,
    };
    try {
      if (interview?.id) {
        console.log("🔥 Starting interview completion process...");

        // Update existing interview with evaluation data
        console.log("📝 Updating interview with payload:", payload);
        await updateInterview(payload);
        console.log("✅ Interview updated successfully");

        // Update application status to "INTERVIEWED" after completing the interview
        console.log("🔄 Starting automatic status update after interview completion");
        console.log("📋 Application ID:", params?.appID);
        console.log("🚀 Calling updateJobApplicationToInterviewed");

        const statusUpdateResult = await updateJobApplicationToInterviewed();

        console.log("✅ Application status updated successfully");
        console.log("📊 Status update API response:", statusUpdateResult);
        console.log("📊 Updated status in response:", statusUpdateResult?.status);
        console.log("📊 Full status update response:", JSON.stringify(statusUpdateResult, null, 2));

        toast.success("Interview evaluation submitted successfully");
        router.back();
      } else {
        // No interview exists for this application
        toast.error("No interview scheduled for this application. Please schedule an interview first.");
      }
    } catch (error) {
      console.error("❌ Error during interview completion:", error);
      toast.error(`Something went wrong: ${(error as any)?.message || 'Unknown error'}`);
    }
  };

  if (isLoading || interviewsLoading) {
    return <Loading />;
  }

  // Check if interview exists for this application
  if (!interview) {
    return (
      <div className='flex flex-col gap-4'>
        <GoBack />
        <Card>
          <div className='text-center py-8'>
            <h2 className='font-semibold text-lg mb-4'>No Interview Found</h2>
            <p className='text-gray-600 mb-4'>
              Unable to find an interview record for this application.
            </p>
            <div className='text-sm text-gray-500 space-y-2'>
              <p>This could happen if:</p>
              <ul className='list-disc list-inside text-left max-w-md mx-auto'>
                <li>The interview hasn't been scheduled yet</li>
                <li>There's a data sync issue</li>
                <li>The interview was deleted</li>
              </ul>
              <p className='mt-4'>Please try scheduling a new interview or contact support.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <GoBack />

      <Card>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Name of Candidate</h2>
            <p>{
              data?.data?.applicant_name ||
              [
                (data?.data as any)?.applicant_first_name,
                (data?.data as any)?.applicant_middle_name,
                (data?.data as any)?.applicant_last_name
              ].filter(Boolean).join(' ') ||
              "Unknown Candidate"
            }</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Position Applied</h2>
            <p> {data?.data?.position_applied}</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Name of Interviewer</h2>
            <p>{
              interview?.interviewer?.full_name ||
              interview?.interviewer?.name ||
              (typeof interview?.interviewer === 'string' ? interview.interviewer : '') ||
              data?.data?.interviewer ||
              "-"
            }</p>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='font-semibold'>Date of Interview</h2>
            <p>{interview?.start_date ? formatDate(interview.start_date, "dd, MMM, yyyy") :
                data?.data?.interview_date ? formatDate(data?.data?.interview_date, "dd, MMM, yyyy") : "Not scheduled"}</p>
          </div>
        </div>

        <Separator className='my-6' />
        <div className=''>
          <h2 className='font-semibold'>Key Rating</h2>
        </div>
        <Card className='mt-4'>
          <Table>
            <TableHeader>
              <TableRow className='border-none'>
                <TableCell>Below Average</TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Good</TableCell>
                <TableCell>Very Good</TableCell>
                <TableCell>Outstanding</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className='border-white border-t border-t-gray-200'>
                {[1, 2, 3, 4, 5].map((rating, idx) => (
                  <TableCell key={idx}>
                    <Badge
                      className={`rounded-sm text-black px-12 py-2 bg-[${getColor(
                        rating
                      )}]`}
                    >
                      {rating}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Card>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-8 flex flex-col gap-8'
        >
          {ratingSections.map((section, index) => (
            <Card key={index} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-3'>
                <h2 className='font-semibold'>{section.title}</h2>
                <p>{section.description}</p>
              </div>
              <div className=''>
                <p className='text-primary text-sm'>Tick as appropriate</p>
                <div className='flex gap-4 w-full'>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      type='button'
                      onClick={() => setValue(`rating-${index}`, value)}
                      className={`px-4 py-2 border w-full ${
                        watch(`rating-${index}`) === value
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                {errors[`rating-${index}`] && (
                  <p className='text-red-500 text-sm mt-2'>
                    {/* @ts-ignore */}
                    {errors[`rating-${index}`]?.message}
                  </p>
                )}
              </div>
              <div className=''>
                <label htmlFor={`comments-${index}`} className='font-semibold'>
                  Comments
                </label>
                <Textarea
                  id={`comments-${index}`}
                  {...register(`comments-${index}`, {
                    required: "Comments are required",
                  })}
                  required
                  rows={6}
                  className='mt-2'
                />
              </div>
            </Card>
          ))}
          <div className=''>
            <label htmlFor={`recommendations`} className='font-semibold'>
              Recommendations
            </label>
            <Textarea
              id={`recommendations`}
              {...register(`recommendations`, {
                required: "Comments are required",
              })}
              rows={6}
              className='mt-2'
            />
          </div>
          <div className=''>
            <label htmlFor={`preference`} className='flex items-center gap-2'>
              <input
                type='checkbox'
                id={`preference`}
                {...register(`preference`)}
              />
              Mark as Preferred
            </label>
          </div>
          <div className='flex w-full justify-end mt-4'>
            <FormButton
              disabled={updateLoading || patchLoading}
              loading={updateLoading || patchLoading}
              type='submit'
              className='bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition duration-300 ease-in-out'
            >
              Complete Interview
            </FormButton>
          </div>
        </form>
      </Card>
    </div>
  );
};

const getColor = (rating: number) => {
  switch (rating) {
    case 1:
      return "#FECDCA";
    case 2:
      return "#F5DEA2";
    case 3:
      return "#F2BB31";
    case 4:
      return "#BCFBAE";
    case 5:
      return "#8DF384";
    default:
      return "#CCC";
  }
};

export default InterviewForm;

const ratingSections = [
  {
    title: "Appearance/Corporate Poise",
    description:
      "Appearance and composure in conformity with acceptable standards of the position",
  },
  {
    title: "Oral Communication",
    description:
      "Ability to speak articulately and with clarity displaying good pronunciation and grammar",
  },
  {
    title: "Supervisory Experience and/or Teamwork",
    description: "Ability to supervise and/or work as a team member",
  },
  {
    title: "Work Ethics",
    description:
      "Ability/tendency to maintain AHNI values (excellence, integrity, responsiveness, respect and dedication) and use judgment to execute duties and responsibilities.",
  },
  {
    title: "Analytical thinking",
    description:
      "Capacity to examine and evaluate situations in a logical and rational approach",
  },
  {
    title:
      "Knowledge of international/regional NGO or local organization issues",
    description:
      "Displayed knowledge/understanding of political, social and ethical issues surrounding health related matters and knowledge of and experience with NGO’s interventions.",
  },
  {
    title: "Quality/Relevance of Experience ",
    description:
      "Determined by the length, variety of positions held, quality of experience, industry type and size relevant to position.",
  },
];
