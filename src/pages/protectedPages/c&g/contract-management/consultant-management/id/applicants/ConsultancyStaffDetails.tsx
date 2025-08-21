import BackNavigation from "atoms/BackNavigation";

import { useGetSingleConsultancyStaffQuery } from "services/c&g/contract-management/consultancy-management/consultancy-applicants";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "components/ui/button";
import PersonIcon from "components/icons/Person";
import SingleConsultancyStaffDetails from "./SingleConsultancyStaffDetails";
import { LoadingSpinner } from "components/shared/Loading";
import Card from "components/shared/Card";
import { toast } from "sonner";
import { useModifyContractStatusMutation } from "services/c&g/contract-management/contract";

export default function ConsultancyStaffDetails() {
  const { applicantId } = useParams();

  const navigate = useNavigate();

  const { data: consultancyStaff, isLoading } =
    useGetSingleConsultancyStaffQuery(applicantId ? applicantId : skipToken);

  const [modifyContractRequest, { isLoading: isModifyLoading }] =
    useModifyContractStatusMutation();

  const handleShortListing = async () => {
    // console.log("Form submitted with data:", data);
    // Handle form submission logic here

    try {
      await modifyContractRequest({
        id: applicantId,
        body: {
          status: "SHORTLISTED",
        },
      }).unwrap();
      toast.success("Contract Updated Successfully");

      navigate(-1);
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
