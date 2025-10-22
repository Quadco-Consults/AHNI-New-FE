"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Card from "components/Card";
import FormButton from "@/components/FormButton";
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
import { toast } from "sonner";
import { ConsultancyInterviewScore } from "@/features/contracts-grants/types/contract-management/consultancy-management/consultancy-application";
import {
  useSubmitConsultancyInterviewScore,
  useGetMyConsultancyInterviewScore,
  useUpdateConsultancyInterviewScore,
} from "@/features/contracts-grants/controllers/consultancyInterviewController";
import { formatDate } from "date-fns";
import { Loading } from "components/Loading";

interface ConsultancyScoreCardProps {
  interviewId: string;
  candidateName: string;
  position: string;
  interviewDate: string;
  onScoreSubmitted?: () => void;
  readOnly?: boolean;
}

const ConsultancyScoreCard = ({
  interviewId,
  candidateName,
  position,
  interviewDate,
  onScoreSubmitted,
  readOnly = false,
}: ConsultancyScoreCardProps) => {
  const [totalScore, setTotalScore] = useState(0);
  const [percentageScore, setPercentageScore] = useState(0);

  // Fetch existing score for this interviewer
  const { data: myScoreData, isLoading: scoreLoading } = useGetMyConsultancyInterviewScore(
    interviewId,
    !readOnly
  );

  const existingScore = myScoreData?.data;
  const isEditing = !!existingScore && existingScore.status === "PENDING";

  const { submitScore, isLoading: submitLoading } =
    useSubmitConsultancyInterviewScore(interviewId);
  const { updateScore, isLoading: updateLoading } = useUpdateConsultancyInterviewScore(
    interviewId,
    existingScore?.id || ""
  );

  const form = useForm<Record<string, any>>({
    defaultValues: {
      "rating-0": 0,
      "rating-1": 0,
      "rating-2": 0,
      "rating-3": 0,
      "rating-4": 0,
      "rating-5": 0,
      "rating-6": 0,
      "rating-7": 0,
      "rating-8": 0,
      "rating-9": 0,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Load existing score data into form
  useEffect(() => {
    if (existingScore) {
      setValue("rating-0", existingScore.relevant_experience || 0);
      setValue("rating-1", existingScore.project_management || 0);
      setValue("rating-2", existingScore.recent_experience || 0);
      setValue("rating-3", existingScore.comparable_projects || 0);
      setValue("rating-4", existingScore.communication_skills || 0);
      setValue("rating-5", existingScore.technical_skill || 0);
      setValue("rating-6", existingScore.relevant_qualification || 0);
      setValue("rating-7", existingScore.academic_credentials || 0);
      setValue("rating-8", existingScore.timeline_management || 0);
      setValue("rating-9", existingScore.toolset_framework || 0);
    }
  }, [existingScore, setValue]);

  // Calculate total score in real-time
  useEffect(() => {
    const ratings = ratingSections.map((_, index) =>
      parseInt(watch(`rating-${index}`) || 0)
    );
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    const percentage = (total / 50) * 100; // 10 criteria × 5 max = 50 points

    setTotalScore(total);
    setPercentageScore(Math.round(percentage));
  }, [
    watch("rating-0"),
    watch("rating-1"),
    watch("rating-2"),
    watch("rating-3"),
    watch("rating-4"),
    watch("rating-5"),
    watch("rating-6"),
    watch("rating-7"),
    watch("rating-8"),
    watch("rating-9"),
  ]);

  const onSubmit = async (formData: any) => {
    // Validate all ratings are filled
    for (let i = 0; i < ratingSections.length; i++) {
      if (!formData[`rating-${i}`] || formData[`rating-${i}`] === 0) {
        toast.error(`Please rate "${ratingSections[i].title}"`);
        return;
      }
    }

    const scoreData: Partial<ConsultancyInterviewScore> = {
      relevant_experience: formData["rating-0"],
      project_management: formData["rating-1"],
      recent_experience: formData["rating-2"],
      comparable_projects: formData["rating-3"],
      communication_skills: formData["rating-4"],
      technical_skill: formData["rating-5"],
      relevant_qualification: formData["rating-6"],
      academic_credentials: formData["rating-7"],
      timeline_management: formData["rating-8"],
      toolset_framework: formData["rating-9"],
      status: "SUBMITTED",
    };

    try {
      if (isEditing && existingScore?.id) {
        await updateScore(scoreData);
        toast.success("Your consultancy interview score has been updated successfully");
      } else {
        await submitScore(scoreData);
        toast.success("Your consultancy interview score has been submitted successfully");
      }

      if (onScoreSubmitted) {
        onScoreSubmitted();
      }
    } catch (error) {
      console.error("Score submission error:", error);
      toast.error(
        `Failed to ${isEditing ? "update" : "submit"} score: ${
          (error as any)?.message || "Unknown error"
        }`
      );
    }
  };

  if (scoreLoading) {
    return <Loading />;
  }

  // If read-only mode and score is submitted, show read-only view
  if (readOnly && existingScore?.status === "SUBMITTED") {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Consultancy Interview Evaluation</h2>
            <p className="text-sm text-gray-600">
              Score submitted on{" "}
              {existingScore.submitted_at
                ? formatDate(new Date(existingScore.submitted_at), "dd MMM, yyyy")
                : "N/A"}
            </p>
          </div>
          <Badge className="bg-green-500 text-white">SUBMITTED</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Candidate</p>
            <p className="font-medium">{candidateName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Position</p>
            <p className="font-medium">{position}</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {existingScore.total_score || 0} / 50
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Percentage</p>
              <p className="text-2xl font-bold text-blue-600">
                {existingScore.percentage_score || 0}%
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Display all scores in read-only mode */}
        <div className="space-y-4">
          {ratingSections.map((section, index) => {
            const ratingField = section.field as keyof ConsultancyInterviewScore;
            return (
              <Card key={index} className="p-4">
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Rating:</span>
                  <Badge
                    className="text-white"
                    style={{ backgroundColor: getColor(existingScore[ratingField] as number || 0) }}
                  >
                    {existingScore[ratingField] || 0} / 5
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Your" : "Submit Your"} Consultancy Interview Evaluation
          </h2>
          <p className="text-sm text-gray-600">
            Evaluate the candidate across 10 key consultancy criteria
          </p>
        </div>
        {existingScore && (
          <Badge
            className={
              existingScore.status === "SUBMITTED"
                ? "bg-green-500"
                : "bg-yellow-500"
            }
          >
            {existingScore.status}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Candidate</p>
          <p className="font-medium">{candidateName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Position</p>
          <p className="font-medium">{position}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Interview Date</p>
          <p className="font-medium">
            {formatDate(new Date(interviewDate), "dd MMM, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Interview ID</p>
          <p className="font-medium text-xs">{interviewId.slice(0, 8)}...</p>
        </div>
      </div>

      {/* Real-time Score Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Total Score</p>
            <p className="text-2xl font-bold text-purple-600">
              {totalScore} / 50
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Percentage</p>
            <p className="text-2xl font-bold text-pink-600">
              {percentageScore}%
            </p>
          </div>
        </div>
        {percentageScore > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentageScore}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Consultancy Rating Scale</h3>
        <Card className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-none">
                <TableCell>Poor</TableCell>
                <TableCell>Fair</TableCell>
                <TableCell>Good</TableCell>
                <TableCell>Very Good</TableCell>
                <TableCell>Excellent</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-white border-t border-t-gray-200">
                {[1, 2, 3, 4, 5].map((rating, idx) => (
                  <TableCell key={idx}>
                    <Badge
                      className="rounded-sm text-black px-12 py-2"
                      style={{ backgroundColor: getColor(rating) }}
                    >
                      {rating}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6">
        {ratingSections.map((section, index) => (
          <Card key={index} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-base">{section.title}</h3>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
            <div>
              <p className="text-primary text-sm mb-2">Rate from 1 (Poor) to 5 (Excellent)</p>
              <div className="flex gap-3 w-full">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    onClick={() => setValue(`rating-${index}`, value)}
                    className={`px-4 py-2 border w-full ${
                      watch(`rating-${index}`) === value
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                    }`}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              {errors[`rating-${index}`] && (
                <p className="text-red-500 text-sm mt-2">
                  {/* @ts-ignore */}
                  {errors[`rating-${index}`]?.message}
                </p>
              )}
            </div>
          </Card>
        ))}

        <div className="flex w-full justify-end gap-4 mt-4">
          <FormButton
            disabled={submitLoading || updateLoading}
            loading={submitLoading || updateLoading}
            type="submit"
            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-secondary transition duration-300 ease-in-out"
          >
            {isEditing ? "Update Score" : "Submit Score"}
          </FormButton>
        </div>
      </form>
    </Card>
  );
};

const getColor = (rating: number): string => {
  switch (rating) {
    case 1:
      return "#FECDCA"; // Red - Poor
    case 2:
      return "#F5DEA2"; // Light Orange - Fair
    case 3:
      return "#F2BB31"; // Yellow - Good
    case 4:
      return "#BCFBAE"; // Light Green - Very Good
    case 5:
      return "#8DF384"; // Green - Excellent
    default:
      return "#CCC";
  }
};

const ratingSections = [
  {
    title: "1. Relevant Experience",
    description: "Has done similar work previously (nature of task)",
    field: "relevant_experience",
  },
  {
    title: "2. Project Management Understanding",
    description: "Understands project management and the potential task(s)",
    field: "project_management",
  },
  {
    title: "3. Recent Experience",
    description: "Experience is recent (2-3 years)",
    field: "recent_experience",
  },
  {
    title: "4. Comparable Projects",
    description: "Worked with projects comparable to the AHNI (budget and complexity)",
    field: "comparable_projects",
  },
  {
    title: "5. Communication Skills",
    description: "Excellent Communication Skills",
    field: "communication_skills",
  },
  {
    title: "6. Technical Skill",
    description: "Relevant Technical Skill",
    field: "technical_skill",
  },
  {
    title: "7. Relevant Qualification",
    description: "Qualifications are relevant to the consultancy",
    field: "relevant_qualification",
  },
  {
    title: "8. Academic Credentials",
    description: "Strong academic credentials",
    field: "academic_credentials",
  },
  {
    title: "9. Timeline Management",
    description: "Demonstrated ability to manage the project/consultancy timelines",
    field: "timeline_management",
  },
  {
    title: "10. Proven Toolset and Framework",
    description: "Proven toolset and framework",
    field: "toolset_framework",
  },
];

export default ConsultancyScoreCard;
