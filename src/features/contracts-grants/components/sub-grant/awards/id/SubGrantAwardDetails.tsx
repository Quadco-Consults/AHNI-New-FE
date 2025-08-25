import Card from "components/Card";
import DescriptionCard from "components/DescriptionCard";
import { ISubGrantSingleData } from "@/features/contracts-grants/types/contract-management/sub-grant/sub-grant";
import { useMemo } from "react";
import { formatNumberCurrency } from "utils/utls";

const SubGrantAwardDetails = ({
  title,
  sub_grant_administrator,
  award_type,
  technical_staff,
  business_unit,
  amount_usd,
  amount_ngn,
  start_date,
  end_date,
  submission_start_date,
  submission_end_date,
  evaluation_applicants,
}: ISubGrantSingleData) => {
  const details = useMemo(() => {
    return [
      {
        id: 1,
        label: "Project Title",
        value: `${title}`,
      },

      {
        id: 2,
        label: "AHNI  Project Number",
        value: "N/A",
      },

      {
        id: 3,
        label: "AHNI Grant Administrator",
        value: `${sub_grant_administrator.first_name} ${sub_grant_administrator.last_name}`,
      },

      {
        id: 4,
        label: "Country of Performance",
        value: "Nigeria",
      },

      {
        id: 5,
        label: "AHNI Originating Funder / Funding Source",
        value: "N/A",
      },

      {
        id: 6,
        label: "Subaward Type (Proposed)",
        value: award_type,
      },

      {
        id: 7,
        label: "AHNI Program/Technical Staff Contact",
        value: `${technical_staff.first_name} ${technical_staff.last_name}`,
      },

      {
        id: 8,
        label: "Business Unit",
        value: business_unit,
      },
      {
        id: 9,
        label: "Subaward Life of Project Value (USD)",
        value: formatNumberCurrency(amount_usd, "USD"),
      },
      {
        id: 10,
        label: "Subaward Life of Project Value (Local Currency)",
        value: formatNumberCurrency(amount_ngn, "NGN"),
      },

      { id: 11, label: "Start Date", value: start_date },

      { id: 12, label: "End Date", value: end_date },

      {
        id: 3,
        label: "Submission Start Date",
        value: submission_start_date,
      },

      {
        id: 14,
        label: "Submission End Date",
        value: submission_end_date,
      },

      {
        id: 15,
        label: "Commitees",
        value: evaluation_applicants
          .map((member) => `${member.first_name} ${member.last_name}`)
          .join(", "),
      },
    ];
  }, []);

  return (
    <div className="bg-white rounded-2xl flex flex-col gap-y-[1.25rem] py-5 px-10">
      <h3 className="text-xl font-bold">Award Details</h3>
      <Card className="grid grid-cols-2 gap-8">
        {details.map(({ label, value }, index) => (
          <DescriptionCard key={index} label={label} description={value} />
        ))}
      </Card>
    </div>
  );
};

export default SubGrantAwardDetails;
