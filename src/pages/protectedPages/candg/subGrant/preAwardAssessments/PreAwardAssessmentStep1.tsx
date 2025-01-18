import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { CG_GROUTES } from "constants/RouterConstants";
import { useEffect, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { SubGrantPreAwardsApi } from "services/cAndGApi/subGrant";
import { toast } from "sonner";

interface AnswerObject {
    question_id: string;
    response: string;
    key_findings: string;
}

const PreAwardAssessmentStep1 = () => {
    const getStepOneQuestions =
        SubGrantPreAwardsApi.useGetSubGrantPreAwardsStepOneQuestionsQuery({});
    const [answersArray, setAnswersArray] = useState<AnswerObject[]>([]);
    const params = useParams();
    const navigate = useNavigate();
    const [postStepOneMutation, postStepOneMutationResults] =
        SubGrantPreAwardsApi.useAddSubGrantPreAwardsStep1Mutation();

    useEffect(() => {
        let updatedArray = getStepOneQuestions?.data?.map((item: any) => {
            return {
                question_id: item?.question_id,
                response: "",
                key_findings: "",
            };
        });

        setAnswersArray(updatedArray);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getStepOneQuestions]);

    const OptionsArray = ["YES", "NO"];
    const HandleSubmit = async () => {
        for (let i = 0; i < answersArray.length; i++) {
            let answer = answersArray[i];
            if (answer.response === "") {
                toast.error("please fill all the forms");
                return;
            }
        }

        try {
            await postStepOneMutation({
                id: params.id,
                body: answersArray,
            }).unwrap();
            toast.success("step one completed");
            navigate(
                generatePath(CG_GROUTES.PRE_AWARD_ASSESSMENT_STEP_2, {
                    id: params.id,
                })
            );
        } catch (error: any) {
            toast.error(error?.data?.message);
            console.log(error);
        }
    };

    return (
        <main className="w-full flex flex-col items-center justify-center gap-y-[1.875rem] text-[#1A0000]">
            <section className="w-full flex items-center justify-between">
                <div className="w-auto flex gap-x-[1.25rem] items-center justify-start">
                    <BackNavigation />
                </div>
                <div>
                    <p className="text-[#FF0000] font-semibold">Step 1/4</p>
                </div>
            </section>
            <section className="w-full">
                <Card className="flex flex-col justify-center items-center gap-y-[1.25rem]">
                    <div className="w-full flex flex-col gap-y-[1.25rem]">
                        <p className="text-[#DEA004] font-semibold">
                            PROGRAMMING CAPACITY
                        </p>
                        <p className="text-sm">
                            Rate the organization as extremely high, high,
                            medium or low risk based upon the financial
                            pre-award results.{" "}
                        </p>
                    </div>
                    <div className="w-full flex flex-col gap-y-[1.25rem] text-[#1A0000]">
                        {getStepOneQuestions?.data?.map(
                            (item: any, index: number) => {
                                return (
                                    <Card className="w-full" key={index}>
                                        <div className="flex justify-between">
                                            <p className="uppercase font-semibold">
                                                {String.fromCharCode(
                                                    65 + index
                                                )}
                                            </p>
                                            <div className="w-[98%] gap-y-[.625rem] flex flex-col">
                                                <p className="text-sm font-semibold ">
                                                    {item?.name}
                                                </p>
                                                <div className="flex gap-x-[1.25rem]">
                                                    {OptionsArray?.map(
                                                        (
                                                            option,
                                                            optionIndex
                                                        ) => {
                                                            return (
                                                                <div
                                                                    className={`w-[12.5rem] h-[3.5rem] border rounded cursor-pointer  ${
                                                                        answersArray?.[
                                                                            index
                                                                        ]
                                                                            ?.response ===
                                                                        option
                                                                            ? "border-primary text-primary"
                                                                            : "border-[#756D6D] text-inherit"
                                                                    } flex items-center justify-center`}
                                                                    key={
                                                                        optionIndex
                                                                    }
                                                                    onClick={() => {
                                                                        let updatedArray =
                                                                            [
                                                                                ...answersArray,
                                                                            ];
                                                                        updatedArray[
                                                                            index
                                                                        ].response =
                                                                            option;
                                                                        setAnswersArray(
                                                                            updatedArray
                                                                        );
                                                                    }}
                                                                >
                                                                    <p className="capitalize">
                                                                        {option.toLocaleLowerCase()}
                                                                    </p>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor=""
                                                        className="font-semibold text-sm"
                                                    >
                                                        Key Findings
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-100 dark:bg-background"
                                                        onChange={(e) => {
                                                            let updatedArray = [
                                                                ...answersArray,
                                                            ];
                                                            updatedArray[
                                                                index
                                                            ].key_findings =
                                                                e.target.value;
                                                            setAnswersArray(
                                                                updatedArray
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            }
                        )}
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <Button variant={"ghost"}>
                            <p>Cancel</p>
                        </Button>
                        <FormButton
                            onClick={HandleSubmit}
                            loading={postStepOneMutationResults.isLoading}
                        >
                            <p>Next</p>
                        </FormButton>
                    </div>
                </Card>
            </section>
        </main>
    );
};

export default PreAwardAssessmentStep1;
