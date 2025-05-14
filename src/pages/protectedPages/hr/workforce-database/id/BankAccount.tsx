import DescriptionCard from "components/shared/DescriptionCard";
import { LoadingSpinner } from "components/shared/Loading";
import { Separator } from "components/ui/separator";
import { useParams } from "react-router-dom";

import { useGetEmployeeOnboardingBankAcctQuery } from "services/hrApi/hr-employee-onboarding-bank-account";
import { useGetEmployeeOnboardingPensionQuery } from "services/hrApi/hr-employee-onboarding-pension";

const BankAccount = () => {
  const { id } = useParams();

  const { data, isLoading: bankLoading } =
    useGetEmployeeOnboardingBankAcctQuery({ employee: id as string });
  const bankData = data?.data.results[0];

  const { data: pension, isLoading: pensionLoading } =
    useGetEmployeeOnboardingPensionQuery({ employee: id });

  console.log("Bank & Pension", data);

  return (
    <div className='card-wrapper space-y-10'>
      {bankLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h4 className='text-red-500 text-lg font-medium'>
            Bank Account Details
          </h4>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <DescriptionCard
              label='Bank Name'
              description={bankData?.bank_name}
            />
            <DescriptionCard
              label='Branch Name'
              description={bankData?.branch_name}
            />
            <DescriptionCard
              label='Account Name'
              description={bankData?.account_name}
            />
            <DescriptionCard
              label='Account Number'
              description={bankData?.account_number}
            />
            <DescriptionCard
              label='Sort Code'
              description={bankData?.sort_code}
            />
            <DescriptionCard
              label='Date'
              description={bankData?.created_datetime}
            />
          </div>
        </>
      )}

      <Separator />

      {pensionLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h4 className='text-red-500 text-lg font-medium'>
            Pension Fund Administration (PFA) selection
          </h4>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
            <DescriptionCard
              label='Name of selected PFA'
              description={pension?.name}
            />
            <DescriptionCard
              label='RSA Number'
              description={pension?.rsa_number}
            />
            <DescriptionCard
              label='PFC (Pension Fund Custodian) Account Name'
              description={pension?.pfc_account_name}
            />
            <DescriptionCard
              label='PFC Account Number'
              description={pension?.pfc_account_number}
            />
            {/* <DescriptionCard
                label="Do you already have a Retirement Savings Account with any PFA?"
                description="Yes"
              /> */}
            <DescriptionCard
              label='Date'
              description={pension?.date_provided}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BankAccount;
