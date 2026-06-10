"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  Award,
  ShoppingCart,
  Building2,
  DollarSign,
  Calendar,
  Shield
} from 'lucide-react';
import CbaAPI from "@/features/procurement/controllers/cbaController";
import { useGetSolicitationSubmission } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import { useCurrentUser, useSubmitMemberEvaluation } from "@/features/procurement/controllers/committeeEvaluationController";
import { CommitteeMemberData } from "@/features/procurement/types/cba";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import GoBack from "@/components/GoBack";
import { CBALoadingState } from "@/features/procurement/components/competitive-bid-analysis/LoadingStates";
import { CBAErrorBoundary } from "@/features/procurement/components/competitive-bid-analysis/ErrorBoundary";

// Import sub-components
import { VendorComparisonTable } from "./vendor-analysis/VendorComparisonTable";
import { EvaluationCriteriaPanel } from "./vendor-analysis/EvaluationCriteriaPanel";
import { SelectedItemsSummary } from "./vendor-analysis/SelectedItemsSummary";
import { AwardRecommendationPanel } from "./vendor-analysis/AwardRecommendationPanel";
import { sampleVendorData } from "./vendor-analysis/sampleData";
import { VendorData, SelectedItem, EvaluationScores } from "./vendor-analysis/types";

/**
 * Vendor Bid Analysis - Redesigned
 * Clean, professional enterprise UI for CBA vendor evaluation
 */
