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
import FormSelect from "atoms/FormSelect";
import FormInput from "atoms/FormInput";
import DeleteIcon from "components/icons/DeleteIcon";

const CreateAnalysis = () => {
  const navigate = useNavigate();
  const form = useForm();

  const { handleSubmit } = form;

  const goBack = () => {
    navigate(-1);
  };

  const dispatch = useAppDispatch();

  const onSubmit = () => {};
  return (
    <div className="space-y-6 min-h-screen">
      <button
        onClick={goBack}
        className="w-[3rem] aspect-square rounded-full drop-shadow-md bg-white flex items-center justify-center"
      >
        <LongArrowLeft />
      </button>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="space-y-10 p-10">
            <FormSelect
              name="state"
              label="State"
              placeholder="Select state"
              required
            />

            <div className="flex flex-col mt-10 space-y-3">
              <Label className="font-semibold">
                3 Stakeholders selected for this state
              </Label>

              <div className="space-y-3">
                {Array(3)
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
                        <FormInput name="role" label="Project Role" />
                        <FormInput name="importance" label="Importance" />
                        <FormInput name="score" label="score" />
                        <FormInput name="concerns" label="Major Concerns" />
                        <FormInput name="owner" label="Relationship Owner" />
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
          </Card>

          <div className="flex justify-end gap-5 pt-10">
            <FormButton
              onClick={goBack}
              type="button"
              className="bg-[#FFF2F2] text-primary "
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

export default CreateAnalysis;
