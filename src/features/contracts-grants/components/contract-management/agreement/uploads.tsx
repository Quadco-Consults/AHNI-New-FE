import ServiceLevelAgreementLayout from "./Layout";
import { Button } from "components/ui/button";
import AddSquareIcon from "components/icons/AddSquareIcon";
import FormButton from "@/components/FormButton";
import { useAppDispatch } from "hooks/useStore";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";

export default function ServiceLevelAgreementUploads() {
    const dispatch = useAppDispatch();

    const onSubmit = () => {};

    return (
        <ServiceLevelAgreementLayout>
            <form onSubmit={onSubmit} className="space-y-3">
                <h1 className="text-xl font-bold">Document Uploads</h1>

                <Button
                    className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500 dark:bg-primary dark:text-white"
                    type="button"
                    onClick={() => {
                        dispatch(
                            openDialog({
                                type: DialogType.DOCUMENT_UPLOADS,
                                dialogProps: {
                                    header: "Service Level Document Upload",
                                },
                            })
                        );
                    }}
                >
                    <AddSquareIcon />
                    Upload Document
                </Button>

                <div className="relative w-full h-48"></div>
                <div className="flex items-center justify-end gap-x-4">
                    <Button variant="outline" type="button" size="lg">
                        Back
                    </Button>

                    <FormButton size="lg" loading={false}>
                        Finish
                    </FormButton>
                </div>
            </form>
        </ServiceLevelAgreementLayout>
    );
}
