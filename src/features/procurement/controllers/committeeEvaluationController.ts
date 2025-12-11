import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { AxiosError } from "axios";
import { getCurrentUser } from "@/utils/auth";
import {
  ICommitteeMemberEvaluation,
  IMemberParticipation,
  IConsensusResults,
  IVendorEvaluation,
  IVendorConsensusScore
} from "../types/cba";

// API Base URLs
const CBA_BASE_URL = "procurements/cba/";
const CBA_ANALYSIS_BASE_URL = "procurements/cba-analysis-submission/";
const CBA_SIGNATURE_WORKFLOW_BASE_URL = "procurements/cba-signature-workflow/";

// Current user hook using actual auth system
export const useCurrentUser = () => {
  const user = getCurrentUser();

  // Return null if no user data exists
  if (!user) {
    return {
      id: "",
      name: "Unknown User",
      designation: "Staff Member",
      email: "",
      role: ""
    };
  }

  return {
    id: user?.id || user?.user_id || "",
    name: user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Unknown User",
    designation: user?.designation || user?.role || "Staff Member",
    email: user?.email || "",
    role: user?.role || user?.designation || ""
  };
};

// Get member evaluation for current user
export const useGetMemberEvaluation = (cbaId: string, memberId: string) => {
  return useQuery<ICommitteeMemberEvaluation | null>({
    queryKey: ["member-evaluation", cbaId, memberId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${CBA_ANALYSIS_BASE_URL}?cba_id=${cbaId}&member_id=${memberId}`
        );

        // Return the first evaluation for this member if it exists
        const evaluations = response.data?.results || [];
        return evaluations.find((evaluation: any) => evaluation.member_id === memberId) || null;
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404 || axiosError.response?.status === 405) {
          return null; // No evaluation found yet or method not allowed
        }
        throw new Error("Failed to fetch member evaluation: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!cbaId && !!memberId,
  });
};

// Get all member evaluations for a CBA
export const useGetAllMemberEvaluations = (cbaId: string) => {
  return useQuery<ICommitteeMemberEvaluation[]>({
    queryKey: ["all-member-evaluations", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${CBA_ANALYSIS_BASE_URL}?cba_id=${cbaId}`
        );

        return response.data?.results || [];
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 405) {
          return []; // Method not allowed, return empty array
        }
        throw new Error("Failed to fetch all member evaluations: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!cbaId,
  });
};

// Get member participation status
export const useGetMemberParticipation = (cbaId: string) => {
  return useQuery<IMemberParticipation>({
    queryKey: ["member-participation", cbaId],
    queryFn: async () => {
      try {
        // Get CBA data to get committee members
        const cbaResponse = await AxiosWithToken.get(`${CBA_BASE_URL}${cbaId}/`);
        const cbaData = cbaResponse.data?.data;

        console.log("🔍 Member Participation Debug:", {
          cbaId,
          cbaResponse: cbaResponse.data,
          cbaData,
          committeeMembers: cbaData?.committee_members
        });

        if (!cbaData?.committee_members) {
          throw new Error("CBA has no committee members");
        }

        // Get all evaluations for this CBA
        const evaluationsResponse = await AxiosWithToken.get(
          `${CBA_ANALYSIS_BASE_URL}?cba_id=${cbaId}`
        );
        const evaluations = evaluationsResponse.data?.results || [];

        // Build participation data
        const submittedMemberIds = evaluations
          .filter((evaluation: any) => evaluation.status === 'submitted')
          .map((evaluation: any) => evaluation.member_id);

        const members = cbaData.committee_members.map((member: any) => {
          const hasSubmitted = submittedMemberIds.includes(member.id);
          const evaluation = evaluations.find((evaluation: any) => evaluation.member_id === member.id);

          return {
            id: member.id,
            name: `${member.first_name} ${member.last_name}`,
            email: member.email || '',
            designation: member.designation || '',
            submitted: hasSubmitted,
            status: hasSubmitted ? 'submitted' : 'pending',
            submitted_at: evaluation?.submitted_at ? new Date(evaluation.submitted_at) : undefined
          };
        });

        return {
          cba_id: cbaId,
          total_members: cbaData.committee_members.length,
          submitted_members: submittedMemberIds,
          pending_members: cbaData.committee_members
            .filter((member: any) => !submittedMemberIds.includes(member.id))
            .map((member: any) => member.id),
          members: members
        };
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 405) {
          // Method not allowed, return empty result that matches IMemberParticipation interface
          return {
            cba_id: cbaId,
            total_members: 0,
            submitted_members: [],
            pending_members: [],
            members: []
          };
        }
        throw new Error("Failed to fetch member participation: " + (axiosError.response?.data as any)?.message);
      }
    },
    enabled: !!cbaId,
  });
};

// Submit/update member evaluation
export const useSubmitMemberEvaluation = (cbaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evaluationData: Partial<ICommitteeMemberEvaluation>) => {
      try {
        const payload = {
          cba_id: cbaId,
          member_id: evaluationData.member_id,
          member_name: evaluationData.member_name,
          member_designation: evaluationData.member_designation,
          vendor_evaluations: evaluationData.vendor_evaluations,
          overall_recommendation: evaluationData.overall_recommendation,
          status: evaluationData.status || 'submitted'
        };

        let response;
        if (evaluationData.id) {
          // Update existing evaluation
          response = await AxiosWithToken.put(
            `${CBA_ANALYSIS_BASE_URL}${evaluationData.id}/`,
            payload
          );
        } else {
          // Create new evaluation
          response = await AxiosWithToken.post(
            CBA_ANALYSIS_BASE_URL,
            payload
          );
        }

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to submit evaluation: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      toast.success("Evaluation submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["member-evaluation", cbaId] });
      queryClient.invalidateQueries({ queryKey: ["all-member-evaluations", cbaId] });
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

// Get RFP submissions (placeholder hook)
export const useGetRFPSubmissions = (solicitationId: string) => {
  return useQuery({
    queryKey: ["rfp-submissions", solicitationId],
    queryFn: async () => {
      try {
        if (!solicitationId) {
          return { results: [] };
        }

        // TODO: Implement actual RFP submissions API call
        // For now, return empty results to avoid build errors
        const response = await AxiosWithToken.get(
          `procurements/rfp-submissions/?solicitation_id=${solicitationId}`
        );
        return response.data || { results: [] };
      } catch (error) {
        console.warn("RFP submissions endpoint not implemented:", error);
        return { results: [] };
      }
    },
    enabled: !!solicitationId,
  });
};

// Generate final consensus
export const useGenerateConsensus = (cbaId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        // Submit committee consensus to approve the committee step in workflow
        const response = await AxiosWithToken.post(
          `${CBA_SIGNATURE_WORKFLOW_BASE_URL}${cbaId}/approve-step/`,
          {
            step: 'committee',
            signature_comment: 'Committee consensus reached and approved'
          }
        );

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        throw new Error("Failed to generate consensus: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      toast.success("Committee consensus approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["all-member-evaluations", cbaId] });
      queryClient.invalidateQueries({ queryKey: ["member-participation", cbaId] });
      queryClient.invalidateQueries({ queryKey: ["cba-signature-workflow", cbaId] });
    },
    onError: (error) => {
      console.error("Error generating consensus:", error);
      toast.error("Failed to generate consensus. Please try again.");
    }
  });
};