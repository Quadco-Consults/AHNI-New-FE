"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { generatePath } from "@/utils/generatePath"; 
import DescriptionCard from "@/components/DescriptionCard";
import { Button } from "@/components/ui/button";
import PrinterIcon from "@/components/icons/PrinterIcon";
import { ChevronRight, Save } from "lucide-react";
import { useAppDispatch } from "@/hooks/useStore";
import { openDialog } from "@/store/ui";
import { DialogType } from "@/constants/dailogs";
import { HrRoutes } from "@/constants/RouterConstants";
import Card from "@/components/Card";
import { updateStepCompletion } from "@/store/stepTracker";
import GoBack from "@/components/GoBack";
import { useGetEmployeeIdentityCard, useGetEmployeeOnboarding } from "@/features/hr/controllers/employeeOnboardingController";
import { useGetJobApplication } from "@/features/hr/controllers/hrJobApplicationsController";
import { useGetJobAdvertisement } from "@/features/hr/controllers/jobAdvertisementController";
import { format } from "date-fns";

const IdCardInformation = () => {
  const id = typeof window !== "undefined" ? localStorage.getItem("workforceID") || "" : "";

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetEmployeeIdentityCard(id);

  // First, get the employee onboarding data which should contain the job application reference
  const { data: employeeOnboarding, isLoading: onboardingLoading } = useGetEmployeeOnboarding(id);

  // Extract the job application ID from the employee onboarding data
  const jobApplicationId = employeeOnboarding?.data?.application;

  // Then get the job application details using the application ID
  const { data: jobApplication, isLoading: jobLoading } = useGetJobApplication(
    jobApplicationId || "",
    !!jobApplicationId
  );

  // Extract the advertisement ID from the job application
  const advertisementId = jobApplication?.data?.advertisement;

  // Get the advertisement details to get the job title
  const { data: advertisement, isLoading: adLoading } = useGetJobAdvertisement(
    advertisementId || "",
    !!advertisementId
  );

  console.log("🔍 ID Card Data:", {
    id,
    data,
    isLoading,
    position: data?.data?.position,
    employee_number: data?.data?.employee_number,
    email_address: data?.data?.email_address
  });

  console.log("🔍 Employee Onboarding Data:", {
    employeeOnboarding,
    onboardingLoading,
    applicationId: jobApplicationId,
    hasApplicationId: !!jobApplicationId
  });

  console.log("🔍 Job Application Data:", {
    jobApplication,
    jobLoading,
    advertisementId: jobApplication?.data?.advertisement,
    positionAppliedId: jobApplication?.data?.position_applied
  });

  console.log("🔍 Advertisement Data:", {
    advertisement,
    adLoading,
    advertisementId,
    jobTitle: advertisement?.data?.title,
    position: advertisement?.data?.position,
    fullAdData: advertisement?.data
  });

  // Use job title from the advertisement if available, otherwise fallback to position from identity card
  const displayPosition = advertisement?.data?.title || advertisement?.data?.position || data?.data?.position;

  const onSubmit = () => {
    dispatch(
      updateStepCompletion({
        path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_ID_CARD,
      })
    );
    dispatch(
      openDialog({
        type: DialogType.HrSuccessModal,
        dialogProps: {
          label: "Employee information saved",
        },
      })
    );
  };

  return (
    <>
      <GoBack />
      <Card className='space-y-10 mt-6 max-w-4xl mx-auto'>
        <div>
          <h4 className='font-semibold text-lg text-center'>
            ID Card Information Form
          </h4>
          <p className='text-small text-center'>
            FORMS MUST BE AND COMPLETED IN UPPER CASE
          </p>
        </div>
        <div className='card-wrapper space-y-6'>
          <div className='flex items-center gap-x-4'>
            <img
              src={data?.data?.passport_file}
              alt='avatar'
              className='min-h-[100px]'
              width={100}
            />
            <h4 className='font-semibold'>
              {data?.data?.legal_firstname} {data?.data?.legal_lastname}
            </h4>
          </div>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='space-y-6'>
              <DescriptionCard
                label='Position Title'
                description={displayPosition}
              />
              <DescriptionCard
                label='Phone Number'
                description={data?.data?.phone_number}
              />
            </div>
            <div className='space-y-6'>
              <DescriptionCard
                label='Employee Number'
                description={data?.data?.employee_number}
              />
              <DescriptionCard
                label='Employee Signature'
                description={
                  <img
                    src={data?.data?.signature_file}
                    alt='avatar'
                    className='max-h-[50px]'
                    width={50}
                  />
                }
              />
            </div>
            <div className='space-y-6'>
              <DescriptionCard
                label='Email Address'
                description={data?.data?.email_address}
              />
              <DescriptionCard
                label='Date'
                description={data?.data?.date_of_hire ? format(new Date(data.data.date_of_hire), "dd-MM-yyyy") : "-"}
              />
            </div>
          </div>
          <Button>
            <PrinterIcon /> Print Passport
          </Button>
        </div>
        <div className='flex gap-x-6 justify-end'>
          <Button onClick={onSubmit} variant='outline'>
            <Save size={20} /> Save
          </Button>

          <Link
            href={generatePath(HrRoutes.ONBOARDING_ADD_EMPLOYEE_SALARY, {
              id,
            })}
            className='flex flex-col items-start justify-between gap-1'
          >
            <Button type='button'>
              Next
              <ChevronRight size={20} />
            </Button>
          </Link>
        </div>
      </Card>
      {/* <Button
        onClick={() =>
          dispatch(
            updateStepCompletion({
              path: HrRoutes.ONBOARDING_ADD_EMPLOYEE_ID_CARD,
            })
          )
        }
      >
        Hello
      </Button> */}
    </>
  );
};

export default IdCardInformation;
