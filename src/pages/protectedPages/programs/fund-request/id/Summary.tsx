import { Badge } from "components/ui/badge";
import { IProjectSingleData } from "definations/project";

type PropsType = {
    data: IProjectSingleData;
};

const Summary = ({ data }: PropsType) => {
    return (
        <div className="space-y-5">
            <div className="grid pb-5 grid-cols-2 gap-5 md:grid-cols-2">
                <div className="space-y-3">
                    <h3 className="font-semibold">Project Name</h3>
                    <p className="text-sm text-gray-500">{data.title}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Project ID</h3>
                    <p className="text-sm text-gray-500">{data.project_id}</p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold">Project Start Date</h3>
                    <p className="text-sm text-gray-500">{data.start_date}</p>
                </div>
                <div className="space-y-3">
                    <h3 className="font-semibold">Project End Date</h3>
                    <p className="text-sm text-gray-500">{data.end_date}</p>
                </div>
            </div>

            <hr className="pb-5" />

            <div className="space-y-3">
                <h3 className="font-semibold">State Offices Involved</h3>
                <div className="flex flex-wrap gap-3">
                    {data?.partners.map((partner) => (
                        <Badge
                            key={partner.id}
                            variant="default"
                            className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
                        >
                            {partner.name}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Summary;
