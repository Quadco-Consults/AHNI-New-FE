import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";

const ExitSummary = () => {
  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-xl">ISAAC OLUGBENLE</h4>

      <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DescriptionCard label="Submission Date" description="14-03-2022" />
        <DescriptionCard label="Exit Date" description="14-03-2022" />
      </Card>

      <Card className="space-y-6">
        <p className="font-semibold text-yellow-600">Exit Statuses</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DescriptionCard
            label="Exit Checklist Status"
            description="Completed"
          />
          <DescriptionCard
            label="Terminal Benefit Status"
            description="Completed"
          />
          <DescriptionCard label="Payment Status" description="Completed" />
        </div>
      </Card>
    </div>
  );
};

export default ExitSummary;
