import { useNavigate, useSearchParams } from "react-router-dom";
import SupportiveSupervisionPlanLayout from "./SupportiveSupervisionPlanLayout";
import FormButton from "atoms/FormButton";
import { openDialog } from "store/ui";
import { DialogType, largeDailogScreen } from "constants/dailogs";
import { useAppDispatch, useAppSelector, useAppStore } from "hooks/useStore";
import { Button } from "components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    useCreateSupervisionPlanMutation,
    useGetSingleSupervisionPlanQuery,
    useModifySupervisionPlanMutation,
} from "services/program/plan/supervision-plan";
import { TSSPCompositionFormValues } from "definations/program/plan/supervision-plan";
import { formatDate } from "utils/date";
import { RouteEnum } from "constants/RouterConstants";
import { skipToken } from "@reduxjs/toolkit/query";

export default function EvaluationCheckList() {
    const [chosenCriterias, setChosenCriterias] = useState<
        { name: string; id: string }[]
    >([]);

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const { data: supervisionPlan } = useGetSingleSupervisionPlanQuery(
        id ?? skipToken
    );

    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const { isOpen } = useAppSelector((state) => state.ui.dailog);

    useEffect(() => {
        const prevFormData = JSON.parse(
            sessionStorage.getItem("compositionData") || "{}"
        );

        setChosenCriterias(
            prevFormData.objectives || supervisionPlan?.data.objectives
        );
    }, [isOpen]);

    const [createSupervisionPlan, { isLoading: isCreateLoading }] =
        useCreateSupervisionPlanMutation();

    const [modifySupervisionPlan, { isLoading: isModifyLoading }] =
        useModifySupervisionPlanMutation();

    const onSubmit = async () => {
        const prevFormData = JSON.parse(
            sessionStorage.getItem("compositionData") || "{}"
        ) as TSSPCompositionFormValues & {
            objectives: { name: string; id: string }[];
        };

        const formData = {
            ...prevFormData,
            visit_date: formatDate(prevFormData.visit_date),
            objectives: prevFormData?.objectives.map((obj) => obj.id),
        };

        try {
            if (id) {
                await modifySupervisionPlan({
                    id,
                    body: formData as TSSPCompositionFormValues,
                }).unwrap();
                toast.success("Supportive Supervision Plan Updated");
            } else {
                await createSupervisionPlan(formData).unwrap();
                toast.success("Supportive Supervision Plan Created");
            }

            sessionStorage.removeItem("compositionData");
            navigate(RouteEnum.PROGRAM_SUPPORTIVE_SUPERVISION);
        } catch (error: any) {
            toast.error(error.data.message || "Something went wrong");
        }
    };

    useEffect(() => {
        if (id && supervisionPlan) {
            const prevFormData = JSON.parse(
                sessionStorage.getItem("compositionData") || "{}"
            ) as TSSPCompositionFormValues & {
                objectives: { name: string; id: string }[];
            };

            prevFormData.objectives = supervisionPlan.data.objectives.map(
                ({ name, id }) => ({ name, id })
            );

            sessionStorage.setItem(
                "compositionData",
                JSON.stringify(prevFormData)
            );

            setChosenCriterias(
                supervisionPlan?.data.objectives.map((obj) => ({
                    name: obj.name,
                    id: obj.id,
                }))
            );
        }
    }, [id, supervisionPlan]);

    return (
        <SupportiveSupervisionPlanLayout>
            <div className="px-3 ">
                <h2 className="text-lg font-bold">Evaluation Criteria</h2>

                <div className="flex flex-col mt-10 space-y-3">
                    <div className="grid grid-cols-2 gap-5 bg-gray-100 p-5">
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
                                        data: supervisionPlan?.data.objectives,
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
                            type="button"
                            size="lg"
                            className="bg-[#FFF2F2] text-primary dark:text-gray-500"
                        >
                            Back
                        </FormButton>

                        <FormButton
                            type="button"
                            size="lg"
                            loading={isCreateLoading || isModifyLoading}
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
