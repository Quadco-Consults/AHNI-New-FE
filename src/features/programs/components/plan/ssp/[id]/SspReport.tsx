"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetSingleSupervisionPlan } from "@/features/programs/controllers/supervisionPlanController";
import { useGetAllSupervisionPlanReviews } from "@/features/programs/controllers/supervisionPlanReviewController";
import { LoadingSpinner } from "components/Loading";
import { Button } from "components/ui/button";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";

const SspReport = () => {
  const { id } = useParams();
  const router = useRouter();
  const reportRef = useRef<HTMLDivElement>(null);

  const { data: supervisionPlan, isLoading: isPlanLoading } =
    useGetSingleSupervisionPlan(id as string, !!id);

  const { data: planReview, isLoading: isReviewLoading } =
    useGetAllSupervisionPlanReviews(
      id ? { planId: id as string } : { planId: "" }
    );

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `SSP_Report_${supervisionPlan?.data?.facility?.name}_${supervisionPlan?.data?.month}_${supervisionPlan?.data?.year}`,
  });

  const handleDownloadPDF = () => {
    handlePrint();
  };

  const goBack = () => {
    router.back();
  };

  if (isPlanLoading || isReviewLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const plan = supervisionPlan?.data;
  const reviewSubmissions = planReview?.data?.results || [];
  const currentLevel = plan?.current_approval_level || 1;
  const approvals = plan?.approvals || [];

  // Get the latest review submission
  const latestReview = reviewSubmissions[0];
  const questionResponses = latestReview?.reviews || [];
  const documents = latestReview?.documents || [];
  const remediationPlan = latestReview?.remediation_plan;
  const isAgreeOnVisitPlan = latestReview?.is_agree_on_visit_plan;
  const submissionDateTime = latestReview?.submission_datetime;
  const submittedBy = latestReview?.user;

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

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
            INTEGRATED FACILITY VISIT CHECKLIST
          </h1>
          <p className="text-sm font-semibold">
            SUPPORTIVE SUPERVISION PLAN
          </p>
        </div>

        {/* Facility Information Table */}
        <table className="w-full border-2 border-black text-sm">
          <tbody>
            <tr>
              <td className="border border-black px-3 py-2 font-semibold w-1/4 bg-gray-100">Facility:</td>
              <td className="border border-black px-3 py-2" colSpan={3}>{plan?.facility?.name}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">State:</td>
              <td className="border border-black px-3 py-2">{plan?.facility?.state}</td>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">LGA:</td>
              <td className="border border-black px-3 py-2">{plan?.facility?.lga}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Month:</td>
              <td className="border border-black px-3 py-2">{plan?.month}</td>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Year:</td>
              <td className="border border-black px-3 py-2">{plan?.year}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-2 font-semibold bg-gray-100">Visit Date:</td>
              <td className="border border-black px-3 py-2" colSpan={3}>
                {new Date(plan?.visit_date || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Team Composition Table */}
        <div className="mt-6">
          <h3 className="font-bold text-sm mb-2 uppercase">Supervision Team Composition</h3>
          <table className="w-full border-2 border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-left">S/N</th>
                <th className="border border-black px-3 py-2 text-left">Name</th>
                <th className="border border-black px-3 py-2 text-left">Designation</th>
                <th className="border border-black px-3 py-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {plan?.team_members?.map((member: any, index: number) => (
                <tr key={member.id}>
                  <td className="border border-black px-3 py-2">{index + 1}</td>
                  <td className="border border-black px-3 py-2">
                    {member.first_name} {member.last_name}
                  </td>
                  <td className="border border-black px-3 py-2">
                    {typeof member.department === "string"
                      ? member.department
                      : member.department?.name || "-"}
                  </td>
                  <td className="border border-black px-3 py-2 text-xs">{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Evaluation Checklist */}
        {questionResponses && questionResponses.length > 0 && (
          <div className="mt-6 page-break-before">
            <h3 className="font-bold text-sm mb-2 uppercase">Facility Evaluation Checklist</h3>

            {(() => {
              // Group reviews by evaluation category
              const groupedReviews = questionResponses.reduce((acc: any, review: any) => {
                const category = review.objective?.evaluation_category?.name || "Uncategorized";
                if (!acc[category]) acc[category] = [];
                acc[category].push(review);
                return acc;
              }, {});

              let globalIndex = 1;

              return Object.entries(groupedReviews).map(([category, categoryReviews]: [string, any], catIdx: number) => (
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
                        <th className="border border-black px-2 py-2 text-left">Checklist Item</th>
                        <th className="border border-black px-2 py-2 text-center w-16">Yes</th>
                        <th className="border border-black px-2 py-2 text-center w-16">No</th>
                        <th className="border border-black px-2 py-2 text-left w-1/3">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryReviews.map((review: any, idx: number) => {
                        const itemNumber = `${catIdx + 1}.${idx + 1}`;
                        return (
                          <tr key={review.id}>
                            <td className="border border-black px-2 py-2 font-medium">{itemNumber}</td>
                            <td className="border border-black px-2 py-2">
                              {review.objective?.name || review.objective}
                            </td>
                            <td className="border border-black px-2 py-2 text-center">
                              {review.is_selected ? "✓" : ""}
                            </td>
                            <td className="border border-black px-2 py-2 text-center">
                              {!review.is_selected ? "✓" : ""}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {review.comment || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ));
            })()}

            {/* Remediation Plan Section */}
            {remediationPlan && (
              <div className="mt-6 page-break-inside-avoid">
                <h4 className="font-bold text-sm mb-2">REMEDIATION PLAN</h4>
                <div className="border-2 border-black px-3 py-3 min-h-[80px] text-sm">
                  {remediationPlan}
                </div>
              </div>
            )}

            {/* Visit Plan Agreement */}
            {isAgreeOnVisitPlan !== undefined && (
              <div className="mt-4">
                <table className="w-full border-2 border-black text-sm">
                  <tbody>
                    <tr>
                      <td className="border border-black px-3 py-2 font-semibold bg-gray-100 w-1/3">
                        Agreement on Visit Plan:
                      </td>
                      <td className="border border-black px-3 py-2">
                        {isAgreeOnVisitPlan ? "✓ YES" : "✗ NO"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Approval Workflow */}
        <div className="mt-8 page-break-before">
          <h3 className="font-bold text-sm mb-2 uppercase">Approval Workflow</h3>
          <table className="w-full border-2 border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-left">Level</th>
                <th className="border border-black px-3 py-2 text-left">Approver</th>
                <th className="border border-black px-3 py-2 text-center">Status</th>
                <th className="border border-black px-3 py-2 text-left">Comments</th>
                <th className="border border-black px-3 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {/* Level 1 */}
              {plan?.level1_approver && (
                <tr>
                  <td className="border border-black px-3 py-2 font-semibold">Level 1</td>
                  <td className="border border-black px-3 py-2">
                    {plan.level1_approver.first_name} {plan.level1_approver.last_name}
                  </td>
                  <td className="border border-black px-3 py-2 text-center">
                    {approvals.find((a) => a.level === 1)?.status || "PENDING"}
                  </td>
                  <td className="border border-black px-3 py-2 text-xs">
                    {approvals.find((a) => a.level === 1)?.comments || "-"}
                  </td>
                  <td className="border border-black px-3 py-2 text-xs">
                    {approvals.find((a) => a.level === 1)?.approval_date
                      ? new Date(approvals.find((a) => a.level === 1)?.approval_date || "").toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              )}
              {/* Level 2 */}
              {plan?.level2_approver && (
                <tr>
                  <td className="border border-black px-3 py-2 font-semibold">Level 2</td>
                  <td className="border border-black px-3 py-2">
                    {plan.level2_approver.first_name} {plan.level2_approver.last_name}
                  </td>
                  <td className="border border-black px-3 py-2 text-center">
                    {approvals.find((a) => a.level === 2)?.status || "PENDING"}
                  </td>
                  <td className="border border-black px-3 py-2 text-xs">
                    {approvals.find((a) => a.level === 2)?.comments || "-"}
                  </td>
                  <td className="border border-black px-3 py-2 text-xs">
                    {approvals.find((a) => a.level === 2)?.approval_date
                      ? new Date(approvals.find((a) => a.level === 2)?.approval_date || "").toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              )}
              {/* Level 3 */}
              {plan?.level3_approver && (
                <tr>
                  <td className="border border-black px-3 py-2 font-semibold">Level 3</td>
                  <td className="border border-black px-3 py-2">
                    {plan.level3_approver.first_name} {plan.level3_approver.last_name}
                  </td>
                  <td className="border border-black px-3 py-2 text-center">
                    {approvals.find((a) => a.level === 3)?.status || "PENDING"}
                  </td>
                  <td className="border border-black px-3 py-2 text-xs">
                    {approvals.find((a) => a.level === 3)?.comments || "-"}
                  </td>
                  <td className="border border-black px-3 py-2 text-xs">
                    {approvals.find((a) => a.level === 3)?.approval_date
                      ? new Date(approvals.find((a) => a.level === 3)?.approval_date || "").toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Signature Section */}
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
              {/* Assessor */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold">Assessor</td>
                <td className="border border-black px-3 py-2">
                  {submittedBy
                    ? `${submittedBy.first_name} ${submittedBy.last_name}`
                    : "_______________________"}
                </td>
                <td className="border border-black px-3 py-2">
                  {submittedBy?.department
                    ? typeof submittedBy.department === "string"
                      ? submittedBy.department
                      : (submittedBy.department as any)?.name || "_______________________"
                    : "_______________________"}
                </td>
                <td className="border border-black px-3 py-2 h-16">
                  _______________________
                </td>
                <td className="border border-black px-3 py-2">
                  {submissionDateTime
                    ? new Date(submissionDateTime).toLocaleDateString()
                    : "_______________________"}
                </td>
              </tr>
              {/* Facility CQI Lead */}
              <tr>
                <td className="border border-black px-3 py-2 font-semibold">Facility CQI Lead</td>
                <td className="border border-black px-3 py-2">
                  {plan?.facility?.contact_person || "_______________________"}
                </td>
                <td className="border border-black px-3 py-2">
                  {plan?.facility?.postion || "_______________________"}
                </td>
                <td className="border border-black px-3 py-2 h-16">
                  _______________________
                </td>
                <td className="border border-black px-3 py-2">
                  _______________________
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t-2 border-black text-center text-xs text-gray-600">
          <p>Report Generated: {new Date().toLocaleString()}</p>
          <p className="mt-1 font-semibold">
            Supportive Supervision Plan Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default SspReport;
