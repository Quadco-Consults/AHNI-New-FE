"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, FileText, Award, TrendingUp, AlertCircle, CheckCircle2, XCircle, FileCheck } from "lucide-react";
import { useGetSingleAssessment } from "@/features/contracts-grants/controllers/preAwardAssessmentController";
import Link from "next/link";
import { Loading } from "@/components/Loading";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "@tanstack/react-query";

export default function AssessmentDetailView() {
  const params = useParams();
  const submissionId = params?.id as string;
  const assessmentId = params?.assessmentId as string;

  const { data: assessmentData, isLoading, error } = useGetSingleAssessment(assessmentId);

  // Fetch the submission data to get the assessment forms
  const { data: submissionData, isLoading: isLoadingSubmission } = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: async () => {
      const response = await AxiosWithToken.get(`/contract-grants/sub-grants/submissions/${submissionId}/`);
      return response.data;
    },
    enabled: !!submissionId,
  });

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "LOW":
        return <Badge className="bg-green-100 text-green-700">Low Risk</Badge>;
      case "MEDIUM":
        return <Badge className="bg-yellow-100 text-yellow-700">Medium Risk</Badge>;
      case "HIGH":
        return <Badge className="bg-orange-100 text-orange-700">High Risk</Badge>;
      case "EXTREMELY_HIGH":
        return <Badge className="bg-red-100 text-red-700">Extremely High Risk</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-600 text-white"><CheckCircle2 size={14} className="mr-1" />Completed</Badge>;
      case "DRAFT":
        return <Badge className="bg-gray-400 text-white"><FileText size={14} className="mr-1" />Draft</Badge>;
      default:
        return <Badge className="bg-gray-400 text-white">{status}</Badge>;
    }
  };

  const getRatingIcon = (ratingType: string) => {
    const rating = ratingType?.toUpperCase();
    switch (rating) {
      case "YES":
      case "LOW":
        return <CheckCircle2 className="text-green-600" size={20} />;
      case "NO":
      case "HIGH":
        return <XCircle className="text-red-600" size={20} />;
      case "MED":
      case "MEDIUM":
        return <AlertCircle className="text-orange-500" size={20} />;
      case "NA":
        return <AlertCircle className="text-gray-400" size={20} />;
      default:
        return null;
    }
  };

  const getRatingBadgeColor = (ratingType: string) => {
    const rating = ratingType?.toUpperCase();
    switch (rating) {
      case "LOW":
        return "bg-green-100 text-green-700";
      case "MED":
      case "MEDIUM":
        return "bg-orange-100 text-orange-700";
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "NA":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getQuestionScore = (question: any, scale: any) => {
    const rating = question.answer?.rating_type?.toLowerCase();

    if (!rating || !scale) return 0;

    // Map rating type to score based on rating scale
    switch (rating) {
      case 'na':
        return scale.na || 0;
      case 'low':
        return scale.low || 0;
      case 'med':
      case 'medium':
        return scale.med || 1;
      case 'high':
        return scale.high || 2;
      default:
        return 0;
    }
  };

  const calculateCategoryScore = (questions: any[], scale: any) => {
    return questions.reduce((total, q) => total + getQuestionScore(q, scale), 0);
  };

  if (isLoading || isLoadingSubmission) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <XCircle className="text-red-500" size={48} />
        <p className="text-red-500">Error loading assessment details</p>
        <p className="text-sm text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (!assessmentData?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <FileText className="text-gray-400" size={48} />
        <p className="text-gray-500">Assessment not found</p>
      </div>
    );
  }

  const assessment = assessmentData.data;
  const submission = submissionData?.data;

  // Try to get forms from assessment_submission first, then from assessment_data
  let forms = assessment.assessment_submission?.forms || [];
  let ratingScale = assessment.assessment_submission?.rating_scale;

  // If forms is empty, try to get it from the submission data
  if (forms.length === 0 && submission) {
    forms = submission.assessment_forms || submission.forms || [];
    ratingScale = ratingScale || submission.rating_scale;
  }

  // DEBUG: Log the data structure
  console.log("=== ASSESSMENT DEBUG ===");
  console.log("Full Assessment:", JSON.stringify(assessment, null, 2));
  console.log("Submission Data:", JSON.stringify(submission, null, 2));
  console.log("Assessment Submission:", assessment.assessment_submission);
  console.log("Forms from assessment:", assessment.assessment_submission?.forms);
  console.log("Forms final:", forms);
  console.log("Forms length:", forms.length);
  if (forms.length > 0) {
    console.log("First form structure:", JSON.stringify(forms[0], null, 2));
    console.log("Questions in first form:", forms[0]?.questions);
  }
  console.log("======================");

  // Calculate scores by assessment type
  const technicalForms = forms.filter((form: any) =>
    form.category_name?.toLowerCase().includes('programming') ||
    form.category_name?.toLowerCase().includes('monitoring') ||
    form.category_name?.toLowerCase().includes('technical') ||
    form.category_name?.toLowerCase().includes('capacity')
  );

  const financialForms = forms.filter((form: any) =>
    form.category_name?.toLowerCase().includes('financial') ||
    form.category_name?.toLowerCase().includes('accounting') ||
    form.category_name?.toLowerCase().includes('procurement') ||
    form.category_name?.toLowerCase().includes('internal control')
  );

  const technicalScore = technicalForms.reduce((total: number, form: any) =>
    total + calculateCategoryScore(form.questions, ratingScale), 0
  );

  const financialScore = financialForms.reduce((total: number, form: any) =>
    total + calculateCategoryScore(form.questions, ratingScale), 0
  );

  const technicalQuestionCount = technicalForms.reduce((total: number, form: any) =>
    total + (form.questions?.length || 0), 0
  );

  const financialQuestionCount = financialForms.reduce((total: number, form: any) =>
    total + (form.questions?.length || 0), 0
  );

  return (
    <div className="w-full flex flex-col gap-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Submission
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Assessment Details</h1>
          <p className="text-gray-600 mt-1">
            Assessed on {new Date(assessment.assessed_date || assessment.created_datetime).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(assessment.status)}
          {getRiskLevelBadge(assessment.risk_level)}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total Risk Score */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-purple-200 rounded-full mb-3">
              <Award className="text-purple-700" size={28} />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Total Risk Score
            </h3>
            <div className="text-5xl font-bold text-purple-700 mb-1">{assessment.total_score}</div>
            <p className="text-xs text-gray-600">Combined Assessment</p>
          </div>
        </Card>

        {/* Technical Assessment Score */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-blue-200 rounded-full mb-3">
              <FileText className="text-blue-700" size={28} />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Technical Capacity
            </h3>
            <div className="text-5xl font-bold text-blue-700 mb-1">{technicalScore}</div>
            <p className="text-xs text-gray-600">{technicalQuestionCount} questions assessed</p>
          </div>
        </Card>

        {/* Financial Assessment Score */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-green-200 rounded-full mb-3">
              <TrendingUp className="text-green-700" size={28} />
            </div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Financial Pre-Award
            </h3>
            <div className="text-5xl font-bold text-green-700 mb-1">{financialScore}</div>
            <p className="text-xs text-gray-600">{financialQuestionCount} questions assessed</p>
          </div>
        </Card>
      </div>

      {/* Note about scoring */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-1" size={20} />
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-blue-800 mb-1">How Risk Scoring Works:</p>
            <p>Lower scores indicate better performance and lower risk. Each question is rated based on the organization's response, with higher risk answers receiving more points.</p>
          </div>
        </div>
      </Card>

      {/* Rating Scale Reference */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-amber-600 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Rating Scale</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">N/A:</span>
                <span className="ml-2 text-gray-600">{ratingScale?.na || 0} points</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Low Risk:</span>
                <span className="ml-2 text-gray-600">{ratingScale?.low || 0} points</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Medium Risk:</span>
                <span className="ml-2 text-gray-600">{ratingScale?.med || 1} points</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">High Risk:</span>
                <span className="ml-2 text-gray-600">{ratingScale?.high || 2} points</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* No Assessment Data Message */}
      {forms.length === 0 && (
        <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
                <FileText className="text-orange-600" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Assessment Form Data Available
              </h3>
              <p className="text-gray-600 mb-6">
                This assessment record exists but does not contain the detailed question-by-question responses
                from the technical and financial pre-award assessments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-orange-200 mb-6 text-left">
              <h4 className="font-semibold text-gray-800 mb-3">Assessment Status:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-semibold">{assessment.status}</span>
                </div>
                <div>
                  <span className="text-gray-600">Risk Level:</span>
                  <span className="ml-2">{getRiskLevelBadge(assessment.calculated_risk_level)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Score:</span>
                  <span className="ml-2 font-semibold">{assessment.total_score}</span>
                </div>
                <div>
                  <span className="text-gray-600">Assessed Date:</span>
                  <span className="ml-2 text-gray-700">
                    {new Date(assessment.assessed_date || assessment.created_datetime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 text-left">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                What happened?
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>The assessment was marked as completed but the form responses were not saved</li>
                <li>This could be due to a system error during submission</li>
                <li>The assessment may need to be redone to capture the detailed responses</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/preaward-assessment?type=technical`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileCheck size={18} className="mr-2" />
                  Complete Technical Assessment
                </Button>
              </Link>
              <Link href={`/dashboard/c-and-g/sub-grant/awards/submission/${submissionId}/preaward-assessment?type=financial`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Award size={18} className="mr-2" />
                  Complete Financial Assessment
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Assessment Categories */}
      <div className="space-y-6">
        {forms.map((form: any, formIndex: number) => {
          const categoryScore = calculateCategoryScore(form.questions, ratingScale);
          const totalQuestions = form.questions?.length || 0;

          // Determine if this is technical or financial based on category name
          const isTechnical = form.category_name?.toLowerCase().includes('programming') ||
                             form.category_name?.toLowerCase().includes('monitoring') ||
                             form.category_name?.toLowerCase().includes('technical') ||
                             form.category_name?.toLowerCase().includes('capacity');

          const isFinancial = form.category_name?.toLowerCase().includes('financial') ||
                             form.category_name?.toLowerCase().includes('accounting') ||
                             form.category_name?.toLowerCase().includes('procurement') ||
                             form.category_name?.toLowerCase().includes('internal control');

          const headerColor = isTechnical
            ? 'from-blue-50 to-blue-100 border-l-4 border-l-blue-600'
            : isFinancial
            ? 'from-green-50 to-green-100 border-l-4 border-l-green-600'
            : 'from-gray-50 to-gray-100';

          const assessmentType = isTechnical ? 'Technical Capacity' : isFinancial ? 'Financial Pre-Award' : '';

          return (
            <Card key={formIndex} className="overflow-hidden shadow-lg">
              <div className={`bg-gradient-to-r ${headerColor} p-5 border-b`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {assessmentType && (
                      <div className="mb-2">
                        <Badge className={isTechnical ? "bg-blue-600" : "bg-green-600"}>
                          {assessmentType}
                        </Badge>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-800">{form.category_name}</h3>
                    {form.category_description && (
                      <p className="text-sm text-gray-600 mt-1">{form.category_description}</p>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                      {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-700">{categoryScore}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Risk Points</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white">
                {/* Questions Table Header */}
                <div className="mb-4 pb-3 border-b-2 border-gray-200">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    <div className="col-span-1">#</div>
                    <div className="col-span-6">Question & Answer</div>
                    <div className="col-span-2 text-center">Risk Rating</div>
                    <div className="col-span-3 text-right">Score</div>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3">
                  {form.questions?.map((question: any, qIndex: number) => {
                    const questionScore = getQuestionScore(question, ratingScale);
                    const ratingType = question.answer?.rating_type || "N/A";

                    return (
                      <div
                        key={qIndex}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-gray-300 transition-all"
                      >
                        <div className="grid grid-cols-12 gap-4 items-start">
                          {/* Question Number */}
                          <div className="col-span-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                              {qIndex + 1}
                            </div>
                          </div>

                          {/* Question & Answer */}
                          <div className="col-span-6">
                            <p className="font-semibold text-gray-800 mb-2 leading-relaxed">
                              {question.question}
                            </p>

                            {/* Display text answer */}
                            {question.answer?.text && (
                              <div className="bg-white border-l-4 border-blue-500 rounded p-3 shadow-sm">
                                <div className="flex items-start gap-2">
                                  <CheckCircle2 className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                                  <div>
                                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">
                                      Answer Provided:
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {question.answer.text}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Display boolean answer */}
                            {question.answer?.boolean !== undefined && !question.answer?.text && (
                              <div className="bg-white border-l-4 border-blue-500 rounded p-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                  {question.answer.boolean ? (
                                    <CheckCircle2 className="text-green-600" size={16} />
                                  ) : (
                                    <XCircle className="text-red-600" size={16} />
                                  )}
                                  <div>
                                    <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">
                                      Answer:
                                    </p>
                                    <p className="text-sm font-semibold text-gray-700">
                                      {question.answer.boolean ? "Yes" : "No"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* No answer provided */}
                            {!question.answer?.text && question.answer?.boolean === undefined && (
                              <div className="bg-gray-100 border-l-4 border-gray-400 rounded p-3">
                                <p className="text-xs text-gray-600 italic">No answer provided</p>
                              </div>
                            )}
                          </div>

                          {/* Risk Rating */}
                          <div className="col-span-2 flex justify-center items-start pt-1">
                            <div className="flex flex-col items-center gap-2">
                              {getRatingIcon(ratingType)}
                              <Badge className={`${getRatingBadgeColor(ratingType)} font-semibold`}>
                                {ratingType}
                              </Badge>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="col-span-3 flex justify-end items-start pt-1">
                            <div className="text-right bg-white rounded-lg border-2 border-gray-300 p-3 min-w-[100px] shadow-sm">
                              <div className="text-3xl font-bold text-gray-800">{questionScore}</div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">
                                Points
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Explanation indicator */}
                        {question.requires_explanation && question.answer?.text && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full inline-flex">
                              <CheckCircle2 size={14} />
                              <span className="font-medium">Explanation provided</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Submission Information */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Assessment ID:</span>
            <span className="ml-2 font-mono text-gray-800">{assessment.id}</span>
          </div>
          <div>
            <span className="text-gray-600">Submission ID:</span>
            <span className="ml-2 font-mono text-gray-800">{typeof assessment.submission === 'string' ? assessment.submission : assessment.submission?.id}</span>
          </div>
          <div>
            <span className="text-gray-600">Created:</span>
            <span className="ml-2 text-gray-800">
              {new Date(assessment.created_datetime).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Last Updated:</span>
            <span className="ml-2 text-gray-800">
              {new Date(assessment.updated_datetime).toLocaleString()}
            </span>
          </div>
          {assessment.assessed_by && (
            <div>
              <span className="text-gray-600">Assessed By:</span>
              <span className="ml-2 text-gray-800">
                {assessment.assessed_by.full_name || assessment.assessed_by.email || "N/A"}
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}