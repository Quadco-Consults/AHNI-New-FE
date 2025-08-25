import BackNavigation from "components/atoms/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
import { useSearchParams } from "next/navigation"; 

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
                    {/* <Card>
                        <CardHeader className="font-bold">
                            {data?.type} Details
                            <Separator className="mt-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col w-10/12 gap-y-8 ">
                                <AssetsItem
                                    heading="Provider"
                                    className="flex justify-between "
                                    desc={data?.provider}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Service"
                                    className="flex justify-between "
                                    desc={data?.service}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Start Date"
                                    className="flex justify-between "
                                    desc={data?.start_date}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Status"
                                    className="flex justify-between "
                                    desc={data?.status}
                                    className2="flex justify-start  w-7/12"
                                />
                            </div>
                        </CardContent>
                    </Card> */}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ViewAgreement;
