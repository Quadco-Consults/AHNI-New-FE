"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import Card from "components/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { Loading } from "components/Loading";
import { toast } from "sonner";
import VendorScoringCard from "./VendorScoringCard";
import {
  useGetMemberEvaluation,
  useSubmitMemberEvaluation,
  useCurrentUser,
  useGetRFPSubmissions,
} from "@/features/procurement/controllers/committeeEvaluationController";
import { useGetSingleCba } from "@/features/procurement/controllers/cbaController";
import { useGetVendorBidSubmissions } from "@/features/procurement/controllers/vendorBidSubmissionsController";
import RFPDocumentViewer from "./RFPDocumentViewer";
import { IVendorEvaluation, IItemSelection } from "@/features/procurement/types/cba";

// Mock vendor data - replace with actual data from CBA
const mockVendorData = [
  {
    id: "vendor-1",
    name: "SOUTHGATE TECHNOLOGIES LIMITED",
    items: [
      {
        id: "item-1",
        description: "Laptop Computer",
        specification: "15\" 4k OLED Display, Intel Core i9 Processor, 32-64GB RAM, 2TB SSD",
        qty: 6,
        unitPrice: 3725192.50,
        total: 22351155.00,
        brand: "Dell"
      },
      {
        id: "item-2",
        description: "USB Headset",
        specification: "Noise-Cancelling USB Headset (H540)",
        qty: 6,
        unitPrice: 69161.00,
        total: 414966.00,
        brand: "Logitech"
      }
    ],
    grandTotal: 25954340.00,
    deliveryTime: "2-3 Weeks",
    paymentTerms: "100% Payment After Delivery",
    technicalEvaluations: [
      { criteria: "Technical Capability", response: "5 years experience in laptop supply and configuration" },
      { criteria: "Delivery Capacity", response: "Can deliver within 2-3 weeks with full setup" }
    ]
  },
  {
    id: "vendor-2",
    name: "TECH SOLUTIONS PLC",
    items: [
      {
        id: "item-1",
        description: "Laptop Computer",
        specification: "14\" HD Display, Intel Core i5 Processor, 16GB RAM, 1TB SSD",
        qty: 6,
        unitPrice: 2500000.00,
        total: 15000000.00,
        brand: "HP"
      },
      {
        id: "item-2",
        description: "USB Headset",
        specification: "Basic USB Headset",
        qty: 6,
        unitPrice: 45000.00,
        total: 270000.00,
        brand: "Generic"
      }
    ],
    grandTotal: 18000000.00,
    deliveryTime: "1-2 Weeks",
    paymentTerms: "50% Upfront, 50% on Delivery",
    technicalEvaluations: [
      { criteria: "Technical Capability", response: "3 years experience in computer supply" },
      { criteria: "Delivery Capacity", response: "Quick delivery with limited setup support" }
    ]
  }
];

