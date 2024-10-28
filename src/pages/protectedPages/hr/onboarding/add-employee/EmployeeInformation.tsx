import Card from "components/shared/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import BasicInformation from "./BasicInformation";
import Qualification from "./Qualification";
import { Button } from "components/ui/button";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HrRoutes } from "constants/RouterConstants";

const EmployeeInformation = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate(HrRoutes.ONBOARDING_ADD_EMPLOYEE_ADD);
  };

  return (
    <Card className="space-y-6 mt-6">
      <div>
        <h4 className="font-semibold text-lg text-center">
          Employee Information Form
        </h4>
        <p className="text-small text-center">
          Fill the form below, in a case where changes occur, please provide an
          updated form to Human Resources.
          <br /> Telephone numbers are released to supervisory staff for
          emergency purposes only.
        </p>
      </div>

      <Tabs defaultValue="basic_information">
        <TabsList>
          <TabsTrigger value="basic_information">Basic Information</TabsTrigger>
          <TabsTrigger value="qualification">Qualification</TabsTrigger>
        </TabsList>
        <TabsContent value="basic_information">
          <Card className="px-6">
            <BasicInformation />
          </Card>
        </TabsContent>
        <TabsContent value="qualification">
          <Card className="px-6">
            <Qualification />
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-x-6 justify-end">
        <Button type="button" onClick={handleNext}>
          Next
          <ChevronRight size={20} />
        </Button>
      </div>
    </Card>
  );
};

export default EmployeeInformation;
