import BackNavigation from "atoms/BackNavigation";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

import { Separator } from "components/ui/separator";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { useGetOneAssetsQuery } from "services/adminApi/assetsApi";

const AssetsItem = ({
  desc,
  heading,
  className,
}: {
  heading?: string;
  desc?: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <h4 className="text-base font-semibold ">{heading}</h4>
      <p className="text-[#4D4545] text-sm">{desc}</p>
    </div>
  );
};

const ViewAssets = () => {
  const [seachParams] = useSearchParams();

  const id = seachParams.get("id") as string;

  const { data } = useGetOneAssetsQuery({ id });

  return (
    <div>
      <div className="">
        <Tabs defaultValue="details">
          <TabsList>
            <BackNavigation />
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="approval">Approval</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader className="font-bold">
                Asset Details
                <Separator className="mt-4" />
              </CardHeader>

              <CardContent className="flex flex-col gap-y-4">
                <AssetsItem heading="Asset" desc={data?.asset_type?.name} />

                <AssetsItem heading="Asset Code" desc={data?.asset_code} />

                <AssetsItem
                  heading="Manufacturer"
                  desc={data?.asset_type.manufacturer}
                />

                <AssetsItem heading="Model" desc={data?.asset_type.model} />

                <Separator className="my-4" />
                <AssetsItem
                  heading="Description"
                  desc={data?.asset_condition.description}
                />
                <Separator className="my-4" />
                <AssetsItem
                  heading="Classification"
                  desc={data?.classification}
                />

                <AssetsItem
                  heading="Date of Acquisition"
                  desc={data?.date_of_acquisition}
                />

                <AssetsItem
                  heading="Acquisition Cost"
                  desc={`$${data?.cost_in_usd} equivalent ₦${data?.cost_in_ngn}`}
                />

                <AssetsItem heading="State" desc={data?.state} />

                <AssetsItem heading="Location" desc={data?.location.name} />

                <AssetsItem
                  heading="Implementer"
                  desc={data?.implementer.name}
                />

                <AssetsItem heading="Assignee" desc={data?.assignee} />
                <Card className="w-1/2">
                  <CardContent className="flex flex-col p-4 gap-y-2">
                    <AssetsItem
                      heading="Asset Condition"
                      desc={data?.asset_condition.name}
                    />

                    <AssetsItem
                      heading="Condition Details"
                      desc={data?.asset_condition.description}
                    />
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approval">
            <Card>
              <CardHeader className="font-bold">
                Asset Details
                <Separator className="mt-4" />
              </CardHeader>

              <CardContent className="flex flex-col gap-y-4">
                <div className="flex flex-wrap gap-x-8">
                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Asset"
                    desc="Laptop"
                  />

                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Asset Code"
                    desc="AHHQICTB5907"
                  />

                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Manufacturer"
                    desc="Dell"
                  />

                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Model"
                    desc="Dell Latitude E5480"
                  />
                  <AssetsItem
                    className="px-5 py-3 border rounded-md"
                    heading="Model"
                    desc="Dell Latitude E5480"
                  />
                </div>

                <AssetsItem heading="Remark" desc="IT/Equipment" />

                <AssetsItem
                  heading="Justification for Disposal"
                  desc="21/10/24"
                />

                <AssetsItem
                  heading="Acquisition Cost"
                  desc="$819.53 equivalent ₦290,000"
                />

                <AssetsItem heading="State" desc="Abuja" />

                <AssetsItem heading="Location" desc="AHNi Admin" />

                <AssetsItem
                  heading="Implementer"
                  desc="Family Health International (FHI 360)"
                />

                <AssetsItem heading="Assignee" desc="Patricia Ohkahkumhe" />

                <div className="space-y-2">
                  <Label className="font-semibold">GT CT Approval</Label>
                  <Input placeholder="This can be repaired and we donate it to CBOs" />
                  <Button className="mt-2">Approve</Button>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">CCM Approval</Label>
                  <Input placeholder="This can be repaired and we donate it to CBOs" />
                  <Button className="mt-2">Approve</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewAssets;
