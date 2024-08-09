import { Label } from "components/ui/label";
import { Input } from "components/ui/input";
import { Upload as UploadFile } from "lucide-react";
import { FC } from "react";
import { cn } from "lib/utils";
import { useFormContext } from "react-hook-form";

type PageProps = {
  label?: string;
  name: string;
  extraClass?: string;
};
const FileUpload: FC<PageProps> = ({ label, extraClass, name }) => {
  const { register, watch } = useFormContext();

  const file = watch(name) as FileList;

  return (
    <div className="w-full">
      <div>
        {label && <Label>{label}</Label>}
        <div
          className={cn(
            "flex flex-wrap items-center mt-4 gap-x-10",
            extraClass
          )}
        >
          <div className="w-[142px] relative gap-x-3 h-[52px] rounded-[16.2px] border flex justify-center items-center">
            <UploadFile size={20} />
            <p>Select file</p>
            <Input
              accept="image/*"
              {...register(name)}
              type="file"
              className="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer "
            />
          </div>
          <div className="flex flex-1 mb-1">
            <Input
              className="w-full  h-[52px] rounded-[16.2px] border"
              value={file ? file[0]?.name : ""}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
