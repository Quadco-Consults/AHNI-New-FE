import Card from "@/components/Card";
import DescriptionCard from "@/components/DescriptionCard";
import { SeparationManagement } from "@/features/hr/types/separation-management";

interface SeveranceProps {
  data?: SeparationManagement;
}

const Severance = ({ data }: SeveranceProps) => {
  if (!data) return null;

  // Handle API wrapper structure
  const actualData = (data as any).data || data;

  const employeeName = `${actualData.employee?.legal_firstname || ""} ${actualData.employee?.legal_lastname || ""}`.toUpperCase();

  const formatCurrency = (amount?: number) => {
    if (!amount) return "₦0.00";
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalPayment = (actualData.severance_amount || 0) + (actualData.final_pay_amount || 0) + (actualData.unused_leave_amount || 0);
  const paymentDate = actualData.payment_date && actualData.payment_date.trim() !== ""
    ? new Date(actualData.payment_date).toLocaleDateString()
    : "N/A";

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
            description={formatCurrency(actualData.severance_amount)}
          />
          <DescriptionCard
            label="Final Pay Amount"
            description={formatCurrency(actualData.final_pay_amount)}
          />
          <DescriptionCard
            label="Unused Leave Days"
            description={actualData.unused_leave_days ? `${actualData.unused_leave_days} days` : "N/A"}
          />
          <DescriptionCard
            label="Unused Leave Amount"
            description={formatCurrency(actualData.unused_leave_amount)}
          />
        </div>
      </Card>

      {actualData.benefits_info && (
        <Card>
          <DescriptionCard
            label="Benefits Information"
            description={actualData.benefits_info}
          />
        </Card>
      )}
    </div>
  );
};

export default Severance;
