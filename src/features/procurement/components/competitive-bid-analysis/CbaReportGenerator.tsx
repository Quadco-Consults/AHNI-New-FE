"use client";

import React from "react";
import { Card } from "components/Card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Icon } from "@iconify/react";
import { LoadingSpinner } from "components/Loading";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import SignatureWorkflowAPI from "@/features/procurement/controllers/signatureWorkflowController";
import { CbaDocument, VendorComparison, EvaluationCriteria, ApprovalWorkflow } from "../../types/cba";
import { cn } from "lib/utils";

interface CbaReportGeneratorProps {
  cbaId: string;
}

const CbaReportGenerator: React.FC<CbaReportGeneratorProps> = ({ cbaId }) => {
  const { data: cbaData, isLoading: cbaLoading } = CbaAPI.useGetSingleCba(cbaId);
  const { data: reportData, isLoading: reportLoading } = CbaAPI.useGenerateCbaReport(cbaId);
  const { data: scoresData } = CbaAPI.useCalculateCbaScores(cbaId);
  const { data: priceRankingData } = CbaAPI.usePriceResponsivenessRanking(cbaId);
  const { data: workflowData } = SignatureWorkflowAPI.useCbaSignatureWorkflow(cbaId);

  const { generateCbaReport, isLoading: generating } = CbaAPI.useGenerateCbaReport(cbaId);

  const handleGenerateReport = async () => {
    await generateCbaReport();
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // PDF export functionality
    console.log("Export PDF functionality to be implemented");
  };

  if (cbaLoading || reportLoading) {
    return <LoadingSpinner />;
  }

  const document = reportData?.data;
  const cba = cbaData?.data;
  const scores = scoresData?.data;
  const priceRanking = priceRankingData?.data;
  const workflow = workflowData?.data;

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3 print:hidden">
        <Button onClick={handleGenerateReport} disabled={generating}>
          {generating ? "Generating..." : "Generate Report"}
        </Button>
        <Button variant="outline" onClick={handlePrintReport}>
          <Icon icon="heroicons:printer" className="mr-2" />
          Print
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <Icon icon="heroicons:document-arrow-down" className="mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Report Document */}
      <Card className="p-8 print:shadow-none print:border-none">
        {/* Document Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {document?.title || "COMPARATIVE BID ANALYSIS (CBA)"}
          </h1>
          <p className="text-lg mb-4">
            {document?.subject || `Subject: ${cba?.title || "CBA Analysis"}`}
          </p>
          <div className="flex justify-between text-sm">
            <span>{document?.pageInfo || "Page 1"}</span>
            <span>Date: {document?.evaluationDate || cba?.cba_date}</span>
          </div>
          <p className="text-sm mt-2">
            RFQ Reference: {document?.rfqReference || cba?.solicitation}
          </p>
        </div>

        {/* Vendor Comparison Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">VENDOR COMPARISON</h2>
          
          {document?.vendorComparison ? (
            <VendorComparisonTable comparison={document.vendorComparison} />
          ) : cba?.vendor_submissions ? (
            <VendorSubmissionsTable submissions={cba.vendor_submissions} />
          ) : (
            <p className="text-gray-500">No vendor data available</p>
          )}
        </div>

        {/* Evaluation Criteria */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">EVALUATION CRITERIA</h2>
          
          {document?.evaluationCriteria ? (
            <EvaluationCriteriaSection criteria={document.evaluationCriteria} />
          ) : (
            <DefaultEvaluationCriteria 
              scores={scores} 
              priceRanking={priceRanking}
            />
          )}
        </div>

        {/* Award Recommendation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">AWARD RECOMMENDATION</h2>
          <p className="text-base leading-relaxed">
            {document?.awardRecommendation || 
             `Based on the evaluation conducted, the recommendation is to award the contract to the vendor with the highest combined score.`}
          </p>
        </div>

        {/* Approval Workflow / Signatures */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">APPROVAL WORKFLOW</h2>
          
          {workflow ? (
            <ApprovalWorkflowSection workflow={workflow} />
          ) : document?.approvalWorkflow ? (
            <ApprovalWorkflowSection workflow={document.approvalWorkflow} />
          ) : (
            <DefaultApprovalWorkflow cba={cba} />
          )}
        </div>
      </Card>
    </div>
  );
};

// Vendor Comparison Table Component
const VendorComparisonTable: React.FC<{ comparison: VendorComparison }> = ({ comparison }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Item No.</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">UOM</th>
            {comparison.vendors.map(vendor => (
              <th key={vendor.id} className="border border-gray-300 px-4 py-2">
                {vendor.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.items.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {item.itemNo}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.description}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {item.uom}
              </td>
              {comparison.vendors.map(vendor => {
                const vendorData = item.vendors[vendor.id];
                return (
                  <td key={vendor.id} className="border border-gray-300 px-4 py-2 text-right">
                    {vendorData ? (
                      <div>
                        <div>Qty: {vendorData.qty}</div>
                        <div>Unit Price: ${vendorData.unitPrice.toLocaleString()}</div>
                        <div className="font-semibold">Total: ${vendorData.total.toLocaleString()}</div>
                      </div>
                    ) : (
                      "No Bid"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="bg-gray-50 font-semibold">
            <td colSpan={3} className="border border-gray-300 px-4 py-2 text-right">
              GRAND TOTAL
            </td>
            {comparison.vendors.map(vendor => (
              <td key={vendor.id} className="border border-gray-300 px-4 py-2 text-right">
                ${comparison.grandTotals[vendor.id]?.toLocaleString() || "0"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Vendor Submissions Table (fallback)
const VendorSubmissionsTable: React.FC<{ submissions: any[] }> = ({ submissions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Item</th>
            <th className="border border-gray-300 px-4 py-2">Vendor Submissions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                <div>
                  <div className="font-semibold">{submission.item.name}</div>
                  <div className="text-sm text-gray-600">{submission.item.description}</div>
                  <div className="text-sm">UOM: {submission.item.uom}</div>
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="space-y-2">
                  {submission.submissions.map((sub: any, subIndex: number) => (
                    <div key={subIndex} className="border-l-2 border-blue-200 pl-3">
                      <div className="font-medium">Vendor: {sub.vendor}</div>
                      <div>Quantity: {sub.quantity}</div>
                      <div>Unit Price: ${sub.unit_price.toLocaleString()}</div>
                      <div className="font-semibold">Subtotal: ${sub.sub_total.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Evaluation Criteria Section
const EvaluationCriteriaSection: React.FC<{ criteria: EvaluationCriteria }> = ({ criteria }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Technical Evaluation</h3>
          <p className="text-2xl font-bold text-blue-600">{criteria.technicalEvaluation}%</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Price Reasonableness</h3>
          <p className="text-2xl font-bold text-green-600">{criteria.priceReasonableness}%</p>
        </Card>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Responsiveness Ranking</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Badge className="bg-gold text-white mb-2">1st</Badge>
            <p className="text-sm">{criteria.priceResponsiveness.firstMostResponsive}</p>
          </div>
          <div className="text-center">
            <Badge className="bg-silver text-white mb-2">2nd</Badge>
            <p className="text-sm">{criteria.priceResponsiveness.secondMostResponsive}</p>
          </div>
          <div className="text-center">
            <Badge className="bg-bronze text-white mb-2">3rd</Badge>
            <p className="text-sm">{criteria.priceResponsiveness.thirdMostResponsive}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Technical Eligibility</h3>
          <div className="space-y-2">
            {Object.entries(criteria.technicalEligibility).map(([vendor, eligible]) => (
              <div key={vendor} className="flex justify-between">
                <span>{vendor}</span>
                <Badge className={eligible ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}>
                  {eligible ? "Eligible" : "Not Eligible"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Financial Eligibility</h3>
          <div className="space-y-2">
            {Object.entries(criteria.financialEligibility).map(([vendor, eligible]) => (
              <div key={vendor} className="flex justify-between">
                <span>{vendor}</span>
                <Badge className={eligible ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}>
                  {eligible ? "Eligible" : "Not Eligible"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Default Evaluation Criteria (fallback)
const DefaultEvaluationCriteria: React.FC<{ scores?: any; priceRanking?: any }> = ({ scores, priceRanking }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Technical Evaluation</h3>
          <p className="text-2xl font-bold text-blue-600">70%</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Price Reasonableness</h3>
          <p className="text-2xl font-bold text-green-600">30%</p>
        </Card>
      </div>

      {scores && (
        <div>
          <h3 className="font-semibold mb-3">Vendor Scores</h3>
          <div className="space-y-2">
            {scores.map((score: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{score.vendor_name}</span>
                <div className="flex gap-4 text-sm">
                  <span>Technical: {score.technical_score}</span>
                  <span>Price: {score.price_score}</span>
                  <Badge className={score.recommended ? "bg-green-200 text-green-800" : ""}>
                    Combined: {score.combined_score}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {priceRanking && (
        <div>
          <h3 className="font-semibold mb-3">Price Responsiveness Ranking</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Badge className="bg-gold text-white mb-2">1st</Badge>
              <p className="text-sm">{priceRanking.first_most_responsive}</p>
            </div>
            <div className="text-center">
              <Badge className="bg-silver text-white mb-2">2nd</Badge>
              <p className="text-sm">{priceRanking.second_most_responsive}</p>
            </div>
            <div className="text-center">
              <Badge className="bg-bronze text-white mb-2">3rd</Badge>
              <p className="text-sm">{priceRanking.third_most_responsive}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Approval Workflow Section
const ApprovalWorkflowSection: React.FC<{ workflow: ApprovalWorkflow }> = ({ workflow }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <SignatureBlockComponent title="Prepared By" signature={workflow.preparedBy} />
        <SignatureBlockComponent title="Reviewed By" signature={workflow.reviewedBy} />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <SignatureBlockComponent title="Authorized By" signature={workflow.authorizedBy} />
        <SignatureBlockComponent title="Approved By" signature={workflow.approvedBy} />
      </div>

      {workflow.procurementCommittee && workflow.procurementCommittee.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Procurement Committee</h3>
          <div className="grid grid-cols-2 gap-4">
            {workflow.procurementCommittee.map((member, index) => (
              <SignatureBlockComponent 
                key={index} 
                title={member.title} 
                signature={member} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Signature Block Component
const SignatureBlockComponent: React.FC<{ title: string; signature: any }> = ({ title, signature }) => {
  return (
    <div className="border border-gray-300 p-4 min-h-[120px]">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-600">Name: </span>
          <span className="border-b border-dotted border-gray-400 inline-block w-32">
            {signature?.name || ""}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-600">Date: </span>
          <span className="border-b border-dotted border-gray-400 inline-block w-24">
            {signature?.date || signature?.signed_at || ""}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-600">Signature: </span>
          <span className="border-b border-dotted border-gray-400 inline-block w-32">
            {signature?.signature || ""}
          </span>
        </div>
        {signature?.status && (
          <Badge className={cn(
            signature.status === 'signed' && "bg-green-200 text-green-800",
            signature.status === 'pending' && "bg-yellow-200 text-yellow-800",
            signature.status === 'rejected' && "bg-red-200 text-red-800"
          )}>
            {signature.status}
          </Badge>
        )}
      </div>
    </div>
  );
};

// Default Approval Workflow (fallback)
const DefaultApprovalWorkflow: React.FC<{ cba?: any }> = ({ cba }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <SignatureBlockComponent title="Prepared By" signature={{ title: "Procurement Officer" }} />
        <SignatureBlockComponent title="Reviewed By" signature={{ title: "Procurement Manager" }} />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <SignatureBlockComponent title="Authorized By" signature={{ title: "Department Head" }} />
        <SignatureBlockComponent title="Approved By" signature={{ title: "Chief Executive" }} />
      </div>

      {cba?.committee_members && cba.committee_members.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Procurement Committee</h3>
          <div className="grid grid-cols-2 gap-4">
            {cba.committee_members.map((member: any, index: number) => (
              <SignatureBlockComponent 
                key={index} 
                title={member.designation} 
                signature={{ name: `${member.first_name} ${member.last_name}` }} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CbaReportGenerator;