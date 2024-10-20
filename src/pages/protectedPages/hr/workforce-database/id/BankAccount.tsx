import DescriptionCard from "components/shared/DescriptionCard";
import { Separator } from "components/ui/separator";

const BankAccount = () => {
  return (
    <div className="card-wrapper space-y-10">
      <h4 className="text-red-500 text-lg font-medium">Bank Account Details</h4>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DescriptionCard label="Bank Name" description="Access Bank" />
        <DescriptionCard label="Branch Name" description="Wuse 2" />
        <DescriptionCard label="Account Name" description="Grace Adebayo" />
        <DescriptionCard label="Account Number" description="2034567890" />
        <DescriptionCard label="Sort Code" description="011234567" />
        <DescriptionCard label="Date" description="2034567890" />
      </div>

      <Separator />

      <h4 className="text-red-500 text-lg font-medium">
        Pension Fund Administration (PFA) selection
      </h4>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DescriptionCard
          label="Name of selected PFA"
          description="ARM Pension Managers (PFA) Limited"
        />
        <DescriptionCard label="RSA Number" description="2034567890" />
        <DescriptionCard
          label="PFC (Pension Fund Custodian) Account Name"
          description="2034567890"
        />
        <DescriptionCard label="PFC Account Number" description="2034567890" />
        <DescriptionCard
          label="Do you already have a Retirement Savings Account with any PFA?"
          description="Yes"
        />
        <DescriptionCard label="Date" description="847847" />
      </div>
    </div>
  );
};

export default BankAccount;
