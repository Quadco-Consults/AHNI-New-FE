"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Card from "@/components/Card";
import FormButton from "@/components/FormButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { InterviewScore } from "@/features/hr/types/interview";
import {
  useSubmitInterviewScore,
  useGetMyInterviewScore,
  useUpdateInterviewScore,
} from "@/features/hr/controllers/hrInterviewController";
import { formatDate } from "date-fns";
import { Loading } from "@/components/Loading";

interface InterviewScoreCardProps {
  interviewId: string;
  candidateName: string;
  position: string;
  interviewDate: string;
  onScoreSubmitted?: () => void;
  readOnly?: boolean;
}

const InterviewScoreCard = ({
  interviewId,
  candidateName,
  position,
  interviewDate,
  onScoreSubmitted,
  readOnly = false,
}: InterviewScoreCardProps) => {
  const [totalScore, setTotalScore] = useState(0);
  const [percentageScore, setPercentageScore] = useState(0);

  // Fetch existing score for this interviewer
  const { data: myScoreData, isLoading: scoreLoading } = useGetMyInterviewScore(
    interviewId,
    !readOnly
  );

  const existingScore = myScoreData?.data;
  const isEditing = !!existingScore && existingScore.status === "PENDING";

  const { submitScore, isLoading: submitLoading } =
    useSubmitInterviewScore(interviewId);
  const { updateScore, isLoading: updateLoading } = useUpdateInterviewScore(
    interviewId,
    existingScore?.id || ""
  );

  const form = useForm<Record<string, any>>({
    defaultValues: {
      "rating-0": 0,
      "comments-0": "",
      "rating-1": 0,
      "comments-1": "",
      "rating-2": 0,
      "comments-2": "",
      "rating-3": 0,
      "comments-3": "",
      "rating-4": 0,
      "comments-4": "",
      "rating-5": 0,
      "comments-5": "",
      "rating-6": 0,
      "comments-6": "",
      preferred_candidate: false,
      recommendation: "",
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
      setValue("rating-0", existingScore.appearance_rating || 0);
      setValue("comments-0", existingScore.appearance_comments || "");
      setValue("rating-1", existingScore.communication_rating || 0);
      setValue("comments-1", existingScore.communication_comments || "");
      setValue("rating-2", existingScore.teamwork_rating || 0);
      setValue("comments-2", existingScore.teamwork_comments || "");
      setValue("rating-3", existingScore.ethics_rating || 0);
      setValue("comments-3", existingScore.ethics_comments || "");
      setValue("rating-4", existingScore.analytical_rating || 0);
      setValue("comments-4", existingScore.analytical_comments || "");
      setValue("rating-5", existingScore.knowledge_rating || 0);
      setValue("comments-5", existingScore.knowledge_comments || "");
      setValue("rating-6", existingScore.experience_rating || 0);
      setValue("comments-6", existingScore.experience_comments || "");
      setValue("preferred_candidate", existingScore.preferred_candidate || false);
      setValue("recommendation", existingScore.recommendation || "");
    }
  }, [existingScore, setValue]);

  // Calculate total score in real-time
  useEffect(() => {
    const ratings = ratingSections.map((_, index) =>
      parseInt(watch(`rating-${index}`) || 0)
    );
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    const percentage = (total / 35) * 100;

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
  ]);

  const onSubmit = async (formData: any) => {
    // Validate all ratings are filled
    for (let i = 0; i < ratingSections.length; i++) {
      if (!formData[`rating-${i}`] || formData[`rating-${i}`] === 0) {
        toast.error(`Please rate "${ratingSections[i].title}"`);
        return;
      }
    }

    const scoreData: any = {
      interview: interviewId, // Backend expects 'interview' field (ForeignKey)
      appearance_rating: formData["rating-0"],
      appearance_comments: formData["comments-0"],
      communication_rating: formData["rating-1"],
      communication_comments: formData["comments-1"],
      teamwork_rating: formData["rating-2"],
      teamwork_comments: formData["comments-2"],
      ethics_rating: formData["rating-3"],
      ethics_comments: formData["comments-3"],
      analytical_rating: formData["rating-4"],
      analytical_comments: formData["comments-4"],
      knowledge_rating: formData["rating-5"],
      knowledge_comments: formData["comments-5"],
      experience_rating: formData["rating-6"],
      experience_comments: formData["comments-6"],
      preferred_candidate: formData.preferred_candidate || false,
      recommendation: formData.recommendation,
      status: "SUBMITTED",
    };

    try {
      if (isEditing && existingScore?.id) {
        await updateScore(scoreData);
        toast.success("Your interview score has been updated successfully");
      } else {
        await submitScore(scoreData);
        toast.success("Your interview score has been submitted successfully");
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
            <h2 className="text-xl font-semibold">Interview Evaluation</h2>
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
                {existingScore.total_score || 0} / 35
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
            const ratingField = section.field as keyof InterviewScore;
            const commentsField = section.commentsField as keyof InterviewScore;
            return (
              <Card key={index} className="p-4">
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-gray-600">Rating:</span>
                  <Badge
                    className={`text-white`}
                    style={{ backgroundColor: getColor(existingScore[ratingField] as number || 0) }}
                  >
                    {existingScore[ratingField] || 0} / 5
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Comments:</span>
                  <p className="mt-1">{existingScore[commentsField] || "No comments"}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <div>
            <p className="font-semibold mb-2">Recommendation</p>
            <p>{existingScore.recommendation || "No recommendation provided"}</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={existingScore.preferred_candidate}
              disabled
              readOnly
            />
            <label className="text-sm">Marked as Preferred Candidate</label>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Your" : "Submit Your"} Interview Evaluation
          </h2>
          <p className="text-sm text-gray-600">
            Evaluate the candidate across 7 key criteria
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
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Total Score</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalScore} / 35
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Percentage</p>
            <p className="text-2xl font-bold text-purple-600">
              {percentageScore}%
            </p>
          </div>
        </div>
        {percentageScore > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentageScore}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <Separator className="my-6" />

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Key Rating Scale</h3>
        <Card className="mt-4">
          <Table>
            <TableHeader>
              <TableRow className="border-none">
                <TableCell>Below Average</TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Good</TableCell>
                <TableCell>Very Good</TableCell>
                <TableCell>Outstanding</TableCell>
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-8">
        {ratingSections.map((section, index) => (
          <Card key={index} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <h2 className="font-semibold">{section.title}</h2>
              <p className="text-sm text-gray-600">{section.description}</p>
            </div>
            <div>
              <p className="text-primary text-sm mb-2">Tick as appropriate</p>
              <div className="flex gap-4 w-full">
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
            <div>
              <label htmlFor={`comments-${index}`} className="font-semibold">
                Comments
              </label>
              <Textarea
                id={`comments-${index}`}
                {...register(`comments-${index}`, {
                  required: "Comments are required",
                })}
                required
                rows={4}
                className="mt-2"
                placeholder={`Provide detailed comments about the candidate's ${section.title.toLowerCase()}...`}
              />
            </div>
          </Card>
        ))}

        <Separator />

        <div>
          <label htmlFor="recommendation" className="font-semibold">
            Overall Recommendation
          </label>
          <Textarea
            id="recommendation"
            {...register("recommendation", {
              required: "Recommendation is required",
            })}
            rows={6}
            className="mt-2"
            placeholder="Provide your overall recommendation for this candidate..."
          />
        </div>

        <div>
          <label htmlFor="preferred_candidate" className="flex items-center gap-2">
            <input
              type="checkbox"
              id="preferred_candidate"
              {...register("preferred_candidate")}
            />
            <span className="font-medium">Mark as Preferred Candidate</span>
          </label>
          <p className="text-sm text-gray-600 ml-6 mt-1">
            Check this box if you believe this candidate should be given priority consideration
          </p>
        </div>

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
      return "#FECDCA"; // Red - Below Average
    case 2:
      return "#F5DEA2"; // Light Orange - Average
    case 3:
      return "#F2BB31"; // Yellow - Good
    case 4:
      return "#BCFBAE"; // Light Green - Very Good
    case 5:
      return "#8DF384"; // Green - Outstanding
    default:
      return "#CCC";
  }
};

const ratingSections = [
  {
    title: "Appearance/Corporate Poise",
    description:
      "Appearance and composure in conformity with acceptable standards of the position",
    field: "appearance_rating",
    commentsField: "appearance_comments",
  },
  {
    title: "Oral Communication",
    description:
      "Ability to speak articulately and with clarity displaying good pronunciation and grammar",
    field: "communication_rating",
    commentsField: "communication_comments",
  },
  {
    title: "Supervisory Experience and/or Teamwork",
    description: "Ability to supervise and/or work as a team member",
    field: "teamwork_rating",
    commentsField: "teamwork_comments",
  },
  {
    title: "Work Ethics",
    description:
      "Ability/tendency to maintain AHNI values (excellence, integrity, responsiveness, respect and dedication) and use judgment to execute duties and responsibilities.",
    field: "ethics_rating",
    commentsField: "ethics_comments",
  },
  {
    title: "Analytical thinking",
    description:
      "Capacity to examine and evaluate situations in a logical and rational approach",
    field: "analytical_rating",
    commentsField: "analytical_comments",
  },
  {
    title: "Knowledge of international/regional NGO or local organization issues",
    description:
      "Displayed knowledge/understanding of political, social and ethical issues surrounding health related matters and knowledge of and experience with NGO's interventions.",
    field: "knowledge_rating",
    commentsField: "knowledge_comments",
  },
  {
    title: "Quality/Relevance of Experience",
    description:
      "Determined by the length, variety of positions held, quality of experience, industry type and size relevant to position.",
    field: "experience_rating",
    commentsField: "experience_comments",
  },
];

export default InterviewScoreCard;
