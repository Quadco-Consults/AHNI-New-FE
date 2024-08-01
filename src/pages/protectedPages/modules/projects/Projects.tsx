import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { Card } from "components/ui/card";
import FundingList from "./FundingList";
import Beneficiaries from "./Beneficiaries";
import Partners from "./Partners";
import DocumentTypes from "./DocumentTypes";

const Projects = () => {
  return (
    <div>
      <Tabs defaultValue="source">
        <TabsList>
          <TabsTrigger value="source">Funding Source</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="type">Document Types</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
        </TabsList>
        <TabsContent value="source">
          <Card className="mt-10 pb-8 px-6">
            <FundingList />
          </Card>
        </TabsContent>
        <TabsContent value="beneficiaries">
          <Beneficiaries />
        </TabsContent>
        <TabsContent value="type">
          <Card className="mt-10 pb-8 px-6">
            <DocumentTypes />
          </Card>
        </TabsContent>
        <TabsContent value="partners">
          <Card className="mt-10 pb-8 px-6">
            <Partners />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Projects;
