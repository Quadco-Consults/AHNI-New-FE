"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import PersonIcon from "@/components/icons/Person";
import { LoadingSpinner } from "@/components/Loading";
import Card from "@/components/Card";
import { toast } from "sonner";
import { useState } from "react";
import BackNavigation from "@/components/BackNavigation";
import {
  useGetSingleAdhocApplicant,
  useShortlistApplicants,
  useSelectApplicant,
  useHireApplicant,
  useIssueContract
} from "@/features/programs/controllers/adhocApplicantController";
import AdhocApplicantDetailsView from "./AdhocApplicantDetailsView";

export default function AdhocApplicantDetails() {
  const params = useParams();
  const applicantId = params?.applicantId as string;
  const adhocId = params?.id as string;

  const router = useRouter();

  const { data: applicantData, isLoading } = useGetSingleAdhocApplicant(applicantId, !!applicantId);
  const shortlistMutation = useShortlistApplicants();
  const selectApplicantMutation = useSelectApplicant();
  const hireApplicantMutation = useHireApplicant();
  const issueContractMutation = useIssueContract();

  // Debug logging for applicant details
  if (process.env.NODE_ENV === 'development') {
    console.log("📄 AdHoc Applicant Details Debug:");
    console.log("- ApplicantId:", applicantId);
    console.log("- AdHocId:", adhocId);
    console.log("- Has Data:", !!applicantData);
    console.log("- Status:", applicantData?.data?.status);
    console.log("- Full Data:", applicantData);
  }

  const [isModifyLoading, setIsModifyLoading] = useState(false);

  const handleShortListing = async () => {
    setIsModifyLoading(true);
    try {
      await shortlistMutation.mutateAsync({
        applicant_ids: [applicantId],
      });
      toast.success("Applicant Shortlisted Successfully");
      router.back();
    } catch (error: any) {
      console.error("Shortlisting error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setIsModifyLoading(false);
    }
  };

  const handleContractIssuance = async () => {
    setIsModifyLoading(true);
    try {
      console.log("🔄 Starting contract issuance process...");
      console.log("- Applicant ID:", applicantId);
      console.log("- Current Status:", currentStatus);

      // Calculate contract dates (example: 6 months from today)
      const today = new Date();
      const contractStart = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      const sixMonthsLater = new Date(today);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      const contractEnd = sixMonthsLater.toISOString().split('T')[0];

      console.log("📅 Contract dates calculated:", { contractStart, contractEnd });

      // The workflow: INTERVIEWED → SELECTED → HIRED → CONTRACT_ISSUED
      // Step 1: If current status is INTERVIEWED, we need to select first
      if (currentStatus === "INTERVIEWED") {
        console.log("⏳ Step 1: Selecting applicant (INTERVIEWED → SELECTED)...");
        await selectApplicantMutation.mutateAsync({
          applicant_id: applicantId,
        });
        console.log("✅ Step 1 completed: Applicant selected");
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Step 2: Hire the applicant with contract dates (SELECTED → HIRED)
      console.log("⏳ Step 2: Hiring applicant (SELECTED → HIRED)...");

      // TODO: These fields should be collected from a form
      // For now, using applicant's preferred/assigned fields or defaults
      const applicant = applicantData?.data;
      await hireApplicantMutation.mutateAsync({
        applicant_id: applicantId,
        contract_start_date: contractStart,
        contract_end_date: contractEnd,
        salary: "0", // TODO: Get from form
        currency: "NGN",
        payment_frequency: "MONTHLY",
        assigned_health_facility: applicant?.assigned_health_facility || applicant?.preferred_health_facility || "",
        assigned_lga: applicant?.assigned_lga || applicant?.lga_of_origin || "",
      });
      console.log("✅ Step 2 completed: Applicant hired");
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Issue contract (HIRED → CONTRACT_ISSUED)
      console.log("⏳ Step 3: Issuing contract (HIRED → CONTRACT_ISSUED)...");
      await issueContractMutation.mutateAsync({
        applicant_id: applicantId,
      });
      console.log("✅ Step 3 completed: Contract issued");

      toast.success("Contract issued successfully! Applicant can now accept the contract.");

      console.log("🎉 Contract issuance complete! Waiting 2 seconds for backend to propagate...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("📍 Navigating to contract recipients page...");
      router.push(`/dashboard/programs/adhoc/contract-recipients`);
    } catch (error: any) {
      console.error("❌ Contract issuance error:", error);
      console.error("Full error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      console.error("Error message:", error?.message);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to issue contract. Please check console for details."
      );
    } finally {
      setIsModifyLoading(false);
    }
  };

  // Get current status to show appropriate actions
  const currentStatus = applicantData?.data?.status;

  const renderActionButton = () => {
    switch (currentStatus) {
      case "SHORTLISTED":
        return (
          <Button
            className='flex gap-x-[.5rem] items-center bg-blue-600 hover:bg-blue-700'
            disabled={isModifyLoading}
            onClick={() => router.push(`${window.location.pathname.replace('/details', '')}/adhoc-interview`)}
          >
            <PersonIcon />
            <span>Conduct Interview</span>
          </Button>
        );
      case "INTERVIEWED":
      case "SELECTED":
        return (
          <Button
            className='flex gap-x-[.5rem] items-center bg-green-600 hover:bg-green-700'
            disabled={isModifyLoading}
            onClick={handleContractIssuance}
          >
            <PersonIcon />
            <span>Hire Applicant</span>
          </Button>
        );
      case "HIRED":
        return (
          <div className="flex gap-2">
            <span className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
              Hired - Contract Completed
            </span>
          </div>
        );
      case "REJECTED":
        return (
          <div className="flex gap-2">
            <span className="px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium">
              Application Rejected
            </span>
          </div>
        );
      default:
        return (
          <Button
            className='flex gap-x-[.5rem] items-center'
            disabled={isModifyLoading}
            onClick={handleShortListing}
          >
            <PersonIcon />
            <span>Shortlist Applicant</span>
          </Button>
        );
    }
  };

  return (
    <section className=''>
      <div className='flex items-center justify-between'>
        <BackNavigation />
        {renderActionButton()}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        applicantData && (
          <Card>
            <AdhocApplicantDetailsView
              {...(applicantData?.data as any)}
              id={applicantId}
            />
          </Card>
        )
      )}
    </section>
  );
}
