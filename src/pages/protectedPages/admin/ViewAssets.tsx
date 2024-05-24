import BackNavigation from "atoms/BackNavigation";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Separator } from "components/ui/separator";

import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";

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
            <div className="w-3/12 my-6 space-y-1 ">
              <Label className="font-semibold">FHI 360 Recommendation</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder={"AHNI to dispose off in line with ..."}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardHeader className="font-bold">
                Asset Details
                <Separator className="mt-4" />
              </CardHeader>

              <CardContent className="flex flex-col gap-y-4">
                <AssetsItem heading="Asset" desc="Laptop" />

                <AssetsItem heading="Asset Code" desc="AHHQICTB5907" />

                <AssetsItem heading="Manufacturer" desc="Dell" />

                <AssetsItem heading="Model" desc="Dell Latitude E5480" />

                <AssetsItem heading="Serial Number" desc="BCZB3H2" />
                <Separator className="my-4" />
                <AssetsItem
                  heading="Description"
                  desc="Dell Latitude E5480 is a Windows 10 laptop with a 14.00-inch display that has a resolution of 1366x768 pixels. It is powered by a Core i5 processor and it comes with 8GB of RAM. The Dell Latitude E5480 packs 256GB of SSD storage. Graphics are powered by Intel HD Graphics."
                />
                <Separator className="my-4" />
                <AssetsItem heading="Classification" desc="IT/Equipment" />

                <AssetsItem heading="Date of Acquisition" desc="21/10/24" />

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
                <Card className="w-1/2">
                  <CardContent className="flex flex-col p-4 gap-y-2">
                    <AssetsItem heading="Asset Condition" desc="F3" />

                    <AssetsItem
                      heading="Condition Details"
                      desc="Obsolete/Damaged beyond repair - Unsalvageable"
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
