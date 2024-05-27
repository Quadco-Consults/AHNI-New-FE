import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
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

const ViewAgreement = () => {
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
              H.M.O Agreement Details
              <Separator className="mt-4" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col w-10/12 gap-y-8 ">
                <AssetsItem
                  heading="Payment To."
                  className="flex justify-between "
                  desc="AHNi Compliance office"
                  className2="flex justify-start  w-7/12"
                />
                <AssetsItem
                  heading="Task Identification Number."
                  className="flex justify-between "
                  desc="AHNi Compliance office"
                  className2="flex justify-start  w-7/12"
                />
                <AssetsItem
                  heading="Task Identification Number."
                  className="flex justify-between "
                  desc="AHNi Compliance office"
                  className2="flex justify-start  w-7/12"
                />
                <AssetsItem
                  heading="Task Identification Number."
                  className="flex justify-between "
                  desc="AHNi Compliance office"
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

export default ViewAgreement;