const MemberEvaluationDashboard = () => {
  const { id } = useParams() as { id: string };
  const currentUser = useCurrentUser();

  const { data: cbaData, isLoading: cbaLoading } = useGetSingleCba(id);
  const { data: memberEvaluation, isLoading: evaluationLoading } = useGetMemberEvaluation(id, currentUser.id);
  const { mutate: submitEvaluation, isPending: isSubmitting } = useSubmitMemberEvaluation(id);

  // Get actual vendor bid submissions and RFP submissions
  const solicitationId = cbaData?.data?.solicitation?.id;
  const { data: vendorBidSubmissions, isLoading: vendorDataLoading } = useGetVendorBidSubmissions(solicitationId);
  const { data: rfpSubmissions, isLoading: rfpDataLoading } = useGetRFPSubmissions(solicitationId);

  // Determine if this is an RFP-based CBA
  const isRFPBased = rfpSubmissions?.results?.length > 0;

  // Process vendor data from actual submissions or fallback to mock data
  const vendorData = useMemo(() => {
    // RFP-based submissions (documents)
    if (isRFPBased && rfpSubmissions?.results?.length > 0) {
      return rfpSubmissions.results.map((submission: any) => ({
        id: submission.id,
        name: submission.vendor?.name || 'Unknown Vendor',
        type: 'rfp',
        documents: {
          technical: submission.technical_documents || [],
          commercial: submission.commercial_documents || []
        },
        evaluations: submission.evaluations || [],
        submissionDate: submission.created_at,
        // For RFP, we don't have traditional items/pricing
        items: [],
        grandTotal: 0,
        deliveryTime: 'See technical proposal',
        paymentTerms: 'See commercial proposal',
        technicalEvaluations: submission.evaluations || []
      }));
    }

    // Traditional bid submissions (items/pricing)
    if (vendorBidSubmissions?.results?.length > 0) {
      return vendorBidSubmissions.results.map((submission: any) => ({
        id: submission.id,
        name: submission.vendor_name || submission.vendor?.name || 'Unknown Vendor',
        type: 'bid',
        items: submission.bid_items?.map((item: any) => ({
          id: item.id,
          description: item.item?.description || item.description || 'Item',
          specification: item.specification || '',
          qty: item.quantity || 1,
          unitPrice: parseFloat(item.unit_price) || 0,
          total: parseFloat(item.total_price) || 0,
          brand: item.brand || ''
        })) || [],
        grandTotal: parseFloat(submission.total_price) || 0,
        deliveryTime: submission.delivery_time || 'Not specified',
        paymentTerms: submission.payment_terms || 'Not specified',
        technicalEvaluations: submission.technical_responses || []
      }));
    }

    // Fallback to mock data for testing
    console.log("📝 Using mock vendor data - no actual submissions found");
    return mockVendorData.map(vendor => ({ ...vendor, type: 'bid' }));
  }, [vendorBidSubmissions, rfpSubmissions, isRFPBased]);

  // Local state for evaluation data
  const [evaluation, setEvaluation] = useState<{
    vendor_evaluations: IVendorEvaluation[];
    overall_recommendation: string;
    status: 'pending' | 'submitted' | 'approved';
  }>({
    vendor_evaluations: [],
    overall_recommendation: '',
    status: 'pending'
  });

  // Initialize evaluation data
  useEffect(() => {
    if (memberEvaluation) {
      setEvaluation({
        vendor_evaluations: memberEvaluation.vendor_evaluations || [],
        overall_recommendation: memberEvaluation.overall_recommendation || '',
        status: memberEvaluation.status || 'pending'
      });
    } else {
      // Initialize with empty evaluations for each vendor
      const initialEvaluations = vendorData.map(vendor => ({
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        technical_score: 0,
        price_score: 0,
        overall_score: 0,
        technical_comments: '',
        price_comments: '',
        recommended: false,
        item_selections: vendor.items.map(item => ({
          item_id: item.id,
          selected: false
        }))
      }));

      setEvaluation({
        vendor_evaluations: initialEvaluations,
        overall_recommendation: '',
        status: 'pending'
      });
    }
  }, [memberEvaluation, vendorData]);

  // Calculate evaluation progress
  const evaluationProgress = useMemo(() => {
    const totalVendors = evaluation.vendor_evaluations.length;
    const evaluatedVendors = evaluation.vendor_evaluations.filter(
      ve => ve.technical_score > 0 && ve.price_score > 0 && ve.technical_comments && ve.price_comments
    ).length;

    return {
      completed: evaluatedVendors,
      total: totalVendors,
      percentage: totalVendors > 0 ? Math.round((evaluatedVendors / totalVendors) * 100) : 0
    };
  }, [evaluation.vendor_evaluations]);

  // Check if evaluation is complete
  const isEvaluationComplete = useMemo(() => {
    return (
      evaluationProgress.percentage === 100 &&
      evaluation.overall_recommendation.trim().length > 0 &&
      evaluation.vendor_evaluations.some(ve => ve.recommended)
    );
  }, [evaluationProgress.percentage, evaluation.overall_recommendation, evaluation.vendor_evaluations]);

  // Handle vendor evaluation updates
  const handleVendorUpdate = (vendorId: string, field: string, value: any, itemId?: string) => {
    setEvaluation(prev => ({
      ...prev,
      vendor_evaluations: prev.vendor_evaluations.map(ve => {
        if (ve.vendor_id !== vendorId) return ve;

        if (field === 'item_selection') {
          const { itemId: targetItemId, selected } = value;
          return {
            ...ve,
            item_selections: ve.item_selections.map(is =>
              is.item_id === targetItemId ? { ...is, selected } : is
            )
          };
        }

        const updatedVe = { ...ve, [field]: value };

        // Recalculate overall score when technical or price score changes
        if (field === 'technical_score' || field === 'price_score') {
          updatedVe.overall_score = Math.round((updatedVe.technical_score * 0.7) + (updatedVe.price_score * 0.3));
        }

        return updatedVe;
      })
    }));
  };

  // Handle submission (save draft)
  const handleSaveDraft = async () => {
    const submissionData = {
      cba: id,
      vendor_evaluations: evaluation.vendor_evaluations,
      overall_recommendation: evaluation.overall_recommendation,
    };

    try {
      await submitEvaluation(submissionData);
      toast.success("Evaluation saved as draft");
    } catch (error) {
      toast.error("Failed to save evaluation");
    }
  };

  // Handle final submission
  const handleSubmit = () => {
    if (!isEvaluationComplete) {
      toast.error("Please complete all vendor evaluations and provide an overall recommendation");
      return;
    }

    const submissionData = {
      id: memberEvaluation?.id,
      cba_id: id,
      member_id: currentUser.id,
      member_name: currentUser.name,
      member_designation: currentUser.designation,
      vendor_evaluations: evaluation.vendor_evaluations,
      overall_recommendation: evaluation.overall_recommendation,
      status: 'submitted' as const
    };

    submitEvaluation(submissionData);
  };

  if (cbaLoading || evaluationLoading || vendorDataLoading || rfpDataLoading) {
    return <Loading />;
  }

  // Debug logging to understand the evaluation process
  console.log("🔍 Member Evaluation Dashboard Debug:", {
    cbaId: id,
    currentUser,
    memberEvaluation,
    evaluation,
    evaluationProgress,
    isEvaluationComplete,
    isSubmitted: evaluation.status === 'submitted',
    solicitationId,
    vendorBidSubmissions,
    vendorData,
    vendorCount: vendorData.length
  });

  const isSubmitted = evaluation.status === 'submitted';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Committee Member Evaluation</h2>
          <p className="text-gray-600 mt-1">
            Evaluate vendors and provide your technical and commercial assessment
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant={isSubmitted ? "default" : "secondary"} className="text-sm">
            {isSubmitted ? "Submitted" : "In Progress"}
          </Badge>

          {!isSubmitted && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="text-blue-600 border-blue-600"
              >
                {isSubmitting ? (
                  <>
                    <Icon icon="eos-icons:loading" className="w-4 h-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Draft"
                )}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={!isEvaluationComplete || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Icon icon="eos-icons:loading" className="w-4 h-4 mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Evaluation"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Card */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-blue-900">Evaluation Progress</h3>
            <p className="text-sm text-blue-700">
              {evaluationProgress.completed} of {evaluationProgress.total} vendors evaluated
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">{evaluationProgress.percentage}%</div>
            <div className="text-sm text-blue-700">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${evaluationProgress.percentage}%` }}
          />
        </div>

        {/* Completion Checklist */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon
              icon={evaluationProgress.percentage === 100 ? "mdi:check-circle" : "mdi:clock-outline"}
              className={evaluationProgress.percentage === 100 ? "text-green-600" : "text-yellow-600"}
            />
            <span>All vendors evaluated</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon
              icon={evaluation.overall_recommendation ? "mdi:check-circle" : "mdi:clock-outline"}
              className={evaluation.overall_recommendation ? "text-green-600" : "text-yellow-600"}
            />
            <span>Overall recommendation provided</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon
              icon={evaluation.vendor_evaluations.some(ve => ve.recommended) ? "mdi:check-circle" : "mdi:clock-outline"}
              className={evaluation.vendor_evaluations.some(ve => ve.recommended) ? "text-green-600" : "text-yellow-600"}
            />
            <span>At least one vendor recommended</span>
          </div>
        </div>
      </Card>

      {/* Vendor Evaluation Cards */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Icon icon="carbon:analytics" className="w-5 h-5 mr-2" />
          Vendor Evaluations
        </h3>

        {vendorData.length > 0 ? (
          <div className="space-y-6">
            {/* Show evaluation type indicator */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Icon
                icon={isRFPBased ? "mdi:file-document-multiple" : "mdi:format-list-numbered"}
                className="w-4 h-4"
              />
              <span>
                {isRFPBased
                  ? `Document-based evaluation (${vendorData.length} RFP submissions)`
                  : `Item-based evaluation (${vendorData.length} bid submissions)`
                }
              </span>
            </div>

            {isRFPBased ? (
              // RFP Document Review Interface
              <div className="space-y-6">
                {vendorData.map(vendor => (
                  <div key={vendor.id} className="space-y-4">
                    {/* RFP Document Viewer */}
                    <RFPDocumentViewer
                      submission={{
                        id: vendor.id,
                        vendor: {
                          id: vendor.id,
                          name: vendor.name
                        },
                        technical_documents: vendor.documents?.technical || [],
                        commercial_documents: vendor.documents?.commercial || [],
                        evaluations: vendor.evaluations || [],
                        created_at: vendor.submissionDate || new Date().toISOString()
                      }}
                      onEvaluate={(vendorId) => {
                        // Scroll to scoring section or open scoring modal
                        console.log("Evaluate vendor:", vendorId);
                      }}
                    />

                    {/* Scoring Card for RFP */}
                    <VendorScoringCard
                      vendor={vendor}
                      evaluation={evaluation.vendor_evaluations.find(ve => ve.vendor_id === vendor.id)}
                      onUpdate={(field, value, itemId) => handleVendorUpdate(vendor.id, field, value, itemId)}
                      disabled={isSubmitted}
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Traditional Bid Evaluation Interface
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vendorData.map(vendor => {
                  const vendorEvaluation = evaluation.vendor_evaluations.find(ve => ve.vendor_id === vendor.id);

                  return (
                    <VendorScoringCard
                      key={vendor.id}
                      vendor={vendor}
                      evaluation={vendorEvaluation}
                      onUpdate={(field, value, itemId) => handleVendorUpdate(vendor.id, field, value, itemId)}
                      disabled={isSubmitted}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Icon icon="mdi:inbox-outline" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Vendor Submissions</h3>
            <p className="text-gray-500 mb-4">
              No vendor bid submissions found for this CBA. Vendors need to submit their bids before evaluation can begin.
            </p>
            <div className="text-sm text-gray-400 bg-gray-50 p-3 rounded">
              <strong>Solicitation ID:</strong> {solicitationId || 'Not found'}<br/>
              <strong>Status:</strong> {vendorDataLoading ? 'Loading...' : 'No submissions available'}
            </div>
          </Card>
        )}
      </div>

      {/* Overall Recommendation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Icon icon="carbon:recommendation" className="w-5 h-5 mr-2" />
          Overall Recommendation
        </h3>

        <Textarea
          value={evaluation.overall_recommendation}
          onChange={(e) => setEvaluation(prev => ({ ...prev, overall_recommendation: e.target.value }))}
          placeholder="Provide your overall recommendation based on the vendor evaluations above. Include justification for your preferred vendor choice and any additional considerations..."
          disabled={isSubmitted}
          rows={4}
          className="w-full"
        />

        {evaluation.overall_recommendation && (
          <div className="mt-2 text-sm text-gray-600">
            {evaluation.overall_recommendation.length} characters
          </div>
        )}
      </Card>

      {/* Committee Member Info */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div><strong>Evaluator:</strong> {currentUser.name}</div>
          <div><strong>Designation:</strong> {currentUser.designation}</div>
          <div><strong>CBA ID:</strong> {id}</div>
          {evaluation.status === 'submitted' && memberEvaluation?.submitted_at && (
            <div><strong>Submitted:</strong> {new Date(memberEvaluation.submitted_at).toLocaleDateString()}</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MemberEvaluationDashboard;