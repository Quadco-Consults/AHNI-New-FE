import Card from "components/Card";
import { useParams } from "next/navigation";
import { SubGrantPreAwardsApi } from "@/features/contracts-grants/controllers/subGrantController";

const PreAwardAssessmentResult = () => {
    const params = useParams();
    const getPreAwardAssessmentResult =
        SubGrantPreAwardsApi.useGetSubGrantPreAwardAssessmentRecommendation(
            { id: params.id }
        );
    console.log(getPreAwardAssessmentResult);

    return (
        <main className="w-full flex flex-col justify-center items-center">
            <Card className="w-full">
                <Card className="w-full flex flex-col justify-center items-center">
                    <div className="border border-[#1A9B3E] rounded-2xl p-[2.5rem] flex flex-col items-center justify-center shadow-lg shadow-black/30">
                        <p className="text-[#1A9B3E] font-bold text-[3rem]">
                            {"3.0"}%
                        </p>
                        <p className="text-[#1A0000] text-sm">
                            Overall Final Rating
                        </p>
                    </div>
                </Card>
            </Card>
        </main>
    );
};

export default PreAwardAssessmentResult;
