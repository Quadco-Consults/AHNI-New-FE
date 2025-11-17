"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSingleSupervisionEvaluation, useGetEvaluationResponses } from "@/features/programs/controllers/supervisionEvaluationController";
import { useGetSingleSiteVisit } from "@/features/programs/controllers/siteVisitController";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";

const SupervisionEvaluationReport = () => {
  const { id } = useParams();
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  const { data: supervisionEvaluation, isLoading: isEvaluationLoading } =
    useGetSingleSupervisionEvaluation(id as string, !!id);

  const { data: evaluationResponses, isLoading: isResponsesLoading } =
    useGetEvaluationResponses(id as string, !!id);

  // Fetch site visit data for location and facility information
  const { data: siteVisitData, isLoading: isSiteVisitLoading } =
    useGetSingleSiteVisit(supervisionEvaluation?.data?.site_visit_id || "", !!supervisionEvaluation?.data?.site_visit_id);

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `Supervision_Evaluation_Report_${supervisionEvaluation?.data?.facility_name}_${new Date(supervisionEvaluation?.data?.evaluation_date || "").toLocaleDateString("en-US", { month: "short", year: "numeric" })}`,
  });

  const handleDownloadPDF = () => {
    handlePrint();
  };

  const goBack = () => {
    router.back();
  };

  if (isEvaluationLoading || isResponsesLoading || isSiteVisitLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const evaluation = supervisionEvaluation?.data;
  const responses = evaluationResponses?.results || evaluationResponses?.data?.results || [];
  const siteVisit = siteVisitData?.data;

  // Create unified responses - use evaluation_items if responses are empty or missing category info
  const unifiedResponses = (() => {
    // If we have proper responses with category info, use those
    if (responses && responses.length > 0 && responses.some((r: any) => r.category_name)) {
      return responses;
    }

    // Otherwise, convert evaluation_items to response format
    if ((evaluation as any)?.evaluation_items) {
      return (evaluation as any).evaluation_items.map((item: any) => ({
        id: item.id,
        criteria_id: item.criteria,
        criteria_name: item.criteria_name,
        category_name: item.category_name,
        response_value: item.rating === 'true' ? true : false,
        text_response: item.observations,
        comments: item.recommendations,
        rating_value: item.score,
        evidence: item.evidence,
        is_compliant: item.is_compliant
      }));
    }

    return responses; // fallback to original responses
  })();


  // Get location and facility information with fallbacks from site visit
  const facilityName = evaluation?.facility_name ||
                       (evaluation as any)?.site_visit_location ||
                       (siteVisit as any)?.facility_name ||
                       siteVisit?.location_name ||
                       siteVisit?.title ||
                       "Not specified";

  const locationName = evaluation?.location_name ||
                      (evaluation as any)?.site_visit_location ||
                      siteVisit?.location_name ||
                      siteVisit?.title ||
                      "Not specified";

  const evaluatorName = evaluation?.evaluator_name ||
                       (evaluation as any)?.evaluator?.full_name ||
                       (evaluation as any)?.evaluator?.first_name + " " + (evaluation as any)?.evaluator?.last_name ||
                       "Not specified";

  // Get facility representative information
  const facilityRepName = (evaluation as any)?.reviewed_by_name ||
                          (evaluation as any)?.approved_by_name ||
                          (evaluation as any)?.facility_representative?.full_name ||
                          (evaluation as any)?.facility_representative_name ||
                          (siteVisit as any)?.facility_contact_name ||
                          "Not specified";

  const facilityRepDesignation = (evaluation as any)?.reviewed_by_designation ||
                                (evaluation as any)?.approved_by_designation ||
                                (evaluation as any)?.facility_representative?.designation ||
                                (evaluation as any)?.facility_representative?.job_title ||
                                (siteVisit as any)?.facility_contact_designation ||
                                "Facility Manager";

  const facilityRepDate = (evaluation as any)?.reviewed_at ||
                         (evaluation as any)?.approved_at ||
                         evaluation?.evaluation_date ||
                         "Not specified";

  // Debug logging (after all variables are declared)
  console.log("🔍 Report Debug Data:", {
    evaluation: {
      id: evaluation?.id,
      site_visit_id: evaluation?.site_visit_id,
      facility_name: evaluation?.facility_name,
      location_name: evaluation?.location_name,
      evaluator_name: evaluation?.evaluator_name,
      overall_score: evaluation?.overall_score,
      status: evaluation?.status,
      selected_criteria: evaluation?.selected_categories,
      selected_categories: evaluation?.selected_categories,
    },
    responses: {
      originalLength: responses.length,
      unifiedLength: unifiedResponses.length,
    },
    siteVisit: {
      id: siteVisit?.id,
      title: siteVisit?.title,
    },
    computed: {
      facilityName,
      locationName,
      evaluatorName,
      facilityRepName,
      facilityRepDesignation,
      facilityRepDate,
    },
  });

  return (
    <div className="space-y-6">
      {/* Action Buttons - Not printed */}
      <div className="flex justify-between items-center print:hidden">
        <Button
          onClick={goBack}
          variant="outline"
          className="flex gap-2 items-center"
        >
          <ArrowLeft size={16} /> Back
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex gap-2 items-center"
          >
            <Printer size={16} /> Print Report
          </Button>
          <Button
            onClick={handleDownloadPDF}
            className="flex gap-2 items-center"
          >
            <Download size={16} /> Download PDF
          </Button>
        </div>
      </div>

      {/* Printable Report */}
      <div
        ref={reportRef}
        className="bg-white p-8 space-y-6 print:p-12 print:shadow-none"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {/* Header */}
        <div className="text-center border-2 border-black pb-4">
          <h1 className="text-2xl font-bold mb-1">
            SUPERVISION EVALUATION REPORT
          </h1>
          <p className="text-sm font-semibold">
            SUPPORTIVE SUPERVISION EVALUATION
          </p>
        </div>

        {/* Evaluation Information Table */}
        <table className="w-full border-2 border-black text-sm">
          <tbody>
            <tr>
              <td className="border border-black px-3 py-2 font-semibold w-1/4 bg-gray-100">Facility:</td>
              <td className="border border-black px-3 py-2" colSpan={3}>{facilityName}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Location:</td>
              <td className="border border-black px-3 py-2">{locationName}</td>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Evaluator:</td>
              <td className="border border-black px-3 py-2">{evaluatorName}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Evaluation Title:</td>
              <td className="border border-black px-3 py-2" colSpan={3}>{evaluation?.title}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Evaluation Date:</td>
              <td className="border border-black px-3 py-2">{evaluation?.evaluation_date ? new Date(evaluation.evaluation_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) : "-"}</td>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Status:</td>
              <td className="border border-black px-3 py-2">{evaluation?.status}</td>
            </tr>
            {evaluation?.description && (
              <tr>
                <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Description:</td>
                <td className="border border-black px-3 py-2" colSpan={3}>{evaluation.description}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Overall Score Summary */}
        <div className="mt-6">
          <h3 className="font-bold text-sm mb-2 uppercase">Evaluation Summary</h3>
          <table className="w-full border-2 border-black text-sm">
            <tbody>
              <tr>
                <td className="border border-black px-3 py-2 font-semibold bg-gray-100 w-1/4">Overall Score:</td>
                <td className="border border-black px-3 py-2">
                  {evaluation?.overall_score !== null && evaluation?.overall_score !== undefined
                    ? `${Math.round(evaluation.overall_score * 10) / 10}%`
                    : 'Not Available'}
                </td>
                <td className="border border-black px-3 py-2 font-semibold bg-gray-100 w-1/4">Total Responses:</td>
                <td className="border border-black px-3 py-2">{unifiedResponses.length}</td>
              </tr>
              <tr>
                <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Completion Rate:</td>
                <td className="border border-black px-3 py-2">
                  {responses.length > 0
                    ? `${Math.round((responses.filter(r => r.response_value !== null && r.response_value !== undefined).length / responses.length) * 100)}%`
                    : '0%'}
                </td>
                <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Status:</td>
                <td className="border border-black px-3 py-2">{evaluation?.status || 'Not Available'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Evaluation Checklist */}
        {unifiedResponses && unifiedResponses.length > 0 ? (
          <div className="mt-6 page-break-before">
            <h3 className="font-bold text-sm mb-2 uppercase">Evaluation Checklist</h3>

            {(() => {
              // Group unified responses by category
              const groupedResponses = unifiedResponses.reduce((acc: any, response: any) => {
                const category = response.category_name || "Uncategorized";
                if (!acc[category]) acc[category] = [];
                acc[category].push(response);
                return acc;
              }, {});

              return Object.entries(groupedResponses).map(([category, categoryResponses]: [string, any], catIdx: number) => (
                <div key={category} className="mb-6 page-break-inside-avoid">
                  {/* Category Header */}
                  <h4 className="font-bold text-sm bg-gray-200 px-2 py-1 border-2 border-black mb-0">
                    {catIdx + 1}. {category.toUpperCase()}
                  </h4>

                  {/* Checklist Table */}
                  <table className="w-full border-2 border-black border-t-0 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black px-2 py-2 text-left w-12">S/N</th>
                        <th className="border border-black px-2 py-2 text-left">Criteria</th>
                        <th className="border border-black px-2 py-2 text-center w-16">Yes</th>
                        <th className="border border-black px-2 py-2 text-center w-16">No</th>
                        <th className="border border-black px-2 py-2 text-left w-1/3">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryResponses.map((response: any, idx: number) => {
                        const itemNumber = `${catIdx + 1}.${idx + 1}`;
                        // Determine compliance status - could be stored as 'yes'/'no' or boolean
                        const isCompliant = response.compliance_status === 'yes' || response.response_value === true || response.response_value === 'yes';

                        return (
                          <tr key={response.id}>
                            <td className="border border-black px-2 py-2 font-medium">{itemNumber}</td>
                            <td className="border border-black px-2 py-2">
                              {response.criteria_name || response.criteria}
                            </td>
                            <td className="border border-black px-2 py-2 text-center">
                              {isCompliant ? "✓" : ""}
                            </td>
                            <td className="border border-black px-2 py-2 text-center">
                              {!isCompliant ? "✓" : ""}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {response.comments || response.text_response || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ));
            })()}

            {/* Recommendations Section */}
            {evaluation?.recommendations && (
              <div className="mt-6 page-break-inside-avoid">
                <h4 className="font-bold text-sm mb-2">RECOMMENDATIONS</h4>
                <div className="border-2 border-black px-3 py-3 min-h-[80px] text-sm">
                  {evaluation.recommendations}
                </div>
              </div>
            )}

            {/* Action Items Section */}
            {evaluation?.action_items && evaluation.action_items.length > 0 && (
              <div className="mt-6 page-break-inside-avoid">
                <h4 className="font-bold text-sm mb-2">ACTION ITEMS</h4>
                <table className="w-full border-2 border-black text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black px-2 py-2 text-left w-12">S/N</th>
                      <th className="border border-black px-2 py-2 text-left">Description</th>
                      <th className="border border-black px-2 py-2 text-center">Priority</th>
                      <th className="border border-black px-2 py-2 text-left">Assigned To</th>
                      <th className="border border-black px-2 py-2 text-left">Due Date</th>
                      <th className="border border-black px-2 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evaluation.action_items.map((item: any, idx: number) => (
                      <tr key={item.id}>
                        <td className="border border-black px-2 py-2 font-medium">{idx + 1}</td>
                        <td className="border border-black px-2 py-2">{item.description}</td>
                        <td className="border border-black px-2 py-2 text-center">
                          <span className={cn("px-2 py-1 rounded text-xs", {
                            "bg-red-100 text-red-800": item.priority === "HIGH",
                            "bg-yellow-100 text-yellow-800": item.priority === "MEDIUM",
                            "bg-green-100 text-green-800": item.priority === "LOW",
                          })}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="border border-black px-2 py-2">{item.assigned_to_name || "-"}</td>
                        <td className="border border-black px-2 py-2">
                          {item.due_date ? new Date(item.due_date).toLocaleDateString() : "-"}
                        </td>
                        <td className="border border-black px-2 py-2 text-center">{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Follow-up Information */}
            {evaluation?.follow_up_required && (
              <div className="mt-6 page-break-inside-avoid">
                <h4 className="font-bold text-sm mb-2">FOLLOW-UP REQUIREMENTS</h4>
                <table className="w-full border-2 border-black text-sm">
                  <tbody>
                    <tr>
                      <td className="border border-black px-3 py-2 font-semibold bg-gray-100 w-1/4">Follow-up Required:</td>
                      <td className="border border-black px-3 py-2">YES</td>
                    </tr>
                    {evaluation.follow_up_date && (
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Follow-up Date:</td>
                        <td className="border border-black px-3 py-2">
                          {new Date(evaluation.follow_up_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    )}
                    {evaluation.follow_up_notes && (
                      <tr>
                        <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Follow-up Notes:</td>
                        <td className="border border-black px-3 py-2">{evaluation.follow_up_notes}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 page-break-before">
            <h3 className="font-bold text-sm mb-2 uppercase">Evaluation Checklist</h3>
            <div className="border-2 border-black px-4 py-8 text-center text-gray-600">
              <p className="text-sm">
                No evaluation responses available for this report.
              </p>
              <p className="text-xs mt-2">
                This evaluation may not be completed yet or may not have any recorded responses.
              </p>
            </div>
          </div>
        )}

        {/* Category Scores */}
        {evaluation?.category_scores && evaluation.category_scores.length > 0 && (
          <div className="mt-8 page-break-before">
            <h3 className="font-bold text-sm mb-2 uppercase">Category Performance</h3>
            <table className="w-full border-2 border-black text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-3 py-2 text-left">Category</th>
                  <th className="border border-black px-3 py-2 text-center">Questions</th>
                  <th className="border border-black px-3 py-2 text-center">Answered</th>
                  <th className="border border-black px-3 py-2 text-center">Score</th>
                  <th className="border border-black px-3 py-2 text-center">Percentage</th>
                  <th className="border border-black px-3 py-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.category_scores.map((categoryScore: any) => (
                  <tr key={categoryScore.category_id}>
                    <td className="border border-black px-3 py-2 font-semibold">{categoryScore.category_name}</td>
                    <td className="border border-black px-3 py-2 text-center">{categoryScore.total_questions}</td>
                    <td className="border border-black px-3 py-2 text-center">{categoryScore.answered_questions}</td>
                    <td className="border border-black px-3 py-2 text-center">
                      {categoryScore.total_score}/{categoryScore.max_possible_score}
                    </td>
                    <td className="border border-black px-3 py-2 text-center">{categoryScore.percentage_score}%</td>
                    <td className="border border-black px-3 py-2 text-center font-semibold">
                      {categoryScore.grade || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Certification Section */}
        <div className="mt-8 page-break-inside-avoid">
          <h3 className="font-bold text-sm mb-2 uppercase">Certification</h3>
          <table className="w-full border-2 border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-left">Role</th>
                <th className="border border-black px-3 py-2 text-left">Name</th>
                <th className="border border-black px-3 py-2 text-left">Designation</th>
                <th className="border border-black px-3 py-2 text-left">Signature</th>
                <th className="border border-black px-3 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {/* Evaluator */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold">Evaluator</td>
                <td className="border border-black px-3 py-2">
                  {evaluatorName !== "Not specified" ? evaluatorName : "_______________________"}
                </td>
                <td className="border border-black px-3 py-2">
                  Supervision Evaluator
                </td>
                <td className="border border-black px-3 py-2 h-16">
                  _______________________
                </td>
                <td className="border border-black px-3 py-2">
                  {evaluation?.evaluation_date
                    ? new Date(evaluation.evaluation_date).toLocaleDateString()
                    : "_______________________"}
                </td>
              </tr>
              {/* Facility Representative */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold">Facility Representative</td>
                <td className="border border-black px-3 py-2">
                  {facilityRepName !== "Not specified" ? facilityRepName : "_______________________"}
                </td>
                <td className="border border-black px-3 py-2">
                  {facilityRepDesignation !== "Facility Manager" && facilityRepDesignation ? facilityRepDesignation : "_______________________"}
                </td>
                <td className="border border-black px-3 py-2 h-16">
                  _______________________
                </td>
                <td className="border border-black px-3 py-2">
                  {facilityRepDate !== "Not specified" && facilityRepDate
                    ? (typeof facilityRepDate === 'string' && facilityRepDate !== evaluation?.evaluation_date
                        ? new Date(facilityRepDate).toLocaleDateString()
                        : "_______________________")
                    : "_______________________"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t-2 border-black text-center text-xs text-gray-600">
          <p>Report Generated: {new Date().toLocaleString()}</p>
          <p className="mt-1 font-semibold">
            Supervision Evaluation Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupervisionEvaluationReport;