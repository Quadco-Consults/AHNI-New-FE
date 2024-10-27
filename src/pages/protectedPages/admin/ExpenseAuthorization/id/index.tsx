import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import GoBack from "components/shared/GoBack";

const ExpenseAuthorizationDetail = () => {
  return (
    <div className="space-y-4">
      <GoBack />

      <Card className="grid grid-cols-1 p-10 gap-10 md:grid-cols-2">
        <DescriptionCard description="N/A" label="Full Name" />
        <DescriptionCard description="N/A" label="Address" />
        <DescriptionCard description="N/A" label="Phone Number" />
        <DescriptionCard description="N/A" label="Email" />
        <DescriptionCard description="N/A" label="TA Number" />
        <DescriptionCard description="N/A" label="Project Name" />
        <DescriptionCard description="N/A" label="Department" />
        <DescriptionCard description="N/A" label="FCO" />
        <DescriptionCard description="N/A" label="City" />
        <DescriptionCard description="N/A" label="Arrival Date" />
        <DescriptionCard description="N/A" label="Departure Date" />
        <DescriptionCard description="N/A" label="Project Number" />
        <DescriptionCard description="N/A" label="Approved by" />
      </Card>
    </div>
  );
};

export default ExpenseAuthorizationDetail;
