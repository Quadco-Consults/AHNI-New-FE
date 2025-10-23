"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import Card from "components/Card";
import DataTable from "components/Table/DataTable";
import { Loading } from "components/Loading";
import { useGetInterviews } from "@/features/hr/controllers/hrInterviewController";
import { JobAdvertisement } from "@/features/hr/types/job-advertisement";
import Link from "next/link";
import EyeIcon from "components/icons/EyeIcon";
import { formatDate } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";

interface MyInterviewData {
  id: string;
  candidate_name: string;
  position_applied: string;
  date_of_interview: string;
  myScore?: number;
  myPercentage?: number;
  hasSubmittedScore: boolean;
  application?: any;
  // Score breakdown
  appearance_rating?: number;
  communication_rating?: number;
  teamwork_rating?: number;
  ethics_rating?: number;
  analytical_rating?: number;
  knowledge_rating?: number;
  experience_rating?: number;
  averageScore?: number;
}

const MyInterviews = ({ id }: JobAdvertisement) => {
  // Get all interviews for this advertisement
  const { data: interviewsData, isLoading } = useGetInterviews({
    id: id || "",
    size: 100,
  });

  // Get current user from localStorage or auth context
  const getCurrentUserId = () => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        return user.id || user.user_id;
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  // Filter interviews where current user was an interviewer and extract their scores
  const myInterviews: MyInterviewData[] = ((interviewsData?.data as any)?.results || [])
    .map((interview: any) => {
      // For committee interviews, check if current user has submitted a score (or has a score entry)
      // The interviewer_scores array contains all scores from all interviewers
      let isInInterviewerScores = false;
      if (interview.interviewer_scores && Array.isArray(interview.interviewer_scores)) {
        isInInterviewerScores = interview.interviewer_scores.some((score: any) => {
          const scoreInterviewerId = typeof score.interviewer === 'string'
            ? score.interviewer
            : score.interviewer?.id;
          return scoreInterviewerId === currentUserId;
        });
      }

      // Also check the main interviewer field (for single-interviewer interviews)
      const interviewerId = typeof interview.interviewer === 'string'
        ? interview.interviewer
        : interview.interviewer?.id;

      const isInterviewer = isInInterviewerScores || interviewerId === currentUserId;

      if (!isInterviewer) return null;

      // Find the current user's score in the scores array
      // Handle both string ID and object with id property
      const myScore = (interview.scores || interview.interviewer_scores || []).find(
        (score: any) => {
          const scoreInterviewerId = typeof score.interviewer === 'string'
            ? score.interviewer
            : score.interviewer?.id;

          return score.interviewer_id === currentUserId || scoreInterviewerId === currentUserId;
        }
      );

      // Calculate average score from individual ratings
      const ratings = [
        myScore?.appearance_rating || 0,
        myScore?.communication_rating || 0,
        myScore?.teamwork_rating || 0,
        myScore?.ethics_rating || 0,
        myScore?.analytical_rating || 0,
        myScore?.knowledge_rating || 0,
        myScore?.experience_rating || 0,
      ];
      const totalScore = ratings.reduce((sum, rating) => sum + rating, 0);
      const averageScore = totalScore / 7;

      return {
        id: interview.id,
        candidate_name: interview.candidate_name || interview.application_details?.applicant_name || "N/A",
        position_applied: interview.position_applied || interview.application_details?.position || "N/A",
        date_of_interview: interview.date_of_interview || interview.start_date,
        myScore: myScore?.total_score || totalScore,
        myPercentage: myScore?.percentage_score || ((totalScore / 35) * 100),
        hasSubmittedScore: !!myScore && myScore.status === "SUBMITTED",
        application: interview.application,
        // Individual ratings
        appearance_rating: myScore?.appearance_rating || 0,
        communication_rating: myScore?.communication_rating || 0,
        teamwork_rating: myScore?.teamwork_rating || 0,
        ethics_rating: myScore?.ethics_rating || 0,
        analytical_rating: myScore?.analytical_rating || 0,
        knowledge_rating: myScore?.knowledge_rating || 0,
        experience_rating: myScore?.experience_rating || 0,
        averageScore: averageScore,
      };
    })
    .filter(Boolean) as MyInterviewData[];

  // Separate completed and pending interviews
  const completedInterviews = myInterviews.filter((i) => i.hasSubmittedScore);
  const pendingInterviews = myInterviews.filter((i) => !i.hasSubmittedScore);

  const columns: ColumnDef<MyInterviewData>[] = [
    {
      header: "Candidate Name",
      accessorKey: "candidate_name",
      size: 250,
      cell: ({ row }) => (
        <p className="font-medium">{row.original.candidate_name}</p>
      ),
    },
    {
      header: "Position Applied",
      accessorKey: "position_applied",
      size: 200,
      cell: ({ row }) => <p>{row.original.position_applied}</p>,
    },
    {
      header: "Interview Date",
      accessorKey: "date_of_interview",
      size: 150,
      cell: ({ row }) => (
        <p>
          {row.original.date_of_interview
            ? formatDate(new Date(row.original.date_of_interview), "dd MMM, yyyy")
            : "N/A"}
        </p>
      ),
    },
    {
      header: "My Score",
      accessorKey: "myScore",
      size: 120,
      cell: ({ row }) => {
        const score = Number(row.original.myScore) || 0;
        return (
          <Badge
            className={`px-3 py-1 ${
              row.original.hasSubmittedScore ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {score} / 35
          </Badge>
        );
      },
    },
    {
      header: "My Percentage",
      accessorKey: "myPercentage",
      size: 150,
      cell: ({ row }) => {
        const percentage = Number(row.original.myPercentage) || 0;
        return (
          <Badge
            className={`px-3 py-1 text-white ${
              percentage >= 80
                ? "bg-green-500"
                : percentage >= 60
                ? "bg-blue-500"
                : percentage >= 40
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >
            {Number(percentage || 0).toFixed(1)}%
          </Badge>
        );
      },
    },
    {
      header: "Status",
      accessorKey: "hasSubmittedScore",
      size: 120,
      cell: ({ row }) => (
        <Badge
          className={`px-3 py-1 ${
            row.original.hasSubmittedScore
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.original.hasSubmittedScore ? "Completed" : "Pending"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      size: 100,
      cell: ({ row }) => (
        <Link href={`/dashboard/hr/interviews/${row.original.id}/score`}>
          <Button
            className="flex items-center gap-2"
            variant="ghost"
            size="sm"
          >
            <EyeIcon />
            {row.original.hasSubmittedScore ? "View Score" : "Submit Score"}
          </Button>
        </Link>
      ),
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">My Interviews</h2>
          <p className="text-sm text-gray-600">
            Showing {myInterviews.length} interview(s) where you are an interviewer
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {completedInterviews.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {pendingInterviews.length}
            </p>
          </div>
        </div>
      </div>

      <div className="my-3 border" />

      {myInterviews.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500">
            You have not been assigned as an interviewer for any applicants in this advertisement
          </p>
        </div>
      ) : (
        <>
          {/* Completed Interviews - Score Analysis */}
          {completedInterviews.length > 0 && (
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  COMPLETED INTERVIEWS - SCORE ANALYSIS
                </h3>
                <p className="text-sm text-gray-600">
                  📅 Scheduled: {myInterviews.length} | ✅ Completed: {completedInterviews.length}
                </p>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Application Name</TableHead>
                      <TableHead className="text-center font-bold">Appearance</TableHead>
                      <TableHead className="text-center font-bold">Communication</TableHead>
                      <TableHead className="text-center font-bold">Teamwork</TableHead>
                      <TableHead className="text-center font-bold">Ethics</TableHead>
                      <TableHead className="text-center font-bold">Analytical</TableHead>
                      <TableHead className="text-center font-bold">Knowledge</TableHead>
                      <TableHead className="text-center font-bold">Experience</TableHead>
                      <TableHead className="text-center font-bold bg-blue-50">Average</TableHead>
                      <TableHead className="text-center font-bold bg-green-50">Percentage</TableHead>
                      <TableHead className="text-center font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedInterviews.map((interview) => (
                      <TableRow key={interview.id}>
                        <TableCell className="font-medium">
                          {interview.candidate_name}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{interview.appearance_rating || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{interview.communication_rating || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{interview.teamwork_rating || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{interview.ethics_rating || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{interview.analytical_rating || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{interview.knowledge_rating || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{interview.experience_rating || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-center bg-blue-50">
                          <Badge className="bg-blue-500 text-white">
                            {Number(interview.averageScore || 0).toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center bg-green-50">
                          <Badge
                            className={`text-white ${
                              (interview.myPercentage || 0) >= 80
                                ? "bg-green-500"
                                : (interview.myPercentage || 0) >= 60
                                ? "bg-blue-500"
                                : (interview.myPercentage || 0) >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          >
                            {Number(interview.myPercentage || 0).toFixed(2)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/hr/interviews/${interview.id}/score`}>
                            <Button variant="ghost" size="sm">
                              <EyeIcon />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}

          {/* Pending Interviews */}
          {pendingInterviews.length > 0 && (
            <Card className="mt-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">PENDING INTERVIEWS</h3>
                <p className="text-sm text-gray-600">
                  ⏳ You have {pendingInterviews.length} pending interview(s) to complete
                </p>
              </div>

              <DataTable
                // @ts-ignore
                data={pendingInterviews}
                columns={columns}
                isLoading={false}
              />
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default MyInterviews;
