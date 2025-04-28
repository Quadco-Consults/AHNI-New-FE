import DescriptionCard from "components/shared/DescriptionCard";
import { LoadingSpinner } from "components/shared/Loading";
import { Separator } from "components/ui/separator";
import { useParams } from "react-router-dom";
import {
  useGetWorkforceBankAccountQuery,
  useGetWorkforcePensionQuery,
} from "services/hrApi/workforce";

const BankAccount = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetWorkforceBankAccountQuery({
    path: { id: id as string },
  });
  const { data: pension } = useGetWorkforcePensionQuery({
    path: { id: id as string },
  });

  return (
    <div className="card-wrapper space-y-10">
      {isLoading && <LoadingSpinner />}
      <h4 className="text-red-500 text-lg font-medium">Bank Account Details</h4>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DescriptionCard label="Bank Name" description={data?.bank_name} />
        <DescriptionCard label="Branch Name" description={data?.branch_name} />
        <DescriptionCard
          label="Account Name"
          description={data?.account_name}
        />
        <DescriptionCard
          label="Account Number"
          description={data?.account_number}
        />
        <DescriptionCard label="Sort Code" description={data?.sort_code} />
        <DescriptionCard label="Date" description={data?.date_provided} />
      </div>

      <Separator />

      <h4 className="text-red-500 text-lg font-medium">
        Pension Fund Administration (PFA) selection
      </h4>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DescriptionCard
          label="Name of selected PFA"
          description={pension?.name}
        />
        <DescriptionCard label="RSA Number" description={pension?.rsa_number} />
        <DescriptionCard
          label="PFC (Pension Fund Custodian) Account Name"
          description={pension?.pfc_account_name}
        />
        <DescriptionCard
          label="PFC Account Number"
          description={pension?.pfc_account_number}
        />
        {/* <DescriptionCard
          label="Do you already have a Retirement Savings Account with any PFA?"
          description="Yes"
        /> */}
        <DescriptionCard label="Date" description={pension?.date_provided} />
      </div>
    </div>
  );
};

export default BankAccount;
