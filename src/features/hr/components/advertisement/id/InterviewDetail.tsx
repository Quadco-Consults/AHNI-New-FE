import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import GoBack from "components/GoBack";
import { Loading } from "components/Loading";
import PdfContent from "components/PdfContent";
import { useParams } from "next/navigation";
import { useGetInterview } from "@/features/hr/controllers/interviewController";

const InterviewDetail = () => {
  const params = useParams();

  const { data, isLoading } = useGetInterview({
    id: params?.appID as string,
  });

  console.log({ data });

  if (isLoading) {
    return <Loading />;
  }
  const pdf = {
    name: "document",
    document: data?.data?.cover_letter!,
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <GoBack />
      </div>
      <Card className="space-y-8">
        <h4 className="text-lg font-medium">{data?.data?.applicant_name}</h4>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="space-y-4">
            <h4 className="font-medium">Referee 1</h4>
            <DescriptionCard
              aside
              label="Name"
              description={data?.data?.referee_1_name}
            />
            <DescriptionCard
              aside
              label="Email"
              description={data?.data?.referee_1_email}
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Referee 2</h4>
            <DescriptionCard
              aside
              label="Name"
              description={data?.data?.referee_2_name}
            />
            <DescriptionCard
              aside
              label="Email"
              description={data?.data?.referee_2_email}
            />
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Referee 3</h4>
            <DescriptionCard
              aside
              label="Name"
              description={data?.data?.referee_3_name}
            />
            <DescriptionCard
              aside
              label="Email"
              description={data?.data?.referee_3_email}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <PdfContent pdf={pdf} />
        </div>
      </Card>
    </div>
  );
};

export default InterviewDetail;
