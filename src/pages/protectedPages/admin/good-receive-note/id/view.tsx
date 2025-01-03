import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import GoBack from "components/shared/GoBack";
import { Button } from "components/ui/button";
import { FileDown } from "lucide-react";

const GRNDetail = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <GoBack />
        <Button variant="custom">
          <span>
            <FileDown size={18} />
          </span>
          Download
        </Button>
      </div>

      <Card className="grid grid-cols-1 p-10 gap-8 md:grid-cols-2">
        <DescriptionCard description="N/A" label="Vendor" />
        <DescriptionCard description="N/A" label="Supplier Address" />
        <DescriptionCard description="N/A" label="PO Number" />
        <DescriptionCard description="N/A" label="Description" />
        <DescriptionCard description="N/A" label="Quantity Ordered" />
        <DescriptionCard description="N/A" label="Quantity Received" />
        <DescriptionCard description="N/A" label="Invoice Number" />
        <DescriptionCard description="N/A" label="Waybill Number" />
        <DescriptionCard description="N/A" label="Procurement Officer" />
        <DescriptionCard description="N/A" label="Requestor" />
        <DescriptionCard description="N/A" label="Inventory Officer" />
        <DescriptionCard description="N/A" label="Goods received by (store)" />
        <DescriptionCard description="N/A" label="Receiving Location" />
        <DescriptionCard description="N/A" label="Remark" />
      </Card>
    </div>
  );
};

export default GRNDetail;
