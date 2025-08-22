import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";

const Severance = () => {
  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-xl">ISAAC OLUGBENLE</h4>

      <Card>
        <DescriptionCard label="Total Payment" description="₦2,750,974.90" />
      </Card>

      <Card className="space-y-6">
        <p className="font-semibold text-yellow-600">Payment Breakdown</p>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <DescriptionCard
            label="Total Basic Salary"
            description="₦2,750,974.90"
          />
          <DescriptionCard
            label="Total Housing Allowance"
            description="₦2,750,974.90"
          />
          <DescriptionCard
            label="Total Transport Allowance"
            description="₦2,750,974.90"
          />
          <DescriptionCard label="Meal Allowance" description="₦2,750,974.90" />
          <DescriptionCard
            label="Miscellaneous Allowance"
            description="₦2,750,974.90"
          />
          <DescriptionCard
            label="Leave Allowance"
            description="₦2,750,974.90"
          />
        </div>
      </Card>
    </div>
  );
};

export default Severance;
