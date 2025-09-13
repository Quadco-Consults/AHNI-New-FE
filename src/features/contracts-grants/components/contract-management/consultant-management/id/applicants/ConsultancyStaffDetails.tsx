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
import {
  useGetSingleConsultancyApplicant,
  useModifyContractStatus,
} from "src/features/contracts-grants/controllers";
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

  const handleShortListing = async () => {
    setIsModifyLoading(true);
    try {
      // await updateContractStatus({
      //   title: consultancyStaff?.data?.name || "",
      //   request_type: "SHORTLIST",
      //   department: "",
      //   consultants_count: "1",
      //   location: "",
      //   fco: "",
      //   technical_monitor: "",
      //   email: consultancyStaff?.data?.email || "",
      //   phone_number: consultancyStaff?.data?.phone_number || "",
      //   current_reviewer: "",
      // });
      await updateContractStatus({
        status: "SHORTLISTED",
      });
      toast.success("Contract Updated Successfully");

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
  console.log({ consultancyStaff });

  return (
    <section className=''>
      <div className='flex items-center justify-between'>
        <BackNavigation />
        <Button
          className='flex gap-x-[.5rem] items-center'
          disabled={isModifyLoading}
          onClick={() => handleShortListing()}
        >
          <PersonIcon />
          <span>Shortlist Consultant</span>
        </Button>
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
