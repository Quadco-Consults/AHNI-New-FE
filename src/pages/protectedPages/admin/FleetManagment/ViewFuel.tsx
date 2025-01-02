import { TabsContent } from "@radix-ui/react-tabs";
import BackNavigation from "atoms/BackNavigation";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "components/ui/tabs";
import { cn } from "lib/utils";
import { useSearchParams } from "react-router-dom";
import FuelTable from "./FuelTable";
import { Button } from "components/ui/button";
import { AdminRoutes } from "constants/RouterConstants";
import { Link } from "react-router-dom";
import { useState } from "react";
import { isEmpty } from "lodash";

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
    const [currentTab, setCurrentTab] = useState("");

    return (
        <div>
            <Tabs
                onValueChange={(value) => setCurrentTab(value)}
                defaultValue="details"
            >
                <TabsList className="flex items-center justify-between my-6">
                    <div className="flex items-center gap-x-4">
                        <BackNavigation />
                        <TabsTrigger value="details">
                            Vehicle Details
                        </TabsTrigger>
                        <TabsTrigger value="cunsumption">
                            Fuel Consumption
                        </TabsTrigger>
                    </div>
                    {currentTab === "cunsumption" && (
                        <div className="flex justify-end ">
                            <Button>
                                <Link
                                    to={`${AdminRoutes.FuelCreate}/?to=${String(
                                        searchParams.get("to")
                                    )}`}
                                >
                                    Create New Record
                                </Link>
                            </Button>
                        </div>
                    )}
                </TabsList>
                <TabsContent value="details">
                    <Card>
                        <CardHeader className="font-bold">
                            Fuel Consumption Record Details
                            <Separator className="mt-4" />
                        </CardHeader>
                        <CardContent>
                            {/* {!isEmpty(data) && (
                                <div className="grid grid-cols-3 gap-x-4 gap-y-8">
                                    <AssetsItem
                                        heading="Asset"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.asset_type?.name}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Asset Code"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.asset_code}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Manufacturer"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.asset_type?.manufacturer}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Model"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.asset_type?.model}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Serial Number"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.asset_type?.id}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Classification"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.classification}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Date of Acquisition"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.date_of_acquisition}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Acquisition Cost"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.cost_in_ngn}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="State"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.state}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Location"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.location?.name}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Implementer"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.implementer?.name}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Assignee"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.assignee}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Asset Condition"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={data?.asset_condition?.name}
                                        className2="flex justify-start  w-7/12"
                                    />
                                    <AssetsItem
                                        heading="Condition Details"
                                        className="flex flex-col justify-between space-y-3"
                                        desc={
                                            data?.asset_condition?.description
                                        }
                                        className2="flex justify-start  w-7/12"
                                    />
                                </div>
                            )} */}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="cunsumption">
                    {/* <FuelTable vehicle={1} /> */}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ViewFuel;
