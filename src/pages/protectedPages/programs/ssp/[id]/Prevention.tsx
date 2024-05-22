import FormInput from "atoms/FormInput";
import FormTextArea from "atoms/FormTextArea";
import Card from "components/shared/Card";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { Form } from "components/ui/form";
import { RouteEnum } from "constants/RouterConstants";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { openDialog } from "store/ui";
import { DialogType } from "constants/dailogs";
import { useAppDispatch } from "hooks/useStore";
import AddSquareIcon from "components/icons/AddSquareIcon";

const Prevention = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const goBack = () => {
    navigate(-1);
  };

  const form = useForm({
    defaultValues: {
      title: [
        {
          descriptionOfItems: "",
          numberOfPersons: "",
          numberOfDays: "",
          fco: "",
          unitCost: "",
          total: "",
        },
      ],
    },
  });

  const { handleSubmit } = form;

  const onSubmit = (data: any) => {
    console.table(">>>>>>>>>>>>>>>>", data);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <div className="py-2 px-4 rounded-lg border text-green-500 border-green-500 bg-green-50">
          Page 7/7
        </div>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <h4 className="font-semibold">
              Integrated Facility Visit Checklist for Comprehensive Sites
            </h4>
            <hr />
            <Card className="space-y-3">
              <h4 className="font-semibold text-red-600">
                Infection, Prevention, and control
              </h4>

              <Card className="space-y-3 border-yellow-600">
                <h4>
                  Observe medical waste (e.g., cotton wool, gauze, etc.) at
                  SDPs: Assess waste management across service delivery points
                  including viral load collection points, patient waiting area,
                  CM resting areas, HIV testing points, counselling room, labor,
                  and delivery. Are there color-coded bins around service
                  delivery points? What are the observed challenges with waste
                  management? How can this be improved?{" "}
                </h4>

                <FormTextArea name="control" />
              </Card>

              <Card className="space-y-3 border-yellow-600">
                <h4 className="text-semibold text-yellow-600">
                  Before leaving facility, please check if below has been
                  completed
                </h4>

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>
                      Visited Facility management/PMO for entry/exit visit
                    </h2>
                  </div>
                  <div className="flex gap-5 justify-between w-1/5">
                    <div className="flex gap-2 items-center text-green-500">
                      <Checkbox className="border-green-500 data-[state=checked]:bg-inherit data-[state=checked]:text-green-500" />
                      <h6>Yes</h6>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Checkbox />
                      <h6>No</h6>
                    </div>
                  </div>
                </div>

                <FormInput name="comment" label="Comment" />

                <hr />

                <h4>
                  Provided LDHF session to address identified gaps (list topics
                  covered)
                </h4>

                <FormInput name="a" placeholder="a." />
                <FormInput name="b" placeholder="b." />
                <FormInput name="c" placeholder="c." />
                <FormInput name="d" placeholder="d." />
                <FormInput name="e" placeholder="e." />
                <FormInput name="f" placeholder="f." />

                <hr />

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>
                      CQI/TA form completed with summary of visit? (Attach copy
                      for retirement)
                    </h2>
                  </div>
                  <div className="flex gap-5 justify-between w-1/5">
                    <div className="flex gap-2 items-center text-green-500">
                      <Checkbox className="border-green-500 data-[state=checked]:bg-inherit data-[state=checked]:text-green-500" />
                      <h6>Yes</h6>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Checkbox />
                      <h6>No</h6>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold">Upload Attachment</h4>
                <Button
                  className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500"
                  type="button"
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: DialogType.ActivityUpload,
                        dialogProps: {
                          header: "Upload New Document",
                          width: "max-w-2xl",
                        },
                      })
                    );
                  }}
                >
                  <AddSquareIcon />
                  Upload Activity Plan
                </Button>

                <hr />

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>
                      Observe post clinic review meeting? (Attach summary of
                      visit, picture gallery)
                    </h2>
                  </div>
                  <div className="flex gap-5 justify-between w-1/5">
                    <div className="flex gap-2 items-center text-green-500">
                      <Checkbox className="border-green-500 data-[state=checked]:bg-inherit data-[state=checked]:text-green-500" />
                      <h6>Yes</h6>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Checkbox />
                      <h6>No</h6>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold">Upload Attachment</h4>
                <Button
                  className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500"
                  type="button"
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: DialogType.ActivityUpload,
                        dialogProps: {
                          header: "Upload New Document",
                          width: "max-w-2xl",
                        },
                      })
                    );
                  }}
                >
                  <AddSquareIcon />
                  Upload Activity Plan
                </Button>

                <hr />

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>Debrief with facility/adhoc staff.</h2>
                  </div>
                  <div className="flex gap-5 justify-between w-1/5">
                    <div className="flex gap-2 items-center text-green-500">
                      <Checkbox className="border-green-500 data-[state=checked]:bg-inherit data-[state=checked]:text-green-500" />
                      <h6>Yes</h6>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Checkbox />
                      <h6>No</h6>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold">Upload Attachment</h4>
                <Button
                  className="flex gap-2 py-6 bg-[#FFF2F2] text-red-500"
                  type="button"
                  onClick={() => {
                    dispatch(
                      openDialog({
                        type: DialogType.ActivityUpload,
                        dialogProps: {
                          header: "Upload New Document",
                          width: "max-w-2xl",
                        },
                      })
                    );
                  }}
                >
                  <AddSquareIcon />
                  Upload Activity Plan
                </Button>

                <hr />

                <h4 className="font-semibold">
                  Remediation plan and follow up actions.
                </h4>

                <FormTextArea name="control" />

                <hr />

                <div className="flex justify-between py-3 gap-5">
                  <div className="">
                    <h2>Agree on revisit date.</h2>
                  </div>
                  <div className="flex gap-5 justify-between w-1/5">
                    <div className="flex gap-2 items-center text-green-500">
                      <Checkbox className="border-green-500 data-[state=checked]:bg-inherit data-[state=checked]:text-green-500" />
                      <h6>Yes</h6>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Checkbox />
                      <h6>No</h6>
                    </div>
                  </div>
                </div>
              </Card>
            </Card>
          </form>
        </Form>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={goBack}
          variant="outline"
          className="flex gap-4 items-center text-primary border-primary hover:bg-red-50 hover:text-red-500"
        >
          <ArrowLeft size={15} /> Back
        </Button>

        <Button
          className="px-8"
          onClick={() => {
            dispatch(
              openDialog({
                type: DialogType.PreventionModal,
                dialogProps: {
                  width: "max-w-lg",
                },
              })
            );
          }}
        >
          Finish
        </Button>
      </div>
    </div>
  );
};

export default Prevention;
