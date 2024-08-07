import BackNavigation from "atoms/BackNavigation";
import FormButton from "atoms/FormButton";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Checkbox } from "components/ui/checkbox";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { cn } from "lib/utils";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetFacilityQuery,
  useUpdateFacilityMutation,
} from "services/adminApi/faciityMaintenance";
import { toast } from "sonner";

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

const FacilitiesView = () => {
  const [searchParams] = useSearchParams();
  const [recommendation, setRecommendation] = useState("");
  const { data } = useGetFacilityQuery(String(searchParams.get("to")));

  const [updateMaintanace, { isLoading }] = useUpdateFacilityMutation();

  const handleSubmit = async () => {
    try {
      await updateMaintanace({
        id: String(data?.id),
        payload: {
          status: "Approved",
          recommendations: recommendation,
        },
      }).unwrap();
      toast.success("Facility Maintenance Approved");
      setRecommendation("");
    } catch (error) {
      toast.error("Failed to approve facility maintenance");
    }
  };

  return (
    <Tabs defaultValue="details">
      <TabsList>
        <BackNavigation />
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="approval">Maintenance Approval</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <Card>
          <CardHeader className="font-bold">
            Facility Details
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col w-10/12 gap-y-8 ">
              <AssetsItem
                heading="Facility"
                className="flex justify-between "
                desc={data?.facility.name}
                className2="flex justify-start  w-7/12"
              />
              <AssetsItem
                heading="State"
                className="flex justify-between"
                desc={data?.facility?.state}
                className2="flex justify-start  w-7/12"
              />
              <AssetsItem
                heading="Address"
                className="flex justify-between"
                desc={data?.facility?.address}
                className2="flex justify-start  w-7/12"
              />
              <AssetsItem
                heading="Maintenance Type"
                className="flex justify-between"
                desc={data?.maintenance_type}
                className2="flex justify-start  w-7/12"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="approval">
        <Card>
          <CardContent className="mt-10">
            <div className="grid grid-cols-5 gap-x-4">
              <AssetsItem
                className="px-5 py-3 border rounded-md"
                heading="Facility"
                desc={data?.facility.name}
              />
              <AssetsItem
                className="px-5 py-3 border rounded-md"
                heading="State"
                desc={data?.facility?.state}
              />
              <AssetsItem
                className="px-5 py-3 border rounded-md"
                heading="Address"
                desc={data?.facility?.address}
              />
              <AssetsItem
                className="px-5 py-3 border rounded-md"
                heading="Maintenance Type"
                desc={data?.maintenance_type}
              />
            </div>
            <div className="mt-4 space-y-3 ">
              <h3 className="text-base font-semibold">Approval</h3>
              <div className="flex items-center gap-x-2">
                <Checkbox checked />
                <Label className="text-xs font-semibold">
                  Facility Manager
                </Label>
              </div>
              <div>
                <Label className="text-xs font-semibold">Recommendation </Label>
                <Input
                  name="recommendation"
                  onChange={(e) => setRecommendation(e.target.value)}
                  value={recommendation}
                />
              </div>
              <div className="mt-6">
                <FormButton loading={isLoading} onClick={() => handleSubmit()}>
                  Approve Request
                </FormButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FacilitiesView;
