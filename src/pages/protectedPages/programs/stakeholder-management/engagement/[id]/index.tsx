import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import LongArrowLeft from "components/icons/LongArrowLeft";
import BreadcrumbCard from "components/shared/Breadcrumb";
import Card from "components/shared/Card";
import { Checkbox } from "components/ui/checkbox";
import { Label } from "components/ui/label";
import { useNavigate } from "react-router-dom";

const EngagementDetails = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Stakeholder Management", icon: true },
    { name: "Engagement Plan", icon: true },
    { name: "Detail", icon: false },
  ];

  return (
    <div className="space-y-6 min-h-screen">
      <BreadcrumbCard list={breadcrumbs} />
      <button
        onClick={goBack}
        className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <Card className="space-y-6">
        <h4 className="font-semibold">Project Name</h4>
        <p className="font-extralight">ACEBAY</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">Project Deliverables:</h4>
            <p>University of Maiduguri Teaching Hospital, Borno state</p>
          </div>
          <div>
            <h4 className="font-semibold">Project Manager:</h4>
            <p>Gretchen Ekstrom</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="font-semibold">Start Date:</h4>
            <p>10-12-2023</p>
          </div>
          <div>
            <h4 className="font-semibold">End Date:</h4>
            <p>10-12-2023</p>
          </div>
        </div>

        <div className="flex flex-col space-y-3 pt-5">
          <Label className="font-semibold">
            3 Stakeholders selected for this state
          </Label>

          <div className="space-y-3">
            {Array(2)
              .fill({
                title: "Roger Dokidis",
                org: "Borno State House of Assembly",
                gender: "Male",
                designation: "Medical Director",
                phone: "09075364587",
                mail: "rogerdokidis@gmail.com",
              })
              .map((result, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-5 md:flex-row"
                >
                  <div className="bg-[#EBE8E1] w-full space-y-4 rounded-lg p-3 md:w-1/3">
                    <h4 className="font-semibold">Roger Dokidis</h4>

                    <div className="text-sm">
                      <h4 className="font-semibold">
                        Institution/Organization:
                      </h4>
                      <p>{result.org}</p>
                    </div>

                    <div className="grid text-xs grid-cols-2 gap-3">
                      <div>
                        <h4 className="font-semibold">Gender:</h4>
                        <p>{result.gender}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Designation:</h4>
                        <p>{result.designation}</p>
                      </div>
                    </div>

                    <div className="grid text-xs grid-cols-2 gap-3">
                      <div>
                        <h4 className="font-semibold">Phone Number:</h4>
                        <p>{result.phone}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">E-mail:</h4>
                        <p>{result.mail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3 w-full md:w-2/3">
                    <div>
                      <Label className="font-semibold">Influence</Label>
                      <p>High</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Information Type</Label>
                      <p>Nil</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Decision Maker</Label>
                      <p>Nil</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Frequency</Label>
                      <p>High</p>
                    </div>
                    <div>
                      <Label className="font-semibold">Type</Label>
                      <p>Nil</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <h4 className="font-semibold text-yellow-600 pt-5">Commitment Level</h4>

        <DataTable data={data} columns={columns} isLoading={false} />
      </Card>
    </div>
  );
};

export default EngagementDetails;

type WorkPlanData = {
  name: string;
  unaware: string;
  against: string;
  neutral: string;
  supportive: string;
  leading: string;
};

const data: WorkPlanData[] = Array(3).fill({
  name: "Omar Calzoni",
  unaware: "",
  against: "",
  neutral: "",
  supportive: "",
  leading: "",
});

const columns: ColumnDef<WorkPlanData>[] = [
  {
    header: "Stakeholder names",
    accessorKey: "name",
    size: 200,
  },
  {
    header: "Unaware",
    accessorKey: "unaware",
    size: 200,
    cell: () => (
      <div className="flex items-center w-full">
        <Checkbox checked />
      </div>
    ),
  },
  {
    header: "Against",
    accessorKey: "against",
    size: 200,
    cell: () => (
      <div className="flex items-center w-full">
        <Checkbox checked />
      </div>
    ),
  },
  {
    header: "Neutral",
    accessorKey: "neutral",
    size: 200,
    cell: () => (
      <div className="flex items-center w-full">
        <Checkbox checked />
      </div>
    ),
  },
  {
    header: "Phone Supportive",
    accessorKey: "supportive",
    size: 200,
    cell: () => (
      <div className="flex items-center w-full">
        <Checkbox checked />
      </div>
    ),
  },
  {
    header: "Leading",
    accessorKey: "leading",
    size: 200,
    cell: () => (
      <div className="flex items-center w-full">
        <Checkbox checked />
      </div>
    ),
  },
];
