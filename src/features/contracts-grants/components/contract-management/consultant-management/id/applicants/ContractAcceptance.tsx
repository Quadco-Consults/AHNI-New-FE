"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import { LoadingSpinner } from "components/Loading";
import Card from "components/Card";
import { toast } from "sonner";
import { useState } from "react";
import BackNavigation from "components/BackNavigation";
import { useGetSingleConsultancyApplicant } from "src/features/contracts-grants/controllers/consultancyApplicantsController";
import { useModifyContractStatus } from "src/features/contracts-grants/controllers/contractController";
import { CheckCircle, XCircle, FileText } from "lucide-react";

export default function ContractAcceptance() {
  const params = useParams();
  const applicantId = params?.applicantId as string;
  const router = useRouter();

  const { data: consultancyStaff, isLoading } =
    useGetSingleConsultancyApplicant(applicantId);

  const [isModifyLoading, setIsModifyLoading] = useState(false);
  const { updateContractStatus } = useModifyContractStatus(applicantId);

  const handleAcceptContract = async () => {
    setIsModifyLoading(true);
    try {
      await updateContractStatus({
        status: "APPROVED",
      });
      toast.success("Contract Accepted Successfully");
      router.back();
    } catch (error: any) {
      console.error("Contract acceptance error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to accept contract"
      );
    } finally {
      setIsModifyLoading(false);
    }
  };

  const handleRejectContract = async () => {
    setIsModifyLoading(true);
    try {
      await updateContractStatus({
        status: "REJECTED",
      });
      toast.success("Contract Rejected");
      router.back();
    } catch (error: any) {
      console.error("Contract rejection error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to reject contract"
      );
    } finally {
      setIsModifyLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const applicantData = consultancyStaff?.data;
  const currentStatus = applicantData?.status;

  // Only show contract acceptance if status is PENDING (contract issued but not yet accepted/rejected)
  if (currentStatus !== "PENDING") {
    return (
      <section className="">
        <BackNavigation />
        <Card className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">
            Contract Not Available
          </h2>
          <p className="text-gray-500">
            {currentStatus === "APPROVED"
              ? "You have already accepted this contract."
              : currentStatus === "REJECTED"
              ? "This contract has been rejected."
              : "No contract has been issued yet."}
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="">
      <BackNavigation />

      <Card className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Contract Acceptance
          </h1>
          <p className="text-gray-600 mt-1">
            Please review the contract details below and choose your action.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Contract Details</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Consultant Name:</strong> {applicantData?.first_name} {applicantData?.last_name}</div>
            <div><strong>Email:</strong> {applicantData?.email}</div>
            <div><strong>Phone:</strong> {applicantData?.phone_number}</div>
            <div><strong>Position:</strong> {applicantData?.position || "Consultant"}</div>
            <div><strong>Status:</strong>
              <span className="ml-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                Contract Issued
              </span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">⚠️ Important Notice</h4>
          <p className="text-amber-700 text-sm">
            By accepting this contract, you agree to the terms and conditions outlined
            in the consultancy agreement. Please ensure you have reviewed all terms
            before proceeding.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
            disabled={isModifyLoading}
            onClick={handleAcceptContract}
          >
            <CheckCircle className="h-4 w-4" />
            Accept Contract
          </Button>

          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
            disabled={isModifyLoading}
            onClick={handleRejectContract}
          >
            <XCircle className="h-4 w-4" />
            Reject Contract
          </Button>
        </div>

        {isModifyLoading && (
          <div className="flex justify-center pt-4">
            <LoadingSpinner />
          </div>
        )}
      </Card>
    </section>
  );
}