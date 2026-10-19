"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApplicationFormFields } from "@/app/jobs/[id]/ApplicationForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetJobApplication, useCompletePreboarding } from "@/features/hr/controllers/hrJobApplicationsController";
import { Loading } from "@/components/Loading";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function PreboardingPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params?.id as string;

  const { data: applicationData, isLoading: loadingApplication } = useGetJobApplication(applicationId);
  const { completePreboarding, isLoading: submitting } = useCompletePreboarding(applicationId);

  const application = applicationData?.data;

  const [formData, setFormData] = useState({
    surname: application?.applicant_last_name || "",
    firstName: application?.applicant_first_name || "",
    middleName: application?.applicant_middle_name || "",
    homeAddress: "",
    phone: "",
    email: application?.applicant_email || "",
    positionAppliedFor: application?.position_applied || "",
    positionLocation: "",
    currentPosition: "",
    currentEmployer: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.surname || !formData.firstName || !formData.email || !formData.phone || !formData.homeAddress) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const preboardingData = {
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.surname,
        email: formData.email,
        phone: formData.phone,
        home_address: formData.homeAddress,
        position_location: formData.positionLocation,
        current_position: formData.currentPosition,
        current_employer: formData.currentEmployer,
      };

      await completePreboarding(preboardingData);

      // Show success message and redirect
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Pre-boarding submission error:", error);
    }
  };

  if (loadingApplication) {
    return <Loading />;
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Application Not Found</h2>
          <p className="text-gray-600">
            The application you are looking for does not exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pre-Boarding Form
          </h1>
          <p className="text-gray-600">
            Please confirm and update your information before we proceed with your contract.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            <ApplicationFormFields
              formData={formData}
              setFormData={setFormData}
              positionName={application.position_applied || ""}
            />

            {/* Submit Button */}
            <div className="mt-8 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? "Submitting..." : "Submit Pre-boarding Form"}
              </Button>
            </div>
          </Card>
        </form>

        {/* Information Note */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
            <li>Your information will be reviewed by our HR team</li>
            <li>You will receive an offer letter via email</li>
            <li>After signing the offer letter, we'll proceed with the employment contract</li>
            <li>Final onboarding steps will be communicated to you</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
