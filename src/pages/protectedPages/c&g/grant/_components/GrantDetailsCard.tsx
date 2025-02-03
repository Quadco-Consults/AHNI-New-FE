import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import { IGrantSingleData } from "definations/c&g/grants";
import { useMemo } from "react";

const GrantDetailsCard = ({
    project: { title, funding_sources },
    award_type,
    award_amount,
    reference_number,
}: IGrantSingleData) => {
    const CardDetails = useMemo(() => {
        return [
            {
                id: 1,
                label: "Project Name",
                value: title,
            },

            {
                id: 2,
                label: "Funding Source",
                value: funding_sources.map((source) => source.name).join(", "),
            },

            {
                id: 3,
                label: "Intervention",
                value: "N/A",
            },

            {
                id: 4,
                label: "Project Location",
                value: "",
            },

            {
                id: 5,
                label: "Award Type",
                value: award_type,
            },

            {
                id: 5,
                label: "Award Amount",
                value: `$${award_amount}`,
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
                <div className="w-full flex flex-col items-start justify-between p-3 gap-y-[1.25rem] text-[#1A0000]">
                    <h3 className="font-semibold">Project Overview</h3>
                    <p>
                        Malaria Control Program focused on delivering,
                        monitoring, and evaluating interventions at the
                        grassroots level, including: bed net distribution, case
                        detection and treatment, operational research, and
                        behaviour change communications, such as teaching people
                        how to properly hang a net. <br />
                        Wherever possible, the program sought to integrate
                        malaria prevention activities with efforts to control or
                        eliminate diseases such as lymphatic filariasis, river
                        blindness, and trachoma, enabling village-based health
                        care delivery systems to address multiple diseases at
                        once.
                    </p>
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
