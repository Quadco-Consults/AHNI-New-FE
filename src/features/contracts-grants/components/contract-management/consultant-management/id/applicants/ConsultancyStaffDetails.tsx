import BackNavigation from "components/atoms/BackNavigation";

import { useGetSingleConsultancyStaff } from "@/features/contracts-grants/controllers/contract-management/consultancy-management/consultancy-applicants";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate, useParams } 
import { Button } from "components/ui/button";
import PersonIcon from "components/icons/Person";
import SingleConsultancyStaffDetails from "./SingleConsultancyStaffDetails";
import { LoadingSpinner } from "components/Loading";
import Card from "components/Card";
import { toast } from "sonner";
import { useModifyContractStatus } from "@/features/contracts-grants/controllers/contract-management/contract";

export default function ConsultancyStaffDetails() {
  const { applicantId } = useParams();

  const router = useRouter();

  const { data: consultancyStaff, isLoading } =
    useGetSingleConsultancyStaff(applicantId ? applicantId : skipToken);

  const { modifyContractRequest, isLoading: isModifyLoading } =
    useModifyContractStatus();

  const handleShortListing = async () => {
    // console.log("Form submitted with data:", data);
    // Handle form submission logic here

    try {
      await modifyContractRequest({
        id: applicantId,
        body: {
          status: "SHORTLISTED",
        },
      })();
      toast.success("Contract Updated Successfully");

      router.push(-1);
    } catch (error: any) {
      toast.error(error.data.message ?? "Something went wrong");
    }
  };
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
            <SingleConsultancyStaffDetails {...consultancyStaff?.data} />
          </Card>
        )
      )}
    </section>
  );
}
