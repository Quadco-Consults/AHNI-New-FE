import { useNavigate } from "react-router-dom";
import FormButton from "atoms/FormButton";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { Label } from "components/ui/label";
import { useAppDispatch } from "hooks/useStore";
import { Button } from "components/ui/button";
import LongArrowLeft from "components/icons/LongArrowLeft";
import Card from "components/shared/Card";
import { useForm } from "react-hook-form";
import { Form } from "components/ui/form";
import FormInput from "atoms/FormInput";
import DeleteIcon from "components/icons/DeleteIcon";
import FormTextArea from "atoms/FormTextArea";
import FormSelect from "atoms/FormSelectField";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "components/Table/DataTable";
import { Checkbox } from "components/ui/checkbox";
import { RouteEnum } from "constants/RouterConstants";
import BreadcrumbCard from "components/shared/Breadcrumb";

const CreateEngagement = () => {
  const navigate = useNavigate();
  const form = useForm();

  const { handleSubmit } = form;

  const goBack = () => {
    navigate(-1);
  };

  const dispatch = useAppDispatch();

  const onSubmit = () => {
    navigate(RouteEnum.PROGRAM_STAKEHOLDER_MANAGEMENT_PLAN);
  };

  const breadcrumbs = [
    { name: "Procurement", icon: true },
    { name: "Stakeholder Management", icon: true },
    { name: "Engagement Plan", icon: true },
    { name: "Create", icon: false },
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

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="space-y-5 p-10">
            <FormInput name="name" label="Project Name" required />
            <FormTextArea name="deliverables" label="Project Deliverables" />
            <FormInput name="manager" label="Project Manager" required />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label>Start Date</Label>
                <div className="grid grid-cols-3 gap-3">
                  <FormInput name="date" placeholder="DD" />
                  <FormInput name="month" placeholder="MM" />
                  <FormInput name="year" placeholder="YYYY" />
                </div>
              </div>
              <div>
                <Label>End Date</Label>
                <div className="grid grid-cols-3 gap-3">
                  <FormInput name="date" placeholder="DD" />
                  <FormInput name="month" placeholder="MM" />
                  <FormInput name="year" placeholder="YYYY" />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
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
                      <div className="bg-[#EBE8E1] space-y-4 rounded-lg p-3">
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
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <FormSelect
                          name="influence"
                          label="Influence"
                          placeholder="Medium"
                          required
                        />
                        <FormInput
                          name="information_type"
                          label="Information Type"
                        />
                        <FormInput name="decision" label="Decision Maker" />
                        <FormInput name="frequency" label="Frequency" />
                        <FormInput name="type" label="Type" />
                        <div>
                          <Button className="flex gap-2 mt-3 py-6 bg-[#FFF2F2] text-red-500">
                            <DeleteIcon />
                            Remove Stakeholder
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className=" w-[299px] mt-5">
              <Button
                type="button"
                variant="outline"
                className="text-[#DEA004]"
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: DialogType.StakeholderModal,
                      dialogProps: {
                        width: "max-w-7xl",
                        height: "max-h-[800px]",
                      },
                    })
                  );
                }}
              >
                Click to add stakeholders
              </Button>
            </div>

            <hr />

            <h4 className="font-semibold text-yellow-600">Commitment Level</h4>

            <DataTable data={data} columns={columns} />
          </Card>

          <div className="flex justify-end gap-5 pt-10">
            <FormButton
              onClick={goBack}
              type="button"
              className="bg-[#FFF2F2] text-primary dark:text-gray-500"
            >
              Cancel
            </FormButton>

            <FormButton
              onClick={() => {
                onSubmit();
              }}
            >
              Create
            </FormButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateEngagement;

type WorkPlanData = {
  name: string;
  unaware: string;
  against: string;
  neutral: string;
  supportive: string;
  leading: string;
};

const data: WorkPlanData[] = Array(2).fill({
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
        <Checkbox />
      </div>
    ),
  },
  {
    header: "Against",
    accessorKey: "against",
    size: 200,
    cell: () => (
      <div className="flex items-center w-full">
        <Checkbox />
      </div>
    ),
  },
  {
    header: "Neutral",
    accessorKey: "neutral",
    size: 200,
    cell: () => (
      <div className="flex items-center w-full">
        <Checkbox />
      </div>
    ),
  },
  {
    header: "Phone Supportive",
    accessorKey: "supportive",
    size: 200,
    cell: () => (
      <div className="flex items-center w-full">
        <Checkbox />
      </div>
    ),
  },
  {
    header: "Leading",
    accessorKey: "leading",
    size: 200,
    cell: () => (
      <div className="flex items-center w-full">
        <Checkbox />
      </div>
    ),
  },
];
