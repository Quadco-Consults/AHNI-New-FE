"use client";

import { useParams, useRouter } from "next/navigation";
import Card from "@/components/Card";
import BackNavigation from "@/components/BackNavigation";
import { LoadingSpinner } from "@/components/Loading";
import { useGetAllAdhocApplicants } from "@/features/programs/controllers/adhocApplicantController";
import { useGetSingleAdhocAdvertisement } from "@/features/programs/controllers/adhocAdvertisementController";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AdhocAdvertisementContractsView() {
  const params = useParams();
  const router = useRouter();
  const advertisementId = params?.id as string;

  // Fetch the advertisement details
  const { data: advertisementData, isLoading: isLoadingAd } =
    useGetSingleAdhocAdvertisement(advertisementId, !!advertisementId);

  // Fetch ALL adhoc applicants
  const { data: applicantsData, isLoading: isLoadingApplicants } =
    useGetAllAdhocApplicants({
      page: 1,
      size: 1000,
    });

  const advertisement = advertisementData?.data;
  const allApplicantsRaw = applicantsData?.data?.results || [];

  console.log("🔍 Advertisement Contracts View Debug:");
  console.log("- Advertisement ID:", advertisementId);
  console.log("- Advertisement Data:", advertisement);
  console.log("- Loading Ad:", isLoadingAd);
  console.log("- Loading Applicants:", isLoadingApplicants);
  console.log("- Total Applicants:", allApplicantsRaw.length);
  console.log("- Advertisement Data Response:", advertisementData);

  // Filter applicants for this advertisement with CONTRACT_ISSUED or APPROVED status
  const applicants = allApplicantsRaw.filter((applicant: any) => {
    // Must have CONTRACT_ISSUED or APPROVED status
    if (!["CONTRACT_ISSUED", "APPROVED"].includes(applicant.status)) {
      return false;
    }

    // Must match this advertisement
    const applicantAdId =
      typeof applicant.advertisement === "object" &&
      applicant.advertisement !== null
        ? applicant.advertisement.id
        : applicant.advertisement;

    return applicantAdId === advertisementId;
  });

  const acceptedCount = applicants.filter((a: any) => a.offer_accepted).length;
  const pendingCount = applicants.length - acceptedCount;

  const isLoading = isLoadingAd || isLoadingApplicants;

  if (isLoading) {
    return (
      <section className="space-y-6">
        <BackNavigation />
        <LoadingSpinner />
      </section>
    );
  }

  if (!advertisement) {
    return (
      <section className="space-y-6">
        <BackNavigation />
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2 text-red-600">
              Advertisement Not Found
            </h2>
            <p className="text-gray-600">
              Unable to find the advertisement with ID: {advertisementId}
            </p>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <BackNavigation />
        <Button
          onClick={() =>
            router.push("/dashboard/programs/adhoc/adhoc-acceptance")
          }
          variant="outline"
        >
          Back to Contract Acceptance
        </Button>
      </div>

      {/* Header Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-500 text-white p-3 rounded-lg">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {advertisement.position_title}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {advertisement.advertisement_number}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-semibold">
              ADHOC
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-200">
            <div className="text-center bg-white rounded-lg p-3 shadow-sm">
              <p className="text-2xl font-bold text-blue-600">
                {applicants.length}
              </p>
              <p className="text-sm text-gray-600">Contracts Issued</p>
            </div>
            <div className="text-center bg-white rounded-lg p-3 shadow-sm">
              <p className="text-2xl font-bold text-green-600">
                {acceptedCount}
              </p>
              <p className="text-sm text-gray-600">Accepted</p>
            </div>
            <div className="text-center bg-white rounded-lg p-3 shadow-sm">
              <p className="text-2xl font-bold text-amber-600">
                {pendingCount}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-4 border-t border-blue-200">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Acceptance Progress</span>
              <span className="font-semibold">
                {applicants.length > 0
                  ? Math.round((acceptedCount / applicants.length) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    applicants.length > 0
                      ? (acceptedCount / applicants.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Advertisement Details */}
      {(advertisement as any)?.description && (
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Job Description
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {(advertisement as any).description}
          </p>
        </Card>
      )}

      {/* Applicants List */}
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Contract Recipients ({applicants.length})
        </h2>

        {applicants.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Contracts Issued
            </h3>
            <p className="text-gray-600">
              No contracts have been issued for this job advertisement yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant: any) => {
              const fullName =
                applicant.name ||
                `${applicant.sur_name} ${applicant.other_names}`;
              const isAccepted = applicant.offer_accepted;

              return (
                <div
                  key={applicant.id}
                  className={cn(
                    "border-2 rounded-lg p-4 transition-all hover:shadow-md",
                    isAccepted
                      ? "bg-green-50 border-green-200"
                      : "bg-amber-50 border-amber-200"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            isAccepted
                              ? "bg-green-500 text-white"
                              : "bg-amber-500 text-white"
                          )}
                        >
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {fullName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {applicant.application_number}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{applicant.email_address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{applicant.phone_number}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Start:{" "}
                            {applicant.contract_start_date
                              ? new Date(
                                  applicant.contract_start_date
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            End:{" "}
                            {applicant.contract_end_date
                              ? new Date(
                                  applicant.contract_end_date
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {isAccepted && applicant.offer_acceptance_date && (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 rounded-lg px-3 py-2 w-fit">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            Accepted on{" "}
                            {new Date(
                              applicant.offer_acceptance_date
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <Badge
                        variant="default"
                        className={cn(
                          "px-3 py-1 text-sm font-semibold",
                          isAccepted
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        )}
                      >
                        {isAccepted ? (
                          <CheckCircle className="h-4 w-4 mr-2 inline" />
                        ) : (
                          <Clock className="h-4 w-4 mr-2 inline" />
                        )}
                        {isAccepted ? "ACCEPTED" : "PENDING"}
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/programs/adhoc/adhoc-acceptance/details/${applicant.id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </section>
  );
}
