import { zodResolver } from "@hookform/resolvers/zod";
import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import FormSelect from "atoms/FormSelect";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { CandGRoutes } from "constants/RouterConstants";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { SubGrantPreAwardsApi } from "services/cAndGApi/subGrant";
import { toast } from "sonner";
import { z } from "zod";

const PreAwardSchema = z.object({
  award_condition: z.string().optional(),
});

const PreAwardAssessmentStep3 = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [openSpecialAwardCondition, setOpenSpecialAwradCondition] = useState(false);

  const recommendationButtons = ["Proceed with the subaward", "Do not proceed with the subaward."];
  const [recommendationState, setRecommendationState] = useState(-1);

  const [postPreAwardStep2Mutation, postPreAwardStep2MutationResults] = SubGrantPreAwardsApi.useAddSubGrantPreAwardsStep3Mutation();

  const form = useForm<z.infer<typeof PreAwardSchema>>({
    resolver: zodResolver(PreAwardSchema),
  });
  const onSubmit: SubmitHandler<z.infer<typeof PreAwardSchema>> = async (data) => {
    try {
      await postPreAwardStep2Mutation({ body: { ...data, recommendation: recommendationButtons[0] }, id: params.id }).unwrap();
      toast.success("step 3 completed");
      navigate(generatePath(CandGRoutes.PRE_AWARD_ASSESSMENT_STEP_4, { id: params.id }));
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  const HandleSumbit = async () => {
    try {
      await postPreAwardStep2Mutation({ body: { recommendation: recommendationButtons[1] }, id: params.id }).unwrap();
      toast.success("step 3 completed");
      navigate(generatePath(CandGRoutes.PRE_AWARD_ASSESSMENT_STEP_4, { id: params.id }));
    } catch (error: any) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center gap-y-[1.875rem] text-[#1A0000]">
      <section className="w-full flex items-center justify-between">
        <div className="w-auto flex gap-x-[1.25rem] items-center justify-start">
          <BackNavigation />
        </div>
        <div>
          <p className="text-[#FF0000] font-semibold">Step 3/4</p>
        </div>
      </section>
      <section className="w-full flex flex-col gap-y-[1.25rem]">
        <Card className="w-full flex flex-col gap-y-[1.25rem]">
          <Card className="w-full flex flex-col justify-center items-center">
            <div className="border border-[#1A9B3E] rounded-2xl p-[2.5rem] flex flex-col items-center justify-center shadow-lg shadow-black/30">
              <p className="text-[#1A9B3E] font-bold text-[3rem]">{params?.result}%</p>
              <p className="text-[#1A0000] text-sm">Overall Final Rating</p>
            </div>
          </Card>
          <Card className="flex flex-col gap-y-[1.25rem]">
            <div className="w-full flex flex-col gap-y-[1.25rem]">
              <p className="text-[#DEA004] font-semibold">Recommendation</p>
              <p className="text-sm">Select option 1 or 2 </p>
            </div>
            <div className={`flex gap-[1rem]`}>
              {recommendationButtons.map((item, index) => {
                return (
                  <button
                    className={`px-[2rem] h-[3.5rem] border rounded cursor-pointer shrink-0 font-semibold ${recommendationState === index ? "border-primary text-primary" : "border-[#756D6D]"}  flex items-center justify-center`}
                    key={index}
                    onClick={() => {
                      if (index === 0) {
                        setRecommendationState(index);
                        setOpenSpecialAwradCondition(!openSpecialAwardCondition);
                      } else {
                        setRecommendationState(index);
                        setOpenSpecialAwradCondition(false);
                      }
                    }}
                  >
                    <span className="pr-[.5rem]">{index + 1}.</span>
                    {item}
                  </button>
                );
              })}
            </div>
          </Card>
          {openSpecialAwardCondition && (
            <Form {...form}>
              <form action="" onSubmit={form.handleSubmit(onSubmit)} className={`w-full flex flex-col gap-y-[1.25rem]`}>
                <p className="text-[#DEA004] text-xl font-semibold">Special Award Conditions </p>
                <p className="text-sm">For any responses to individual PAT questions resulting in a “med=1” or “high=2” risk rating, and as deemed necessary, draft special award conditions in the space provided below. Recommend that these special awards conditions be incorporated in the subaward agreement; if no recommendations, state “none”.</p>
                <FormSelect
                  label=""
                  placeholder="Select Option"
                  options={[
                    { label: "Quarterly review of financial records and reports", value: "Quarterly review of financial records and reports" },
                    { label: "Develop a Policy on Pretection from Sexual Exploitation, Abuse and Harassment  (PSEAH)", value: "Develop a Policy on Pretection from Sexual Exploitation, Abuse and Harassment  (PSEAH)" },
                    { label: "Conduct PSEAH training for all staff, community workers and volunteers", value: "Conduct PSEAH training for all staff, community workers and volunteers" },
                  ]}
                  name="award_condition"
                />
                <div className="flex justify-between items-center w-full">
                  <Button variant={"ghost"} onClick={() => navigate(generatePath(CandGRoutes.PRE_AWARD_ASSESSMENT_STEP_2, { id: params.id }))}>
                    <p>Cancel</p>
                  </Button>
                  <FormButton loading={postPreAwardStep2MutationResults.isLoading}>
                    <p>Next</p>
                  </FormButton>
                </div>
              </form>
            </Form>
          )}
          {recommendationState === 1 && (
            <div className="flex justify-between items-center w-full">
              <Button variant={"ghost"} onClick={() => navigate(generatePath(CandGRoutes.PRE_AWARD_ASSESSMENT_STEP_2, { id: params.id }))}>
                <p>Cancel</p>
              </Button>
              <FormButton type="button" onClick={HandleSumbit}>
                <p>Next</p>
              </FormButton>
            </div>
          )}
        </Card>
      </section>
    </main>
  );
};

export default PreAwardAssessmentStep3;
