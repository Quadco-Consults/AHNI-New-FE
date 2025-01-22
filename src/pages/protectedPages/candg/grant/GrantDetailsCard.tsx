import Card from "components/shared/Card";
import DescriptionCard from "components/shared/DescriptionCard";
import { useMemo } from "react";

const GrantDetailsCard = ({ grantDetails }: { grantDetails: any }) => {
    const CardDetails = useMemo(() => {
        return [
            {
                id: 1,
                label: "Project Name",
                value: grantDetails?.project?.title || "-",
            },
            {
                id: 1,
                label: "Funding Source",
                value: grantDetails?.grantor?.name || "-",
            },
            {
                id: 1,
                label: "Intervention",
                value: grantDetails?.intervention_area?.name || "-",
            },
            {
                id: 1,
                label: "Project Location",
                value: grantDetails?.location?.address || "-",
            },
            {
                id: 1,
                label: "Award Type",
                value: grantDetails?.award_type || "-",
            },
            {
                id: 1,
                label: "Reference No",
                value: grantDetails?.reference_number || "-",
            },
        ];
    }, [grantDetails]);
    return (
        <div className="w-full bg-white px-[2.5rem] py-[1.25rem] rounded-2xl flex flex-col gap-y-[1.25rem]">
            <p className="text-xl font-semibold">Grantee Details</p>
            <Card>
                <div className="w-full flex flex-wrap items-start justify-between p-3 gap-y-[1.25rem]">
                    {CardDetails.map((item, index) => {
                        return (
                            <div
                                className="w-[30%] space-y-[1.25rem] text-[#1A0000]"
                                key={index}
                            >
                                <p className="font-semibold">{item?.label}</p>
                                <p>{item?.value}</p>
                            </div>
                        );
                    })}
                </div>
            </Card>
            <Card>
                <div className="w-full flex flex-col items-start justify-between p-3 gap-y-[1.25rem] text-[#1A0000]">
                    <p className="font-semibold">Project Overview</p>
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
                <h3>Grant Analytics</h3>

                <div className="grid grid-cols-2 gap-5 mt-5">
                    <DescriptionCard label="Pipeline" />
                    <DescriptionCard label="Burn Rate" />
                    <DescriptionCard label="Money Month Remaining" />
                </div>
            </Card>
        </div>
    );
};

export default GrantDetailsCard;
