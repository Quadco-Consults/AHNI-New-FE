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
        // Backend uses "member" field, not "member_id"
        return evaluations.find((evaluation: any) =>
          evaluation.member === memberId || evaluation.member_id === memberId
        ) || null;
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
export const useGetAllMemberEvaluations = (cbaId: string, enabled: boolean = true) => {
  return useQuery<ICommitteeMemberEvaluation[]>({
    queryKey: ["all-member-evaluations", cbaId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `${CBA_BASE_URL}${cbaId}/member-evaluations/`
        );

        console.log("📊 Member Evaluations Response:", response.data);
        return response.data?.data || response.data?.results || [];
      } catch (error) {
        const axiosError = error as AxiosError;
        // Silently handle expected errors for non-committee CBAs
        if (axiosError.response?.status === 404 || axiosError.response?.status === 405) {
          return []; // No evaluations found or method not allowed
        }
        // Only log unexpected errors
        if (axiosError.response?.status !== 404 && axiosError.response?.status === 405) {
          console.error("Failed to fetch member evaluations:", axiosError.response?.status);
        }
        return [];
      }
    },
    enabled: !!cbaId && enabled,
    retry: false, // Don't retry for 404/405 errors
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
    mutationFn: async (evaluationData: any) => {
      try {
        const payload = {
          cba: cbaId,
          selected_bid_submission: evaluationData.selected_bid_submission,
          selected_items: evaluationData.selected_items,
          selected_total: evaluationData.selected_total,
          overall_recommendation: evaluationData.overall_recommendation,
          technical_score: evaluationData.technical_score,
          commercial_score: evaluationData.commercial_score,
          evaluation_criteria_data: evaluationData.evaluation_criteria_data,
          status: evaluationData.status || 'SUBMITTED'
        };

        console.log("📤 Submitting committee member evaluation:", payload);

        // Use the committee member evaluation endpoint
        const response = await AxiosWithToken.post(
          `${CBA_BASE_URL}${cbaId}/member-evaluations/`,
          payload
        );

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("❌ Error submitting member evaluation:", axiosError.response?.data);
        throw new Error("Failed to submit evaluation: " + (axiosError.response?.data as any)?.message);
      }
    },
    onSuccess: () => {
      toast.success("Evaluation submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["member-evaluation", cbaId] });
      queryClient.invalidateQueries({ queryKey: ["all-member-evaluations", cbaId] });
      queryClient.invalidateQueries({ queryKey: ["member-participation", cbaId] });
      queryClient.invalidateQueries({ queryKey: ["cba", cbaId] });
    },
    onError: (error) => {
      console.error("Error submitting evaluation:", error);
      toast.error("Failed to submit evaluation. Please try again.");
    }
  });
};

// Calculate consensus from all member evaluations
export const useCalculateConsensus = (memberEvaluations: ICommitteeMemberEvaluation[] | undefined) => {
  const calculateConsensus = (): IConsensusResults => {
    // Ensure memberEvaluations is an array
    if (!memberEvaluations || !Array.isArray(memberEvaluations) || memberEvaluations.length === 0) {
      return {
        vendor_scores: [],
        recommended_vendor: {} as IVendorConsensusScore,
        agreement_percentage: 0,
        consensus_reached: false
      };
    }

    const vendorScores: { [key: string]: any } = {};

    // Aggregate scores by vendor using evaluation_criteria_data
    memberEvaluations.forEach(evaluation => {
      // Get the selected vendor from this evaluation
      const selectedVendorId = evaluation.selected_bid_submission || '';
      const evaluationCriteria = evaluation.evaluation_criteria_data || [];

      // Process each vendor's evaluation criteria
      evaluationCriteria.forEach((vendorEval: any) => {
        const vendorId = vendorEval.vendor_id;

        if (!vendorScores[vendorId]) {
          vendorScores[vendorId] = {
            id: vendorId,
            name: vendorEval.vendor_name,
            technical_scores: [],
            price_scores: [],
            commercial_scores: [],
            recommendations: [],
            member_scores: [],
            criteria_details: [] // Store detailed criteria for each member
          };
        }

        // Calculate technical score from quality score range
        let technicalScore = 0;
        if (vendorEval.quality_score) {
          const scores = vendorEval.quality_score.split('-').map(Number);
          technicalScore = scores.length === 2 ? (scores[0] + scores[1]) / 2 : 0;
        }

        // Calculate commercial score from price responsiveness (1st = 100, 2nd = 90, 3rd = 80, 4th = 70)
        let commercialScore = 0;
        if (vendorEval.price_responsiveness) {
          const rank = parseInt(vendorEval.price_responsiveness.charAt(0));
          commercialScore = Math.max(110 - (rank * 10), 70);
        }

        vendorScores[vendorId].technical_scores.push(technicalScore);
        vendorScores[vendorId].commercial_scores.push(commercialScore);
        vendorScores[vendorId].price_scores.push(commercialScore); // For backward compatibility
        vendorScores[vendorId].recommendations.push(vendorId === selectedVendorId);
        vendorScores[vendorId].member_scores.push({
          member_id: evaluation.member || evaluation.member_id || '',  // Backend uses "member", not "member_id"
          member_name: evaluation.member_name,
          technical: technicalScore,
          price: commercialScore,
          recommended: vendorId === selectedVendorId
        });

        // Store detailed criteria
        vendorScores[vendorId].criteria_details.push({
          member_id: evaluation.member || evaluation.member_id || '',  // Backend uses "member", not "member_id"
          member_name: evaluation.member_name,
          quality_score: vendorEval.quality_score,
          approved_models: vendorEval.approved_models,
          price_responsiveness: vendorEval.price_responsiveness,
          technical_eligibility: vendorEval.technical_eligibility,
          bank_account_evaluation: vendorEval.bank_account_evaluation,
          experience_evaluation: vendorEval.experience_evaluation,
          grand_total: vendorEval.grand_total,
          delivery_time: vendorEval.delivery_time,
          payment_terms: vendorEval.payment_terms
        });
      });
    });

    // Calculate consensus scores
    const vendorScoresList = Object.values(vendorScores).map((vendor: any) => ({
      ...vendor,
      avg_technical_score: vendor.technical_scores.reduce((a: number, b: number) => a + b, 0) / vendor.technical_scores.length,
      avg_commercial_score: vendor.commercial_scores.reduce((a: number, b: number) => a + b, 0) / vendor.commercial_scores.length,
      avg_price_score: vendor.price_scores.reduce((a: number, b: number) => a + b, 0) / vendor.price_scores.length, // For backward compatibility
      consensus_score: 0, // Will calculate below
      recommendation_rate: vendor.recommendations.filter((r: boolean) => r).length / vendor.recommendations.length
    })).map((vendor: any) => ({
      ...vendor,
      // AHNI uses 60% technical + 40% commercial
      consensus_score: (vendor.avg_technical_score * 0.6) + (vendor.avg_commercial_score * 0.4)
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