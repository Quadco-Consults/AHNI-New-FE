import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import FundingList from "./FundingList";
import TargetPopulation from "./TargetPopulation";
import ConsortiumPartners from "./ConsortiumPartners";
import DocumentType from "./DocumentType";

const Projects = () => {
  return (
    <div>
      <Tabs defaultValue="source">
        <TabsList>
          <TabsTrigger value="source">Funding Source</TabsTrigger>
          <TabsTrigger value="population">Target Population</TabsTrigger>
          <TabsTrigger value="partners">Consortium Partners</TabsTrigger>
          <TabsTrigger value="type">Document Type</TabsTrigger>
        </TabsList>
        <TabsContent value="source">
          <Card className="mt-10 pb-8 px-6">
            <FundingList />
          </Card>
        </TabsContent>
        <TabsContent value="population">
          <TargetPopulation />
        </TabsContent>
        <TabsContent value="partners">
          <Card className="mt-10 pb-8 px-6">
            <ConsortiumPartners />
          </Card>
        </TabsContent>
        <TabsContent value="type">
          <Card className="mt-10 pb-8 px-6">
            <DocumentType />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
