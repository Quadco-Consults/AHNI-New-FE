import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Button } from "components/ui/button";
import DetailsContent from "./tab-contents/Details-content";
import VendorSubmission from "./tab-contents/Vendor-submission";

const RFQDetails = () => {
  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <h4 className="text-lg font-bold">Supply of medical consumables</h4>

        {/* <Link
          to={generatePath(RouteEnum.VENDOR_MANAGEMENT_START_PREQUALIFICATION, {
            id: "1",
          })}
        > */}
        <Button>Start Competitive Bid Analysis</Button>
        {/* </Link> */}
      </div>

      <Tabs defaultValue="rfq-details">
        <TabsList>
          <TabsTrigger value="rfq-details">RFQ Details</TabsTrigger>
          <TabsTrigger value="vendor-submission">Vendor Submission</TabsTrigger>
        </TabsList>
        <TabsContent value="rfq-details">
          <DetailsContent />
        </TabsContent>
        <TabsContent value="vendor-submission">
          <VendorSubmission />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RFQDetails;
