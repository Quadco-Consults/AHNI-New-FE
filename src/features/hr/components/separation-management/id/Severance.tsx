import Card from "@/components/Card";
import DescriptionCard from "@/components/DescriptionCard";
import { Badge } from "@/components/ui/badge";
import { ExitTrackerSeparation } from "@/features/hr/types/separation-management";

interface SeveranceProps {
  data?: ExitTrackerSeparation;
}

const Severance = ({ data }: SeveranceProps) => {
  if (!data) return null;

  // Handle API wrapper structure
  const actualData = (data as any).data || data;

  const employeeName = `${actualData.employee?.legal_firstname || ""} ${actualData.employee?.legal_lastname || ""}`.toUpperCase();

  const formatCurrency = (amount?: string | number) => {
    if (!amount) return "₦0.00";
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₦${numAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const paymentDate = actualData.payment_date && actualData.payment_date.trim() !== ""
    ? new Date(actualData.payment_date).toLocaleDateString()
    : "Not yet scheduled";

  // Get payment status badge variant
  const getPaymentStatusVariant = (status: string) => {
    if (status === "paid" || status === "payment_confirmed") return "default";
    if (status === "submitted_to_finance") return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-xl">{employeeName}</h4>
        <Badge variant={getPaymentStatusVariant(actualData.payment_status)}>
          {actualData.payment_status_display}
        </Badge>
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Terminal Benefits</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(actualData.total_terminal_benefits)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Staff Obligations</p>
            <p className="text-2xl font-bold text-red-600">
              -{formatCurrency(actualData.staff_owes_amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Net Amount Payable</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(actualData.net_amount_payable)}
            </p>
          </div>
        </div>
        {actualData.payment_date && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-muted-foreground">
              Payment Date: <span className="font-semibold text-gray-700">{paymentDate}</span>
            </p>
          </div>
        )}
      </Card>

      {/* Terminal Benefits Breakdown */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-yellow-600 text-lg">Terminal Benefits Breakdown</p>
          <Badge variant="secondary">8 Components</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DescriptionCard
            label="Final Basic Salary"
            description={formatCurrency(actualData.final_basic_salary)}
          />
          <DescriptionCard
            label="Final Transportation Allowance"
            description={formatCurrency(actualData.final_transportation)}
          />
          <DescriptionCard
            label="Annual Bonus (13th Month)"
            description={formatCurrency(actualData.annual_bonus_13th)}
          />
          <DescriptionCard
            label="Housing Allowance"
            description={formatCurrency(actualData.housing_allowance)}
          />
          <DescriptionCard
            label="Miscellaneous Allowances"
            description={formatCurrency(actualData.miscellaneous)}
          />
          <DescriptionCard
            label="Pension Contribution"
            description={formatCurrency(actualData.pension_contribution)}
          />
          <DescriptionCard
            label="Annual Leave Balance"
            description={formatCurrency(actualData.annual_leave_balance_amount)}
          />
          <DescriptionCard
            label="Gratuity Pay"
            description={formatCurrency(actualData.gratuity_pay)}
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Subtotal:</span>
            <span className="text-blue-600">{formatCurrency(actualData.total_terminal_benefits)}</span>
          </div>
        </div>
      </Card>

      {/* Staff Obligations */}
      {parseFloat(actualData.staff_owes_amount) > 0 && (
        <Card className="space-y-4 border-l-4 border-l-red-500">
          <p className="font-semibold text-red-600 text-lg">Staff Obligations</p>
          <DescriptionCard
            label="Amount Owed to Organization"
            description={formatCurrency(actualData.staff_owes_amount)}
          />
          {actualData.staff_owes_notes && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Notes:</span> {actualData.staff_owes_notes}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Additional Benefits Info */}
      {actualData.benefits_info && (
        <Card className="bg-blue-50">
          <DescriptionCard
            label="Additional Benefits Information"
            description={actualData.benefits_info}
          />
        </Card>
      )}

      {/* Signature Status */}
      <Card className="space-y-4">
        <p className="font-semibold text-lg">Terminal Benefits Document Status</p>
        <div className="flex items-center gap-4">
          <Badge variant={actualData.terminal_benefit_status === "fully_signed" ? "default" : "secondary"}>
            {actualData.terminal_benefit_status_display}
          </Badge>
          {actualData.terminal_benefit_status === "fully_signed" && (
            <span className="text-sm text-green-600">✓ All required signatures obtained</span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Severance;
