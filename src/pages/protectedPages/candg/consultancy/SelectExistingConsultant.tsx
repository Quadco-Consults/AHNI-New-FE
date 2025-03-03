import { AddIcon } from "assets/svgs/CAndGSvgs";
import { Button } from "components/ui/button";
import { useState } from "react";
import {
    consultancyAPIs,
    ConsultancyApplicationsDocsApi,
} from "services/cAndGApi/consultancy";
import { IoMdClose } from "react-icons/io";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import FormButton from "atoms/FormButton";
import { toast } from "sonner";
import { objectToFormData } from "utils/utls";
import { CG_ROUTES } from "constants/RouterConstants";

interface Referee {
    name: string;
    email: string;
}

const SelectExistingConsultant = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [refereeArray, setRefereeArray] = useState<Referee[]>([]);
    const [documentArray, setDocumentArray] = useState();
    const [uploadDocument, setUploadDocument] = useState(false);
    const [userObject, setUserObject] = useState<any>({});
    const [addApplicationMutation, addApplicationMutationResults] =
        consultancyAPIs.useAddConsultancyApplicationDetailsMutation();
    const [addDocument, addDocumentResults] =
        ConsultancyApplicationsDocsApi.useAddConsultancyApplicationDocsMutation();
    const getConsultancyApplications =
        consultancyAPIs.useGetAllConsultancyApplicationsQuery({
            params: {
                job_detail: params.id,
            },
        });

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!userObject?.applicant_name) {
            toast.error("select a consultant");
            return;
        }
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
                applicant_name: userObject?.applicant_name,
                applicant_email: userObject?.applicant_email,
                applicant_phone_number: userObject?.applicant_phone_number,
                employment_type: userObject?.employment_type,
                job_detail: params.id,
                referees: refereeArray,
            }).unwrap();
        } catch (error: any) {
            toast.error(error?.data?.message);
        }
    };

    const ConsultantDetails = [
        { label: "Employment Type", value: userObject?.employment_type || "" },
        { label: "Email", value: userObject?.applicant_email || "" },
        {
            label: "Phone Number",
            value: userObject?.applicant_phone_number || "",
        },
    ];

    return (
        <div className="flex flex-col text-[#1A0000]">
            <form
                className="flex flex-col gap-y-[1.25rem]"
                action=""
                onSubmit={(e) => onSubmit(e)}
            >
                <select
                    className="border border-[#DBDFE9] py-3 px-4 bg-white w-full lg:w-[45%] rounded-[6px]"
                    // required
                    name=""
                    onChange={(e) => {
                        setUserObject(JSON.parse(e.target.value));
                    }}
                >
                    <option value="">Select</option>
                    {getConsultancyApplications?.data?.results?.map(
                        (item: any, index: number) => {
                            // console.log(item);

                            return (
                                <option
                                    value={JSON.stringify(item)}
                                    key={index}
                                >
                                    {item?.applicant_name}
                                </option>
                            );
                        }
                    )}
                    .
                </select>
                <div className="w-full border-y border-[#DBDFE9] py-[1.25rem] space-y-[1.25rem] px-[1.5rem]">
                    <p className="text-2xl font-semibold">
                        {userObject?.applicant_name || ""}
                    </p>
                    <div className="w-full justify-between flex items-center">
                        {!userObject?.applicant_name ? (
                            <div>
                                <p>Please Select a Consultant</p>
                            </div>
                        ) : (
                            ConsultantDetails.map((item, index) => {
                                return (
                                    <div
                                        className="space-y-[1.25rem]"
                                        key={index}
                                    >
                                        <p className="font-semibold">
                                            {item.label}
                                        </p>
                                        <p className="text-sm">{item.value}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
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
                                            required
                                            onChange={(e) => {
                                                let updatedArray = [
                                                    ...refereeArray,
                                                ];
                                                updatedArray[index].name =
                                                    e.target.value;
                                                setRefereeArray(updatedArray);
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
                                            required
                                            onChange={(e) => {
                                                let updatedArray = [
                                                    ...refereeArray,
                                                ];
                                                updatedArray[index].email =
                                                    e.target.value;
                                                setRefereeArray(updatedArray);
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
                        {/* {documentArray.map((item, index) => {
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
                        })} */}
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
                </div>{" "}
            </form>
            {/* {uploadDocument &&
                createPortal(
                    <SubGrantManualDocsModal
                        setDocs={setDocumentArray}
                        setModalOpen={setUploadDocument}
                    />,
                    document.getElementById("portals") as HTMLElement
                )} */}
        </div>
    );
};

export default SelectExistingConsultant;
