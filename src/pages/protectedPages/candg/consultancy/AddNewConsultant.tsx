import { AddIcon } from "assets/svgs/CAndGSvgs";
import { Button } from "components/ui/button";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { DocumentPayload } from "../subGrant/ManualSubmissionDocumentUpload";
import { createPortal } from "react-dom";
import SubGrantManualDocsModal from "components/modals/dailog/components/SubGrantManualDocsModal";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "atoms/FormInput";
import { Form } from "components/ui/form";
import { ConsultancyApplication } from "definations/candg-validator";
import { toast } from "sonner";
import {
    consultancyAPIs,
    ConsultancyApplicationsDocsApi,
} from "services/cAndGApi/consultancy";
import FormButton from "atoms/FormButton";
import { objectToFormData } from "utils/utls";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { CandGRoutes } from "constants/RouterConstants";

interface Referee {
    name: string;
    email: string;
}

const AddNewConsultant = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [addApplicationMutation, addApplicationMutationResults] =
        consultancyAPIs.useAddConsultancyApplicationDetailsMutation();
    const [addDocument, addDocumentResults] =
        ConsultancyApplicationsDocsApi.useAddConsultancyApplicationDocsMutation();
    const [refereeArray, setRefereeArray] = useState<Referee[]>([]);
    const [documentArray, setDocumentArray] = useState<DocumentPayload[]>([]);
    const [uploadDocument, setUploadDocument] = useState(false);
    const form = useForm<typeof ConsultancyApplication>({
        resolver: zodResolver(ConsultancyApplication),
    });
    const onSubmit: SubmitHandler<typeof ConsultancyApplication> = async (
        data
    ) => {
        if (refereeArray.length < 1) {
            toast.error("add at least one referee");
            return;
        }
        for (let i = 0; i < refereeArray.length; i++) {
            let current = refereeArray[i];
            if (
                current.email === "" &&
                current.name === "" &&
                !current.email.includes("@")
            ) {
                toast.error("please complete referee details");
                return;
            }
        }
        try {
            const result = await addApplicationMutation({
                ...data,
                job_detail: params.id,
                referees: refereeArray,
            }).unwrap();
            if (result) {
                for (let i = 0; i < documentArray.length; i++) {
                    let objectDetails = documentArray[i];
                    const formData = objectToFormData({
                        ...objectDetails,
                        application: result.id,
                    });
                    try {
                        const result = await addDocument(formData).unwrap();
                        toast.success(result?.message);
                        navigate(
                            generatePath(CandGRoutes.CONSULTANCY_DETAILS, {
                                id: params.id,
                            })
                        );
                    } catch (error: any) {
                        toast.error(error?.data?.message);
                    }
                }
            }
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };

    return (
        <div className="flex flex-col text-[#1A0000]">
            <Form {...form}>
                <form
                    className="flex flex-wrap justify-between gap-y-[1.25rem]"
                    action=""
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="w-[49%]">
                        <FormInput
                            name="applicant_name"
                            label="Name"
                            required
                        />
                    </div>
                    <div className="w-[49%]">
                        <FormInput
                            name="applicant_email"
                            label="Email"
                            required
                        />
                    </div>
                    <div className="w-[49%]">
                        <FormInput
                            name="applicant_phone_number"
                            label="Phone Number"
                            required
                        />
                    </div>
                    <div className="w-[49%]">
                        <FormInput
                            name="employment_type"
                            label="Employment Type"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-y-[1.25rem] w-full items-start">
                        <p className="font-semibold">Referee</p>
                        <div className="w-full space-y-[1.5rem]">
                            {refereeArray.map((item, index) => {
                                return (
                                    <div
                                        className="flex items-center justify-between"
                                        key={index}
                                    >
                                        <div className="flex flex-col w-[47%]">
                                            <label
                                                htmlFor=""
                                                className="font-semibold"
                                            >
                                                Name
                                                <span className="text-[#ff0000]">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="w-full border border-[#DBDFE9] bg-[#F9F9F9] p-5 rounded-[6px]"
                                                type="text"
                                                name={`name${index + 1}`}
                                                // required
                                                onChange={(e) => {
                                                    let updatedArray = [
                                                        ...refereeArray,
                                                    ];
                                                    updatedArray[index].name =
                                                        e.target.value;
                                                    setRefereeArray(
                                                        updatedArray
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col w-[47%]">
                                            <label
                                                htmlFor=""
                                                className="font-semibold"
                                            >
                                                Email
                                                <span className="text-[#ff0000]">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                className="w-full border border-[#DBDFE9] bg-[#F9F9F9] p-5 rounded-[6px]"
                                                type="email"
                                                name={`email${index + 1}`}
                                                // required
                                                onChange={(e) => {
                                                    let updatedArray = [
                                                        ...refereeArray,
                                                    ];
                                                    updatedArray[index].email =
                                                        e.target.value;
                                                    setRefereeArray(
                                                        updatedArray
                                                    );
                                                }}
                                            />
                                        </div>
                                        <IoMdClose
                                            className="text-3xl text-[#ff0000] cursor-pointer"
                                            onClick={() => {
                                                let updatedArray =
                                                    refereeArray.filter(
                                                        (e) => e !== item
                                                    );
                                                // let updatedArray = refereeArray.splice(index, 1);
                                                console.log(
                                                    updatedArray,
                                                    "after splice"
                                                );

                                                setRefereeArray(updatedArray);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <Button
                            className="px-0 space-x-[1rem]"
                            variant={"custom"}
                            type="button"
                            onClick={() => {
                                let updatedArray = [...refereeArray];
                                updatedArray = [
                                    ...updatedArray,
                                    { name: "", email: "" },
                                ];
                                setRefereeArray(updatedArray);
                            }}
                        >
                            <AddIcon />
                            <p className="text-[#201630]">Add Referee</p>
                        </Button>
                    </div>
                    <div className="flex flex-col gap-y-[1.25rem] w-full items-start">
                        <p className="font-semibold">Documents</p>
                        <div className="w-full flex flex-wrap justify-between items-center gap-y-[1.5rem]">
                            {documentArray.map((item, index) => {
                                return (
                                    <div
                                        className="flex items-center w-[49%] justify-between"
                                        key={index}
                                    >
                                        <div className="flex flex-col w-full">
                                            <label
                                                htmlFor=""
                                                className="font-semibold"
                                            >
                                                Upload {item.document_name}
                                            </label>
                                            <input
                                                className="w-full border border-[#DBDFE9] bg-[#F9F9F9] p-5 rounded-[6px]"
                                                type="text"
                                                name={`name${index + 1}`}
                                                required
                                                value={item.document_file.name}
                                                disabled
                                            />
                                        </div>
                                        <IoMdClose
                                            className="text-3xl text-[#ff0000] cursor-pointer"
                                            onClick={() => {
                                                let updatedArray =
                                                    documentArray.filter(
                                                        (e) => e !== item
                                                    );
                                                // let updatedArray = refereeArray.splice(index, 1);
                                                // console.log(updatedArray, "after splice");

                                                setDocumentArray(updatedArray);
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <Button
                            className="px-0 space-x-[1rem]"
                            variant={"custom"}
                            type="button"
                            onClick={() => {
                                setUploadDocument(true);
                            }}
                        >
                            <AddIcon />
                            <p className="text-[#201630]">Add Document</p>
                        </Button>
                    </div>
                    <div className="w-full flex justify-end items-center gap-x-[1rem]">
                        <Button
                            className="bg-[#FFF2F2] text-primary"
                            variant={"ghost"}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <FormButton
                            loading={
                                addApplicationMutationResults.isLoading ||
                                addDocumentResults.isLoading
                            }
                        >
                            Submit
                        </FormButton>
                    </div>
                </form>
            </Form>
            {uploadDocument &&
                createPortal(
                    <SubGrantManualDocsModal
                        setDocs={setDocumentArray}
                        setModalOpen={setUploadDocument}
                    />,
                    document.getElementById("portals") as HTMLElement
                )}
        </div>
    );
};

export default AddNewConsultant;
