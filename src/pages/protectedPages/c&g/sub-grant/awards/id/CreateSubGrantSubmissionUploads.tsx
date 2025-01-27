// import { useState } from "react";
import Card from "components/shared/Card";
import FadedButton from "atoms/FadedButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { useState } from "react";
import { createPortal } from "react-dom";
import SubGrantManualDocsModal from "components/modals/dailog/components/SubGrantManualDocsModal";
import { Document, Page } from "react-pdf";
import { PDFICon } from "assets/svgs/CAndGSvgs";
import DeleteIcon from "components/icons/DeleteIcon";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { SubGrantApplicationsDocsApi } from "services/cAndGApi/subGrant";
import { toast } from "sonner";
import { objectToFormData } from "utils/utls";
import FormButton from "atoms/FormButton";
import { CG_GROUTES } from "constants/RouterConstants";
import ManualSubGrantStepWrapper from "./CreateSubGrantSubmissionWrapper";

export interface DocumentPayload {
    document_name: string;
    document_file: File;
}

const ManualSubmissionDocumentUpload = () => {
    const params = useParams();
    const [submitDocumentsMutation, submitDocumentsMutationResults] =
        SubGrantApplicationsDocsApi.useAddSubGrantApplicationDocsMutation();
    const [uploadedDocuments, setUploadedDocuments] = useState<
        DocumentPayload[]
    >([]);
    const [uploadModal, setUploadModal] = useState(false);
    const [numPages, setNumPages] = useState<number>();

    const navigate = useNavigate();
    const handleDeletePdf = (file: any) => {
        let returnedDocs = uploadedDocuments;
        returnedDocs = returnedDocs.filter((e) => e !== file);
        setUploadedDocuments(returnedDocs);
    };

    const HandleSubmitDocuments = async () => {
        for (let i = 0; i < uploadedDocuments.length; i++) {
            let objectDetails = uploadedDocuments[i];
            const formData = objectToFormData({
                ...objectDetails,
                sub_grant_application_id: params.id,
            });
            try {
                const result = await submitDocumentsMutation(formData).unwrap();
                toast.success(result?.message);
            } catch (error: any) {
                toast.error(error?.data?.message);
            }
        }
        setTimeout(() => {
            navigate(generatePath(CG_GROUTES.SUBGRANT));
            sessionStorage.removeItem("newManualSubgrantSteps");
        }, 1500);
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <ManualSubGrantStepWrapper>
            <div className="px-5 text-[#1A0000] flex flex-col gap-y-[3rem]">
                <p className="text-2xl font-bold">Document Upload</p>
                <Card className="flex flex-wrap justify-start items-center gap-[1rem] py-[3rem]">
                    <div className="flex flex-wrap w-auto gap-x-[1.25rem] gap-y-[1.25rem]">
                        {uploadedDocuments.map((item, index) => {
                            return (
                                <Card
                                    className="w-full md:w-[296px] h-[316px] overflow-hidden py-5 px-4 bg-white rounded-md flex flex-col justify-between items-start"
                                    key={index}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex gap-x-[1rem] items-center">
                                            <PDFICon />
                                            <p className="text-[#756D6D] font-semibold">
                                                {item?.document_name?.slice(
                                                    0,
                                                    15
                                                )}
                                            </p>
                                        </div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleDeletePdf(item)
                                            }
                                        >
                                            <DeleteIcon />
                                        </div>
                                    </div>
                                    <div className="h-[80%] overflow-hidden flex flex-col justify-center items-center w-full rounded-lg">
                                        <Document
                                            className={
                                                "w-full h-full rounded-md cursor-pointer flex flex-col justify-center items-center"
                                            }
                                            noData="Invalid PDF file"
                                            file={item?.document_file}
                                            error={"Invalid PDF file"}
                                            onLoadSuccess={
                                                onDocumentLoadSuccess
                                            }
                                        >
                                            <Page
                                                pageNumber={1}
                                                pageIndex={numPages}
                                                canvasBackground="gray"
                                                className={
                                                    "rounded-md cursor-pointer bg-gray-300"
                                                }
                                                scale={0.5}
                                            ></Page>
                                        </Document>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                    <FadedButton
                        type="button"
                        onClick={() => {
                            setUploadModal(true);
                        }}
                    >
                        <div className="text-[#FF0000] flex items-center gap-x-[.5rem]">
                            <AddSquareIcon />
                            <p>Upload New Document</p>
                        </div>
                    </FadedButton>
                </Card>
                <div>
                    <FormButton
                        loading={submitDocumentsMutationResults.isLoading}
                        onClick={HandleSubmitDocuments}
                    >
                        <p>Submit</p>
                    </FormButton>
                </div>
                {uploadModal &&
                    createPortal(
                        <SubGrantManualDocsModal
                            setModalOpen={setUploadModal}
                            setDocs={setUploadedDocuments}
                        />,
                        document.getElementById("portals") as HTMLElement
                    )}
            </div>
        </ManualSubGrantStepWrapper>
    );
};

export default ManualSubmissionDocumentUpload;
