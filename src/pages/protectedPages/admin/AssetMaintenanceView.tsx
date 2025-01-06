import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
import { useSearchParams } from "react-router-dom";
import FormTextArea from "atoms/FormTextArea";
import FormSelect from "atoms/FormSelect";
import { APPROVAL_PROCESS } from "./facility-management/facility-maintenance/create";
import { Button } from "components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
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
    return (
        <div>
            {/* <Tabs defaultValue="details">
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
                                    heading="Chassis Number"
                                    className="flex justify-between "
                                    desc="N/A"
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Brand"
                                    className="flex justify-between "
                                    desc="N/A"
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Year of Manufacture"
                                    className="flex justify-between "
                                    desc="N/A"
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Plate Number"
                                    className="flex justify-between "
                                    desc="N/A"
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Maintenance Type"
                                    className="flex justify-between "
                                    desc={data?.maintenance_type}
                                    className2="flex justify-start  w-7/12"
                                />

                                <AssetsItem
                                    heading="Problem"
                                    className="flex justify-between "
                                    desc={data?.description_of_problem}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Classification"
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
                                <Form {...form}>
                                    <form className="space-y-2 max-w-2xl">
                                        <FormTextArea
                                            name=""
                                            label="Comment"
                                            placeholder="This can be repaired and we donate it to CBOs"
                                        />
                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                            <FormSelect
                                                name=""
                                                placeholder="Select approval"
                                                options={APPROVAL_PROCESS}
                                            />
                                            <FormSelect
                                                name=""
                                                placeholder="Select name"
                                                options={APPROVAL_PROCESS}
                                            />
                                        </div>
                                        <Button variant="custom" type="button">
                                            Approve
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs> */}
        </div>
    );
};

export default AssetMaintenanceView;
