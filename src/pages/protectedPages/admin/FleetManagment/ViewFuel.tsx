import { TabsContent } from "@radix-ui/react-tabs";
import BackNavigation from "atoms/BackNavigation";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { cn } from "lib/utils";
import { useSearchParams } from "react-router-dom";
import { useGetOneVehicleFuelRecordQuery } from "services/adminApi/VehicleRequestApi";
import FuelTable from "./FuelTable";

const AssetsItem = ({
  desc,
  heading,
  className,
  className2,
}: {
  heading?: string;
  desc?: string;
  className?: string;
  className2?: string;
}) => {
  return (
    <div className={className}>
      <h4 className="text-base font-semibold ">{heading}</h4>
      <p className={cn("text-[#4D4545] text-sm", className2)}>{desc}</p>
    </div>
  );
};

const ViewFuel = () => {
  const [searchParams] = useSearchParams();

  const { data } = useGetOneVehicleFuelRecordQuery({
    id: String(searchParams.get("to")),
  });

  console.log(data);
  return (
    <div>
      <Tabs defaultValue="details">
        <TabsList>
          <BackNavigation />
          <TabsTrigger value="details">Vehicle Details</TabsTrigger>
          <TabsTrigger value="cunsumption">Fuel Consumption</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader className="font-bold">
              Fuel Consumption Record Details
              <Separator className="mt-4" />
            </CardHeader>
            <CardContent>
              <AssetsItem
                heading="Asset"
                className="flex justify-between "
                desc={""}
                className2="flex justify-start  w-7/12"
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="cunsumption">
          <FuelTable vehicle={data?.vehicle} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewFuel;
