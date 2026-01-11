"use client";

import Card from "@/components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicInformation from "./BasicInformation";
import Qualification from "./Qualification";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { generatePath } from "@/utils/generatePath"; 
import { HrRoutes } from "@/constants/RouterConstants";
import GoBack from "@/components/GoBack";
import { useGetEmployeeOnboardingQualificationsList } from "@/features/hr/controllers/hrEmployeeOnboardingQualificationsController";
import { useGetJobApplication } from "@/features/hr/controllers/hrJobApplicationsController";
import { useGetEmployeeOnboarding } from "@/features/hr/controllers/employeeOnboardingController";
import { useGetJobAdvertisement } from "@/features/hr/controllers/jobAdvertisementController";
import { useState } from "react";

const EmployeeInformation = () => {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("basic_information");

  console.log("🔍 URL PARAMS DEBUG:", {
    rawParams: useParams(),
    id: id,
    idType: typeof id,
    idLength: typeof id === 'string' ? id.length : 'not string',
    fullId: id,
    stringifiedId: String(id)
  });

  // First try to get existing employee onboarding data for editing
  const { data: existingEmployee, isLoading: employeeLoading, error: employeeError } = useGetEmployeeOnboarding(id as string);

  // Determine if we're in edit mode
  const isEditing = !!existingEmployee?.data;

  // Only fetch job application data if there's no existing employee
  const { data: jobApplicationData, isLoading: jobLoading, error: jobError } = useGetJobApplication(
    id as string,
    !existingEmployee?.data && !employeeLoading
  );

  // Extract the advertisement ID from the job application
  const advertisementId = (jobApplicationData?.data as any)?.advertisement;

  // Get the advertisement details to get the location and job type
  const { data: advertisement, isLoading: adLoading } = useGetJobAdvertisement(
    advertisementId || "",
    !!advertisementId && !isEditing
  );

  // Use existing employee data if available, otherwise use job application data
  const data = existingEmployee?.data ? existingEmployee : jobApplicationData;
  const isLoading = employeeLoading || jobLoading || adLoading;
  const error = employeeError && jobError ? employeeError : null;

  console.log("EmployeeInformation - Data Sources:", {
    id,
    existingEmployee: existingEmployee?.data,
    jobApplicationData: jobApplicationData?.data,
    finalData: data?.data,
    advertisementId,
    advertisement: advertisement?.data,
    isEditing,
    isLoading,
    employeeLoading,
    jobLoading,
    adLoading,
    willFetchJobApp: !existingEmployee?.data && !employeeLoading
  });

  const { data: qualifications, isLoading: getLoading } =
    useGetEmployeeOnboardingQualificationsList({
      employee: id as string,
      enabled: isEditing, // Only fetch qualifications if we're editing an existing employee
    });

  return (
    <>
      <GoBack />
      <Card className='space-y-6 mt-6'>
        <div>
          <h4 className='font-semibold text-lg text-center'>
            Employee Information Form
          </h4>
          <p className='text-small text-center'>
            Fill the form below, in a case where changes occur, please provide
            an updated form to Human Resources.
            <br /> Telephone numbers are released to supervisory staff for
            emergency purposes only.
          </p>
        </div>

        {id ? (
          <>
            {!isLoading && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value='basic_information'>
                    Basic Information
                  </TabsTrigger>
                  <TabsTrigger value='qualification'>Qualification</TabsTrigger>
                </TabsList>

                <TabsContent value='basic_information'>
                  <Card className='px-6'>
                    <BasicInformation
                      info={data}
                      advertisement={advertisement}
                      onNext={() => setActiveTab("qualification")}
                    />
                  </Card>
                </TabsContent>

                {!getLoading && (
                  <TabsContent value='qualification'>
                    <>
                      <Card className='px-6'>
                        <Qualification
                          qualifications={qualifications?.data.results}
                        />
                      </Card>
                      <div className='flex gap-x-6 justify-end mt-4'>
                        <Link
                          href={generatePath(
                            HrRoutes.ONBOARDING_ADD_EMPLOYEE_ADD,
                            {
                              id,
                            }
                          )}
                          className='flex flex-col items-start justify-between gap-1'
                        >
                          <Button type='button'>
                            Next
                            <ChevronRight size={20} />
                          </Button>
                        </Link>
                      </div>
                    </>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </>
        ) : (
          <Tabs defaultValue='basic_information'>
            <TabsList>
              <TabsTrigger value='basic_information'>
                Basic Information
              </TabsTrigger>
              <TabsTrigger value='qualification'>Qualification</TabsTrigger>
            </TabsList>

            <TabsContent value='basic_information'></TabsContent>

            <TabsContent value='qualification'></TabsContent>
          </Tabs>
        )}
      </Card>
    </>
  );
};

export default EmployeeInformation;
