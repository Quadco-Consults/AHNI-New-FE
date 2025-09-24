"use client";

// import BackNavigation from "components/atoms/BackNavigation";

// import { useGetSingleConsultancyStaff } from "@/features/contracts-grants/controllers/consultantManagementController";
import { useParams, useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import PersonIcon from "components/icons/Person";
import SingleConsultancyStaffDetails from "./SingleConsultancyStaffDetails";
import { LoadingSpinner } from "components/Loading";
import Card from "components/Card";
import { toast } from "sonner";
import { useState } from "react";
import BackNavigation from "components/BackNavigation";
// import { useGetSingleConsultancyStaff } from "src/features/contracts-grants/controllers/consultantManagementController";
import { useGetSingleConsultancyApplicant } from "src/features/contracts-grants/controllers/consultancyApplicantsController";
import { useModifyContractStatus } from "src/features/contracts-grants/controllers/contractController";
// import { useModifyContractStatus } from "@/features/contracts-grants/controllers/contractController";
// import { useGetSingleConsultancyStaff } from "@/features/contracts-grants/controllers";

export default function ConsultancyStaffDetails() {
  const params = useParams();
  const applicantId = params?.applicantId as string;

  const router = useRouter();

  // const { data: consultancyStaff, isLoading } =
  //   useGetSingleConsultancyStaff(applicantId);
  const { data: consultancyStaff, isLoading } =
    useGetSingleConsultancyApplicant(applicantId);

  // Debug logging for applicant details
  console.log("📄 Individual Applicant Debug:");
  console.log("- ApplicantId:", applicantId);
  console.log("- Has Data:", !!consultancyStaff);
  console.log("- Has Documents:", !!consultancyStaff?.data?.documents);
  console.log(
    "- Documents Count:",
    consultancyStaff?.data?.documents?.length || 0
  );
  console.log("- Full Data:", consultancyStaff);

  const [isModifyLoading, setIsModifyLoading] = useState(false);

  const { updateContractStatus } = useModifyContractStatus(applicantId);

  const handleShortListing = async () => {
    setIsModifyLoading(true);
    try {
      await updateContractStatus({
        status: "SHORTLISTED",
      });
      toast.success("Consultant Shortlisted Successfully");
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
      await updateContractStatus({
        status: "HIRED",
      });
      toast.success("Contract Issued Successfully");
      router.back();
    } catch (error: any) {
      console.error("Contract issuance error:", error);
      console.error("Full error response:", error?.response?.data);
      console.error("Error details:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message
      });
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to issue contract"
      );
    } finally {
      setIsModifyLoading(false);
    }
  };
  console.log({ consultancyStaff });

  // Get current status to show appropriate actions
  const currentStatus = consultancyStaff?.data?.status;

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
        return (
          <Button
            className='flex gap-x-[.5rem] items-center bg-green-600 hover:bg-green-700'
            disabled={isModifyLoading}
            onClick={handleContractIssuance}
          >
            <PersonIcon />
            <span>Issue Contract</span>
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
      default:
        return (
          <Button
            className='flex gap-x-[.5rem] items-center'
            disabled={isModifyLoading}
            onClick={handleShortListing}
          >
            <PersonIcon />
            <span>Shortlist Consultant</span>
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
        consultancyStaff && (
          <Card>
            <SingleConsultancyStaffDetails
              {...(consultancyStaff?.data as any)}
            />
          </Card>
        )
      )}
    </section>
  );
}
