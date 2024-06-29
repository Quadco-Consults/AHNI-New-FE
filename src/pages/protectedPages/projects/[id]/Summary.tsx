import { Badge } from "components/ui/badge";
import fhiIcon from "assets/imgs/fhi.png";
import { MapPin } from "lucide-react";

const Summary = (projects: any) => {
  return (
    <div className="space-y-7">
      <h4 className="font-semibold text-lg">Project Summary</h4>
      <hr />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <h3 className="font-semibold">Project ID</h3>
          <p className="text-sm text-gray-500">{projects.project_id}</p>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">Project Title</h3>
          <p className="text-sm text-gray-500">{projects.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <h3 className="font-semibold">Project Goal</h3>
          <p className="text-sm text-gray-500">{projects.goal}</p>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">Project Manager</h3>
          <p className="text-sm text-gray-500">{projects.project_manager}</p>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold">Project Objectives</h3>
        {projects.project_objectives.map((obj: any) => (
          <div key={obj?.id} className="space-y-2">
            <p className="text-sm text-gray-500">{obj?.title}</p>

            <p className="font-semibold text-sm">Project Sub-Objectives</p>
            <ul className="space-y-2">
              {obj.sub_objectives.map((obj: any) => (
                <li
                  key={obj?.id}
                  className="text-sm text-gray-500 list-disc pl-5"
                >
                  {obj?.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <h3 className="font-semibold">Expected Result</h3>
          <p className="text-sm text-gray-500">{projects.expected_results}</p>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold">Budget</h3>
          <p className="text-sm text-gray-500">
            ${projects.budget.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold">Project Location</h3>
            <div className="flex flex-wrap gap-3">
              {projects.project_partners.map((option: any, index: number) => (
                <Badge
                  variant="default"
                  key={index}
                  className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
                >
                  {option.location.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Project Location</h3>
            <div className="flex flex-wrap gap-3">
              {projects.project_funding_source.map(
                (option: any, index: number) => (
                  <Badge
                    variant="default"
                    key={index}
                    className="bg-[#EBE8E1] text-[#1a0000ad] px-4 py-2 rounded-lg"
                  >
                    {option.name}
                  </Badge>
                )
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 py-5">
          <h3 className="font-semibold">Target Population</h3>
          <div className="flex flex-wrap gap-3">
            {projects.project_beneficiaries.map((option: any) => (
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

        <div className="space-y-3">
          <h3 className="font-semibold">Consortium partners</h3>
          <div className="flex flex-wrap gap-3">
            {projects.project_partners.map((option: any, index: number) => (
              <div key={index}>
                {" "}
                {option.partners.map((el: any) => (
                  <Badge
                    variant="default"
                    key={el.id}
                    className="bg-[#EBE8E1] flex gap-3 text-base font-light text-[#1a0000ad] px-4 py-2 rounded-lg"
                  >
                    <img src={el.logo} alt="" />

                    <div>
                      <h4 className="font-semibold">{el.name}</h4>
                      <p className="flex items-center gap-1 text-xs">
                        <span>
                          <MapPin size={13} />
                        </span>
                        {el.state}
                      </p>
                    </div>
                  </Badge>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
