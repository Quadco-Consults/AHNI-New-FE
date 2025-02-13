import Card from "components/shared/Card";
import AddSquareIcon from "components/icons/AddSquareIcon";
import FormButton from "atoms/FormButton";
import ManualSubGrantStepWrapper from "./SubGrantManualSubWrapper";
import { Button } from "components/ui/button";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useParams, useSearchParams } from "react-router-dom";

const ManualSubmissionDocumentUpload = () => {
    const dispatch = useAppDispatch();

    const { id: subGrantId } = useParams();
    const [searchParams] = useSearchParams();
    const partnerSubId = searchParams.get("partnerSubId");

    return (
        <ManualSubGrantStepWrapper>
            <div className="px-5 text-[#1A0000] flex flex-col gap-y-[3rem]">
                <h3 className="text-2xl font-bold">Document Upload</h3>
                <Card className="flex flex-wrap justify-start items-center gap-[1rem] py-[3rem]">
                    <div className="flex flex-wrap w-auto gap-x-[1.25rem] gap-y-[1.25rem]">
                        {/* Uploaded Documents Card */}
                    </div>

                    <Button
                        className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white"
                        type="button"
                        onClick={() =>
                            dispatch(
                                openDialog({
                                    type: DialogType.SUBGRANT_MANUAL_SUB_UPLOAD,
                                    dialogProps: {
                                        header: "Sub-Grant Submission Upload",
                                        subGrantId,
                                        partnerSubId,
                                    },
                                })
                            )
                        }
                    >
                        <AddSquareIcon />
                        Upload New Document
                    </Button>
                </Card>

                <div className="flex justify-end">
                    <FormButton type="submit" size="lg">
                        Submit
                    </FormButton>
                </div>
            </div>
        </ManualSubGrantStepWrapper>
    );
};

export default ManualSubmissionDocumentUpload;
