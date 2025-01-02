import BackNavigation from "atoms/BackNavigation";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "components/ui/tabs";
import { Card, CardContent, CardHeader } from "components/ui/card";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
import { useGetOnePaymentRequestQuery } from "services/admin/paymentRequest";
import { useSearchParams } from "react-router-dom";
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

const PaymentView = () => {
    const [searchParams] = useSearchParams();

    const { data } = useGetOnePaymentRequestQuery({
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
                            Payment Request Details
                            <Separator className="mt-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col w-10/12 gap-y-8 ">
                                <AssetsItem
                                    heading="Requested By."
                                    className="flex justify-between "
                                    desc={`${data?.requested_by.first_name.toLowerCase()} ${data?.requested_by.last_name.toLowerCase()}`}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Payment To."
                                    className="flex justify-between "
                                    desc={data?.payment_to}
                                    className2="flex justify-start  w-7/12"
                                />

                                <AssetsItem
                                    heading="Task Identification Number."
                                    className="flex justify-between "
                                    desc={data?.tax_identification_number}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Date"
                                    className="flex justify-between "
                                    desc={data?.date}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Amount in Figures."
                                    className="flex justify-between "
                                    desc={data?.amount_in_figures}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Amount in Words."
                                    className="flex justify-between "
                                    desc={data?.amount_in_words}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Account Number."
                                    className="flex justify-between "
                                    desc={data?.account_number}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Bank."
                                    className="flex justify-between "
                                    desc={data?.bank}
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Reason for Payment."
                                    className="flex justify-between "
                                    desc="N/A"
                                    className2="flex justify-start  w-7/12"
                                />
                                <AssetsItem
                                    heading="Approval Levels."
                                    className="flex justify-between "
                                    desc="N/A"
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

export default PaymentView;
