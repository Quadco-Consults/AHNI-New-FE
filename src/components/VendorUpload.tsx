import { Label } from "components/ui/label";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { FC } from "react";

type PageProps = {
  label?: string;
  name?: string;
};
const VendorUpload: FC<PageProps> = ({ label }) => {
  return (
    <div className="">
      <div>
        {label && <Label>{label}</Label>}
        <div className="flex flex-wrap items-center mt-4 gap-x-10">
          <div className="w-[142px] relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
            <UploadFile size={20} />
            <p>Select file</p>
            <Input
              type="file"
              className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer "
            />
          </div>
          <div className="flex flex-1">
            <Input className="w-full  h-[52px] rounded-[16.2px] border" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorUpload;
