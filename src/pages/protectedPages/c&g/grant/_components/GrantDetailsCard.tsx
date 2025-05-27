import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import { projectColumns } from "components/Table/columns/project/project-columns";
import DataTable from "components/Table/DataTable";
import { IGrantSingleData } from "definations/c&g/grants";
import { useMemo } from "react";
import { formatNumberCurrency } from "utils/utls";

const GrantDetailsCard = ({
    award_type,
    award_amount,
    reference_number,
}: IGrantSingleData) => {
    const CardDetails = useMemo(() => {
        return [
            {
                id: 1,
                label: "Grant Name",
                value: "",
            },

            {
                id: 2,
                label: "Grant ID",
                value: "",
            },

            {
                id: 3,
                label: "Funding Source",
                value: "N/A",
            },

            {
                id: 4,
                label: "Award Type",
                value: award_type,
            },

            {
                id: 5,
                label: "Award Reference Number",
                value: "",
            },

            {
                id: 5,
                label: "Award Amount",
                value: formatNumberCurrency(award_amount, "USD"),
            },

            {
                id: 6,
                label: "Reference No",
                value: reference_number,
            },
        ];
    }, []);

    return (
        <div className="w-full bg-white px-[2.5rem] py-[1.25rem] rounded-2xl flex flex-col gap-y-[1.25rem]">
            <h3 className="text-xl font-bold">Grant Details</h3>
            <Card>
                <div className="grid grid-cols-3 gap-10">
                    {CardDetails.map((item, index) => {
                        return (
                            <DescriptionCard
                                key={index}
                                label={item.label}
                                description={item.value}
                            />
                        );
                    })}
                </div>
            </Card>

            <Card>
                <h3 className="font-semibold">Grant Analytics</h3>

                <div className="grid grid-cols-2 gap-5 mt-5">
                    <DescriptionCard label="Pipeline" description="N/A" />
                    <DescriptionCard label="Burn Rate" description="N/A" />
                    <DescriptionCard
                        label="Money Month Remaining"
                        description="N/A"
                    />
                </div>
            </Card>
        </div>
    );
};

export default GrantDetailsCard;
