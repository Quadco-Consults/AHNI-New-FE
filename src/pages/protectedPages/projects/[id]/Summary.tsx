import LocationSvg from "assets/svgs/LocationSvg";
import { Badge } from "components/ui/badge";
import { ProjectsResultsData } from "definations/project-types/projects";
import { MapPin } from "lucide-react";

const Summary = (props: ProjectsResultsData) => {
    const {
        title,
        project_id,
        goal,
        start_date,
        end_date,
        budget,
        project_managers,
        funding_sources,
        expected_results,
        beneficiaries,
        partners,
    } = props;

    return (
        <div className="space-y-10">
            <h4 className="font-semibold text-lg">Project Summary</h4>
            <hr />

            <div className="space-y-1">
                <h3 className="font-semibold">Project Title</h3>
                <p className="text-sm text-gray-500">{title}</p>
            </div>

            <div className="space-y-1">
                <h3 className="font-semibold">Goal of the project</h3>
                <p className="text-sm text-gray-500">{goal}</p>
            </div>

            {/* <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <h3 className="font-semibold">Project ID</h3>
                    <p className="text-sm text-gray-500">{project_id}</p>
                </div>
            </div> */}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <h3 className="font-semibold">Start Date</h3>
                    <p className="text-sm text-gray-500">{start_date}</p>
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold">End Date</h3>
                    <p className="text-sm text-gray-500">{end_date}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <h3 className="font-semibold">Budget</h3>
                    <p className="text-sm text-gray-500">${budget}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                        <h3 className="font-semibold">Project Manager</h3>
                        <p className="text-sm text-gray-500">
                            {project_managers
                                ?.map(
                                    (manager) =>
                                        `${manager?.first_name} ${manager?.last_name}`
                                )
                                .join(", ")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold">Funding Source</h3>

                <div className="flex flex-wrap gap-3">
                    {funding_sources?.map((option: any, index: number) => (
                        <Badge
                            variant="default"
                            key={index}
                            className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
                        >
                            {option?.name}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <h3 className="font-semibold">Expected Results</h3>
                    <p className="text-sm text-gray-500">{expected_results}</p>
                </div>
            </div>

            <div className="space-y-3 py-5">
                <h3 className="font-semibold">Target Population</h3>
                <div className="flex flex-wrap gap-3">
                    {beneficiaries?.map((option: any) => (
                        <Badge
                            variant="default"
                            key={option.id}
                            className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
                        >
                            {option.name}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                    <h3 className="font-semibold">Consortium Partners</h3>

                    <div className="flex flex-wrap gap-3">
                        {partners?.map((partner) => (
                            <div
                                key={partner.id}
                                className="border p-5 space-y-3 rounded-lg"
                            >
                                <div className="flex gap-3 items-center">
                                    <h4 className="font-semibold">
                                        {partner.name}
                                    </h4>
                                </div>

                                <div className="flex items-cemter gap-2">
                                    <LocationSvg />
                                    {partner.state}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;
