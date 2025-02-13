import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { CG_GROUTES } from "constants/RouterConstants";
import { useEffect, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
// import { useParams } from "react-router-dom";
import { SubGrantPreAwardsApi } from "services/cAndGApi/subGrant";
import { toast } from "sonner";

interface AnswerObject {
    question_id: string;
    rating: number | null;
}

const PreAwardAssessmentStep2 = () => {
    const getStepTwoQuestions =
        SubGrantPreAwardsApi.useGetSubGrantPreAwardsStepTwoQuestionsQuery({});
    const [postStepTwoMutation, postStepTwoMutationResults] =
        SubGrantPreAwardsApi.useAddSubGrantPreAwardsStepTwoMutation();

    const [answersArray, setAnswersArray] = useState<AnswerObject[]>([]);
    const params = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        let updatedArray = getStepTwoQuestions?.data?.map((item: any) => {
            return {
                question_id: item?.question_id,
                rating: null,
            };
        });
        setAnswersArray(updatedArray);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getStepTwoQuestions]);

    const OptionsArray = [
        // { id: 1, name: "N/A", value: 0 },
        { id: 1, name: "Low", value: 0 },
        { id: 1, name: "Med", value: 1 },
        { id: 1, name: "High", value: 2 },
    ];

    const HandleSubmit = async () => {
        for (let i = 0; i < answersArray.length; i++) {
            let answer = answersArray[i];
            if (answer.rating === null) {
                toast.error("please fill all the forms");
                return;
            }
        }

        try {
            const result = await postStepTwoMutation({
                id: params.id,
                body: answersArray,
            }).unwrap();
            console.log(result);

            toast.success("step two completed");
            navigate(
                generatePath(CG_GROUTES.PRE_AWARD_ASSESSMENT_STEP_3, {
                    id: params.id,
                    result: result?.rating,
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
                    <p className="text-[#FF0000] font-semibold">Step 2/4</p>
                </div>
            </section>
            <section className="w-full">
                <Card className="flex flex-col gap-y-[1.25rem]">
                    <div className="w-full flex flex-col gap-y-[1.25rem]">
                        <p className="text-[#DEA004] font-semibold">
                            Rating & Determination Form
                        </p>
                        <p className="text-sm">
                            Rate the organization as extremely high, high,
                            medium or low risk based upon the financial
                            pre-award results.{" "}
                        </p>
                    </div>
                    {/* <div className="w-full flex flex-col gap-y-[.5rem]">
            <Label className="font-semibold"> Upload Complete Advertisement Document</Label>
            <div className="flex items-center w-full gap-x-[1rem]">
              <label className="cursor-pointer shrink-0 border flex items-center gap-x-[1rem] w-fit rounded-lg border-[#DBDFE9] py-[.875rem] px-[1.125rem]" htmlFor="file">
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
              <p className="border flex items-center w-full gap-x-[1rem] rounded-lg border-[#DBDFE9] px-[1.125rem] h-[3.5rem]">{file?.name}</p>
            </div>
          </div> */}
                    <div className="w-full flex flex-col gap-y-[1.25rem] text-[#1A0000]">
                        {getStepTwoQuestions?.data?.map(
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
                                                    {item?.name}{" "}
                                                    <span className="text-primary">
                                                        | Max rating(
                                                        {item?.max_rating})
                                                    </span>
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
                                                                            ?.rating ===
                                                                        option.value
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
                                                                        ].rating =
                                                                            option.value;
                                                                        setAnswersArray(
                                                                            updatedArray
                                                                        );
                                                                    }}
                                                                >
                                                                    <p className="capitalize">
                                                                        {option.name.toLocaleLowerCase()}
                                                                    </p>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            }
                        )}
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <Button
                            variant={"ghost"}
                            onClick={() =>
                                navigate(
                                    generatePath(
                                        CG_GROUTES.PRE_AWARD_ASSESSMENT_STEP_1,
                                        { id: params.id }
                                    )
                                )
                            }
                        >
                            <p>Cancel</p>
                        </Button>
                        <FormButton
                            onClick={HandleSubmit}
                            loading={postStepTwoMutationResults.isLoading}
                        >
                            <p>Next</p>
                        </FormButton>
                    </div>
                </Card>
            </section>
        </main>
    );
};

export default PreAwardAssessmentStep2;
