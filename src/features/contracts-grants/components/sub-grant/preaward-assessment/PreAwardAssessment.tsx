import BackNavigation from "components/atoms/BackNavigation";
import FormButton from "@/components/FormButton";
import Card from "components/Card";
import { Button } from "components/ui/button";
import { useGetAllQuestionnaires } from "@/features/modules/controllers/procurement/questionnaire";

export default function PreAwardAssessmentStep() {
    const { data: questionaires } = useGetAllQuestionnaires({
        page: 1,
        size: 2000000,
    });

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
                        {questionaires?.data.results.map(({ name }, index) => (
                            <Card className="w-full">
                                <div className="flex justify-between">
                                    <p className="uppercase font-semibold">
                                        {index + 1}
                                    </p>
                                    <div className="w-[98%] gap-y-[.625rem] flex flex-col">
                                        <p className="text-sm font-semibold ">
                                            {name}
                                        </p>
                                        <div className="flex gap-x-[1.25rem]">
                                            <div
                                                className={`w-[12.5rem] h-[3.5rem] border rounded cursor-pointer flex items-center justify-center`}
                                            >
                                                <p className="capitalize">
                                                    YES
                                                </p>
                                            </div>

                                            <div
                                                className={`w-[12.5rem] h-[3.5rem] border rounded cursor-pointer flex items-center justify-center`}
                                            >
                                                <p className="capitalize">NO</p>
                                            </div>
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
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <Button variant={"ghost"}>Cancel</Button>
                        <FormButton>Next</FormButton>
                    </div>
                </Card>
            </section>
        </main>
    );
}

/* ${
                                                answersArray?.[index]
                                                    ?.response === option
                                                    ? "border-primary text-primary"
                                                    : "border-[#756D6D] text-inherit"
                                            } */
