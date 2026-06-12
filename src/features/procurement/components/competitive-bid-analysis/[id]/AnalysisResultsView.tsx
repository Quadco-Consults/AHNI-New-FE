"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Loading } from "@/components/Loading";
import GoBack from "@/components/GoBack";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Award, CheckCircle, ClipboardList, ShieldCheck, FilePlus, AlertTriangle } from 'lucide-react';
import { Icon } from "@iconify/react";
import CbaAPI from "@/features/procurement/controllers/cbaController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useGetAllMemberEvaluations, useCalculateConsensus } from "@/features/procurement/controllers/committeeEvaluationController";
import SignatureWorkflowAPI from "@/features/procurement/controllers/signatureWorkflowController";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import FormSelect from "@/components/atoms/FormSelectField";
import { SelectContent, SelectItem } from "@/components/ui/select";
import FormTextArea from "@/components/atoms/FormTextArea";
import FormButton from "@/components/FormButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CbaApprovalSchema } from "@/features/procurement/types/procurement-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

interface VendorItem {
  id: string;
  description: string;
  specification: string;
  qty: number;
  brand?: string;
  unitPrice: number;
  total: number;
  selected?: boolean;
}

interface VendorData {
  id: string;
  name: string;
  items: VendorItem[];
  grandTotal: number;
}

