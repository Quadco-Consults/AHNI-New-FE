import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import Summary from "./Summary";
import { Button } from "components/ui/button";
import FundSummary from "./Fund-summary";
import ApprovalStatus from "./ApprovalStatus";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import FundRequestAPI from "services/programsApi/fund-request";
import { LoadingSpinner } from "components/shared/Loading";
import { FundRequestData } from "definations/program-types/fund-request";

const FundRequestDetail = () => {
  const navigate = useNavigate();
  const { id, month_year } = useParams();

  const { data, isLoading } = FundRequestAPI.useGetFundRequestsQuery({
    params: {
      project: id,
      month_year: month_year,
    },
  });

  console.log(data);

  const dispatch = useAppDispatch();

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 relative min-h-screen">
      <button
        onClick={goBack}
        className="w-[3rem] absolute top-0 left-0 aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <Tabs defaultValue="summary" className="space-y-10">
        <div className="relative flex justify-between gap-5 ml-16">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="fund Request Summary">
              Fund Request Summary
            </TabsTrigger>
            <TabsTrigger value="approval Status">Approval Status</TabsTrigger>
          </TabsList>

          <Button
            onClick={() => {
              dispatch(
                openDialog({
                  type: DialogType.SspApproveModal,
                  dialogProps: {
                    header: "Request Approval",
                    width: "max-w-2xl",
                  },
                })
              );
            }}
          >
            Approval
          </Button>
        </div>
        <TabsContent value="summary">
          <Card>
            <Summary {...(data as FundRequestData)} />
          </Card>
        </TabsContent>
        <TabsContent value="fund Request Summary">
          <FundSummary {...(data as FundRequestData)} />
        </TabsContent>
        <TabsContent value="approval Status">
          <ApprovalStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundRequestDetail;
