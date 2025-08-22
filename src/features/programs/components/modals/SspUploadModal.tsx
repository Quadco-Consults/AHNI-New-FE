import FileUpload from "components/atoms/FileUpload";
import { Button } from "components/ui/button";

const SspUploadModal = () => {
    return (
        <div className="w-full">
            {/* <FileUpload name="" /> */}

            <div className="flex justify-between gap-5 mt-16">
                <Button
                    type="button"
                    className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                >
                    Cancel
                </Button>
                <Button>Done</Button>
            </div>
        </div>
    );
};

export default SspUploadModal;