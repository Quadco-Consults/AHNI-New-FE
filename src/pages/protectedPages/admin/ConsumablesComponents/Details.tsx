import { Card, CardContent, CardHeader } from "components/ui/card";
import { cn } from "lib/utils";
import { useSearchParams } from "react-router-dom";
import { useGetOneConsumablesQuery } from "services/adminApi/consumables";

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
    <div className={cn("space-y-2", className)}>
      <h4 className="text-base font-semibold ">{heading}</h4>
      <p className="text-[#4D4545] text-sm">{desc}</p>
    </div>
  );
};
const Details = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id") || "";

  const { data } = useGetOneConsumablesQuery({ id });

  return (
    <div>
      <Card className="px-3">
        {/* @ts-ignore */}
        <CardHeader className="border-b ">{data?.item?.name}</CardHeader>
        <CardContent className="space-y-5">
          {/* @ts-ignore */}
          <div className="border-b ">{data?.item?.description}</div>
          <div className="grid grid-cols-2 gap-8 mt-6">
            <AssetsItem heading="Category" desc={data?.category} />
            <AssetsItem heading="Quantity" desc={data?.quantity} />
            <AssetsItem heading="Expiry Date" desc={data?.expiry_date} />
            <AssetsItem heading="Cost of Item" desc="N/A" />
            <AssetsItem heading="Date of Receipt" desc="N/A" />
            <AssetsItem heading="Batches" desc="N/A" />
            <AssetsItem heading="GRN Tracking No" desc="N/A" />
            <AssetsItem heading="Vendor" desc="N/A" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Details;
