"use client";

import { useParams, useRouter } from "next/navigation";
import Card from "components/Card";
import BackNavigation from "components/BackNavigation";
import { Button } from "components/ui/button";
import { LoadingSpinner } from "components/Loading";
import {
  useGetSingleAdhocApplicant,
  useUpdateAdhocApplicantStatus,
} from "@/features/programs/controllers/adhocApplicantController";
import {
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  Briefcase,
  MapPin,
  GraduationCap,
  CheckCircle,
  Clock,
  Download,
  XCircle,
} from "lucide-react";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Form } from "components/ui/form";
import { Input } from "components/ui/input";
import { Checkbox } from "components/ui/checkbox";
import { Label } from "components/ui/label";
import { createUserAccountFromApplicant } from "@/utils/createUserFromApplicant";

interface AcceptanceFormData {
  country: string;
  city: string;
  full_name_confirmation: string;
  date: string;
}

export default function AdhocContractAcceptanceDetails() {
  const params = useParams();
  const router = useRouter();
  const applicantId = params?.id as string;

  const { data: applicantData, isLoading } = useGetSingleAdhocApplicant(
    applicantId,
    !!applicantId
  );
  const updateStatusMutation = useUpdateAdhocApplicantStatus(applicantId);

  const applicant = applicantData?.data;
  const fullName = applicant?.name || `${applicant?.sur_name} ${applicant?.other_names}`;
  const isAccepted = applicant?.offer_accepted;

  const form = useForm<AcceptanceFormData>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      country: "",
      city: "",
      full_name_confirmation: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptSafeguarding, setAcceptSafeguarding] = useState(false);
  const [acceptConfidentiality, setAcceptConfidentiality] = useState(false);
  const [ipAddress, setIpAddress] = useState<string>("");

  // Get user's IP address for audit trail
  useState(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch(() => setIpAddress("Unknown"));
  });

  const handleRejectContract = async () => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this contract? This action cannot be undone."
    );

    if (!confirmReject) return;

    setIsSubmitting(true);

    try {
      await updateStatusMutation.mutateAsync({
        status: "REJECTED",
      });

      toast.success("Contract rejected successfully");
      router.push("/dashboard/programs/adhoc/adhoc-acceptance");
    } catch (error: any) {
      console.error("Contract rejection error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to reject contract"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: AcceptanceFormData) => {
    if (!acceptTerms || !acceptSafeguarding || !acceptConfidentiality) {
      toast.error("Please accept all required agreements");
      return;
    }

    if (!data.full_name_confirmation || data.full_name_confirmation.trim() === "") {
      toast.error("Please type your full name to confirm acceptance");
      return;
    }

    // Verify name matches
    const confirmedName = data.full_name_confirmation.trim().toLowerCase();
    const applicantName = fullName.trim().toLowerCase();

    if (confirmedName !== applicantName) {
      toast.error(
        "The name you entered does not match your profile. Please type your full name exactly as shown."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Update applicant with acceptance details
      const updateData = {
        status: "APPROVED",
        offer_accepted: true,
        offer_acceptance_date: new Date().toISOString(),
      };

      await updateStatusMutation.mutateAsync(updateData as any);

      console.log("Contract accepted successfully");

      // Try to create user account
      try {
        console.log("🔐 Creating user account for accepted applicant...");

        const userResult = await createUserAccountFromApplicant(
          {
            ...applicant,
            acceptance_country: data.country,
            acceptance_city: data.city,
          },
          "ADHOC_STAFF"
        );

        if (userResult.success) {
          console.log("✅ User account created successfully:", userResult.userId);
          toast.success(
            "Contract accepted successfully! Your user account has been created."
          );
        } else if (userResult.userExists) {
          console.log("ℹ️  User account already exists");
          toast.success(
            "Contract accepted successfully! Your existing user account is already active."
          );
        } else {
          toast.success(
            "Contract accepted successfully! Please contact admin to activate your user account."
          );
        }
      } catch (userError: any) {
        console.error("❌ Failed to create user account:", userError);
        toast.warning(
          "Contract accepted! However, user account creation failed. Admin will create your account manually."
        );
      }

      setTimeout(() => {
        router.push("/dashboard/programs/adhoc-database");
      }, 2500);
    } catch (error: any) {
      console.error("Contract acceptance error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to accept contract"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <BackNavigation />
        <LoadingSpinner />
      </section>
    );
  }

  if (!applicant) {
    return (
      <section className="space-y-6">
        <BackNavigation />
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2 text-red-600">
              Applicant Not Found
            </h2>
            <p className="text-gray-600">
              Unable to find the applicant with ID: {applicantId}
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
          onClick={() => router.push("/dashboard/programs/adhoc/contract-recipients")}
          variant="outline"
        >
          Back to Contract Recipients
        </Button>
      </div>

      {/* Header Card */}
      <Card className={cn(
        "bg-gradient-to-r border-2",
        isAccepted
          ? "from-green-50 to-emerald-50 border-green-200"
          : "from-amber-50 to-yellow-50 border-amber-200"
      )}>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn(
                  "text-white p-3 rounded-lg",
                  isAccepted ? "bg-green-500" : "bg-amber-500"
                )}>
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {fullName}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Application: {applicant.application_number}
                  </p>
                </div>
              </div>
            </div>
            <Badge
              variant="default"
              className={cn(
                "px-4 py-2 text-sm font-semibold",
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
              {isAccepted ? "CONTRACT ACCEPTED" : "PENDING ACCEPTANCE"}
            </Badge>
          </div>

          {/* Contract Status */}
          <div className={cn(
            "p-4 rounded-lg border",
            isAccepted
              ? "bg-green-50 border-green-200"
              : "bg-amber-50 border-amber-200"
          )}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className={cn(
                "h-5 w-5",
                isAccepted ? "text-green-600" : "text-amber-600"
              )} />
              <h3 className="font-semibold text-gray-900">Contract Status</h3>
            </div>
            <p className="text-sm text-gray-600">
              {isAccepted ? (
                <>
                  Contract accepted on{" "}
                  {applicant.offer_acceptance_date
                    ? new Date(applicant.offer_acceptance_date).toLocaleDateString()
                    : "N/A"}
                </>
              ) : (
                <>
                  Contract issued on{" "}
                  {applicant.contract_issued_at
                    ? new Date(applicant.contract_issued_at).toLocaleDateString()
                    : "N/A"}
                  . Awaiting acceptance from the applicant.
                </>
              )}
            </p>
          </div>
        </div>
      </Card>

      {/* Contract Acceptance Form (only show if not accepted) */}
      {!isAccepted && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            Accept Contract
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Agreement Checkboxes */}
              <div className="space-y-4 bg-white p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg mb-4">
                  Required Agreements
                </h3>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) =>
                      setAcceptTerms(checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I accept the <strong>Agreement Terms & Scope of Work</strong> and
                    understand my responsibilities as outlined in the contract
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="safeguarding"
                    checked={acceptSafeguarding}
                    onCheckedChange={(checked) =>
                      setAcceptSafeguarding(checked as boolean)
                    }
                  />
                  <Label htmlFor="safeguarding" className="text-sm leading-relaxed cursor-pointer">
                    I accept the <strong>Safeguarding Policy</strong> and commit to
                    maintaining professional standards
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="confidentiality"
                    checked={acceptConfidentiality}
                    onCheckedChange={(checked) =>
                      setAcceptConfidentiality(checked as boolean)
                    }
                  />
                  <Label htmlFor="confidentiality" className="text-sm leading-relaxed cursor-pointer">
                    I accept the <strong>Confidentiality Agreement</strong> and will
                    protect sensitive information
                  </Label>
                </div>
              </div>

              {/* Acceptance Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    {...form.register("country", { required: true })}
                    placeholder="Enter your country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...form.register("city", { required: true })}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...form.register("date", { required: true })}
                  />
                </div>
              </div>

              {/* Name Confirmation */}
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-amber-900">
                  Confirm Your Identity
                </h3>
                <p className="text-sm text-amber-800 mb-4">
                  Type your full name exactly as shown above:{" "}
                  <strong>{fullName}</strong>
                </p>
                <div className="space-y-2">
                  <Label htmlFor="full_name_confirmation">
                    Full Name Confirmation *
                  </Label>
                  <Input
                    id="full_name_confirmation"
                    {...form.register("full_name_confirmation", { required: true })}
                    placeholder={`Type "${fullName}" to confirm`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Accepting Contract...</>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Accept Contract
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={handleRejectContract}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Reject Contract
                </Button>
              </div>

              <p className="text-xs text-gray-600 text-center">
                By accepting this contract, you agree to all terms and conditions
                outlined in your employment agreement.
              </p>
            </form>
          </Form>
        </Card>
      )}

      {/* Personal Information */}
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow icon={<User />} label="Full Name" value={fullName} />
          <InfoRow icon={<Mail />} label="Email" value={applicant.email_address} />
          <InfoRow icon={<Phone />} label="Phone" value={applicant.phone_number} />
          <InfoRow
            icon={<User />}
            label="Gender"
            value={applicant.gender}
          />
          <InfoRow
            icon={<Calendar />}
            label="Date of Birth"
            value={applicant.date_of_birth
              ? new Date(applicant.date_of_birth).toLocaleDateString()
              : "N/A"
            }
          />
          <InfoRow
            icon={<MapPin />}
            label="State of Origin"
            value={applicant.state_of_origin}
          />
        </div>
      </Card>

      {/* Contract Details */}
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contract Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow
            icon={<Briefcase />}
            label="Position"
            value={applicant.advertisement?.position_title || "N/A"}
          />
          <InfoRow
            icon={<FileText />}
            label="Status"
            value={applicant.status_display || applicant.status}
          />
          <InfoRow
            icon={<Calendar />}
            label="Contract Start Date"
            value={applicant.contract_start_date
              ? new Date(applicant.contract_start_date).toLocaleDateString()
              : "N/A"
            }
          />
          <InfoRow
            icon={<Calendar />}
            label="Contract End Date"
            value={applicant.contract_end_date
              ? new Date(applicant.contract_end_date).toLocaleDateString()
              : "N/A"
            }
          />
          <InfoRow
            icon={<MapPin />}
            label="Assigned Health Facility"
            value={applicant.assigned_health_facility || "N/A"}
          />
          <InfoRow
            icon={<MapPin />}
            label="Assigned LGA"
            value={applicant.assigned_lga || "N/A"}
          />
        </div>
      </Card>

      {/* Professional Information */}
      <Card>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Professional Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow
            icon={<GraduationCap />}
            label="Qualifications"
            value={applicant.qualifications}
          />
          <InfoRow
            icon={<Briefcase />}
            label="Years of Experience"
            value={applicant.total_experience_years?.toString() || "N/A"}
          />
          <InfoRow
            icon={<Briefcase />}
            label="Current Employer"
            value={applicant.current_employer || "N/A"}
          />
          <InfoRow
            icon={<Briefcase />}
            label="Current Position"
            value={applicant.current_position || "N/A"}
          />
        </div>
      </Card>

      {/* Interview Information (if available) */}
      {applicant.interview_score && (
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Interview Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow
              icon={<Calendar />}
              label="Interview Date"
              value={applicant.interview_conducted_at
                ? new Date(applicant.interview_conducted_at).toLocaleDateString()
                : "N/A"
              }
            />
            <InfoRow
              icon={<CheckCircle />}
              label="Interview Score"
              value={`${applicant.interview_score}%`}
            />
          </div>
          {applicant.interview_notes && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Interview Notes:</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {applicant.interview_notes}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Documents */}
      {applicant.documents && applicant.documents.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </h2>
          <div className="space-y-2">
            {applicant.documents.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{doc.document_type}</p>
                    <p className="text-xs text-gray-600">{doc.file_name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(doc.file_url, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </section>
  );
}

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gray-400 mt-1">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
