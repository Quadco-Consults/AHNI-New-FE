import { zodResolver } from "@hookform/resolvers/zod";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import BackNavigation from "atoms/BackNavigation";
import FadedButton from "atoms/FadedButton";
import FormButton from "atoms/FormButton";
import FormSelect from "atoms/FormSelectField";
import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import { Form } from "components/ui/form";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { useGetExistingConsultancyApplicantsQuery } from "services/c&g/contract-management/consultancy-management/consultancy-applicants";
import NewApplicantStaffForm from "./NewApplicantStaffForm";
import {
  ConsultancyStaffSchema,
  TConsultancyStaffFormData,
} from "definations/c&g/contract-management/consultancy-management/consultancy-application";

export default function CreateApplicant() {
  const [tabValue, setTabValue] = useState("existing");

  //   const { data } = useGetExistingConsultancyApplicantsQuery({
  //     page: 1,
  //     size: 2000000,
  //   });

  return (
    <section>
      <BackNavigation />

      <Tabs
        defaultValue="existing"
        value={tabValue}
        onValueChange={(value) => setTabValue(value)}
      >
        <TabsList>
          <TabsTrigger value="existing">Select Existing</TabsTrigger>

          <TabsTrigger value="new">Add New</TabsTrigger>
        </TabsList>

        <TabsContent value="existing"></TabsContent>
        <TabsContent value="new"></TabsContent>
      </Tabs>

      <Card>
        {tabValue === "existing" ? (
          <>
            {/* <FormSelect
                  label="Consultant"
                  name=""
                  placeholder="Select Consultant"
                  required
                  options={[]}
                /> */}

            <Separator />

            <div>
              <h3 className="text-lg font-bold">Dave Wilson</h3>

              <div className="grid grid-cols-3 gap-10 mt-5">
                <DescriptionCard
                  label="Employment Type"
                  description="Contract"
                />
                <DescriptionCard
                  label="Email"
                  description="ubakawilson@gmail.com"
                />
                <DescriptionCard
                  label="Phone Number"
                  description="+2348104478624"
                />
              </div>
            </div>
          </>
        ) : (
          <NewApplicantStaffForm />
        )}
      </Card>
    </section>
  );
}
