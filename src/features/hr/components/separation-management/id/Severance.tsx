import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { SeparationManagement } from "@/features/hr/types/separation-management";

interface SeveranceProps {
  data?: SeparationManagement;
}

const Severance = ({ data }: SeveranceProps) => {
  if (!data) return null;

  const employeeName = `${data.employee?.legal_firstname || ""} ${data.employee?.legal_lastname || ""}`.toUpperCase();

  const formatCurrency = (amount?: number) => {
    if (!amount) return "₦0.00";
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalPayment = (data.severance_amount || 0) + (data.final_pay_amount || 0) + (data.unused_leave_amount || 0);
  const paymentDate = data.payment_date ? new Date(data.payment_date).toLocaleDateString() : "N/A";

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-xl">{employeeName}</h4>

      <Card className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DescriptionCard label="Total Payment" description={formatCurrency(totalPayment)} />
        <DescriptionCard label="Payment Date" description={paymentDate} />
      </Card>

      <Card className="space-y-6">
        <p className="font-semibold text-yellow-600">Payment Breakdown</p>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <DescriptionCard
            label="Severance Amount"
            description={formatCurrency(data.severance_amount)}
          />
          <DescriptionCard
            label="Final Pay Amount"
            description={formatCurrency(data.final_pay_amount)}
          />
          <DescriptionCard
            label="Unused Leave Days"
            description={data.unused_leave_days ? `${data.unused_leave_days} days` : "N/A"}
          />
          <DescriptionCard
            label="Unused Leave Amount"
            description={formatCurrency(data.unused_leave_amount)}
          />
        </div>
      </Card>

      {data.benefits_info && (
        <Card>
          <DescriptionCard
            label="Benefits Information"
            description={data.benefits_info}
          />
        </Card>
      )}
    </div>
  );
};

export default Severance;
