import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  ICommitteeMemberEvaluation,
  IMemberParticipation,
  IConsensusResults,
  IVendorEvaluation,
  IVendorConsensusScore
} from "../types/cba";

// Mock data for development - replace with actual API calls when backend is ready
const mockMemberEvaluations: ICommitteeMemberEvaluation[] = [
  {
    id: "eval-1",
    cba_id: "cba-123",
    member_id: "member-1",
    member_name: "John Doe",
    member_designation: "Senior Procurement Officer",
    vendor_evaluations: [
      {
        vendor_id: "vendor-1",
        vendor_name: "SOUTHGATE TECHNOLOGIES LIMITED",
        technical_score: 85,
        price_score: 75,
        overall_score: 81,
        technical_comments: "Strong technical capability, good track record",
        price_comments: "Competitive pricing, reasonable terms",
        recommended: true,
        item_selections: [
          { item_id: "item-1", selected: true },
          { item_id: "item-2", selected: true },
        ]
      },
      {
        vendor_id: "vendor-2",
        vendor_name: "TECH SOLUTIONS PLC",
        technical_score: 70,
        price_score: 90,
        overall_score: 77,
        technical_comments: "Good technical skills but limited experience",
        price_comments: "Very competitive pricing",
        recommended: false,
        item_selections: [
          { item_id: "item-1", selected: false },
          { item_id: "item-2", selected: true },
        ]
      }
    ],
    overall_recommendation: "Recommend SOUTHGATE TECHNOLOGIES for technical superiority",
    status: "submitted",
    submitted_at: new Date("2025-01-01"),
    created_at: new Date("2025-01-01"),
    updated_at: new Date("2025-01-01")
  },
  {
    id: "eval-2",
    cba_id: "cba-123",
    member_id: "member-2",
    member_name: "Jane Smith",
    member_designation: "Technical Analyst",
    vendor_evaluations: [
      {
        vendor_id: "vendor-1",
        vendor_name: "SOUTHGATE TECHNOLOGIES LIMITED",
        technical_score: 90,
        price_score: 70,
        overall_score: 83,
        technical_comments: "Excellent technical specifications and experience",
        price_comments: "Price is higher but justified by quality",
        recommended: true,
        item_selections: [
          { item_id: "item-1", selected: true },
          { item_id: "item-2", selected: true },
        ]
      },
      {
        vendor_id: "vendor-2",
        vendor_name: "TECH SOLUTIONS PLC",
        technical_score: 65,
        price_score: 95,
        overall_score: 75,
        technical_comments: "Meets basic requirements but lacks advanced features",
        price_comments: "Best price offer in the market",
        recommended: false,
        item_selections: [
          { item_id: "item-1", selected: false },
          { item_id: "item-2", selected: false },
        ]
      }
    ],
    overall_recommendation: "SOUTHGATE TECHNOLOGIES despite higher cost",
    status: "submitted",
    submitted_at: new Date("2025-01-01"),
    created_at: new Date("2025-01-01"),
    updated_at: new Date("2025-01-01")
  }
];

const mockMemberParticipation: IMemberParticipation = {
  cba_id: "cba-123",
  total_members: 3,
  submitted_members: ["member-1", "member-2"],
  pending_members: ["member-3"],
  members: [
    {
      id: "member-1",
      name: "John Doe",
      designation: "Senior Procurement Officer",
      submitted: true,
      submitted_at: new Date("2025-01-01")
    },
    {
      id: "member-2",
      name: "Jane Smith",
      designation: "Technical Analyst",
      submitted: true,
      submitted_at: new Date("2025-01-01")
    },
    {
      id: "member-3",
      name: "Mike Johnson",
      designation: "Financial Analyst",
      submitted: false
    }
  ]
};

// Get member evaluation for current user
export const useGetMemberEvaluation = (cbaId: string, memberId: string) => {
  return useQuery<ICommitteeMemberEvaluation | null>({
    queryKey: ["member-evaluation", cbaId, memberId],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return mock data for now
      const evaluation = mockMemberEvaluations.find(
        eval => eval.cba_id === cbaId && eval.member_id === memberId
      );

      return evaluation || null;
    },
    enabled: !!cbaId && !!memberId,
  });
};

// Get all member evaluations for a CBA
export const useGetAllMemberEvaluations = (cbaId: string) => {
  return useQuery<ICommitteeMemberEvaluation[]>({
    queryKey: ["all-member-evaluations", cbaId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));

      return mockMemberEvaluations.filter(eval => eval.cba_id === cbaId);
    },
    enabled: !!cbaId,
  });
};

