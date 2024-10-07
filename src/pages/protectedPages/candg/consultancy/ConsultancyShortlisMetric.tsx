import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormInput from "atoms/FormInput";
import Card from "components/shared/Card";
import { FormField, FormItem, Form, FormControl } from "components/ui/form";
import { Label } from "components/ui/label";
import MultiSelectFormField from "components/ui/multiselect";
import { ConsultancyMetrics } from "definations/candg-validator";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { consultancyAPIs } from "services/cAndGApi/consultancy";
import { z } from "zod";

interface Evaluation {
  evaluationId: string;
  evaluation: string;
}

const ConsultancyShortlisMetric = () => {
  const params = useParams();
  const form = useForm<z.infer<typeof ConsultancyMetrics>>({
    resolver: zodResolver(ConsultancyMetrics),
  });

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // const navigate = useNavigate();
  const getConsultancyApplications = consultancyAPIs.useGetAllConsultancyApplicationsQuery({
    params: {
      job_detail: params.id,
      status: "short-listed",
    },
  });

  const Consultants = getConsultancyApplications?.data?.results;

  const getMetricQuestions = consultancyAPIs.useGetMetricQuestionsQuery({});
  const MetricQuestions = getMetricQuestions?.data;

  const onSubmit = async (data: z.infer<typeof ConsultancyMetrics>) => {
    // normailize the array field

    console.log({ ...data, evaluations: evaluations });
  };

  return (
    <main className="w-full flex flex-col justify-center gap-y-[1rem]">
      <BackNavigation />
      <TopDetails />
      <Form {...form}>
        <form action="" className="px-[1rem] flex flex-col gap-y-[1rem]" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full border border-[#DBDFE9] rounded-2xl flex flex-col pb-[1rem] bg-white">
            <div className="flex items-center w-full">
              <div className="w-[20%]">
                <p className="px-[.625rem] h-[70px] flex flex-col justify-center w-full border-b border-[#DBDFE9]">Consultant Names </p>
              </div>
              <div className="w-full border-l overflow-x-auto">
                {/* <div className="w-full bg-gradient-to-br from-yellow-400 via-purple-600 to-indigo-400 border-l overflow-x-auto"> */}
                <div className="flex w-auto shrink-0">
                  {MetricQuestions?.map((question: any, index: number) => {
                    return (
                      <p className="w-[15rem] shrink-0 border-r border-y px-[.625rem] font-semibold h-[70px] justify-center items-center flex text-xs" key={index}>
                        {question?.name}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center w-full">
              <div className="w-[20%] border-r">
                {Consultants?.map((consultant: any, index: number) => {
                  return (
                    <p className="px-[.625rem] py-5 w-full border-b border-[#DBDFE9]" key={index}>
                      {consultant?.applicant_name}
                    </p>
                  );
                })}
              </div>
              <div className="w-full flex overflow-auto">
                <div className="w-full border-l overflow-x-auto">
                  {/* <div className="w-full bg-gradient-to-br from-yellow-400 via-purple-600 to-indigo-400 border-l overflow-x-auto"> */}
                  {Consultants?.map((item: any, index: number) => {
                    return (
                      <div className="flex w-auto shrink-0" key={index}>
                        {MetricQuestions?.map((question: any, index: number) => {
                          return (
                            <p className="w-[15rem] border-r border-y p-[.625rem] font-semibold h-[70px] justify-center items-center flex text-xs" key={index}>
                              <select
                                className="w-full p-2 rounded-lg bg-white border"
                                id={`evaluation-${question?.id}`}
                                onChange={(e) => {
                                  let currEvaluation = [...evaluations];
                                  if (!currEvaluation[index]) {
                                    currEvaluation[index] = { evaluation: "", evaluationId: "" };
                                  }
                                  currEvaluation[index].evaluation = e.target.value;
                                  currEvaluation[index].evaluationId = question?.id;
                                  setEvaluations(currEvaluation);
                                }}
                                required
                              >
                                <option value="">Select</option>
                                <option value="Unacceptable">Unacceptable</option>
                                <option value="Marginal">Marginal</option>
                                <option value="Acceptable">Acceptable</option>
                                <option value="Excellent">Excellent</option>
                              </select>{" "}
                            </p>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>{" "}
              </div>
            </div>
          </div>
          <Card>
            <p className="font-semibold text-[#DEA004]">Justification for Selection/Other Comments (narrative)</p> <div></div>
            {/* <div>
              <Label>Preferred Consultant</Label>
              <MultiSelectFormField
                name="selected_ids"
                options={Consultants?.map((consultant: any) => {
                  return {
                    id: consultant?.id,
                    name: consultant?.applicant_name,
                  };
                })}
                placeholder=""
                onValueChange={() => ""}
              />
            </div> */}
            <div className="space-y-1">
              <Label className="font-semibold">Target population</Label>
              <FormField
                control={form.control}
                name="selected_applications"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultiSelectFormField
                        options={
                          Consultants?.map((consultant: any) => {
                            return {
                              id: consultant?.id,
                              name: consultant?.applicant_name,
                            };
                          }) || []
                        }
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select options"
                        variant="inverted"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormInput name="evaluation_comments" label="Comments" required />
          </Card>
          <div>
            <FormButton type="submit">
              <p>Submit</p>
            </FormButton>
          </div>
        </form>
      </Form>
    </main>
  );
};

export default ConsultancyShortlisMetric;

const TopDetails = () => {
  return (
    <Card className="mx-[1rem] flex flex-col gap-y-[1.25rem]">
      <p className="font-semibold text-[#DEA004]">Consultant Evaluation Matrix</p>{" "}
      <div className="flex flex-col gap-y-[1rem]">
        <p>Kindly use this matrix to comparatively evaluate consulting candidates. For each consultant, next to each criteria enter a ranking ranging between 1 and 4, where:</p>
        <ul className="text-[#FF0000] list-disc ml-[2rem] text-sm flex flex-col gap-y-[.5rem]">
          <li>
            Unacceptable
            <span className="text-[#1A0000]"> (Did not meet any requirements)</span>
          </li>
          <li>
            Marginal
            <span className="text-[#1A0000]"> (Meets some requirements, but not others)</span>
          </li>
          <li>
            Marginal
            <span className="text-[#1A0000]"> (Meets most or all requirements)</span>
          </li>
          <li>
            Excellent
            <span className="text-[#1A0000]"> (Meets or exceeds all requirements)</span>
          </li>
        </ul>
      </div>
    </Card>
  );
};
