import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import Summary from "./Summary";
// import Performance from "./Performance";
import Uploads from "./Upload";
// import Activity from "./Activity";
import projectsAPi from "services/projectsApi";
import { Loading } from "components/shared/Loading";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const projectsQueryResult = projectsAPi.useGetProjectQuery({
    path: { id: id as string },
  });

  const projects = projectsQueryResult?.data;

  const goBack = () => {
    navigate(-1);
  };

  if (projectsQueryResult?.isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 relative min-h-screen">
      <button
        onClick={goBack}
        className="w-[3rem] absolute -top-1 left-0 aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <Tabs defaultValue="summary" className="space-y-10">
        <TabsList className="ml-20">
          <TabsTrigger value="summary">Project Summary</TabsTrigger>
          {/* <TabsTrigger value="project Performance">
            Project Performance
          </TabsTrigger> */}
          <TabsTrigger value="Upload">Uploads</TabsTrigger>
          {/* <TabsTrigger value="activity/Report">Activity/Report</TabsTrigger> */}
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <Summary {...projects} />
          </Card>
        </TabsContent>
        {/* <TabsContent value="project Performance">
          <Performance />
        </TabsContent> */}
        <TabsContent value="Upload">
          <Uploads />
        </TabsContent>
        {/* <TabsContent value="activity/Report">
          <Activity />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
