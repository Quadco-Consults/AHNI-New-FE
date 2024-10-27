import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import GoBack from "components/shared/GoBack";
import { Separator } from "components/ui/separator";

const ItemRequisitionDetail = () => {
  return (
    <div className="space-y-6">
      <GoBack />
      <Card className="space-y-6">
        <h4 className="font-semibold text-lg">Item Requisition Detail</h4>
        <Separator />
        <div className="grid grid-cols-2 gap-8 mt-6">
          <DescriptionCard label="Name Requestor" description="N/A" />
          <DescriptionCard label="Department/Unit" description="N/A" />
          <DescriptionCard label="Expiry Date" description="N/A" />
          <DescriptionCard label="Re-order Level" description="N/A" />
          <DescriptionCard label="Date Requested" description="N/A" />
          <DescriptionCard label="Date Treated" description="N/A" />
          <DescriptionCard label="Item Requested" description="N/A" />
          <DescriptionCard label="Quantity Requested" description="N/A" />
          <DescriptionCard label="Status" description="N/A" />
          <DescriptionCard label="Approved by" description="N/A" />
        </div>
      </Card>
    </div>
  );
};

export default ItemRequisitionDetail;