// Get member participation status
export const useGetMemberParticipation = (cbaId: string) => {
  return useQuery<IMemberParticipation>({
    queryKey: ["member-participation", cbaId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));

      return mockMemberParticipation;
    },
    enabled: !!cbaId,
  });
};

// Submit/update member evaluation
export const useSubmitMemberEvaluation = (cbaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evaluationData: Partial<ICommitteeMemberEvaluation>) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Submitting member evaluation:", evaluationData);

      // Mock successful response
      return {
        id: evaluationData.id || `eval-${Date.now()}`,
        ...evaluationData,
        status: 'submitted',
        submitted_at: new Date()
      };
    },
    onSuccess: () => {
      toast.success("Evaluation submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["member-evaluation", cbaId] });
      queryClient.invalidateQueries({ queryKey: ["member-participation", cbaId] });
    },
    onError: (error) => {
      console.error("Error submitting evaluation:", error);
      toast.error("Failed to submit evaluation. Please try again.");
    }
  });
};

// Calculate consensus from all member evaluations
export const useCalculateConsensus = (memberEvaluations: ICommitteeMemberEvaluation[]) => {
  const calculateConsensus = (): IConsensusResults => {
    if (!memberEvaluations || memberEvaluations.length === 0) {
      return {
        vendor_scores: [],
        recommended_vendor: {} as IVendorConsensusScore,
        agreement_percentage: 0,
        consensus_reached: false
      };
    }

    const vendorScores: { [key: string]: any } = {};

    // Aggregate scores by vendor
    memberEvaluations.forEach(evaluation => {
      evaluation.vendor_evaluations.forEach(vendorEval => {
        if (!vendorScores[vendorEval.vendor_id]) {
          vendorScores[vendorEval.vendor_id] = {
            id: vendorEval.vendor_id,
            name: vendorEval.vendor_name,
            technical_scores: [],
            price_scores: [],
            recommendations: [],
            member_scores: []
          };
        }

        vendorScores[vendorEval.vendor_id].technical_scores.push(vendorEval.technical_score);
        vendorScores[vendorEval.vendor_id].price_scores.push(vendorEval.price_score);
        vendorScores[vendorEval.vendor_id].recommendations.push(vendorEval.recommended);
        vendorScores[vendorEval.vendor_id].member_scores.push({
          member_id: evaluation.member_id,
          member_name: evaluation.member_name,
          technical: vendorEval.technical_score,
          price: vendorEval.price_score,
          recommended: vendorEval.recommended
        });
      });
    });

    // Calculate consensus scores
    const vendorScoresList = Object.values(vendorScores).map((vendor: any) => ({
      ...vendor,
      avg_technical_score: vendor.technical_scores.reduce((a: number, b: number) => a + b, 0) / vendor.technical_scores.length,
      avg_price_score: vendor.price_scores.reduce((a: number, b: number) => a + b, 0) / vendor.price_scores.length,
      consensus_score: 0, // Will calculate below
      recommendation_rate: vendor.recommendations.filter((r: boolean) => r).length / vendor.recommendations.length
    })).map((vendor: any) => ({
      ...vendor,
      consensus_score: (vendor.avg_technical_score * 0.7) + (vendor.avg_price_score * 0.3)
    }));

    // Find recommended vendor (highest consensus score)
    const recommendedVendor = vendorScoresList
      .sort((a, b) => b.consensus_score - a.consensus_score)[0];

    // Calculate agreement percentage
    const agreementPercentage = recommendedVendor
      ? Math.round(recommendedVendor.recommendation_rate * 100)
      : 0;

    return {
      vendor_scores: vendorScoresList,
      recommended_vendor: recommendedVendor,
      agreement_percentage: agreementPercentage,
      consensus_reached: agreementPercentage >= 60 // 60% threshold for consensus
    };
  };

  return { calculateConsensus };
};

// Generate final consensus
export const useGenerateConsensus = (cbaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log("Generating consensus for CBA:", cbaId);

      // Mock successful consensus generation
      return {
        success: true,
        message: "Consensus generated successfully"
      };
    },
    onSuccess: () => {
      toast.success("Consensus analysis generated successfully!");
      queryClient.invalidateQueries({ queryKey: ["consensus-analysis", cbaId] });
    },
    onError: (error) => {
      console.error("Error generating consensus:", error);
      toast.error("Failed to generate consensus. Please try again.");
    }
  });
};

// Hook to get current user (mock for now)
export const useCurrentUser = () => {
  // Mock current user - replace with actual auth context
  return {
    id: "member-1",
    name: "John Doe",
    designation: "Senior Procurement Officer",
    email: "john.doe@ahni.ng"
  };
};