import BackNavigation from "atoms/BackNavigation";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import Assets from "./assets";

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

const ViewAssetRequest = () => {
    return (
        <div>
            <div className="">
                <Tabs defaultValue="details">
                    <TabsList>
                        <BackNavigation />
                        <TabsTrigger value="details">Approval</TabsTrigger>
                        <TabsTrigger value="approval">Aseet List</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                        <Card>
                            <CardHeader className="font-bold">
                                Asset Details
                                <Separator className="mt-4" />
                            </CardHeader>

                            <CardContent className="grid grid-cols-3 gap-y-8 gap-x-4">
                                {/* <AssetsItem
                                    heading="Asset"
                                    desc={data?.assets?.join(" ")}
                                />

                                <AssetsItem
                                    heading="Asset Condition"
                                    desc={data?.asset_condition}
                                />

                                <AssetsItem
                                    heading="Justification for disposal"
                                    desc={data?.justification_for_disposal}
                                />

                                <AssetsItem
                                    heading="Lide span report"
                                    desc={
                                        data?.life_span_at_report as unknown as string
                                    }
                                />

                                <AssetsItem
                                    heading="Recommendation"
                                    desc={data?.recommendation}
                                />

                                <div className="col-span-3 ">
                                    <AssetsItem
                                        heading="Remark"
                                        desc={data?.remark}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Button className="mt-2">
                                        GT CT Approval
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <Button className="mt-2">
                                        CCM Approval
                                    </Button>
                                </div> */}
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
                                <Assets />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ViewAssetRequest;
