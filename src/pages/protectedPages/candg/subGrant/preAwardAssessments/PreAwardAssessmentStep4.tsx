import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { CG_GROUTES } from "constants/RouterConstants";
import { useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { objectToFormData } from "utils/utls";
import AddSquareIcon from "components/icons/AddSquareIcon";
import FadedButton from "atoms/FadedButton";
import { Document, Page } from "react-pdf";
import { PDFICon } from "assets/svgs/CAndGSvgs";
import { createPortal } from "react-dom";
import SubGrantManualDocsModal from "components/modals/dailog/components/SubGrantManualDocsModal";
import DeleteIcon from "components/icons/DeleteIcon";
import { SubGrantPreAwardsApi } from "services/cAndGApi/subGrant";

const PreAwardAssessmentStep4 = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [uploadedDocuments, setUploadedDocuments] = useState<[]>([]);
    const [uploadModal, setUploadModal] = useState(false);
    const [numPages, setNumPages] = useState<number>();

    //   const getDocumentTypes = SubGrantPreAwardsApi.useGetSubGrantPreAwardsDocumentNamesQuery({});
    //   console.log(getDocumentTypes);

    const [postSubGrantDocsMutation, postSubGrantDocsMutationResults] =
        SubGrantPreAwardsApi.useAddSubGrantPreAwardsStep4Mutation();

    const handleDeletePdf = (file: any) => {
        let returnedDocs = uploadedDocuments;
        returnedDocs = returnedDocs.filter((e) => e !== file);
        setUploadedDocuments(returnedDocs);
    };

    const HandleSubmitDocuments = async () => {
        if (uploadedDocuments.length < 1) {
            toast.error("please add a document");
            return;
        }
        for (let i = 0; i < uploadedDocuments.length; i++) {
            let objectDetails = uploadedDocuments[i];
            const formData = objectToFormData({ ...objectDetails });
            try {
                const result = await postSubGrantDocsMutation({
                    body: formData,
                    id: params.id,
                }).unwrap();
                toast.success(result?.message);
            } catch (error: any) {
                toast.error(error?.data?.message);
            }
        }
        setTimeout(() => {
            navigate(
                generatePath(CG_GROUTES.PRE_AWARD_ASSESSMENT_SINGLE, {
                    id: params.id,
                })
            );
            sessionStorage.removeItem("newManualSubgrantSteps");
        }, 1500);
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }


    // SHOW RECOMMENDATION STATEMENT RIGHT AFTER THE SCORE
    return (
        <main className="w-full flex flex-col items-center justify-center gap-y-[1.875rem] text-[#1A0000]">
            <section className="w-full flex items-center justify-between"></section>
            <section className="w-full flex flex-col gap-y-[1.25rem]">
                <Card className="w-full flex flex-col gap-y-[1.25rem]">
                    <div className="w-full flex flex-col gap-y-[1.25rem]">
                        <p className="text-[#DEA004] font-semibold">
                            Document Uploads
                        </p>
                        <p className="text-sm">
                            In the space below, describes the invoice and
                            supporting documentation requirements for the
                            proposed subaward. For cost reimbursable subawards,
                            refer to Table 1 of the “AHNI Subaward Expenditure
                            Documentation Guidance”, and the PAT assigned
                            overall risked rating (low, medium, high or
                            extremely high) to determine the minimum required
                            documentation. For Help: Contact AHNI Operations
                            Management.{" "}
                        </p>
                    </div>
                    <div>
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
                    </div>
                </Card>
                <Card>
                    <div className="flex justify-between items-center w-full">
                        <Button
                            variant={"ghost"}
                            onClick={() =>
                                navigate(
                                    generatePath(
                                        CG_GROUTES.PRE_AWARD_ASSESSMENT_STEP_3,
                                        { id: params.id }
                                    )
                                )
                            }
                        >
                            <p>Cancel</p>
                        </Button>
                        <FormButton
                            loading={postSubGrantDocsMutationResults.isLoading}
                            onClick={HandleSubmitDocuments}
                            size="lg"
                        >
                            Award Contract
                        </FormButton>
                    </div>
                </Card>
            </section>
            {uploadModal &&
                createPortal(
                    <SubGrantManualDocsModal
                        setModalOpen={setUploadModal}
                        setDocs={setUploadedDocuments}
                    />,
                    document.getElementById("portals") as HTMLElement
                )}
        </main>
    );
};

export default PreAwardAssessmentStep4;
