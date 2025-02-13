import Card from "components/shared/Card";
import { useParams } from "react-router-dom";
import { SubGrantPreAwardsApi } from "services/cAndGApi/subGrant";
import SubmittedDocsUpload from "../SubmittedDocsUpload";
import PreAwardAssessmentStep4 from "./PreAwardAssessmentStep4";

const PreAwardAssessmentResult = () => {
    const params = useParams();
    const getPreAwardAssessmentResult =
        SubGrantPreAwardsApi.useGetSubGrantPreAwardAssessmentRecommendationQuery(
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

                    <PreAwardAssessmentStep4 />
                </Card>
            </Card>
        </main>
    );
};

export default PreAwardAssessmentResult;
