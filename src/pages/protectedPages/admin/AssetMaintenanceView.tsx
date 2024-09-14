import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
import { useSearchParams } from "react-router-dom";
import { useGetOneAssetMaintenanceRequestQuery } from "services/adminApi/assetMaintenance";
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
      <p className={cn("text-[#4D4545] text-sm capitalize", className2)}>
        {desc}
      </p>
    </div>
  );
};

const AssetMaintenanceView = () => {
  const [searchParams] = useSearchParams();

  const { data } = useGetOneAssetMaintenanceRequestQuery({
    id: String(searchParams.get("to")),
  });

  return (
    <div>
      <Tabs defaultValue="details">
        <TabsList>
          <BackNavigation />
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader className="font-bold">
              Maintenance Request Details
              <Separator className="mt-4" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col w-10/12 gap-y-8 ">
                <AssetsItem
                  heading="Asset"
                  className="flex justify-between "
                  //   @ts-ignore
                  desc={data?.asset.asset_type}
                  className2="flex justify-start  w-7/12"
                />
                <AssetsItem
                  heading="Maintenance Type"
                  className="flex justify-between "
                  desc={data?.maintenance_type}
                  className2="flex justify-start  w-7/12"
                />

                <AssetsItem
                  heading="Probelam"
                  className="flex justify-between "
                  desc={data?.description_of_problem}
                  className2="flex justify-start  w-7/12"
                />
                <AssetsItem
                  heading="Calssification"
                  className="flex justify-between "
                  desc={data?.classification}
                  className2="flex justify-start  w-7/12"
                />
                <AssetsItem
                  heading="Status"
                  className="flex justify-between "
                  desc={data?.status}
                  className2="flex justify-start  w-7/12"
                />
                <AssetsItem
                  heading="Approved By"
                  className="flex justify-between "
                  desc={data?.approved_by}
                  className2="flex justify-start  w-7/12"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetMaintenanceView;
