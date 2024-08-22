import { Label } from "components/ui/label";
import AddStockForm from "./AddStockForm";

const AddStock = () => {
  return (
    <div className="px-4 space-y-4">
      <Label className="font-bold">Add Stock</Label>
      <AddStockForm />
    </div>
  );
};

export default AddStock;