const VendorBidAnalysisRedesigned = () => {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const cbaId = searchParams?.get('cba') || id;
  const solicitationId = searchParams?.get('id');

  // State management
  const [vendorData, setVendorData] = useState<VendorData[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [evaluationScores, setEvaluationScores] = useState<EvaluationScores>({
    qualityScores: {},
    priceResponsiveness: {},
    technicalEligibility: {},
    bankAccountEvaluation: {},
    experienceEvaluation: {},
  });
  const [awardRecommendation, setAwardRecommendation] = useState("");
  const [activeTab, setActiveTab] = useState("comparison");

  // API calls
  const { data: cbaData, isLoading: cbaLoading } = CbaAPI.useGetSingleCba(cbaId as string);
  const { data: submissionData, isLoading: submissionLoading } = useGetSolicitationSubmission(
    solicitationId || "",
    !!solicitationId
  );

  const currentUser = useCurrentUser();
  const { mutateAsync: submitMemberEvaluation, isPending: submittingMemberEval } =
    useSubmitMemberEvaluation(cbaId as string);
  const { modifyCba, isLoading: submittingAnalysis } = CbaAPI.useModifyCba(cbaId as string);

  // Check if current user is a committee member
  const isCommitteeMember = useMemo(() => {
    if (!cbaData?.data?.committee_members || !currentUser.id) {
      return false;
    }
    return cbaData.data.committee_members.some(
      (member: CommitteeMemberData) => member.id === currentUser.id
    );
  }, [cbaData?.data?.committee_members, currentUser.id]);

  // Process vendor submission data
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("📊 Processing vendor submissions:", {
        solicitationId,
        hasData: !!submissionData,
        resultsCount: (submissionData as any)?.data?.results?.length || 0
      });
    }

    if (!solicitationId) {
      setVendorData(sampleVendorData);
      return;
    }

    const apiResults = (submissionData as any)?.data?.data?.results || (submissionData as any)?.data?.results;

    if (apiResults && apiResults.length > 0) {
      const processedVendors: VendorData[] = apiResults.map((submission: any) => {
        const items = submission.bid_items?.map((bidItem: any, index: number) => ({
          id: bidItem.id || `item-${submission.id}-${index}`,
          description: bidItem.solicitation_item_name || `Item ${index + 1}`,
          specification: `Quantity: ${bidItem.solicitation_item_quantity} units`,
          qty: parseInt(bidItem.solicitation_item_quantity || 0),
          brand: bidItem.brand || "Generic",
          unitPrice: parseFloat(bidItem.unit_price || 0),
          total: parseFloat(bidItem.total_price || 0),
          selected: false
        })) || [];

        const technicalEvaluations = submission.evaluations?.map((evaluation: any) => ({
          criteria: evaluation.evaluation_criteria?.name || "Technical Criteria",
          response: evaluation.response || "No response provided"
        })) || [];

        return {
          id: submission.id,
          vendorId: submission.vendor?.id,
          name: submission.vendor?.company_name || `Vendor ${submission.id?.slice(0, 8)}`,
          items,
          grandTotal: parseFloat(submission.bid_details?.total_amount || items.reduce((sum, item) => sum + item.total, 0)),
          deliveryTime: submission.delivery_time || "2-3 Weeks",
          paymentTerms: submission.payment_terms || "100% Payment After Delivery",
          tin: submission.vendor?.company_registration_number || "N/A",
          validityPeriod: submission.validity_period || "30 Days",
          bankAccount: submission.vendor?.status === "Approved" ? "YES" : "NO",
          cacRegistration: submission.vendor?.company_registration_number ? "YES" : "NO",
          workExperience: submission.vendor?.type_of_business ? "YES" : "NO",
          currency: submission.currency || "Naira",
          warranty: submission.warranty || "Standard Warranty",
          technicalEvaluations
        };
      });

      setVendorData(processedVendors);
    } else {
      setVendorData(sampleVendorData);
    }
  }, [submissionData, solicitationId]);

  // Handle item selection
  const handleItemSelection = (vendorId: string, itemId: string, checked: boolean) => {
    const vendor = vendorData.find(v => v.id === vendorId);
    const item = vendor?.items.find(i => i.id === itemId);

    if (!vendor || !item) return;

    if (checked) {
      const selectedItem: SelectedItem = {
        vendorId: vendor.id,
        vendorName: vendor.name,
        itemId: item.id,
        description: item.description,
        qty: item.qty,
        unitPrice: item.unitPrice,
        total: item.total,
        brand: item.brand
      };
      setSelectedItems(prev => [...prev.filter(si => !(si.vendorId === vendorId && si.itemId === itemId)), selectedItem]);
    } else {
      setSelectedItems(prev => prev.filter(si => !(si.vendorId === vendorId && si.itemId === itemId)));
    }

    setVendorData(prev => prev.map(v =>
      v.id === vendorId
        ? {
            ...v,
            items: v.items.map(i =>
              i.id === itemId ? { ...i, selected: checked } : i
            )
          }
        : v
    ));
  };

  // Handle select all vendor items
  const handleSelectAllVendorItems = (vendorId: string) => {
    const vendor = vendorData.find(v => v.id === vendorId);
    if (!vendor) return;

    const allSelected = vendor.items.every(item => item.selected);
    const newSelectionState = !allSelected;

    if (newSelectionState) {
      const vendorSelectedItems = vendor.items.map(item => ({
        vendorId: vendor.id,
        vendorName: vendor.name,
        itemId: item.id,
        description: item.description,
        qty: item.qty,
        unitPrice: item.unitPrice,
        total: item.total,
        brand: item.brand
      }));

      setSelectedItems(prev => [
        ...prev.filter(si => si.vendorId !== vendorId),
        ...vendorSelectedItems
      ]);
    } else {
      setSelectedItems(prev => prev.filter(si => si.vendorId !== vendorId));
    }

    setVendorData(prev => prev.map(v =>
      v.id === vendorId
        ? {
            ...v,
            items: v.items.map(item => ({ ...item, selected: newSelectionState }))
          }
        : v
    ));
  };

  // Calculate selected total
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.total, 0);

  // Handle submit analysis
  const handleSubmitAnalysis = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item from vendors before submitting");
      return;
    }

    const itemsByVendor = selectedItems.reduce((acc, item) => {
      if (!acc[item.vendorId]) {
        acc[item.vendorId] = { vendorName: item.vendorName, items: [] };
      }
      acc[item.vendorId].items.push(item);
      return acc;
    }, {} as Record<string, { vendorName: string; items: SelectedItem[] }>);

    const vendorIds = Object.keys(itemsByVendor);
    if (vendorIds.length > 1) {
      toast.error("Currently, the system only supports selecting items from a single vendor. Please select items from only one vendor.");
      return;
    }

    const selectedSubmissionId = vendorIds[0];
    const selectedVendorItems = itemsByVendor[selectedSubmissionId];
    const selectedVendor = vendorData.find(v => v.id === selectedSubmissionId);

    // Prepare vendor evaluations
    const vendorEvaluations = vendorData.map(vendor => {
      const brands = vendor.items
        .map(item => item.brand)
        .filter((brand): brand is string => !!brand && brand.trim() !== '');
      const uniqueBrands = [...new Set(brands)];
      const brandsText = uniqueBrands.length > 0 ? uniqueBrands.join(', ') : null;

      return {
        vendor_id: vendor.vendorId || vendor.id,
        vendor_name: vendor.name,
        quality_score: evaluationScores.qualityScores[vendor.id] || null,
        approved_models: brandsText,
        price_responsiveness: evaluationScores.priceResponsiveness[vendor.id] || null,
        technical_eligibility: evaluationScores.technicalEligibility[vendor.id] || null,
        bank_account_evaluation: evaluationScores.bankAccountEvaluation[vendor.id] || null,
        experience_evaluation: evaluationScores.experienceEvaluation[vendor.id] || null,
        grand_total: vendor.grandTotal,
        delivery_time: vendor.deliveryTime,
        payment_terms: vendor.paymentTerms,
        tin: vendor.tin,
        validity_period: vendor.validityPeriod,
        currency: vendor.currency,
        warranty: vendor.warranty
      };
    });

    const analysisPayload = {
      selected_bid_submission: selectedSubmissionId,
      selected_items: selectedItems.map(item => item.itemId),
      recommendation_note: awardRecommendation || `Award recommended to ${selectedVendorItems.vendorName} for ${selectedItems.length} items with total value of ₦${selectedTotal.toLocaleString()}`,
      selected_total: selectedTotal,
      vendor_evaluations: vendorEvaluations,
      evaluation_metadata: {
        evaluated_by: cbaData?.data?.created_by || "System",
        evaluation_date: new Date().toISOString(),
        total_vendors_evaluated: vendorData.length,
        selected_vendor_id: selectedVendor?.vendorId || selectedSubmissionId
      }
    };

    try {
      if (isCommitteeMember) {
        // Committee member evaluation
        const evaluationCriteriaData = vendorEvaluations.map(vendorEval => ({
          vendor_id: vendorEval.vendor_id,
          vendor_name: vendorEval.vendor_name,
          quality_score: vendorEval.quality_score,
          approved_models: vendorEval.approved_models,
          price_responsiveness: vendorEval.price_responsiveness,
          technical_eligibility: vendorEval.technical_eligibility,
          bank_account_evaluation: vendorEval.bank_account_evaluation,
          experience_evaluation: vendorEval.experience_evaluation,
          grand_total: vendorEval.grand_total,
          delivery_time: vendorEval.delivery_time,
          payment_terms: vendorEval.payment_terms,
          tin: vendorEval.tin,
          validity_period: vendorEval.validity_period,
          currency: vendorEval.currency,
          warranty: vendorEval.warranty
        }));

        const selectedVendorEval = vendorEvaluations.find(v => v.vendor_id === selectedSubmissionId);
        let technicalScore = 0;
        let commercialScore = 0;

        if (selectedVendorEval?.quality_score) {
          const scores = selectedVendorEval.quality_score.split('-').map(Number);
          technicalScore = scores.length === 2 ? Math.round((scores[0] + scores[1]) / 2) : 0;
        }

        if (selectedVendorEval?.price_responsiveness) {
          const rank = parseInt(selectedVendorEval.price_responsiveness.charAt(0));
          commercialScore = Math.max(110 - (rank * 10), 70);
        }

        const memberEvaluationPayload = {
          selected_bid_submission: selectedSubmissionId,
          selected_items: selectedItems.map(item => item.itemId),
          selected_total: selectedTotal,
          overall_recommendation: awardRecommendation || `Award recommended to ${selectedVendorItems.vendorName}`,
          technical_score: technicalScore,
          commercial_score: commercialScore,
          evaluation_criteria_data: evaluationCriteriaData,
          status: 'SUBMITTED'
        };

        await submitMemberEvaluation(memberEvaluationPayload);
        toast.success("Committee evaluation submitted successfully!");

        await queryClient.invalidateQueries({ queryKey: ["cba", cbaId] });
        await queryClient.invalidateQueries({ queryKey: ["member-evaluation", cbaId] });
        await queryClient.invalidateQueries({ queryKey: ["all-member-evaluations", cbaId] });

        setTimeout(() => {
          router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/analysis-results?id=${solicitationId}&cba=${cbaId}`);
        }, 1500);
      } else {
        // Non-committee member submission
        await modifyCba(analysisPayload);
        toast.success(`Analysis submitted successfully! Selected ${selectedItems.length} items from ${selectedVendorItems.vendorName} with total: ₦${selectedTotal.toLocaleString()}`);

        await queryClient.invalidateQueries({ queryKey: ["cba", cbaId] });
        await queryClient.invalidateQueries({ queryKey: ["cbas"] });

        setTimeout(() => {
          router.push(`/dashboard/procurement/competitive-bid-analysis/${cbaId}/analysis-results?id=${solicitationId}&cba=${cbaId}`);
        }, 1500);
      }
    } catch (error) {
      console.error("CBA Analysis submission error:", error);
      toast.error("Failed to submit analysis. Please try again.");
    }
  };

  if (cbaLoading || submissionLoading) {
    return <CBALoadingState message="Loading vendor submissions..." />;
  }

  return (
    <CBAErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <GoBack />
                <div className="h-8 w-px bg-slate-300" />
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Vendor Bid Analysis</h1>
                  <p className="text-sm text-slate-600">Evaluate and compare vendor submissions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-4 py-2 bg-blue-50 text-blue-700 border-blue-300">
                  <Building2 className="w-4 h-4 mr-2" />
                  {vendorData.length} Vendors
                </Badge>
                {isCommitteeMember && (
                  <Badge variant="outline" className="px-4 py-2 bg-purple-50 text-purple-700 border-purple-300">
                    <Shield className="w-4 h-4 mr-2" />
                    Committee Member
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 p-1 rounded-lg">
              <TabsTrigger
                value="comparison"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Item Comparison
              </TabsTrigger>
              <TabsTrigger
                value="evaluation"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Evaluation Criteria
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Selected Items
              </TabsTrigger>
              <TabsTrigger
                value="recommendation"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <Award className="w-4 h-4 mr-2" />
                Recommendation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-6">
              <VendorComparisonTable
                vendorData={vendorData}
                onItemSelection={handleItemSelection}
                onSelectAllVendorItems={handleSelectAllVendorItems}
              />
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-6">
              <EvaluationCriteriaPanel
                vendorData={vendorData}
                evaluationScores={evaluationScores}
                setEvaluationScores={setEvaluationScores}
              />
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <SelectedItemsSummary
                selectedItems={selectedItems}
                selectedTotal={selectedTotal}
              />
            </TabsContent>

            <TabsContent value="recommendation" className="space-y-6">
              <AwardRecommendationPanel
                awardRecommendation={awardRecommendation}
                setAwardRecommendation={setAwardRecommendation}
                cbaData={cbaData}
                solicitationId={solicitationId}
              />
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">
                  {selectedItems.length} items selected • Total: <span className="font-bold text-slate-900">₦{selectedTotal.toLocaleString()}</span>
                </p>
              </div>
              <Button
                onClick={handleSubmitAnalysis}
                disabled={selectedItems.length === 0 || submittingAnalysis || submittingMemberEval}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submittingAnalysis || submittingMemberEval ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    {isCommitteeMember ? "Submitting Evaluation..." : "Submitting Analysis..."}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {isCommitteeMember ? "Submit Evaluation" : "Submit Analysis"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CBAErrorBoundary>
  );
};

export default VendorBidAnalysisRedesigned;
