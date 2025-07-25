import Card from "components/shared/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import BasicInformation from "./BasicInformation";
import Qualification from "./Qualification";
import { Button } from "components/ui/button";
import { ChevronRight } from "lucide-react";
import { useParams, generatePath, Link } from "react-router-dom";
import { HrRoutes } from "constants/RouterConstants";
import GoBack from "components/shared/GoBack";
import { useGetEmployeeOnboardingQualificationsListQuery } from "services/hrApi/hr-employee-onboarding-qualifications";
import { useGetJobApplicationQuery } from "services/hrApi/hr-job-applications";
import { useState } from "react";

const EmployeeInformation = () => {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("basic_information");

  const { data, isLoading } = useGetJobApplicationQuery({
    id: id as string,
  });

  const { data: qualifications, isLoading: getLoading } =
    useGetEmployeeOnboardingQualificationsListQuery({
      employee: id as string,
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
                          to={generatePath(
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
