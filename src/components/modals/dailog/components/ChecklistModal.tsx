import logoPng from "assets/imgs/logo.png";
import { ScrollArea } from "components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue } from "components/ui/select";
import { Checkbox } from "components/ui/checkbox";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "components/shared/Loading";
import FormButton from "atoms/FormButton";
import { useAppDispatch } from "hooks/useStore";
import { closeDialog } from "store/ui";
import { useGetAllSupervisionCriteriaQuery } from "services/modules/program/supervision-criteria";

const ChecklistModal = () => {
    const [chosenCriterias, setChosenCriterias] = useState<
        {
            id: string;
            name: string;
        }[]
    >([]);

    const dispatch = useAppDispatch();

    const { data: criteria, isLoading: isCriteriaLoading } =
        useGetAllSupervisionCriteriaQuery({ page: 1, size: 2000000 });

    const handleChangeCheck = (
        checkedValue: boolean | string,
        name: string,
        id: string
    ) => {
        console.log({ checkedValue, name, id });
        console.log({ chosenCriterias });

        if (checkedValue) {
            setChosenCriterias([...chosenCriterias, { id, name }]);
        } else {
            setChosenCriterias(
                chosenCriterias.filter((criteria) => criteria.id !== id)
            );
        }
    };

    // useEffect(() => {
    //     const prevFormData = JSON.parse(
    //         localStorage.getItem("compositionData") || "{}"
    //     );

    //     if (prevFormData) {
    //         setChosenCriterias(prevFormData.objectives);
    //     }
    // }, []);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const prevFormData = JSON.parse(
            localStorage.getItem("compositionData") || "{}"
        );

        const formData = {
            ...prevFormData,
            objectives: chosenCriterias,
        };

        localStorage.setItem("compositionData", JSON.stringify(formData));

        dispatch(closeDialog());
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="flex flex-col mt-10 items-center justify-center w-full h-[80vh] ">
                <ScrollArea className="h-[90%]">
                    <div className="flex flex-col items-center justify-between">
                        <div>
                            <img src={logoPng} alt="logo" width={150} />
                        </div>
                        <h4 className="mt-8 text-lg font-bold">
                            Evaluation Criteria
                        </h4>
                        <p className="mt-5 text-muted-foreground">
                            You can switch between evaluation categories and
                            select all relevant questions
                        </p>

                        <div className="w-8/12 mt-6">
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select evaluation category" />
                                </SelectTrigger>
                                {/* <SelectContent>
                                        {isLoading ? (
                                            <LoadingSpinner />
                                        ) : (
                                            EvaluationCategoryData?.map(
                                                (
                                                    category: EvaluationCategoryData
                                                ) => (
                                                    <SelectItem
                                                        key={category?.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                )
                                            )
                                        )}
                                    </SelectContent> */}
                            </Select>
                        </div>
                    </div>

                    <h2 className="text-center my-10 text-yellow-500">
                        Management System (Assess every 6 months; first visit at
                        the beginning of the FY and first visit after SAPR)
                    </h2>

                    {isCriteriaLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="grid grid-cols-3 gap-5 bg-gray-100 p-5 rounded-lg">
                            {criteria?.data.results.map(({ name, id }) => {
                                const isChecked = chosenCriterias?.find(
                                    (criteria) => criteria.id === id
                                );

                                return (
                                    <div className="flex items-center gap-3 shadow-sm bg-white p-5 border rounded-lg">
                                        <Checkbox
                                            checked={isChecked ? true : false}
                                            onCheckedChange={(value) => {
                                                handleChangeCheck(
                                                    value,
                                                    name,
                                                    id
                                                );
                                            }}
                                            value={id}
                                        />
                                        <h4>{name}</h4>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
                <div className="flex justify-end w-full my-5">
                    <div className="flex items-center gap-x-4">
                        <p className="text-sm font-medium text-primary">
                            {/* {chosenCriterias?.length} Criteria Selected */}
                        </p>
                        <FormButton type="submit">Save & Continue</FormButton>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ChecklistModal;
