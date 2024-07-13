import { Label } from "components/ui/label";
import VendorRegistationLayout from "./VendorRegistationLayout";
import { Checkbox } from "components/ui/checkbox";
import FormButton from "atoms/FormButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Attestation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onSubmit = () => {
    let path = pathname;

    path = path.substring(0, path.lastIndexOf("/"));

    path += "/upload";
    navigate(path);
  };
  return (
    <VendorRegistationLayout>
      <div>
        <h2 className="text-lg font-bold">Attestation</h2>
        <div className="mt-10">
          <div className="space-y-3">
            <Label>
              Attestation Statement
              <span className="text-red-500" title="required">
                *
              </span>
            </Label>
            <div className="border text-sm text-[#B3B7C1] px-2 py-6 rounded-xl bg-[#F9F9F9]">
              I hereby attest that, to the best of my knowledge and belief, all
              information provided in this form are true and correct. I
              understand that AHNi may request additional information either
              from me or those listed herein to substantiate all the statement,
              attachment(s) and/or listings made in this form and shall use such
              to determine the company’s eligibility. We authorize AHNI to make
              any inquiries regarding the information provided herein
            </div>
          </div>
          <div className="flex items-center mt-4 gap-x-2">
            <Checkbox />
            <Label> I Agree</Label>
          </div>
          <div className="flex justify-between pt-24">
            <FormButton
              onClick={() => navigate(-1)}
              preffix={<ArrowLeft size={14} />}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
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
      </div>
    </VendorRegistationLayout>
  );
};

export default Attestation;
