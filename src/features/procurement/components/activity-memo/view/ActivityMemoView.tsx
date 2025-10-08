"use client";

import { useParams, useRouter } from "next/navigation";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { Icon } from "@iconify/react";
import { useGetActivityMemo } from "@/features/procurement/controllers/activityMemoController";
import { format } from "date-fns";
import { useState, useRef } from "react";
import logoPng from "assets/imgs/logo.png";
import GoBack from "components/GoBack";
import ActivityMemoApprovalWorkflow from "@/features/procurement/components/activity-memo/ActivityMemoApprovalWorkflow";
import { useGetUserProfile } from "@/features/auth/controllers/userController";

const ActivityMemoView = () => {
  const params = useParams();
  const router = useRouter();
  const memoId = params?.id as string;
  const printRef = useRef<HTMLDivElement>(null);

  const { data: memoData, isLoading, error, refetch } = useGetActivityMemo(memoId);
  const { data: currentUser } = useGetUserProfile();

  const [currentStage, setCurrentStage] = useState(1); // 1 = Memo, 2 = Expense Breakdown, 3 = Approval Workflow

  // Download as PDF function
  const handleDownloadPDF = () => {
    if (printRef.current) {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon icon="line-md:loading-loop" fontSize={48} className="mx-auto mb-4" />
          <p className="text-gray-600">Loading activity memo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <div className="p-6 text-center">
            <Icon icon="mdi:alert-circle" fontSize={48} className="mx-auto mb-4 text-red-600" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Activity Memo</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!memoData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <div className="p-6 text-center">
            <Icon icon="mdi:file-document-alert-outline" fontSize={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Activity Memo Not Found</h3>
            <p className="text-gray-600 mb-4">The requested activity memo could not be found.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </Card>
      </div>
    );
  }

  const expensesData = memoData.expenses || [];
  const grandTotal = expensesData.reduce((sum, expense) => {
    const cost = typeof expense.total_cost === 'string'
      ? parseFloat(expense.total_cost)
      : (expense.total_cost || 0);
    return sum + (isNaN(cost) ? 0 : cost);
  }, 0);

  return (
    <div className="bg-white p-6 max-w-7xl mx-auto print:p-0 print:max-w-full">
      {/* Back Button and Download Button - Hidden on Print */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <GoBack />
        <Button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Icon icon="solar:download-bold" fontSize={20} />
          Download PDF
        </Button>
      </div>

      <section className="min-h-screen space-y-8 print:space-y-4 print:min-h-0">
        {/* Stage Navigation - Hidden on Print */}
        <div className="flex w-full items-center justify-between gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 shadow-sm print:hidden">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold ${
                currentStage === 1 ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-700'
              }`}>
                1
              </div>
              <span className={`text-base font-medium ${currentStage === 1 ? 'text-blue-700' : 'text-gray-500'}`}>
                Activity Memo
              </span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300"></div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold ${
                currentStage === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className={`text-base font-medium ${currentStage === 2 ? 'text-blue-700' : 'text-gray-500'}`}>
                Expense Breakdown
              </span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300"></div>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold ${
                currentStage === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className={`text-base font-medium ${currentStage === 3 ? 'text-blue-700' : 'text-gray-500'}`}>
                Approval Workflow
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stage Navigation Buttons */}
            {currentStage === 1 && (
              <Button
                onClick={() => setCurrentStage(2)}
                className="flex gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2"
              >
                Next: View Expenses →
              </Button>
            )}

            {currentStage === 2 && (
              <>
                <Button
                  onClick={() => setCurrentStage(1)}
                  variant="outline"
                  className="flex gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-4 py-2"
                >
                  ← Previous: View Memo
                </Button>
                <Button
                  onClick={() => setCurrentStage(3)}
                  className="flex gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2"
                >
                  Next: Approval Workflow →
                </Button>
              </>
            )}

            {currentStage === 3 && (
              <Button
                onClick={() => setCurrentStage(2)}
                variant="outline"
                className="flex gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 px-4 py-2"
              >
                ← Previous: View Expenses
              </Button>
            )}

            <Button
              onClick={() => router.push(`/dashboard/procurement/activity-memo/${memoId}/edit`)}
              variant="outline"
            >
              <Icon icon="solar:pen-bold-duotone" fontSize={18} className="mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Printable Content */}
        <div ref={printRef}>
        {/* Stage 1: Internal Memo Format */}
        {currentStage === 1 && (
          <>
            {/* Memo Header */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 page-break-avoid print:p-4 print:border-0">
              {/* Logo and Title */}
              <div className="flex items-center justify-between mb-8 print:mb-4">
                <img src={(logoPng as any).src || logoPng} alt="logo" width={120} />
                <div className="flex-1 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-black pb-2 inline-block">Internal Memo</h2>
                </div>
                <div className="w-30"></div>
              </div>

              {/* Memo Header Information */}
              <div className="space-y-3 mb-6">
                {/* To */}
                <div className="flex">
                  <span className="font-bold w-20 text-base">To:</span>
                  <div className="flex-1">
                    <div className="text-base">
                      {memoData?.approved_by_details?.name || memoData?.approved_by || 'Approver'} (MD, AHNi)
                      <span className="ml-20 text-sm text-gray-600">
                        {memoData.requested_date ? format(new Date(memoData.requested_date), "PP") : new Date().toLocaleDateString()}
                      </span>
                    </div>
                    {/* Display authorizers (copy) */}
                    {memoData?.authorised_by_details?.map((user: any, index: number) => (
                      <div key={index} className="text-sm text-gray-600 mt-1">
                        {user.name || `${user.first_name} ${user.last_name}`} ({user.designation || 'Staff'})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Through (Reviewers) */}
                <div className="flex">
                  <span className="font-bold w-20 text-base">Through:</span>
                  <div className="flex-1">
                    {memoData?.reviewed_by_details && memoData.reviewed_by_details.length > 0 ? (
                      memoData.reviewed_by_details.map((user: any, index: number) => (
                        <div key={index} className="text-base">
                          {user.name || `${user.first_name} ${user.last_name}`} ({user.designation || 'Staff'}, AHNi)
                          <span className="ml-8 text-sm text-gray-600">
                            {memoData.requested_date ? format(new Date(memoData.requested_date), "PP") : new Date().toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-base">Reviewer</div>
                    )}
                  </div>
                </div>

                {/* From */}
                <div className="flex">
                  <span className="font-bold w-20 text-base">From:</span>
                  <div className="flex-1">
                    <div className="text-base">
                      {memoData?.created_by_details?.name || memoData?.created_by || 'Creator'} (STA, CCF, AHNI)
                      <span className="ml-20 text-sm text-gray-600">
                        {memoData.requested_date ? format(new Date(memoData.requested_date), "PP") : new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Information */}
              <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                <div className="space-y-2">
                  <div><span className="font-semibold">Budget Line #:</span> {memoData?.budget_line_details?.[0]?.module_name || memoData?.budget_line_details?.[0]?.module_code || memoData?.budget_line?.[0] || "-"}</div>
                  <div><span className="font-semibold">Intervention:</span> {memoData?.intervention_areas_details?.[0]?.code || memoData?.intervention_areas_details?.[0]?.description || memoData?.intervention_areas?.[0] || "-"}</div>
                  <div><span className="font-semibold">Cost Grouping #:</span> {memoData?.cost_categories_details?.[0]?.module_name || memoData?.cost_categories_details?.[0]?.module_code || memoData?.cost_categories?.[0] || "-"}</div>
                </div>
                <div className="space-y-2">
                  <div><span className="font-semibold">FCO#:</span> {memoData?.fconumber_details?.[0]?.module_name || memoData?.fconumber_details?.[0]?.module_code || memoData?.fconumber?.[0] || "-"}</div>
                  <div><span className="font-semibold">Cost Input #:</span> {memoData?.cost_inputs_details?.[0]?.module_name || memoData?.cost_inputs_details?.[0]?.module_code || memoData?.cost_input?.[0] || "-"}</div>
                  <div><span className="font-semibold">Funding Source:</span> {memoData?.funding_sources_details?.[0]?.module_name || memoData?.funding_source?.[0] || "-"}</div>
                </div>
              </div>

              {/* Date */}
              <div className="mb-6">
                <span className="font-semibold text-base">Date:</span>
                <span className="text-base ml-2">
                  {memoData.requested_date ? format(new Date(memoData.requested_date), "PP") : "N/A"}
                </span>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <div className="font-semibold text-base">
                  Subject: <span className="font-normal">{memoData.subject || "Activity Memo Request"}</span>
                </div>
              </div>

              {/* Memo Content */}
              <div className="space-y-4 mb-8 text-justify leading-relaxed text-base">
                {memoData.comment ? (
                  <div dangerouslySetInnerHTML={{ __html: memoData.comment.replace(/\n/g, '<br />') }} />
                ) : (
                  <>
                    <p>
                      To ensure smooth, efficient, and uninterrupted service delivery/program implementation, this request is submitted for approval to implement operational cost items as per the attached expense breakdown.
                    </p>

                    <p>
                      This is therefore a request to approve
                      <span className="font-bold"> ₦{grandTotal.toLocaleString()}.00</span> for the items listed in the expense breakdown.
                    </p>

                    <p>
                      Please find attached the activity budget for your review and approval.
                    </p>

                    <p className="mt-3">
                      Thank you.
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Stage 2: Expense Breakdown Table */}
        {currentStage === 2 && (
          <>
            <div className="bg-white border-2 border-black rounded-lg overflow-hidden print:border print:rounded-none">
              {/* Logo Header */}
              <div className="border-b border-black p-4 bg-white">
                <img src={(logoPng as any).src || logoPng} alt="logo" width={120} />
              </div>

              {/* Activity Header */}
              <div className="border-b border-black p-3 bg-blue-200">
                <div className="font-bold text-base">
                  Activity: {memoData.subject || "Activity Memo"}
                </div>
              </div>

              {/* Request Details Table */}
              <table className="w-full border-collapse text-base">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-4 bg-blue-100 font-semibold w-1/4">Request Date:</td>
                    <td className="p-4">
                      {memoData.requested_date ? format(new Date(memoData.requested_date), "PP") : "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-4 bg-blue-100 font-semibold">Location:</td>
                    <td className="p-4">{memoData.location || "N/A"}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-4 bg-blue-100 font-semibold">FCO #:</td>
                    <td className="p-4">{memoData.fconumber_details?.[0]?.module_name || memoData.fconumber_details?.[0]?.module_code || memoData.fconumber?.[0] || "N/A"}</td>
                  </tr>
                </tbody>
              </table>

              {/* Budget Information Grid */}
              <table className="w-full border-collapse text-base">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-3 bg-blue-100 font-semibold w-1/2">
                      Intervention: {memoData?.intervention_areas_details?.[0]?.code || memoData?.intervention_areas_details?.[0]?.description || memoData?.intervention_areas?.[0] || "-"}
                    </td>
                    <td className="p-3 bg-blue-100 font-semibold">
                      Budget Line #: {memoData?.budget_line_details?.[0]?.module_name || memoData?.budget_line_details?.[0]?.module_code || memoData?.budget_line?.[0] || "-"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-3 bg-blue-100 font-semibold">
                      Cost Grouping #: {memoData?.cost_categories_details?.[0]?.module_name || memoData?.cost_categories_details?.[0]?.module_code || memoData?.cost_categories?.[0] || "-"}
                    </td>
                    <td className="p-3 bg-blue-100 font-semibold">
                      Cost Input #: {memoData?.cost_inputs_details?.[0]?.module_name || memoData?.cost_inputs_details?.[0]?.module_code || memoData?.cost_input?.[0] || "-"}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-3 bg-blue-100 font-semibold">
                      Funding Source: {memoData?.funding_sources_details?.[0]?.module_name || memoData?.funding_source?.[0] || "-"}
                    </td>
                    <td className="p-3 bg-blue-100 font-semibold"></td>
                  </tr>
                </tbody>
              </table>

              {/* Expense Table Header */}
              <div className="bg-orange-200 border-b border-black">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border-r border-black p-3 font-bold text-left" style={{width: '40%'}}>Description/Item Name</th>
                      <th className="border-r border-black p-3 font-bold text-center" style={{width: '15%'}}>UOM</th>
                      <th className="border-r border-black p-3 font-bold text-center" style={{width: '15%'}}>Quantity</th>
                      <th className="border-r border-black p-3 font-bold text-center" style={{width: '15%'}}>Unit Cost</th>
                      <th className="p-3 font-bold text-center" style={{width: '15%'}}>Total Cost</th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Currency Header Row */}
              <div className="border-b border-black">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <tr>
                      <td className="border-r border-black p-2" style={{width: '40%'}}></td>
                      <td className="border-r border-black p-2" style={{width: '15%'}}></td>
                      <td className="border-r border-black p-2" style={{width: '15%'}}></td>
                      <td className="border-r border-black p-2 text-center font-bold" style={{width: '15%'}}>₦</td>
                      <td className="p-2 text-center font-bold" style={{width: '15%'}}>₦</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Expense Rows */}
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {expensesData.map((row: any, index: number) => (
                    <tr key={index} className="border-b border-black">
                      <td className="border-r border-black p-3" style={{width: '40%'}}>
                        {row?.item_detail?.name || row?.item || "N/A"}
                      </td>
                      <td className="border-r border-black p-3 text-center" style={{width: '15%'}}>
                        {row?.item_detail?.uom || row?.uom || "Each"}
                      </td>
                      <td className="border-r border-black p-3 text-center" style={{width: '15%'}}>
                        {row.quantity || "1"}
                      </td>
                      <td className="border-r border-black p-3 text-right" style={{width: '15%'}}>
                        {Number(row.unit_cost || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-right" style={{width: '15%'}}>
                        {Number(row.total_cost || 0).toLocaleString()}.00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Overall Total Row */}
              <div className="bg-green-200 border-b border-black">
                <table className="w-full border-collapse text-base">
                  <tbody>
                    <tr>
                      <td className="p-4 text-center font-bold" style={{width: '85%'}}>OVERALL TOTAL</td>
                      <td className="p-4 text-right font-bold" style={{width: '15%'}}>₦ {grandTotal.toLocaleString()}.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signature Section */}
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr>
                    <td className="border-r border-black p-6 align-top" style={{width: '33.33%'}}>
                      <div className="mb-3">
                        <span className="font-bold text-base">
                          Prepared by: {memoData?.created_by_details?.name || memoData?.created_by || 'Creator'}
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="font-bold text-base">Sign:</span>
                        <div className="h-16 mt-3"></div>
                      </div>
                      <div>
                        <span className="font-bold text-base">Date:</span>
                        <span className="ml-2">
                          {memoData.requested_date ? format(new Date(memoData.requested_date), "PP") : "___________"}
                        </span>
                      </div>
                    </td>
                    <td className="border-r border-black p-6 align-top" style={{width: '33.33%'}}>
                      <div className="mb-3">
                        <span className="font-bold text-base">Reviewed by:</span>
                      </div>
                      <div className="mb-3">
                        <span className="font-bold text-base">Sign:</span>
                        <div className="h-16 mt-3"></div>
                      </div>
                      <div>
                        <span className="font-bold text-base">Date:</span> ___________
                      </div>
                    </td>
                    <td className="p-6 align-top" style={{width: '33.33%'}}>
                      <div className="mb-3">
                        <span className="font-bold text-base">
                          Approved by: {memoData?.approved_by_details?.name || memoData?.approved_by || 'Approver'}
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="font-bold text-base">Sign:</span>
                        <div className="h-16 mt-3"></div>
                      </div>
                      <div>
                        <span className="font-bold text-base">Date:</span> ___________
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Stage 3: Approval Workflow */}
        {currentStage === 3 && memoData && (
          <div className="bg-white p-6 rounded-lg">
            <ActivityMemoApprovalWorkflow
              activityMemoData={{ data: memoData }}
              currentUser={currentUser}
              activityMemoId={memoId}
              onStatusUpdate={() => refetch()}
            />
          </div>
        )}
        </div> {/* End of printable content */}
      </section>
    </div>
  );
};

export default ActivityMemoView;