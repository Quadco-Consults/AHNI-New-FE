import { Label } from "components/ui/label";
import VendorRegistationLayout from "./VendorRegistationLayout";

import VendorUpload from "atoms/VendorUpload";
import { Separator } from "components/ui/separator";
import FormButton from "atoms/FormButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate("/procurement-management/vendor-management/prequalification");
    sessionStorage.removeItem("completedSteps");
  };
  return (
    <VendorRegistationLayout>
      <div>
        <h2 className="text-lg font-bold">Upoald</h2>
        <div className="mt-10 space-y-10">
          <VendorUpload
            label="  Cover Page (indicating category(s) of Interest and related LOT
            Number(s)"
          />
          <VendorUpload label="Company Profile; registered address(s), official/functional emails, telephone numbers and point of contact for the company" />
          <VendorUpload label="Evidence of legal registration document of the company (CAC, FORM CO7 and FORM CO2) " />
          <VendorUpload label="  Latest Tax Clearance Certificate " />
          <VendorUpload label=" Evidence of Financial Capability (Latest Audited Accounts)" />
          <VendorUpload label="Bank Reference Letter duly addressed to AHNi Procurement Committee" />
          <VendorUpload label="Evidence of Registration with Professional Organizations, Regulatory Bodies, Manufacturers and/or Certificate of Authorized Dealership and Distributorship with Makes, Brands, Equipment, Machine and/or accessories as it relates to field of business endevour" />
          <VendorUpload label="Evidence of possession of experience in the line of business(s) you are applying for; prospecting Suppliers must provide at least 5 copies of completed Job Orders and Proof of Deliveries (Delivery Notes or Job Completion Notification in area(s) of business endevour" />
        </div>
        <Separator className="mt-10" />
        <div className="mt-10">
          <Label>
            {
              "Where possible, provide reference Letters from at least 5 reputable organizations, preferably NGOs attesting to active or past business relationship and level of performance (the letters or lists must have relevant addresses, contact persons, telephone numbers and emails); for due diligence confirmation"
            }
          </Label>
          <div>
            <VendorUpload />
            <VendorUpload />
            <VendorUpload />
            <VendorUpload />
            <VendorUpload />
          </div>
        </div>
        <Separator className="mt-10" />
        <div className="mt-10">
          <VendorUpload label="Any other relevant supporting document(s) that could aid your expression of interest." />
        </div>

        <div className="flex justify-between pt-24">
          <FormButton
            onClick={() => navigate(-1)}
            preffix={<ArrowLeft size={14} />}
            type="button"
            className="bg-[#FFF2F2] text-primary "
          >
            Back
          </FormButton>

          <FormButton
            onClick={() => onSubmit()}
            suffix={<ArrowRight size={14} />}
          >
            Proceed
          </FormButton>
        </div>
      </div>
    </VendorRegistationLayout>
  );
};

export default Upload;
