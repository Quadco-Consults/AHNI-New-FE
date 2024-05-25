import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import EoIDetails from "./eoi-tabs-contents/EoIDetails";
import EOIVendorSubmission from "./eoi-tabs-contents/EOIVendorSubmission";
import RoundBack from "assets/svgs/RoundBack";
import { useNavigate } from "react-router-dom";

const ViewEOI = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Tabs defaultValue="eoi-details">
        <div className="flex items-start gap-x-4 ">
          <div onClick={() => navigate(-1)} className="-mt-5">
            <RoundBack />
          </div>
          <TabsList>
            <TabsTrigger value="eoi-details">EOI Details</TabsTrigger>
            <TabsTrigger value="vendor-submission">
              Vendor submissions
            </TabsTrigger>
          </TabsList>
        </div>
        <div className=" bg-[#dbdfe92f] p-2 my-5">
          <TabsContent value="eoi-details">
            <EoIDetails />
          </TabsContent>
          <TabsContent value="vendor-submission">
            <EOIVendorSubmission />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ViewEOI;
