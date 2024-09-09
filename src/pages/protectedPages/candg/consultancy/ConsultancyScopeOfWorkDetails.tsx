import Card from "components/shared/Card";
import { useParams } from "react-router-dom";
import { consultancyAPIs } from "services/cAndGApi/consultancy";

const ConsultancyScopeOfWorkDetails = () => {
  const params = useParams();
  const ConsultancyScopeDetails = consultancyAPIs.useGetSingleConsultancyScopeQuery(params.id);
  const PageData = ConsultancyScopeDetails?.data;

  console.log(ConsultancyScopeDetails);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Card className="w-full flex flex-col gap-y-[1rem]">
        <div>
          <h2 className="text-lg font-semibold">{PageData?.title || ""}</h2>
        </div>
      </Card>
    </div>
  );
};

export default ConsultancyScopeOfWorkDetails;
