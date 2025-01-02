import { useNavigate } from "react-router-dom";
import SupportiveSupervisionPlanLayout from "./SupportiveSupervisionPlanLayout";
import FormButton from "atoms/FormButton";
import { ArrowLeft } from "lucide-react";
import { openDialog } from "store/ui";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { useAppDispatch, useAppSelector, useAppStore } from "hooks/useStore";
import { Button } from "components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useCreateSupervisionPlanMutation } from "services/program/plan/supervision-plan";
import { TSSPCompositionFormValues } from "definations/program/plan/supervision-plan";

export default function EvaluationCheckList() {
    const [chosenCriterias, setChosenCriterias] = useState<
        { name: string; id: string }[]
    >([]);

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const { isOpen } = useAppSelector((state) => state.ui.dailog);

    useEffect(() => {
        const prevFormData = JSON.parse(
            localStorage.getItem("compositionData") || "{}"
        );

        setChosenCriterias(prevFormData.objectives);
    }, [isOpen]);

    const [createSupervisionPlan, { isLoading }] =
        useCreateSupervisionPlanMutation();

    const onSubmit = async () => {
        const prevFormData = JSON.parse(
            localStorage.getItem("compositionData") || "{}"
        ) as TSSPCompositionFormValues & {
            objectives: { name: string; id: string }[];
        };

        const formData = {
            ...prevFormData,
            objectives: prevFormData.objectives.map((obj) => obj.id),
        };

        try {
            await createSupervisionPlan(formData).unwrap();
            toast.success("Supportive Supervision Plan Created");
            localStorage.removeItem("compositionData");

            dispatch(
                openDialog({
                    type: DialogType.SuccessModal,
                    dialogProps: {
                        width: "max-w-lg",
                    },
                })
            );
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    return (
        <SupportiveSupervisionPlanLayout>
            <div className="px-3 ">
                <h2 className="text-lg font-bold">Evaluation Criteria</h2>

                <div className="flex flex-col w-[299px] mt-10 space-y-3">
                    <div className="grid grid-cols-2 gap-5 bg-gray-100 p-5 w-[500px]">
                        {chosenCriterias?.map(({ name, id }) => (
                            <div key={id} className="bg-white p-5">
                                <p>{name}</p>
                            </div>
                        ))}
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="text-[#DEA004]"
                        onClick={() => {
                            dispatch(
                                openDialog({
                                    type: DialogType.Checklist,
                                    dialogProps: {
                                        ...largeDailogScreen,
                                    },
                                })
                            );
                        }}
                    >
                        Click to select evaluation criteria
                    </Button>
                </div>
                <div className="mt-10">
                    <div className="flex justify-end gap-5 pt-24">
                        <FormButton
                            onClick={() => navigate(-1)}
                            preffix={<ArrowLeft size={14} />}
                            type="button"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                        >
                            Back
                        </FormButton>

                        <FormButton
                            type="button"
                            loading={isLoading}
                            onClick={onSubmit}
                        >
                            Finish
                        </FormButton>
                    </div>
                </div>
            </div>
        </SupportiveSupervisionPlanLayout>
    );
}
