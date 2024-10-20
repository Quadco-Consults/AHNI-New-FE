import AddSquareIcon from "components/icons/AddSquareIcon";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";

const Advertisement = () => {
  return (
    <Card>
      <div className="flex justify-end">
        <Button>
          <AddSquareIcon /> Create New
        </Button>
      </div>
    </Card>
  );
};

export default Advertisement;
