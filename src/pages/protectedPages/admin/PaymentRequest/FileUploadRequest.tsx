import FormButton from "atoms/FormButton";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { AdminRoutes } from "constants/RouterConstants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sessionStorage from "redux-persist/es/storage/session";
import { useUploadDocumentMutation } from "services/adminApi/paymentRequest";
import { toast } from "sonner";

type StepsF = {
  currentStep: number;
  // eslint-disable-next-line no-unused-vars
  setCurrentStep: (step: number) => void;
  id?: string;
};

const FileUploadRequest = ({ currentStep, setCurrentStep, id }: StepsF) => {
  const [file, setFile] = useState<File>();
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();

  const navigate = useNavigate();

  const onSubmit = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("document_name", file.name);
    formData.append("document ", file.type);

    try {
      await uploadDocument({
        body: formData,
        id: String(id),
      }).unwrap();

      toast.success("Document uploaded successfully");
      navigate(AdminRoutes.PaymentRequest);
      sessionStorage.removeItem("paymentId");
    } catch (error) {
      toast.error("Error uploading document");
    }
  };
  return (
    <div>
      <Card>
        <CardContent className="p-5 space-y-6">
          <Label>File Upload</Label>
          <Card>
            <CardContent className="p-5">
              <div className="relative w-full h-48">
                <p className="flex items-center gap-x-4">
                  <span className="flex items-center justify-center w-5 h-5 text-white bg-green-500 rounded-full ">
                    +
                  </span>
                  Add Document
                </p>
                {file && <p className="my-2 text-green-500">{file.name}</p>}
                <Input
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  type="file"
                  className="absolute top-0 bottom-0 left-0 right-0 z-10 opacity-0 cursor-pointer "
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-end gap-x-4 ">
            <Button
              onClick={() => {
                setCurrentStep(currentStep - 1);
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <FormButton loading={isLoading} onClick={() => onSubmit()}>
              Submit
            </FormButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploadRequest;
