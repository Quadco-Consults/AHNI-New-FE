import { SubmitHandler, useForm } from "react-hook-form";
import ConsultancyStepWrapper from "./ConsultancyStepWrapper";
import { z } from "zod";
import { ConsunltancyScopeDetails } from "definations/candg-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "components/ui/form";
import FormTextArea from "atoms/FormTextArea";
import FormInput from "atoms/FormInput";
import FadedButton from "atoms/FadedButton";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { useState } from "react";
import { Label } from "components/ui/label";
import { UploadFileSvg } from "assets/svgs/CAndGSvgs";
import { objectToFormData } from "utils/utls";
import Card from "components/shared/Card";
import { consultancyAPIs } from "services/cAndGApi/consultancy";
import { useAppDispatch } from "hooks/useStore";
import FormButton from "atoms/FormButton";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { toast } from "sonner";

const ScopeOfWork = () => {
    const [addScopeMutation, addScopeMutationResults] =
        consultancyAPIs.useAddConsultancyScopeDetailsMutation();
    const dispatch = useAppDispatch();
    const [file, setFile] = useState<File | undefined>();
    const form = useForm<z.infer<typeof ConsunltancyScopeDetails>>({
        resolver: zodResolver(ConsunltancyScopeDetails),
    });

    const [specificDeliverables, setSpecificDeliverables] = useState([
        { id: 1, key: "", value: "" },
    ]);

    // Function to add a new item
    const addDeliverable = () => {
        setSpecificDeliverables([
            ...specificDeliverables,
            { id: specificDeliverables.length + 1, key: "", value: "" },
        ]);
    };

    // Function to remove an item by index
    // const removeDeliverable = (index: number) => {
    //   const newDeliverables = specificDeliverables.filter((_, i) => i !== index);
    //   setSpecificDeliverables(newDeliverables);
    // };

    // Function to update an item
    const updateDeliverable = (
        index: number,
        field: string,
        value: string | number
    ) => {
        const newDeliverables = specificDeliverables.map((deliverable, i) => {
            if (i === index) {
                return { ...deliverable, [field]: value };
            }
            return deliverable;
        });
        setSpecificDeliverables(newDeliverables);
    };
    const compositionData = localStorage.getItem("application-details");
    const parsedData = compositionData ? JSON.parse(compositionData) : null;

    const onSubmit: SubmitHandler<
        z.infer<typeof ConsunltancyScopeDetails>
    > = async (data: any) => {
        // console.log({
        //   ...data,
        //   job_detail: parsedData?.id,
        //   scope_file: file,
        //   specific_deliverables: JSON.stringify(
        //     specificDeliverables.reduce((acc: any, curr: any) => {
        //       acc[curr.key] = curr.value;
        //       return acc;
        //     }, {})
        //   ),
        // });
        const formData = objectToFormData({
            ...data,
            scope_file: file,
            job_detail: parsedData?.id,
            specific_deliverables: JSON.stringify(
                specificDeliverables.reduce((acc: any, curr: any) => {
                    acc[curr.key] = curr.value;
                    // return JSON.stringify(acc);
                    return acc;
                }, {})
            ),
        });
        try {
            const result = await addScopeMutation(formData).unwrap();
            if (result) {
                // console.log(result);
                localStorage.removeItem("application-details");
                localStorage.removeItem("newConsultancySteps");
                dispatch(
                    openDialog({
                        type: DialogType.ConsultancyApplicationSuccess,
                        dialogProps: {
                            header: "",
                            width: "max-w-lg",
                        },
                    })
                );
            }
        } catch (error: any) {
            toast.error(error?.data?.errors?.[0]?.attr + " is required");
            // console.log(error);
        }
    };

    return (
        <ConsultancyStepWrapper>
            <main className="w-full flex flex-col items-center justify-center gap-y-[2.5rem] bg-white p-[1.25rem] pt-[2rem]  rounded-2xl">
                <p className="font-semibold text-[1.25rem] w-full text-black">
                    Scope Of Work
                </p>
                <Form {...form}>
                    <form
                        action=""
                        className="w-full flex flex-col gap-y-[1.25rem]"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormTextArea
                            label2="A descriptive information on the nature of the Contract and other information on how the Contract will be structured or accomplished"
                            label="Description"
                            name="description"
                            placeholder=""
                            required
                        />
                        <FormTextArea
                            label="Background"
                            label2="A detailed information on the need for the Contract and the expected outcome from the Contract"
                            name="background"
                            placeholder=""
                            required
                        />
                        <FormTextArea
                            label=" Objectives"
                            name="objectives"
                            required
                        />
                        <FormInput
                            label="Fee Rate"
                            name="fee_rate"
                            type="number"
                            placeholder=""
                            required
                        />
                        <FormInput
                            label="Payment Frequency"
                            name="payment_frequency"
                            type="number"
                            placeholder=""
                            required
                        />
                        <div className="border-y border-[#DBDFE9] py-[1.875rem] pt-[3rem] space-y-[2rem]">
                            <div className="w-full flex flex-col gap-y-[1.25rem]">
                                <p className="text-[#DEA004] font-semibold">
                                    Specific Deliverables
                                </p>
                                <p className="text-[#4D4545] text-sm">
                                    Based on the activities listed above, the
                                    Contractor is expected to produced or
                                    accomplish the following:
                                </p>
                            </div>
                            <div className="gap-y-[.5rem] flex flex-col">
                                {specificDeliverables.map(
                                    (deliverable, index) => (
                                        <div
                                            key={index}
                                            className="flex w-ful justify-between relative"
                                        >
                                            <div className="w-[55%]">
                                                <input
                                                    type="text"
                                                    placeholder=""
                                                    required
                                                    value={deliverable.key}
                                                    onChange={(e) =>
                                                        updateDeliverable(
                                                            index,
                                                            "key",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                                />
                                            </div>
                                            <div className="w-[43%]">
                                                <input
                                                    type="number"
                                                    placeholder=""
                                                    required
                                                    value={deliverable.value}
                                                    onChange={(e) =>
                                                        updateDeliverable(
                                                            index,
                                                            "value",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                                />
                                            </div>{" "}
                                        </div>
                                    )
                                )}
                                <div className="my-[.5rem]">
                                    <FadedButton
                                        type="button"
                                        onClick={addDeliverable}
                                    >
                                        <div className="w-full flex items-center text-primary my-[.5rem]">
                                            <AddSquareIcon />
                                            <p>Add More</p>
                                        </div>
                                    </FadedButton>
                                </div>
                            </div>
                        </div>
                        <div className="border-b border-[#DBDFE9] py-[1.875rem]  space-y-[2rem]">
                            <div className="flex flex-col gap-y-[1rem]">
                                <Label className="font-semibold">
                                    {" "}
                                    Upload Complete Advertisement Document
                                </Label>
                                <div className="flex items-center w-full gap-x-[1rem]">
                                    <label
                                        className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]"
                                        htmlFor="file"
                                    >
                                        <UploadFileSvg />
                                        Select file
                                    </label>
                                    <input
                                        type="file"
                                        // name="file"
                                        hidden
                                        id="file"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setFile(e.target.files?.[0]);
                                            }
                                        }}
                                    />
                                    <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">
                                        {file?.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Card>
                            <div className="w-full flex flex-col gap-y-[1.25rem]">
                                <p className="text-[#DEA004] font-semibold">
                                    Confidential and Proprietary Information
                                </p>
                                <p className="text-[#4D4545] text-sm">
                                    All information, documents and data
                                    resulting from the performance of
                                    Contractor’s work under this Agreement shall
                                    be the sole property of AHNi. Upon
                                    termination of Agreement, Contractor agrees
                                    to return to AHNi all property and materials
                                    within Contractor’s possession or control
                                    which belong to AHNi or which contain
                                    Confidential Information.
                                </p>
                            </div>
                        </Card>
                        <div className="flex justify-end items-center gap-x-[1rem]">
                            <div>
                                <FadedButton type="button">
                                    <p className="text-primary">Cancel</p>
                                </FadedButton>
                            </div>
                            <div>
                                <FormButton
                                    loading={addScopeMutationResults.isLoading}
                                >
                                    <p>Submit</p>
                                </FormButton>
                            </div>
                        </div>
                    </form>
                </Form>
            </main>
        </ConsultancyStepWrapper>
    );
};

export default ScopeOfWork;