const AnalysisResultsView = () => {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const cbaId = searchParams?.get('cba') || id;
  const solicitationIdFromParams = searchParams?.get('id');

  // Fetch data
  const { data: cbaData, isLoading: cbaLoading } = CbaAPI.useGetSingleCba(cbaId as string);

  // Get solicitation ID from URL params OR from CBA data
  const solicitationId = solicitationIdFromParams || cbaData?.data?.solicitation?.id;

  const { data: submissionData, isLoading: submissionLoading } = useGetSolicitationSubmission(
    solicitationId || "",
    !!solicitationId
  );

  // Analysis data is now part of CBA data
  const analysisData = cbaData?.data;
  const analysisLoading = cbaLoading;

  // Debug logging
  console.log("🔍 Analysis Results View Debug:", {
    cbaId,
    solicitationId,
    cbaData,
    analysisData,
    hasSelectedVendor: !!analysisData?.selected_bid_submission,
    hasSelectedItems: !!analysisData?.selected_items,
    selectedVendorId: analysisData?.selected_bid_submission,
    selectedItems: analysisData?.selected_items,
    recommendationNote: analysisData?.recommendation_note,
    selectedTotal: analysisData?.selected_total
  });

  // Committee evaluations for COMMITTEE type CBAs
  const isCommitteeCBA = cbaData?.data?.cba_type === 'COMMITTEE';
  const { data: memberEvaluations, isLoading: memberEvalsLoading } = useGetAllMemberEvaluations(cbaId as string, isCommitteeCBA);

  // Ensure memberEvaluations is an array
  const memberEvaluationsArray = Array.isArray(memberEvaluations) ? memberEvaluations : [];

  const { calculateConsensus } = useCalculateConsensus(memberEvaluationsArray);

  const consensusResults = useMemo(() => {
    if (!isCommitteeCBA || !memberEvaluationsArray || memberEvaluationsArray.length === 0) return null;
    return calculateConsensus();
  }, [isCommitteeCBA, memberEvaluationsArray, calculateConsensus]);

  // Workflow and approval
  const { data: workflowStatus } = SignatureWorkflowAPI.useCbaWorkflowStatus(cbaId as string);
  const { approveCba, isLoading: approvingCba } = CbaAPI.useApproveCba(cbaId as string);

  // Get current approval step
  const getCurrentApprovalStep = () => {
    const status = cbaData?.data?.status;

    if (status === 'PENDING') {
      return { step: 1, role: 'Reviewer', isComplete: false };
    } else if (status === 'APPROVED') {
      return { step: 4, role: 'Completed', isComplete: true };
    } else {
      return { step: 1, role: 'Reviewer', isComplete: false };
    }
  };

  const currentStep = getCurrentApprovalStep();

  // Approval form
  const form = useForm<z.infer<typeof CbaApprovalSchema>>({
    resolver: zodResolver(CbaApprovalSchema),
    defaultValues: {
      status: "APPROVED" as const,
      remarks: "",
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (formData: z.infer<typeof CbaApprovalSchema>) => {
    try {
      const stepMapping: Record<number, 'reviewed' | 'authorized' | 'approved'> = {
        1: 'reviewed',
        2: 'authorized',
        3: 'approved'
      };

      const workflowStep = stepMapping[currentStep.step];

      if (formData.status === 'APPROVED') {
        await approveCba({
          remarks: formData.remarks
        });

        await queryClient.invalidateQueries({ queryKey: ["cba", cbaId] });
        await queryClient.invalidateQueries({ queryKey: ["cbas"] });
        await queryClient.invalidateQueries({ queryKey: ["cba-workflow-status", cbaId] });

        toast.success(`CBA approved successfully.`);
      }

      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  // Process vendor data from analysis results
  const getVendorDataFromAnalysis = (): VendorData | null => {
    if (!analysisData || !submissionData) return null;

    const submissions = (submissionData as any)?.data?.data?.results || (submissionData as any)?.data?.results || [];

    // Find the selected vendor submission
    const selectedVendor = submissions.find((sub: any) => sub.id === analysisData.selected_bid_submission);

    if (!selectedVendor) return null;

    const items = selectedVendor.bid_items?.map((bidItem: any) => ({
      id: bidItem.id,
      description: bidItem.solicitation_item_name || "N/A",
      specification: `Quantity: ${bidItem.solicitation_item_quantity} units`,
      qty: parseInt(bidItem.solicitation_item_quantity || 0),
      brand: bidItem.brand || "Generic",
      unitPrice: parseFloat(bidItem.unit_price || 0),
      total: parseFloat(bidItem.total_price || 0),
      selected: analysisData.selected_items?.includes(bidItem.id) || false
    })) || [];

    return {
      id: selectedVendor.vendor?.id || selectedVendor.id, // Use actual vendor ID, not bid submission ID
      name: selectedVendor.vendor?.company_name || "Unknown Vendor",
      items,
      grandTotal: parseFloat(selectedVendor.bid_details?.total_amount || items.reduce((sum: number, item: VendorItem) => sum + item.total, 0))
    };
  };

  const vendorData = getVendorDataFromAnalysis();
  const selectedItems = vendorData?.items.filter(item => item.selected) || [];
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.total, 0);

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!analysisData || !vendorData) {
      toast.error("No analysis data available to download");
      return;
    }

    setIsDownloading(true);
    try {
      const doc = new jsPDF({ orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;

      // Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Achieving Health Nigeria Initiative (AHNI)", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 8;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("No. 30 Anthony Enahoro Street, Utako District, Abuja, Nigeria", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 5;
      doc.text("Tel: +234-09-4615555 / +234-09-461500 | Fax: +234-09-4615511 | Email: info@ahnigeria.org.ng", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 15;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("COMPETITIVE BID ANALYSIS - FINAL RESULTS", pageWidth / 2, yPosition, { align: "center" });

      yPosition += 10;
      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });

      yPosition += 15;

      // Winner Information
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`AWARDED VENDOR: ${vendorData.name}`, 15, yPosition);
      yPosition += 10;

      // Items Table
      const tableData = selectedItems.map((item, index) => [
        (index + 1).toString(),
        item.description,
        item.qty.toString(),
        item.brand || "N/A",
        `₦${item.unitPrice.toLocaleString()}`,
        `₦${item.total.toLocaleString()}`
      ]);

      (doc as any).autoTable({
        startY: yPosition,
        head: [["S/N", "Item Description", "Qty", "Brand", "Unit Price", "Total"]],
        body: tableData,
        foot: [["", "", "", "", "Grand Total:", `₦${selectedTotal.toLocaleString()}`]],
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246], fontStyle: "bold" },
        footStyles: { fillColor: [34, 197, 94], fontStyle: "bold", textColor: [255, 255, 255] },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;

      // Recommendation
      if (analysisData.recommendation_note) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("AWARD RECOMMENDATION:", 15, yPosition);
        yPosition += 7;

        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(analysisData.recommendation_note, pageWidth - 30);
        doc.text(splitText, 15, yPosition);
      }

      doc.save(`CBA-Final-Results-${cbaId.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Analysis results downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  // Create Purchase Order
  const handleCreatePO = () => {
    toast.info("Redirecting to Create Purchase Order...");
    router.push(`/dashboard/procurement/purchase-order/create?cba=${cbaId}&vendor=${vendorData?.id}`);
  };

  if (cbaLoading || analysisLoading || submissionLoading) {
    return <Loading />;
  }

  if (!analysisData?.selected_bid_submission || !vendorData) {
    return (
      <div className="p-8 text-center">
        <FileText size={16} />
        <p className="text-yellow-800 font-semibold text-lg">No Analysis Results Available</p>
        <p className="text-gray-600 text-sm mt-2">The analysis has not been submitted yet.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <GoBack />

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="mr-4">
            <img src="/imgs/logo.png" alt="AHNI Logo" className="w-20 h-16 object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-blue-800">
              ACHIEVING HEALTH INITIATIVE NIGERIA (AHNI)
            </h1>
            <p className="text-gray-600 text-sm">Building Sustainable Health Systems Across Nigeria</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            COMPETITIVE BID ANALYSIS - FINAL RESULTS
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className={cn(
              "px-4 py-2 text-base font-semibold",
              cbaData?.data?.status === "APPROVED" && "bg-green-600",
              cbaData?.data?.status === "PENDING" && "bg-amber-500"
            )}>
              {cbaData?.data?.status || 'PENDING'}
            </Badge>
            <Button onClick={handleDownloadPDF} disabled={isDownloading} variant="outline">
              <Download size={16} />
              {isDownloading ? "Generating..." : "Download Report"}
            </Button>
          </div>
        </div>
      </div>

      {/* Committee Consensus Section (COMMITTEE type only) */}
      {isCommitteeCBA && consensusResults && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Icon icon="mdi:account-group" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Committee Consensus Analysis</h3>
              <p className="text-sm text-gray-600">
                Aggregated results from {memberEvaluationsArray?.length || 0} committee member evaluations
              </p>
            </div>
          </div>

          {/* Consensus Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600">Recommended Vendor</p>
              <p className="text-xl font-bold text-purple-700">
                {consensusResults.recommended_vendor?.name || 'N/A'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600">Consensus Score</p>
              <p className="text-xl font-bold text-purple-700">
                {consensusResults.recommended_vendor?.consensus_score?.toFixed(1) || 'N/A'}/100
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600">Agreement Rate</p>
              <p className="text-xl font-bold text-purple-700">
                {consensusResults.agreement_percentage || 0}%
              </p>
            </div>
          </div>

          {/* Vendor Comparison Table */}
          {consensusResults.vendor_scores && consensusResults.vendor_scores.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-purple-200">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Icon icon="mdi:chart-bar" className="w-5 h-5 text-purple-600" />
                All Vendors Comparison
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-purple-100 border-b border-purple-200">
                      <th className="text-left p-3 font-semibold text-gray-900">Vendor</th>
                      <th className="text-center p-3 font-semibold text-gray-900">Avg Technical</th>
                      <th className="text-center p-3 font-semibold text-gray-900">Avg Commercial</th>
                      <th className="text-center p-3 font-semibold text-gray-900">Consensus Score</th>
                      <th className="text-center p-3 font-semibold text-gray-900">Members Recommended</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consensusResults.vendor_scores
                      .sort((a: any, b: any) => b.consensus_score - a.consensus_score)
                      .map((vendor: any, idx: number) => {
                        const isRecommended = vendor.id === consensusResults.recommended_vendor?.id;
                        return (
                          <tr
                            key={vendor.id}
                            className={cn(
                              "border-b border-gray-200 hover:bg-purple-50 transition-colors",
                              isRecommended && "bg-green-50 font-semibold"
                            )}
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {isRecommended && (
                                  <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600" />
                                )}
                                <span className={isRecommended ? "text-green-800" : "text-gray-900"}>
                                  {vendor.name}
                                </span>
                              </div>
                            </td>
                            <td className="text-center p-3">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                {vendor.avg_technical_score?.toFixed(1) || 'N/A'}
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                                {vendor.avg_commercial_score?.toFixed(1) || vendor.avg_price_score?.toFixed(1) || 'N/A'}
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-bold">
                                {vendor.consensus_score?.toFixed(1) || 'N/A'}/100
                              </span>
                            </td>
                            <td className="text-center p-3">
                              <span className="text-gray-700">
                                {vendor.recommendations?.filter((r: boolean) => r).length || 0} / {vendor.recommendations?.length || 0}
                                <span className="text-xs text-gray-500 ml-1">
                                  ({Math.round((vendor.recommendation_rate || 0) * 100)}%)
                                </span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Individual Member Evaluations */}
          <div className="bg-white rounded-lg p-6 border border-purple-200">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="mdi:account-group" className="w-5 h-5 text-purple-600" />
              Individual Committee Member Evaluations
            </h4>
            <div className="space-y-4">
              {memberEvaluationsArray?.map((memberEval: any) => {
                const technicalScore = memberEval.technical_score || 0;
                const commercialScore = memberEval.commercial_score || 0;
                const combinedScore = ((technicalScore * 0.6) + (commercialScore * 0.4)).toFixed(1);

                return (
                  <div key={memberEval.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Member Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Icon icon="mdi:account" className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{memberEval.member_name}</div>
                          <div className="text-sm text-gray-600">{memberEval.member_designation || 'Committee Member'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Submitted</div>
                        <div className="text-sm font-medium text-gray-700">
                          {memberEval.submitted_at ? new Date(memberEval.submitted_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-blue-600 font-medium mb-1">Technical</div>
                        <div className="text-xl font-bold text-blue-700">{technicalScore}</div>
                        <div className="text-xs text-gray-500">/100</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-green-600 font-medium mb-1">Commercial</div>
                        <div className="text-xl font-bold text-green-700">{commercialScore}</div>
                        <div className="text-xs text-gray-500">/100</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <div className="text-xs text-purple-600 font-medium mb-1">Combined</div>
                        <div className="text-xl font-bold text-purple-700">{combinedScore}</div>
                        <div className="text-xs text-gray-500">/100</div>
                      </div>
                    </div>

                    {/* Selected Vendor */}
                    {memberEval.selected_vendor_name && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Icon icon="mdi:check-circle" className="w-5 h-5 text-amber-600" />
                          <div>
                            <div className="text-xs text-amber-700 font-medium">Selected Vendor</div>
                            <div className="text-sm font-semibold text-amber-900">{memberEval.selected_vendor_name}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detailed Evaluation Criteria */}
                    {memberEval.evaluation_criteria_data && memberEval.evaluation_criteria_data.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon icon="mdi:clipboard-list" className="w-5 h-5 text-blue-600" />
                          <div className="text-sm font-semibold text-blue-900">Evaluation Criteria Details</div>
                        </div>
                        <div className="space-y-2">
                          {memberEval.evaluation_criteria_data.map((criteria: any, idx: number) => (
                            <div key={idx} className="bg-white rounded-lg p-3 border border-blue-100">
                              <div className="font-medium text-sm text-gray-900 mb-2">{criteria.vendor_name}</div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {criteria.quality_score && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Quality Score:</span>
                                    <span className="font-medium text-blue-700">{criteria.quality_score}</span>
                                  </div>
                                )}
                                {criteria.price_responsiveness && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Price Rank:</span>
                                    <span className="font-medium text-green-700">{criteria.price_responsiveness}</span>
                                  </div>
                                )}
                                {criteria.technical_eligibility && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Technical Eligible:</span>
                                    <span className={`font-medium ${criteria.technical_eligibility === 'YES' ? 'text-green-700' : 'text-red-700'}`}>
                                      {criteria.technical_eligibility}
                                    </span>
                                  </div>
                                )}
                                {criteria.bank_account_evaluation && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Bank Account:</span>
                                    <span className={`font-medium ${criteria.bank_account_evaluation === 'YES' ? 'text-green-700' : 'text-red-700'}`}>
                                      {criteria.bank_account_evaluation}
                                    </span>
                                  </div>
                                )}
                                {criteria.experience_evaluation && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Experience:</span>
                                    <span className={`font-medium ${criteria.experience_evaluation === 'YES' ? 'text-green-700' : 'text-red-700'}`}>
                                      {criteria.experience_evaluation}
                                    </span>
                                  </div>
                                )}
                                {criteria.approved_models && (
                                  <div className="col-span-2">
                                    <span className="text-gray-600">Models/Brands:</span>
                                    <span className="ml-2 font-medium text-gray-800">{criteria.approved_models}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendation/Justification */}
                    {memberEval.overall_recommendation && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Icon icon="mdi:message-text" className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-xs text-gray-600 font-medium mb-1">Justification</div>
                            <p className="text-sm text-gray-700 leading-relaxed">{memberEval.overall_recommendation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consensus vs Selection Warning */}
          {vendorData && consensusResults.recommended_vendor &&
           vendorData.name !== consensusResults.recommended_vendor.name && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-800 mb-2">⚠️ Warning: Selection Differs from Committee Consensus</h4>
                  <p className="text-sm text-red-700">
                    The selected vendor <strong>{vendorData.name}</strong> differs from the committee's recommended vendor{' '}
                    <strong>{consensusResults.recommended_vendor.name}</strong> (Consensus: {consensusResults.recommended_vendor.consensus_score?.toFixed(1)}/100,
                    Agreement: {consensusResults.agreement_percentage}%).
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    Please ensure this deviation is justified and documented in the recommendation notes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Awarded Vendor Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
            <Award size={16} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Awarded Vendor</h3>
            <p className="text-xl font-bold text-green-700">{vendorData.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600">Selected Items</p>
            <p className="text-2xl font-bold text-gray-900">{selectedItems.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600">Total Award Value</p>
            <p className="text-2xl font-bold text-green-600">₦{selectedTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left w-12">S/N</th>
              <th className="border border-gray-300 p-2 text-left">Items Description</th>
              <th className="border border-gray-300 p-2 text-center w-16">Qty</th>
              <th className="border border-gray-300 p-2 text-center">Brand</th>
              <th className="border border-gray-300 p-2 text-center">Unit Price</th>
              <th className="border border-gray-300 p-2 text-center">Total</th>
              <th className="border border-gray-300 p-2 text-center w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {vendorData.items.map((item, index) => (
              <tr key={index} className={item.selected ? "bg-green-50" : "bg-gray-50"}>
                <td className="border border-gray-300 p-2 text-center font-medium">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  <div className="font-medium text-sm">{item.description}</div>
                  <div className="text-xs text-gray-600">{item.specification}</div>
                </td>
                <td className="border border-gray-300 p-2 text-center">{item.qty}</td>
                <td className="border border-gray-300 p-2 text-center">{item.brand}</td>
                <td className="border border-gray-300 p-2 text-center">₦{item.unitPrice.toLocaleString()}</td>
                <td className="border border-gray-300 p-2 text-center font-semibold">₦{item.total.toLocaleString()}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {item.selected ? (
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle size={16} />
                      Selected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">Not Selected</Badge>
                  )}
                </td>
              </tr>
            ))}
            <tr className="bg-green-100 font-bold">
              <td colSpan={5} className="border border-gray-300 p-2 text-right">Grand Total (Selected):</td>
              <td className="border border-gray-300 p-2 text-center text-lg text-green-700">
                ₦{selectedTotal.toLocaleString()}
              </td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recommendation */}
      {analysisData.recommendation_note && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <ClipboardList size={16} />
            Award Recommendation
          </h3>
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysisData.recommendation_note}</p>
          </div>
        </div>
      )}

      {/* Approval Workflow Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <ShieldCheck size={16} />
          Approval Workflow
        </h3>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                currentStep.step > step ? "bg-green-500 text-white" :
                currentStep.step === step ? "bg-purple-600 text-white ring-4 ring-purple-200" :
                "bg-gray-200 text-gray-500"
              )}>
                {currentStep.step > step ? <CheckCircle size={16} /> : step}
              </div>
              {step < 3 && (
                <div className={cn(
                  "flex-1 h-1 transition-all",
                  currentStep.step > step ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          {cbaData?.data?.status === "PENDING" && !currentStep.isComplete ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
                  <ShieldCheck size={16} />
                  {currentStep.role} Approval
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>CBA {currentStep.role} Approval</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <FormSelect name="status" label="Decision" placeholder="Select decision" required>
                      <SelectContent>
                        <SelectItem value="APPROVED">Approve</SelectItem>
                        <SelectItem value="REJECTED">Reject</SelectItem>
                      </SelectContent>
                    </FormSelect>
                    <FormTextArea name="remarks" label="Remarks" placeholder="Enter remarks" rows={4} />
                    <FormButton loading={approvingCba} disabled={approvingCba} type="submit">
                      Submit Decision
                    </FormButton>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          ) : null}

          {cbaData?.data?.status === "APPROVED" && (
            <Button onClick={handleCreatePO} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
              <FilePlus size={16} />
              Create Purchase Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResultsView;